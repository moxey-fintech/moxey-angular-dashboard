(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.flashService')
        .directive('flashServiceNavigation', flashServiceNavigation);

    /** @ngInject */
    function flashServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/flashService/flashServiceNavigation/flashServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
