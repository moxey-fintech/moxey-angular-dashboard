(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.companySettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.companySettings', {
                url: '/company-settings',
                views: {
                    'generalSettings': {
                        templateUrl: 'app/pages/settings/companySettings/companySettings.html',
                        controller: "CompanySettingsCtrl"
                    }
                },
                title: "Company settings"
            });
    }

})();
