<p align="center">
  <a href="https://decent.land">
    <img src="./img/new-logo.png" height="200">
  </a>
  <h3 align="center"><code>@decentdotland/ark-protocol</code></h3>
  <p align="center">multi-chain identities linking protocol</p>
</p>

## Synopsis
Ark Protocol is a protocol designed for verified multichain addresses (identities) linking. The protocol consists of an oracle contract on [Arweave](https://arweave.org) network ([EXM Protocol](https://exm.dev)) and other data registry contracts deployed on several EVM (and non-EVM chains).

## Install & Run it

```sh
git clone https://github.com/decentldotland/ark-protocol.git

cd ark-network

npm install .

npm run polling
```

## Build Ark EVM Contract

The repository `ark-protocol` is built with ES6 syntax, therefore building with truffle is not compatible

### 1- Create a new directory
```sh

mkdir ark-deploy

cd ark-deploy

truffle init


```

### 2- Copy `/contracts` directory to `ark-deploy`

```sh
cp -r ark-protocol/contracts ark-deploy 

```

### 3- compile & migrate
Make sure to edit `2_deploy_contract.js` to add the contract's constructor arguments inside the `/migrations` directory.

```sh

truffle dev

truffle compile

truffle migrate --network ganache

```

## Ark Protocol Contracts

| Contract  | Source Code | Deployment | Network |
| ------------- |:-------------:| :-------------: | :-------------: |
| Ark EXM Oracle | [ark-contracts/arweave](./ark-contracts/arweave/exm-ark.js) | [wyfTGnKv6uAE3epxc2kYFum-9b9WDbiEgujiheO6G2M](https://api.exm.dev/read/wyfTGnKv6uAE3epxc2kYFum-9b9WDbiEgujiheO6G2M) | Arweave-EXM |
| Ethereum Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     | 0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A | [Goerli](https://goerli.etherscan.io/address/0xde44d3fb118e0f007f2c0d8fffe98b994383949a) \|\| [Mainnet](https://etherscan.io/address/0xde44d3fb118e0f007f2c0d8fffe98b994383949a) |
| Aurora Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0xfb0200C27185185D7DEe0403D5f102ADb59B7c34](https://testnet.aurorascan.dev/address/0xfb0200c27185185d7dee0403d5f102adb59b7c34)          | Aurora Testnet |
| BSC Testnet Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0x90f36C4Fc09a2AD3B62Cc6F5f2BCC769aFAcB70d](https://testnet.bscscan.com/address/0x90f36c4fc09a2ad3b62cc6f5f2bcc769afacb70d)          |  Testnet  |
| BSC Mainnet Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A](https://bscscan.com/address/0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A)          |  Mainnet  |
| Avalanche Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy) | 0xE5E0A3380811aD9380F91a6996529da0a262EcD1 | [Fuji Testnet](https://testnet.snowtrace.io/address/0xe5e0a3380811ad9380f91a6996529da0a262ecd1) \|\| [C-Chain Mainnet](https://snowtrace.io/address/0xe5e0a3380811ad9380f91a6996529da0a262ecd1)|
| NEON Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A](https://neonscan.org/address/0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A)          | NEON DEVNET |
| FTM Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A](https://ftmscan.com/address/0xde44d3fb118e0f007f2c0d8fffe98b994383949a)          | Mainnet |
| Optimism Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A](https://optimistic.etherscan.io/address/0xde44d3fb118e0f007f2c0d8fffe98b994383949a)          | Mainnet) |
| Arbitrum Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A](https://arbiscan.io/address/0xde44d3fb118e0f007f2c0d8fffe98b994383949a)          | Arbitrum One |
| Polygon Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A](https://polygonscan.com/address/0xde44d3fb118e0f007f2c0d8fffe98b994383949a)          |  Mainnet |
| Near Registry SC      | [ark-contracts/near](./ark-contracts/near)     |  [ark_station_1.near](https://explorer.near.org/accounts/ark_station_1.near) |  Mainnet |
| Evmos Registry SC      | [ark-contracts/EVM](./ark-contracts/EVM/identity.vy)     |  [0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A](https://evm.evmos.org/address/0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A) |  Mainnet |



## Ark Protocol API Methods
set of public API methods for the Ark Protocol node

- API endpoint (development - EXM testnet): https://ark-core.decent.land

### 1- get Arweave-EXM oracle state
- `GET /v2/oracle/state`

Reponse example: return the state of the Ark EXM oracle

```json
{
  "res": [
    {
      "arweave_address": "AeK_9yb3f3HEK1Gzwky6tIx8ujW9Pxr_FkhCkWftFtw",
      "primary_address": "0x197f818c1313dc58b32d88078ecdfb40ea822614",
      "did": "did:ar:AeK_9yb3f3HEK1Gzwky6tIx8ujW9Pxr_FkhCkWftFtw",
      "is_verified": true,
      "first_linkage": 1666632080000,
      "last_modification": 1666665342000,
      "unevaluated_addresses": [],
      "addresses": [
        {
          "address": "0x197f818c1313dc58b32d88078ecdfb40ea822614",
          "network": "BSC-MAINNET",
          "ark_key": "EVM",
          "verification_req": "0xa9bf5f00cb91e9dcf5e5c441b9b7fa8fa0078f3240a568d5d960f5a5e6e2ac56",
          "is_verified": true,
          "is_evaluated": true
        }
      ]
    },
    {
      "arweave_address": "kaYP9bJtpqON8Kyy3RbqnqdtDBDUsPTQTNUCvZtKiFI",
      "primary_address": "0x2A01d339d3ab41B2D8b145b5dF8586032D9961C6",
      "did": "did:ar:kaYP9bJtpqON8Kyy3RbqnqdtDBDUsPTQTNUCvZtKiFI",
      "is_verified": true,
      "first_linkage": 1666632080000,
      "last_modification": 1666665370000,
      "unevaluated_addresses": [],
      "addresses": [
        {
          "address": "0x2A01d339d3ab41B2D8b145b5dF8586032D9961C6",
          "network": "ETH-MAINNET",
          "ark_key": "EVM",
          "verification_req": "0x22414bd42a59fefa4167cb5757a23b2d4560f3a055aa5bd1be48cad95dd1d778",
          "is_verified": true,
          "is_evaluated": true
        }
      ]
    }
  ]
}
```


### 2- get protocol stats
- `GET /v2/protocol/stats`

Response example:
```json
{"users_count": 46}

```

### 3- get protocol smart contracts addresses
- `GET /v2/protocol/addresses`

Reponse example: return the smart contracts addresses

```json
{
  "exm_function_id": {
    "addr": "wyfTGnKv6uAE3epxc2kYFum-9b9WDbiEgujiheO6G2M",
    "network": "arweave-mainnet"
  },
  "eth_oracle_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "goerli&&mainnet"
  },
  "aurora_oracle_addr": {
    "addr": "0xfb0200C27185185D7DEe0403D5f102ADb59B7c34",
    "network": "aurora-testnet"
  },
  "bsc_oracle_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "bsc-mainnet"
  },
  "avalanche_oracle_addr": {
    "addr": "0xE5E0A3380811aD9380F91a6996529da0a262EcD1",
    "network": "avax-c-chain"
  },
  "ftm_oracle_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "ftm-mainnet"
  },
  "optimism_oracle_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "optimism-mainnet"
  },
  "arbitrum_oracle_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "arbitrum-one"
  },
  "polygon_oracle_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "polygon-mainnet"
  },
  "evmos_mainnet_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "evmos-mainnet"
  },
  "near_mainnet_addr": {
    "addr": "ark_station_1.near",
    "network": "near-mainnet"
  },
  "near_testnet_ark_oracle": {
    "addr": "dev-1660516310576-97373428914255",
    "network": "near-testnet"
  },
  "neon_devnet_oracle_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "neon-devnet"
  }
}

```

#### To get the active Arweave-EXM oracle contract, always use the `exm_function_id` from `/v2/protocol/addresses`

### 4- get Ark profile metadata
- `GET /v2/profile/:network/:address/:compress?`

`network` can be either `arweave` or `evm` - and thus `address` should be on the equivalent network.

Response: return user's Ark identity multichain metadata.

#### N.B `compress` (bool) is a parameter that if seeded, gzip the API's response 

## License
This project is licensed under the [MIT license](./LICENSE).
