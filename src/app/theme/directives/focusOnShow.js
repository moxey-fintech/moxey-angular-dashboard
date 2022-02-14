/**
 * @author m.talukder
 * created on 10.06.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('focusOnShow', focusOnShow);

    /** @ngInject */
    function focusOnShow($timeout) {
        function postLink($scope,$element,$attr) {
            if ($attr.ngShow){
                $scope.$watch($attr.ngShow, function(newValue){
                    if(newValue){
                        $timeout(function(){
                            $element[0].focus();
                        }, 0);
                    }
                })      
            }
            if ($attr.ngHide){
                $scope.$watch($attr.ngHide, function(newValue){
                    if(!newValue){
                        $timeout(function(){
                            $element[0].focus();
                        }, 0);
                    }
                })      
            }
        }

        return ({
            link: postLink,
            restrict: "A"
        });
    }

})();