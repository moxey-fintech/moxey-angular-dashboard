(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AdminEmailStatusModalCtrl', AdminEmailStatusModalCtrl);

    function AdminEmailStatusModalCtrl($scope,$uibModalInstance,nonPrimaryEmail,emailSituation,$stateParams,
                                       Rehive,$rootScope,localStorageManagement,errorHandler,$uibModal,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.emailSituation = emailSituation;
        $scope.nonPrimaryEmail = nonPrimaryEmail;
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

        // setting email to primary

        $scope.openEditUserEmailModalFromResendPasswordLink = function (page,size,email) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserEmailModalCtrl',
                scope: $scope,
                resolve: {
                    email: function () {
                        return email;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $window.location.reload();
                    $uibModalInstance.close();
                }
            }, function(){
            });
        };

    }
})();
