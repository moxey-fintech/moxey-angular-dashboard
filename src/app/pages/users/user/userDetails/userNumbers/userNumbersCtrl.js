(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserNumbersCtrl', UserNumbersCtrl);

    /** @ngInject */
    function UserNumbersCtrl($scope,$stateParams,$window,$ngConfirm,
                             Rehive,localStorageManagement,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.optionsId = '';

        $scope.closeMobileOptionsBox = function () {
            $scope.optionsId = '';
        };

        $scope.showMobileOptionsBox = function (mobile) {
            $scope.optionsId = mobile.id;
        };

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserNumbers = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.user = res;
                    vm.getUserNumbers();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserNumbers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        vm.getUserNumbers = function(){
            $scope.loadingUserNumbers = true;
            if(vm.token) {
                Rehive.admin.users.mobiles.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserNumbers = false;
                    $scope.mobilesList = res.results;
                    $window.sessionStorage.userNumbers = JSON.stringify(res.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserNumbers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.updateUserNumber = function (number) {
            $scope.loadingUserNumbers = true;
            Rehive.admin.users.mobiles.update(number.id,{primary: true}).then(function (res) {
                $scope.optionsId = '';
                toastr.success('Primary number successfully changed');
                vm.getUserNumbers();
                $scope.$apply();
            }, function (error) {
                $scope.loadingUserNumbers = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteUserNumberConfirm = function (number) {
            $ngConfirm({
                title: 'Delete number',
                content: "Are you sure you want to delete <b>" + number.number + "</b> ?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteUserNumber(number);
                        }
                    }
                }
            });
        };

        $scope.deleteUserNumber = function (number) {
            $scope.loadingUserNumbers = true;
            Rehive.admin.users.mobiles.delete(number.id).then(function (res) {
                toastr.success('Number successfully deleted');
                vm.getUserNumbers();
                $scope.$apply();
            }, function (error) {
                $scope.loadingUserNumbers = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAddUserNumberModal = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserNumberModalCtrl',
                scope: $scope,
                resolve: {
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(number){
                if(number){
                    $scope.optionsId = '';
                    vm.getUserNumbers();
                }
            }, function(){
            });
        };

        $scope.openEditUserNumberModal = function (page,size,number) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserNumberModalCtrl',
                scope: $scope,
                resolve: {
                    number: function () {
                        return number;
                    },
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(number){
                if(number){
                    $scope.optionsId = '';
                    vm.getUserNumbers();
                }
            }, function(){
            });
        };

        $scope.openVerifyUserMobileModal = function (page,size,number) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'VerifyUserNumberModalCtrl',
                scope: $scope,
                resolve: {
                    number: function () {
                        return number;
                    },
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(number){
                if(number){
                    $scope.optionsId = '';
                    vm.getUserNumbers();
                }
            }, function(){
            });
        };

    }
})();
