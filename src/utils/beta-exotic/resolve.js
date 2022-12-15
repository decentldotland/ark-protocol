import { SOLANA_BETA_REGISTRY } from "../constants.js";

export async function betaResolve(network) {
  switch (network) {
    case "SOLANA-MAINNET":
      return SOLANA_BETA_REGISTRY;
    default:
      return SOLANA_BETA_REGISTRY;
  }
}
