(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService')
        .directive('stellarServiceNavigation', stellarServiceNavigation);

    /** @ngInject */
    function stellarServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceNavigation/stellarServiceNavigation.html',
            controller: function($rootScope,$scope,$location,$state){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];

                $scope.goToTransactions = function(){
                    $state.go('transactions.history', {currencyCode: 'XLM'});
                };
            }
        };
    }
})();
