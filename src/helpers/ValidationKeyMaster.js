import KeyPathHelper from '../helpers/KeyPathHelper'
import KeyMaster from '../helpers/KeyMaster'
import DataFormatHelper from '../helpers/DataFormatHelper'
import { NativeModules } from 'react-native'
import AppConfig from '../AppConfig'
import LogStore from '../stores/LogStore'
import FlashNotification from '../components/common/FlashNotification'

/**
 * This method will generate a key object based on either
 * the nextIndex or a passed in index. This function MUST be used
 * when recovering first gen legacy validation keys. As of the 1.8 ndau wallet
 * we started to SetValidation (or now SetValidation). In doing this
 * we generate a validation key. The key generated in this method
 * is what was used initially. The path of the keys are:
 *
 * /44'/20036'/100/x/44'/20036'/2000/y
 *
 * where x is the accounts index and y will be the validation key
 * index.
 *
 * @param {Wallet} wallet
 * @param {Account} account
 * @param {number} index
 */
const _generateLegacy1ValidationKey = async (wallet, account, index) => {
  if (!index) {
    index = DataFormatHelper.getNextPathIndex(
      wallet,
      KeyPathHelper.legacyValidationKeyPath1()
    )
  }
  const keyPath = KeyPathHelper.legacyValidationKeyPath1() + `/${index}`

  const validationPrivateKey = await NativeModules.KeyaddrManager.deriveFrom(
    wallet.keys[account.ownershipKey].privateKey,
    '/',
    keyPath
  )

  const validationPublicKey = await NativeModules.KeyaddrManager.toPublic(
    validationPrivateKey
  )

  const actualPath = wallet.keys[account.ownershipKey].path + keyPath
  return KeyMaster.createKey(
    validationPrivateKey,
    validationPublicKey,
    actualPath
  )
}

/**
 * This is the correct method to use for generating the second generation of
 * validation keys. The path for a validation key is as follows:
 *
 * `/44'/20036'/100/10000/x/y
 *
 * where x is the accounts index and y will be the validation key index
 *
 * @param {Wallet} wallet
 * @param {Account} account
 * @param {number} index
 */
const _generateLegacy2ValidationKey = async (wallet, account, index) => {
  const privateValidationRootKey = await NativeModules.KeyaddrManager.deriveFrom(
    wallet.keys[wallet.accountCreationKeyHash].privateKey,
    KeyPathHelper.accountCreationKeyPath(),
    KeyPathHelper.legacyValidationKeyPath2()
  )

  const keyPath = KeyPathHelper.getLegacy2AccountValidationKeyPath(
    wallet,
    account,
    index
  )

  const validationPrivateKey = await NativeModules.KeyaddrManager.deriveFrom(
    privateValidationRootKey,
    KeyPathHelper.getLegacy2RootAccountValidationKeyPath(wallet, account),
    keyPath
  )

  const validationPublicKey = await NativeModules.KeyaddrManager.toPublic(
    validationPrivateKey
  )

  return KeyMaster.createKey(validationPrivateKey, validationPublicKey, keyPath)
}

/**
 * This is the correct method to use for generating validation keys.
 * The path for a validation key is as follows:
 *
 * `/44'/20036'/100/10000'/x'/y
 *
 * where x is the accounts index and y will be the validation key index
 *
 * @param {Wallet} wallet
 * @param {Account} account
 * @param {number} index
 */
const _generateValidationKey = async (wallet, account, index) => {
  const privateValidationRootKey = await NativeModules.KeyaddrManager.deriveFrom(
    wallet.keys[wallet.accountCreationKeyHash].privateKey,
    KeyPathHelper.accountCreationKeyPath(),
    KeyPathHelper.validationKeyPath()
  )

  const keyPath = KeyPathHelper.getAccountValidationKeyPath(
    wallet,
    account,
    index
  )

  const validationPrivateKey = await NativeModules.KeyaddrManager.deriveFrom(
    privateValidationRootKey,
    KeyPathHelper.validationKeyPath(),
    keyPath
  )

  const validationPublicKey = await NativeModules.KeyaddrManager.toPublic(
    validationPrivateKey
  )

  return KeyMaster.createKey(validationPrivateKey, validationPublicKey, keyPath)
}

/**
 * Create a validation key given the wallet and account passed in.
 * The wallet is updated directly in this function so there is no need
 * for a return arguement.
 *
 * @param {Wallet} wallet
 * @param {Account} account
 */
const addValidationKey = async (wallet, account) => {
  const key = await _generateValidationKey(wallet, account)

  addThisValidationKey(account, wallet, key.privateKey, key.publicKey, key.path)
}

const addThisValidationKey = (
  account,
  wallet,
  validationPrivateKey,
  validationPublicKey,
  keyPath
) => {
  if (!keyPath) {
    const nextIndex = DataFormatHelper.getNextPathIndex(
      wallet,
      KeyPathHelper.getRootAccountValidationKeyPath()
    )
    keyPath = KeyPathHelper.getRootAccountValidationKeyPath() + `/${nextIndex}`
  }
  const validationKeyHash = DataFormatHelper.create8CharHash(
    validationPrivateKey
  )
  wallet.keys[validationKeyHash] = KeyMaster.createKey(
    validationPrivateKey,
    validationPublicKey,
    keyPath
  )
  if (!account.validationKeys.includes(validationKeyHash)) {
    account.validationKeys.push(validationKeyHash)
  }
}

/**
 * This function will return possible validation keys within a
 * keys object. This is used during recovery of validation keys
 *
 *
 * @param {Wallet} wallet
 * @param {Account} account
 * @param {number} startIndex what index in the derivation path to
 * start searching for validation keys
 * @param {number} endIndex what index in the derivation path to
 * end the search for validation keys
 * @param {boolean} legacy
 */
const getValidationKeys = async (
  wallet,
  account,
  startIndex,
  endIndex,
  legacy
) => {
  const keys = {}

  try {
    for (let i = startIndex; i <= endIndex; i++) {
      if (legacy) {
        const key1 = await _generateLegacy1ValidationKey(wallet, account, i)
        keys[key1.publicKey] = key1

        const key2 = await _generateLegacy2ValidationKey(wallet, account, i)
        keys[key2.publicKey] = key2
      } else {
        const key = await _generateValidationKey(wallet, account, i)
        keys[key.publicKey] = key
      }
    }
  } catch (error) {
    FlashNotification.showError(
      `problem encountered creating object of validation public and private keys: ${
        error.message
      }`
    )
    throw error
  }

  return keys
}

/**
 * Given the validation keys passed in, iterate the wallet to recover
 * the private keys if not present. The search firsts looks in the
 * legacy validation location:
 *
 * /44'/20036'/100/x/44'/20036'/2000/y
 *
 * where x is the accounts index and y will be the validation key
 * index.
 *
 * We then search in the proper/current validation location:
 *
 * `/44'/20036'/100/10000/x/y
 *
 * where x is the accounts index and y will be the validation key index
 *
 * @param {Wallet} wallet
 * @param {Account} account
 * @param {Array} validationKeys
 * @returns {Key} key genereated
 */
const recoveryValidationKey = async (wallet, account, validationKeys) => {
  if (
    validationKeys &&
    account.validationKeys &&
    validationKeys.length !== account.validationKeys.length
  ) {
    LogStore.log(
      `Attempting to find the private key for the public validation key we have...`
    )
    for (const validationKey of validationKeys) {
      let startIndex = AppConfig.VALIDATION_KEY_SEARCH_START_INDEX
      let endIndex = AppConfig.NUMBER_OF_KEYS_TO_GRAB_ON_RECOVERY
      let found = false
      // Use a counter to prevent infinite search
      let counter = 0

      do {
        let validationKeys = await getValidationKeys(
          wallet,
          account,
          startIndex,
          endIndex
        )
        found = _checkValidationKeys(
          wallet,
          account,
          validationKeys,
          validationKey,
          found
        )

        // NOW check the legacy keys
        validationKeys = await getValidationKeys(
          wallet,
          account,
          startIndex,
          endIndex,
          true
        )
        found = _checkValidationKeys(
          wallet,
          account,
          validationKeys,
          validationKey,
          found
        )

        startIndex += AppConfig.NUMBER_OF_KEYS_TO_GRAB_ON_RECOVERY
        endIndex += AppConfig.NUMBER_OF_KEYS_TO_GRAB_ON_RECOVERY

        counter++
      } while (
        !found &&
        // go until we hit the configured max
        counter < AppConfig.VALIDATION_KEY_SEARCH_ITERATION_MAX
      )
    }
  }
}

const _checkValidationKeys = (
  wallet,
  account,
  validationKeys,
  validationKey,
  found
) => {
  const validationPublicKeys = Object.keys(validationKeys)
  for (const validationPublicKey of validationPublicKeys) {
    if (validationKey === validationPublicKey) {
      LogStore.log('Found a match, adding validation keys to the wallet')
      addThisValidationKey(
        account,
        wallet,
        validationKeys[validationPublicKey].privateKey,
        validationPublicKey,
        validationKeys[validationPublicKey].path
      )
      found = true
      break
    }
  }
  return found
}

export default {
  addValidationKey,
  recoveryValidationKey
}
