import { evaluateOracleState } from "../arweave/exm-rwx.js";
import {
  getAnsProfile,
  getEnsProfile,
  getAvvyProfile,
  getLensHandles,
  getEvmosProfile,
  getMoralisNfts,
  getArns,
} from "../server-utils.js";
import { URBIT_ID_CONTRACT } from "../constants.js";
import { getAddrCheckSum } from "../evm/web3.js";
import base64url from "base64url";

export async function getDomainsOf(network, address) {
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
    const primaryAns = (await getAnsProfile(userProfile.arweave_address))
      ?.currentLabel;
    const anrsRecord = await getArns(userProfile.arweave_address);
    responseProfile.ANS = [primaryAns ? `${primaryAns}.ar` : null];
    responseProfile.ARNS = anrsRecord ? `${anrsRecord}.arweave.dev` : null;
    responseProfile.NEAR = verifiedNearAddresses
      .filter((addr) => addr?.address?.endsWith(".near"))
      .map((addr) => addr.address);
    responseProfile.ENS = [];
    responseProfile.EVMOS = [];
    responseProfile.AVVY = [];
    responseProfile.LENS = [];
    responseProfile.URBIT = [];

    for (const linkage of verifiedEvmAddresses) {
      const address = await getAddrCheckSum(linkage.address);

      const ens = await getEnsProfile(address);
      const evmos = await getEvmosProfile(address);
      const avvy = await getAvvyProfile(address);
      const lens = await getLensHandles(address);
      const urbit = (await getMoralisNfts(address))?.filter(
        (nft) => nft.token_address === URBIT_ID_CONTRACT
      );

      ens ? responseProfile.ENS.push(ens) : void 0;
      evmos ? responseProfile.EVMOS.push(evmos) : void 0;
      avvy ? responseProfile.AVVY.push(avvy) : void 0;
      urbit.length ? responseProfile.URBIT.push(urbit) : void 0;

      if (lens.length) {
        responseProfile.LENS.push(lens);
        responseProfile.LENS = Array.from(new Set(responseProfile.LENS.flat()));
      }

      if (urbit.length) {
        responseProfile.URBIT = urbit.map(
          (id) => JSON.parse(id?.metadata)?.name
        );
      }
    }

    return base64url(JSON.stringify(responseProfile));
  } catch (error) {
    console.log(error);
    return "e30";
  }
}
