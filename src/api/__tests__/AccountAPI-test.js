import OrderAPI from '../OrderAPI'
import AccountAPI from '../AccountAPI'
import data from '../data'
import MockHelper from '../../helpers/MockHelper'

const user = data.testUser

test('getAddressData should return something back', async () => {
  // fetch.mockResponses([services], [data.testAddressData])
  MockHelper.mockServiceDiscovery()
  MockHelper.mockAccountAPI()

  const ndau = await AccountAPI.getAddressData(user)

  expect(ndau).toBeDefined()
})

test('getMarketPrice should return something back', async () => {
  // fetch.mockResponses([services], [data.testMarketPrice])
  MockHelper.mockServiceDiscovery()
  MockHelper.mockMarketPriceAPI()

  const marketPrice = await OrderAPI.getMarketPrice()

  expect(marketPrice).toBeDefined()
})
