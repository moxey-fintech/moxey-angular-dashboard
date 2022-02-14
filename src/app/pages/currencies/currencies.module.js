(function () {
  'use strict';

  angular.module('BlurAdmin.pages.currencies', [
    'BlurAdmin.pages.currencies.currenciesList',
    'BlurAdmin.pages.currencies.archivedList'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider,$urlRouterProvider) {
    $stateProvider
        .state('currencies', {
          url: '/currencies',
          abstract: true,
          template : '<div ui-view="currenciesViews"></div>',
          controller: function ($scope,_,$state,$location) {

              var vm = this;
              vm.location = $location.path();
              vm.locationArray = vm.location.split('/');

              $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
              
              if($scope.locationIndicator == 'currencies'){
                  $state.go('currencies.list');
              }
              
              $scope.$on('$locationChangeStart', function (event,newUrl) {
                  var newUrlArray = newUrl.split('/'),
                      newUrlLastElement = _.last(newUrlArray);
                  if(newUrlLastElement == 'currencies-list' || newUrlLastElement == 'currencies'){
                      $scope.locationIndicator = 'currencies-list';
                      $state.go('currencies.list');
                  } 
                  else if(newUrlLastElement == 'archived-list') {
                      $scope.locationIndicator = 'archived-list';
                      $state.go('currencies.archived');
                  } 
              });
          },
          title: 'Currencies',
          sidebarMeta: {
              order: 100,
              icon: 'sidebar-currencies-icon'
          }
        });

        $urlRouterProvider.when("/currencies", "/currencies/currencies-list");
  }

})();
