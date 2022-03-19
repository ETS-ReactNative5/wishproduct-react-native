import axios from 'axios';
import * as _ from 'lodash';
import { ToastAndroid } from 'react-native';
import { API_URL, CDN_URL } from './../enviroments/env.js';
import { apiDefine } from './../api_define';
let instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Max-Age': 1728000,
    // 'Authorization': AppService.getToken(),
    Accept: 'application/json',
  }
});

instance.interceptors.request.use(
  function (config) {
    console.log('');
    console.log('');
    console.log('');
    console.log(`--------------${config.method} ${API_URL || 'undefined'}${config.url}--------------------`);
    console.log(config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (res) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    let newData = res && res.data ? res.data : res;
    console.log(newData);
    console.log(`---------------------END--------------------`);
    return newData;
  },
  function (error) {
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
  }
);


let apiGenerator = (instance) => {
  const mappingFunction = (items = [], host) => {
    for (let index in items) {
      let api = items[index];

      if (!instance[api.service]) {
        instance[api.service] = {};
      }
      let prefix = `${host}`;

      prefix = `${prefix}${api.url}`;
      for (let index2 in api.fn) {
        let item = api.fn[index2];
        let url = `${prefix}${item.prefix}`;

        instance[api.service][item.name] = (params = {}, headers = null) => {
          const options = {
            url: url,
            method: item.method,
            body: params,
            headers: typeof headers === "object" ? _.extend(headers, {
              "Content-Type": "application/json"
            }) : {
              "Content-Type": "application/json"
            },
          };
          return requestFn(options);
        };
      }

      for (let index3 in api.children) {
        let children = api.children[index3];
        instance[api.service] = mappingFunction(api.children, prefix)
      }
    }
    return instance;
  }
  return mappingFunction(apiDefine, API_URL);
}

let qsParam = (params = {}) => {
  params = params || {};
  let url = '';
  for (let key in params) {
    let item = params[key];
    if (item != null && item != undefined) {
      url += `${key}=${encodeURIComponent(item)}&`;
    }
  }
  url = url.replace(/&$/, '');
  return url;
}

let requestFn = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (options.method && options.method.toUpperCase() === 'GET') {
      options.url += `?${qsParam(options.body)}`;
    }
    let paramsInPath = options.url.match(/\/:\w+/gi);
    for (let index in paramsInPath) {
      let item = paramsInPath[index];
      let param = item.replace('/:', '');
      options.url = options.url.replace(item, `/${options.body[param]}`);
    }
    // if(AppService.getToken()){
    //   options.headers['Authorization'] = AppService.getToken();
    // }
    instance({
      ...options,
      method: options.method,
      url: options.url,
      data: options.body || options.data,
      body: options.body || options.data,
      timeout: 60000,
    }).then((result) => {
      return resolve(result);
    }).catch((error) => {
      return reject(error);
    });
  });
}
instance = apiGenerator(instance);
export default instance;
