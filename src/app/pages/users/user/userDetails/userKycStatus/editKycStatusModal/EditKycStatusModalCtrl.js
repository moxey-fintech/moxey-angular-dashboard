(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditKycStatusModalCtrl', EditKycStatusModalCtrl);

    function EditKycStatusModalCtrl($scope,Rehive,$uibModalInstance,userStatus,toastr,uuid,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.userStatus = userStatus;
        $scope.uuid = uuid;
        $scope.updatingUserKycStatus = false;
        $scope.editUserKycStatus = {
            status: userStatus
        };
        $scope.kycStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('token');

        $scope.updateUserKycStatus = function(){
            if(vm.token) {
                $scope.updatingUserKycStatus = true;
                Rehive.admin.users.kyc.update($scope.uuid,{status: $scope.editUserKycStatus.status.toLowerCase()}).then(function (res) {
                    $scope.updatingUserKycStatus = false;
                    toastr.success('Successfully updated the kyc status');
                    $scope.editUserKycStatus = {};
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingUserKycStatus = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
