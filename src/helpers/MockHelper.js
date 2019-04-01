import services from '../api/services-for-testing.json'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import data from '../api/data'

const mock = new MockAdapter(axios)

const mockReset = () => {
  mock.reset()
}

const mockServiceDiscovery = () => {
  mock
    .onGet('https://s3.us-east-2.amazonaws.com/ndau-json/services-test.json')
    .reply(200, services)
}

const mockAccountsAPI = (testAddressData = data.testAddressData) => {
  mock
    .onPost('https://testnet-0.api.ndau.tech/account/accounts')
    .reply(200, testAddressData)
}

const mockAccountsAPIReplyOnce = (testAddressData = data.testAddressData) => {
  mock
    .onPost('https://testnet-0.api.ndau.tech/account/accounts')
    .replyOnce(200, testAddressData)
}

const mockAccountAPI = (
  testSingleAddressData = data.testSingleAddressData,
  address = 'tnaq9cjf54ct59bmua78iuv6gtpjtdunc78q8jebwgmxyacb'
) => {
  mock
    .onGet('https://testnet-0.api.ndau.tech/account/account/' + address)
    .reply(200, testSingleAddressData)
}

const mockMarketPriceAPI = () => {
  mock
    .onGet('https://testnet-0.api.ndau.tech/order/current')
    .reply(200, data.testMarketPrice)
}

const mockEaiRate = () => {
  mock
    .onPost('https://testnet-0.api.ndau.tech/account/eai/rate')
    .reply(200, data.eaiValueForDisplayResponse)
}

const mockClaimAccountTx = () => {
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/prevalidate/ClaimAccount')
    .reply(200, data.claimAccountTxRes)
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/submit/ClaimAccount')
    .reply(200, data.claimAccountTxRes)
}

const mockLockTx = () => {
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/prevalidate/Lock')
    .reply(200, data.lockTxRes)
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/submit/Lock')
    .reply(200, data.lockTxRes)
}

const mockNotifyTx = () => {
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/prevalidate/Notify')
    .reply(200, data.notifyTxRes)
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/submit/Notify')
    .reply(200, data.notifyTxRes)
}

const mockTransferTx = () => {
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/prevalidate/Transfer')
    .reply(200, data.transferTxRes)
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/submit/Transfer')
    .reply(200, data.transferTxRes)
}

const mockDelegateTx = () => {
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/prevalidate/Delegate')
    .reply(200, data.delegateTxRes)
  mock
    .onPost('https://testnet-0.api.ndau.tech/tx/submit/Delegate')
    .reply(200, data.delegateTxRes)
}

const mockAccountHistory = address => {
  mock
    .onGet(`https://testnet-0.api.ndau.tech/account/history/${address}`)
    .reply(200, data.accountHistoryRes)
}

const mockTransactionByHash = transactionHash => {
  mock
    .onGet(`https://testnet-0.api.ndau.tech/transaction/${transactionHash}`)
    .reply(200, data.transactionByHashRes)
}

export default {
  mockServiceDiscovery,
  mockAccountsAPI,
  mockMarketPriceAPI,
  mockEaiRate,
  mockClaimAccountTx,
  mockLockTx,
  mockNotifyTx,
  mockTransferTx,
  mockAccountHistory,
  mockTransactionByHash,
  mockDelegateTx,
  mockAccountAPI,
  mockReset,
  mockAccountsAPIReplyOnce
}
