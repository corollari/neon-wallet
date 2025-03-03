// @flow
import { wallet } from '@cityofzion/neon-js'
import { noop } from 'lodash-es'
import { createActions } from 'spunky'
import dns from 'dns'

import { bindArgsFromN } from '../util/bindHelpers'
import { resetBalanceState } from './balancesActions'
import { upgradeNEP6AddAddresses } from '../core/account'
import { validatePassphraseLength } from '../core/wallet'
import { ledgerNanoSCreateSignatureAsync } from '../ledger/ledgerNanoS'

type WifLoginProps = {
  wif: string,
}

type WatchOnlyLoginProps = {
  address: string,
}

type LedgerLoginProps = {
  publicKey: string,
  signingFunction: Function,
  account: number,
}

type Nep2LoginProps = {
  passphrase: string,
  encryptedWIF: string,
}

type AccountType = ?{
  address: string,
  wif?: string,
  publicKey?: string,
  signingFunction?: Function,
  isHardwareLogin: boolean,
  isWatchOnly?: boolean,
  hasInternetConnectivity: boolean,
}

export const ID = 'auth'

export const checkForInternetConnectivity = (): Promise<boolean> =>
  new Promise(resolve => {
    dns.resolve('google.com', 'A', err => {
      if (err) {
        return resolve(false)
      }
      return resolve(true)
    })
  })

export const wifLoginActions = createActions(
  ID,
  ({ wif }: WifLoginProps) => async (): Promise<AccountType> => {
    if (!wallet.isWIF(wif) && !wallet.isPrivateKey(wif)) {
      throw new Error('Invalid private key entered')
    }

    const account = new wallet.Account(wif)
    const hasInternetConnectivity = await checkForInternetConnectivity()

    return {
      wif: account.WIF,
      address: account.address,
      isHardwareLogin: false,
      hasInternetConnectivity,
    }
  },
)

export const watchOnlyLoginActions = createActions(
  ID,
  ({ address }: WatchOnlyLoginProps) => async (): Promise<AccountType> => {
    if (!wallet.isAddress(address)) {
      throw new Error('Invalid public key entered')
    }
    const hasInternetConnectivity = await checkForInternetConnectivity()

    return {
      address,
      isHardwareLogin: false,
      isWatchOnly: true,
      hasInternetConnectivity,
    }
  },
)

export const nep2LoginActions = createActions(
  ID,
  ({ passphrase, encryptedWIF }: Nep2LoginProps) => async (): Promise<
    AccountType,
  > => {
    if (!validatePassphraseLength(passphrase)) {
      throw new Error('Passphrase too short')
    }

    if (!wallet.isNEP2(encryptedWIF)) {
      throw new Error('Invalid encrypted key entered')
    }

    const wif = await wallet.decryptAsync(encryptedWIF, passphrase)
    const account = new wallet.Account(wif)

    await upgradeNEP6AddAddresses(encryptedWIF, wif)

    const hasInternetConnectivity = await checkForInternetConnectivity()

    return {
      wif: account.WIF,
      address: account.address,
      isHardwareLogin: false,
      hasInternetConnectivity,
    }
  },
)

export const ledgerLoginActions = createActions(
  ID,
  ({ publicKey, account }: LedgerLoginProps) => async (): Promise<
    AccountType,
  > => {
    const publicKeyEncoded = wallet.getPublicKeyEncoded(publicKey)
    const walletAccount = new wallet.Account(publicKeyEncoded)
    const hasInternetConnectivity = await checkForInternetConnectivity()

    return {
      publicKey,
      address: walletAccount.address,
      signingFunction: bindArgsFromN(
        ledgerNanoSCreateSignatureAsync,
        3,
        account,
      ),
      isHardwareLogin: true,
      hasInternetConnectivity,
    }
  },
)

export const logoutActions = createActions(ID, () => (): AccountType => {
  resetBalanceState()
  return null
})

// TODO: Better way to expose action data than to make a faux function?  One idea is to change
//       `withData` to accept the `ID` exported from this file instead of a generated action.
export default createActions(ID, () => () => noop)
