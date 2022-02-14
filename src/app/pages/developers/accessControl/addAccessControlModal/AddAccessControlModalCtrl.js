(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.accessControl')
        .controller('AddAccessControlModalCtrl', AddAccessControlModalCtrl);

    /** @ngInject */
    function AddAccessControlModalCtrl($scope,$uibModalInstance,toastr,
                                       Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.addingAccessControlRules = false;
        $scope.accessControlParams = {
            type: 'ip',
            action: 'allow',
            applyRuleTo: 'everyone'
        };

        $scope.addAccessControlRules = function (accessControlParams) {
            $scope.addingAccessControlRules = true;

            var newAccessControlRule = {
                type: accessControlParams.type,
                action: accessControlParams.action,
                value: accessControlParams.value,
                label: accessControlParams.label
            };

            newAccessControlRule[accessControlParams.applyRuleTo] = accessControlParams[accessControlParams.applyRuleTo];

            Rehive.admin.accessControlRules.create(newAccessControlRule).then(function (res) {
                $scope.addingAccessControlRules = false;
                toastr.success('You have successfully added the access control rule');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.addingAccessControlRules = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
