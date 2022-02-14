(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierRequirements')
        .controller('GroupTierRequirementsCtrl', GroupTierRequirementsCtrl);

    /** @ngInject */
    function GroupTierRequirementsCtrl($scope,$stateParams,localStorageManagement,
                                       Rehive,errorHandler,_,toastr,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.activeTabIndex = 0;
        $scope.loadingTierRequirements = true;
        $scope.tierRequirementFields = {};
        vm.updatedTierRequirements = {};

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierRequirements = true;
                Rehive.admin.groups.tiers.get(vm.groupName).then(function (res) {
                    $scope.loadingTierRequirements = false;
                    vm.unsortedTierLevelsArray = _.map(res ,'level');
                    vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                        return a - b;
                    });
                    $scope.tierLevelsForRequirements = vm.sortedTierLevelsArray;
                    $scope.allTiers = res.sort(function(a, b) {
                        return parseFloat(a.level) - parseFloat(b.level);
                    });
                    if(tierLevel){
                        $scope.selectTier(tierLevel);
                    } else {
                        $timeout(function(){
                            $scope.activeTabIndex = 0;
                        });
                        $scope.selectTier($scope.tierLevelsForRequirements[0]);
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierRequirements = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getAllTiers();

        vm.findIndexOfTier = function(element){
            return this == element.level;
        };

        $scope.selectTier = function(tierLevel){
            var index = $scope.allTiers.findIndex(vm.findIndexOfTier,tierLevel);
            $scope.selectedTier = $scope.allTiers[index];
            if($scope.selectedTier){
                $scope.getTierRequirements();
            }
        };

        $scope.getTierRequirements = function(){
            if(vm.token) {
                $scope.loadingTierRequirements = true;
                Rehive.admin.groups.tiers.requirements.get(vm.groupName,$scope.selectedTier.id).then(function (res) {
                    $scope.loadingTierRequirements = false;
                    vm.checkRequirementsInTier(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierRequirements = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.checkRequirementsInTier = function(requirementsArray){
            $scope.tierRequirementFields = {};
            requirementsArray.forEach(function(element){
                // var fieldString = element.requirement.toLowerCase().trim();
                // var fieldName = fieldString.replace(/ /g,'_');
                // $scope.tierRequirementFields[fieldName] = true;
                $scope.tierRequirementFields[element.requirement] = true;
            });
        };

        $scope.toggleTierRequirements = function(fieldName){
            if(vm.updatedTierRequirements.hasOwnProperty(fieldName)){
                delete vm.updatedTierRequirements[fieldName];
            } else {
                vm.updatedTierRequirements[fieldName] = $scope.tierRequirementFields[fieldName];
            }
        };

        $scope.updateTierRequirements = function () {
            $scope.loadingTierRequirements = true;
            var fieldsArray = Object.keys(vm.updatedTierRequirements);
            for(var i = 0; i < fieldsArray.length; i++){
                if(vm.updatedTierRequirements[fieldsArray[i]]){
                    if(i == (fieldsArray.length - 1)){
                        $scope.saveTierRequirements(fieldsArray[i],'last');
                    } else {
                        $scope.saveTierRequirements(fieldsArray[i]);
                    }
                } else {
                    if(i == (fieldsArray.length - 1)){
                        $scope.deleteTierRequirements(fieldsArray[i],'last');
                    } else {
                        $scope.deleteTierRequirements(fieldsArray[i]);
                    }
                }
            }
            $scope.loadingTierRequirements = false;
        };

        $scope.saveTierRequirements = function(fieldName,last){
            if(vm.token) {
                Rehive.admin.groups.tiers.requirements.create(vm.groupName,$scope.selectedTier.id, {
                    "requirement": fieldName
                }).then(function (res) {
                    if(last){
                        vm.updatedTierRequirements = {};
                        $scope.getAllTiers($scope.selectedTier.level);
                        toastr.success('Tier requirements updated successfully');
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.findRequirementId =  function(fieldName){
            var requirementId = null;
            // var capitalizedFieldName = fieldName.replace(/_/g,' ').replace(/\b\w/g, function(l){ return l.toUpperCase() });
            $scope.selectedTier.requirements.forEach(function(element){
                // if(element.requirement == capitalizedFieldName){
                if(element.requirement == fieldName){
                    requirementId = element.id;
                }
            });

            return requirementId;
        };

        $scope.deleteTierRequirements = function(fieldName,last){
            var requirementId = vm.findRequirementId(fieldName);
            if(vm.token) {
                Rehive.admin.groups.tiers.requirements.delete(vm.groupName,$scope.selectedTier.id,requirementId).then(function (res) {
                    if(last){
                        vm.updatedTierRequirements = {};
                        $scope.getAllTiers($scope.selectedTier.level);
                        toastr.success('Tier requirements updated successfully');
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
