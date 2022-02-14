(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreTestnetService')
        .directive('wyreTestnetServiceNavigation', wyreTestnetServiceNavigation);

    /** @ngInject */
    function wyreTestnetServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/wyreTestnetService/wyreTestnetServiceNavigation/wyreTestnetServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
