(function () {
    'use strict';

    angular.module('BlurAdmin.pages.smsAuth', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('smsAuth', {
                url: '/authentication/multi-factor/sms',
                views:{
                    'securityViews':{
                        templateUrl: 'app/pages/multiFactorAuth/smsAuthentication/smsAuthentication.html',
                        controller: 'SmsAuthenticationCtrl'
                    }
                }
            });
    }

})();
