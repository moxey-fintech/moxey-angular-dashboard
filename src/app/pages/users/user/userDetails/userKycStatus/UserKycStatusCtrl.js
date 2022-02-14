(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserKycStatusCtrl', UserKycStatusCtrl);

    /** @ngInject */
    function UserKycStatusCtrl($scope,Rehive,$stateParams,localStorageManagement,$uibModal,errorHandler,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserKycStatus = true;

        vm.getUserStatus = function(){
            if(vm.token) {
                $scope.loadingUserKycStatus = true;
                Rehive.admin.users.kyc.get(vm.uuid).then(function (res) {
                    $scope.loadingUserKycStatus = false;
                    $scope.userStatus = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserKycStatus = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserStatus();

        vm.getUser = function(){
            $scope.loadingUserKycStatus = true;
            if(vm.token) {
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.user = res;
                    console.log("KYC status controller")
                    vm.getUserStatus();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserKycStatus = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openEditUserKycStatusModal = function (page, size, userStatus) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditKycStatusModalCtrl',
                scope: $scope,
                resolve: {
                    userStatus: function () {
                        return $filter('capitalizeWord')(userStatus.status);
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUser();
                }
            }, function(){
            });
        };

    }
})();
