(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.documentation', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.documentation', {
                url: '/documentation',
                fixedHref: 'https://docs.rehive.com/',
                title: "Documentation",
                blank: true,
                sidebarMeta: {
                    icon: 'fa fa-external-link',
                    order: 500
                }
            });
    }

})();
