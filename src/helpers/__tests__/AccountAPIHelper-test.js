import AccountAPIHelper from '../AccountAPIHelper'
import data from '../../api/data'
import MockHelper from '../MockHelper'

MockHelper.mockServiceDiscovery()
MockHelper.mockAccountAPI()
MockHelper.mockEaiRate()
MockHelper.mockMarketPriceAPI()

test('populateWalletWithAddressData populates wallet with data from the API', async () => {
  const wallet = data.testUser.wallets['7MP-4FV']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)

  expect(wallet).toBeDefined()
  expect(wallet.accounts).toBeDefined()
  expect(
    wallet.accounts['ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun']
      .addressData.balance
  ).toBe(4200000000.23)
  expect(
    wallet.accounts['ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz']
      .addressData.balance
  ).toBe(20000000000.2)
  expect(
    wallet.accounts['ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun']
      .addressData.lock
  ).toBe(null)
  expect(
    wallet.accounts['ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz']
      .addressData.lock.noticePeriod
  ).toBe(2592000000000)
  expect(
    wallet.accounts['ndamm8kxzf9754axd24wrkh3agvj2cidx75wdfhjiufcjf55']
      .addressData.lock.unlocksOn
  ).toBe(1585886400000)
  expect(
    wallet.accounts['ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun']
      .addressData.rewardsTarget
  ).toBe(null)
  expect(
    wallet.accounts['ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun']
      .addressData.incomingRewardsFrom
  ).toBe('ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz')
})

test('make sure we can get the amount of ndau per account', async () => {
  const wallet = data.testUser.wallets['7MP-4FV']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)

  expect(wallet).toBeDefined()
  expect(
    AccountAPIHelper.accountNdauAmount(
      wallet.accounts['ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun']
        .addressData
    )
  ).toBe('42.000')
  expect(
    AccountAPIHelper.accountNdauAmount(
      wallet.accounts['ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz']
        .addressData
    )
  ).toBe('200.000')
})

test('make sure we can get the locked until date of ndau per account', async () => {
  const wallet = data.testUser.wallets['7MP-4FV']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)

  expect(wallet).toBeDefined()
  expect(
    AccountAPIHelper.accountLockedUntil(
      wallet.accounts['ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun']
        .addressData
    )
  ).toBe(null)
  expect(
    AccountAPIHelper.accountLockedUntil(
      wallet.accounts['ndamm8kxzf9754axd24wrkh3agvj2cidx75wdfhjiufcjf55']
        .addressData
    )
  ).toContain(' ')
})

test('make sure we can get the total amount of ndau for accounts', async () => {
  const wallet = data.testUser.wallets['7MP-4FV']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)

  expect(wallet).toBeDefined()
  expect(AccountAPIHelper.accountTotalNdauAmount(wallet.accounts)).toBe(
    '1,757.000'
  )
})

test('make sure we can get the current price of the users ndau', async () => {
  const wallet = data.testUser.wallets['7MP-4FV']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)
  const totalNdau = await AccountAPIHelper.accountTotalNdauAmount(
    wallet.accounts,
    false
  )

  expect(wallet).toBeDefined()
  expect(AccountAPIHelper.currentPrice(wallet.marketPrice, totalNdau)).toBe(
    '$29,736.04'
  )
})

test('make sure sending EAI has the nickname set correctly', async () => {
  const wallet = data.testUser.wallets['7MP-4FV']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)

  expect(wallet).toBeDefined()
  expect(
    AccountAPIHelper.sendingEAITo(
      wallet.accounts['ndanhgm5avd68gj9ufiwq7ttcsshxciupgz5i7nnzk68f67g']
        .addressData
    )
  ).toBe('Account 3')
  expect(
    AccountAPIHelper.sendingEAITo(
      wallet.accounts['ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz']
        .addressData
    )
  ).toBe('Account 1')
})

test('make sure receiving EAI has the nickname set correctly', async () => {
  const wallet = data.testUser.wallets['7MP-4FV']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)

  expect(wallet).toBeDefined()
  expect(
    AccountAPIHelper.receivingEAIFrom(
      wallet.accounts['ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun']
        .addressData
    )
  ).toBe('Account 2')
  expect(
    AccountAPIHelper.receivingEAIFrom(
      wallet.accounts['ndamm8kxzf9754axd24wrkh3agvj2cidx75wdfhjiufcjf55']
        .addressData
    )
  ).toBe('Account 4')
})

test('if we can get the correct EAI rate from what comes back, make sure we round it', async () => {
  const account = {
    eaiValueForDisplay: 74200000000
  }

  expect(AccountAPIHelper.eaiValueForDisplay(account)).toBe(7)
})

test('if we can get the correct EAI rate from what comes back, rate a bit higher and rounds up', async () => {
  const account = {
    eaiValueForDisplay: 126460000000
  }

  expect(AccountAPIHelper.eaiValueForDisplay(account)).toBe(13)
})

test('if we can get a null if not present', async () => {
  const account = {}

  expect(AccountAPIHelper.eaiValueForDisplay(account)).toBeFalsy()
})
