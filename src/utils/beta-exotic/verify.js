import { betaResolve } from "./resolve.js";
import axios from "axios";

export async function verifyBetaExotic({
  network_key,
  arweave_address,
  exotic_address,
  signature,
}) {
  try {
    const exoticRegistryAddr = await betaResolve(network_key);
    const state = (
      await axios.get(`https://api.exm.dev/read/${exoticRegistryAddr}`)
    )?.data;
    const linkageExistense = state?.identities?.find(
      (id) =>
        id.arweave_address === arweave_address &&
        id.address === exotic_address &&
        id.signature === signature
    );
    return !!linkageExistense;
  } catch (error) {
    return false;
  }
}
