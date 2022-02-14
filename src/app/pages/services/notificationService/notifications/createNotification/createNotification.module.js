(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification', [
        'BlurAdmin.pages.services.notificationService.createNotification.email',
        'BlurAdmin.pages.services.notificationService.createNotification.sms',
        'BlurAdmin.pages.services.notificationService.createNotification.push'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.createNotification', {
                url: '/create',
                views: {
                    'notificationServiceViews' : {
                        templateUrl:'app/pages/services/notificationService/notifications/createNotification/createNotification.html',
                        controller: "CreateNotificationsCtrl"
                    }
                },
                title: 'Notifications'
            });
    }

})();
