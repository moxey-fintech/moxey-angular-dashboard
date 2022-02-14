(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService')
        .directive('stripeServiceNavigation', stripeServiceNavigation);

    /** @ngInject */
    function stripeServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stripeService/stripeServiceNavigation/stripeServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
