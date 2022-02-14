(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.overview')
        .controller('EditDisplayCodeModalCtrl', EditDisplayCodeModalCtrl);

    function EditDisplayCodeModalCtrl($scope,Rehive,$uibModalInstance,toastr,$window,localStorageManagement,errorHandler,$location,currencyObj) {

        var vm = this;
        $scope.currencyObj = currencyObj;
        $scope.updatingDisplayCode = false;
        vm.token = localStorageManagement.getValue('token');

        $scope.updateDisplayCode = function(){
            var updateObj = {
                display_code: $scope.currencyObj.display_code
            }
            Rehive.admin.currencies.update($scope.currencyObj.code, updateObj)
            .then(function (res) {
                $scope.updatingDisplayCode = true;
                toastr.success('Successfully updated the display code');
                $uibModalInstance.close(res);
                $scope.$apply();
            })
            .catch (function (error) {
            $scope.updatingDisplayCode = false;
            errorHandler.evaluateErrors(error);
            errorHandler.handleErrors(error);
            $scope.$apply();
            });
        }
    };
})();
