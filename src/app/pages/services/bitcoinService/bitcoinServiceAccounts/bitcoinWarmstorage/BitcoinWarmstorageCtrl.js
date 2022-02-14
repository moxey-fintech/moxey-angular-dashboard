(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('BitcoinWarmstorageCtrl', BitcoinWarmstorageCtrl);

    /** @ngInject */
    function BitcoinWarmstorageCtrl($scope,localStorageManagement,errorHandler,currenciesList,$http,$uibModal,multiOptionsFilterService,$state,cleanObject,Rehive,
                                    sharedResources,_,environmentConfig,currencyModifiers,toastr,serializeFiltersService,$location,extensionsHelper) {


        var vm = this;
        vm.serviceUrl = null;
        var serviceName = "bitcoin_service";
        // vm.serviceUrl = "https://bitcoin-testnet.services.rehive.io/api/1/";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.bitcoinCurrency = {
            code: "XBT",
            description: "Bitcoin",
            symbol: "₿",
            unit: "bitcoin",
            divisibility: 8
        };
        $scope.showOptionsAccountRef = false;
        $scope.loadingWarmstorage = false;
        $scope.loadingHdkeys = true;
        $scope.warmstorageCurrencies = null;
        $scope.allCurrenciesPresent = true;

        $scope.warmstorageAccounts = [];
        $scope.primaryWarmstorageAccount = null; 
        $scope.showingWarmstorageDropdown = false;
        $scope.warmstorageTransactions = [];
        $scope.warmstorageObjLength = 0;
        $scope.warmstorageSetupStep = 4;
        $scope.showAdvancedSetupOptions = false;
        $scope.hdKeyValidPrefixes = ["xpub", "ypub", "zpub", "Ypub", "Zpub"];
        $scope.hdkeyAddressTypeOptions = [
            {name: "Bech32", value: "p2wpkh"},
            {name: "P2SH segwit", value: "p2wpkh-p2sh"},
            {name: "Legacy", value: "p2pkh"},
            {name: "Don't know", value: ""}
        ];
        $scope.newWarmStorageParams = {
            hdkey: null,
            first_generated_address: null,
            primary: true,
            status: "Active",
            address_type: null
        };

        $scope.closeOptionsBox = function () {
            $scope.showOptionsAccountRef = false;
        };

        $scope.toggleCurrenciesOptions = function () {
            $scope.showOptionsAccountRef = !$scope.showOptionsAccountRef;
        };
        
        // onchain balances logic start

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

        $scope.getOnChainBalances = function(){
            if(vm.token) {
                $scope.loadingWarmstorage = true;
                $http.get(vm.serviceUrl + 'admin/hdkeys/' + $scope.primaryWarmstorageAccount.id + '/?expand=onchain_data', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.primaryWarmstorageAccount.onchain_balance = res.data.data.onchain_data.balance;
                    var allCurrenciesPresent = true;
                    var onchainData = res.data.data.onchain_data;

                    // $scope.warmstorageCurrencies.forEach(function(currency){
                    //     onchainData.balances.non_native_balances.forEach(function(balance){
                    //         if(balance.asset_code && balance.asset_code === currency.currency.code){
                    //             currency.onchain_balance = balance.balance;
                    //             currency.exists = true;
                    //             return;
                    //         }
                    //         else if(currency.currency.code === $scope.bitcoinCurrency.code){
                    //             currency.exists = true;
                    //             if(balance.asset_type == 'native'){
                    //                 currency.onchain_balance = balance.balance;
                    //             }
                    //         }
                    //     });
                    //     if(!currency.exists){
                    //         allCurrenciesPresent = false;
                    //     }
                    // });

                    if(!allCurrenciesPresent){
                        vm.getHotwalletPublicAddress(warmstorageAccount);
                    }
                    $scope.loadingWarmstorage =  false;
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        // onchain balances logic end

        // warmstorage account and transactions logic

        vm.getRehiveCurrencies = function(){
            var filterObj = serializeFiltersService.objectFilters({
                page: 1,
                page_size: 25,
                reference: $scope.warmstorageObj.rehive_account_reference,
            });

            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                $scope.warmstorageCurrencies = res.results[0].currencies;
                $scope.warmstorageCurrencies.forEach(function(currency){
                    currency.exists = (currency.currency.code === $scope.bitcoinCurrency.code);
                }); 
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
                var filtersObj = {
                    page: 1,
                    page_size: 10,
                    account: $scope.warmstorageObj.rehive_account_reference
                };

                Rehive.admin.transactions.get({filters: filtersObj}).then(function (res) {
                    $scope.warmstorageTransactions = res.results;   
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
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };       

        $scope.openEditingNoteModal = function (page,size, primaryAccount) {
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditStellarWarmstorageNoteModalCtrl',
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
                    $scope.warmstorageObjLength = $scope.warmstorageObj ? Object.keys($scope.warmstorageObj).length : 0;
                    vm.getRehiveCurrencies();
                    vm.getLatestTransactions();
                    $scope.loadingWarmstorage =  false;
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        }; 

        // warmstorage account and transactions logic end


        // Bitcoin hdKeys logic start

        $scope.addWarmStoragePublicAddressModal = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddBitcoinHdKeyCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(hdKey){
                if(hdKey){
                    $scope.getWarmStoragePublicAddresses();
                }
            }, function(){
            });
        };

        $scope.updateWarmstorageAccountPrimary = function(){
            if(vm.token){
                $scope.loadingWarmstorage =  true;
                
                var message = $scope.primaryWarmstorageAccount.primary ? 'Warmstorage account successfully set as primary' : 'Warmstorage account successfully unset as primary';
                $http.patch(vm.serviceUrl + 'admin/hdkeys/' + $scope.primaryWarmstorageAccount.id + '/', {primary: $scope.primaryWarmstorageAccount.primary}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage = false;
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
                var message = activityStatus == 'Disabled' ? 'Warmstorage account successfully disabled' : 'Warmstorage account successfully activated';
                $http.patch(vm.serviceUrl + 'admin/hdkeys/' + $scope.primaryWarmstorageAccount.id + '/', {status: activityStatus}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage = false;
                    toastr.success(message);
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleWarmstoragePrimary = function(){
            $scope.primaryWarmstorageAccount.primary = !$scope.primaryWarmstorageAccount.primary;
            $scope.updateWarmstorageAccountPrimary();
        };

        $scope.toggleWarmstorageDropdown = function(){
            $scope.showingWarmstorageDropdown = !$scope.showingWarmstorageDropdown;
            if($scope.showingWarmstorageDropdown){
                $("#bitcoinDropdown").trigger("chosen:open");
                event.stopPropagation();
            } else {
                $("#bitcoinDropdown").trigger("chosen:close");
                event.stopPropagation();
                $scope.allCurrenciesPresent = false;
                $scope.getOnChainBalances();
            }
        };

        $scope.goToWarmstoragePage = function(){
            $scope.getWarmStoragePublicAddresses();
        };

        $scope.goToWarmstorageSetupStep = function(step){
            $scope.warmstorageSetupStep = step;
        };

        $scope.createWarmstorage = function () {
            var validHDKey = false;
            $scope.hdKeyValidPrefixes.forEach(function(prefix){
                if($scope.newWarmStorageParams.hdkey.startsWith(prefix)){
                    validHDKey = true;
                    return true;
                }
            });

            if(!validHDKey){
                toastr.error("HDKey is not valid. HDKey must start with valid a prefix among " + $scope.hdKeyValidPrefixes.join(","));
                return false;
            }
            if(!$scope.newWarmStorageParams.address_type || $scope.newWarmStorageParams.address_type.value === ""){
                delete $scope.newWarmStorageParams['address_type'];
            } else {
                $scope.newWarmStorageParams.address_type = $scope.newWarmStorageParams.address_type.value;
            }
            $scope.loadingWarmstorage = true;
            $http.post(vm.serviceUrl + 'admin/hdkeys/', $scope.newWarmStorageParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                toastr.success('Warmstorage successfully created');
                $scope.goToWarmstorageSetupStep(3);
                $scope.loadingWarmstorage = false;
            }).catch(function (error) {
                $scope.loadingWarmstorage = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.warmStoragePublicAddressPagination = {
            itemsPerPage: 3,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWarmStoragePublicAddressUrl = function(){
            var searchObj = {
                page: 1,
                page_size: 250
            };

            return vm.serviceUrl + 'admin/hdkeys/?' +
                serializeFiltersService.serializeFilters(cleanObject.cleanObj(searchObj));
        };

        $scope.getWarmStoragePublicAddresses = function () {
            if(vm.token) {
                $scope.loadingHdkeys = true;
                $scope.goToWarmstorageSetupStep(4);
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
                        vm.getWarmstorage();
                        var warmstorageAccount = null;
                        $scope.warmStoragePublicAddressesList.forEach(function(hdKey){
                            hdKey.onchain_balance = 0;
                            if(hdKey.primary === true){
                                warmstorageAccount = hdKey;
                            }
                        });
                        if(warmstorageAccount){
                            $scope.primaryWarmstorageAccount = warmstorageAccount;
                            $scope.getOnChainBalances();
                        }
                        else {
                            $scope.primaryWarmstorageAccount = $scope.warmStoragePublicAddressesList.length > 0 ? $scope.warmStoragePublicAddressesList[0] : null;
                        }
                    } else {
                        $scope.goToWarmstorageSetupStep(1);
                    }
                    $scope.loadingHdkeys = false;
                }).catch(function (error) {
                    $scope.loadingHdkeys = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        // Bitcoin hdKeys logic end

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
                .then(function(serviceUrl){
                    vm.serviceUrl = serviceUrl;
                    $scope.getWarmStoragePublicAddresses();
                })
                .catch(function(err){
                    $scope.loadingHdkeys = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                });
        };
        vm.fetchServiceUrl(serviceName);

        $scope.goToWarmstorageTransactions = function(){
            $state.go('transactions.history', {currencyCode: $scope.bitcoinCurrency.code });
        };
    }
})();
