(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetColdstorage', stellarTestnetColdstorage);

    /** @ngInject */
    function stellarTestnetColdstorage() {
        return {
            restrict: 'E',
            controller: 'StellarTestnetColdstorageCtrl',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetColdstorage/stellarTestnetColdstorage.html'
        };
    }
})();
