(function () {
    'use strict';

    angular.module('BlurAdmin.pages.alternateLogin', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('altLogin', {
                url: '/login-alt',
                views:{
                'admin':{
                templateUrl: 'app/pages/alternateLogin/alternateLogin.html',
                controller: 'AlternateLoginCtrl'
                        }
                    }
                });
            }

})();