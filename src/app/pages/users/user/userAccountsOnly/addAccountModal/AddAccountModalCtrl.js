(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('AddAccountModalCtrl', AddAccountModalCtrl);

    function AddAccountModalCtrl($scope,$uibModalInstance,toastr,Rehive,
                                 $stateParams,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.newUserAccountParams = {};
        vm.uuid = $stateParams.uuid;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingUserAccount = true;
        $scope.advancedOption = false;
        $scope.currenciesForNewAccount = {
            list: []
        };

        $scope.toggleAdvancedOption = function () {
            $scope.advancedOption = !$scope.advancedOption;
        };

        vm.getCompanyCurrencies = function(){
            $scope.addingUserAccount = true;
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.addingUserAccount = false;
                    $scope.currenciesList = res.results;
                    $scope.$apply();
                }, function (error) {
                    $scope.addingUserAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.addNewUserAccount = function(newUserAccountParams){
            if(vm.token) {
                newUserAccountParams.user = vm.uuid;
                $scope.addingUserAccount = true;
                Rehive.admin.accounts.create(newUserAccountParams).then(function (res) {
                    if($scope.currenciesForNewAccount.list.length > 0){
                        vm.addNewAccountCurrencies($scope.currenciesForNewAccount.list,res.reference);
                        $scope.$apply();
                    } else{
                        $scope.addingUserAccount = false;
                        $scope.newUserAccountParams = {};
                        toastr.success('Account successfully added');
                        $uibModalInstance.close(res);
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.addingUserAccount = false;
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
                            $scope.addingUserAccount = false;
                            $scope.newUserAccountParams = {};
                            $scope.currenciesForNewAccount = {list: []};
                            toastr.success('Account successfully added');
                            $uibModalInstance.close(res);
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.currenciesForNewAccount = {list: []};
                        $scope.addingUserAccount = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
            });
        };



    }
})();
