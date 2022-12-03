import { evaluateOracleState } from "../arweave/exm-rwx.js";
import {
  getAnsProfile,
  getEnsProfile,
  getAvvyProfile,
  getLensHandles,
  getEvmosProfile,
  getEvmosNfts,
  getAllPoaps,
  getMoralisNfts,
  getNearNfts,
} from "../server-utils.js";
import { getAddrCheckSum } from "../evm/web3.js";
import base64url from "base64url";

export async function getSoArkData(network, address) {
  try {
    let userProfile;
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
    const primaryAns = (await getAnsProfile(userProfile.arweave_address))
      ?.currentLabel;
    userProfile.ANS = primaryAns ? `${primaryAns}.ar` : null;

    for (const linkage of verifiedEvmAddresses) {
      const address = await getAddrCheckSum(linkage.address);
      userProfile[address] = {};
      const nestedProfile = userProfile[address];
      nestedProfile.DOMAINS = {};
      nestedProfile.NFTS = {};

      nestedProfile.DOMAINS.ENS = await getEnsProfile(address);
      nestedProfile.DOMAINS.EVMOS = await getEvmosProfile(address);
      nestedProfile.DOMAINS.AVVY = await getAvvyProfile(address);
      nestedProfile.DOMAINS.LENS = await getLensHandles(address);
      nestedProfile.NFTS.ERC = await getMoralisNfts(address);
      nestedProfile.NFTS.EVMOS = await getEvmosNfts(address);
    }

    for (const linking of verifiedNearAddresses) {
      const address = linking.address;
      userProfile[address] = {};
      userProfile[address].NFTS = await getNearNfts(address);
    }

    return base64url(JSON.stringify({ res: userProfile }));
  } catch (error) {
    console.log(error);
    return "e30";
  }
}
