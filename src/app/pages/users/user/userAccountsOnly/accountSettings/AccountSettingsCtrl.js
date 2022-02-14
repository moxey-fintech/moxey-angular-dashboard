(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings')
        .controller('AccountSettingsCtrl', AccountSettingsCtrl);

    /** @ngInject */
    function AccountSettingsCtrl($scope,Rehive,localStorageManagement,$stateParams,$location,$rootScope,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.shouldBeBlue = 'Users';
        $rootScope.accountBreadCrumbTitle = '';
        $scope.reference = $stateParams.reference;
        $scope.currencyCode = $stateParams.currencyCode;
        vm.uuid = $stateParams.uuid;
        $scope.settingView = 'controls';
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.subMenuLocation = $scope.locationIndicator;
        $scope.loadingAccount = false;

        vm.getUserAccount = function(){
            if(vm.token) {
                $scope.loadingAccount = true;
                Rehive.admin.accounts.get({reference: $scope.reference}).then(function (res) {
                    $scope.loadingAccount = false;
                    $scope.accountName = res.name;
                    $rootScope.accountBreadCrumbTitle = $scope.accountName + ' - ' + $scope.currencyCode;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserAccount();

        $scope.goToSetting = function(path){
            $scope.subMenuLocation = path;
            $location.path('user/' + vm.uuid + '/account/'+ $scope.reference +'/settings/' + $scope.currencyCode + '/' + path);
        };

        if($scope.subMenuLocation != 'limits' && $scope.subMenuLocation != 'fees'  && $scope.subMenuLocation != 'settings' ){
            $scope.goToSetting('limits');
        }

    }
})();
