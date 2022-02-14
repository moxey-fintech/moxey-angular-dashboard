(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('SubtypeModalCtrl', SubtypeModalCtrl);

    function SubtypeModalCtrl($scope,Rehive,$uibModalInstance,subtype,$filter,
                              $ngConfirm,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        $scope.subtype = subtype;
        $scope.subtype.label = $scope.subtype.label ? $scope.subtype.label : $filter('capitalizeWord')($scope.subtype.name).replace('_', ' '); 
        vm.token = localStorageManagement.getValue('token');
        $scope.deletingSubtype = false;

        $scope.archiveSubtype = function (deleteSubtype) {
            $scope.deletingSubtype = true;
            Rehive.admin.subtypes.update($scope.subtype.id, {archived: true}).then(function (res) {
                if(deleteSubtype){
                    $scope.deleteSubtype();
                    $scope.$apply();
                } else {
                    $scope.deletingSubtype = false;
                    toastr.success('You have successfully archived the subtype');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }


            }, function (error) {
                $scope.deletingSubtype = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteSubtypePrompt = function () {
            $ngConfirm({
                title: 'Delete subtype',
                contentUrl: 'app/pages/transactions/subtypes/subtypeModal/deleteSubtypePrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger delete-button',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            if(!$scope.subtype.archived){
                                $scope.archiveSubtype('deleteSubtype');
                            } else {
                                $scope.deleteSubtype();
                            }
                        }
                    }
                }
            });
        };

        $scope.deleteSubtype = function () {
            $scope.deletingSubtype = true;
            Rehive.admin.subtypes.delete($scope.subtype.id).then(function (res) {
                $scope.deletingSubtype = false;
                toastr.success('You have successfully deleted the subtype');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.deletingSubtype = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
