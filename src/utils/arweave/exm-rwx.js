import { Exm } from "@execution-machine/sdk";
import { ownerToAddress } from "./network.js";
import { generateAdminSignature } from "./sign.js";
import { EXM_ARK_CONTRACT } from "../constants.js";
import { red, green } from "../chalk.js";
import "../setEnv.js";

const exmInstance = new Exm({ token: process.env.EXM_TOKEN_ID });
const ADMIN_JWK_N = (JSON.parse(process.env.ADMIN_JWK))?.n

export async function evaluateOracleState() {
  try {
    const state = await exmInstance.functions.read(EXM_ARK_CONTRACT);
    return state;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getAdminMessage() {
  try {
    const state = await evaluateOracleState();
    const messages = state.admin_sig_messages;
    console.log(messages)
    return messages[messages.length - 1];
  } catch(error) {
    return false;
  }
}

export async function writeEvaluation(
  user_pubkey,
  arweave_address,
  evaluated_address,
  evaluation,
  network
) {
  try {
    const adminSignature = await generateAdminSignature();
    if (!arweave_address) {
      arweave_address = await ownerToAddress(user_pubkey)
    }
    const inputs = [{ function: "evaluate", arweave_address: arweave_address, evaluated_address: evaluated_address, evaluation: evaluation, admin_jwk_n: ADMIN_JWK_N , admin_sig: adminSignature, user_pubkey: user_pubkey }];
    const interaction = await exmInstance.functions.write(
      EXM_ARK_CONTRACT,
      inputs
    );
    if (interaction.status === "SUCCESS") {
      await logEvalResult(
        user_pubkey,
        evaluated_address,
        network,
        evaluation,
        interaction?.data?.pseudoId
      );
      return interaction?.data?.pseudoId;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function logEvalResult(
  arweave_address,
  evaluated_address,
  network,
  validity,
  txid
) {
  if (validity) {
    console.log(
      green(
        `\n\n--> identity verified: ${arweave_address} <-> ${evaluated_address} || network: ${network}`
      )
    );
    console.log(
      green(
        `--> verified identity ID ${arweave_address} | EXM PseudoID: ${txid}\n\n`
      )
    );
  } else {
    console.log(
      red(
        `\n\n--> verification failed: ${arweave_address} <-> ${evaluated_address} || network: ${network}`
      )
    );
    console.log(
      red(
        `--> failed identity ID ${arweave_address} | failing verification EXM PseudoID: ${txid}\n\n`
      )
    );
  }
}
