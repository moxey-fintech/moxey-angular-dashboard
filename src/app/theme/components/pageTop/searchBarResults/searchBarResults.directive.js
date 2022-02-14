/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('searchBarResults', searchBarResults);

    /** @ngInject */
    function searchBarResults() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/theme/components/pageTop/searchBarResults/searchBarResults.html'
        };
    }

})();