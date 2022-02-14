(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.currencies.archivedList', [])
        .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
          .state('currencies.archived', {
            url: '/archived-list',
            views: {
                'currenciesViews': {
                    templateUrl: 'app/pages/currencies/archivedList/archivedList.html',
                    controller: 'ArchivedListCtrl',
                }
            },            
            title: 'Currencies'
          });
    }
  
  })();
  