/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('loadingImage', loadingImage);

    /** @ngInject */
    function loadingImage() {
        return {
            restrict: 'E',
            template: '<div class="spinner-container"><div class="spinner-div-smaller"><div></div></div></div>'
        };
    }
    
})();
    // template: '<img style="margin:auto;display:block" src="assets/img/loading.gif" width="90" height="90">'