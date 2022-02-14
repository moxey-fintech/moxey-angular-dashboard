/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('contentTop', contentTop);

  /** @ngInject */
  function contentTop($location, $state) {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/contentTop/contentTop.html',
      controller: function($rootScope,$scope,$location){

        $scope.hideContentTop = false;
        var location = $location.path();
        if(location.indexOf('services/') > 0 && location.indexOf('services/add') < 0){
          $scope.hideContentTop = true;
        }

        $rootScope.$on('$locationChangeStart', function (event,newUrl) {
          $scope.hideContentTop = false;
          var location = $location.path();
          if(location.indexOf('services/') > 0 && location.indexOf('services/add') < 0){
            $scope.hideContentTop = true;
          }
        });
      },
      link: function($scope) {
        $scope.$watch(function () {
          $scope.activePageTitle = $state.current.title;
        });
      }
    };
  }

})();