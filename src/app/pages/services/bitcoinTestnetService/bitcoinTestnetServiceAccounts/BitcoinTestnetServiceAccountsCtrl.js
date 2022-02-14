(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts')
        .controller('BitcoinTestnetServiceAccountsCtrl', BitcoinTestnetServiceAccountsCtrl);

    /** @ngInject */
    function BitcoinTestnetServiceAccountsCtrl($rootScope, $scope,$timeout, $intercom, $state) {
        // $rootScope.dashboardTitle = 'Bitcoin service | Moxey';
        var vm = this;
        $rootScope.dashboardTitle = 'Bitcoin testnet extension | Moxey';
        $scope.bitcoinTestnetAccountSettingView = '';
        $intercom.update();
        vm.bitcoinTestnetAccountView = $state.params && $state.params.view ? $state.params.view : 'hotwallet';
        $scope.goToBitcoinTestnetAccountSetting = function (setting) {
            $scope.bitcoinTestnetAccountSettingView = setting;
        };

        $timeout(function () {
            $scope.goToBitcoinTestnetAccountSetting(vm.bitcoinTestnetAccountView);
        }, 200);
    }

})();
