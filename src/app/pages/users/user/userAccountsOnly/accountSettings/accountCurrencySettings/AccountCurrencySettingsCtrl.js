(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencySettings')
        .controller('AccountCurrencySettingsCtrl', AccountCurrencySettingsCtrl);

    /** @ngInject */
    function AccountCurrencySettingsCtrl($scope,$stateParams,Rehive,localStorageManagement,errorHandler,$rootScope,toastr,$filter,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.shouldBeBlue = 'Users';
        vm.currencyCode = $stateParams.currencyCode;
        vm.reference = $stateParams.reference;
        $scope.disallowedSubtypes = [];
        $scope.accountCurrencySettingsObj = {};
        $scope.loadingAccountCurrencySettings = true;

        vm.formatAllowedSubtypes = function(){
            var len = $scope.disallowedSubtypes.length;
            $scope.accountCurrencySettingsObj.disallowed_transaction_subtypes.forEach(function(disallowedSubtype){
                var idx = -1;
                for(var i = 0; i < len; ++i){
                    if($scope.disallowedSubtypes[i].id === disallowedSubtype.id){
                        idx = i;
                        break;
                    }
                }

                if(idx > -1){
                    $scope.disallowedSubtypes[i].setting = 'disallow';
                    $scope.disallowedSubtypes[i].prev_setting = 'disallow';
                }
            });
        };  

        vm.getGroupSettings = function () {
            if(vm.token) {
                $scope.loadingAccountCurrencySettings = true;
                Rehive.admin.accounts.currencies.settings.get(vm.reference,vm.currencyCode).then(function (res) {
                    $scope.loadingAccountCurrencySettings = false;
                    $scope.accountCurrencySettingsObj = res;
                    vm.formatAllowedSubtypes();
                    $scope.loadingAccountCurrencySettings = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountCurrencySettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.loadTransactionSubtypes = function(){
            if(vm.token) {
                $scope.loadingAccountCurrencySettings = true;
                Rehive.admin.subtypes.get().then(function (res) {
                    $scope.subtypesList = res;        
                    $scope.subtypesList.sort(function(a, b){
                        a.label = a.label ? a.label : $filter('capitalizeWord')(a.name).replace('_', ' ');
                        b.label = b.label ? b.label : $filter('capitalizeWord')(b.name).replace('_', ' ');
                        return a.label.localeCompare(b.label);
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
                            show_currency: false,
                            odd_row: (idx % 2) == 1,
                            currencies: []
                        };
                        $scope.disallowedSubtypes.push(formattedSubtype);
                    });
                    vm.getGroupSettings();
                    $scope.loadingAccountCurrencySettings = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.loadTransactionSubtypes();

        $scope.toggleAccountCurrencySettings = function (groupSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !groupSetting;

            if(vm.token) {
                $scope.loadingAccountCurrencySettings = true;
                Rehive.admin.accounts.currencies.settings.update(vm.reference,vm.currencyCode,updatedSetting).then(function (res) {
                    $scope.accountCurrencySettingsObj = {};
                    $scope.accountCurrencySettingsObj = res;
                    toastr.success("Account transaction setting updated");
                    $scope.loadingAccountCurrencySettings = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountCurrencySettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };     

        $scope.updateGlobalDisallowedSubtypes = function(disalloweSubtypeArr){
            var updatedSetting = {
                'disallowed_transaction_subtypes': disalloweSubtypeArr
            };
            $scope.updatingGlobalTransactionSetting = true;
            if(vm.token) {
                $scope.loadingAccountCurrencySettings = true;
                Rehive.admin.accounts.currencies.settings.update(vm.reference,vm.currencyCode,updatedSetting).then(function (res) {
                    $scope.accountCurrencySettingsObj.disallowed_transaction_subtypes = res.disallowed_transaction_subtypes;
                    vm.formatAllowedSubtypes();
                    toastr.success("Account transaction subtype setting updated");
                    $scope.loadingAccountCurrencySettings = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountCurrencySettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };       
        
        $scope.updateDisallowedSubtypeChange = function(){
            var disallowedTransactionSubtypes = [];
            $scope.disallowedSubtypes.forEach(function(element){
                if(element.setting !== 'allow'){
                    disallowedTransactionSubtypes.push(element.id);
                }
            });

            $scope.updateGlobalDisallowedSubtypes(disallowedTransactionSubtypes);
        };


    }
})();