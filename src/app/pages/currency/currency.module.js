(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency', [
            'BlurAdmin.pages.currency.overview'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('currency', {
                url: '/currency/:currencyCode',
                template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true
            });
    }

})();