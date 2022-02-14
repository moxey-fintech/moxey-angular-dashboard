(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserCryptoAccountsCtrl', UserCryptoAccountsCtrl);

    /** @ngInject */
    function UserCryptoAccountsCtrl($scope,Rehive,$stateParams,
                                    localStorageManagement,errorHandler,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.userCryptoAccountsList = [];
        $scope.loadingUserCryptoAccounts = true;
        $scope.userCryptoTypeOptions = ['Bitcoin','Ethereum','Stellar','Other'];

        vm.getUserCryptoAccounts = function(){
            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                Rehive.admin.users.cryptoAccounts.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserCryptoAccounts = false;
                    $scope.userCryptoAccountsList = res.results;
                    $scope.userCryptoAccountsList.forEach(function(cryptoAccount){
                        cryptoAccount.crypto_type = cryptoAccount.crypto_type.charAt(0).toUpperCase() + cryptoAccount.crypto_type.substring(1, cryptoAccount.crypto_type.length);
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserCryptoAccounts();

        $scope.openEditUserCryptoAccountsModal = function (page, size,userCryptoAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserCryptoAccountsModalCtrl',
                scope: $scope,
                resolve: {
                    userCryptoAccount: function () {
                        return userCryptoAccount;
                    }
                }
            });

            vm.theModal.result.then(function(userCryptoAccount){
                if(userCryptoAccount){
                    vm.getUserCryptoAccounts();
                }
            }, function(){
            });
        };

        $scope.openAddUserCryptoAccountsModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserCryptoAccountsModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(userCryptoAccount){
                if(userCryptoAccount){
                    vm.getUserCryptoAccounts();
                }
            }, function(){
            });
        };

        vm.findIndexOfUserCryptoAccount = function (element) {
            return this.id == element.id;
        };

        $scope.openUserCryptoAccountsModal = function (page, size,userCryptoAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserCryptoAccountsModalCtrl',
                scope: $scope,
                resolve: {
                    userCryptoAccount: function () {
                        return userCryptoAccount;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(userCryptoAccount){
                if(userCryptoAccount){
                    var index = $scope.userCryptoAccountsList.findIndex(vm.findIndexOfUserCryptoAccount,userCryptoAccount);
                    $scope.userCryptoAccountsList.splice(index, 1);
                    vm.getUserCryptoAccounts();
                }
            }, function(){
            });
        };


    }
})();
