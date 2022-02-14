(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreService')
        .directive('wyreServiceNavigation', wyreServiceNavigation);

    /** @ngInject */
    function wyreServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/wyreService/wyreServiceNavigation/wyreServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
