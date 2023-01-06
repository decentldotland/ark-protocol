export async function handle(state, action) {
  const input = action.input;

  const identities = state.identities;
  const message = state.message;
  const signatures = state.signatures;
  const deso_molecule_endpoint = state.deso_molecule_endpoint;
  let message_counter = state.message_counter;

  const ERROR_MISSING_REQUIRED_ARGUMENTS = `ERROR_FUNCTION_MISSING_NECESSARY_ARGUMENTS`;
  const ERROR_INVALID_ARWEAVE_ADDRESS = `ERROR_INVALID_ARWEAVE_ADDRESS_SYNTAX`;
  const ERROR_INVALID_CALLER = `ERROR_CALLER_IS_NOT_MESSAGE_SIGNER`;
  const ERROR_MOLECULE_CONNECTION = `ERROR_MOLECULE_SH_ERROR`;

  if (input.function === "linkIdentity") {
    const caller = input.caller;
    const signature = input.signature;
    const arweaveAddress = input.arweaveAddress;

    ContractAssert(
      caller && signature && arweaveAddress,
      ERROR_MISSING_REQUIRED_ARGUMENTS
    );
    ContractAssert(
      /[a-z0-9_-]{43}/i.test(arweaveAddress),
      ERROR_INVALID_ARWEAVE_ADDRESS
    );

    await _moleculeSignatureVerification(caller, signature);

    identities.push({
      address: caller,
      arweave_address: arweaveAddress,
      signature: signature,
    });

    return { state };
  }

  async function _moleculeSignatureVerification(caller, signature) {
    try {
      ContractAssert(!signatures.includes(signature));
      const isValid = await EXM.deterministicFetch(
        `${deso_molecule_endpoint}/auth/${caller}/${btoa(message + message_counter)}/${signature}`
      );
      ContractAssert(isValid.asJSON()?.result, ERROR_INVALID_CALLER);
      signatures.push(signature);
      state.message_counter += 1;
    } catch (error) {
      throw new ContractError(ERROR_MOLECULE_CONNECTION);
    }
  }
}
