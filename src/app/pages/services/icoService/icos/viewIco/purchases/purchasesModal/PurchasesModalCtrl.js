(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.purchases')
        .controller('PurchasesModalCtrl', PurchasesModalCtrl);

    function PurchasesModalCtrl($uibModalInstance,$scope,purchase,icoObj,$location,$state) {

        $scope.purchase = purchase;

        $scope.icoObj = icoObj;

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + $scope.purchase.quote.user + '/details');
        };

        $scope.goToTransactions = function(transactionCode){
            $uibModalInstance.close();
            $state.go('transactions.history',{"transactionId": transactionCode});
        }
    }
})();
