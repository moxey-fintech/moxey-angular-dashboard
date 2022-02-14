(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions')
        .controller('AddAccountDefinitionModalCtrl', AddAccountDefinitionModalCtrl);

    /** @ngInject */
    function AddAccountDefinitionModalCtrl($scope,localStorageManagement,_,errorHandler,$uibModalInstance,toastr,accountDefinitionService,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.addCount = 0;
        $scope.addingAcountDefinition = false;
        $scope.newAccountDefParams = {
            name: null,
            label: null,
            archived: false
        };

        $scope.trackAccountDefinitionNameChange = function(){
            $scope.newAccountDefParams.name = $scope.newAccountDefParams.name.replace(/ /g, '_').replace(/-/g, '_').toLowerCase();
            $scope.newAccountDefParams.label = $filter('capitalizeWord')($scope.newAccountDefParams.name.replace(/_/g, ' '));
        };

        $scope.$dismiss = function(){
            vm.addCount > 0 ? $uibModalInstance.close(true) : $uibModalInstance.close(null);
        };

        $scope.addAccountDefinition = function(addAnother){            
            if(vm.token) {
                $scope.addingAcountDefinition = true;
                accountDefinitionService.createAccountDefinition($scope.newAccountDefParams).then(function (res) {
                    $scope.addingAcountDefinition = false;
                    toastr.success('Account definition successfully added');
                    if(addAnother){
                        $scope.newAccountDefParams = {};
                        ++vm.addCount;
                    } else {
                        $uibModalInstance.close(res);
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.addingAcountDefinition = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
    }
})();