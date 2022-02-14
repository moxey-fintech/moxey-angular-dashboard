(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.statusPage', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.statusPage', {
                url: '/status-page',
                fixedHref: 'http://status.rehive.com/',
                title: "Status page",
                blank: true,
                sidebarMeta: {
                    icon: 'fa fa-external-link',
                    order: 600
                }
            });
    }

})();
