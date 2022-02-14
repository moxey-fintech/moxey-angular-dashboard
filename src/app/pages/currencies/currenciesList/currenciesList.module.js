(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.currencies.currenciesList', [])
        .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
          .state('currencies.list', {
            url: '/currencies-list',
            views: {
                'currenciesViews': {
                    templateUrl: 'app/pages/currencies/currenciesList/currenciesList.html',
                    controller: 'CurrenciesListCtrl',
                }
            },            
            title: 'Currencies'
          });
    }
  
  })();
  