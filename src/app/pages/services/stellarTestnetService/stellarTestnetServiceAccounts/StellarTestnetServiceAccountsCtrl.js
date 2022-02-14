(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('StellarTestnetServiceAccountsCtrl', StellarTestnetServiceAccountsCtrl);

    /** @ngInject */
    function StellarTestnetServiceAccountsCtrl($rootScope, $scope,$timeout, $intercom, $state) {
        var vm = this;
        $rootScope.dashboardTitle = 'Stellar Testnet Extension | Moxey';
        $intercom.update();
        $scope.stellarAccountSettingView = '';
        vm.stellarTestnetAccountView = $state.params && $state.params.view ? $state.params.view : 'hotwallet';
        $scope.goToStellarAccountSetting = function (setting) {
            $scope.stellarAccountSettingView = setting;
        };

        $timeout(function () {
            $scope.goToStellarAccountSetting(vm.stellarTestnetAccountView);
        }, 200);
    }
})();
