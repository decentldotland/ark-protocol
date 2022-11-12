import nearAPI from "near-api-js";
import { evaluateOracleState } from "../arweave/exm-rwx.js";
import { NEAR_TESTNET_ARK_ORACLE } from "../constants.js";
const { connect, Contract, KeyPair, keyStores } = nearAPI;
import "../setEnv.js";

async function tesnetNetConfig() {
  const keyStore = new keyStores.InMemoryKeyStore();
  const keyPair = KeyPair.fromString(process.env.NEAR_TESTNET_PK);
  await keyStore.setKey("testnet", "decentland.testnet", keyPair);

  return {
    networkId: "testnet",
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
}

export async function mirrorStateToNear(ar_addr) {
  try {
    const currentNearState = await readNearOracleState();
    const userObject = await getUserObject(ar_addr);

    const identityExistence = currentNearState.findIndex(
      (identity) => identity.arweave_address === userObject?.arweave_address
    );

    // if user already exist in the near oracle
    // state, then update the state, if not, append
    // the user's identity.

    if (identityExistence === -1) {
      await addUserIndentityNear(userObject);
      return;
    }

    await updateUserIndentityNear(userObject);
    return;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function readNearOracleState() {
  try {
    const connectionConfig = await tesnetNetConfig();
    const near = await connect(connectionConfig);
    const account = await near.account("decentland.testnet");
    const methodOptions = {
      changeMethods: ["readArkState"],
    };
    const contract = new Contract(
      account,
      NEAR_TESTNET_ARK_ORACLE,
      methodOptions
    );

    const state = await contract.readArkState();

    return state;
  } catch (error) {
    console.log(error);
  }
}

async function updateUserIndentityNear(newIdentity) {
  const connectionConfig = await tesnetNetConfig();
  const near = await connect(connectionConfig);
  const account = await near.account("decentland.testnet");
  const methodOptions = {
    changeMethods: ["update_ark_user_identity"],
  };
  const contract = new Contract(
    account,
    NEAR_TESTNET_ARK_ORACLE,
    methodOptions
  );

  await contract.update_ark_user_identity({
    meta: "update identity",
    args: { updatedIdentity: newIdentity },
  });
}

async function addUserIndentityNear(newIdentity) {
  const connectionConfig = await tesnetNetConfig();
  const near = await connect(connectionConfig);
  const account = await near.account("decentland.testnet");
  const methodOptions = {
    changeMethods: ["append_user_identity"],
  };
  const contract = new Contract(
    account,
    NEAR_TESTNET_ARK_ORACLE,
    methodOptions
  );

  await contract.append_user_identity({
    meta: "append identity",
    args: { identity: newIdentity },
  });
}

// UTILS
async function getUserObject(arweave_address) {
  try {
    const arkState = (await evaluateOracleState())?.identities;
    const identity = arkState.find((id) => (id.arweave_address === arweave_address) && id.is_verified);

    return identity;
  } catch (error) {
    console.log(error);
  }
}
