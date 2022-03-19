// -env.js to use define config for app
// -env.[ENV].js to use overwrite env.js when dev or build APP
let API_URL_ = 'http://api.blueprinter.online';
export const API_URL = API_URL_;
export default {
  API_URL : API_URL_,
  CDN_URL : '',
  ENV:'development',
}