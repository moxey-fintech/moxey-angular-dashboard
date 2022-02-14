(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAddressCtrl', UserAddressCtrl);

    /** @ngInject */
    function UserAddressCtrl($scope,Rehive,$stateParams,localStorageManagement,
                             $window,errorHandler,$uibModal,toastr,$ngConfirm,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.userAddressParams = {
            country: 'US',
            status: 'Pending'
        };
        vm.updatedUserAddress = {};
        $scope.loadingUserAddress = true;
        $scope.editUserAddress = {};
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        $scope.optionsId = '';

        $scope.closeAddressOptionsBox = function () {
            $scope.optionsId = '';
        };

        $scope.showAddressOptionsBox = function (address) {
            $scope.optionsId = address.id;
        };

        vm.getUserAddress = function(){
            if(vm.token) {
                $scope.loadingUserAddress = true;
                Rehive.admin.users.addresses.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserAddress = false;
                    $window.sessionStorage.userAddresses = JSON.stringify(res.results);
                    $scope.userAddresses = res.results;
                    $scope.userAddresses.forEach(function(address){
                        address.type = $filter('capitalizeWord')(address.type);
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAddress = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserAddress();

        $scope.verifyUserAddressConfirm = function (id,status) {
            $ngConfirm({
                title: 'Verify user address',
                content: 'Are you sure you want to verify this address?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.verifyUserAddress(id,status);
                        }
                    }
                }
            });
        };

        $scope.verifyUserAddress = function(id,status){
            if(vm.token) {
                $scope.loadingUserAddress = true;
                Rehive.admin.users.addresses.update(id,{
                    status: status
                }).then(function (res) {
                    $scope.loadingUserAddress = false;
                    $scope.optionsId = '';
                    toastr.success('Successfully verified user address');
                    vm.getUserAddress();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAddress = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openAddUserAddressModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserAddressModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(address){
                if(address){
                    $scope.optionsId = '';
                    vm.getUserAddress();
                }
            }, function(){
            });
        };

        $scope.openEditUserAddressModal = function (page, size,address) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserAddressModalCtrl',
                scope: $scope,
                resolve: {
                    address: function () {
                        return address;
                    }
                }
            });

            vm.theModal.result.then(function(address){
                if(address){
                    $scope.optionsId = '';
                    vm.getUserAddress();
                }
            }, function(){
            });
        };

        $scope.openUserAddressModal = function (page, size,address) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserAddressModalCtrl',
                scope: $scope,
                resolve: {
                    address: function () {
                        return address;
                    }
                }
            });

            vm.theModal.result.then(function(address){
                if(address){

                    $scope.optionsId = '';
                    vm.getUserAddress();
                }
            }, function(){
            });
        };


    }
})();
