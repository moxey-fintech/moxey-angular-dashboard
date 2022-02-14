(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService')
        .directive('ethereumServiceNavigation', ethereumServiceNavigation);

    /** @ngInject */
    function ethereumServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceNavigation/ethereumServiceNavigation.html',
            controller: function($rootScope,$scope,$location){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
