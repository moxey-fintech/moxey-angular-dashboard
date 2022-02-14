(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('multiOptionsFilterService', multiOptionsFilterService);

    /** @ngInject */
    function multiOptionsFilterService() {

        return {
            evaluatedDates : function (dateFilter) {
                var dateObj = {
                    date__lt: null,
                    date__gt: null
                };

                switch(dateFilter.selectedDateOption) {
                    case 'Is in the last':
                        if(dateFilter.selectedDayIntervalOption == 'days'){
                            dateObj.date__lt = moment().add(1,'days').format('YYYY-MM-DD');
                            dateObj.date__gt = moment().subtract(dateFilter.dayInterval,'days').format('YYYY-MM-DD');
                        } else {
                            dateObj.date__lt = moment().add(1,'days').format('YYYY-MM-DD');
                            dateObj.date__gt = moment().subtract(dateFilter.dayInterval,'months').format('YYYY-MM-DD');
                        }

                        break;
                    case 'In between':
                        dateObj.date__lt = moment(new Date(dateFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                        dateObj.date__gt = moment(new Date(dateFilter.dateFrom)).format('YYYY-MM-DD');

                        break;
                    case 'Is equal to':
                        dateObj.date__lt = moment(new Date(dateFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                        dateObj.date__gt = moment(new Date(dateFilter.dateEqualTo)).format('YYYY-MM-DD');

                        break;
                    case 'Is after':
                        dateObj.date__lt = null;
                        dateObj.date__gt = moment(new Date(dateFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                        break;
                    case 'Is before':
                        dateObj.date__lt = moment(new Date(dateFilter.dateTo)).format('YYYY-MM-DD');
                        dateObj.date__gt = null;
                        break;
                    default:
                        break;
                }

                return dateObj;
            },
            evaluatedAmounts: function (amountFilter) {
                var amountObj = {
                    amount: null,
                    amount__lt: null,
                    amount__gt: null
                };

                switch(amountFilter.selectedAmountOption) {
                    case 'Is equal to':
                        amountObj = {
                            amount: amountFilter.amount,
                            amount__lt: null,
                            amount__gt: null
                        };

                        break;
                    case 'Is between':
                        amountObj = {
                            amount: null,
                            amount__lt: amountFilter.amount__lt,
                            amount__gt: amountFilter.amount__gt
                        };

                        break;
                    case 'Is greater than':
                        amountObj = {
                            amount: null,
                            amount__lt: null,
                            amount__gt: amountFilter.amount__gt
                        };

                        break;
                    case 'Is less than':
                        amountObj = {
                            amount: null,
                            amount__lt: amountFilter.amount__lt,
                            amount__gt: null
                        };

                        break;
                    default:
                        break;
                }

                return amountObj;
            },
            evaluateReference: function (referenceFilter) {
                var referenceObj = {
                    reference: null,
                    reference__lt: null,
                    reference__gt: null
                };

                switch(referenceFilter.selectedReferenceOption) {
                    case 'Is equal to':
                        referenceObj = {
                            reference: referenceFilter.reference,
                            reference__lt: null,
                            reference__gt: null
                        };

                        break;
                    case 'Is between':
                        referenceObj = {
                            reference: null,
                            reference__lt: referenceFilter.reference__lt,
                            reference__gt: referenceFilter.reference__gt
                        };

                        break;
                    case 'Is greater than':
                        referenceObj = {
                            reference: null,
                            reference__lt: null,
                            reference__gt: referenceFilter.reference__gt
                        };

                        break;
                    case 'Is less than':
                        referenceObj = {
                            reference: null,
                            reference__lt: referenceFilter.reference__lt,
                            reference__gt: null
                        };

                        break;
                    default:
                        break;
                }

                return referenceObj;
            },
            evaluateGreaterLessEqualFilter: function(filterData, filter_name) {
                var filterObj = {};
                filterObj[filter_name] = null
                filterObj[filter_name + '__lt'] = null
                filterObj[filter_name + '__gt'] = null

                switch(filterData.selectedFilterOption) {
                    case 'Is equal to':
                        filterObj[filter_name] = filterData.value
                        break;
                    case 'Is between':
                        filterObj[filter_name + '__lt'] = filterData.lt__value
                        filterObj[filter_name + '__gt'] = filterData.gt__value
                        break;
                    case 'Is greater than':
                        filterObj[filter_name + '__gt'] = filterData.gt__value
                        break;
                    case 'Is less than':
                        filterObj[filter_name + '__lt'] = filterData.lt__value
                        break;
                    default:
                        break;
                }

                return filterObj;
            }
        };
    }

})();
