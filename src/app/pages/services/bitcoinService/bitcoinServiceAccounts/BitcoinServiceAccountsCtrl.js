(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('BitcoinServiceAccountsCtrl', BitcoinServiceAccountsCtrl);

    /** @ngInject */
    function BitcoinServiceAccountsCtrl($rootScope, $scope,$timeout, $intercom, $state) {
        // $rootScope.dashboardTitle = 'Bitcoin service | Moxey';
        var vm = this;
        $rootScope.dashboardTitle = 'Bitcoin extension | Moxey';
        $scope.bitcoinAccountSettingView = '';
        $intercom.update();
        vm.bitcoinTestnetAccountView = $state.params && $state.params.view ? $state.params.view : 'hotwallet';
        $scope.goToBitcoinAccountSetting = function (setting) {
            $scope.bitcoinAccountSettingView = setting;
        };
        $timeout(function () {
            $scope.goToBitcoinAccountSetting(vm.bitcoinTestnetAccountView);
        },200);


    }

})();
