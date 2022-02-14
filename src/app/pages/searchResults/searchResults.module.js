(function () {
    'use strict';

    angular.module('BlurAdmin.pages.searchResults', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('searchResults', {
                url: '/search-results',
                templateUrl: 'app/pages/searchResults/searchResults.html',
                controller: 'SearchResultsCtrl',
                title: 'Search results',                
                params: {
                    searchQueryObj: null
                }
            });
    }

})();
