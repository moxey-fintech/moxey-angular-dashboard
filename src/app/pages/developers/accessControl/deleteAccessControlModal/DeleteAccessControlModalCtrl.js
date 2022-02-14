(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.accessControl')
        .controller('DeleteAccessControlModalCtrl', DeleteAccessControlModalCtrl);

    function DeleteAccessControlModalCtrl($scope,Rehive,$uibModalInstance,rule,
                                          toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.rule = rule;
        $scope.deletingAccessControlRule = false;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.deleteAccessControlRule = function () {
            $scope.deletingAccessControlRule = true;
            Rehive.admin.accessControlRules.delete(rule.id).then(function (res) {
                $scope.deletingAccessControlRule = false;
                toastr.success('You have successfully deleted the access control rule');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.deletingAccessControlRule = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
