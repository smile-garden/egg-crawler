'use strict';

const { Controller } = require('egg');

class ExcelController extends Controller {
  async getList() {
    const { ctx } = this;
    const list = await ctx.service.shopee.getList(ctx.request.body || {});
    ctx.body = {
      code: 1,
      data: list,
      success: true,
      msg: 'list',
    };
  }
  async shopee() {
    const { ctx, service } = this;
    const headers = [
      [
        { t: '内容', f: 'content', w: 130 },
      ],
    ];
    const data = await ctx.service.shopee.getList(ctx.request.body || {});
    const res = await service.excel.excelCommon(headers, data, '评论列表');
    ctx.body = {
      code: 1,
      data: data.length ? res : null,
      success: true,
      msg: 'excel',
    };
  }
  async hairOli() {
    const { ctx, service } = this;
    const headers = [
      [
        { t: 'productId', f: 'productId' },
        { t: 'content', f: 'content', w: 130 },
        { t: 'status', f: 'status' },
        { t: 'name', f: 'name' },
        { t: 'photo_urls', f: 'photo_urls', w: 130 },
        { t: 'created_at', f: 'created_at' },
        { t: 'rating', f: 'rating' },
      ],
    ];
    const data = await ctx.service.hairOli.getList(ctx.request.body || {});
    const res = await service.excel.excelCommon(headers, data, '评论列表');
    ctx.body = {
      code: 1,
      data: data.length ? res : null,
      success: true,
      msg: 'excel',
    };
  }
}

module.exports = ExcelController;
