(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserProfilePictureModalCtrl', UserProfilePictureModalCtrl);

    function UserProfilePictureModalCtrl($scope,Rehive,$uibModalInstance,user,toastr,$stateParams,
                                         $timeout,localStorageManagement,errorHandler) {

        var vm = this;
        $scope.user = user;
        $scope.profilePictureFile.file = $scope.user.profile;
        vm.uuid = $stateParams.uuid;
        vm.token = localStorageManagement.getValue('token');

        $scope.uploadProfilePicture = function () {
            $scope.loadingProfilePic = true;

            var formData = new FormData();

            if($scope.profilePictureFile.file){
                formData.append('profile', $scope.profilePictureFile.file);
            } else {
                return;
            }

            Rehive.admin.users.update(vm.uuid, formData).then(function (res) {
                $timeout(function(){
                    $scope.loadingProfilePic = false;
                    toastr.success('User profile picture successfully changed');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                },0);
            }, function (error) {
                $scope.loadingProfilePic = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
