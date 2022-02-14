(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService')
        .directive('icoServiceNavigation', icoServiceNavigation);

    /** @ngInject */
    function icoServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/icoService/icoServiceNavigation/icoServiceNavigation.html',
            controller: function($rootScope,$scope,$location){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
