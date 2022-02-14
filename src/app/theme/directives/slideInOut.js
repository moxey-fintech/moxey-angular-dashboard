/**
 * @author m.talukder
 * created on 22.03.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('slideInOut', slideInOut);

    /** @ngInject */
    function slideInOut() {
        function postLink($scope, element, attributes) {
            var expression = attributes.slideInOut;
            var duration = (attributes.slideDuration || "fast");

            /** To check the default state of the element based on the link-time value of watched model**/
            if (!$scope.$eval(expression)) {
                element.hide();
            }

            $scope.$watch(expression, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                // element.stop(true, true).slideToggle(duration);
                element.stop(true, true).slideToggle(700);
            });
        }
        return ({
            link: postLink,
            restrict: "A"
        });
    }

})();