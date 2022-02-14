(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .controller('StellarColdstorageCtrl', StellarColdstorageCtrl);

    /** @ngInject */
    function StellarColdstorageCtrl($scope,localStorageManagement,errorHandler,currenciesList,$http,$uibModal,$location,cleanObject,extensionsHelper,$state,
                                    sharedResources,_,environmentConfig,currencyModifiers,toastr,serializeFiltersService,multiOptionsFilterService) {


        var vm = this;
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = null; 
        var serviceName = "stellar_service";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.publicAddressesList = [];
        $scope.stellarCurrency = currenciesList.find(function (element) {
            return element.code == 'XLM';
        });
        $scope.showOptionsAccountRef = false;
        $scope.loadingColdstorage = true;

        $scope.closeOptionsBox = function () {
            $scope.showOptionsAccountRef = false;
        };

        $scope.toggleCurrenciesOptions = function () {
            $scope.showOptionsAccountRef = !$scope.showOptionsAccountRef;
        };

        $scope.goToColdstorageTransactions = function(){
            $state.go('transactions.history', {accountRef: $scope.coldstorageObj.rehive_account_reference});
        };

        vm.getColdstorage = function (applyFilter) {
            $scope.loadingColdstorage =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/coldstorage/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.coldstorageObj = res.data.data;
                        $scope.loadingColdstorage =  false;
                    }
                }).catch(function (error) {
                    $scope.loadingColdstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        

        //Public address logic

        $scope.publicAddressPagination = {
            itemsPerPage: 3,
            pageNo: 1,
            maxSize: 5
        };

        vm.getPublicAddressUrl = function(){

            var searchObj = {
                page: $scope.publicAddressPagination.pageNo,
                page_size: $scope.publicAddressPagination.itemsPerPage
            };

            return vm.serviceUrl + 'admin/coldstorage/accounts/?' +
                serializeFiltersService.serializeFilters(cleanObject.cleanObj(searchObj));
        };

        $scope.getPublicAddresses = function () {
            if(vm.token) {
                $scope.loadingPublicAddresses = true;
                var publicAddressUrl = vm.getPublicAddressUrl();

                $http.get(publicAddressUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.loadingPublicAddresses = false;
                        $scope.publicAddressData = res.data.data;
                        $scope.publicAddressesList = $scope.publicAddressData.results;
                    }
                }).catch(function (error) {
                    $scope.loadingPublicAddresses = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addPublicAddressModal = function (page,size) {
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddStellarPublicAddressModalCtrl'
            });

            vm.thePublicAddressModal.result.then(function(address){
                if(address){
                    $scope.getPublicAddresses();
                }
            }, function(){
            });
        };

        //Public address logic ends

        $scope.goToCredit = function () {
            $location.path('/transactions/history').search(
                {
                    txType: 'credit',
                    currencyCode: 'XLM',
                    userIdentity: $scope.coldstorageObj.user_account_identifier,
                    accountUser: $scope.coldstorageObj.rehive_account_reference
                });
        };

        $scope.goToDebit = function () {
            $location.path('/transactions/history').search(
                {
                    txType: 'debit',
                    currencyCode: 'XLM',
                    userIdentity: $scope.coldstorageObj.user_account_identifier,
                    accountUser: $scope.coldstorageObj.rehive_account_reference
                });
        };

        $scope.openColdstorageModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'StellarColdstorageTransactionModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    },
                    uuid: function () {
                        return $scope.coldstorageObj.user_account_identifier;
                    }
                }
            });

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.clearColdstorageFilters();
                    $scope.getLatestColdstorageTransactions();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getColdstorage();
                $scope.getPublicAddresses();
            })
            .catch(function(err){
                $scope.loadingColdstorage = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
