(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('randomString', randomString)
        .filter('roundDecimalPartFilter', formatDecimalNumberPart)
        .filter('commaSeperateNumberFilter', formatToCommaSeperatedDigits);

    /** @ngInject */
    function randomString(){
        return {
            getRandomStringOfFixedLength: function(length, charsSelection){
                var mask = '';
                if(charsSelection.indexOf('a') > -1){ mask += 'abcdefghijklmnopqrstuvwxyz'; }
                if(charsSelection.indexOf('A') > -1){ mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
                if(charsSelection.indexOf('#') > -1){ mask += '0123456789'; }
                if(charsSelection.indexOf('!') > -1){ mask += ' ~`!@#$%^&*()_-+={}[]|\;:,<.>/?'; }

                var result = '';
                for(var i = 0; i < length; ++i){
                    result += mask[Math.floor(Math.random() * mask.length)];
                }
                return result;
            }
        };
    }

    function formatToCommaSeperatedDigits(){
        return function(amount){
            if(!amount){return;}
            var values = typeof amount === 'string' ? amount.split('.') : amount.toString().split('.');
            var integerPart = parseInt(values[0]);
            values[0] = integerPart.toLocaleString('en-US');
            amount = values.join('.');
            return amount;
        };
    }

    function  formatDecimalNumberPart(){
        return function(amount,divisibility){
           if(!amount){
                amount = 0;
            }
            if(!divisibility || (divisibility == 0)){
                return amount.toFixed(2);
            }
            divisibility = Math.pow(10, divisibility);
            var integerPart = (amount / divisibility).toString().split('.')[0];
            // var integerPart = (amount / divisibility).toFixed(0);
            var decimalPart = "";

            if(integerPart == 0){
                var arr = new Big(amount / divisibility);
                var leadingZeros = Math.abs(arr.e) - 1;

                for(; leadingZeros > 0; --leadingZeros){
                    decimalPart += '0';
                }

                arr.c.forEach(function(digit){
                    decimalPart += digit;
                });

                switch(decimalPart.length){
                    case 0: return integerPart + ".00";
                    case 1: return integerPart + '.' + decimalPart + '0';
                    default: {
                        return integerPart + '.' + decimalPart;
                    }
                }
            }
            else{
                var arr = new Big(amount);
                for(var i = 0; i < integerPart.toString().length; ++i){
                    arr.c.splice(0, 1);
                }

                switch(arr.c.length){
                    case 0: return integerPart + ".00";
                    case 1: return integerPart + "." + arr.c[0] + "0";
                    default: {
                        arr.c.forEach(function(digit){
                            decimalPart += digit;
                        });

                        return integerPart + '.' + decimalPart;
                    }
                }
            }
        }
    }
})();
