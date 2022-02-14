(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings', [
        'BlurAdmin.pages.settings.allowedCountries',
        'BlurAdmin.pages.settings.companyInfo',
        'BlurAdmin.pages.settings.companySettings',
        'BlurAdmin.pages.settings.bankAccounts',
        'BlurAdmin.pages.settings.notifications',
        'BlurAdmin.pages.settings.billingInfo'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings', {
                url: '/settings',
                abstract: true,
                templateUrl: 'app/pages/settings/settings.html',
                controller: "SettingsCtrl",
                title: 'Settings',
                sidebarMeta: {
                    order: 800,
                    icon: 'sidebar-settings-icon'
                }
            });
        $urlRouterProvider.when("/settings", "/settings/company-info");
    }

})();
