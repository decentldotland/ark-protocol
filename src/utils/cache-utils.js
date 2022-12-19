import {
  EXM_ARK_CONTRACT,
  ETH_ORACLE_ADDRESS,
  AURORA_TESTNET_ADDRESS,
  BSC_TESTNET_ADDRESS,
  BSC_MAINNET_ADDRESS,
  AVAX_FUJI_TESTNET_ADDRESS,
  AVALANCHE_MAINNET_ADDRESS,
  NEON_DEVNET_ADDRESS,
  FTM_MAINNET_ADDRESS,
  OPTIMISM_MAINNET_ADDRESS,
  ARBITRUM_MAINNET_ADDRESS,
  POLYGON_MAINNET_ADDRESS,
  NEAR_MAINNET_ADDRESS,
  EVMOS_MAINNET_ADDRESS,
  NEAR_TESTNET_ARK_ORACLE,
  SOLANA_BETA_REGISTRY,
  TRON_BETA_REGISTRY,
} from "./constants.js";
import { evaluateOracleState } from "./arweave/exm-rwx.js";
import base64url from "base64url";

export async function getOracleState() {
  try {
    const state = await evaluateOracleState();

    if (!state) {
      return base64url(`{}`);
    }
    const res = base64url(JSON.stringify({ res: state.identities }));

    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getStats() {
  try {
    const state = await evaluateOracleState();
    console.log(state)

    const users_count = state?.identities
      ? state?.identities?.filter((usr) => usr.is_verified).length
      : "pending";

    return {
      users_count
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getNetworkAddresses() {
  try {
    const state = await evaluateOracleState();

    return {
      master_oracle: {
        addr: EXM_ARK_CONTRACT,
        network: "exm-mainnet",
      },
      eth_oracle_addr: {
        addr: ETH_ORACLE_ADDRESS,
        network: "goerli&&mainnet",
      },
      aurora_oracle_addr: {
        addr: AURORA_TESTNET_ADDRESS,
        network: "aurora-testnet",
      },
      bsc_oracle_addr: {
        addr: BSC_MAINNET_ADDRESS,
        network: "bsc-mainnet",
      },
      avalanche_oracle_addr: {
        addr: AVALANCHE_MAINNET_ADDRESS,
        network: "avax-c-chain",
      },
      ftm_oracle_addr: {
        addr: FTM_MAINNET_ADDRESS,
        network: "ftm-mainnet",
      },
      optimism_oracle_addr: {
        addr: OPTIMISM_MAINNET_ADDRESS,
        network: "optimism-mainnet",
      },
      arbitrum_oracle_addr: {
        addr: ARBITRUM_MAINNET_ADDRESS,
        network: "arbitrum-one",
      },
      polygon_oracle_addr: {
        addr: POLYGON_MAINNET_ADDRESS,
        network: "polygon-mainnet",
      },
      evmos_mainnet_addr: {
        addr: EVMOS_MAINNET_ADDRESS,
        network: "evmos-mainnet",
      },
      near_mainnet_addr: {
        addr: NEAR_MAINNET_ADDRESS,
        network: "near-mainnet",
      },
      near_testnet_ark_oracle: {
        addr: NEAR_TESTNET_ARK_ORACLE,
        network: "near-testnet",
      },
      solana_oracle_address: {
        addr: SOLANA_BETA_REGISTRY,
        network: "exm-mainnet",
      },
      tron_oracle_address: {
        addr: TRON_BETA_REGISTRY,
        network: "exm-mainnet",
      },
      neon_devnet_oracle_addr: {
        addr: NEON_DEVNET_ADDRESS,
        network: "neon-devnet",
      },
    };
  } catch (error) {
    console.log(error);
  }
}

