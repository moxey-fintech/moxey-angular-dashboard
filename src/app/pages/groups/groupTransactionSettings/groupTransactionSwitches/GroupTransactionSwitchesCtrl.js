(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionSwitches')
        .controller('GroupTransactionSwitchesCtrl', GroupTransactionSwitchesCtrl);

    /** @ngInject */
    function GroupTransactionSwitchesCtrl($scope,$stateParams,Rehive,_,localStorageManagement,errorHandler,disallowedSubtypeHandlerService,toastr,$filter,accountDefinitionService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.activeTabIndex = 0;
        $scope.groupSettingsObj = {};
        $scope.loadingGroupSettings = false;
        $scope.companyCurrencies = [];
        $scope.accountDefinitions = [];
        $scope.subtypesList = [];
        $scope.disallowedSubtypesByGroup = [];
        $scope.totalDisallowedGroupSubtypeCount = 0;
        $scope.displayedDisallowedGroupSubtypes = 0;
        
        vm.formatDisallowedSubtypes = function(disallowedSubtypesArr){
            var count = 0;
            $scope.disallowedSubtypesByGroup = disallowedSubtypeHandlerService.mapAndFormatSubtypeObjects(
                disallowedSubtypesArr, $scope.disallowedSubtypesByGroup
            );

            
            $scope.disallowedSubtypesByGroup.forEach(function(disallowedSubtypeObj){
                if(disallowedSubtypeObj.setting == 'custom' && !disallowedSubtypeObj.disabled){
                    ++count;
                }
            });
            $scope.totalDisallowedGroupSubtypeCount = count;
        };

        $scope.getGroupSettings = function () {
            if(vm.token) {
                // $scope.loadingGroupSettings = true;
                Rehive.admin.groups.settings.get(vm.groupName).then(function (res) {
                    if(res.name === "service"){
                        res.name = "extension";
                    }
                    $scope.groupSettingsObj = res;
                    vm.formatDisallowedSubtypes($scope.groupSettingsObj.disallowed_transaction_subtypes);
                    $scope.loadingGroupSettings = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroupSettings = false;
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
                    $scope.getGroupSettings();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.storeFormattedSubtypes = function(){
            $scope.disallowedSubtypesByGroup = [];
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
                $scope.disallowedSubtypesByGroup.push(formattedSubtype);
            });
        };

        vm.getTransactionSubtypes = function(){
            if(vm.token) {
                $scope.loadingGroupSettings = true;
                Rehive.admin.subtypes.get().then(function (res) {
                    $scope.subtypesList = res;
                    if($scope.subtypesList && $scope.subtypesList.length > 0){
                        $scope.subtypesList.forEach(function(subtype){
                            subtype.ref_key = subtype.name + '_' + subtype.id;
                        });
                    }    
                    vm.storeFormattedSubtypes();                
                    vm.getCurrencyOptions();
                    vm.accountDefinitions();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroupSettings = false;
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

        $scope.toggleGroupSettings = function (groupSetting,type) {
            var updatedSetting = {};
            updatedSetting[type] = groupSetting;

            if(vm.token) {
                Rehive.admin.groups.settings.update(vm.groupName,updatedSetting).then(function (res) {
                    $scope.groupSettingsObj = {};
                    if(res.name === "service"){
                        res.name = "extension";
                    }
                    $scope.groupSettingsObj = res;
                    toastr.success('Group transaction setting updated successfully');
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
            $scope.disallowedSubtypesByGroup.forEach(function(element){
                if(element.setting !== 'allow'){
                    disallowedTransactionSubtypes.push(element);
                }
            });
            disallowedTransactionSubtypes = disallowedSubtypeHandlerService.getFormattedDisallowedSubtypes(disallowedTransactionSubtypes);
            $scope.toggleGroupSettings(disallowedTransactionSubtypes, 'disallowed_transaction_subtypes');
        };

        $scope.trackDisplayOfDisallowedCurrencies = function(subtype, showCurrencies) {
            subtype.show_settings = showCurrencies;
            $scope.displayedDisallowedGroupSubtypes += showCurrencies ? 1 : -1;
        };

        $scope.toggleDisplayOfAllCustomSettings = function(showAllCustomRules){
            $scope.disallowedSubtypesByGroup.forEach(function(subtype){
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
                    --$scope.totalDisallowedGroupSubtypeCount;
                    if(subtype.show_settings){
                        $scope.trackDisplayOfDisallowedCurrencies(subtype, false);
                    }
                } else if(subtype.setting === 'custom'){
                    ++$scope.totalDisallowedGroupSubtypeCount;
                    $scope.trackDisplayOfDisallowedCurrencies(subtype, true);
                }
                subtype.prev_setting = subtype.setting;
            }
        };
    }
})();
