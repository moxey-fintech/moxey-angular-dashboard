(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup',[])
        .config(routeConfig);

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('demo',{
                url:'/demo',
                views:{
                    'admin': {
                        templateUrl: 'app/pages/demoSetup/demoSetup.html',
                        controller:'DemoSetupCtrl'
                    }
                }
            });
    }

})();