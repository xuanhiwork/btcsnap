export enum SupportedCoins {
  BTC_LEGACY = 'BTC_LEGACY',
  BTC = 'BTC',
  BTC_NATIVE_SEGWIT = 'BTC_NATIVE_SEGWIT',
  BTC_TESTNET_SEGWIT = 'BTC_TESTNET_SEGWIT',
  BTC_TESTNET_LEGACY = 'BTC_TESTNET_LEGACY',
  BTC_TESTNET_NATIVE_SEGWIT = 'BTC_TESTNET_NATIVE_SEGWIT',
}

export const Coins = Object.values(SupportedCoins);