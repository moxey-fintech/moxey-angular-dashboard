(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumColdstorage', ethereumColdstorage);

    /** @ngInject */
    function ethereumColdstorage() {
        return {
            restrict: 'E',
            controller: 'EthereumColdstorageCtrl',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumColdstorage/ethereumColdstorage.html'
        };
    }
})();
