import { evaluateOracleState } from "./arweave/exm-rwx.js";
import {
  ANS_CACHE_API,
  SERVER_ETH_RPC,
  AVALANCHE_MAINNET_RPC,
  EVMOS_MAINNET_RPC,
  URBIT_ID_CONTRACT,
  LENS_LPP_CONTRACT,
  BYZANTION_QUERY,
} from "./constants.js";
import { getUserRegistrationTimestamp } from "./arweave/graphql.js";
import { getAddrCheckSum } from "./evm/web3.js";
import { getWeaveAggregator } from "weave-aggregator";
import { ethers } from "ethers";
import { isVouched } from "vouchdao";
import { Indexer } from "crossbell.js";
import AVVY from "@avvy/client";
import ENS from "@evmosdomains/sdk";
import getName from "@evmosdomains/sdk";
import axios from "axios";
import base64url from "base64url";
import "./setEnv.js";

export async function getArkProfile(network, address) {
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
    userProfile.EXOTIC = {};

    const verifiedEvmAddresses = userProfile.addresses.filter((addr) => !!addr.is_verified && addr.ark_key === "EVM");
    const verifiedExoticAddresses = userProfile.addresses.filter((addr) => !!addr.is_verified && addr.ark_key === "EXOTIC" && addr.network === "NEAR-MAINNET");

    const koiiNfts = await getKoiiNfts(userProfile.arweave_address);
    const permapagesNfts = await getPermaPagesNfts(userProfile.arweave_address);
    
    // ARWEAVE METADATA
    userProfile.ARWEAVE.ANS = await getAnsProfile(userProfile.arweave_address);
    userProfile.ARWEAVE.IS_VOUCHED = await isVouched(userProfile.arweave_address);
    userProfile.ARWEAVE.ANFTS =
      koiiNfts.length > 0 || permapagesNfts.length > 0
        ? { koii: koiiNfts, permapages_img: permapagesNfts }
        : {};
    userProfile.ARWEAVE.ARWEAVE_TRANSACTIONS = await retrieveArtransactions(
      userProfile.arweave_address
    );
    userProfile.ARWEAVE.STAMPS = await getPermaPagesStamps(userProfile.arweave_address);

    for (const address of verifiedEvmAddresses) {
      const addr = await getAddrCheckSum(address.address);
      userProfile.EVM[addr] = {}
      const addressMetadata = userProfile.EVM[addr];

      const ercNfts = await getMoralisNfts(addr);
      const evmosNfts = await getEvmosNfts(addr);

      addressMetadata.ENS = await getEnsProfile(addr);
      addressMetadata.AVVY = await getAvvyProfile(addr);
      addressMetadata.LINAGEE = await getLinageeDomains(addr);
      addressMetadata.EVMOS = await getEvmosProfile(addr);
        
      addressMetadata.LENS_HANDLES = await getLensHandles(addr);
      addressMetadata.GITPOAPS = await getGitPoaps(addr);
      addressMetadata.POAPS = await getAllPoaps(addr);
      addressMetadata.ERC_NFTS = ercNfts;
      addressMetadata.EVMOS_NFTS = evmosNfts;
      addressMetadata.URBIT_IDS = ercNfts.filter(
          (nft) => nft.token_address == URBIT_ID_CONTRACT
        );
      addressMetadata.LENS_PROTOCOLS_ACTV = await getLensProtocolsActv(addr);
      addressMetadata.RSS3 = await getRss3Profile(addr);
      addressMetadata.GALAXY_CREDS = await getGalaxyCreds(addr);
      addressMetadata.CROSSBELL_HANDLES = await getCrossbellsOf(addr);
    }

    for (const address of verifiedExoticAddresses) {
      const addr = address.address
      userProfile.EXOTIC[addr] = {};
      const addressMetadata = userProfile.EXOTIC[addr];

      userProfile.NFTS = await getNearNfts(addr);
    }

    // await retrievNearTransaction(userProfile);

    return base64url(JSON.stringify({ res: userProfile }));
  } catch (error) {
    console.log(error);
    return "e30";
  }
}

// helper functions
async function getAnsProfile(arweave_address) {
  try {
    const domains = (await axios.get(ANS_CACHE_API))?.data;
    if (!domains) {
      return false;
    }
    const profile = domains.res.find((usr) => usr.user === arweave_address);
    const res = profile ? profile : false;

    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getEnsProfile(eth_address) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(SERVER_ETH_RPC);
    const domain = await provider.lookupAddress(eth_address);
    return domain;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getRss3Profile(eth_address) {
  try {
    const profileConfig = {
      method: "get",
      url: `https://pregod.rss3.dev/v1.1.0/profiles/${eth_address}?network=ethereum`,
      headers: {
        Accept: "application/json",
      },
    };

    const notesConfig = {
      method: "get",
      url: `https://pregod.rss3.dev/v1.1.0/notes/${eth_address}?refresh=true&limit=100&include_poap=true`,
      headers: {
        Accept: "application/json",
      },
    };

    const res1 = (await axios(profileConfig))?.data?.result;
    const res2 = (await axios(notesConfig))?.data?.result;

    if (res1.length > 0) {
      return {
        profile: res1,
        transactions: res2,
      };
    }

    return { transactions: res2 };
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getCrossbellsOf(evm_address) {
  try {
    const res = [];
    const indexer = new Indexer();

    const characters = await indexer.getCharacters(evm_address);

    for (const character of characters?.list) {
      res.push({
        handle: character?.handle,
        metadata: character?.metadata,
        primary: character?.primary,
      });
    }

    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getLensProtocolsActv(eth_address) {
  try {
    const activities = {
      method: "get",
      url: `https://pregod.rss3.dev/v1/notes/${eth_address}?tag=social&network=polygon`,
      headers: {
        Accept: "application/json",
      },
    };

    const res = (await axios(activities))?.data?.result;

    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function getAvvyProfile(evm_address) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      AVALANCHE_MAINNET_RPC
    );
    const avvy = new AVVY(provider);
    const hash = await avvy.reverse(AVVY.RECORDS.EVM, evm_address);
    const name = await hash.lookup();
    return name.name;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getEvmosProfile(evm_address) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      EVMOS_MAINNET_RPC
    );
    const evmos = new ENS.default({
      provider,
      ensAddress: ENS.getEnsAddress("9001"),
    });

    const domain = await evmos.getName(evm_address);
    return domain?.name;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getKoiiNfts(arweave_address) {
  try {
    const nfts = await getWeaveAggregator("koii", arweave_address);
    return nfts;
  } catch (error) {
    return [];
  }
}

async function getEvmosNfts(evm_address) {
  try {
    const req = (
      await axios.get(
        `https://api.covalenthq.com/v1/9001/address/${evm_address}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=${process.env.COVALENT_API_KEY}`
      )
    )?.data;
    const nfts = req?.data?.items?.filter((item) => item.type === "nft");

    for (const nft of nfts) {
      const keepKeys = [
        "contract_decimals",
        "nft_data",
        "contract_name",
        "contract_ticker_symbol",
        "contract_address",
      ];
      for (const key of Object.keys(nft)) {
        !keepKeys.includes(key) ? delete nft[key] : void 0;
      }
      nft.token_id = nft?.nft_data?.[0]?.token_id;
      nft.balance = nft?.nft_data?.[0]?.token_balance;
      nft.name = nft?.nft_data?.[0]?.external_data?.name;
      nft.description = nft?.nft_data?.[0]?.external_data?.description;
      nft.image = nft?.nft_data?.[0]?.external_data?.image_512;

      delete nft?.nft_data;
    }
    return nfts;
  } catch (error) {
    return [];
  }
}

async function getPermaPagesNfts(arweave_address) {
  try {
    const nfts = await getWeaveAggregator("permapages-img", arweave_address);
    return nfts;
  } catch (error) {
    return [];
  }
}

async function getPermaPagesStamps(arweave_address) {
  try {
    const nfts = await getWeaveAggregator("permapages-stamps", arweave_address);
    return nfts;
  } catch (error) {
    return [];
  }
}

async function getAllPoaps(evm_address) {
  try {
    const API_KEY = process.env.POAP_API_KEY;
    const res = await axios.get(
      `https://api.poap.tech/actions/scan/${evm_address}`,
      {
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
      }
    );
    return res?.data;
  } catch (error) {
    return null;
  }
}

async function getGitPoaps(evm_address) {
  try {
    const ownedGitpoaps = (
      await axios.get(
        `https://public-api.gitpoap.io/v1/address/${evm_address}/gitpoaps`
      )
    )?.data;

    return ownedGitpoaps;
  } catch (error) {
    return [];
  }
}

async function retrieveArtransactions(arweave_address) {
  try {
    const q = {
      query: `query {
  transactions(
  owners: ["${arweave_address}"],
    first: 25
  ) {
    edges {
      node {
        id
        owner { address }
        tags { name value }
        block { timestamp }

      }
    }
  }
}`,
    };
    const response = await axios.post("https://arweave.net/graphql", q, {
      headers: { "Content-Type": "application/json" },
    });

    const transactions = [];

    const res_arr = response.data.data.transactions.edges;

    for (let element of res_arr) {
      const tx = element["node"];
      transactions.push({
        txid: tx.id,
        // pending transactions do not have block value
        timestamp: tx.block ? tx.block.timestamp : Date.now(),
        tags: tx.tags ? tx.tags : [],
      });
    }
    return transactions;
  } catch (error) {
    return [];
  }
}


async function retrievNearTransaction(userProfile) {
  try {
    for (const identity of userProfile.exotic_addresses) {
      if (identity.ver_req_network === "NEAR-MAINNET" && identity.is_verified) {
        const transactions = (
          await axios.get(
            `https://nearblocks.io/api/account/txns?address=${identity.exotic_address}&limit=10&offset=0`
          )
        )?.data;
        identity.NEAR_TRANSACTIONS = transactions;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getMoralisNfts(evm_address) {
  try {
    const res = (
      await axios.get(
        `https://deep-index.moralis.io/api/v2/${evm_address}/nft?chain=eth&format=decimal`,
        {
          headers: {
            Accept: "application/json",
            "X-API-Key": process.env.MORALIS_API_KEY,
          },
        }
      )
    )?.data;
    return res?.result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getLensHandles(evm_address) {
  try {
    const res = (
      await axios.get(
        `https://deep-index.moralis.io/api/v2/${evm_address}/nft?chain=polygon&format=decimal`,
        {
          headers: {
            Accept: "application/json",
            "X-API-Key": process.env.MORALIS_API_KEY,
          },
        }
      )
    )?.data;
    const handles = res?.result.filter(
      (nft) => nft.token_address == LENS_LPP_CONTRACT
    );
    if (handles.length) {
      return handles.map((handle) => JSON.parse(handle.metadata)?.name);
    }

    return handles;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getLinageeDomains(address) {
  try {
    const options = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: "eth",
        format: "decimal",
        token_addresses: "0x2cc8342d7c8bff5a213eb2cde39de9a59b3461a7",
      },
      headers: { accept: "application/json", "X-API-Key": process.env.MORALIS_API_KEY },
    };

    const res = await axios.request(options);

    for (const domain of res?.data?.result) {
      domain.open_sea_url = `https://opensea.io/assets/ethereum/0x2cc8342d7c8bff5a213eb2cde39de9a59b3461a7/${domain.token_id}`;
      // delete unnecessay metadata
      delete domain.token_uri;
      delete domain.metadata;
      delete domain.last_token_uri_sync;
      delete domain.last_metadata_sync;
    }
    return res?.data?.result;
  } catch (error) {
    console.log(error);
    return [];
  }
}


async function getGalaxyCreds(address) {
  try {
    const q = {
      query: `query userCredentials {
  addressInfo(address: "${address}") {
    id
    avatar
    username
    eligibleCredentials(first: 1000, after: "") {
      list {
        id
        name
      }
    }
  }
}`,
    };
    const res = (
      await axios.post("https://graphigo.prd.galaxy.eco/query", q, {
        headers: { "Content-Type": "application/json" },
      })
    )?.data;

    return res?.data?.addressInfo;
  } catch (error) {
    return null;
  }
}

async function makeByzantionQuery(operationsDoc, operationName, variables) {
  const result = await fetch("https://byz-graphql-02.hasura.app/v1/graphql", {
    method: "POST",
    headers: {
      "x-api-key": process.env.BYZANTION_API_KEY,
      "Hasura-Client-Name": "decent.land",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

function fetchNearNfts(where, limit, offset) {
  return makeByzantionQuery(BYZANTION_QUERY, "GET_OWNED_NFTS", {
    where: where,
    limit: limit,
    offset: offset,
  });
}

async function getNearNfts(address) {
  const { errors, data } = await fetchNearNfts(
    {
      nft_states: { owner: { _eq: address } },
    },
    50,
    0
  );

  if (errors) {
    console.log(errors);
    return [];
  }

  for (const nft of data?.nft_meta) {
    delete nft?.nft_states;
    delete nft?.bid_state_nft_meta;
  }

  return data?.nft_meta;
}
