(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.stats')
        .controller('TransactionSettingsCtrl', TransactionSettingsCtrl);

    /** @ngInject */
    function TransactionSettingsCtrl($scope,Rehive,disallowedSubtypeHandlerService,$http,environmentConfig,$filter,$location,
                                   localStorageManagement,toastr,_,errorHandler,accountDefinitionService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.TOKEN = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.updatingGlobalTransactionSetting = false;
        $scope.updatingCryptoTransactionSetting = false;
        $scope.updatingGlobalSubtypeSetting = false;
        $scope.loadingTransactionSettings = false;
        $scope.subtypesList = [];
        $scope.disallowedTransactionSubtypes = [];
        $scope.accountDefinitions = [];
        $scope.totalDisabledSubtypeCount = 0;
        $scope.displayedDisabledSubtypeCount = 0;
        $scope.companyCurrencies = [];
        $scope.transactionSettingsObj = {
            allow_transactions: false,
            allow_debit_transactions: false,
            allow_credit_transactions: false,
            crypto_urls: null,
            allowed_subtypes: [],
            disallowed_transaction_subtypes: []
        };
        $scope.groups = [];

        $scope.goToGroupTransactionSetting = function(groupName){
            var groupSettingUrl = '/groups/' + groupName + '/transaction-settings/group-controls';
            $location.path(groupSettingUrl);
        };

        vm.formatAllowedSubtypes = function(){
            $scope.totalDisabledSubtypeCount = 0;
            $scope.displayedDisabledSubtypeCount = 0;
            $scope.disallowedTransactionSubtypes = disallowedSubtypeHandlerService.mapAndFormatSubtypeObjects(
                $scope.transactionSettingsObj.disallowed_transaction_subtypes, $scope.disallowedTransactionSubtypes
            );

            
            $scope.disallowedTransactionSubtypes.forEach(function(disallowedSubtypeObj){
                if(disallowedSubtypeObj.setting == 'custom'){
                    $scope.totalDisabledSubtypeCount += !disallowedSubtypeObj.disabled ? 1 : 0;
                } else if(disallowedSubtypeObj.custom_settings.length == 0){
                    disallowedSubtypeObj.custom_settings.push({
                        setting: 'currency'
                    });
                }
            });
        }; 

        vm.loadTransactionSubtypes = function(){
            if(vm.token) {
                Rehive.admin.subtypes.get().then(function (res) {
                    $scope.subtypesList = res; 
                    $scope.subtypesList.sort(function(a, b){
                        return a.name.localeCompare(b.name);
                     });  
                    $scope.subtypesList.forEach(function(subtype, idx, arr){
                        var formattedSubtype = {
                            id: subtype.id,
                            description: subtype.description,
                            label: subtype.label,
                            name: subtype.name,
                            tx_type: subtype.tx_type,
                            setting: 'allow',
                            prev_setting: 'allow',
                            show_settings: false,
                            odd_row: (idx % 2) == 1,
                            disabled: false,
                            custom_settings: []
                        };
                        $scope.disallowedTransactionSubtypes.push(formattedSubtype);
                    });
                    vm.formatAllowedSubtypes();
                    $scope.loadingTransactionSettings = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCurrencyOptions = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                    if($scope.companyCurrencies.length > 0){
                        $scope.companyCurrencies.length = 0;
                    }
                    $scope.companyCurrencies = res.results.slice();
                    $scope.companyCurrencies.sort(function(a, b){
                        return a.code.localeCompare(b.code);
                    });
                    vm.loadTransactionSubtypes();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCompanyAccountDefinitions = function(){
            if(vm.token){
                accountDefinitionService.getAccountDefinition({filters: {archived: false}})
                .then(function(res){
                    if($scope.accountDefinitions.length > 0){
                        $scope.accountDefinitions.length = 0;
                    }
                    $scope.accountDefinitions = res.results;
                }, function(error){
                    $scope.loadingGroupSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCompanyGroups = function(){
            if(vm.token){
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    $scope.groups = res.results;
                    $scope.groups.forEach(function(group){
                        if(!group.label){
                            group.label = $filter('capitalizeWord')(group.name).replace('_', ' ');
                        }
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCompanySettings = function(){
            if(vm.token) {
                $scope.loadingTransactionSettings = true;
                Rehive.admin.company.settings.get().then(function (res) {
                    $scope.transactionSettingsObj.allow_transactions = res.allow_transactions;
                    $scope.transactionSettingsObj.allow_debit_transactions = res.allow_debit_transactions;
                    $scope.transactionSettingsObj.allow_credit_transactions = res.allow_credit_transactions;
                    $scope.transactionSettingsObj.disallowed_transaction_subtypes = res.disallowed_transaction_subtypes;
                    vm.getCompanyGroups();
                    vm.getCompanyAccountDefinitions();
                    vm.loadCryptoExtensions();
                    vm.getCurrencyOptions();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanySettings();

        vm.loadCryptoExtensions = function(){
            if(vm.TOKEN){
                $http.get(environmentConfig.API + 'admin/services/?active=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.TOKEN
                    }
                }).then(function (res) {
                    var activeServicesList = [];
                    if (res.status === 200 || res.status === 201) {
                        activeServicesList =  res.data.data.results;
                        if(activeServicesList.length > 0){
                            for(var i = 0; i < activeServicesList.length; ++i){
                                if(activeServicesList[i].slug === "bitcoin_service" || activeServicesList[i].slug === "bitcoin_testnet_service" 
                                || activeServicesList[i].slug === "stellar_service" || activeServicesList[i].slug === "stellar_testnet_service"){
                                    $scope.transactionSettingsObj.crypto_urls = $scope.transactionSettingsObj.crypto_urls ? $scope.transactionSettingsObj.crypto_urls : {};
                                    $scope.transactionSettingsObj.crypto_urls[activeServicesList[i].slug] = {url: activeServicesList[i].url, disable_withdrawals: false};
                                    vm.loadCryptoExtensionSetting(activeServicesList[i].slug);
                                }                                
                            }
                        }
                    }                    
                }).catch(function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.loadCryptoExtensionSetting = function(extension){
            if(vm.TOKEN){
                var cryptoUrl = $scope.transactionSettingsObj.crypto_urls[extension].url;
                $http.get(cryptoUrl + 'admin/company/configuration/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.TOKEN
                    }
                }).then(function (res) {
                    $scope.transactionSettingsObj.crypto_urls[extension].disable_withdrawals = res.data.data.disable_withdrawals;
                }).catch(function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        }; 

        $scope.updateCryptoTransactionSettings = function(extension){
            if(vm.TOKEN){
                $scope.transactionSettingsObj.crypto_urls[extension].disable_withdrawals = !$scope.transactionSettingsObj.crypto_urls[extension].disable_withdrawals;
                var cryptoUrl = $scope.transactionSettingsObj.crypto_urls[extension].url;
                $scope.updatingCryptoTransactionSetting = true;
                $http.patch(cryptoUrl + 'admin/company/configuration/', { disable_withdrawals: $scope.transactionSettingsObj.crypto_urls[extension].disable_withdrawals }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.TOKEN
                    }
                }).then(function (res) {
                    $scope.transactionSettingsObj.crypto_urls[extension].disable_withdrawals = res.data.data.disable_withdrawals;
                    $scope.updatingCryptoTransactionSetting = false;
                    toastr.success("Crypto transaction setting successfully updated");
                }).catch(function (error) {
                    $scope.updatingCryptoTransactionSetting = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };  

        $scope.addCustomRule = function(subtypeObj){
            subtypeObj.custom_settings.push({
                setting: 'currency'
            });
        };

        $scope.removeCustomRule = function(subtypeObj, $index){
            subtypeObj.custom_settings.splice($index, 1);
        };

        $scope.updateGlobalTransactionSubtypes = function (disallowedTransactionSubtypes) {
            $scope.updatingGlobalSubtypeSetting = true;
            if(vm.token) {
                Rehive.admin.company.settings.update({disallowed_transaction_subtypes: disallowedTransactionSubtypes}).then(function (res) {
                    $scope.transactionSettingsObj.disallowed_transaction_subtypes = res.disallowed_transaction_subtypes;
                    $scope.updatingGlobalSubtypeSetting = false;
                    toastr.success("Global transaction subtype controls successfully updated");
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingGlobalSubtypeSetting = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.updateGlobalTransactionSettings = function (txnSetting,type) {
            var updatedSetting = {};
            updatedSetting[type] = txnSetting;

            $scope.updatingGlobalTransactionSetting = true;
            if(vm.token) {
                Rehive.admin.company.settings.update(updatedSetting).then(function (res) {
                    $scope.transactionSettingsObj[type] = res[type];
                    $scope.updatingGlobalTransactionSetting = false;
                    toastr.success("Global transaction setting successfully updated");
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingGlobalTransactionSetting = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.updateDisallowedSubtypeChange = function(){
            var disallowedTransactionSubtypes = [];
            $scope.disallowedTransactionSubtypes.forEach(function(element){
                if(element.setting !== 'allow'){
                    disallowedTransactionSubtypes.push(element);
                }
            });
            disallowedTransactionSubtypes = disallowedSubtypeHandlerService.getFormattedDisallowedSubtypes(disallowedTransactionSubtypes);
            $scope.updateGlobalTransactionSubtypes(disallowedTransactionSubtypes, 'disallowed_transaction_subtypes');
        };

        $scope.trackDisplayOfDisallowedCurrencies = function(subtype, showAllCustomRules) {
            subtype.show_settings = showAllCustomRules;
            $scope.displayedDisabledSubtypeCount += showAllCustomRules ? 1 : -1;
        };

        $scope.toggleDisplayOfAllCustomSettings = function(showAllCustomRules){
            $scope.disallowedTransactionSubtypes.forEach(function(subtype){
                if(subtype.setting === 'custom' && subtype.show_settings !== showAllCustomRules){
                    $scope.trackDisplayOfDisallowedCurrencies(subtype, showAllCustomRules);
                }
            });
            setTimeout(function(){
                $scope.$apply();
            }, 50);
        };

        $scope.trackSubtypeSettingChange = function(subtype) {
            if(subtype.prev_setting !== subtype.setting){
                if(subtype.prev_setting === 'custom'){
                    --$scope.totalDisabledSubtypeCount;
                    if(subtype.show_settings){
                        $scope.trackDisplayOfDisallowedCurrencies(subtype, false);
                    }
                } else if(subtype.setting === 'custom'){
                    ++$scope.totalDisabledSubtypeCount;
                    $scope.trackDisplayOfDisallowedCurrencies(subtype, true);
                }
                subtype.prev_setting = subtype.setting;
            }
        };   
    }
})();
