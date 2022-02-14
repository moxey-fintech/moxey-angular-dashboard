/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('mainLoadingImage', mainLoadingImage);

    /** @ngInject */
    function mainLoadingImage() {
        return {
            restrict: 'E',
            template: '<div class="main-spinner-container main-spinner"><div class="spinner-div"><div></div></div></div>'
        };
    }

})();

/*
'<img class="main-spinner" src="assets/img/loading.gif">'
*/