(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceCards', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('chiplessCardServiceCards', {
                url: '/extensions/chipless-card/cards',
                templateUrl: 'app/pages/services/chiplessCardService/chiplessCardServiceCards/chiplessCardServiceCards.html',
                controller: "ChiplessCardServiceCardsCtrl",
                title: 'Cards'
            });
    }

})();

