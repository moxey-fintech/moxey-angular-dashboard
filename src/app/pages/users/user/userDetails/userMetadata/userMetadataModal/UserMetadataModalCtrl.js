(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserMetadataModalCtrl', UserMetadataModalCtrl);

    function UserMetadataModalCtrl($scope,Rehive,$uibModalInstance,user,toastr,
                                   localStorageManagement,errorHandler) {

        var vm = this;
        vm.user = user;
        $scope.formatted = {};
        $scope.formatted.metadata = JSON.stringify(vm.user.metadata);
        if($scope.formatted.metadata == '{}'){
            $scope.formatted.metadata = '';
        }
        $scope.updatingUserMetadata = false;
        vm.token = localStorageManagement.getValue('TOKEN');

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.updateUserMetadata = function(){
            if(vm.token) {
                $scope.updatingUserMetadata = true;

                var metaData;
                if($scope.formatted.metadata){
                    if(vm.isJson($scope.formatted.metadata)){
                        metaData =  $scope.formatted.metadata;
                    } else {
                        toastr.error('Incorrect metadata format');
                        $scope.updatingUserMetadata = false;
                        return false;
                    }
                } else {
                    metaData = '{}';
                }

                var formData = new FormData();

                formData.append('metadata', metaData);

                Rehive.admin.users.update(vm.user.id, formData).then(function (res) {
                    toastr.success('Metadata updated successfully');
                    $scope.formatted = {};
                    $scope.updatingUserMetadata = false;
                    $uibModalInstance.close(true);
                }, function (error) {
                    $scope.updatingUserMetadata = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
