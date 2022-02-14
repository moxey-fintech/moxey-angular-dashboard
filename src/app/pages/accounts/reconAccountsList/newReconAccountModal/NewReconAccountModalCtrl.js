(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.reconAccList')
        .controller('NewReconAccountModalCtrl', NewReconAccountModalCtrl);

    /** @ngInject */
    function NewReconAccountModalCtrl($scope,localStorageManagement,typeaheadService,$uibModalInstance,userEmail,
                                 errorHandler,toastr,Rehive) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        
        $scope.addingAccounts = false;
        $scope.advancedOption = false;
        $scope.addAccountParams = {};
        $scope.currenciesForNewAccount = {
            list: [],
            primary: false,
            recon: true
        };
        $scope.accountAssociation = 'user';
        if(userEmail){
            $scope.addAccountParams.user = userEmail;
        }

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

        $scope.trackPrimaryStatus = function(association) {
            if(association === 'none'){
                $scope.addAccountParams.primary = false;
            }
        };

        $scope.trackNameChange = function(){
            $scope.addAccountParams.name = $scope.addAccountParams.name.toLowerCase().replace(/ /g, '_');
        };

        $scope.toggleAdvancedOption = function () {
            $scope.advancedOption = !$scope.advancedOption;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.addAccount = function(addAccountParams){
            if ($scope.accountAssociation === 'none') {
                addAccountParams.primary = false;
                delete addAccountParams.user;
            }
            addAccountParams.recon = true;
            if(vm.token) {
                $scope.addingAccounts = true;
                Rehive.admin.accounts.create(addAccountParams).then(function (res) {
                    if($scope.currenciesForNewAccount.list.length > 0){
                        vm.addNewAccountCurrencies($scope.currenciesForNewAccount.list,res.reference);
                        $scope.$apply();
                    } else{
                        $scope.addingAccounts = false;
                        $scope.addAccountParams = {};
                        toastr.success('Account successfully added');
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