'use strict';

const { Service } = require('egg');
const qs = require('qs');
const initParams = {
  resource: 'reviews',
  action: 'REVIEWS_N_STATS',
  filter: [
    'contentlocale:eq:en*,en_US,en_US',
    'isratingsonly:eq:false',
    'rating:eq:5'
  ],
  filter_reviews: 'contentlocale:eq:en*,en_US,en_US',
  include: 'authors,products,comments',
  filteredstats: 'reviews',
  Stats: 'Reviews',
  limit: 30,
  offset: 8,
  limit_comments: 3,
  sort: 'relevancy:a1',
  passkey: 'catR78d3a23ZEkLeHOEHDsr5eYwK77H9lmcXYBsfbHlV0',
  apiversion: 5.5,
  displaycode: '28903-en_us',
};

function toQueryString(obj) {
  return Object.keys(obj).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
  }).join('&');
}

class HairOliService extends Service {
  async getList(params) {
    const { ctx } = this;
    let start = 0;
    const length = 10;
    const { total, brandName = '', productid } = params;
    const times = Math.ceil(total / length);
    let list = [];

    for (let i = 0; i < times; i++) {
      const limit = i === times - 1 ? (total % length || length) : length;
      initParams.filter.push(`productid:eq:${productid}`);
      const newParams = {
        ...initParams,
        offset: start,
        limit,
      };
      const paramsStr = qs.stringify(newParams, { encode: true, arrayFormat: 'repeat' });
      const url = `https://api.bazaarvoice.com/data/reviews.json?${paramsStr}`;
      const res = await ctx.curl(url, {
        dataType: 'json',
      });
      const newList = (res.data?.Results || []).map(item => {
        // const content = item.comment.split('\n\n')[1]?.replace(/skintific/ig, 'MeToo');
        const reg = new RegExp(brandName, 'ig');
        const content = !!brandName ? item.ReviewText?.replace(reg, 'MeToo') : item.ReviewText;
        const photos = (item.Photos || []).map(v => v.Sizes.normal.Url).join(',');
        return {
          productId: '',
          content,
          status: 'pending',
          name: item.UserNickname,
          photo_urls: photos,
          created_at: item.LastModificationTime,
          rating: 5,
        };
      });
      start += length;
      list = [ ...list, ...newList ];
    }
    return list;
  }
}

module.exports = HairOliService;
