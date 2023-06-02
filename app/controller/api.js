'use strict';

const { Controller } = require('egg');

class ExcelController extends Controller {
  async getList() {
    const { ctx } = this;
    const list = await ctx.service.comment.getList(ctx.request.body || {});
    ctx.body = {
      code: 1,
      data: list,
      success: true,
      msg: 'list',
    };
  }
  async index() {
    const { ctx, service } = this;
    const headers = [
      [
        { t: '内容', f: 'content', w: 130 },
      ],
    ];
    const data = await ctx.service.comment.getList(ctx.request.body || {});
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
