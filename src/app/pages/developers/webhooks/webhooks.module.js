(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks', [
        'BlurAdmin.pages.developers.webhooks.list',
        'BlurAdmin.pages.developers.webhooks.logs',
        'BlurAdmin.pages.developers.webhooks.log'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.webhooks', {
                url: '/webhooks',
                templateUrl: 'app/pages/developers/webhooks/webhooks.html',
                controller: "WebhooksCtrl",
                title: 'Webhooks',
                sidebarMeta: {
                    order: 400
                }
            });
        $urlRouterProvider.when("/developers/webhooks", "/developers/webhooks/list");
    }

})();
