(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetWarmstorage', stellarTestnetWarmstorage);

    /** @ngInject */
    function stellarTestnetWarmstorage() {
        return {
            restrict: 'E',
            controller: 'StellarTestnetWarmstorageCtrl',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetWarmstorage/stellarTestnetWarmstorage.html'
        };
    }
})();
