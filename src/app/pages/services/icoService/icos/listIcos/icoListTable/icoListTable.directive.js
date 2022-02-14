(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.listIcos')
        .directive('icoListTable', icoListTable);

    /** @ngInject */
    function icoListTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icos/listIcos/icoListTable/icoListTable.html'
        };
    }
})();