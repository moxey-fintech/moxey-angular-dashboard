/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('dashboardTasks', dashboardTasks);

    /** @ngInject */
    function dashboardTasks() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/theme/components/pageTop/dashboardTasks/dashboardTasks.html'
        };
    }

})();