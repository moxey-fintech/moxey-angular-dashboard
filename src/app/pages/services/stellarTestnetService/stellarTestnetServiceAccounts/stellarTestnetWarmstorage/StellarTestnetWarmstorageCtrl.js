(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('StellarTestnetWarmstorageCtrl', StellarTestnetWarmstorageCtrl);

    /** @ngInject */
    function StellarTestnetWarmstorageCtrl($scope,localStorageManagement,errorHandler,$http,$uibModal,multiOptionsFilterService,cleanObject,
                                           sharedResources,_,$state,environmentConfig,currencyModifiers,toastr,serializeFiltersService, animateScroll,Rehive,$location,extensionsHelper) {

        var vm = this;
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = null;
        var serviceName = "stellar_testnet_service";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.stellarCurrency = {
            code: "TXLM",
            description: "Stellar Lumen",
            symbol: "*",
            unit: "lumen",
            divisibility: 7
        };
        $scope.showOptionsAccountRef = false;
        $scope.loadingWarmStoragePublicAddresses = true;
        $scope.loadingWarmstorage = false;
        $scope.warmstorageCurrencies = null;
        $scope.allCurrenciesPresent = true;
        $scope.loadingWarmstorageCurrencies = false;
        $scope.warmstorageAccounts = [];
        $scope.primaryWarmstorageAccount = null;
        $scope.showingWarmstorageDropdown = false;
        $scope.warmstorageTransactions = [];
        $scope.warmstorageSetupStep = 4;
        $scope.havePrivateKey = false;
        $scope.newWarmstorageParams = {
            account_address: null,
            status: "Active",
            primary: true
        };

        $scope.toggleWarmstoragePrimary = function(){
            $scope.primaryWarmstorageAccount.primary = !$scope.primaryWarmstorageAccount.primary;
            $scope.updateWarmstorageAccountPrimary();
        };

        $scope.toggleWarmstorageDropdown = function(){
            $scope.showingWarmstorageDropdown = !$scope.showingWarmstorageDropdown;
            if($scope.showingWarmstorageDropdown){
                $("#stellarDropdown").trigger("chosen:open");
                event.stopPropagation();
            } else {
                $("#stellarDropdown").trigger("chosen:close");
                // event.stopPropagation();
                $scope.allCurrenciesPresent = false;
                vm.getOnChainBalances($scope.primaryWarmstorageAccount);
            }
        };

        $scope.goToWarmstorageTransactions = function(){
            $state.go('transactions.history', {currencyCode: 'TXLM'});
        };

        $scope.scrollToUnassignedTransactions = function(){
            animateScroll.scrollDown($('#unassignedStellarTestnetTransactions'));
        };

        vm.getWarmStorageAccount = function(){
            if(vm.token){
                $scope.warmstorageAccounts = [];
                $scope.primaryWarmstorageAccount = null;
                $http.get(vm.serviceUrl + 'admin/warmstorage/accounts', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var warmstorageAccount = null; 
                    $scope.warmstorageAccounts = res.data.data.results;
                    $scope.warmstorageAccounts.forEach(function(account){
                        if(account.primary === true){
                            warmstorageAccount = account;
                            return false;
                        }
                    });
                    if(warmstorageAccount){
                        $scope.primaryWarmstorageAccount = warmstorageAccount;
                        vm.getOnChainBalances(warmstorageAccount);
                    }
                    else{
                        $scope.primaryWarmstorageAccount = $scope.warmstorageAccounts[0];
                        $scope.loadingWarmstorage = false;
                    }
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getHotwalletPublicAddress = function(warmstorageAccount){
            $http.get(vm.serviceUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
               $scope.allCurrenciesPresent = (res.data.data.account_address === warmstorageAccount.account_address);
            }).catch(function (error) {
                $scope.loadingHotwalletTransactions =  false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getOnChainBalances = function(warmstorageAccount){
            if(vm.token) {
                $scope.loadingWarmstorage = true;
                $http.get(vm.serviceUrl + 'admin/stellar_accounts/' + warmstorageAccount.id + '/?expand=onchain_data', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var allCurrenciesPresent = true;
                    var onchainData = res.data.data.onchain_data;
                    $scope.warmstorageCurrencies.forEach(function(currency){
                        onchainData.balances.non_native_balances.forEach(function(balance){                            
                            if(balance.asset_code && balance.asset_code === currency.currency.code){
                                currency.onchain_balance = balance.balance;
                                currency.exists = true;
                                return;
                            }
                            else if(currency.currency.code === 'TXLM'){
                                if(balance.asset_type == 'native'){
                                    currency.onchain_balance = balance.balance;
                                }
                            }
                        });
                        if(!currency.exists){
                            allCurrenciesPresent = false;                            
                        }
                    });

                    if(!allCurrenciesPresent){
                        vm.getHotwalletPublicAddress(warmstorageAccount);
                    }
                    $scope.loadingWarmstorage = false;
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    if(error.status !== 400){
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        vm.getRehiveCurrencies = function(warmstorageObj){
            var filterObj = serializeFiltersService.objectFilters({
                page: 1,
                page_size: 25,
                reference: warmstorageObj.rehive_account_reference,
            });

            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                $scope.warmstorageCurrencies = res.results[0].currencies;
                $scope.warmstorageCurrencies.forEach(function(currency){
                    currency.exists = (currency.currency.code === 'TXLM');
                    currency.showMenu = false;
                });
                vm.getWarmStorageAccount();               
                $scope.$apply();
            }, function (error) {
                $scope.loadingWarmstorage =  false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getLatestTransactions = function(){
            if(vm.token) {
                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;
                $scope.warmstorageTransactions = [];

                $http.get(vm.serviceUrl + 'admin/transactions/?user=None&tx_type=credit', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.warmstorageTransactions = res.data.data.results;
                    if ($scope.warmstorageTransactions.length == 0) {
                        $scope.transactionsStateMessage = 'No transactions have been found';
                    }
                    else {
                        $scope.warmstorageTransactions.forEach(function(transaction){
                            transaction.hash = (transaction.metadata && transaction.metadata.hash) ? transaction.metadata.hash : '--';
                        });
                        $scope.transactionsStateMessage = '';
                    }  
                    $scope.loadingTransactions = false;
                }, function (error) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
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
                    $scope.warmstorageObj = res.data.data;
                    vm.getRehiveCurrencies($scope.warmstorageObj);  
                    vm.getLatestTransactions();               
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    $scope.transactionsWarmstorageStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.openDisplayUnAssignedTxnModal = function(page, size, unassignedTxn){
            vm.theDisplayTxnModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DisplayStellarTestnetUnAssignedTxnModalCtrl',
                resolve: {
                    unassignedTxn: function(){
                        return unassignedTxn;
                    }
                }
            });

            vm.theDisplayTxnModal.result.then(function(assigned){
                if(assigned){
                    vm.getLatestTransactions();
                }
            }, function(){
            });            
        };

        //Public address logic

        $scope.addStellarPublicAddress = function () {
            if(vm.token){
                $http.post(vm.serviceUrl + 'admin/warmstorage/accounts/', $scope.newWarmstorageParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage = false;
                    toastr.success('Public address successfully added');
                    $scope.warmstorageSetupStep = 3;
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.createWarmstorageAccount = function(){
            if(!$scope.newWarmstorageParams.account_address.startsWith('G')){
                toastr.error("Provided key is not a Stellar public address. Public addresses always start with a 'G'");
                return false;
            }
            if(vm.token){
                $scope.loadingWarmstorage = true;
                $http.get(vm.serviceUrl + 'admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.hotwalletObj = res.data.data;
                    if($scope.hotwalletObj.primary_stellar_account 
                        && $scope.hotwalletObj.primary_stellar_account.account_address
                        && $scope.hotwalletObj.primary_stellar_account.account_address === $scope.newWarmstorageParams.account_address){
                            $scope.loadingWarmstorage = false;
                            toastr.error('Warm storage address cannot be the same as the Hot wallet address');
                            return false;
                    } else {
                        $scope.addStellarPublicAddress();
                    }
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    $scope.transactionsHotwalletStateMessage = 'Failed to load data';
                    if(error.status == 404){
                        $scope.addStellarPublicAddress();
                    } else {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        $scope.goToWarmStoragePage = function(){
            $scope.getWarmStoragePublicAddresses();
        };

        $scope.warmStoragePublicAddressPagination = {
            itemsPerPage: 3,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWarmStoragePublicAddressUrl = function(){

            var searchObj = {
                page: $scope.warmStoragePublicAddressPagination.pageNo,
                page_size: $scope.warmStoragePublicAddressPagination.itemsPerPage
            };

            return vm.serviceUrl + 'admin/warmstorage/accounts/?' +
                serializeFiltersService.serializeFilters(cleanObject.cleanObj(searchObj));
        };

        $scope.getWarmStoragePublicAddresses = function () {
            if(vm.token) {
                $scope.loadingWarmStoragePublicAddresses = true;
                $scope.warmstorageSetupStep = 4;
                var publicAddressUrl = vm.getWarmStoragePublicAddressUrl();

                $http.get(publicAddressUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.warmStoragePublicAddressData = res.data.data;
                    $scope.warmStoragePublicAddressesList = $scope.warmStoragePublicAddressData.results;
                    if($scope.warmStoragePublicAddressesList.length > 0){
                        $scope.loadingWarmstorage = true;
                        vm.getWarmstorage();  
                    } else {
                        $scope.warmstorageSetupStep = 1;
                    }
                    $scope.loadingWarmStoragePublicAddresses = false;
                }).catch(function (error) {
                    $scope.loadingWarmStoragePublicAddresses = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.addWarmStoragePublicAddressModal = function (page,size) {
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddStellarTestnetWarmstoragePublicAddressModalCtrl'
            });

            vm.thePublicAddressModal.result.then(function(address){
                if(address){
                    vm.getWarmStorageAccount();
                    $scope.getWarmStoragePublicAddresses();
                }
            }, function(){
            });
        };

        //Public address logic ends

        $scope.openEditingNoteModal = function (page,size, primaryAccount) {
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditStellarTestnetWarmstorageNoteModalCtrl',
                resolve: {
                    primaryAccount: function(){
                        return primaryAccount;
                    }
                }
            });

            vm.thePublicAddressModal.result.then(function(note_updated){
                if(note_updated){
                    vm.getWarmstorage();
                }
            }, function(){
            });
        };

        $scope.openAssignTransactionModal = function(page, size, transaction){
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AssignStellarTestnetTransactionModalCtrl',
                resolve: {
                    transaction: function(){
                        return transaction;
                    }
                }
            });

            vm.thePublicAddressModal.result.then(function(transactionAssigned){
                if(transactionAssigned){
                    vm.getLatestTransactions();
                }
            }, function(){
            });
        };

        $scope.updateWarmstorageAccountPrimary = function(){
            if(vm.token){
                $scope.loadingWarmstorage =  true;
                
                var message = $scope.primaryWarmstorageAccount.primary ? 'Warmstorage account successfully set as primary' : 'Warmstorage account successfully unset as primary';
                $http.patch(vm.serviceUrl + 'admin/warmstorage/accounts/' + $scope.primaryWarmstorageAccount.id + '/', {primary: $scope.primaryWarmstorageAccount.primary}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage = false;
                    $scope.primaryWarmstorageAccount = res.data.data;
                    toastr.success(message);
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateWarmstorageAccountStatus = function(activityStatus){
            if(vm.token){
                $scope.loadingWarmstorage =  true;
                var message = activityStatus == 'Disabled' ? 'Warmstorage account successfully disabled' : 'Warmstorage account successfully enabled';
                $http.patch(vm.serviceUrl + 'admin/warmstorage/accounts/' + $scope.primaryWarmstorageAccount.id + '/', {status: activityStatus}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage = false;
                    $scope.primaryWarmstorageAccount = res.data.data;
                    toastr.success(message);
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
                .then(function(serviceUrl){
                    vm.serviceUrl = serviceUrl;
                    $scope.getWarmStoragePublicAddresses();
                })
                .catch(function(err){
                    $scope.loadingWarmStoragePublicAddresses = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
