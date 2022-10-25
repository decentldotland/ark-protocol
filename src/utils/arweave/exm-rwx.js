import { Exm } from "@execution-machine/sdk";
import { EXM_ARK_CONTRACT } from "../constants.js";
import { red, green } from "../chalk.js";
import "../setEnv.js";

const exmInstance = new Exm({ token: process.env.EXM_TOKEN_ID });

export async function evaluateOracleState() {
  try {
    const state = await exmInstance.functions.read(EXM_ARK_CONTRACT);
    return state;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function writeEvaluation(
  arweave_address,
  evaluated_address,
  evaluation,
  network
) {
  try {
    const inputs = [{ function: "evaluate", arweave_address: arweave_address, evaluated_address: evaluated_address, evaluation: evaluation }];
    const interaction = await exmInstance.functions.write(
      EXM_ARK_CONTRACT,
      inputs
    );
    if (interaction.status === "SUCCESS") {
      await logEvalResult(
        arweave_address,
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
