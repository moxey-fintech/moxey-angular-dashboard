(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService', [
        'BlurAdmin.pages.services.notificationService.notificationServiceSettings',
        'BlurAdmin.pages.services.notificationService.notificationServiceLogs',
        'BlurAdmin.pages.services.notificationService.listNotifications',
        'BlurAdmin.pages.services.notificationService.createNotification',
        'BlurAdmin.pages.services.notificationService.editNotification',
        'BlurAdmin.pages.services.notificationService.bulkNotifications'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService', {
                // url: '/services/notifications',
                url: '/extensions/notifications',
                abstract: true,
                template:'<div ui-view="notificationServiceViews"></div>'
            });
            // $urlRouterProvider.when("/services/notifications", "/services/notifications/list");
            $urlRouterProvider.when("/extensions/notifications", "/extensions/notifications/list");
    }

})();
