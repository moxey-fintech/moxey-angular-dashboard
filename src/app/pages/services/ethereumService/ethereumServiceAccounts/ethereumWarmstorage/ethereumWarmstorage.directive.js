(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumWarmstorage', ethereumWarmstorage);

    /** @ngInject */
    function ethereumWarmstorage() {
        return {
            restrict: 'E',
            controller: 'EthereumWarmstorageCtrl',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumWarmstorage/ethereumWarmstorage.html'
        };
    }
})();
