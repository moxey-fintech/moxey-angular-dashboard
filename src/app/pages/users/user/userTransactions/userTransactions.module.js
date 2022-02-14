(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.transactions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user.transactions', {
                url: '/transactions',
                views: {
                    'userDetailsView': {
                        controller: "UserTransactionsCtrl",
                        templateUrl: 'app/pages/users/user/userTransactions/userTransactions.html'
                    }
                },
                title: "User transactions"
            });
    }

})();