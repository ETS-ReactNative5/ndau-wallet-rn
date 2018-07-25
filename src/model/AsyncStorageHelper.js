import { AsyncStorage } from 'react-native';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = '@NdauAsyncStorage:user';

const getUser = (encryptionPassword) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((user) => {
        if (user !== null) {
          console.debug(`getUser - encrypted user is: ${user}`);
          const userDecryptedBytes = CryptoJS.AES.decrypt(user, encryptionPassword);
          const userDecryptedString = userDecryptedBytes.toString(CryptoJS.enc.Utf8);
          console.debug(`getUser - decrypted user is: ${userDecryptedString}`);

          resolve(JSON.parse(userDecryptedString));
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        console.debug(`User could be present but password is incorrect: ${error}`);
        resolve({});
      });
  });
};

const setUser = async (user, encryptionPassword) => {
  if (!encryptionPassword) throw Error('you must pass an encryptionPassword to use this method');

  try {
    const userString = JSON.stringify(user);
    console.debug(`setUser - user to encrypt to ${STORAGE_KEY}: ${userString}`);
    const userStringEncrypted = CryptoJS.AES.encrypt(userString, encryptionPassword);
    console.debug(`setUser - encrypted user is: ${userStringEncrypted}`);

    await AsyncStorage.setItem(STORAGE_KEY, userStringEncrypted.toString());

    const checkPersist = await getUser(encryptionPassword);
    console.debug(`Successfully set user to: ${JSON.stringify(checkPersist, null, 2)}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getUser,
  setUser
};
