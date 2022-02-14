/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
      'ui.router',
      'BlurAdmin.pages.multiFactorAuth',
      'BlurAdmin.pages.smsAuth',
      'BlurAdmin.pages.multiFactorAuthVerify',
      'BlurAdmin.pages.settings',
      'BlurAdmin.pages.currencies',
      'BlurAdmin.pages.transactions',
      'BlurAdmin.pages.accounts',
      'BlurAdmin.pages.groups',
      'BlurAdmin.pages.currency',
      'BlurAdmin.pages.users',
      'BlurAdmin.pages.services',
      'BlurAdmin.pages.login',
      'BlurAdmin.pages.alternateLogin',
      'BlurAdmin.pages.developers',
      'BlurAdmin.pages.resetPassword',
      'BlurAdmin.pages.resetPasswordConfirmation',
      'BlurAdmin.pages.verifyAdminEmail',
      'BlurAdmin.pages.accountInfo',
      'BlurAdmin.pages.redirectToWebWallet',
      'BlurAdmin.pages.getStarted',
      'BlurAdmin.pages.searchResults',
      'BlurAdmin.pages.rehiveBilling'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/currencies');
  }

})();
