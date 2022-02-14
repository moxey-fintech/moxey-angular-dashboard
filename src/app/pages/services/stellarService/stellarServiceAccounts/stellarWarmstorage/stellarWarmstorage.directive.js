(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarWarmstorage', stellarWarmstorage);

    /** @ngInject */
    function stellarWarmstorage() {
        return {
            restrict: 'E',
            controller: 'StellarWarmstorageCtrl',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarWarmstorage/stellarWarmstorage.html'
        };
    }
})();
