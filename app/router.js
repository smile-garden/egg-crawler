'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const intercept = middleware.intercept();

  router.get('/', controller.main.index);
  router.get('/shopee', controller.main.shopee);
  router.post('/list', intercept, controller.api.getList);
  router.post('/shopee/excel', intercept, controller.api.shopee);
  router.get('/hairoli', controller.main.hairOli);
  router.post('/hairoli/excel', intercept, controller.api.hairOli);
};
