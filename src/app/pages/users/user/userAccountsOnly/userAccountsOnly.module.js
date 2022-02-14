(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user.accounts', {
                url: '/accounts',
                views: {
                    'userDetailsView': {
                        controller: "UserAccountsOnlyCtrl",
                        templateUrl: 'app/pages/users/user/userAccountsOnly/userAccountsOnly.html'
                    }
                },
                title: "User accounts"
            });
    }

})();