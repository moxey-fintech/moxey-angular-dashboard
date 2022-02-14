(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotification.sms', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.editNotification.sms', {
                url: '/sms',
                views: {
                    'notificationServiceEditViews' : {
                        templateUrl:'app/pages/services/notificationService/' +
                        'notifications/editNotification/' +
                        'editNotificationSms/editNotificationSms.html',
                        controller: "EditNotificationSmsCtrl"
                    }
                },
                title: 'Notifications'
            });
    }

})();
