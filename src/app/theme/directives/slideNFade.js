/**
 * @author m.talukder
 * created on 22.03.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('slideAndFade', slideAndFade);

    /** @ngInject */
    function slideAndFade() {
        function postLink($scope, element, attributes) {
            var expression = attributes.slideAndFade;
            // var duration = (attributes.animationDuration || "fast"); /*Can set the duration if wanted.*/

            /** To check the default state of the element based on the link-time value of watched model**/
            if (!$scope.$eval(expression)) {
                element.hide();
            }

            $scope.$watch(expression, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                element.stop(true, true).slideUp(700).fadeToggle({duration: 700, queue: false});
            });
        }
        return ({
            link: postLink,
            restrict: "A"
        });
    }

})();