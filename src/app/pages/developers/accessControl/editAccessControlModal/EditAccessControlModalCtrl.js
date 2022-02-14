(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.accessControl')
        .controller('EditAccessControlModalCtrl', EditAccessControlModalCtrl);

    /** @ngInject */
    function EditAccessControlModalCtrl($scope,$http,$uibModalInstance,toastr,Rehive,environmentConfig,
                                        rule,localStorageManagement,errorHandler,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.rule = rule;
        $scope.editingAccessControlRules = false;
        $scope.editAccessControlParams = {};
        vm.updatedAccessControlRule = {};

        $scope.getAccessControlRule = function () {
            $scope.editingAccessControlRules = true;
            Rehive.admin.accessControlRules.get({id: rule.id}).then(function (res) {
                $scope.editingAccessControlRules = false;
                $scope.editAccessControlParams = res;
                if($scope.editAccessControlParams.user && $scope.editAccessControlParams.user.id){
                    $scope.editAccessControlParams.applyRuleTo = 'user';
                    $scope.editAccessControlParams.user = $scope.editAccessControlParams.user.email || $scope.editAccessControlParams.user.mobile || $scope.editAccessControlParams.user.id;
                } else if($scope.editAccessControlParams.group && $scope.editAccessControlParams.group.name){
                    $scope.editAccessControlParams.applyRuleTo = 'group';
                    $scope.editAccessControlParams.group = $scope.editAccessControlParams.group.name;
                } else {
                    $scope.editAccessControlParams.applyRuleTo = 'everyone';
                }
                $scope.$apply();
            }, function (error) {
                $scope.editingAccessControlRules = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        $scope.getAccessControlRule();

        $scope.accessControlRuleChanged = function(field){
            vm.updatedAccessControlRule[field] = $scope.editAccessControlParams[field];
        };

        $scope.updateAccessControlRule = function () {
            $scope.editingAccessControlRules = true;

            var updatedRuleObj = {
                action: vm.updatedAccessControlRule.action ? vm.updatedAccessControlRule.action : null,
                value: vm.updatedAccessControlRule.value ? vm.updatedAccessControlRule.value : null,
                label: vm.updatedAccessControlRule.label ? vm.updatedAccessControlRule.label : null
            };

            if($scope.editAccessControlParams.applyRuleTo === 'user'){
                updatedRuleObj[$scope.editAccessControlParams.applyRuleTo] = vm.updatedAccessControlRule[$scope.editAccessControlParams.applyRuleTo];
                updatedRuleObj.group = ' ';
            } else if($scope.editAccessControlParams.applyRuleTo === 'group') {
                updatedRuleObj[$scope.editAccessControlParams.applyRuleTo] = vm.updatedAccessControlRule[$scope.editAccessControlParams.applyRuleTo];
                updatedRuleObj.user = ' ';
            } else {
                updatedRuleObj.group = ' ';
                updatedRuleObj.user = ' ';
            }

            Rehive.admin.accessControlRules.update(rule.id,serializeFiltersService.objectFilters(updatedRuleObj)).then(function (res) {
                $scope.editingAccessControlRules = false;
                toastr.success('You have successfully updated the access control rule');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.editingAccessControlRules = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
