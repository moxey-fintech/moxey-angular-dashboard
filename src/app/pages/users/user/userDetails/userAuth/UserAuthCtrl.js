(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAuthCtrl', UserAuthCtrl);

    /** @ngInject */
    function UserAuthCtrl($scope,Rehive,toastr,$stateParams,localStorageManagement,$ngConfirm,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingUserAuth = false;
        $scope.mfaStatus = 'not';

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserAuth = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.loadingUserAuth = false;
                    $scope.user = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        $scope.checkUserMFAStatus = function () {
            if(vm.token) {
                Rehive.admin.users.mfa.get(vm.uuid).then(function (res) {
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                $scope.mfaStatus = key;
                                $scope.$apply();
                            }
                        }
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.checkUserMFAStatus();

        $scope.removeMFAStatusConfirm = function () {
            $ngConfirm({
                title: 'Remove multi-factor authentication',
                content: "You are removing multi-factor authentication from this user's account, are you sure you want to proceed?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn pull-left '
                    },
                    ok: {
                        text: "Remove",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            vm.removeMFAStatus();
                        }
                    }
                }
            });
        };

        vm.removeMFAStatus = function () {
            if(vm.token) {
                $scope.loadingUserAuth = true;
                if($scope.mfaStatus == "sms"){
                    Rehive.admin.users.mfa.sms.delete(vm.uuid).then(function (res) {
                        toastr.success('SMS multi-factor authentication removed successfully');
                        $scope.mfaStatus = "not";
                        $scope.loadingUserAuth = false;
                        $scope.$apply();
                    }, function (error) {
                        $scope.loadingUserAuth = false;
                        if(error.status === 403){
                            toastr.error("You do not have permission to perform this action.");
                        }
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                } else {
                    Rehive.admin.users.mfa.token.delete(vm.uuid).then(function (res) {
                        toastr.success('Token multi-factor authentication removed successfully');
                        $scope.mfaStatus = "not";
                        $scope.loadingUserAuth = false;
                        $scope.$apply();
                    }, function (error) {
                        $scope.loadingUserAuth = false;
                        if(error.status === 403){
                            toastr.error("You do not have permission to perform this action.");
                        }
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
            }
        };

    }
})();
