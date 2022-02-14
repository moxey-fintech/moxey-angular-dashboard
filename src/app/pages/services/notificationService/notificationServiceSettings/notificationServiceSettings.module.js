(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.notificationServiceSettings', {
                url: '/settings',
                views: {
                  'notificationServiceViews' : {
                    templateUrl:'app/pages/services/notificationService/notificationServiceSettings/notificationServiceSettings.html',
                    controller: "NotificationServiceSettingsCtrl"
                  }
                },
                title: 'Settings'
            });
    }

})();
