(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserCryptoAccountsModalCtrl', AddUserCryptoAccountsModalCtrl);

    function AddUserCryptoAccountsModalCtrl($scope,Rehive,$uibModalInstance,toastr,$stateParams,localStorageManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userCryptoAccountParams = {
            crypto_type: 'Bitcoin',
            network: 'testnet',
            user: vm.uuid,
            address: '',
            metadata: '',
            status: 'Pending'
        };
        $scope.cryptoStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('token');

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.addUserCryptoAccount = function(userCryptoAccountParams){
            if(vm.token) {
                var metaData;
                if(userCryptoAccountParams.metadata){
                    if(vm.isJson(userCryptoAccountParams.metadata)){
                        metaData =  JSON.parse(userCryptoAccountParams.metadata);
                    } else {
                        toastr.error('Incorrect metadata format');
                        return false;
                    }
                } else {
                    metaData = {};
                }

                $scope.loadingUserCryptoAccounts = true;
                userCryptoAccountParams.crypto_type = userCryptoAccountParams.crypto_type.toLowerCase();
                userCryptoAccountParams.status = userCryptoAccountParams.status.toLowerCase();

                var newCryptoAccount = {
                    crypto_type: userCryptoAccountParams.crypto_type,
                    network: userCryptoAccountParams.network,
                    user: vm.uuid,
                    address: userCryptoAccountParams.address,
                    metadata: metaData,
                    status: userCryptoAccountParams.status
                };

                Rehive.admin.users.cryptoAccounts.create(newCryptoAccount).then(function (res) {
                    toastr.success('Crypto account successfully added');
                    $scope.userCryptoAccountParams = {
                        crypto_type: 'Bitcoin',
                        network: 'testnet',
                        user: vm.uuid,
                        address: '',
                        metadata: '',
                        status: 'Pending'
                    };
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
