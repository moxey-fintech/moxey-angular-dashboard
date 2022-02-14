/**
 * @author m.talukder
 * created on 22.03.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('fadeInOut', fadeInOut);

    /** @ngInject */
    function fadeInOut() {
        function postLink($scope, element, attributes) {
            var expression = attributes.fadeInOut;
            var duration = (attributes.fadeDuration || "fast");

            /** To check the default state of the element based on the link-time value of watched model**/
            if (!$scope.$eval(expression)) {
                element.hide();
            }

            $scope.$watch(expression, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                // element.stop(true, true).fadeToggle(duration);
                element.stop(true, true).fadeToggle(400);
            });
        }
        return ({
            link: postLink,
            restrict: "A"
        });
    }

})();