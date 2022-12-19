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
## Integrating Ark Protocol
Check these [docs](./ark-contracts/docs/exm-ark-guide.md) to learn how to intergrate Ark Protocol in your app.

## Ark Protocol Contracts

| Contract  | Source Code | Deployment | Network |
| ------------- |:-------------:| :-------------: | :-------------: |
| Ark EXM Oracle | [ark-contracts/arweave](./ark-contracts/arweave/exm-ark.js) | [Z7JzRRt2iTQWV5LziNhTV6SP51tVKkCf_qrUqtlwzpg](https://api.exm.dev/read/Z7JzRRt2iTQWV5LziNhTV6SP51tVKkCf_qrUqtlwzpg) | Arweave-EXM |
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
| Solana Registry SC      | [ark-contracts/EXM](./ark-contracts/EXM/solana/sol-registry.js)     |  [Wg_78ViU6IkxpKnAJGMpGlXd7u_QmCsHIo3kFGKek8M](https://api.exm.dev/read/Wg_78ViU6IkxpKnAJGMpGlXd7u_QmCsHIo3kFGKek8M) |  EXM |
| Tron Registry SC      | [ark-contracts/EXM](./ark-contracts/EXM/tron/trx-registry.js)     |  [AMCEh5wYyBfQ5Y_lxpOn6Fp_O4JqDVOPU_swvednJII](https://api.exm.dev/read/AMCEh5wYyBfQ5Y_lxpOn6Fp_O4JqDVOPU_swvednJII) |  EXM |



## Ark Protocol API Methods
set of public API methods for the Ark Protocol node

- API endpoint (development - EXM testnet): https://ark-core.decent.land

### 1- get Arweave-EXM oracle state
- `GET /v2/oracle/state`

Reponse example: return the state of the Ark EXM oracle

```json
{
  "contract_admin": "xGx07uNnjitWsOSfKZC-ic74oXs9qDXU5QOsAis4V3tXk0krk5zUlGYu7SlZ-4xfNVA1QsHa_pOvlgE-0xGKJvMZRZYzlYcBDsnDJgLYQc5D2B2Ng4HQjLON-Gqsxl25Uj7-VSEeUgk5b2Q4SrAoVTKLWKEtuGDqwy5qKKCvNHYShYJHbmAsjQzwCwvfn2bqKv_zFUD4QeukihfDJbVyZaiev7GoE1NzTsqJ_V_eZ9tKV_5YVy-ZVU8a9dEeTnGJm2rT6z9aCcQwd9EqVYi7h8QCbKOn2r5K2NbD6V8xjQGHvODHMO0iHk2hLzcLbfDfyn_Ej-xZsHU6LBJCTeDBy_5kWtOVlYL_RH34UA1j_IYEMVDYnQBKo5laassByvkn7nODZiXesvw6TsXPYdrqrgIL7x4Td5QVK8UHXCGXOrtAlhxfzNWyjP0z5ezAsQpzGPgGI9OKgjmPIk4K6K88BoxNmJ_XFPV1DN8qZGsPSVz2N7XN9wFetDs4CMOGyDToTDEea77TsP1ykKMcXf2h-JCZlvzFEpxS_zMaRMcwV502zXN01oCR2QpUEISf_IzxQYXsjR_F75VPpUvfmDtPYf4ftQN1cZYiH68zxn74uO7DLqIa3nUXq_IrUP7SmEnbMgjzjElp0a_u62XtmgT3GQv7SBrQdzym3yhhM-3kcok",
  "evm_networks": [
    "AURORA-MAINNET",
    "AURORA-TESTNET",
    "BSC-MAINNET",
    "BSC-TESTNET",
    "ETH-MAINNET",
    "ETH-GOERLI",
    "EVMOS-MAINNET",
    "NEON-DEVNET",
    "AVALANCHE-MAINNET",
    "FUJI-C-CHAIN",
    "FTM-MAINNET",
    "OPTIMISM-MAINNET",
    "ARBITRUM-MAINNET",
    "POLYGON-MAINNET"
  ],
  "exotic_networks": ["NEAR-MAINNET"],
  "user_sig_messages": ["my pubkey for DL ARK is: "],
  "admin_sig_messages": ["DL ARK Admin pubkey of: "],
  "identities": [
    {
      "arweave_address": "AeK_9yb3f3HEK1Gzwky6tIx8ujW9Pxr_FkhCkWftFtw",
      "public_key": "sD21HRnVaS-RMrE5_qRk5tBwq2LjUjUevsZBGT2ZoIEj7U0TMfcPxpmNQ0ZRTLnIm-Y3IEX7vesZ0MqUiF7f6IZb4RTIPCkWaZdNBZWwLJIVARB0tS5W-eruTe838Zuo5Ly0N-LOaaWS5hGPKRj2LsSMbdhFvkZHnJP7TMgxmwukwtV7aBVSf6lWVpr20cQXzu9IRaKhStrJHa6VEhLH6-DzJKnqLwYNDZ7V8rIKRJsdQQFec7OOgOjdvrZ5sRnIWrgt3c0O0giW7L5lHMVKSAZowBlap5wjwbus61amfajD4wTAndZcBBZTSQ-ijToLmR4T2q3skDG4BlMcr132lgPpYDtHX4qv6Joy0Wx2XIUWCY8QsPSjcG8FpIAB3JwqM6RJkM3ipGwR8WZ-vHhUcZq7fw0K342j5R_renrQ0bDAmQhsIy3Qx-S56eRpkxcYJNzn_XbmXzbxE584DXkvNkpYlS_Z3kUccDJRgyY1Asq76kdhV6x2PzqCCIvBEXdWX5pUMU5FBt3KS9GNeYJKoQxcDxKNINomvLLkA4v_80LBAQNIPIO0yVPA3FLpyYW3MJ7Q-pwzx-tsupX6bE58EkhiGlg6j9MTl6kvEYMM7yM0AXT2MoOGL9M2lAfNr-xj1BE3CyKa-uz_6N1xrNu8ulgdi8TYCMRdlkkeb7BwsPc",
      "primary_address": "0x197f818c1313dc58b32d88078ecdfb40ea822614",
      "is_verified": true,
      "first_linkage": 1668244496000,
      "last_modification": 1668244588000,
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
    }
  ],
  "verRequests": [
    "0xa9bf5f00cb91e9dcf5e5c441b9b7fa8fa0078f3240a568d5d960f5a5e6e2ac56"
  ],
  "signatures": [
    "X2bSBgTVp3qbIh0DE+GQ9gGYYzlMsrW5lR+P9Rwt07ap9jmBJDJ+WCTLALBIZpp9ZfnxcWtdljYf0CTKZjx4bKfacPQCi2Sln3q2cj5AHpLJtVPhU76uUviGF/gzRDCQaHye1XOLWzm+z/zRxwNtburfoZxufWqbuDw8UdF+/tOoZSrP4qJ9PMvzYx5ScrsbzlW0iLHgIf2vPG5J9uqzHBOAlali8UKvmrSDdrKnO+sKvPnXV/GNEguicbTWzkgTswU2RXzzZPfip/KurOPeb/u8/nCvwwPLZ52Y9YQpUV3TVRSSdmxH5GxY1CArj76qp1sTzaKs6NVI/zDwNqwmbS5CrH82AAsKTXfxxq748676XWXLOfOR603Lebhgnp8+p7nMPT9FfMjQL6XEWUH1fskSSn436I6RQVGT52ZhiRXqEtwQttWjKxmzpuGHYqlzBSDldg3f52MD8RAQ2K+X+lKOMNFibNbfaK1QrSdrkmdRUiyIrjKjAUwQSFR6BqE544oJmPhxVpGh2XCQ0R1TCNSU0kAGrXZ9bvTpaK/1WRdIjFrXGJVjPRoTeJ2bGOeahMOyHKPDvKJLaCNtqsaTNFgiEl5XArBx9u/ddPEWVvbIzieUlUdNfWWcvs+d0tU0fBxleRBMQ16yybSKASqWFdORSRUbPc16j6z0DpWFxEw=",
    "AbVGYi63mp4YjkK6xIqQ1WSOE0wRSClFX7FlnQbWhUgIOSOnzJBeEB+Pc7NKpEUtFnW8VA0YxmveE7OOzLDXvd35mpH+ON/+JUIwxIwPxMFQybri8f02vien649EoqafayuHXQc41d3WB+VKkyNn0RF+M9m1ZUPWaWbuxyDlttC3axccA96P4rZ7A+T+hsM7uB+a0S/mLhBBOUWPsD5fhsu2dRQZY4oj+kj+n31InilYN+inkQ4eat52tbG+bOqagC8rAHVOCciRYXQHoxJa3gj5etsrRPDu+2Tx/d8AJ9hmbyhWTA517O4AlMFvGcXsk7VUCqq0zit1yuXofTyEbDVyL24/XqFPGa54NnWbwyNMWiZbAvVv9CJNh6Lm4YTVAOOATiWiABkfNBA5/oRZD8F0zcuqFZ35/okatXs26BW4it7HD0M5MMNYj+IgbYSfh3BnFaEJiGTR4Uy7LtlJtubORz+cqZpmN8EjjsDp1iMyyCP1RGDYF4vZTy7xKw5pXjuWozrp6XXvPIr9lg42x+fTPT1LcONb3y4K/FXpINcEovMex1jFfPZLdo1V+I+JYyEHZzNQZxQ+lqFsV6LNsqLhtI+RT1tvkDm1bq4kEfT84BhILs0Gm7eLIx+8LCEI08PluKbYFlK/mRMlqHp2ShYh+KWSxVp98kgJqcqFQcI="
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
  "master_oracle": {
    "addr": "Z7JzRRt2iTQWV5LziNhTV6SP51tVKkCf_qrUqtlwzpg",
    "network": "exm-mainnet"
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
  "solana_oracle_address": {
    "addr": "Wg_78ViU6IkxpKnAJGMpGlXd7u_QmCsHIo3kFGKek8M",
    "network": "exm-mainnet"
  },
  "tron_oracle_address": {
    "addr": "AMCEh5wYyBfQ5Y_lxpOn6Fp_O4JqDVOPU_swvednJII",
    "network": "exm-mainnet"
  },
  "neon_devnet_oracle_addr": {
    "addr": "0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A",
    "network": "neon-devnet"
  }
}

```

#### To get the active Arweave-EXM oracle contract, always use the `master_oracle` from `/v2/protocol/addresses`
### 4- Resolve Ark addresses for a given address

- `GET /v2/address/resolve/:address`

`address` can be of any type (Arweave, EVM or Exotic). the API will return addresses and linkage requests data for the given address.

### 5- get Ark profile full metadata
- `GET /v2/profile/:network/:address/:compress?`

`network` can be either `arweave`, `evm` or `exotic` - and thus `address` should be on the equivalent network. For `evm` and `exotic` , only a verified identity having its `primary_address` equivalent to that address is returned.

Response: return user's Ark identity multichain metadata.

### 6- SoArk: `soark` endpoint

- `GET /v2/soark/:network/:address`

Response: return user's Domain Names (NS) and NFTs

### 7- SoArk: Only Domains
- `GET /v2/domains/:network/:address` 

Response: return all domains owned by any verified address linked with the given identity reference (address).

### 8- SoArk: Only NFTs
- `GET /v2/allnft/:network/:address`

Reponse: return EVM & NEAR NFTs owned by any verified address linked with the given identity reference (address).

### 9- soArk: Only NEAR NFTs
- `GET /v2/nep/:address`

Response: return NFTs for a given NEAR address

#### N.B `compress` (bool) is a parameter that if seeded, gzip the API's response 

## License
This project is licensed under the [MIT license](./LICENSE).
