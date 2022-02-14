(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings')
        .controller('SettingsCtrl', SettingsCtrl);

    /** @ngInject */
    function SettingsCtrl($rootScope,Rehive,$scope,environmentConfig,Upload,localStorageManagement,
                          errorHandler,$window,$timeout,$location,$intercom, currenciesList) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.settingView = 'accountInfo';
        $rootScope.dashboardTitle = 'Settings | Moxey';
        $scope.currencyOptions = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.settingsLocation = $scope.locationIndicator;

        $scope.$on('$locationChangeStart', function (event,newUrl) {
            vm.location = $location.path();
            vm.locationArray = vm.location.split('/');
            $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
            $scope.settingsLocation = $scope.locationIndicator;
            if($scope.locationIndicator === 'settings'){
                $scope.goToSetting('/settings/company-info');
            }
        });

        $scope.goToSetting = function(path){
            $scope.settingView = '';
            $location.path(path);
        };

    }
})();
