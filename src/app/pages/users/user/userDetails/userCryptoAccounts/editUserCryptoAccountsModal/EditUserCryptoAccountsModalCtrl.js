(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserCryptoAccountsModalCtrl', EditUserCryptoAccountsModalCtrl);

    function EditUserCryptoAccountsModalCtrl($scope,$uibModalInstance,userCryptoAccount,toastr,$stateParams,$filter,
                                             Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.cryptoAccount = userCryptoAccount;
        $scope.editUserCryptoAccountParams = {};
        vm.updatedUserCryptoAccount = {};
        $scope.loadingUserCryptoAccounts = true;
        $scope.cryptoStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('token');

        vm.getUserCryptoAccount =  function () {
            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                Rehive.admin.users.cryptoAccounts.get({id: $scope.cryptoAccount.id}).then(function (res) {
                    $scope.loadingUserCryptoAccounts = false;
                    $scope.editUserCryptoAccountParams = res;
                    if(typeof $scope.editUserCryptoAccountParams.metadata == 'object'){
                        if(Object.keys($scope.editUserCryptoAccountParams.metadata).length == 0){
                            $scope.editUserCryptoAccountParams.metadata = '';
                        } else {
                            $scope.editUserCryptoAccountParams.metadata = JSON.stringify($scope.editUserCryptoAccountParams.metadata);
                        }
                    }
                    $scope.editUserCryptoAccountParams.status = $filter('capitalizeWord')($scope.editUserCryptoAccountParams.status);
                    $scope.editUserCryptoAccountParams.crypto_type = $filter('capitalizeWord')($scope.editUserCryptoAccountParams.crypto_type);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserCryptoAccount();

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.userCryptoAccountChanged =  function (field) {
            vm.updatedUserCryptoAccount[field] = $scope.editUserCryptoAccountParams[field];
        };

        $scope.editUserCryptoAccount =  function () {

            if($scope.editUserCryptoAccountParams.metadata){
                if(vm.isJson($scope.editUserCryptoAccountParams.metadata)){
                    vm.updatedUserCryptoAccount.metadata =  JSON.parse($scope.editUserCryptoAccountParams.metadata);
                } else {
                    toastr.error('Incorrect metadata format');
                    return false;
                }
            } else {
                vm.updatedUserCryptoAccount.metadata = {};
            }

            if(vm.updatedUserCryptoAccount.status){
                vm.updatedUserCryptoAccount.status = vm.updatedUserCryptoAccount.status.toLowerCase();
            }

            if(vm.updatedUserCryptoAccount.crypto_type){
                vm.updatedUserCryptoAccount.crypto_type = vm.updatedUserCryptoAccount.crypto_type.toLowerCase();
            }

            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                Rehive.admin.users.cryptoAccounts.update($scope.editUserCryptoAccountParams.id,vm.updatedUserCryptoAccount).then(function (res) {
                    $scope.loadingUserCryptoAccounts = false;
                    toastr.success('Crypto account successfully updated');
                    $scope.editingUserCryptoAccounts = !$scope.editingUserCryptoAccounts;
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    vm.getUserCryptoAccount($scope.editUserCryptoAccountParams);
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
