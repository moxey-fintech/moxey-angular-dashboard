(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.companyInfo', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.companyInfo', {
                url: '/company-info',
                views: {
                  'generalSettings': {
                    templateUrl: 'app/pages/settings/companyInfo/companyInfo.html',
                    controller: "CompanyInfoCtrl"
                  }
                },
                title: "Company info"
            });
    }

})();
