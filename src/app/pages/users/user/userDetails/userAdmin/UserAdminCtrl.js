(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAdminCtrl', UserAdminCtrl);

    /** @ngInject */
    function UserAdminCtrl($scope,Rehive,toastr,$stateParams,localStorageManagement,$ngConfirm,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingUserAdmin = false;
        $scope.listOfEmails = [];
        vm.emailSituation = '';
        $scope.mfaStatus = 'not';

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserAdmin = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.loadingUserAdmin = false;
                    $scope.user = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAdmin = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        $scope.getUserEmailsFromResendPasswordLink = function(){
            $scope.loadingUserAdmin = true;
            if(vm.token) {
                Rehive.admin.users.emails.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserAdmin = false;
                    if(res.results.length > 0){
                        $scope.listOfEmails = res.results;
                    } else {
                        $scope.listOfEmails = [];
                    }
                    vm.checkEmailSituation();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAdmin = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.checkEmailSituation = function () {
            if($scope.listOfEmails.length == 0){
                vm.emailSituation = 'No emails';
                $scope.openAdminEmailStatusModal('app/pages/users/user/userDetails/userAdmin/adminEmailStatusModal/adminEmailStatusModal.html','md');
            } else{
                $scope.listOfEmails.forEach(function (email) {
                    if(email.primary){
                        vm.emailSituation = 'primary email exists';
                    }
                });

                if(vm.emailSituation == 'primary email exists'){
                    vm.resendPasswordResetLink();
                } else {
                    vm.emailSituation = 'No primary email';
                    $scope.openAdminEmailStatusModal('app/pages/users/user/userDetails/userAdmin/adminEmailStatusModal/adminEmailStatusModal.html','md',$scope.listOfEmails[0]);
                }

            }
        };

        vm.resendPasswordResetLink = function () {
            Rehive.auth.password.reset({
                user: vm.uuid,
                company: vm.companyIdentifier
            }).then(function(res){
                toastr.success('Password reset email sent successfully');
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAdminEmailStatusModal = function (page, size,email) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AdminEmailStatusModalCtrl',
                scope: $scope,
                resolve: {
                    emailSituation: function () {
                        return vm.emailSituation;
                    },
                    nonPrimaryEmail: function () {
                        return email || {};
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

        $scope.openResendVerifyEmailModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserAdminModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

    }
})();
