(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('localStorageManagement', localStorageManagement);

    /** @ngInject */
    function localStorageManagement() {

        return {
            getValue: function (localStorageName) {
                return localStorage.getItem(localStorageName);
            },
            setValue: function (localStorageName, cookieValue) {
                localStorage.setItem(localStorageName, cookieValue);
            },
            deleteValue: function (localStorageName) {
                localStorage.removeItem(localStorageName);
            }
        };
    }

})();