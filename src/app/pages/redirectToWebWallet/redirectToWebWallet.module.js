(function () {
    'use strict';

    angular.module('BlurAdmin.pages.redirectToWebWallet',[])
        .config(routeConfig);

    /** @ngInject */

    // function routeConfig ($rootScope, $stateProvider) {
    function routeConfig ($stateProvider) {
        $stateProvider
            .state('redirectToWebWallet',{
                url: '/redirect-to-web-wallet',
                // fixedHref: 'https://app.rehive.com/',
                title: 'Go to web wallet',
                // blank: false,
                sidebarMeta: {
                    order: 800
                }
            });
    }

})();