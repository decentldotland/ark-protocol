import { evaluateOracleState } from "../arweave/exm-rwx.js";
import {
  getNearNfts,
  getKoiiNfts,
  getPermaPagesNfts,
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

    const verifiedNearAddresses = userProfile.addresses.filter(
      (addr) =>
        !!addr.is_verified &&
        addr.ark_key === "EXOTIC" &&
        addr.network === "NEAR-MAINNET"
    );

    const koiiNfts = await getKoiiNfts(userProfile.arweave_address);
    const permapagesNfts = await getPermaPagesNfts(userProfile.arweave_address);

    responseProfile.ARWEAVE = [].concat(koiiNfts).concat(permapagesNfts);
    responseProfile.NEAR = [];

    for (const linkage of verifiedNearAddresses) {
      const nfts = await getNearNfts(linkage.address);
      responseProfile.NEAR = responseProfile.NEAR.concat(nfts);
    }

    responseProfile.NEAR.flat();

    return base64url(JSON.stringify(responseProfile));
  } catch (error) {
    console.log(error);
    return "e30";
  }
}
