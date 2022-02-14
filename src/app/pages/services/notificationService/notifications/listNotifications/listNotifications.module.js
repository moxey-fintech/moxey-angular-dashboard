(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.listNotifications', {
                url: '/list',
                views: {
                    'notificationServiceViews' : {
                        templateUrl:'app/pages/services/notificationService/notifications/listNotifications/listNotifications.html',
                        controller: "ListNotificationsCtrl"
                    }
                },
                params: {
                    type: null
                },
                title: 'Notifications'
            });
    }

})();
