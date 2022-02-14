(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceLogs', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.notificationServiceLogs', {
                url: '/logs',
                views: {
                    'notificationServiceViews' : {
                        templateUrl:'app/pages/services/notificationService/notificationServiceLogs/notificationServiceLogs.html',
                        controller: "NotificationServiceLogsCtrl"
                    }
                },
                title: 'Notification logs'
            });
    }

})();
