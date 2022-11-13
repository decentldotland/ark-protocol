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
