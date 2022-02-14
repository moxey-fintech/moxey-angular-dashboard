(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('EthereumServiceAccountsCtrl', EthereumServiceAccountsCtrl);

    /** @ngInject */
    function EthereumServiceAccountsCtrl($rootScope, $scope) {
        // $rootScope.dashboardTitle = 'Ethereum service | Moxey';
        $rootScope.dashboardTitle = 'Ethereum extension | Moxey';
        $scope.ethereumAccountSettingView = 'hotwallet';


        $scope.goToEthereumAccountSetting = function (setting) {
            $scope.ethereumAccountSettingView = setting;
        };
    }

})();
