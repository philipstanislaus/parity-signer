import { NetworkProtocols, NETWORK_LIST, SubstrateNetworkKeys } from '../constants';

export function accountId({
  address,
  networkKey
}) {
  if (typeof address !== 'string' || address.length === 0 || !networkKey || !NETWORK_LIST[networkKey]) {
    throw new Error(`Couldn't create an accountId. Address or networkKey missing, or network key was invalid.`);
  }
  console.log(address);
  const { ethereumChainId='', protocol, genesisHash='' } = NETWORK_LIST[networkKey];

  if (protocol === NetworkProtocols.SUBSTRATE) {
    return `${protocol}:${address}:${genesisHash}`;
  } else {
    return `${protocol}:0x${address.toLowerCase()}@${ethereumChainId}`;
  }
}

export function empty(account = {}) {
  return {
    address: '',
    createdAt: new Date().getTime(),
    derivationPassword: '',
    derivationPath:'',
    encryptedSeed: null,
    name: '',
    networkKey: SubstrateNetworkKeys.KUSAMA,
    seed: '',
    seedPhrase: '',
    updatedAt: new Date().getTime(),
    validBip39Seed: false,
    ...account
  };
}

export function validateSeed(seed, validBip39Seed) {
  if (seed.length === 0) {
    return {
      accountRecoveryAllowed: false,
      reason: `A seed phrase is required.`,
      valid: false
    };
  }

  const words = seed.split(' ');

  for (let word of words) {
    if (word === '') {
      return {
        accountRecoveryAllowed: true,
        reason: `Extra whitespace found.`,
        valid: false
      };
    }
  }

  if (!validBip39Seed) {
    return {
      accountRecoveryAllowed: true,
      reason: `This recovery phrase will be treated as a legacy Parity brain wallet.`,
      valid: false
    };
  }

  return {
    reason: null,
    valid: true
  };
}
