(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserMetadataCtrl', UserMetadataCtrl);

    /** @ngInject */
    function UserMetadataCtrl($scope,Rehive,$stateParams,metadataTextService,
                              localStorageManagement,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.formatted = {};
        $scope.formatted.metadata = {};
        $scope.loadingUserMetadata = true;

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserMetadata = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.formatted = {};
                    $scope.formatted.metadata = {};
                    $scope.user = res;
                    $scope.formatted.metadata = metadataTextService.convertToText($scope.user.metadata);
                    $scope.loadingUserMetadata = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserMetadata = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        $scope.openUserMetadataModal = function (page, size, user) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserMetadataModalCtrl',
                scope: $scope,
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUser();
                }
            }, function(){
            });
        };

    }
})();
