(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.paymentRequestsService')
        .directive('paymentRequestsServiceNavigation', paymentRequestsServiceNavigation);

    /** @ngInject */
    function paymentRequestsServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/paymentRequestsService/paymentRequestsServiceNavigation/paymentRequestsServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
