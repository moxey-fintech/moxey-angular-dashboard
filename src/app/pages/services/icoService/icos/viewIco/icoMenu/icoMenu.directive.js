(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco')
        .directive('icoMenu', icoMenu);

    /** @ngInject */
    function icoMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icos/viewIco/icoMenu/icoMenu.html'
        };
    }
})();
