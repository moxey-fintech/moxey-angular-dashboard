(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .controller('StellarServiceAccountsCtrl', StellarServiceAccountsCtrl);

    /** @ngInject */
    function StellarServiceAccountsCtrl($rootScope, $scope,$timeout, $intercom, $state) {
        var vm = this;
        $rootScope.dashboardTitle = 'Stellar Extension | Moxey';
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