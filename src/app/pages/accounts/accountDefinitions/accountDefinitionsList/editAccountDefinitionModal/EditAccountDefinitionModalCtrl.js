(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions')
        .controller('EditAccountDefinitionModalCtrl', EditAccountDefinitionModalCtrl);

    /** @ngInject */
    function EditAccountDefinitionModalCtrl($scope,localStorageManagement,_,errorHandler,$uibModalInstance,toastr,accountDefinitionService,$filter, accDefinitionObj) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.addCount = 0;
        $scope.editingAccountDefinition = false;
        $scope.editAccountDefParams = accDefinitionObj;
        console.log($scope.editAccountDefParams);
        vm.accDefName = JSON.parse(JSON.stringify($scope.editAccountDefParams.name));

        $scope.trackAccountDefinitionNameChange = function(){
            $scope.editAccountDefParams.name = $scope.editAccountDefParams.name.replace(/ /g, '_').replace(/-/g, '_').toLowerCase();
        };

        $scope.$dismiss = function(){
            vm.addCount > 0 ? $uibModalInstance.close(true) : $uibModalInstance.close(null);
        };

        $scope.editAccountDefinition = function(){   
            if(!$scope.editAccountDefParams.label || $scope.editAccountDefParams.label == ''){
                $scope.editAccountDefParams.label = $filter('capitalizeWord')($scope.editAccountDefParams.name.replace(/_/g, ' '));
            }         
            if(vm.token) {
                $scope.editingAccountDefinition = true;
                accountDefinitionService.updateAccountDefinition(vm.accDefName, $scope.editAccountDefParams, false, false).then(function (res) {
                    $scope.editingAccountDefinition = false;
                    $scope.editAccountDefParams = {};
                    toastr.success('Account definition successfully updated');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingAccountDefinition = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
    }
})();