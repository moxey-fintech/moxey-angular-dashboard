(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreService.wyreServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('wyreServiceSettings', {
                url: '/extensions/wyre/settings',
                templateUrl: 'app/pages/services/wyreService/wyreServiceSettings/wyreServiceSettings.html',
                controller: "WyreServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
