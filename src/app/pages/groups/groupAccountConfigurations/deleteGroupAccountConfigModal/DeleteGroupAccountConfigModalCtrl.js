(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupAccountConfigurations')
        .controller('DeleteGroupAccountConfigModalCtrl', DeleteGroupAccountConfigModalCtrl);

    function DeleteGroupAccountConfigModalCtrl($scope,$uibModalInstance,$ngConfirm,toastr,$stateParams,
                                               Rehive,accountConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        $scope.accountConfig = accountConfig;
        $scope.deletingAccountConfig = false;

        $scope.archiveAccountConfig = function (deleteAccountConfig) {
            $scope.deletingAccountConfig = true;
            Rehive.admin.groups.accountConfigurations.update(vm.groupName,$scope.accountConfig.name,{archived : true}).then(function (res) {
                if(deleteAccountConfig){
                    $scope.deleteAccountConfig();
                    $scope.$apply();
                } else {
                    $scope.deletingAccountConfig = false;
                    toastr.success('Account configuration successfully archived');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }
            }, function (error) {
                $scope.deletingAccountConfig = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteAccountConfigConfirm = function () {
            $ngConfirm({
                title: 'Delete account configuration',
                contentUrl: 'app/pages/groups/groupAccountConfigurations/deleteGroupAccountConfigModal/deleteGroupAccountConfigPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn btn-danger delete-button',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            if(!$scope.accountConfig.archived){
                                $scope.archiveAccountConfig('deleteAccountConfig');
                            } else {
                                scope.deleteAccountConfig();
                            }
                        }
                    }
                }
            });
        };

        $scope.deleteAccountConfig = function () {
            $scope.deletingAccountConfig = true;
            Rehive.admin.groups.accountConfigurations.delete(vm.groupName,$scope.accountConfig.name).then(function (res) {
                $scope.deletingAccountConfig = false;
                toastr.success('Account configuration successfully deleted');
                $uibModalInstance.close(res);
                $scope.$apply();
            }, function (error) {
                $scope.deletingAccountConfig = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
