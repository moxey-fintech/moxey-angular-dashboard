(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceSettings')
        .directive('businessServiceAppConfig', businessServiceAppConfig);

    /** @ngInject */
    function businessServiceAppConfig() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/businessService/businessServiceSettings/businessServiceAppConfig/businessServiceAppConfig.html'
        };
    }
})();