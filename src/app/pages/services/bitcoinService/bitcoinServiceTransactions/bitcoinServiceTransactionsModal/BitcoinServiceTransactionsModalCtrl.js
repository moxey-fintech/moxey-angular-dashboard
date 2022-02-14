(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceTransactions')
        .controller('BitcoinServiceTransactionsModalCtrl', BitcoinServiceTransactionsModalCtrl);

    function BitcoinServiceTransactionsModalCtrl($uibModalInstance,$scope,transaction,metadataTextService,
                                                 localStorageManagement,$state,$location) {

        var vm = this;
        $scope.rehive_response = metadataTextService.convertToText(transaction.rehive_response);
        $scope.transaction = transaction;
        vm.serviceUrl = null;
        $scope.bitcoinBlockTrailUrl = 'https://live.blockcypher.com/btc';

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
