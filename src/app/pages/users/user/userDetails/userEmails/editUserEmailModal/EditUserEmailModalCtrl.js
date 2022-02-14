(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserEmailModalCtrl', EditUserEmailModalCtrl);

    function EditUserEmailModalCtrl($scope,Rehive,$stateParams,$uibModalInstance,email,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        $scope.email = email;
        vm.uuid = $stateParams.uuid;
        $scope.editUserEmailObj = {};
        vm.updatedUserEmail = {};
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingUserEmails = false;


        vm.getUserEmail =  function () {
            if(vm.token) {
                $scope.loadingUserEmails = true;
                Rehive.admin.users.emails.get({id: $scope.email.id}).then(function (res) {
                    $scope.loadingUserEmails = false;
                    $scope.editUserEmailObj = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserEmail();

        $scope.editUserEmail =  function (editUserEmailObj) {
            if(vm.token) {
                $scope.loadingUserEmails = true;
                Rehive.admin.users.emails.update($scope.email.id,editUserEmailObj).then(function (res) {
                    $scope.loadingUserEmails = false;
                    toastr.success('Email successfully updated');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
