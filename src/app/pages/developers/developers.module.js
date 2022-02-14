(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers', [
        'BlurAdmin.pages.developers.accessControl',
        'BlurAdmin.pages.developers.tokens',
        'BlurAdmin.pages.developers.webhooks',
        'BlurAdmin.pages.developers.requestLogs',
        'BlurAdmin.pages.developers.statusPage',
        'BlurAdmin.pages.developers.documentation'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider,baSidebarServiceProvider) {
        $stateProvider
            .state('developers', {
                url: '/developers',
                template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: " Developers",
                sidebarMeta: {
                    order: 600,
                    icon: 'sidebar-developers-icon'
                }
            });
        $urlRouterProvider.when("/developers", "/developers/api-tokens");
    }

})();