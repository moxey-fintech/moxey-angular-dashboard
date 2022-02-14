(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.listIcos', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.listIcos', {
                url: '/list',
                templateUrl: 'app/pages/services/icoService/icos/listIcos/listIcos.html',
                controller: "ListIcosCtrl"
            });
    }

})();
