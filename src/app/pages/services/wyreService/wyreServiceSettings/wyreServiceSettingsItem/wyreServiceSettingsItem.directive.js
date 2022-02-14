(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreService.wyreServiceSettings')
        .directive('wyreServiceSettingsItem', wyreServiceSettingsItem);

    /** @ngInject */
    function wyreServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/wyreService/wyreServiceSettings/wyreServiceSettingsItem/wyreServiceSettingsItem.html'
        };
    }
})();
