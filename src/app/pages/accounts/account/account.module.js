(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account', [
        'BlurAdmin.pages.accounts.account.standaloneSettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('account', {
                url: '/account/:reference',
                templateUrl: 'app/pages/accounts/account/account.html',
                controller: "AccountCtrl",
                title: 'Account info'
            });
    }

})();