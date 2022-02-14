(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.logs', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.webhooks.logs', {
                url: '/logs',
                views: {
                    'webhooksView': {
                        templateUrl: 'app/pages/developers/webhooks/webhookLogs/webhookLogs.html',
                        controller: "WebhookLogsCtrl"
                    }
                },
                title: 'Webhooks'
            });
    }

})();