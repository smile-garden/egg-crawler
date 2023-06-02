'use strict';

const { Service } = require('egg');
const qs = require('qs');
const initParams = {
  exclude_filter: 0,
  filter: 0,
  filter_size: 0,
  flag: 1,
  fold_filter: 0,
  itemid: 11242593437, // 商品 id
  limit: 10, // 每页限制数量
  offset: 0, // 开始位置 第几条开始
  relevant_reviews: false,
  request_source: 1,
  shopid: 457706720, // 店铺 id
  tag_filter: '',
  type: 5, // 5星好评
  variation_filters: '',
};

class CommentService extends Service {
  async getList(params) {
    const { ctx } = this;
    let start = 0;
    const length = 10;
    const { total } = params;
    const times = Math.ceil(total / length);
    let list = [];

    for (let i = 0; i < times; i++) {
      const limit = i === times - 1 ? (total % length || length) : length;
      const newParams = {
        ...initParams,
        ...params,
        offset: start,
        limit,
      };
      const paramsStr = qs.stringify(newParams);
      const url = `https://shopee.co.id/api/v2/item/get_ratings?${paramsStr}`;
      const res = await ctx.curl(url, {
        dataType: 'json',
      });
      const newList = (res.data.data?.ratings || []).map(item => {
        const newItem = {};
        const content = item.comment.split('\n\n')[1]?.replace(/skintific/ig, 'MeToo');
        newItem.content = content || '此条评论没内容';
        return newItem;
      });
      start += length;
      list = [ ...list, ...newList ];
    }
    return list;
  }
}

module.exports = CommentService;
