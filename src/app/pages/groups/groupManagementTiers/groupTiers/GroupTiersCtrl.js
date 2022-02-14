(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('GroupTiersCtrl', GroupTiersCtrl);

    function GroupTiersCtrl($scope,$stateParams,$uibModal,localStorageManagement,
                            Rehive,errorHandler) {

    var vm = this;
    vm.token = localStorageManagement.getValue('token');
    vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
    $scope.loadingTiers = true;

    vm.getTiers = function(){
      if(vm.token) {
          $scope.loadingTiers = true;
          Rehive.admin.groups.tiers.get(vm.groupName).then(function (res) {
              $scope.loadingTiers = false;
              $scope.tiersList = res;
              $scope.$apply();
          }, function (error) {
              $scope.loadingTiers = false;
              errorHandler.evaluateErrors(error);
              errorHandler.handleErrors(error);
              $scope.$apply();
          });
      }
    };
    vm.getTiers();

    $scope.restoreTier = function(tier){
        if(vm.token) {
            $scope.loadingTiers = true;
            Rehive.admin.groups.tiers.update(vm.groupName,tier.id, { archived: false }).then(function (res) {
                vm.getTiers();
                $scope.$apply();
            }, function (error) {
                $scope.loadingTiers = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        }
    };

    $scope.openDeleteTierModal = function (page, size,tier) {
        vm.theModal = $uibModal.open({
            animation: true,
            templateUrl: page,
            size: size,
            controller: 'DeleteGroupTierModalCtrl',
            scope: $scope,
            resolve: {
                tier: function () {
                    return tier;
                }
            }
        });

        vm.theModal.result.then(function(tier){
            if(tier){
                vm.getTiers();
            }
        }, function(){
        });
    };

    $scope.openEditTierModal = function (page, size,tier) {
      vm.theModal = $uibModal.open({
          animation: true,
          templateUrl: page,
          size: size,
          controller: 'editGroupTierModalCtrl',
          scope: $scope,
          resolve: {
              tier: function () {
                  return tier;
              }
          }
      });

      vm.theModal.result.then(function(tier){
          if(tier){
              vm.getTiers();
          }
      }, function(){
      });
    };

    $scope.openCreateGroupTierModal = function (page, size) {
        vm.theAddModal = $uibModal.open({
            animation: true,
            templateUrl: page,
            size: size,
            controller: 'AddGroupTierModalCtrl',
            scope: $scope
        });

        vm.theAddModal.result.then(function(tier){
            if(tier){
                vm.getTiers();
            }
        }, function(){
        });
    };

    }
})();
