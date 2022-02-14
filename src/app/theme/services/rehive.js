(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('Rehive', Rehive);

    /** @ngInject */
    function Rehive($window,environmentConfig) {
        var config = {
            apiVersion: 3,
            storageMethod: 'local',
            customAPIURL: environmentConfig.API
        };
        var rehive = new $window.Rehive(config);
        return rehive;
    }

})();