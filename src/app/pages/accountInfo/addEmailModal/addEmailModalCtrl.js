(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountInfo')
        .controller('AddEmailModalCtrl', AddEmailModalCtrl);

    /** @ngInject */
    function AddEmailModalCtrl($scope,$uibModalInstance,toastr,Rehive,
                                localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingAdminEmails = false;
        $scope.newEmail = {
            email: '',
            primary: false
        };

        $scope.createEmail = function (newEmail) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.create(newEmail).then(function (res)
                {
                    $scope.loadingAdminEmails = false;
                    toastr.success('Email added successfully');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
    }
})();