(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification.email', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.createNotification.email', {
                url: '/email',
                views: {
                    'createNotificationViews': {
                        controller: 'CreateNotificationEmailCtrl',
                        templateUrl: 'app/pages/services/notificationService/notifications/' +
                        'createNotification/createNotificationEmail/' +
                        'createNotificationEmail.html'
                    }
                },
                title: "Create email notification"
            });
    }

})();
