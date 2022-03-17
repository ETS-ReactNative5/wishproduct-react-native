import axios from 'axios';
import * as _ from 'lodash';
import { defaultConfig } from '../config/DefaultConfig';
const instance = axios.create({
  baseURL: defaultConfig.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(
  function(config) {
    console.log('');
    console.log('');
    console.log('');
    console.log(`--------------------- START    ${config.method} ${defaultConfig.API_URL}${config.url}--------------------`);
    console.log(config);
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function(res) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    let newData = res && res.data ? res.data : res;
    console.log(newData);
    console.log(`--------------------- END --------------------`);
    return newData;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error && error.response) {
      console.log('---------error.response.status: ', error.response.status || error.response.statusCode);
      console.log('---------error.response.data: ', error.response.data);
      if (error.response.data && error.response.data.message) {
        console.log('---------error.response.data.message: ', error.response.data.message);
      }
    }
    console.log(`---------------------END--------------------`);
    if (error && error.response && error.response.data) {
      let res = error.response.data;
      if (res && res.message) {
        return Promise.reject(res.message);
      }
      return Promise.reject(res || `Có lỗi xảy ra. Vui lòng thử lại.`);
    }
    return Promise.reject(`Có lỗi xảy ra. Vui lòng thử lại.`);
  },
);
export default instance;
