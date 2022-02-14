(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('AddDefaultSubtypesModalCtrl', AddDefaultSubtypesModalCtrl);

    function AddDefaultSubtypesModalCtrl($scope,Rehive,$uibModalInstance,toastr,localStorageManagement,errorHandler,defaultSubtypes) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.addingSubtype = false;
        $scope.defaultSubtypes = defaultSubtypes;
        $scope.subtypeSelectedCount = 0;

        $scope.updateSubtypeSelectedCount = function(selected){
            $scope.subtypeSelectedCount += selected ? 1 : -1;
        };

        $scope.toggleAllSubtypeSelection = function(selectionAll){
            $scope.defaultSubtypes.forEach(function(subtype){
                if(subtype.selected !== selectionAll){
                    subtype.selected = selectionAll;
                    $scope.updateSubtypeSelectedCount(selectionAll);
                }
            });
        };

        $scope.addSelectedSubtypes = function () {
            $scope.addingSubtype = true;
            $scope.defaultSubtypes.forEach(function(subtype, idx, arr){
                if(subtype.selected){
                    --$scope.subtypeSelectedCount;
                    $scope.subtypeSelectedCount <= 0 ? $scope.addSubtype(subtype, 'last') : $scope.addSubtype(subtype, null);
                }
            });
        };

        $scope.addSubtype = function(subtype, last){
            if(vm.token){                
                Rehive.admin.subtypes.create(subtype).then(function (res) {
                    if(last){
                        $scope.addingSubtype = false;
                        toastr.success('Selected default subtypes added successfully');
                        $uibModalInstance.close(true);
                    }                    
                    $scope.$apply();
                }, function (error) {
                    $scope.addingSubtype = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
    }
})();
