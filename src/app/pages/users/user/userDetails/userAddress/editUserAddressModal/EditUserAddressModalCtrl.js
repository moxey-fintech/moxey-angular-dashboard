(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserAddressModalCtrl', EditUserAddressModalCtrl);

    function EditUserAddressModalCtrl($scope,Rehive,$uibModalInstance,address,toastr,$stateParams,$filter,
                                      localStorageManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userAddress = address;
        vm.updatedUserAddress = {};
        $scope.editUserAddress = {};
        $scope.editingUserAddress = true;
        $scope.kycStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        $scope.addressTypeOptions = ["Billing", "Business", "Contact", "Permanent", "Shipping"];
        vm.token = localStorageManagement.getValue('token');

        vm.getAddress = function () {
            $scope.editingUserAddress = true;
            Rehive.admin.users.addresses.get({id: $scope.userAddress.id}).then(function (res) {
                $scope.editingUserAddress = false;
                $scope.editUserAddress = res;
                $scope.editUserAddress.status = $filter('capitalizeWord')(res.status);
                $scope.editUserAddress.type = $filter('capitalizeWord')(res.type);
                $scope.$apply();
            }, function (error) {
                $scope.editingUserAddress = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getAddress();

        $scope.userAddressChanged =  function (field) {
            vm.updatedUserAddress[field] = $scope.editUserAddress[field];

            if(field === 'type' || field === 'status'){
                vm.updatedUserAddress[field] = vm.updatedUserAddress[field].toLowerCase();
            }
        };

        $scope.updateUserAddress = function(){
            $scope.editingUserAddress = true;
            if(vm.token) {
                Rehive.admin.users.addresses.update($scope.editUserAddress.id,vm.updatedUserAddress).then(function (res) {
                    $scope.editingUserAddress = false;
                    vm.updatedUserAddress = {};
                    $scope.editUserAddress = {};
                    toastr.success('Successfully updated user address');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingUserAddress = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
