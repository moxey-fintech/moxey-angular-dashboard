(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupAccountConfigurations')
        .controller('ManageGroupAccountConfigModalCtrl', ManageGroupAccountConfigModalCtrl);

    function ManageGroupAccountConfigModalCtrl($scope,$uibModalInstance,toastr,$stateParams,_,$timeout,
                                               Rehive,localStorageManagement,errorHandler,accountConfig) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroupAccountConfigurations = false;
        $scope.editAccountConfiguration = accountConfig;
        $scope.editAccountConfiguration.prevName = accountConfig.name;
        $scope.accountConfigurationCurrencies = {
            list: _.map(accountConfig.currencies,'code')
        };
        $scope.currenciesList = [];

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesList = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.groupEditAccountConfigurationNameToLowercase = function () {
            if($scope.editAccountConfiguration.name){
                $scope.editAccountConfiguration.name = $scope.editAccountConfiguration.name.toLowerCase();
            }
        };

        $scope.updateAccountConfiguration = function (editAccountConfiguration) {
            $scope.loadingGroupAccountConfigurations = true;
            var updateAccountConfiguration = {
                name: editAccountConfiguration.name,
                label: editAccountConfiguration.label,
                default: editAccountConfiguration.default,
                primary: editAccountConfiguration.primary
            };

            Rehive.admin.groups.accountConfigurations.update(vm.groupName,editAccountConfiguration.prevName,updateAccountConfiguration).then(function (res)
            {
                editAccountConfiguration.name = res.name;
                $scope.separateCurrencies(editAccountConfiguration);
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.separateCurrencies = function (editAccountConfiguration) {
            var newCurrencyArray = [],deleteCurrencyArray = [],currencies = [];

            currencies = _.map(editAccountConfiguration.currencies,'code');
            newCurrencyArray = _.difference(currencies,$scope.accountConfigurationCurrencies.list);
            deleteCurrencyArray = _.difference($scope.accountConfigurationCurrencies.list,currencies);

            if(deleteCurrencyArray.length > 0){
                deleteCurrencyArray.forEach(function (currencyCode,index,array) {
                    $scope.deleteAccountConfigCurrency(editAccountConfiguration,currencyCode);
                    if(index === (array.length -1)){
                        if(newCurrencyArray.length > 0){
                            newCurrencyArray.forEach(function (currencyCode,index,array) {
                                if(index === (array.length -1)){
                                    $scope.createAccountConfigCurrency(editAccountConfiguration,currencyCode,'last');
                                } else{
                                    $scope.createAccountConfigCurrency(editAccountConfiguration,currencyCode);
                                }
                            });
                        } else {
                            $timeout(function () {
                                $scope.loadingGroupAccountConfigurations = false;
                                toastr.success('Account configuration successfully updated');
                                $uibModalInstance.close(true);
                            },800);
                        }
                    }
                });
            } else {
                if(newCurrencyArray.length > 0){
                    newCurrencyArray.forEach(function (currencyCode,index,array) {
                        if(index === (array.length -1)){
                            $scope.createAccountConfigCurrency(editAccountConfiguration,currencyCode,'last');
                        } else{
                            $scope.createAccountConfigCurrency(editAccountConfiguration,currencyCode);
                        }
                    });
                } else {
                    $timeout(function () {
                        $scope.loadingGroupAccountConfigurations = false;
                        toastr.success('Account configuration successfully updated');
                        $uibModalInstance.close(true);
                    },800);
                }
            }


        };

        $scope.deleteAccountConfigCurrency = function(editAccountConfiguration,currencyCode){
            $scope.loadingGroupAccountConfigurations = true;
            Rehive.admin.groups.accountConfigurations.currencies.delete(vm.groupName,editAccountConfiguration.name,currencyCode).then(function (res) {

            }, function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
            });
        };

        $scope.createAccountConfigCurrency = function(editAccountConfiguration,currencyCode,last){
            $scope.loadingGroupAccountConfigurations = true;
            Rehive.admin.groups.accountConfigurations.currencies.create(vm.groupName,editAccountConfiguration.name,
                {
                    currency: currencyCode
                }).then(function (res) {
                if(last){
                    $timeout(function () {
                        $scope.loadingGroupAccountConfigurations = false;
                        toastr.success('Account configuration successfully updated');
                        $uibModalInstance.close(res);
                    },800);
                }
            }, function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
