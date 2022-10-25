import { getLastInteractionBlock } from "./arweave/graphql.js";
import { getArweaveBlock } from "./arweave/network.js";
import { checkAndVerifyUser } from "./arweave/smartweave.js";
import { evaluateOracleState } from "./arweave/exm-rwx.js";
import NodeCache from "node-cache";
import base64url from "base64url";
import sha256 from "sha256";


export async function runPolling() {
  try {
      const oracleState = await evaluateOracleState();
      const filteredState = await _filterState(oracleState);

      for (const user of filteredState) {
        await checkAndVerifyUser(user);
      }

      await sleep(20)
  } catch (error) {
    console.log(error);
  }
}


async function _filterState(state) {
  // filter evaluated users
  try {
    const filteredUsers = state.identities.filter(
      (user) => user.unevaluated_addresses.length
    );

    return filteredUsers;
  } catch (error) {
    console.log(error);
  }
}

export async function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s*1e3));
    }
