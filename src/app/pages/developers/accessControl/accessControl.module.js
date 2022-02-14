(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.accessControl', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.accessControl', {
                url: '/access-control',
                templateUrl: 'app/pages/developers/accessControl/accessControl.html',
                controller: "AccessControlCtrl",
                title: 'Access control',
                sidebarMeta: {
                    order: 100
                }
            });
    }

})();
