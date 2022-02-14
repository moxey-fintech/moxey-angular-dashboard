(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService')
        .directive('chiplessCardServiceNavigation', chiplessCardServiceNavigation);

    /** @ngInject */
    function chiplessCardServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/chiplessCardService/chiplessCardServiceNavigation/chiplessCardServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
