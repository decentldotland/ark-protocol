import { evaluateOracleState } from "../arweave/exm-rwx.js";
import {
  getNearNfts,
  getMoralisNfts,
  getEvmosNfts,
  getMoralisHybrid,
} from "../server-utils.js";
import { getAddrCheckSum } from "../evm/web3.js";
import base64url from "base64url";

export async function getNftsOf(network, address) {
  try {
    let userProfile;
    const responseProfile = {};
    const state = (await evaluateOracleState())?.identities;
    if (!state) {
      return "e30";
    }

    if (!["arweave", "evm", "exotic"].includes(network)) {
      return "e30";
    }

    if (network === "arweave") {
      userProfile = state.find(
        (user) => user["arweave_address"] === address && !!user.is_verified
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
    const verifiedNearAddresses = userProfile.addresses.filter(
      (addr) =>
        !!addr.is_verified &&
        addr.ark_key === "EXOTIC" &&
        addr.network === "NEAR-MAINNET"
    );
    responseProfile.EVM = [];
    responseProfile.NEAR = [];

    for (const linkage of verifiedEvmAddresses) {
      const address = await getAddrCheckSum(linkage.address);
      const nftsErc = await getMoralisHybrid(address, "eth");
      const nftsEvmos = await getEvmosNfts(address);
      const nftsFantom = await getMoralisHybrid(address, "fantom");
      const nftsBsc = await getMoralisHybrid(address, "bsc");
      const nftsAvax = await getMoralisHybrid(address, "avalanche");
      const nftsPolygon = await getMoralisHybrid(address, "polygon");
      responseProfile.EVM = responseProfile.EVM.concat(nftsErc)
        .concat(nftsEvmos)
        .concat(nftsFantom)
        .concat(nftsBsc)
        .concat(nftsAvax)
        .concat(nftsPolygon);
    }

    for (const linkage of verifiedNearAddresses) {
      const nfts = await getNearNfts(linkage.address);
      responseProfile.NEAR = responseProfile.NEAR.concat(nfts);
    }

    responseProfile.EVM.flat();
    responseProfile.NEAR.flat();

    return base64url(JSON.stringify(responseProfile));
  } catch (error) {
    console.log(error);
    return "e30";
  }
}
