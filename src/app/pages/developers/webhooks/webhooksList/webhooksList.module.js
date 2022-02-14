(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.list', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.webhooks.list', {
                url: '/list',
                params: {
                    secret: null,
                    webhookUrl: null,
                    from: null
                },
                views: {
                    'webhooksView': {
                        templateUrl: 'app/pages/developers/webhooks/webhooksList/webhooksList.html',
                        controller: "WebhooksListCtrl"
                    }
                },
                title: 'Webhooks'
            });
    }

})();