(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification.push', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.createNotification.push', {
                url: '/push',
                views: {
                    'createNotificationViews': {
                        controller: 'CreateNotificationPushCtrl',
                        templateUrl: 'app/pages/services/notificationService/notifications/' +
                        'createNotification/createNotificationPush/' +
                        'createNotificationPush.html'
                    }
                },
                title: "Create push notification"
            });
    }

})();
