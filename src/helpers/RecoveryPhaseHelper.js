import { NativeModules } from 'react-native'
import KeyAddrGenManager from '../keyaddrgen/KeyAddrGenManager'
import NdauNodeAPI from '../api/NdauNodeAPI'
import AppConfig from '../AppConfig'
import AppConstants from '../AppConstants'
import DataFormatHelper from './DataFormatHelper'

/**
 * First we check to see if there are a variable number of accounts existent
 * on the block chain using the root key. This is to support versions <= 1.6 of
 * the ndau wallet. The result of that call is stored in an array and we then
 * see if there are the same variable amount of accounts in the BIP44 address.
 * Once we have these if they both have nothing in them, we can assume the phrase
 * is incorrect. However, if either one of them do...we have a correct phrase and
 * we can then build a user from that information. The user build is passed back.
 *
 * @param  {string} recoveryPhraseString as a string of words, a sentence
 * @param  {string} user there is a possibility the user has already been created
 * @return {User} we either pass back null if nothing is found or a populated
 * user if we find information.
 */
const checkRecoveryPhrase = async (recoveryPhraseString, user) => {
  const recoveryPhraseBytes = await _getRecoveryStringAsBytes(
    recoveryPhraseString
  )

  // if we are recovering and there is no user we must use a
  // temp userId. It will be changed in the SetupWalletName screen
  let userId = AppConstants.TEMP_ID
  if (user) {
    const wallet = await KeyAddrGenManager.createWallet(
      recoveryPhraseBytes,
      null,
      userId
    )
    user.wallets[DataFormatHelper.create8CharHash(userId)] = wallet
  } else {
    user = await KeyAddrGenManager.createFirstTimeUser(
      recoveryPhraseBytes,
      userId
    )
  }

  const bip44Accounts = await _checkBIP44Addresses(recoveryPhraseBytes)
  console.log(`BIP44 accounts found: ${JSON.stringify(bip44Accounts, null, 2)}`)
  if (bip44Accounts && Object.keys(bip44Accounts).length > 0) {
    await KeyAddrGenManager.addAccountsToUser(
      recoveryPhraseBytes,
      user,
      Object.keys(bip44Accounts).length,
      undefined,
      userId
    )
    console.log(`user with BIP44: ${JSON.stringify(user, null, 2)}`)
  }

  const rootAccounts = await _checkRootAddresses(recoveryPhraseBytes)
  console.log(`root accounts found: ${JSON.stringify(rootAccounts, null, 2)}`)
  if (rootAccounts && Object.keys(rootAccounts).length > 0) {
    // Here again we are attempting to genereate at the very root of the tree
    await KeyAddrGenManager.addAccountsToUser(
      recoveryPhraseBytes,
      user,
      Object.keys(rootAccounts).length,
      '',
      userId
    )
    console.log(`user with root: ${JSON.stringify(user, null, 2)}`)
  }

  return user
}

const _getRecoveryStringAsBytes = async recoveryPhraseString => {
  return await NativeModules.KeyaddrManager.keyaddrWordsToBytes(
    AppConstants.APP_LANGUAGE,
    recoveryPhraseString
  )
}

const _checkRootAddresses = async recoveryPhraseBytes => {
  const addresses = await KeyAddrGenManager.getRootAddresses(
    recoveryPhraseBytes
  )
  console.log(`_checkRootAddresses found: ${addresses}`)
  // check the blockchain to see if any of these exist
  const accountData = await NdauNodeAPI.getAddressData(addresses)
  return accountData
}

const _checkBIP44Addresses = async recoveryPhraseBytes => {
  const addresses = await KeyAddrGenManager.getBIP44Addresses(
    recoveryPhraseBytes
  )
  console.log(`_checkBIP44Addresses found: ${addresses}`)
  // check the blockchain to see if any of these exist
  const accountData = await NdauNodeAPI.getAddressData(addresses)
  return accountData
}

export default {
  checkRecoveryPhrase
}
