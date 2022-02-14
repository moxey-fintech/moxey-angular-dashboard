(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.list', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('users.list', {
                url: '/list',
                views: {
                    'usersViews': {
                        templateUrl: 'app/pages/users/usersList/usersList.html',
                        controller: "UsersListCtrl",
                    }
                },                
                params: {
                    currencyCode: null,
                    email: null,
                    mobile: null,
                    accountRef: null
                },
                title: 'Users'
            });
    }

})();