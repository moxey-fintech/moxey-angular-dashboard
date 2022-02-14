(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService')
        .directive('voucherMoneyServiceNavigation', voucherMoneyServiceNavigation);

    /** @ngInject */
    function voucherMoneyServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/voucherMoneyService/voucherMoneyServiceNavigation/voucherMoneyServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();
