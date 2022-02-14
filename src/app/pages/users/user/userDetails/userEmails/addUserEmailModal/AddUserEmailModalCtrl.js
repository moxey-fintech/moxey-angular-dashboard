(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserEmailModalCtrl', AddUserEmailModalCtrl);

    function AddUserEmailModalCtrl($scope,$stateParams,$uibModalInstance,emailsCount,
                                   Rehive,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        vm.emailsCount = emailsCount;
        $scope.newUserEmail = {primary: false, verified: false};
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingUserEmails = false;

        if(vm.emailsCount === 0){
            $scope.newUserEmail.primary = true;
        }

        $scope.changingPrimaryStatus = function () {
            if(vm.emailsCount === 0){
                $scope.newUserEmail.primary = true;
                toastr.info('Initial email must be primary.');
            }
        };

        $scope.createUserEmail = function (newUserEmail) {
            $scope.loadingUserEmails = true;
            newUserEmail.user = vm.uuid;
            Rehive.admin.users.emails.create(newUserEmail).then(function (res) {
                $scope.loadingUserEmails = true;
                $scope.newUserEmail = {primary: false, verified: false};
                toastr.success('Email successfully created');
                $uibModalInstance.close(res);
                $scope.$apply();
            }, function (error) {
                $scope.newUserEmail = {primary: false, verified: false};
                $scope.loadingUserEmails = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
