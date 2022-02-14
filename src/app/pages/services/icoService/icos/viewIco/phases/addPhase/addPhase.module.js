(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.addIcoPhase', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.viewIco.addIcoPhase', {
                url: '/phase/add',
                views: {
                    'icoViews': {
                        templateUrl: 'app/pages/services/icoService/icos/viewIco/phases/addPhase/addPhase.html',
                        controller: "AddPhaseCtrl"
                    }
                }
            });
    }

})();
