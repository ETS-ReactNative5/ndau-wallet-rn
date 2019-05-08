import AccountAPIHelper from '../AccountAPIHelper'
import data from '../../api/data'
import MockHelper from '../MockHelper'
import { NativeModules } from 'react-native'
import KeyMaster from '../KeyMaster'
import sinon from 'sinon'
import AppConfig from '../../AppConfig'
import KeyPathHelper from '../KeyPathHelper'

MockHelper.mockServiceDiscovery()
MockHelper.mockAccountsAPI()
MockHelper.mockAccountAPI()
MockHelper.mockEaiRate()
MockHelper.mockMarketPriceAPI()
MockHelper.mockSetValidationTx()
MockHelper.mockDelegateTx()

NativeModules.KeyaddrManager = {
  keyaddrWordsToBytes: jest.fn(),
  newKey: jest.fn(),
  child: jest.fn(),
  hardenedChild: jest.fn(),
  ndauAddress: jest.fn(),
  deriveFrom: jest.fn(),
  toPublic: jest.fn(),
  sign: jest.fn()
}

const deriveFromKey =
  'npvt8ard395saaaaafnu25p694rkaxkir29ux5quru9b6sq4m3au4gugm2riue5xuqyyeabkkdcz9mc688665xmid3kjbfrw628y7c5zit8vcz6x7hjuxgfeu4kasdf'

const deriveFrom = sinon.spy(NativeModules.KeyaddrManager, 'deriveFrom')
for (let i = 0; i < 30; i++) {
  deriveFrom
    .mockReturnValueOnce(deriveFromKey + 1)
    .mockReturnValueOnce(deriveFromKey + 2)
    .mockReturnValueOnce(deriveFromKey + 3)
    .mockReturnValueOnce(deriveFromKey + 4)
    .mockReturnValueOnce(deriveFromKey + 5)
    .mockReturnValueOnce(deriveFromKey + 6)
    .mockReturnValueOnce(deriveFromKey + 7)
    .mockReturnValueOnce(deriveFromKey + 8)
    .mockReturnValueOnce(deriveFromKey + 9)
    .mockReturnValueOnce(deriveFromKey + 0)
    .mockReturnValueOnce(deriveFromKey + 'a')
    .mockReturnValueOnce(deriveFromKey + 'b')
    .mockReturnValueOnce(deriveFromKey + 'c')
    .mockReturnValueOnce(deriveFromKey + 'd')
    .mockReturnValueOnce(deriveFromKey + 'e')
    .mockReturnValueOnce(deriveFromKey + 'f')
    .mockReturnValueOnce(deriveFromKey + 'g')
    .mockReturnValueOnce(deriveFromKey + 'h')
    .mockReturnValueOnce(deriveFromKey + 'i')
    .mockReturnValueOnce(deriveFromKey + 'h')
}

test('populateWalletWithAddressData populates wallet with data from the API', async () => {
  const wallet = data.testUser.wallets['7MP-4FV']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)

  expect(wallet).toBeDefined()
  expect(wallet.accounts).toBeDefined()
  expect(
    wallet.accounts['ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun']
      .addressData.balance
  ).toBe(420000000023)
  expect(
    wallet.accounts['ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz']
      .addressData.balance
  ).toBe(200000000002)
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
  ).toEqual(['ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz'])
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
  ).toBe('4,200.00')
  expect(
    AccountAPIHelper.accountNdauAmount(
      wallet.accounts['ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz']
        .addressData
    )
  ).toBe('2,000.00')
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
    '111,350.00000192'
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
  expect(AccountAPIHelper.currentPrice(16.92432746094448, totalNdau)).toBe(
    '$1,884,523.86'
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
  ).toBe('Account 2 ')
  expect(
    AccountAPIHelper.receivingEAIFrom(
      wallet.accounts['ndamm8kxzf9754axd24wrkh3agvj2cidx75wdfhjiufcjf55']
        .addressData
    )
  ).toBe('Account 4 ')
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

test('make sure we can populate validation keys if not present', async () => {
  const keyMaster = jest.spyOn(KeyMaster, 'getValidationKeys')
  keyMaster.mockReturnValue({
    npuba4jaftckeebijwfxqwdyk3nt9bjxek7dq2mx2kjfgpbkq7dmrpa3rep5bsp3362idhqsyaaaaabaff879kt39fvjd7nntqutczzu2hm6u7vr73uutw3gqjxeqvgyjzf2es8ry7fi: {
      publicKey:
        'npuba4jaftckeebijwfxqwdyk3nt9bjxek7dq2mx2kjfgpbkq7dmrpa3rep5bsp3362idhqsyaaaaabaff879kt39fvjd7nntqutczzu2hm6u7vr73uutw3gqjxeqvgyjzf2es8ry7fi',
      privateKey: 'pvtblah',
      path: `/44'/20036/blah`
    },
    npuba4jaftckeebijwfxqwdyk3nt9bjxek7dq2mx2kjfgpbkq7dmrpa3rep5bsp3362idhqsyaaaaabaff879kt39fvjd7nntqutczzu2hm6u7vr73uutw3gqjxeqvgyjzf2es8ry123: {
      publicKey:
        'npuba4jaftckeebijwfxqwdyk3nt9bjxek7dq2mx2kjfgpbkq7dmrpa3rep5bsp3362idhqsyaaaaabaff879kt39fvjd7nntqutczzu2hm6u7vr73uutw3gqjxeqvgyjzf2es8ry7fi',
      privateKey: 'pvtnope',
      path: `/44'/20036/nope`
    }
  })
  MockHelper.mockAccountsAPI(data.test7MP4FVAddressData)
  MockHelper.mockAccountAPI()
  const wallet = data.test7MP4FVUserData.wallets['2c963f83']

  await AccountAPIHelper.populateWalletWithAddressData(wallet)

  const validationKeys =
    wallet.accounts['ndae2m6h32eee2qci9fjhzmfxtpni6pizmks839npbqz8yq4']
      .validationKeys
  expect(wallet).toBeDefined()
  expect(validationKeys.length).toBe(2)
  expect(wallet.keys[validationKeys[0]].publicKey).toBe(
    'npuba4jaftckeebijwfxqwdyk3nt9bjxek7dq2mx2kjfgpbkq7dmrpa3rep5bsp3362idhqsyaaaaabaff879kt39fvjd7nntqutczzu2hm6u7vr73uutw3gqjxeqvgyjzf2es8ry7fi'
  )
  expect(wallet.keys[validationKeys[0]].privateKey).toBe('pvtblah')
})

test('make sure that lockBonusEAI sends back the correct percentage', async () => {
  expect(AccountAPIHelper.lockBonusEAI(45)).toBe(0)
  expect(AccountAPIHelper.lockBonusEAI(91)).toBe(1)
  expect(AccountAPIHelper.lockBonusEAI(199)).toBe(2)
  expect(AccountAPIHelper.lockBonusEAI(390)).toBe(3)
  expect(AccountAPIHelper.lockBonusEAI(734)).toBe(4)
  expect(AccountAPIHelper.lockBonusEAI(1098)).toBe(5)
})

test('make sure totalSpendableNdau subtracts the holds correctly', async () => {
  const accounts = data.test7MP4FVUserData.wallets['2c963f83'].accounts
  const totalNdau = AccountAPIHelper.accountTotalNdauAmount(accounts, false)
  expect(totalNdau).toEqual('1.21')
  const totalSpendable = AccountAPIHelper.totalSpendableNdau(
    accounts,
    totalNdau,
    false
  )
  expect(totalSpendable).toEqual('0.14')
})

test('make sure we get the correct total for send with all values', async () => {
  const amount = 23
  const transactionFee = 1
  const sibFee = 1
  const totalNdau = AccountAPIHelper.getTotalNdauForSend(
    amount,
    transactionFee,
    sibFee
  )
  expect(totalNdau).toEqual('25.00000000')
})

test('make sure we get the correct total with sib not tx fee', async () => {
  const amount = 23
  const transactionFee = 0
  const sibFee = 7
  const totalNdau = AccountAPIHelper.getTotalNdauForSend(
    amount,
    transactionFee,
    sibFee
  )
  expect(totalNdau).toEqual('30.00000000')
})

test('make sure we get the correct total with tx fee not sib', async () => {
  const amount = 23
  const transactionFee = 7
  const sibFee = 0
  const totalNdau = AccountAPIHelper.getTotalNdauForSend(
    amount,
    transactionFee,
    sibFee
  )
  expect(totalNdau).toEqual('30.00000000')
})

test('make sure we get the correct total for send with no tx fees', async () => {
  const amount = 23
  const transactionFee = 0
  const sibFee = 0
  const totalNdau = AccountAPIHelper.getTotalNdauForSend(
    amount,
    transactionFee,
    sibFee
  )
  expect(totalNdau).toEqual('23.00000000')
})

test('remainingBalanceNdau returns value', async () => {
  const account = { balance: 134962649000 }
  const amount = '100.5344'
  const remainingBalanceNdau = AccountAPIHelper.remainingBalanceNdau(
    account,
    amount,
    false,
    AppConfig.NDAU_DETAIL_PRECISION
  )
  expect(remainingBalanceNdau).toEqual('1249.09209000')
})

test('remainingBalanceNdau returns 0', async () => {
  const account = { balance: 134962649000 }
  const amount = '2349.5344'
  const remainingBalanceNdau = AccountAPIHelper.remainingBalanceNdau(
    account,
    amount,
    false,
    AppConfig.NDAU_DETAIL_PRECISION
  )
  expect(remainingBalanceNdau).toEqual('0')
})

test('addPrivateValidationKeyIfNotPresent used for genesis accounts, make sure it works', async () => {
  const wallet = {
    walletId: 'testwallet',
    accountCreationKeyHash: 'e58b438d',
    accounts: {
      ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun: {
        address: 'ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun',
        addressData: {
          nickname: 'Account 1',
          balance: 420000000023,
          validationKeys: [
            'npuba4jaftckeebbfznxrdsdk893xn64axz3fv5ayg8ygip6grpgeudqkfyij9kjbm2e4nw4waaaaaa6pmfcm6tvpiar9xgi3udqbbarv2g7i5dei6rj5ppw76zdjkyf5bqigdtzb361',
            'npuba4jaftckeebbfznxrdsdk893xn64axz3fv5ayg8ygip6grpgeudqkfyij9kjbm2e4nw4waaaaaa6pmfcm6tvpiar9xgi3udqbbarv2g7i5dei6rj5ppw76zdjkyf5bqigdtzb362'
          ],
          rewardsTarget: null,
          incomingRewardsFrom: [
            'ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz'
          ],
          delegationNode: null,
          lock: null,
          stake: null,
          lastEAIUpdate: 589991567000000,
          lastWAAUpdate: 589991567000000,
          weightedAverageAge: 0,
          sequence: 0,
          holds: null,
          recourseSettings: { period: 0, changesAt: null, next: null },
          validationScript: 'somestring'
        },
        ownershipKey: 'b32d1dfb',
        validationKeys: []
      }
    },
    keys: {
      e58b438d: {
        publicKey:
          'npuba8jaftcjed7stf8bkz3nnipyqahdau5vexjr52ez4wvcuusgimc7fjac52pbwa4fdissaaaanv2qizmsubdetvqmqys8fwvj4pw2b9vg9jire7cd3xm9cg74sc75yu44tbkhh23s',
        privateKey:
          'npvta8jaftcjed7stf8bkz3nnipyqahdau5vexjr52ez4wvcuusgimc7fjac52pbwa4fdissaaaanv2qizmsubdetvqmqys8fwvj4pw2b9vg9jire7cd3xm9cg74sc75yu44tbkhh23s',
        path: KeyPathHelper.accountCreationKeyPath(),
        derivedFromRoot: 'yes'
      },
      b32d1dfb: {
        publicKey:
          'npuba4jaftckeeb8m2xih7dbwsqndrt2hzz6k6xxvn3k48kss87uwuta2rbaj2dz7tie4nw4waaaaaahwni9kfku8detab44b4mqenf3qx4skffjxzfmgev5pipapeiaeqqbqsvdzkit',
        privateKey:
          'npvta8jaftcjed2vzrknnzf8fj83q6bsfqnf72q7pr4b4evxzgfgn24tznve5gcfkbgvfgxaaaaaab7dch4tkwzs3eiaqysqu5tdbqmxqwctjkpp3k3te85kdidjcabdu6fkrqkq356k',
        path: "/44'/20036'/100/0",
        derivedFromRoot: 'yes'
      },
      e54b7ece: {
        publicKey:
          'npuba4jaftckeebbfznxrdsdk893xn64axz3fv5ayg8ygip6grpgeudqkfyij9kjbm2e4nw4waaaaaa6pmfcm6tvpiar9xgi3udqbbarv2g7i5dei6rj5ppw76zdjkyf5bqigdtzb36x',
        privateKey:
          'npvta8jaftcjeai6tm5yy3j4ruh6tc9c2qgyt8jhijns3j9ib8i5jdhfvcpkj52tgbgvfgxaaaaaahdk3iu9en5kad97jugns5siid68bzkg23chd4q5mphrf24kxtq2mwu775a2cky7',
        path: "/44'/20036'/100/1",
        derivedFromRoot: 'yes'
      }
    }
  }
  const account = {
    address: 'ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun',
    addressData: {
      nickname: 'Account 1',
      balance: 420000000023,
      validationKeys: [
        'npuba4jaftckeebbfznxrdsdk893xn64axz3fv5ayg8ygip6grpgeudqkfyij9kjbm2e4nw4waaaaaa6pmfcm6tvpiar9xgi3udqbbarv2g7i5dei6rj5ppw76zdjkyf5bqigdtzb361',
        'npuba4jaftckeebbfznxrdsdk893xn64axz3fv5ayg8ygip6grpgeudqkfyij9kjbm2e4nw4waaaaaa6pmfcm6tvpiar9xgi3udqbbarv2g7i5dei6rj5ppw76zdjkyf5bqigdtzb362'
      ],
      rewardsTarget: null,
      incomingRewardsFrom: ['ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz'],
      delegationNode: null,
      lock: null,
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: 'somestring'
    },
    ownershipKey: 'b32d1dfb',
    validationKeys: []
  }

  await AccountAPIHelper.addPrivateValidationKeyIfNotPresent(wallet, account)

  expect(wallet).toBeDefined()
  expect(wallet.accounts).toBeDefined()
  expect(Object.keys(wallet.keys).length).toBe(4)
  expect(account.validationKeys.length).toBe(1)
})
