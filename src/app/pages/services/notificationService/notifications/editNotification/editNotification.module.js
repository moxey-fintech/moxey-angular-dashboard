(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotification', [
        'BlurAdmin.pages.services.notificationService.editNotification.email',
        'BlurAdmin.pages.services.notificationService.editNotification.sms',
        'BlurAdmin.pages.services.notificationService.editNotification.push'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.editNotification', {
                url: '/:id/edit',
                views: {
                    'notificationServiceViews' : {
                        template: '<div ui-view="notificationServiceEditViews"></div>'
                    }
                },
                title: 'Notifications'
            });
    }

})();
