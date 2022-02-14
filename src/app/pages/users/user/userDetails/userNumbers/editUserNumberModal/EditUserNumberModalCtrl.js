(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserNumberModalCtrl', EditUserNumberModalCtrl);

    function EditUserNumberModalCtrl($scope,Rehive,$stateParams,$uibModalInstance,user,number,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        $scope.user = user;
        $scope.number = number;
        vm.uuid = $stateParams.uuid;
        $scope.editUserNumberObj = {};
        vm.updatedUserNumber = {};
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingUserNumbers = false;


        vm.getUserNumber =  function () {
            if(vm.token) {
                $scope.loadingUserNumbers = true;
                Rehive.admin.users.mobiles.get({id: $scope.number.id}).then(function (res) {
                    $scope.loadingUserNumbers = false;
                    $scope.editUserNumberObj = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserNumbers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserNumber();

        $scope.editUserNumber =  function (editUserNumberObj) {
            if(vm.token) {
                $scope.loadingUserNumbers = true;
                Rehive.admin.users.mobiles.update($scope.number.id,editUserNumberObj).then(function (res) {
                    $scope.loadingUserNumbers = false;
                    toastr.success('Number successfully updated');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserNumbers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
