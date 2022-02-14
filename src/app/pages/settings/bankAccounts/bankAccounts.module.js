(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.bankAccounts', {
                url: '/bank-accounts',
                views: {
                  'generalSettings': {
                      controller: 'BankAccountsCtrl',
                      templateUrl: 'app/pages/settings/bankAccounts/bankAccounts.html'
                  }
                },
                title: "Bank accounts"
            });
    }

})();
