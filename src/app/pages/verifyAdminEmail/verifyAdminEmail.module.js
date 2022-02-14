(function () {
    'use strict';

    angular.module('BlurAdmin.pages.verifyAdminEmail', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('verifyAdminEmail', {
                url: '/email/verify/:key',
                views:{
                    'admin':{
                        controller: 'VerifyAdminEmailCtrl'
                    }
                }
            });
    }

})();
