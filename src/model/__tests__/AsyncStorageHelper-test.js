import MockAsyncStorage from 'mock-async-storage'

import AsyncStorageHelper from '../AsyncStorageHelper'

const mock = () => {
  const mockImpl = new MockAsyncStorage()
  jest.mock('AsyncStorage', () => mockImpl)
}

mock()

describe('AsyncStorageHelper tests...', () => {
  it('should set one user', async () => {
    const user = {
      userId: 'ABC-123'
    }
    const password = 'abcd'

    await AsyncStorageHelper.lockUser(user, password)
    const user1 = {
      userId: 'ABC-123'
    }
    const password1 = 'abcd'
    const user2 = {
      userId: 'jimmy'
    }
    const password2 = 'jim'
    const user3 = {
      userId: 'ABC-123anything'
    }
    const password3 = 'anything'

    await AsyncStorageHelper.lockUser(user1, password1)
    await AsyncStorageHelper.lockUser(user2, password2)
    await AsyncStorageHelper.lockUser(user3, password3)

    await AsyncStorageHelper.unlockUser(user2.userId, password2).then(
      storedUser => {
        expect(storedUser).toEqual(user2)
      }
    )
  })

  it('should set 3 users and get all', async () => {
    const user1 = {
      userId: 'ABC-123'
    }
    const password1 = 'abcd'
    const user2 = {
      userId: 'jimmy'
    }
    const password2 = 'jim'
    const user3 = {
      userId: 'ABC-123anything'
    }
    const password3 = 'anything'

    await AsyncStorageHelper.lockUser(user1, password1)
    await AsyncStorageHelper.lockUser(user2, password2)
    await AsyncStorageHelper.lockUser(user3, password3)

    await AsyncStorageHelper.unlockUser(user1.userId, password1).then(
      storedUser => {
        expect(storedUser).toEqual(user1)
      }
    )
    await AsyncStorageHelper.unlockUser(user2.userId, password2).then(
      storedUser => {
        expect(storedUser).toEqual(user2)
      }
    )
    await AsyncStorageHelper.unlockUser(user3.userId, password3).then(
      storedUser => {
        expect(storedUser).toEqual(user3)
      }
    )
  })

  it('should set 3 users and get one that does not exist', async () => {
    const user1 = {
      userId: 'ABC-123'
    }
    const password1 = 'abcd'
    const user2 = {
      userId: 'jimmy'
    }
    const password2 = 'jim'
    const user3 = {
      userId: 'ABC-123anything'
    }
    const password3 = 'anything'

    await AsyncStorageHelper.lockUser(user1, password1)
    await AsyncStorageHelper.lockUser(user2, password2)
    await AsyncStorageHelper.lockUser(user3, password3)

    await AsyncStorageHelper.unlockUser('doesNotExist', password1)
      .then(storedUser => {
        fail()
      })
      .catch(error => {
        expect(error).toBeDefined()
      })
  })

  it('should set 3 users and getAllKeys', async () => {
    const user1 = {
      userId: 'ABC-123'
    }
    const password1 = 'abcd'
    const user2 = {
      userId: 'jimmy'
    }
    const password2 = 'jim'
    const user3 = {
      userId: 'ABC-123anything'
    }
    const password3 = 'anything'

    await AsyncStorageHelper.lockUser(user1, password1)
    await AsyncStorageHelper.lockUser(user2, password2)
    await AsyncStorageHelper.lockUser(user3, password3)

    await AsyncStorageHelper.getAllKeys().then(keys => {
      const arrayOfKeys = ['ABC-123', 'jimmy', 'ABC-123anything']
      expect(keys).toEqual(arrayOfKeys)
    })
  })

  it('should set 3 users, getAllKeys and check doesKeyExist', async () => {
    const user1 = {
      userId: 'ABC-123'
    }
    const password1 = 'abcd'
    const user2 = {
      userId: 'jimmy'
    }
    const password2 = 'jim'
    const user3 = {
      userId: 'ABC-123anything'
    }
    const password3 = 'anything'

    await AsyncStorageHelper.lockUser(user1, password1)
    await AsyncStorageHelper.lockUser(user2, password2)
    await AsyncStorageHelper.lockUser(user3, password3)

    await AsyncStorageHelper.getAllKeys().then(async keys => {
      const arrayOfKeys = ['ABC-123', 'jimmy', 'ABC-123anything']
      expect(keys).toEqual(arrayOfKeys)
    })
  })

  it('should store and retrieve the password correctly', async () => {
    const password = '123adsf'
    await AsyncStorageHelper.setApplicationPassword(password)
    const retrievedPassword = await AsyncStorageHelper.getApplicationPassword()
    expect(password).toEqual(retrievedPassword)
  })

  it('should set MainNet and validate that is being used', async () => {
    await AsyncStorageHelper.useMainNet()
    // TODO: MainNet is hardcoded off right now
    expect(await AsyncStorageHelper.isMainNet()).toBe(false)
    expect(await AsyncStorageHelper.isTestNet()).toBe(true)
  })

  it('should set TestNet and validate that is being used', async () => {
    await AsyncStorageHelper.useTestNet()
    expect(await AsyncStorageHelper.isMainNet()).toBe(false)
    expect(await AsyncStorageHelper.isTestNet()).toBe(true)
  })
})
