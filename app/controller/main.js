'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html');
  }
  async shopee() {
    const { ctx } = this;
    await ctx.render('shopee.html');
  }
  async hairOli() {
    const { ctx } = this;
    await ctx.render('hairOli.html');
  }
}

module.exports = HomeController;
