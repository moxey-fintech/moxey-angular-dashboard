(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('EthereumWarmstorageCtrl', EthereumWarmstorageCtrl);

    /** @ngInject */
    function EthereumWarmstorageCtrl($scope,localStorageManagement,errorHandler,currenciesList,$http,$uibModal,multiOptionsFilterService,extensionsHelper,$state,
                                    sharedResources,_,environmentConfig,currencyModifiers,toastr,serializeFiltersService,$location) {


        var vm = this;
        vm.serviceUrl = null; 
        var serviceName = "ethereum_service";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.ethereumCurrency = currenciesList.find(function (element) {
            return element.code == 'ETH';
        });
        $scope.showOptionsAccountRef = false;
        $scope.loadingWarmstorage = true;

        $scope.closeOptionsBox = function () {
            $scope.showOptionsAccountRef = false;
        };

        $scope.toggleCurrenciesOptions = function () {
            $scope.showOptionsAccountRef = !$scope.showOptionsAccountRef;
        };

        $scope.goToWarmstorageTransactions = function(){
            $state.go('transactions.history', {accountRef: $scope.warmstorageObj.rehive_account_reference});
        };
        
        vm.getWarmstorage = function (applyFilter) {
            $scope.loadingWarmstorage =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/warmstorage/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.warmstorageObj = res.data.data;
                        $scope.loadingWarmstorage =  false;
                    }
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };       

        $scope.goToCredit = function () {
            $location.path('/transactions/history').search({
                txType: 'credit',
                currencyCode: 'ETH',
                userIdentity: $scope.warmstorageObj.user_account_identifier,
                accountUser: $scope.warmstorageObj.rehive_account_reference
            });
        };

        $scope.goToDebit = function () {
            $location.path('/transactions/history').search({
                txType: 'debit',
                currencyCode: 'ETH',
                userIdentity: $scope.warmstorageObj.user_account_identifier,
                accountUser: $scope.warmstorageObj.rehive_account_reference
            });
        };

        $scope.openWarmstorageModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'WarmstorageTransactionModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    },
                    uuid: function () {
                        return $scope.warmstorageObj.user_account_identifier;
                    }
                }
            });

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.clearWarmstorageFilters();
                    $scope.getLatestWarmstorageTransactions();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getWarmstorage();
            })
            .catch(function(err){
                $scope.loadingWarmstorage = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
