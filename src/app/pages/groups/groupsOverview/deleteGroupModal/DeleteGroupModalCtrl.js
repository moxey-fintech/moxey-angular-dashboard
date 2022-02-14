(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.overview')
        .controller('DeleteGroupModalCtrl', DeleteGroupModalCtrl);


    function DeleteGroupModalCtrl($scope,Rehive,group,$uibModalInstance,$filter,toastr,
                                  $ngConfirm,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.group = group;
        $scope.deletingGroups = false;
        $scope.groupsParams = {};

        $scope.archiveGroup = function(deleteGroup){
            $scope.deletingGroups = true;
            Rehive.admin.groups.update($scope.group.name,{ archived : true}).then(function (res) {
                if(deleteGroup){
                    $scope.deleteCompanyGroup();
                    $scope.$apply();
                } else {
                    $scope.deletingGroups = false;
                    toastr.success('Group successfully archived');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }
            }, function (error) {
                $scope.deletingGroups = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteCompanyGroupPrompt = function(group) {
            $ngConfirm({
                title: 'Delete group',
                contentUrl: 'app/pages/groups/groupsOverview/deleteGroupModal/deleteGroupPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            if(!$scope.group.archived){
                                $scope.archiveGroup('deleteGroup');
                            } else {
                                scope.deleteCompanyGroup();
                            }
                        }
                    }
                }
            });
        };

        $scope.deleteCompanyGroup = function () {
            if(vm.token) {
                $scope.deletingGroups = true;
                Rehive.admin.groups.delete($scope.group.name).then(function (res) {
                    toastr.success('Group successfully deleted');
                    $scope.deletingGroups = false;
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.deletingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
