import "./setEnv.js";

export const ARWEAVE_ORACLE_ADDRESS = `5H5Hj81G5j5P2raDhe5VFU-zkf08KDc588GJ8dtlHTw`; // v0.0.9 (exotic hybrid)
// export const EXM_ARK_CONTRACT = `wyfTGnKv6uAE3epxc2kYFum-9b9WDbiEgujiheO6G2M`;
// export const EXM_ARK_CONTRACT = `FUsocdnUnwXRLoQGd1gvGwp0oUmNzqLbkuVG0zC-nwc`
export const EXM_ARK_CONTRACT = `Z7JzRRt2iTQWV5LziNhTV6SP51tVKkCf_qrUqtlwzpg`;
// EVM ADDRESSES
export const ETH_ORACLE_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`; // Goerli Testnet && ETH Mainnet
export const AURORA_TESTNET_ADDRESS = `0xfb0200C27185185D7DEe0403D5f102ADb59B7c34`;
export const BSC_TESTNET_ADDRESS = `0x90f36C4Fc09a2AD3B62Cc6F5f2BCC769aFAcB70d`;
export const AVAX_FUJI_TESTNET_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`;
export const NEON_DEVNET_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`;
export const AVALANCHE_MAINNET_ADDRESS = `0xE5E0A3380811aD9380F91a6996529da0a262EcD1`;
export const BSC_MAINNET_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`;
export const FTM_MAINNET_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`;
export const OPTIMISM_MAINNET_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`;
export const ARBITRUM_MAINNET_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`;
export const POLYGON_MAINNET_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`;
export const EVMOS_MAINNET_ADDRESS = `0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A`;
export const NEAR_MAINNET_ADDRESS = `ark_station_1.near`;
export const NEAR_TESTNET_ARK_ORACLE = `dev-1660516310576-97373428914255`;
export const SOLANA_BETA_REGISTRY = `Wg_78ViU6IkxpKnAJGMpGlXd7u_QmCsHIo3kFGKek8M`;
export const TRON_BETA_REGISTRY = `AMCEh5wYyBfQ5Y_lxpOn6Fp_O4JqDVOPU_swvednJII`;

export const EVM_ORACLES_CONTRACTS = [
  ETH_ORACLE_ADDRESS,
  AURORA_TESTNET_ADDRESS,
  BSC_TESTNET_ADDRESS,
  AVAX_FUJI_TESTNET_ADDRESS,
  NEON_DEVNET_ADDRESS,
  AVALANCHE_MAINNET_ADDRESS,
  BSC_MAINNET_ADDRESS,
  FTM_MAINNET_ADDRESS,
  OPTIMISM_MAINNET_ADDRESS,
  ARBITRUM_MAINNET_ADDRESS,
  EVMOS_MAINNET_ADDRESS,
];

// RPCs
export const RPC_PROVIDER_URL = `http://127.0.0.1:9545/`;
export const GOERLI_ETH_RPC = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`;
export const MAINNET_ETH_RPC = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
export const AURORA_TESTNET_RPC = `https://aurora-testnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
export const BSC_TESTNET_RPC = `https://data-seed-prebsc-1-s1.binance.org:8545/`;
export const BSC_MAINNET_RPC = `https://bsc-dataseed.binance.org`;
export const FUJI_TESTNET_RPC = `https://api.avax-test.network/ext/bc/C/rpc`;
export const AVALANCHE_MAINNET_RPC = `https://api.avax.network/ext/bc/C/rpc`;
export const NEON_DEVNET_RPC = `https://proxy.devnet.neonlabs.org/solana`;
export const FTM_MAINNET_RPC = `https://rpc.ftm.tools/`;
export const OPTIMISM_MAINNET_RPC = `https://mainnet.optimism.io`;
export const ARBITRUM_MAINNET_RPC = `https://arb1.arbitrum.io/rpc`;
export const POLYGON_MAINNET_RPC = `https://polygon-rpc.com`;
export const EVMOS_MAINNET_RPC = `https://eth.bd.evmos.org:8545`;
export const RPC_PORT = 9545;

// APIs
export const ANS_CACHE_API = `https://ans-stats.decent.land/users`;
export const SERVER_ETH_RPC = `https://cloudflare-eth.com`;

// UTILS
export const URBIT_ID_CONTRACT = `0x33eecbf908478c10614626a9d304bfe18b78dd73`;
export const LENS_LPP_CONTRACT = `0xdb46d1dc155634fbc732f92e853b10b288ad5a1d`;
export const MORALIS_NETWORKS = [
  "eth",
  "fantom",
  "polygon",
  "avalanche",
  "bsc",
];

// GraphQL
export const BYZANTION_QUERY = `
  query GET_OWNED_NFTS($where: nft_meta_bool_exp!, $limit: Int!, $offset: Int!, $order_by: [nft_meta_order_by!]) {
    nft_meta(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
      id
      token_id
      name
      image
      ranking
      rarity
      collection {
        title
        slug
      }
      nft_states {
        nft_state_lists(
          where: {listed: {_eq: true}}
          order_by: {list_price: asc}
          limit: 1
        ) {
          list_price
          list_price_str
          list_seller
          listed
          updated_at
          list_block_datetime
          function_args
          list_contract {
            contract_key
            name
          }
        }
      }
      bid_state_nft_meta(where: {bid_state: {status: {_eq: "active"}}}) {
        bid_state {
          bid_buyer
          bid_price
          bid_price_str
          bid_seller
          bid_type
        }
      }
    }
  }
`;
