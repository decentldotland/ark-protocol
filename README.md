<p align="center">
  <a href="https://decent.land">
    <img src="./img/logo25.png" height="124">
  </a>
  <h3 align="center"><code>@decentdotland/ark-protocol</code></h3>
  <p align="center">multi-chain identities linking protocol</p>
</p>

## Synopsis
Ark Network is a protocol for verified multi-chain addresses (identities) linking. The protocol consists of an oracle address on Arweave network and other data registry contracts on EVM (and possibly non-EVM chains) with a validation backend.

## Install & run it

```sh
git clone https://github.com/decentldotland/ark-network.git

cd ark-network

npm install .

npm run polling
```

## Build Ark EVM Contract

The repository `ark-network` is built with ES6 syntax, therefore building with truffle is not compatible

### 1- Create a new directory
```sh

mkdir ark-deploy

cd ark-deploy

truffle init


```

### 2- Copy `/contracts` directory to `ark-deploy`

```sh
cp -r ark-network/contracts ark-deploy 

```

### 3- compile & migrate
Make sure to edit `2_deploy_contract.js` to add the contract's constructor arguments inside the `/migrations` directory.

```sh

truffle dev

truffle compile

truffle migrate --network ganache

```

## How The Identity Verification Process Works

![logic-flow](/img/logic-flow.png)

### Detailed Logic Flow:

1- The user invoke `linkIdentity("ARWEAVE_ADDRESS")` function in the EVM registry contract.

2- The user invoke `linkIdentity("EVM_ADDRESS", "EVM_INVOC_TXID_FROM_1", "EVM_NETWORK_KEY)` function in the Arweave oracle address.

3- The non-verified identity get added in the Arweave oracle address:

```json
//user_object
{
  "arweave_address": "AeK_9yb3f3HEK1Gzwky6tIx8ujW9Pxr_FkhCkWftFtw", // the TX caller address
  "evm_address": "0x197f818c1313dc58b32d88078ecdfb40ea822614", // the EVM identity to be verified
  "verification_req": "0x5030f945f09e39af85986807293220b1daa736fdee6b490ae78eb150f155072d", // TXID of the interaction with the EVM sc
  "ver_req_network": "AURORA-TESTNET", // the network KEY, where the verification_req took place
  "identity_id": "ALcuqH1FfQvmx-8lL9P_fZJQQp0XUkcg7Sw5-PH9R7Q", // auto-generated, the SWC interactionTX.ID
  "is_verified": false, // initial value
  "is_evaluated": false, // initial value
  "last_modification": 953910
}

```


4- The node listens for new non-evaluated interactions (TXs) with the Arweave oracle SWC.

5- For non-evaluated TX, the node call `getTransactionReceipt(verification_req)` and get TX's metadata.

6- The metadata are used to validate that the `1` and `2` have been invoked by the same persona.

7- If the EVM TX logs (emmited events) match the `3` TX's property `user_object.arweave_address` -- the identity is considered valid.

8- The contract's admin invoke `verifyIdentity("arweave_address")` in the Arweave SWC address:

```json
// user_object
{
  "arweave_address": "AeK_9yb3f3HEK1Gzwky6tIx8ujW9Pxr_FkhCkWftFtw",
  "evm_address": "0x197f818c1313dc58b32d88078ecdfb40ea822614",
  "verification_req": "0x5030f945f09e39af85986807293220b1daa736fdee6b490ae78eb150f155072d",
  "ver_req_network": "AURORA-TESTNET",
  "identity_id": "ALcuqH1FfQvmx-8lL9P_fZJQQp0XUkcg7Sw5-PH9R7Q",
  "is_verified": true,
  "is_evaluated": true,
  "last_modification": 965730,
  "last_validation": 965730,
  "validator": "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0"
}

```

## Ark Network Contracts

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



## Ark Network API Methods
set of public API methods for the Ark Network node

- API endpoint (development - EXM testnet): https://ark-core.decent.land

### 1- get Arweave oracle state
- `GET /v2/oracle/state`

Reponse example: return the state of the Ark oracle smartweave oracle address



### 2- get network stats
- `GET /v2/protocol/stats`

Response example:
```json
{"users_count": 46}

```

### 3- get network addresses
- `GET /v2/protocol/addresses`

Reponse example: return the validators addresses and the smart contracts addresses

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

#### To get the active Arweave oracle contract, always use the `arweave_oracle_addr` from `/v2/protocol/addresses`

### 4- get Ark profile metadata
- `GET /v2/profile/:network/:address/:compress?`

`network` can be either `arweave` or `evm` - and thus `address` should be on the equivalent network.

Response: return user's Ark identity multichain metadata.

#### N.B `compress` (bool) is a parameter that if seeded, gzip the API's response 

## License
This project is licensed under the [MIT license](./LICENSE).
