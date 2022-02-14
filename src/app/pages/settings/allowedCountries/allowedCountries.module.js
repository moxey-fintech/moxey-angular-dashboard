(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.allowedCountries', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.allowedCountries', {
                url: '/allowed-countries',
                views: {
                    'generalSettings': {
                        templateUrl: 'app/pages/settings/allowedCountries/allowedCountries.html',
                        controller: "AllowedCountriesCtrl"
                    }
                },
                title: "Allowed countries"
            });
    }

})();
