(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('getStarted', {
                url: '/get-started',
                templateUrl: 'app/pages/getStarted/getStarted.html',
                controller: 'GetStartedCtrl',
                title: 'Get started',
                sidebarMeta: {
                    order: 0,
                    icon: 'sidebar-getStarted-icon'
                },
                params: {
                    openPlans: false
                },
            });
    }

})();
