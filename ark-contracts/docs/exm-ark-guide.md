## Guide For Ark EXM Implementation 

### Requirements
- Token ID creation on [exm.dev](https://exm.dev/login).
- Deploy your EXM function using the contract's [source code](../arweave/exm-ark.js).

## CLI interactions

### 1- deploy the contract

```console
exm function:deploy --src ../arweave/exm-ark.js --init-state '{"contract_admin":"YOUR_WALLET_PUBLIC_KEY","evm_networks":["AURORA-MAINNET","AURORA-TESTNET","BSC-MAINNET","BSC-TESTNET","ETH-MAINNET","ETH-GOERLI","EVMOS-MAINNET","NEON-DEVNET","AVALANCHE-MAINNET","FUJI-C-CHAIN","FTM-MAINNET","OPTIMISM-MAINNET","ARBITRUM-MAINNET","POLYGON-MAINNET"],"exotic_networks":["NEAR-MAINNET"],"user_sig_messages":["my pubkey for DL ARK is: "],"admin_sig_messages":["DL ARK Admin pubkey of: "],"identities":[],"verRequests":[],"signatures":[]}' --token YOUR_EXM_TOKEN_ID
```

### 2- Link an identity

```console
exm function:write YOUR_EXM_FUNCTION_ID --input '{"function": "linkIdentity", "jwk_n": "PUB_KEY", "address": "FOREIGN_ADDR", "network": "NETWORK_KEY", "verificationReq": "FOREIGN_LINKAGE_TXID", "sig": "BASE64_SIGNATURE_STRING"}' --token YOUR_EXM_TOKEN_ID
```

### 3- Unlink an identity

```console
exm function:write YOUR_EXM_FUNCTION_ID --input '{"function": "unlinkIdentity", "jwk_n": "PUB_KEY", "address": "FOREIGN_ADDR"}' --token YOUR_EXM_TOKEN_ID
```

### 4- Set primary address

```console
exm function:write YOUR_EXM_FUNCTION_ID --input '{"function": "setPrimaryAddress", "jwk_n": "PUB_KEY", "primary_address":"FOREIGN_ADDR", "sig": "BASE64_SIGNATURE_STRING"}' --token YOUR_EXM_TOKEN_ID
```

### 5- Evaluate linkage request

```console
exm function:write YOUR_EXM_FUNCTION_ID --input '{"function": "evaluate","arweave_address?": "RESOLVED_ARWEAVE_ADDR", "evaluated_address": "FOREIGN_ADDR", "evaluation": BOOLEAN, "user_pubkey": "EVAL_ADDR_PUB_KEY", "admin_jwk_n": "ADMIN_PUB_KEY", "admin_sig ": "ADMIN_SIGNED_MESSAGE"}' --token YOUR_EXM_TOKEN_ID
```

### 6- Add network key

```console
exm function:write YOUR_EXM_FUNCTION_ID --input '{"function": "addNetwork", "network_key": "KEY_VALUE", "type": "EVM_OR_EXOTIC", "jwk_n": "ADMIN_PUB_KEY", "sig": "ADMIN_SIGNED_MESSAGE"}' --token YOUR_EXM_TOKEN_ID

```

### 6- Remove network key

```console
exm function:write YOUR_EXM_FUNCTION_ID --input '{"function": "removeNetwork", "network_key": "KEY_VALUE", "type": "EVM_OR_EXOTIC", "jwk_n": "ADMIN_PUB_KEY", "sig": "ADMIN_SIGNED_MESSAGE"}' --token YOUR_EXM_TOKEN_ID

```

### 7- Update signature messages

```console
exm function:write YOUR_EXM_FUNCTION_ID --input '{"function": "modifySigMsg", "message": "NEW_SIG_MESSAGE_STR", "type": "USER_OR_ADMIN", "action": "ADD_OR_REMOVE", "jwk_n": "ADMIN_PUB_KEY", "sig": "ADMIN_SIGNED_MESSAGE"}' --token YOUR_EXM_TOKEN_ID

```

## JS Usage

### Prerequisites

#### Libraries

```sh
npm  install axios @execution-machine/sdk
```
#### Retrieving wallet's public key
- using Arconnect: [method](https://github.com/arconnectio/ArConnect#getactivepublickey-promisestring) 

- using JWK for NodeJS (not recommended, users/devs MUST NOT expose their JWK in production): 
```js 
JSON.parse(JWK_BURNER_WALLET_OBJECT)?.n
````

#### Generating wallet signature
- using Arconnect: [method](https://github.com/arconnectio/ArConnect#signaturedata-options-promiseuint8array)

- using NodeJS (dev mode - JWK MUST NOT be exposed):

```js
import Arweave from "arweave";
// initialize Arweave - create instance
const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  timeout: 60000,
  logging: false,
});

const BURNER_WALLET_JWK = JSON.parse(process.env.BURNER_WALLET_JWK);

async function generateAdminSignature(messageBody) {
    const message = new TextEncoder().encode(`${messageBody}${BURNER_WALLET_JWK.n}`);
    const signature = await arweave.crypto.sign(BURNER_WALLET_JWK, message);
    console.log(signature.toString("base64"));

    return signature.toString("base64");
}
```

***N.B: in both cases, the signed message should be stringified before passing it to the contract (base64 encoding)***

### Reading Ark contract

### Using axios

```js
import axios from "axios";

async function readOracle(EXM_ARK_CONTRACT_ID) {
	try {
		const state = await axios.get(`https://api.exm.dev/read/${EXM_ARK_CONTRACT_ID}`);
		console.log(state);
		return state;
	} catch(error) {
		console.log(error);
		return false;
	}
}
```

### Using EXM SDK

```js
import { Exm } from "@execution-machine/sdk";

const exmInstance = new Exm({ token: process.env.YOUR_EXM_TOKEN });

export async function evaluateOracleState() {
  try {
    const state = await exmInstance.functions.read(EXM_ARK_CONTRACT_ID);
    return state;
  } catch (error) {
    console.log(error);
    return false;
  }
}



```

## Write operations (interacting with Ark contract)

### Linking identity

function [definition - reference](https://github.com/decentldotland/ark-protocol/blob/main/ark-contracts/arweave/exm-ark.js#L61)

```js
import { Exm } from "@execution-machine/sdk";

const exmInstance = new Exm({ token: process.env.YOUR_EXM_TOKEN });
const EXM_ARK_CONTRACT = "...";

async function linkIdentity() {
  try {
    const inputs = [
      {
        function: "linkIdentity",
        jwk_n: "PUB_KEY", // the public key of the identity's Arweave wallet address
        address: "FOREIGN_ADDR", // the (non)EVM wallet address to be linked with the identity
        network: "NETWORK_KEY", // network key (Ark domain definition) where the (non)EVM linkage request too place
        verificationReq: "FOREIGN_LINKAGE_TXID", // (non)EVM linkage request TXID
        sig: "BASE64_SIGNATURE_STRING", // a message signed by the same wallet of the passed public key (jwk_n) as base64 string
        								// check example https://github.com/decentldotland/ark-protocol/blob/main/src/utils/arweave/sign.js#L7
      },
    ];

    const interaction = await exmInstance.functions.write(
      EXM_ARK_CONTRACT,
      inputs
    );

    if (interaction.status === "SUCCESS") {
      console.log(`interaction id: ${interaction?.data?.pseudoId}`);
      return;
    }
  } catch (error) {
    console.log(`interaction failed:\n`);
    console.log(error);
  }
}


```

## Dev support
For any further support, join our [Discord server](https://discord.gg/decentland)
