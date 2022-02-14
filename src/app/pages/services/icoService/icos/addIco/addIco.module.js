(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.addIco', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.addIco', {
                url: '/add',
                templateUrl: 'app/pages/services/icoService/icos/addIco/addIco.html',
                controller: "AddIcoCtrl",
                title: 'Add'
            });
    }

})();
