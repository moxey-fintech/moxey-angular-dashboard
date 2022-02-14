(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('currencyModifiers', currencyModifiers)
        .filter('currencyModifiersFilter', currencyModifiersFilter);

    /** @ngInject */
    function currencyModifiers(Big) {

        return {
            convertToCents: function (amount,divisibility) {
                if(!amount){
                    amount = 0;
                }

                if(!divisibility || (divisibility == 0)){
                    return amount;
                }

                var x = new Big(amount);
                var z = new Big(10);
                z = z.pow(divisibility);
                z = z.toFixed(0);
                var m = x.times(z);
                return  m.toFixed(0);
            },
            convertFromCents: function (amount,divisibility) {
                if(!amount){
                    amount = 0;
                }

                if(!divisibility || (divisibility == 0)){
                    return amount;
                }

                var j = new Big(amount);
                var l = new Big(10);
                l = l.pow(divisibility);
                l = l.toFixed(0);
                var n = j.div(l);
                return n.toFixed(divisibility);
            },
            validateCurrency: function (amount,divisibility) {
                if(!amount){
                    amount = 0;
                }

                if(!divisibility || (divisibility == 0)){
                    return true;
                }

                var amountInArray = amount.toString().split('.');
                var afterDecimalValue = amountInArray[1];
                if(afterDecimalValue == undefined){
                    return true;
                }
                return afterDecimalValue.length > divisibility ? false : true;
            }
        }
    }

    function currencyModifiersFilter(){
        return function (amount,divisibility){
            if(!amount){
                amount = 0;
            }

            if(!divisibility || (divisibility == 0)){
                return amount;
            }

            var q = new Big(amount);
            var w = new Big(10);
            w = w.pow(divisibility);
            w = w.toFixed(0);
            var e = q.div(w);
            return e.toFixed(divisibility);
        }
    }
})();
