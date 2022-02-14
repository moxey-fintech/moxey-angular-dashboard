(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.icoServiceSettings')
        .directive('icoCompanyInfo', icoCompanyInfo);

    /** @ngInject */
    function icoCompanyInfo() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icoServiceSettings/icoCompanyInfo/icoCompanyInfo.html'
        };
    }
})();
