(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.log', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.webhooks.log', {
                url: '/logs/:id',
                views: {
                    'webhooksView': {
                        templateUrl: 'app/pages/developers/webhooks/webhookLog/webhookLog.html',
                        controller: "WebhookLogCtrl"
                    }
                },
                title: 'Webhooks'
            });
    }

})();