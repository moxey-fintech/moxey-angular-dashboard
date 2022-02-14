(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserSettingsCtrl', UserSettingsCtrl);

    /** @ngInject */
    function UserSettingsCtrl($scope,Rehive,$stateParams,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.userSettingsObj = {};
        $scope.loadingUserSettings = true;

        vm.getUserSettings = function () {
            if(vm.token) {
                $scope.loadingUserSettings = true;
                Rehive.admin.users.settings.get(vm.uuid).then(function (res) {
                    $scope.loadingUserSettings = false;
                    $scope.userSettingsObj = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserSettings();

        $scope.toggleUserSettings = function (groupSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !groupSetting;

            if(vm.token) {
                Rehive.admin.users.settings.update(vm.uuid,updatedSetting).then(function (res) {
                    $scope.userSettingsObj = {};
                    $scope.userSettingsObj = res;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
