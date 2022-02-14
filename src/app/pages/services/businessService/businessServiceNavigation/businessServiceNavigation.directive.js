(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService')
        .directive('businessServiceNavigation', businessServiceNavigation);

    /** @ngInject */
    function businessServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/businessService/businessServiceNavigation/businessServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
