import { AsyncStorage } from 'react-native';
import CryptoJS from 'crypto-js';

const STORAGE_KEY_PREFIX = '@NdauAsyncStorage:';
const CURRENT_USER_KEY = '@CurrentUserKey';

//PLEASE CHECK WITH KP BEFORE CHANGING THESE FUNCTIONS
//To remain backwards compatible we must not change the way
//we unlock or lock a user.
const unlockUser = (userId, encryptionPassword) => {
  return new Promise((resolve, reject) => {
    const storageKey = STORAGE_KEY_PREFIX + userId;
    console.debug(`storage key to check is ${storageKey}`);
    AsyncStorage.getItem(STORAGE_KEY_PREFIX + userId)
      .then((user) => {
        console.debug(`The following user object was returned: ${user}`);
        if (user !== null) {
          console.debug(`unlockUser - encrypted user is: ${user}`);
          const userDecryptedBytes = CryptoJS.AES.decrypt(user, encryptionPassword);
          const userDecryptedString = userDecryptedBytes.toString(CryptoJS.enc.Utf8);
          console.debug(`unlockUser - decrypted user is: ${userDecryptedString}`);

          if (!userDecryptedString) resolve(null);

          resolve(JSON.parse(userDecryptedString));
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        console.debug(`User could be present but password is incorrect: ${error}`);
        reject(error);
      });
  });
};

//PLEASE CHECK WITH KP BEFORE CHANGING THESE FUNCTIONS
//To remain backwards compatible we must not change the way
//we unlock or lock a user.
const lockUser = async (user, encryptionPassword, storageKeyOverride) => {
  try {
    if (!encryptionPassword) throw Error('you must pass an encryptionPassword to use this method');
    if (!user.userId) throw Error('you must pass user.userId containing a valid ID');

    const userString = JSON.stringify(user);
    const storageKey = storageKeyOverride || STORAGE_KEY_PREFIX + user.userId;

    console.debug(`lockUser - user to encrypt to ${storageKey}: ${userString}`);
    const userStringEncrypted = CryptoJS.AES.encrypt(userString, encryptionPassword);
    console.debug(`lockUser - encrypted user is: ${userStringEncrypted}`);

    await AsyncStorage.setItem(storageKey, userStringEncrypted.toString());

    const checkPersist = await unlockUser(user.userId, encryptionPassword);
    console.debug(`Successfully set user to: ${JSON.stringify(checkPersist, null, 2)}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const newKeys = keys
      .map((key) => {
        return key.replace(STORAGE_KEY_PREFIX, '');
      })
      .filter((key) => key !== CURRENT_USER_KEY);
    console.debug(`keys found in getAllKeys are ${newKeys}`);
    return newKeys;
  } catch (error) {
    return [];
  }
};

const doesKeyExist = async (key) => {
  const keys = await getAllKeys();
  return keys.includes(key);
};

export default {
  unlockUser,
  lockUser,
  getAllKeys,
  doesKeyExist
};
