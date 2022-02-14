(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceSettings')
        .directive('businessServiceSettingsItem', businessServiceSettingsItem);

    /** @ngInject */
    function businessServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/businessService/businessServiceSettings/businessServiceSettingsItem/businessServiceSettingsItem.html'
        };
    }
})();
