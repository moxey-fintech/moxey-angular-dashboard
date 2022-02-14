(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies.currenciesList')
        .controller('DeleteCurrencyModalCtrl', DeleteCurrencyModalCtrl);


    function DeleteCurrencyModalCtrl($scope,Rehive,currency,$uibModalInstance,$filter,toastr,
                                  $ngConfirm,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.currency = currency;
        $scope.deletingCurrencies = false;
        $scope.groupsParams = {};

        $scope.archiveCurrency = function(deleteCurrency){
            $scope.deletingCurrencies = true;
            Rehive.admin.currencies.update($scope.currency.code,{ archived : true}).then(function (res) {
                if(deleteCurrency){
                    $scope.deleteCompanyCurrency();
                    $scope.$apply();
                } else {
                    $scope.deletingCurrencies = false;
                    toastr.success('Currency successfully archived');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }
            }, function (error) {
                $scope.deletingCurrencies = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteCompanyCurrencyPrompt = function(currency) {
            $ngConfirm({
                title: 'Delete currency',
                contentUrl: 'app/pages/currencies/currenciesList/deleteCurrencyModal/deleteCurrencyPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText !== 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            if(!$scope.currency.archived){
                                $scope.archiveCurrency('deleteCurrency');
                            } else {
                                scope.deleteCompanyCurrency();
                            }
                        }
                    }
                }
            });
        };

        $scope.deleteCompanyCurrency = function () {
            if(vm.token) {
                $scope.deletingCurrencies = true;
                Rehive.admin.currencies.delete($scope.currency.code).then(function (res) {
                    toastr.success('Currency successfully deleted');
                    $scope.deletingCurrencies = false;
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.deletingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
