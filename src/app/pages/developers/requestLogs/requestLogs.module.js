(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.requestLogs', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.requestLogs', {
                url: '/request-logs',
                templateUrl: 'app/pages/developers/requestLogs/requestLogs.html',
                controller: "RequestLogsCtrl",
                title: "Request logs",
                sidebarMeta: {
                    order: 300
                }
            });
    }

})();
