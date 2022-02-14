(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.massSendService')
        .directive('massSendServiceNavigation', massSendServiceNavigation);

    /** @ngInject */
    function massSendServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/massSendService/massSendServiceNavigation/massSendServiceNavigation.html',
            controller: function($rootScope,$scope,$location){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
