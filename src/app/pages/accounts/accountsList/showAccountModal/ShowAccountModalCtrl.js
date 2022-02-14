(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.userAccList')
        .controller('ShowAccountModalCtrl', ShowAccountModalCtrl);

    /** @ngInject */
    function ShowAccountModalCtrl($scope,localStorageManagement,$uibModalInstance,$uibModal,
                                 errorHandler,account,$window,$state,Rehive,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.accountRef = account.reference;
        $scope.accountObj = {};
        $scope.loadingAccount = false;

        vm.getAccount = function(){
            if(vm.token) {
                $scope.loadingAccount = true;
                Rehive.admin.accounts.get({reference: $scope.accountRef}).then(function (res) {
                    $scope.loadingAccount = false;
                    if(res.user && (res.user.groups.length > 0 && res.user.groups[0].name === "service")){
                        res.user.groups[0].name = "extension";
                    }
                    $scope.accountObj = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getAccount();

        $scope.goToUserDetails = function(){
            $location.path('/user/' + $scope.accountObj.user.id + '/details');
        };

        $scope.goToUserAccount = function () {
            $window.open('/#/user/' + $scope.accountObj.user.id + '/accounts?searchAccount=' + $scope.accountObj.reference,'_blank');
        };

        $scope.goToStandaloneAccount = function(currencyCode) {
            $location.path('/account/' + $scope.accountObj.reference + '/account-settings/' + currencyCode + '/account-limits');
        };

        $scope.goToAccountTransactions = function () {
            $uibModalInstance.close();
            $state.go('transactions.history',{"accountRef": $scope.accountRef});
        };

        $scope.openEditAccountModal = function (page, size,account,currencies) {
            vm.theEditAccountModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditAccountModalCtrl',
                scope: $scope,
                resolve: {
                    account: function () {
                        return account;
                    },
                    currenciesList: function () {
                        return currencies;
                    }
                }
            });

            vm.theEditAccountModal.result.then(function(account){
                if(account){
                    vm.getAccount();
                }
            }, function(){
            });
        };
        
        $scope.createNewTransaction = function(txType,currency,user,account){
            var locationSearchObj = {
                txType: txType,
                currencyCode: currency.code,
                accountUser: account
            };

            if(user){
                var userFieldName = txType === 'transfer' ? 'userEmail' : 'userIdentity';
                locationSearchObj[userFieldName] = user.email || user.mobile || user.id;
            }       
            
            $location.path('/transactions/history').search(locationSearchObj);
        };
    }
})();
