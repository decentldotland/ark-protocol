import { evaluateOracleState } from "../arweave/exm-rwx.js";
import {
  getAnsProfile,
  getArns,
  retrieveArtransactions,
  getPermaPagesStamps,
  getGitPoaps,
  getAllPoaps,
  getLensProtocolsActv,
  getRss3Profile,
  getGalaxyCreds,
  getCrossbellsOf,
} from "../server-utils.js";
import { getAddrCheckSum } from "../evm/web3.js";
import { isVouched } from "vouchdao";
import base64url from "base64url";

export async function getProfileMetadata(network, address) {
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

    userProfile.ARWEAVE = {};
    userProfile.EVM = {};

    const verifiedEvmAddresses = userProfile.addresses.filter(
      (addr) => !!addr.is_verified && addr.ark_key === "EVM"
    );

    const arnsDomain = await getArns(userProfile.arweave_address);

    // ARWEAVE METADATA
    userProfile.ARWEAVE.ANS = await getAnsProfile(userProfile.arweave_address);
    userProfile.ARWEAVE.IS_VOUCHED = await isVouched(
      userProfile.arweave_address
    );
    userProfile.ARWEAVE.ARNS = arnsDomain ? `${arnsDomain}.arweave.dev` : false;
    userProfile.ARWEAVE.ARWEAVE_TRANSACTIONS = await retrieveArtransactions(
      userProfile.arweave_address
    );
    userProfile.ARWEAVE.STAMPS = await getPermaPagesStamps(
      userProfile.arweave_address
    );

    for (const address of verifiedEvmAddresses) {
      const addr = await getAddrCheckSum(address.address);
      userProfile.EVM[addr] = {};
      const addressMetadata = userProfile.EVM[addr];

      addressMetadata.GITPOAPS = await getGitPoaps(addr);
      addressMetadata.POAPS = await getAllPoaps(addr);
      addressMetadata.LENS_PROTOCOLS_ACTV = await getLensProtocolsActv(addr);
      addressMetadata.RSS3 = await getRss3Profile(addr);
      addressMetadata.GALAXY_CREDS = await getGalaxyCreds(addr);
      addressMetadata.CROSSBELL_HANDLES = await getCrossbellsOf(addr);
    }

    return base64url(JSON.stringify({ res: userProfile }));
  } catch (error) {
    console.log(error);
    return "e30";
  }
}
