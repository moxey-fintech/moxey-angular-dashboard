(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions')
        .controller('AddAccountDefinitionGroupModalCtrl', AddAccountDefinitionGroupModalCtrl);

    /** @ngInject */
    function AddAccountDefinitionGroupModalCtrl($scope,localStorageManagement,accDefName,currenciesOptions,groupOptions,existingGroups,_,errorHandler,Rehive,$uibModalInstance,toastr,accountDefinitionService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.currenciesOptions = currenciesOptions;
        $scope.groupOptions = groupOptions;
        $scope.existingGroups = existingGroups;
        $scope.addingAccountDefinitionGroup = false;
        $scope.accDefName = accDefName;
        $scope.newAccountDefGroups = [
            {
                group: {},
                currencies: [],
                default: true,
                primary: false
            }
        ];
        
        $scope.removeExistingGroups = function(){
            $scope.existingGroups.forEach(function(groupName){
                $scope.groupOptions = $scope.groupOptions.filter(function(group){
                    return group.name !== groupName;
                });
            });
        };
        $scope.removeExistingGroups();

        $scope.addDefinitionGroup = function(){
            var newGroupObj = {
                group: {},
                currencies: [],
                default: true,
                primary: false
            };
            $scope.newAccountDefGroups.push(newGroupObj);
        };
        
        $scope.removeDefinitionGroup = function($index){
            $scope.newAccountDefGroups.splice($index, 1);
        };

        $scope.saveAccountDefinitionGroups = function(){
            var groupsOk = true;
            if($scope.newAccountDefGroups.length > 0){
                $scope.newAccountDefGroups.forEach(function(groupObj){
                    if(groupObj.group === null || groupObj.group.name === undefined){
                        groupsOk = false;
                    }
                });
            }

            if(!groupsOk){
                toastr.error("Please select the group correctly for all group objects");
                return false;
            }

            if(vm.token){
                $scope.addingAccountDefinitionGroup = true;
                accountDefinitionService.handleMultipleGroupDefinitionCreate($scope.accDefName, $scope.newAccountDefGroups).then(function (res) {
                    $scope.addingAccountDefinitionGroup = false;
                    toastr.success('Account definition groups successfully added');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.addingAccountDefinitionGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };        
    }
})();