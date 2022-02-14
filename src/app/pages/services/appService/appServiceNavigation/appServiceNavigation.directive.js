(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceSettings')
        .directive('appServiceNavigation', appServiceNavigation);

    /** @ngInject */
    function appServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceNavigation/appServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
