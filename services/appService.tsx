import numeral from 'numeral';
import * as _ from 'lodash';
import { defaultConfig } from '../config/DefaultConfig';
const IMG_DEFAULT = defaultConfig.IMG_DEFAULT;// 'http://via.placeholder.com/360x459.png';
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const appService = {
  numberWithCommas: numberWithCommas,
  parseProductPrice: r => {
    if (r.price) {
      // r['priceText']=  numeral(r.price).format('0,0.0');
      r['priceText'] = numeral(r.price).format('0,0');
    }
    if (r.prePrice) {
      r['prePriceText'] = numeral(r.prePrice).format('0,0');
    }
    return r;
  },
  parseThumbnails: r => {
    r.originThumbnails = r.thumbnails;
    if (typeof r.thumbnails == 'string') {
      try {
        let arrThumbnails = JSON.parse(r.thumbnails);
        if (Array.isArray(arrThumbnails)) {
          if (!r['thumbnail'] && arrThumbnails[0]) {
            r['thumbnail'] = arrThumbnails[0];
          }
          r['thumbnails'] = arrThumbnails;
        }
      } catch (e) {
        console.error(`can not parse thumbnails`, e);
      }
    }
    if (r.thumbnails == '[]' || r.thumbnails == 'null' || r.thumbnails == 'undefined') {
      r.thumbnails = [IMG_DEFAULT];
    }
    if (!r['thumbnail']) r['thumbnail'] = IMG_DEFAULT;
    if (!Array.isArray(r['thumbnails'])) r['thumbnails'] = [IMG_DEFAULT];
    if(r['thumbnail'] && r['thumbnail'].startsWith('//') == true){
      r['thumbnail'] = `https:${r['thumbnail']}`;
    }
    return r;
  },
  getResultApiPaging: result => {
    let items = [];
    // let page = 0;
    let total = 0;
    if (result && result.data && result.data.items && Array.isArray(result.data.items)) {
      items = result.data.items;
      if (typeof result.data.total == 'number' && result.data.total != null) total = result.data.total;
    } else if (result && result.data && Array.isArray(result.data)) {
      items = result.data;
      if (typeof result.total == 'number' && result.total != null) total = result.total;
    }
    // else if(result && result.data){
    //   items =  result.data;
    // }
    return {
      items: Array.isArray(items) ? items : [],
      // page,
      total: typeof total == 'number' ? total : 0,
    };
  },
  getResultApiDetail: result => {
    let objectDetail = {};
    if (result && result.data && typeof result.data == 'object') {
      objectDetail = result.data;
    } else if (result && typeof result == 'object') {
      objectDetail = result;
    }
    return {
      ...objectDetail,
    };
  },
};
export default appService;
