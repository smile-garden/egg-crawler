module.exports = () => {
  return async (ctx, next) => {
    if (ctx.headers.referer) {
      await next();
    } else {
      await ctx.render('notify.html', { msg: 'API 不可以直接在 浏览器输入框访问' });
    }
    // await next();
  };
};
