/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('BaSidebarCtrl', BaSidebarCtrl);

  /** @ngInject */
  function BaSidebarCtrl($scope, baSidebarService,$window,$location) {

    $scope.menuItems = baSidebarService.getMenuItems();
    $scope.defaultSidebarState = $scope.menuItems[0].stateRef;
    $scope.expandedMenu = false;

    $scope.sideBarMenuSelected = function (event) {
      if(event && event.currentTarget){
        if(event.target.innerText.trim() == 'Developers'){
            // ^ checking reverse as event.currentTarget.clientHeight gives previous values on click
            $scope.expandedMenu = !$scope.expandedMenu;
        } else {
          if($scope.expandedMenu && (event.target.innerText.trim() != 'Access control') &&
              (event.target.innerText.trim() != 'API tokens') && (event.target.innerText.trim() != 'Request logs') &&
              (event.target.innerText.trim() != 'Webhooks')){
              $scope.expandedMenu = false;
          }
        }
      } else {
          if(($location.path().indexOf('developers') > -1)){
              $scope.expandedMenu = true;
          }
      }
    };
    $scope.sideBarMenuSelected();

    $scope.hoverItem = function ($event) {
      $scope.showHoverElem = true;
      $scope.hoverElemHeight =  $event.currentTarget.clientHeight;
      var menuTopValue = 70;
      $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
        if(($event.currentTarget.innerText).trim() == 'Build a fintech app'){
            $scope.hoverElemTop = -menuTopValue ;
        }
    };

    $scope.$on('$stateChangeSuccess', function () {
      if (baSidebarService.canSidebarBeHidden() || window.innerWidth < 1201) {
        baSidebarService.setMenuCollapsed(true);
      }
    });
  }
})();