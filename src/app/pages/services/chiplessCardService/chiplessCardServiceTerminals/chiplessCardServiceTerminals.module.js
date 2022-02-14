(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceTerminals', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('chiplessCardServiceTerminals', {
                url: '/extensions/chipless-card/terminals',
                templateUrl: 'app/pages/services/chiplessCardService/chiplessCardServiceTerminals/chiplessCardServiceTerminals.html',
                controller: "ChiplessCardServiceTerminalsCtrl",
                title: 'Terminals'
            });
    }

})();

