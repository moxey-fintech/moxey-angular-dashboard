(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserEmailsCtrl', UserEmailsCtrl);

    /** @ngInject */
    function UserEmailsCtrl($rootScope,$scope,$stateParams,$window,$ngConfirm,
                            Rehive,localStorageManagement,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.emailsList = [];
        vm.uuid = $stateParams.uuid;
        $scope.optionsId = '';

        $scope.closeEmailOptionsBox = function () {
            $scope.optionsId = '';
        };

        $scope.showEmailOptionsBox = function (email) {
            $scope.optionsId = email.id;
        };

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserEmails = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.user = res;
                    vm.getUserEmails();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        vm.getUserEmails = function(){
            $scope.loadingUserEmails = true;
            if(vm.token) {
                Rehive.admin.users.emails.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserEmails = false;
                    $scope.emailsList = res.results;
                    $window.sessionStorage.userEmails = JSON.stringify(res.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.updateUserEmail = function (email) {
            $scope.loadingUserEmails = true;
            Rehive.admin.users.emails.update(email.id,{primary: true}).then(function (res) {
                $scope.optionsId = '';
                toastr.success('Primary email successfully changed');
                vm.getUserEmails();
                $scope.$apply();
            }, function (error) {
                $scope.loadingUserEmails = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteUserEmailConfirm = function (email) {
            $ngConfirm({
                title: 'Delete email',
                content: "Are you sure you want to delete <b>" + email.email + "</b> ?",
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
                            $scope.deleteUserEmail(email);
                        }
                    }
                }
            });
        };

        $scope.deleteUserEmail = function (email) {
            $scope.loadingUserEmails = true;
            Rehive.admin.users.emails.delete(email.id).then(function (res) {
                toastr.success('Email successfully deleted');
                vm.getUserEmails();
                $scope.$apply();
            }, function (error) {
                $scope.loadingUserEmails = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAddUserEmailModal = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserEmailModalCtrl',
                scope: $scope,
                resolve: {
                    emailsCount: function () {
                        return $scope.emailsList.length;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $scope.optionsId = '';
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

        $rootScope.$on('firstEmailAdded',function (event,firstEmailAdded) {
            if(firstEmailAdded){
                $scope.optionsId = '';
                vm.getUserEmails();
            }
        });

        $scope.openEditUserEmailModal = function (page,size,email) {
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
                    $scope.optionsId = '';
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

        $scope.openUserVerifyEmailModal = function (page,size,email) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserVerifyEmailModalCtrl',
                scope: $scope,
                resolve: {
                    email: function () {
                        return email;
                    },
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $scope.optionsId = '';
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

    }
})();
