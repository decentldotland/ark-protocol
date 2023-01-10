import { evaluateOracleState } from "../arweave/exm-rwx.js";
import { getGitPoaps, getAllPoaps, getGalaxyCreds } from "../server-utils.js";
import base64url from "base64url";

export async function getOatsOf(network, address) {
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
    responseProfile.GITPOAPS = [];
    responseProfile.POAPS = [];
    responseProfile.GALAXY_CREDS = [];

    for (const linkage of verifiedEvmAddresses) {
      const gitpoap = await getGitPoaps(linkage.address);
      const poap = await getAllPoaps(linkage.address);
      const oat = await getGalaxyCreds(linkage.address);

      responseProfile.GITPOAPS = responseProfile.GITPOAPS.concat(gitpoap);
      responseProfile.POAPS = responseProfile.POAPS.concat(poap);
      responseProfile.GALAXY_CREDS = responseProfile.GALAXY_CREDS.concat(oat);
    }

    responseProfile.GITPOAPS.flat();
    responseProfile.POAPS.flat();
    responseProfile.GALAXY_CREDS.flat();

    return base64url(JSON.stringify(responseProfile));
  } catch (error) {
    console.log(error);
    return "e30";
  }
}
