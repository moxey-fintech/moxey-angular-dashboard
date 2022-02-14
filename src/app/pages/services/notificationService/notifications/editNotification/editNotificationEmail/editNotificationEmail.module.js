(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotification.email', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.editNotification.email', {
                url: '/email',
                views: {
                    'notificationServiceEditViews' : {
                        templateUrl:'app/pages/services/notificationService/' +
                        'notifications/editNotification/' +
                        'editNotificationEmail/editNotificationEmail.html',
                        controller: "EditNotificationEmailCtrl"
                    }
                },
                title: 'Notifications'
            });
    }

})();
