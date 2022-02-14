(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.notifications', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.notifications', {
                url: '/notifications',
                views: {
                  'generalSettings': {
                    controller: 'NotificationsCtrl',
                    templateUrl: 'app/pages/settings/notifications/notifications.html'
                  }
                },
                title: "Notifications"
            });
    }

})();
