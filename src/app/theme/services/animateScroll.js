(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('animateScroll', animateScroll);

    /** @ngInject */
    function animateScroll() {
        return {
            scrollDown: function (elem) {
                return elem.each(function () {
                    $('html, body').animate({
                        scrollTop: $(elem).offset().top
                    }, 1000);
                });
            }
        };
    }

})();
