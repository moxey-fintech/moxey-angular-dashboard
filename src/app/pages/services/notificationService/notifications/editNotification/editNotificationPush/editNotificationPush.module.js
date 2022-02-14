(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotification.push', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.editNotification.push', {
                url: '/push',
                views: {
                    'notificationServiceEditViews' : {
                        templateUrl:'app/pages/services/notificationService/' +
                        'notifications/editNotification/' +
                        'editNotificationPush/editNotificationPush.html',
                        controller: "EditNotificationPushCtrl"
                    }
                },
                title: 'Notifications'
            });
    }

})();
