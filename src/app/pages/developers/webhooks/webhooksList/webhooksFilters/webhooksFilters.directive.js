(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.list')
        .directive('webhooksFilters', webhooksFilters);

    /** @ngInject */
    function webhooksFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/developers/webhooks/webhooksList/webhooksFilters/webhooksFilters.html'
        };
    }
})();