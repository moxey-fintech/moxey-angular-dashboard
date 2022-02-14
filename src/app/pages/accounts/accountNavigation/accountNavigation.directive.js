(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts')
        .directive('accountNavigation', accountNavigation);

    /** @ngInject */
    function accountNavigation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/accounts/accountNavigation/accountNavigation.html'
        };
    }
})();