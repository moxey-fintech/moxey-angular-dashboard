(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAdminModalCtrl', UserAdminModalCtrl);

    function UserAdminModalCtrl($scope,Rehive,$uibModalInstance,toastr,$stateParams,
                                $rootScope,localStorageManagement,errorHandler,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserEmailsList = true;
        $scope.selectedEmail = {};
        $scope.userEmailsList = [];
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');

        vm.getUserEmails = function(){
            $scope.loadingUserEmailsList = true;
            if(vm.token) {
                Rehive.admin.users.emails.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserEmailsList = false;
                    if(res.results.length > 0){
                        $scope.userEmailsList = res.results;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserEmailsList = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserEmails();

        $scope.resendEmailVerificationLink = function () {
            $scope.loadingUserEmailsList = true;
            Rehive.auth.email.resendEmailVerification({
                email: $scope.selectedEmail.email,
                company: vm.companyIdentifier
            }).then(function(res){
                $scope.loadingUserEmailsList = false;
                toastr.success('Email verification resent successfully');
                $uibModalInstance.close();
                $scope.$apply();
            },function(error){
                $scope.loadingUserEmailsList = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAddEmailModal = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserEmailModalCtrl',
                scope: $scope,
                resolve: {
                    emailsCount: function () {
                        return $scope.userEmailsList.length;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $rootScope.$broadcast('firstEmailAdded','first email added');
                    $uibModalInstance.close();
                }
            }, function(){
            });
        };

    }
})();
