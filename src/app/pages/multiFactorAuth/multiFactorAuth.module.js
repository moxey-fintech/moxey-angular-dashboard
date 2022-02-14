(function () {
    'use strict';

    angular.module('BlurAdmin.pages.multiFactorAuth', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('multiFactorAuthentication', {
                url: '/authentication/multi-factor',
                views:{
                    'securityViews':{
                        templateUrl: 'app/pages/multiFactorAuth/multiFactorAuth.html',
                        controller: 'MultiFactorAuthCtrl'
                    }
                }
            });
    }

})();
