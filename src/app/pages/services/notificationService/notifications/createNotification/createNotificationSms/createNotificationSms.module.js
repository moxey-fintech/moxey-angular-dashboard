(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification.sms', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.createNotification.sms', {
                url: '/sms',
                views: {
                    'createNotificationViews': {
                        controller: 'CreateNotificationSmsCtrl',
                        templateUrl: 'app/pages/services/notificationService/notifications/' +
                        'createNotification/createNotificationSms/' +
                        'createNotificationSms.html'
                    }
                },
                title: "Create SMS notification"
            });
    }

})();
