(function () {
    'use strict';

    angular.module('BlurAdmin.pages.multiFactorAuthVerify', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('multiFactorAuthVerify', {
                url: '/authentication/multi-factor/verify/:authType',
                views:{
                    'securityViews':{
                        templateUrl: 'app/pages/multiFactorAuth/multiFactorAuthVerify/multiFactorAuthVerify.html',
                        controller: 'MultiFactorAuthVerifyCtrl'
                    }
                },
                params: {
                    authType: null,
                    customToken: null,
                    prevState: null,
                    loginUser: null
                }
            });
    }

})();
