(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.editIco', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.editIco', {
                url: '/:id/edit',
                templateUrl: 'app/pages/services/icoService/icos/editIco/editIco.html',
                controller: "EditIcoCtrl"
            });
    }

})();
