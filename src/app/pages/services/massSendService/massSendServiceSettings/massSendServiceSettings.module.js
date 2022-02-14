(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.massSendService.massSendServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('massSendService.massSendServiceSettings', {
                url: '/settings',
                views: {
                    'massSendServiceViews' : {
                        templateUrl:'app/pages/services/massSendService/massSendServiceSettings/massSendServiceSettings.html',
                        controller: "MassSendServiceSettingsCtrl"
                    }
                },
                title: 'Settings'
            });
    }

})();
