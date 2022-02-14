(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens')
        .directive('tokensList', tokensList);

    /** @ngInject */
    function tokensList() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/developers/tokens/tokensList/tokensList.html'
        };
    }
})();
