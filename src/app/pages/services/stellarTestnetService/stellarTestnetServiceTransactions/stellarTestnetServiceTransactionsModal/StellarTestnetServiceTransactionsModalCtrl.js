(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceTransactions')
        .controller('StellarTestnetServiceTransactionsModalCtrl', StellarTestnetServiceTransactionsModalCtrl);

    function StellarTestnetServiceTransactionsModalCtrl($uibModalInstance,$scope,transaction,metadataTextService,$state,$location) {
        $scope.metadata = metadataTextService.convertToText(transaction.metadata);
        $scope.transaction = transaction;

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + $scope.transaction.user.id + '/details');
        };

        $scope.goToTransactions = function(rehiveCode){
            $uibModalInstance.close();
            $state.go('transactions.history',{"transactionId": rehiveCode});
        };
    }
})();
