(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService')
        .directive('currencyConversionServiceNavigation', currencyConversionServiceNavigation);

    /** @ngInject */
    function currencyConversionServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/currencyConversionService/currencyConversionNavigation/currencyConversionNavigation.html',
            controller: function($rootScope,$scope,$location){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
