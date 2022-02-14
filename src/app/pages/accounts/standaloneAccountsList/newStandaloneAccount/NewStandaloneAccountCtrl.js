(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.standaloneAccList')
        .controller('NewStandaloneAccountCtrl', NewStandaloneAccountCtrl);

    /** @ngInject */
    function NewStandaloneAccountCtrl($scope,localStorageManagement,typeaheadService,$uibModalInstance,userEmail,
                                 errorHandler,toastr,Rehive) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        
        $scope.addingAccounts = false;
        $scope.advancedOption = false;
        $scope.addAccountParams = {};
        $scope.currenciesForNewAccount = {
            list: [],
            primary: false
        };        
        $scope.accountAssociation = 'none';

        vm.getCompanyCurrencies = function(){
            $scope.addingAccounts = true;
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.addingAccounts = false;
                    $scope.currenciesList = res.results;
                    $scope.$apply();
                }, function (error) {
                    $scope.addingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.toggleAdvancedOption = function () {
            $scope.advancedOption = !$scope.advancedOption;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.addAccount = function(addAccountParams){
            if (addAccountParams.user) {
                delete addAccountParams.user;
            }
            
            if(vm.token) {
                $scope.addingAccounts = true;
                Rehive.admin.accounts.create(addAccountParams).then(function (res) {
                    if($scope.currenciesForNewAccount.list.length > 0){
                        vm.addNewAccountCurrencies($scope.currenciesForNewAccount.list,res.reference);
                        $scope.$apply();
                    } else{
                        $scope.addingAccounts = false;
                        $scope.addAccountParams = {};
                        toastr.success('Standalone account successfully added');
                        $uibModalInstance.close(res);
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.addingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.addNewAccountCurrencies = function(listOfCurrencies,reference){

            listOfCurrencies.forEach(function (element,index,array) {
                if(vm.token) {
                    Rehive.admin.accounts.currencies.create(reference,{currency: element.code}).then(function (res) {
                        if(index == (array.length - 1)) {
                            $scope.addingAccounts = false;
                            $scope.addAccountParams = {};
                            $scope.currenciesForNewAccount = {list: []};
                            toastr.success('Account successfully added');
                            $uibModalInstance.close(true);
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.currenciesForNewAccount = {list: []};
                        $scope.addingAccounts = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
            });
        };



    }
})();
