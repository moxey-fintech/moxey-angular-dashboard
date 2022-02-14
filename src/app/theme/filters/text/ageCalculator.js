/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .filter('ageCalculator', ageCalculator);

    /** @ngInject */
    function ageCalculator() {
        return function(birthdayString) {
            if(!birthdayString){
                return '';
            }
            var birthdate = moment().diff(moment(birthdayString), 'years', true);
            return  Math.floor(birthdate);
        };
    }

})();
