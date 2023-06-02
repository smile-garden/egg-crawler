'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const intercept = middleware.intercept();

  router.get('/', controller.home.index);
  router.post('/list', intercept, controller.api.getList);
  router.post('/excel', intercept, controller.api.index);
};
