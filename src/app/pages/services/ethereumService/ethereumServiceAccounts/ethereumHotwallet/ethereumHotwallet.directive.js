(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumHotwallet', ethereumHotwallet);

    /** @ngInject */
    function ethereumHotwallet() {
        return {
            restrict: 'E',
            controller: 'EthereumHotwalletCtrl',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumHotwallet/ethereumHotwallet.html'
        };
    }
})();
