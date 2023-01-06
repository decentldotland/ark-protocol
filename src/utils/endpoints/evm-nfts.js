import { evaluateOracleState } from "../arweave/exm-rwx.js";
import { getEvmosNfts, getMoralisHybrid } from "../server-utils.js";
import { getAddrCheckSum } from "../evm/web3.js";
import base64url from "base64url";

export async function evmHybridNfts(network, evm_network, address, ignorePaywalls) {
  try {
    let userProfile;
    let responseProfile = [];
    const state = (await evaluateOracleState())?.identities;
    if (!state) {
      return "e30";
    }

    if (!["arweave", "evm", "exotic"].includes(network)) {
      return "e30";
    }

    if (network === "arweave") {
      userProfile = state.find(
        (user) =>
          user["arweave_address"].toUpperCase() === address.toUpperCase() &&
          !!user.is_verified
      );
    } else {
      userProfile = state.find(
        (user) => user["primary_address"] === address && !!user.is_verified
      );
    }

    if (!userProfile) {
      return "e30";
    }

    const verifiedEvmAddresses = userProfile.addresses.filter(
      (addr) => !!addr.is_verified && addr.ark_key === "EVM"
    );

    for (const linkage of verifiedEvmAddresses) {
      {
        const address = await getAddrCheckSum(linkage.address);
        if (evm_network.toLowerCase() !== "evmos") {
          const nftsErc = await getMoralisHybrid(address, evm_network, ignorePaywalls);
          responseProfile = responseProfile.concat(nftsErc);
        } else {
          const evmosNfts = await getEvmosNfts(address);
          responseProfile = responseProfile.concat(evmosNfts);
        }
      }
    }

    responseProfile.flat();

    return base64url(JSON.stringify(responseProfile));
  } catch (error) {
    console.log(error);
    return "e30";
  }
}
