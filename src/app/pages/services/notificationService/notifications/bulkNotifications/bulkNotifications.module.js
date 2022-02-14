(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.bulkNotifications', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.bulkNotifications', {
                url: '/bulk/add',
                views: {
                    'notificationServiceViews' : {
                        templateUrl:'app/pages/services/notificationService/notifications/bulkNotifications/bulkNotifications.html',
                        controller: "BulkNotificationsCtrl"
                    }
                },
                title: 'Notifications'
            });
    }

})();
