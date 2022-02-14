(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService')
        .directive('exchangeServiceNavigation', exchangeServiceNavigation);

    /** @ngInject */
    function exchangeServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/exchangeService/exchangeServiceNavigation/exchangeServiceNavigation.html',
            controller: function($rootScope,$scope,$location){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
