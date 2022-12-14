import { Exm } from "@execution-machine/sdk";
import { getTransaction } from "../evm/ethers.js";
import { checkTopicAgainstAddress } from "../evm/web3.js";
import { EVM_ORACLES_CONTRACTS, EXM_ARK_CONTRACT } from "../constants.js";
import {
  evaluateOracleState,
  writeEvaluation,
  getUserObject,
} from "./exm-rwx.js";
import { red, green } from "../chalk.js";
import { canBeVerifiedNear } from "../near/config.js";
import { mirrorStateToNear } from "../near/ark-oracle-utils.js";
import { resolveNetworkKey } from "../evm/ethers.js";
import { ownerToAddress } from "./network.js";
import { generateAdminSignature } from "./sign.js";
import { verifyBetaExotic } from "../beta-exotic/verify.js";
import { sleep } from "../polling.js";
import "../setEnv.js";

export async function checkAndVerifyUser(userObject) {
  try {
    const {
      public_key,
      arweave_address,
      primary_address,
      unevaluated_addresses,
      addresses,
    } = userObject;

    if (
      !unevaluated_addresses.length
    ) {
      console.log(
        green(`\nall addresses for ${public_key} have been evaluated\n`)
      );
      return;
    }

    const toEvaluateAddresses = addresses.filter((addr) =>
      unevaluated_addresses.includes(addr.address)
    );

    for (const address of toEvaluateAddresses) {
      const adminSignature = await generateAdminSignature();
      const exmNetKey = (await resolveNetworkKey(address.network))?.EXM_KEY;

      if (exmNetKey === "EVM") {
        const evmVerificationReq = await getTransaction(
          address.verification_req,
          address.network
        );
        if (!EVM_ORACLES_CONTRACTS.includes(evmVerificationReq?.to)) {
          await writeEvaluation(
            public_key,
            arweave_address,
            address.address,
            false,
            address.network
          );
        }

        const hashedArAddressLog = evmVerificationReq?.logs[0]?.topics[2];

        const resolvedArweaveAddr = await ownerToAddress(public_key);
        const validity = await checkTopicAgainstAddress(
          hashedArAddressLog,
          resolvedArweaveAddr
        );

        const identityValidity = validity.is_equal ? true : false;

        await writeEvaluation(
          public_key,
          arweave_address,
          address.address,
          identityValidity,
          address.network
        );

        await sleep(5);
        const lastUpdatedObject = await getUserObject(resolvedArweaveAddr);
        await mirrorStateToNear(lastUpdatedObject);
      }

      if (exmNetKey === "EXOTIC-NEAR") {
        const resolvedArweaveAddr = await ownerToAddress(public_key);
        const isVerifiable = await canBeVerifiedNear({
          arweave_address: resolvedArweaveAddr,
          verificationReq: address.verification_req,
          exotic_address: address.address,
          public_key: public_key,
        });

        await writeEvaluation(
          public_key,
          arweave_address,
          address.address,
          isVerifiable,
          address.network
        );

        await sleep(5);
        const lastUpdatedObject = await getUserObject(resolvedArweaveAddr);
        await mirrorStateToNear(lastUpdatedObject);
      }

      if (exmNetKey === "EXOTIC-SOLANA") {
        const resolvedArweaveAddr = await ownerToAddress(public_key);
        const isVerifiable = await verifyBetaExotic({
          network_key: address.network,
          arweave_address: resolvedArweaveAddr,
          signature: address.verification_req,
          exotic_address: address.address,
        });

        await writeEvaluation(
          public_key,
          arweave_address,
          address.address,
          isVerifiable,
          address.network
        );

        await sleep(5);
        const lastUpdatedObject = await getUserObject(resolvedArweaveAddr);
        await mirrorStateToNear(lastUpdatedObject);
      }
      
      if (exmNetKey === "EXOTIC-TRON") {
        const resolvedArweaveAddr = await ownerToAddress(public_key);
        const isVerifiable = await verifyBetaExotic({
          network_key: address.network,
          arweave_address: resolvedArweaveAddr,
          signature: address.verification_req,
          exotic_address: address.address,
        });

        await writeEvaluation(
          public_key,
          arweave_address,
          address.address,
          isVerifiable,
          address.network
        );

        await sleep(5);
        const lastUpdatedObject = await getUserObject(resolvedArweaveAddr);
        await mirrorStateToNear(lastUpdatedObject);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
