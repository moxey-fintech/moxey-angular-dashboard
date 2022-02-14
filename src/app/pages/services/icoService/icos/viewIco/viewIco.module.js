(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco', [
            'BlurAdmin.pages.services.icoService.viewIco.rates',
            'BlurAdmin.pages.services.icoService.viewIco.addIcoPhase',
            'BlurAdmin.pages.services.icoService.viewIco.listIcoPhase',
            'BlurAdmin.pages.services.icoService.viewIco.quotes',
            'BlurAdmin.pages.services.icoService.viewIco.purchases'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.viewIco', {
                url: '/:id',
                templateUrl: 'app/pages/services/icoService/icos/viewIco/viewIco.html',
                controller: "ViewIcoCtrl"
            });
    }

})();
