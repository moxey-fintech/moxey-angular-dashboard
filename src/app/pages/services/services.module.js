(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services', [
        'BlurAdmin.pages.services.ethereumService',
        "BlurAdmin.pages.services.bitcoinService",
        "BlurAdmin.pages.services.stellarService",
        'BlurAdmin.pages.services.notificationService',
        'BlurAdmin.pages.services.exchangeService',
        'BlurAdmin.pages.services.icoService',
        'BlurAdmin.pages.services.productService',
        'BlurAdmin.pages.services.currencyConversionService',
        'BlurAdmin.pages.services.rewardsService',
        'BlurAdmin.pages.services.stellarTestnetService',
        'BlurAdmin.pages.services.bitcoinTestnetService',
        'BlurAdmin.pages.services.massSendService',
        'BlurAdmin.pages.services.stripeService',
        'BlurAdmin.pages.services.chiplessCardService',
        'BlurAdmin.pages.services.flashService',
        'BlurAdmin.pages.services.businessService',
        'BlurAdmin.pages.services.voucherMoneyService',
        'BlurAdmin.pages.services.krakenService',
        'BlurAdmin.pages.services.paymentRequestsService',
        'BlurAdmin.pages.services.appService',
        'BlurAdmin.pages.services.wyreService',
        'BlurAdmin.pages.services.wyreTestnetService'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            // .state('services', {
            .state('extensions', {
                // url: '/services',
                url: '/extensions',
                templateUrl: 'app/pages/services/services.html',
                controller: "ServicesCtrl",
                // title: 'Services',
                title: 'Extensions',
                sidebarMeta: {
                    order: 700,
                    icon: 'sidebar-services-icon'
                }
            });
    }

})();
