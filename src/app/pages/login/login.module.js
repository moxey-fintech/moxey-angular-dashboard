(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                views:{
                'admin':{
                templateUrl: 'app/pages/login/login.html',
                controller: 'LoginCtrl'
                        }
                    }
                });
            }

})();
