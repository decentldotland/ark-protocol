import { Exm } from "@execution-machine/sdk";
import { getTransaction } from "../evm/ethers.js";
import { checkTopicAgainstAddress } from "../evm/web3.js";
import { EVM_ORACLES_CONTRACTS, EXM_ARK_CONTRACT } from "../constants.js";
import { evaluateOracleState, writeEvaluation } from "./exm-rwx.js";
import { red, green } from "../chalk.js";
import { canBeVerifiedNear } from "../near/config.js";
import { mirrorStateToNear } from "../near/ark-oracle-utils.js";
import { resolveNetworkKey } from "../evm/ethers.js";
import { sleep } from  "../polling.js";
import "../setEnv.js";

export async function checkAndVerifyUser(userObject) {
  try {
    const {
      arweave_address,
      primary_address,
      unevaluated_addresses,
      addresses,
      did,
    } = userObject;

    if (!unevaluated_addresses.length) {
      console.log(green(`\nall addresses for ${did} have been evaluated\n`));
      return;
    }

    const toEvaluateAddresses = addresses.filter((addr) =>
      unevaluated_addresses.includes(addr.address)
    );

    for (const address of toEvaluateAddresses) {
      const exmNetKey = (await resolveNetworkKey(address.network))?.EXM_KEY;

      if (exmNetKey === "EVM") {
        const evmVerificationReq = await getTransaction(
          address.verification_req,
          address.network
        );
        if (!EVM_ORACLES_CONTRACTS.includes(evmVerificationReq.to)) {
          await writeEvaluation(arweave_address, address.address, false, address.network);
        }

        const hashedArAddressLog = evmVerificationReq.logs[0].topics[2];

        const validity = await checkTopicAgainstAddress(
          hashedArAddressLog,
          arweave_address
        );

        const identityValidity = validity.is_equal ? true : false;

        await writeEvaluation(
          arweave_address,
          address.address,
          identityValidity,
          address.network
        );

        await sleep(10);
        await mirrorStateToNear(arweave_address);
      }

      if (exmNetKey === "EXOTIC") {
        // NEAR-MAINNET is the only exotic network as per now
        const isVerifiable = await canBeVerifiedNear({
          arweave_address: arweave_address,
          verificationReq: address.verification_req,
          exotic_address: address.address,
        });

        await writeEvaluation(
          arweave_address,
          address.address,
          isVerifiable,
          address.network
        );

        await sleep(10);
        await mirrorStateToNear(arweave_address);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
