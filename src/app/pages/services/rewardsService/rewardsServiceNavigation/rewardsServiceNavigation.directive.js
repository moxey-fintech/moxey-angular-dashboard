(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService')
        .directive('rewardsServiceNavigation', rewardsServiceNavigation);

    /** @ngInject */
    function rewardsServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/rewardsService/rewardsServiceNavigation/rewardsServiceNavigation.html',
            controller: function($rootScope,$scope,$location){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
