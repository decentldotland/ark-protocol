import { evaluateOracleState } from "../arweave/exm-rwx.js";
import base64url from "base64url";

export async function resolveAddress(address) {
  try {
    let userProfile;
    const state = (await evaluateOracleState())?.identities;
    if (!state) {
      return "e30";
    }

    userProfile = state.find(
      (usr) => usr.arweave_address === address && usr.is_verified
    );
    if (!userProfile) {
      for (const identity of state) {
        const target = identity.addresses.find(
          (addr) => addr.address.toLowerCase() == address.toLowerCase()
        );
        if (target) {
          userProfile = identity;
        }
      }
    }
    return userProfile ? base64url(JSON.stringify(userProfile)) : "e30";
  } catch (error) {
    return "e30";
  }
}
