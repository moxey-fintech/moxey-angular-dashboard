(function () {
    'use strict';

    angular.module('BlurAdmin.pages.resetPasswordConfirmation', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('resetPasswordConfirmation', {
                url: '/password/reset/confirm/:uid/:token',
                views:{
                    'admin':{
                        templateUrl: 'app/pages/resetPasswordConfirmation/resetPasswordConfirmation.html',
                        controller: 'ResetPasswordConfirmationCtrl'
                    }
                }
            });
    }

})();
