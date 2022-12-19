import { SOLANA_BETA_REGISTRY, TRON_BETA_REGISTRY } from "../constants.js";

export async function betaResolve(network) {
  switch (network) {
    case "SOLANA-MAINNET":
      return SOLANA_BETA_REGISTRY;
    case "TRON-MAINNET":
        return TRON_BETA_REGISTRY;
    default:
      return SOLANA_BETA_REGISTRY;
  }
}
