(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('compareArrayOfObjects', compareArrayOfObjects);

    /** @ngInject */
    function compareArrayOfObjects() {

        return {
            differentElem: function( newArray, oldArray ) {
                function comparer(otherArray){
                    return function(current){
                        return otherArray.filter(function(other){
                            return other.code == current.code && other.unit == current.unit;
                        }).length == 0;
                    };
                }

                var onlyInNewValue = newArray.filter(comparer(oldArray));
                var onlyInOldValue = oldArray.filter(comparer(newArray));

                var result = onlyInNewValue.concat(onlyInOldValue);

                return result;
            }
        };
    }
})();