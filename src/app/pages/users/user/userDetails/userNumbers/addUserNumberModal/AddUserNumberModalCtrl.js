(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserNumberModalCtrl', AddUserNumberModalCtrl);

    function AddUserNumberModalCtrl($scope,$stateParams,Rehive,$uibModalInstance,user,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        $scope.user = user;
        vm.uuid = $stateParams.uuid;
        $scope.newUserNumber = {primary: false, verified: false};
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingUserNumbers = false;


        $scope.createUserNumber = function (newUserNumber) {
            $scope.loadingUserNumbers = true;
            newUserNumber.user = vm.uuid;
            Rehive.admin.users.mobiles.create(newUserNumber).then(function (res) {
                $scope.loadingUserNumbers = true;
                $scope.newUserNumber = {primary: false, verified: false};
                toastr.success('Number successfully created');
                $uibModalInstance.close(res);
                $scope.$apply();
            }, function (error) {
                $scope.newUserNumber = {primary: false, verified: false};
                $scope.loadingUserNumbers = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
