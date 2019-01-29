import { NativeModules } from 'react-native'
import KeyMaster from '../helpers/KeyMaster'
import TransactionAPI from '../api/TransactionAPI'
import TxSignPrep from '../model/TxSignPrep'
import FlashNotification from '../components/FlashNotification'
import APIAddressHelper from '../helpers/APIAddressHelper'

class Transaction {
  static CLAIM_ACCOUNT = 'ClaimAccount'
  static LOCK = 'Lock'

  constructor (wallet, account, type, period) {
    this._wallet = wallet
    this._account = account
    this._keys = wallet.keys
    this._type = type
    this._period = period
    this._jsonTransaction = {}
    this._submitAddress = ''
    this._prevalidateAddress = ''

    if (!this._wallet || !this._account || !this._type) {
      throw new Error('You must pass wallet, account and type')
    }
  }

  _createSubmissionAddress = async () => {
    this._submitAddress =
      (await APIAddressHelper.getTransactionSubmitAPIAddress()) +
      '/' +
      this._type
  }

  _createPrevalidateAddress = async () => {
    this._prevalidateAddress =
      (await APIAddressHelper.getTransactionPrevalidateAPIAddress()) +
      '/' +
      this._type
  }

  /**
   * Create a transaction and store information internally
   */
  create = async () => {
    try {
      // Create the prevalidate and submission addresses
      await this._createPrevalidateAddress()
      await this._createSubmissionAddress()

      // ok...if we got here we can assume we do NOT have a validation
      // key, so we need that to call KeyaddrManager.sign...so create it
      // but only if there are none present. This business logic may
      // change in the future, but for now, we only create one validation
      // key per account here
      if (this._account.validationKeys.length === 0) {
        await KeyMaster.addValidationKey(this._wallet, this._account)
      }

      if (
        !this._account.validationKeys ||
        this._account.validationKeys.length === 0
      ) {
        throw Error('No validation keys present')
      }
      if (isNaN(this._account.addressData.sequence)) {
        throw Error('No sequence found in addressData')
      }

      const validationKeys = []
      this._account.validationKeys.forEach(validationKeyHash => {
        validationKeys.push(this._keys[validationKeyHash].publicKey)
      })

      // SEQUENCE needs to be gotten from a utility/helper from
      // blockchain directly
      this._jsonTransaction = {
        target: this._account.address,
        sequence: this._account.addressData.sequence + 1
      }

      if (this._type === Transaction.CLAIM_ACCOUNT) {
        this._jsonTransaction.ownership = this._keys[
          this._account.ownershipKey
        ].publicKey
        this._jsonTransaction.validation_keys = validationKeys
      }

      if (this._period) {
        this._jsonTransaction.period = this._period
      }

      return this._jsonTransaction
    } catch (error) {
      console.warn(`Error from blockchain: ${error.message}`)
      FlashNotification.showError(
        `Problem occurred sending a claim transaction for ${
          this._account.addressData.nickname
        }`
      )
      throw new Error(error.message)
    }
  }

  /**
   * Sign the transaction for prevalidation and submission. You must
   * call `create` first before you call this method.
   */
  sign = async () => {
    try {
      // Here we get the ownership key to sign for ClaimAccount. This is
      // the ONLY time we use the ownershipKey. Any subsequent/other
      // transactions use the validationKey within the account
      console.debug(`key to use for signature is ${this._keyToUse}`)
      const privateKeyFromHash = KeyMaster.getPrivateKeyFromHash(
        this._wallet,
        this._type === Transaction.CLAIM_ACCOUNT
          ? this._account.ownershipKey
          : this._account.validationKeys[0]
      )

      // Use the TxSignPrep to get it ready to send
      const preparedTransaction = new TxSignPrep().prepare(
        this._jsonTransaction
      )
      const base64EncodedPrepTx = preparedTransaction.b64encode()

      // Get the signature to use in the claim transaction
      const signature = await NativeModules.KeyaddrManager.sign(
        privateKeyFromHash,
        base64EncodedPrepTx
      )

      console.debug(`signature from KeyaddrManager.sign is ${signature}`)
      if (this._type === Transaction.CLAIM_ACCOUNT) {
        this._jsonTransaction.signature = signature
      } else {
        this._jsonTransaction.signatures = [signature]
      }
    } catch (error) {
      console.warn(`Error from blockchain: ${error.message}`)
      FlashNotification.showError(
        `Problem occurred sending a claim transaction for ${
          this._account.addressData.nickname
        }`
      )
      throw new Error(error.message)
    }
  }

  /**
   * Send this transaction to the blockchain to see if all is well.
   * You must first call `create` and `sign` before you call this. If all
   * is well you can then call `submit`.
   */
  prevalidate = async () => {
    try {
      const response = await TransactionAPI.prevalidate(
        this._prevalidateAddress,
        this._jsonTransaction
      )
      if (response.err) {
        console.warn(`Error from blockchain: ${response.err}`)
        FlashNotification.showError(
          `Problem occurred sending a claim transaction for ${
            this._account.addressData.nickname
          }`
        )
        throw new Error(response.err)
      } else {
        return response
      }
    } catch (error) {
      console.warn(`Error from blockchain: ${error.message}`)
      FlashNotification.showError(
        `Problem occurred sending a claim transaction for ${
          this._account.addressData.nickname
        }`
      )
      throw new Error(error.message)
    }
  }

  /**
   * This is the last call that you should make. You must call
   * `create`, `sign` and `prevalidate` before you `submit` to
   * the blockchain.
   */
  submit = async () => {
    try {
      const response = await TransactionAPI.submit(
        this._submitAddress,
        this._jsonTransaction
      )
      if (response.err) {
        console.warn(`Error from blockchain: ${response.err}`)
        FlashNotification.showError(
          `Problem occurred sending a claim transaction for ${
            this._account.addressData.nickname
          }`
        )
        throw new Error(response.err)
      } else {
        return response
      }
    } catch (error) {
      console.warn(`Error from blockchain: ${error.message}`)
      FlashNotification.showError(
        `Problem occurred sending a claim transaction for ${
          this._account.addressData.nickname
        }`
      )
      throw new Error(error.message)
    }
  }
}

export default Transaction
