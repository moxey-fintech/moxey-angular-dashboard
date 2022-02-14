(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account.standaloneSettings')
        .controller('StandaloneSettingsCtrl', StandaloneSettingsCtrl);

    /** @ngInject */
    function StandaloneSettingsCtrl($scope,Rehive,localStorageManagement,$stateParams,$location,$rootScope,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.shouldBeBlue = 'Accounts';
        $rootScope.standaloneBreadcrumbTitle = '';
        $scope.reference = $stateParams.reference;
        $scope.currencyCode = $stateParams.currencyCode;
        $scope.standaloneSettingView = 'controls';
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
                    $scope.standaloneAccountName = res.name;
                    $rootScope.standaloneBreadcrumbTitle = $scope.standaloneAccountName + ' - ' + $scope.currencyCode;
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

        $scope.goToAccountSetting = function(path){
            $scope.subMenuLocation = path;
            $location.path('account/'+ $scope.reference +'/account-settings/' + $scope.currencyCode + '/' + path);
        };

        if($scope.subMenuLocation != 'account-limits' && $scope.subMenuLocation != 'account-fees'  && $scope.subMenuLocation != 'currency-settings' ){
            $scope.goToAccountSetting('account-limits');
        }

    }
})();
