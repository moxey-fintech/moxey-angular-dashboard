(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService')
        .directive('krakenServiceNavigation', krakenServiceNavigation);

    /** @ngInject */
    function krakenServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/krakenService/krakenServiceNavigation/krakenServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
