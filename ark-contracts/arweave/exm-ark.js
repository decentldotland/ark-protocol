/**
 *
 *
 *
 *         ░█████╗░██████╗░██╗░░██╗        ███╗░░██╗███████╗████████╗░██╗░░░░░░░██╗░█████╗░██████╗░██╗░░██╗
 *         ██╔══██╗██╔══██╗██║░██╔╝        ████╗░██║██╔════╝╚══██╔══╝░██║░░██╗░░██║██╔══██╗██╔══██╗██║░██╔╝
 *         ███████║██████╔╝█████═╝░        ██╔██╗██║█████╗░░░░░██║░░░░╚██╗████╗██╔╝██║░░██║██████╔╝█████═╝░
 *         ██╔══██║██╔══██╗██╔═██╗░        ██║╚████║██╔══╝░░░░░██║░░░░░████╔═████║░██║░░██║██╔══██╗██╔═██╗░
 *         ██║░░██║██║░░██║██║░╚██╗        ██║░╚███║███████╗░░░██║░░░░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██║░╚██╗
 *         ╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝        ╚═╝░░╚══╝╚══════╝░░░╚═╝░░░░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝
 *
 * @title Ark Network Arweave oracle
 * @version EXM@v0.0.8
 * @author charmful0x
 * @license MIT
 * @website decent.land
 *
 **/

export async function handle(state, action) {
  const input = action.input;

  // STATE PROPERTIES
  const identities = state.identities;
  const evm_networks = state.evm_networks;
  const exotic_networks = state.exotic_networks;
  const networks = evm_networks.concat(exotic_networks);
  const verRequests = state.verRequests;

  // ERRORS CONSTANTS
  const ERROR_FUNCTION_MISSING_ARGUMENTS = `ERROR_INSUFFICIENT_HAVE_BEEN_SUPPLIED_TO_THE_FUNCTION`;
  const ERROR_INVALID_USER = `ERROR_CANNOT_FIND_USER_WITH_THE_GIVEN_ADDRESS`;
  const ERROR_ADDRESS_NOT_OWNED = `ERROR_THE_ARWEAVE_CALLER_DONT_OWN_THE_EXOTIC_ADDR`;
  const ERROR_ADDRESS_ALREADY_PRIMARY = `ERROR_THE_GIVEN_EXOTIC_ADDR_IS_ALREADY_PRIMARY`;
  const ERROR_ERROR_UNLINKING_ADDRESS = `ERROR_SOMETHING_WENT_WRONG_WHILE_UNLINKING_ADDRESSES`;
  const ERROR_INVALID_EVALUATION = `ERROR_EVALUATION_MUST_BE_A_BOOLEAN`;
  const ERROR_ADDRESS_ALREADY_EVALUATED = `ERROR_THE_GIVEN_ADDR_HAS_BEEN_ALREADY_EVALUATED`;
  const ERROR_INVALID_ARWEAVE_ADDRESS = `ERROR_INVALID_ARWEAVE_ADDR_SYNTAX`;
  const ERROR_INVALID_DATA_TYPE = `ERROR_INPUT_SUPPOSED_TO_BE_A_STRING`;
  const ERROR_INVALID_EVM_ADDRESS_SYNTAX = `ERROR_INVALID_EVM_ADDR_SYNTAX`;
  const ERROR_INVALID_EVM_TXID_SYNTAX = `ERROR_INVALID_EVM_TXID_SYNTAX`;
  const ERROR_VER_ID_ALREADY_USED = `ERROR_THE_GIVEN_VERIFICATION_REQUEST_HAS_BEEN_ALREADY_USED`;
  const ERROR_INVALID_NETWORK_SUPPLIED = `ERROR_INVALID_NETWORK_KEY_HAS_BEEN_SUPPLIED`;
  const ERROR_ADDRESS_ALREADY_USED = `ERROR_EXOTIC_ADDRESS_ALREADY_LINKED_TO_ANOTHER_USER`;
  const ERROR_ADDRESS_ALREADY_USED_FOR_LINKAGE = `ERROR_YOU_HAVE_ALREADY_ADDED_THIS_ADDRESS`;
  const ERROR_NETWORK_ALREADY_ADDED = `ERROR_THE_GIVEN_NETWORK_EXISTS_ALREADY`;
  const ERROR_INVALID_NETWORK_TYPE = `ERROR_INVALID_NETWORK_KEY_TYPE`;
  const ERROR_NETWORK_NOT_FOUND = `ERROR_CANNOT_FIND_A_NETWORK_WITH_THE_GIVEN_KEY`;
  const ERROR_INVALID_OWNER_TO_ADDRESS = `ERROR_THE_GIVEN_OWNER_DOES_NOT_BELONG_TO_CALLER`;
  const ERROR_INVALID_CALLER_SIGNATURE = `ERROR_SIGNED_MESSAGE_CANNOT_BE_VERIFIED`;
  const ERROR_INVALID_SIG_TYPE = `ERROR_INVALID_SIGNATURE_TYPE`;
  const ERROR_INVALID_MODIFICATION_ACTION = `ERROR_INVALID_MODIFICATIONS_ACTION_PROVIDED`;
  const ERROR_INVALID_SIG_MESSAGE_BODY = `ERROR_SIGNATURE_BODY_MUST_BE_NON_EMPTY_STRING`;
  const ERROR_MESSAGE_NOT_FOUND = `ERROR_CANNOT_FIND_MSG_MATCHING_INPUT_MSG`;
  const ERROR_CALLER_NOT_ADMIN = `ERROR_CALLER_MUST_BE_ADMIN`;
  const ERROR_SIGNATURE_ALREADY_USED = `ERROR_REENTRANCY_SIGNATURE_USAGE`;
  const ERROR_INVALID_JWK_N_SYNTAX = `ERROR_INVALID_ARWEAVE_PUBKEY_SYNTAX`;

  // CALLABLE FUNCTIONS

  if (input.function === "linkIdentity") {
    /**
     * @dev the caller submits a linkage request to his
     * Arweave (master) address, linkable address are of
     * type "EVM" and "EXOTIC" (== non-EVM).
     *
     * @param jwk_n the caller's Arweave public key
     * @param sig verification message signed by the caller's pubkey
     * @param address the EVM or non-EVM address (foreign addr)
     * @param verificationReq the linkage TXID (on the foreign network)
     * @param network the network key
     *
     * @return state
     **/

    const address = input?.address;
    const verificationReq = input?.verificationReq;
    const network = input?.network;
    const sig = input?.sig;
    const jwk_n = input.jwk_n;

    if (!jwk_n && !sig && !address && !verificationReq && !network) {
      throw new ContractError(ERROR_FUNCTION_MISSING_ARGUMENTS);
    }

    _validateOwnerSyntax(jwk_n);
    _checkAddrUsageDuplication(address);
    await _verifyArSignature("user", jwk_n, sig);

    const userIndex = _getUserIndex(jwk_n);

    // network checking is done inside `_validateAddrSig`
    _validateAddrSig(address, verificationReq, network);
    _checkSignature(verificationReq);

    const networkKey = _resolveNetwork(network);
    const currentTimestamp = await _getTimestamp();

    if (userIndex === -1) {
      identities.push({
        arweave_address: null,
        public_key: jwk_n,
        primary_address: address,
        is_verified: false, // `true` when the user has his primary address evaluated & verified
        first_linkage: currentTimestamp,
        last_modification: currentTimestamp,
        unevaluated_addresses: [address],
        addresses: [
          {
            address: address,
            network: network,
            ark_key: networkKey,
            verification_req: verificationReq,
            is_verified: false,
            is_evaluated: false,
          },
        ],
      });

      return { state };
    }

    const user = identities[userIndex];

    _linkageFatFinger(address, userIndex);

    user.addresses.push({
      address: address,
      network: network,
      ark_key: networkKey,
      verification_req: verificationReq,
      is_verified: false,
      is_evaluated: false,
    });

    user.unevaluated_addresses.push(address);
    user.last_modification = currentTimestamp;

    return { state };
  }

  if (input.function === "setPrimaryAddress") {
    /**
     * @dev this function allows the user to determine his
     * primary address that resolves to his main identity.
     * The identity (user) is considered verified only if the
     * chosen primary_address has been evaluated and is verified.
     *
     * @param jwk_n the caller's Arweave public key
     * @param sig verification message signed by the caller's pubkey
     * @param primary_address the chosen ((non)-EVM) primary addr
     *
     * @return state
     **/
    const primary_address = input.primary_address;
    const jwk_n = input?.jwk_n;
    const sig = input?.sig;

    _validateOwnerSyntax(jwk_n);
    await _verifyArSignature("user", jwk_n, sig);
    const userIndex = _getUserIndex(jwk_n);
    ContractAssert(userIndex >= 0, ERROR_INVALID_USER);

    const user = identities[userIndex];

    const addressIndex = user.addresses.findIndex(
      (addr) => addr["address"] === primary_address
    );
    ContractAssert(addressIndex >= 0, ERROR_ADDRESS_NOT_OWNED);

    ContractAssert(
      user.primary_address !== primary_address,
      ERROR_ADDRESS_ALREADY_PRIMARY
    );

    // change the primary address
    user.primary_address = primary_address;
    // user's verification is tied to the primary address validity
    user.is_verified = user.addresses[addressIndex].is_verified;
    // log the update's timestamp
    user.last_modification = await _getTimestamp();

    return { state };
  }

  if (input.function === "unlinkIdentity") {
    /**
     * @dev the reverse of the `linkIdentity` function.
     * This function allows the user to remove an addr (identity)
     * from his addresses book. A detailed description of how the
     * unlinking works in each case in detailed below in the function's
     * code blocks (1, 2a-b, & 3).
     *
     * @param jwk_n the caller's Arweave public key
     * @param sig verification message signed by the caller's pubkey
     * @param address the address to get unlinked
     *
     * @return state
     **/
    const address = input.address;
    const jwk_n = input?.jwk_n;
    const sig = input?.sig;

    _validateOwnerSyntax(jwk_n);
    await _verifyArSignature("user", jwk_n, sig);
    const userIndex = _getUserIndex(jwk_n);

    ContractAssert(userIndex >= 0, ERROR_INVALID_USER);

    const user = identities[userIndex];
    const addressIndex = user.addresses.findIndex(
      (addr) => addr["address"] === address
    );
    ContractAssert(addressIndex >= 0, ERROR_ADDRESS_NOT_OWNED);

    // 1- if the user has only 1 address linked, then remove his identity
    if (user.addresses.length === 1) {
      identities.splice(userIndex, 1);
      return { state };
    }

    // 2-a if the user has more than 1 addr linked (array of (un)verified addresses),
    // then first check if the to-unlink address is eq to the primary address,
    // if so, then search for the first non-primary verified address and assign it
    // to the primary_address property after unlinking the to-unlink primary address.
    // 2-b if no non-primary verified addresses were found, then set the primary_address to
    // any !primary_address address and user's validity to the address's validity.

    if (user.addresses.length > 1) {
      if (user.primary_address === address) {
        // 2-a
        const verifiedAddrInBook = user.addresses.find(
          (addr) => addr["address"] !== address && !!addr.is_verified
        );
        if (verifiedAddrInBook) {
          user.primary_address = verifiedAddrInBook.address;
          user.is_verified = true;

          user.addresses.splice(addressIndex, 1);
          user.last_modification = await _getTimestamp();

          return { state };
        }
        // 2-b
        const firstNonEqualAddr = user.addresses.find(
          (addr) => addr["address"] !== address
        );
        if (firstNonEqualAddr) {
          user.primary_address = firstNonEqualAddr.address;
          user.is_verified = firstNonEqualAddr.is_verified;

          user.addresses.splice(addressIndex, 1);
          user.last_modification = await _getTimestamp();

          return { state };
        }
      }
      // 3- if the to-unlink address is !== primary_address, then remove the to-unlink
      // from the `addresses` array
      user.addresses.splice(addressIndex, 1);
      user.last_modification = await _getTimestamp();
      return { state };
    }

    throw new ContractError(ERROR_ERROR_UNLINKING_ADDRESS);
  }

  if (input.function === "getIdentity") {
    const arweave_address = input.arweave_address;
    const primary_address = input.primary_address;

    if (arweave_address) {
      const identity = identities.find(
        (id) => id.arweave_address === arweave_address && id.is_verified
      );
      return {
        result: identity,
      };
    }

    if (primary_address) {
      const identity = identities.find(
        (id) => id.primary_address === primary_address && id.is_verified
      );
      return {
        result: identity,
      };
    }

    throw new ContractError(ERROR_FUNCTION_MISSING_ARGUMENTS);
  }

  // ADMIN FUNTIONS

  if (input.function === "evaluate") {
    /**
     * @dev it's an admin's function automated
     * by the Ark Protocol node. The function push the
     * node's evaluation result of an identity linkage
     * request into the contract's state. For the first
     * linkage verification of an identity, the AR address
     * (not public key) get assigned to the identity object.
     *
     * @param user_pubkey the pub key of the evaluated identity
     * @param admin_jwk_n the caller's Arweave public key (admin)
     * @param admin_sig verification message signed by the admin's pubkey
     * @param arweave_address the identity's Master address
     * @param evaluated_address the request's foreign addr
     * @param evaluation the evaluation's result
     *
     * @return state
     *
     **/
    const arweave_address = input.arweave_address;
    const user_pubkey = input.user_pubkey;
    const evaluated_address = input.evaluated_address;
    const evaluation = input.evaluation;
    const admin_jwk_n = input.admin_jwk_n;
    const admin_sig = input.admin_sig;

    _validateOwnerSyntax(user_pubkey);
    _validateOwnerSyntax(admin_jwk_n);
    arweave_address ? _validateArweaveAddress(arweave_address) : void 0;
    await _verifyArSignature("admin", admin_jwk_n, admin_sig);

    ContractAssert(
      [true, false].includes(evaluation),
      ERROR_INVALID_EVALUATION
    );

    const userIndex = _getUserIndex(user_pubkey);
    ContractAssert(userIndex >= 0, ERROR_INVALID_USER);

    const user = identities[userIndex];
    const evaluatedAddrIndex = user.addresses.findIndex(
      (addr) => addr["address"] === evaluated_address
    );
    ContractAssert(evaluatedAddrIndex >= 0, ERROR_ADDRESS_NOT_OWNED);

    ContractAssert(
      user.unevaluated_addresses.includes(evaluated_address),
      ERROR_ADDRESS_ALREADY_EVALUATED
    );

    const unevaluatedAddrIndex = user.unevaluated_addresses.findIndex(
      (addr) => addr === evaluated_address
    );

    if (user.primary_address === evaluated_address) {
      user.is_verified = evaluation;
    }

    if (!user.arweave_address) {
      // assign Arweave address for the
      // evaluation for new identities (1st linkage)
      user.arweave_address = arweave_address;
    }
    user.addresses[evaluatedAddrIndex].is_verified = evaluation;
    user.addresses[evaluatedAddrIndex].is_evaluated = true;
    //  remove the address from the unevalated_addresses array
    user.unevaluated_addresses.splice(unevaluatedAddrIndex, 1);

    user.last_modification = await _getTimestamp();

    if (evaluation) {
      verRequests.push(user.addresses[evaluatedAddrIndex].verification_req);
    }

    return { state };
  }

  if (input.function === "addNetwork") {
    /**
     * @dev append a new KEY for a newly supported network.
     *
     * @param jwk_n the caller's Arweave public key (admin)
     * @param sig verification message signed by the caller's pubkey
     * @param network_key the new network's KEY
     * @param type network's type ("EVM" or "EXOTIC")
     *
     * @return state
     *
     **/
    const jwk_n = input.jwk_n;
    const sig = input.sig;
    const network_key = input.network_key;
    const type = input.type;

    await _verifyArSignature("admin", jwk_n, sig);

    ContractAssert(
      !networks.includes(network_key),
      ERROR_NETWORK_ALREADY_ADDED
    );
    ContractAssert(
      ["EVM", "EXOTIC"].includes(type),
      ERROR_INVALID_NETWORK_TYPE
    );

    type === "EVM"
      ? evm_networks.push(network_key)
      : exotic_networks.push(network_key);

    return { state };
  }

  if (input.function === "removeNetwork") {
    /**
     * @dev remove a network support from the networks array
     *
     * @param jwk_n the caller's Arweave public key (admin)
     * @param sig verification message signed by the caller's pubkey
     * @param network_key the KEY of the network to be removed
     * @param type network's type ("EVM" or "EXOTIC")
     *
     * @return state
     *
     **/
    const jwk_n = input.jwk_n;
    const sig = input.sig;
    const network_key = input.network_key;
    const type = input.type;

    await _verifyArSignature("admin", jwk_n, sig);
    ContractAssert(networks.includes(network_key), ERROR_NETWORK_NOT_FOUND);
    ContractAssert(
      ["EVM", "EXOTIC"].includes(type),
      ERROR_INVALID_NETWORK_TYPE
    );

    const networkIndex =
      type === "EVM"
        ? evm_networks.findIndex((net) => net === network_key)
        : exotic_networks.findIndex((net) => net === network_key);

    type === "EVM"
      ? evm_networks.splice(networkIndex, 1)
      : exotic_networks.splice(networkIndex, 1);

    return { state };
  }

  if (input.function === "modifySigMsg") {
    /**
     * @dev update the messages string literal used
     * for caller's validation. The last message
     * in the messages array is used for signatures verification
     *
     * @param jwk_n the caller's Arweave public key (admin)
     * @param sig verification message signed by the caller's pubkey
     * @param type the message reference (user or admin)
     * @param action modification action (add or remove)
     * @param message the new validation message string literal
     *
     * @return state
     *
     **/
    const jwk_n = input.jwk_n;
    const sig = input.sig;
    const type = input.type;
    const action = input.action;
    const message = input.message;

    _validateOwnerSyntax(jwk_n);
    await _verifyArSignature("admin", jwk_n, sig);
    ContractAssert(["user", "admin"].includes(type), ERROR_INVALID_SIG_TYPE);
    ContractAssert(
      ["add", "remove"].includes(action),
      ERROR_INVALID_MODIFICATION_ACTION
    );

    if (action === "add") {
      const property = `${type}_sig_messages`;
      ContractAssert(
        typeof message === "string" && message.length,
        ERROR_INVALID_SIG_MESSAGE_BODY
      );
      state[property].push(message);
      return { state };
    }

    const messagesArray = state[`${type}_sig_messages`];
    const messageIndex = messagesArray.findIndex((msg) => msg === message);
    ContractAssert(messageIndex >= 0, ERROR_MESSAGE_NOT_FOUND);
    messagesArray.splice(messageIndex, 1);
    return { state };
  }

  // HELPER FUNCTIONS

  function _validateArweaveAddress(address) {
    ContractAssert(
      /[a-z0-9_-]{43}/i.test(address),
      ERROR_INVALID_ARWEAVE_ADDRESS
    );
  }

  function _validateOwnerSyntax(owner) {
    ContractAssert(
      typeof owner === "string" && owner?.length === 683,
      ERROR_INVALID_JWK_N_SYNTAX
    );
  }

  function _getUserIndex(pub_key) {
    const index = identities.findIndex((usr) => usr.public_key === pub_key);
    return index;
  }

  function _validateAddrSig(address, signature, network) {
    _validateNetwork(network);

    if (evm_networks.includes(network)) {
      _validateEvmAddress(address);
      _validateEvmTx(signature);
    }

    // exotic networks are not checked syntactically
    ContractAssert(typeof signature === "string" && signature.length, ERROR_INVALID_DATA_TYPE)
  }

  function _validateEvmAddress(address) {
    ContractAssert(typeof address === "string", ERROR_INVALID_DATA_TYPE);
    ContractAssert(
      /^0x[a-fA-F0-9]{40}$/.test(address),
      ERROR_INVALID_EVM_ADDRESS_SYNTAX
    );
  }

  function _validateEvmTx(txid) {
    ContractAssert(typeof txid === "string", ERROR_INVALID_DATA_TYPE);
    ContractAssert(
      /^0x([A-Fa-f0-9]{64})$/.test(txid),
      ERROR_INVALID_EVM_TXID_SYNTAX
    );
  }

  function _checkSignature(txid) {
    if (verRequests.includes(txid)) {
      throw new ContractError(ERROR_VER_ID_ALREADY_USED);
    }
  }

  function _validateNetwork(network) {
    ContractAssert(networks.includes(network), ERROR_INVALID_NETWORK_SUPPLIED);
  }

  function _resolveNetwork(network) {
    const key = evm_networks.includes(network) ? "EVM" : "EXOTIC";
    return key;
  }

  function _checkAddrUsageDuplication(address) {
    const isDuplicated = identities.findIndex((user) =>
      user.addresses.find(
        (addr) =>
          addr["address"]?.toUpperCase() === address.toUpperCase() &&
          !!addr.is_verified
      )
    );
    ContractAssert(isDuplicated < 0, ERROR_ADDRESS_ALREADY_USED);
  }

  function _linkageFatFinger(address, caller_index) {
    const fatFinger = state.identities[caller_index].addresses.findIndex(
      (addr) => addr["address"] === address
    );
    ContractAssert(fatFinger < 0, ERROR_ADDRESS_ALREADY_USED_FOR_LINKAGE);
  }

  async function _getTimestamp() {
    try {
      return EXM.getDate().getTime();
    } catch (error) {
      return null;
    }
  }

  async function _verifyArSignature(type, owner, signature) {
    try {
      ContractAssert(["user", "admin"].includes(type), ERROR_INVALID_SIG_TYPE);

      const sigBody =
        type === "user" ? state.user_sig_messages : state.admin_sig_messages;

      if (type === "admin") {
        ContractAssert(owner === state.contract_admin, ERROR_CALLER_NOT_ADMIN);
      }
      const encodedMessage = new TextEncoder().encode(
        `${sigBody[sigBody.length - 1]}${owner}`
      );
      const typedArraySig = Uint8Array.from(atob(signature), (c) =>
        c.charCodeAt(0)
      );
      const isValid = await SmartWeave.arweave.crypto.verify(
        owner,
        encodedMessage,
        typedArraySig
      );

      ContractAssert(isValid, ERROR_INVALID_CALLER_SIGNATURE);
      ContractAssert(
        !state.signatures.includes(signature),
        ERROR_SIGNATURE_ALREADY_USED
      );
      state.signatures.push(signature);
    } catch (error) {
      throw new ContractError(ERROR_INVALID_CALLER_SIGNATURE);
    }
  }
}
