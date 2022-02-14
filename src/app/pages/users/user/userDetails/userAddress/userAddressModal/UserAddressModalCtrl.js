(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAddressModalCtrl', UserAddressModalCtrl);

    function UserAddressModalCtrl($scope,Rehive,$uibModalInstance,address,toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.userAddress = address;
        $scope.deletingUserAddress = false;
        vm.token = localStorageManagement.getValue('token');

        $scope.deleteUserAddress = function () {
            $scope.deletingUserAddress = true;
            Rehive.admin.users.addresses.delete($scope.userAddress.id).then(function (res) {
                $scope.deletingUserAddress = false;
                toastr.success('Address successfully deleted');
                $uibModalInstance.close($scope.userAddress);
                $scope.$apply();
            }, function (error) {
                $scope.deletingUserAddress = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
