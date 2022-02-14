(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.tierTransactionSwitches')
        .controller('TierTransactionSwitchesCtrl', TierTransactionSwitchesCtrl);

    /** @ngInject */
    function TierTransactionSwitchesCtrl($scope,$stateParams,Rehive,_,localStorageManagement,errorHandler,$timeout,toastr,$filter,disallowedSubtypeHandlerService,accountDefinitionService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.activeTabIndex = 0;
        $scope.tierLevelsForSettings = [];
        vm.unsortedTierLevelsArray = [];    
        vm.sortedTierLevelsArray = [];               
        $scope.allTiers = [];               
        $scope.tierSettingsObj = {};
        $scope.loadingTierSettings = false;
        $scope.companyCurrencies = [];
        $scope.accountDefinitions = [];
        $scope.subtypesList = [];
        $scope.disallowedSubtypesByTier = [];
        $scope.totalDisallowedTierSubtypeCount = 0;
        $scope.displayedDisallowedTierSubtypes = 0;
        
        vm.updateDisallowedSubtypes = function(disallowedTierSubtypesArr){
            $scope.displayedDisallowedTierSubtypes = 0;
            $scope.totalDisallowedTierSubtypeCount = 0;
            $scope.disallowedSubtypesByTier = disallowedSubtypeHandlerService.mapAndFormatSubtypeObjects(
                disallowedTierSubtypesArr, JSON.parse(JSON.stringify($scope.subtypesList))
            );            
            $scope.disallowedSubtypesByTier.forEach(function(disallowedSubtypeObj){
                if(disallowedSubtypeObj.setting == 'custom'){
                    ++$scope.totalDisallowedTierSubtypeCount;
                }
            });

        };

        vm.getTierSettings = function () {
            if(vm.token) {
                $scope.loadingTierSettings = true;
                $scope.tierSettingsObj = {};
                $scope.disallowedSubtypesByTier = [];
                Rehive.admin.groups.tiers.settings.get(vm.groupName,$scope.selectedTier.id).then(function (res) {
                    $scope.tierSettingsObj = res;
                    vm.updateDisallowedSubtypes($scope.tierSettingsObj.disallowed_transaction_subtypes);
                    $scope.loadingTierSettings = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.selectTier = function(tierLevel,$index){
            var index = $scope.allTiers.findIndex(function(element){
                return element.level === tierLevel;
            });
            if(index > -1){
                $scope.selectedTier = $scope.allTiers[index];
                if($scope.selectedTier){
                    vm.getTierSettings();
                }
            }
        };

        $scope.getAllTiers = function(){
            if(vm.token) {
                Rehive.admin.groups.tiers.get(vm.groupName).then(function (res) {
                    vm.unsortedTierLevelsArray = _.map(res ,'level');
                    vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                        return a - b;
                    });
                    $scope.tierLevelsForSettings = vm.sortedTierLevelsArray;
                    $scope.allTiers = res.sort(function(a, b) {
                        return parseFloat(a.level) - parseFloat(b.level);
                    });
                    $scope.selectTier($scope.tierLevelsForSettings[0]);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.applyGroupLevelSubtypeSettings = function(disallowedGroupSubtypesArr){
            disallowedGroupSubtypesArr.forEach(function(disabledSubtype){
                var idx = $scope.subtypesList.findIndex(function(txnSubtype){
                    return txnSubtype.id === disabledSubtype.subtype.id;
                });

                if(idx > -1){
                    $scope.subtypesList[idx].group_disabled = true;
                }
            });
        };

        $scope.getGroupSettings = function () {
            if(vm.token) {
                Rehive.admin.groups.settings.get(vm.groupName).then(function (res) {
                    vm.applyGroupLevelSubtypeSettings(res.disallowed_transaction_subtypes);
                    $scope.getAllTiers();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.accountDefinitions = function(){
            if(vm.token){
                accountDefinitionService.getAccountDefinition({filters: {group: vm.groupName}})
                .then(function(res){
                    if($scope.accountDefinitions.length > 0){
                        $scope.accountDefinitions.length = 0;
                    }
                    $scope.accountDefinitions = res.results;
                    $scope.getGroupSettings();
                }, function(error){
                    $scope.loadingGroupSettings = false;
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
                    vm.accountDefinitions();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.storeFormattedSubtypes = function(tempTransactionSubtypesArr){
            $scope.subtypesList = [];
            tempTransactionSubtypesArr.sort(function(a, b){
                a.label = a.label ? a.label : $filter('capitalizeWord')(a.name).replace('_', ' ');
                b.label = b.label ? b.label : $filter('capitalizeWord')(b.name).replace('_', ' ');
                return a.label.localeCompare(b.label);
            });
            tempTransactionSubtypesArr.forEach(function(tempSubtype, idx, arr){
                var formattedSubtype = {
                    id: tempSubtype.id,
                    description: tempSubtype.description,
                    label: tempSubtype.label,
                    name: tempSubtype.name,
                    tx_type: tempSubtype.tx_type,
                    setting: 'allow',
                    prev_setting: 'allow',
                    show_settings: false,
                    odd_row: (idx % 2) == 1,
                    group_disabled: false,
                    custom_settings: []
                };
                $scope.subtypesList.push(formattedSubtype);
            });
        };

        vm.getTransactionSubtypes = function(){
            if(vm.token) {
                $scope.loadingTierSettings = true;
                Rehive.admin.subtypes.get().then(function (res) {
                    vm.storeFormattedSubtypes(res);           
                    vm.getCurrencyOptions();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getTransactionSubtypes();

        $scope.addCustomRule = function(subtypeObj){
            subtypeObj.custom_settings.push({
                setting: 'currency'
            });
        };
        
        $scope.removeCustomRule = function(subtypeObj, $index){
            subtypeObj.custom_settings.splice($index, 1);
        };

        $scope.toggleTierSettings = function (tierSetting,type) {
            var updatedSetting = {};
            updatedSetting[type] = tierSetting;

            if(vm.token) {
                Rehive.admin.groups.tiers.settings.update(vm.groupName,$scope.selectedTier.id,updatedSetting).then(function (res) {
                    toastr.success('Tier transaction setting updated successfully');
                    vm.getTierSettings();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.updateDisallowedSubtypeChange = function(){
            var disallowedTransactionSubtypes = [];
            $scope.disallowedSubtypesByTier.forEach(function(element){
                if(element.setting !== 'allow'){
                    disallowedTransactionSubtypes.push(element);
                }
            });
            disallowedTransactionSubtypes = disallowedSubtypeHandlerService.getFormattedDisallowedSubtypes(disallowedTransactionSubtypes);
            $scope.toggleTierSettings(disallowedTransactionSubtypes, 'disallowed_transaction_subtypes');
        };

        $scope.trackDisplayOfDisallowedCurrencies = function(subtype, showCurrencies) {
            subtype.show_settings = showCurrencies;
            $scope.displayedDisallowedTierSubtypes += showCurrencies ? 1 : -1;
        };

        $scope.toggleDisplayOfAllDisallowedCurrencies = function(showAllCurrencies){
            $scope.disallowedSubtypesByTier.forEach(function(subtype){
                if(subtype.setting === 'custom' && subtype.show_settings !== showAllCurrencies){
                    $scope.trackDisplayOfDisallowedCurrencies(subtype, showAllCurrencies);
                }
            });
            setTimeout(function(){
                $scope.$apply();
            }, 50);
        };

        $scope.trackSubtypeSettingChange = function(subtype) {
            if(subtype.prev_setting !== subtype.setting){
                if(subtype.prev_setting === 'custom'){
                    --$scope.totalDisallowedTierSubtypeCount;
                    if(subtype.show_settings){
                        $scope.trackDisplayOfDisallowedCurrencies(subtype, false);
                    }
                } else if(subtype.setting === 'custom'){
                    ++$scope.totalDisallowedTierSubtypeCount;
                    $scope.trackDisplayOfDisallowedCurrencies(subtype, true);
                }
                subtype.prev_setting = subtype.setting;
            }
        };
    }
})();
