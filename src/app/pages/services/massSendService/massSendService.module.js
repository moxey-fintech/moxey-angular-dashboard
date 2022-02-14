(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.massSendService', [
        'BlurAdmin.pages.services.massSendService.massSendServiceSettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('massSendService', {
                // url: '/services/notifications',
                url: '/extensions/mass-send',
                abstract: true,
                template:'<div ui-view="massSendServiceViews"></div>'
            });
        // $urlRouterProvider.when("/services/notifications", "/services/notifications/list");
        $urlRouterProvider.when("/extensions/mass-send", "/extensions/mass-send/settings");
    }

})();
