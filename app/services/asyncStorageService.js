import { AsyncStorage } from 'react-native';
const APP_VERSION_KEY = 'APP_VERSION_KEY';
const EMAIL_REMEMBER_KEY = 'EMAIL_REMEMBER_KEY';

const serviceStorage = {
  setVersion: async (data) => {
    try {
      await AsyncStorage.setItem(
        APP_VERSION_KEY,
        typeof data === 'object' && data ? JSON.stringify(data) : data,
      );
    } catch (error) {
      console.log(error)
    }
  },
  getVersion: async () => {
    try {
      const value = await AsyncStorage.getItem(APP_VERSION_KEY);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.log(error);
    }
    return null
  },

  setRememberEmail: async (data) => {
    try {
      await AsyncStorage.setItem(
        EMAIL_REMEMBER_KEY,
        typeof data === 'object' && data ? JSON.stringify(data) : data,
      );
    } catch (error) {
      console.log(error);
    }
  },
  getRememberEmail: async () => {
    try {
      const value = await AsyncStorage.getItem(EMAIL_REMEMBER_KEY);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  },

}

export default serviceStorage;
