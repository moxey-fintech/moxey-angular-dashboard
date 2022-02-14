(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarColdstorage', stellarColdstorage);

    /** @ngInject */
    function stellarColdstorage() {
        return {
            restrict: 'E',
            controller: 'StellarColdstorageCtrl',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarColdstorage/stellarColdstorage.html'
        };
    }
})();
