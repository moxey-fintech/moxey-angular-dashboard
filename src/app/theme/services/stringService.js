(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('stringService', stringService)
        .filter('formatUnderscoreToWhitespacedFilter', formatUnderscoreToWhitespacedFilter)
        .filter('formatWhitespacedToUnderscoredFilter', formatWhitespacedToUnderscoredFilter);

    /** @ngInject */
    function stringService() {

        return {
            capitalizeWord: function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
        }
    }

    function formatUnderscoreToWhitespacedFilter() {
        return function(string) {
            if(!string) return;
            return string.replaceAll(/_/g, ' ');
        };
    }

    function formatWhitespacedToUnderscoredFilter() {
        return function(string) {
            if(!string) return;
            return string.replaceAll(/ /g, '_');
        };
    }

})();