(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.listIcoPhase', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.viewIco.listIcoPhase', {
                url: '/phase/list',
                views: {
                    'icoViews': {
                        templateUrl: 'app/pages/services/icoService/icos/viewIco/phases/listPhase/listPhase.html',
                        controller: "ListPhaseCtrl"
                    }
                }
            });
    }

})();
