(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionLimits')
        .controller('GroupTransactionLimitsCtrl', GroupTransactionLimitsCtrl);

    /** @ngInject */
    function GroupTransactionLimitsCtrl($scope,$stateParams,localStorageManagement,_,$window,currenciesList,
                            Rehive,$timeout,errorHandler,toastr,$uibModal,$ngConfirm,$filter,accountDefinitionService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.activeTabIndex = 0;
        $scope.loadingTierLimits = true;

        vm.groupTierLimitTypeSlugsObj = {
            'max': 'Maximum per transaction',
            'day_max': 'Maximum per day',
            'month_max': 'Maximum per month',
            'min': 'Minimum',
            'overdraft': 'Overdraft'
        };

        if($scope.currenciesList === []) {
            Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                $scope.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        }

        vm.accountDefinitions = function(){
            if(vm.token){
                accountDefinitionService.getAccountDefinition({filters: {group: vm.groupName}})
                .then(function(res){
                    $scope.accountDefinitions = res.results;
                }, function(error){
                    $scope.loadingGroupSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.accountDefinitions();

        vm.returnCurrencyObj = function (currencyCode) {
            return $scope.currenciesList.find(function (element) {
                return (element.code == currencyCode);
            });
        };

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierLimits = true;
                Rehive.admin.groups.tiers.get(vm.groupName).then(function (res) {
                    $scope.loadingTierLimits = false;
                    vm.unsortedTierLevelsArray = _.map(res ,'level');
                    vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                        return a - b;
                    });
                    $scope.tierLevelsForLimits = vm.sortedTierLevelsArray;
                    $scope.allTiers = res.sort(function(a, b) {
                        return parseFloat(a.level) - parseFloat(b.level);
                    });
                    if(tierLevel){
                        $scope.selectTier(tierLevel);
                    } else {
                        $timeout(function(){
                            $scope.activeTabIndex = 0;
                        });
                        $scope.selectTier($scope.tierLevelsForLimits[0]);
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierLimits = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getAllTiers();

        vm.findIndexOfTier = function(element){
            return this == element.level;
        };

        $scope.selectTier = function(tierLevel){
            $scope.editingTierLimits = false;
            var index = $scope.allTiers.findIndex(vm.findIndexOfTier,tierLevel);
            $scope.selectedTier = $scope.allTiers[index];
            if($scope.selectedTier){
                $scope.getTierLimits();
            }
        };

        $scope.getTierLimits = function(){
            if(vm.token) {
                $scope.loadingTierLimits = true;
                Rehive.admin.groups.tiers.limits.get(vm.groupName,$scope.selectedTier.id).then(function (res) {
                    $scope.loadingTierLimits = false;
                    res.forEach(function (element) {
                        element.currency = vm.returnCurrencyObj(element.currency);
                    });

                    $scope.tiersLimitsList = res;
                    $scope.tiersLimitsList.forEach(function(tierLimit){
                        tierLimit.type = vm.groupTierLimitTypeSlugsObj[tierLimit.type];                        
                        tierLimit.value = tierLimit.currency && tierLimit.currency.divisibility ? $filter('roundDecimalPartFilter')(tierLimit.value, tierLimit.currency.divisibility) : $filter('roundDecimalPartFilter')(tierLimit.value, 2);
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierLimits = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openEditGroupTierLimitModal = function (page, size,tierLimit) {
            vm.theEditModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditGroupTransactionLimitModalCtrl',
                scope: $scope,
                resolve: {
                    accountDefinitions: function () {
                        return $scope.accountDefinitions;
                    },
                    selectedTier: function () {
                        return $scope.selectedTier;
                    },
                    tierLimit: function () {
                        return tierLimit;
                    }
                }
            });

            vm.theEditModal.result.then(function(tierLevel){
                if(tierLevel){
                    $scope.getAllTiers(tierLevel);
                }
            }, function(){
            });
        };

        $scope.openAddGroupTierLimitModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddGroupTransactionLimitModalCtrl',
                scope: $scope,
                resolve: {
                    accountDefinitions: function () {
                        return $scope.accountDefinitions;
                    },
                    selectedTier: function () {
                        return $scope.selectedTier;
                    }
                }
            });

            vm.theAddModal.result.then(function(tierLevel){
                if(tierLevel){
                    $scope.getAllTiers(tierLevel);
                }
            }, function(){
            });
        };

        $scope.deleteTierLimitsConfirm = function (tierLimit) {
            $ngConfirm({
                title: 'Delete tier limit',
                content: 'Are you sure you want to remove this tier limit?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteTierLimit(tierLimit);
                        }
                    }
                }
            });
        };

        $scope.deleteTierLimit = function (tierLimit) {
            $scope.loadingTierLimits = true;
            Rehive.admin.groups.tiers.limits.delete(vm.groupName,$scope.selectedTier.id, tierLimit.id).then(function (res) {
                toastr.success('Tier limit successfully deleted');
                $scope.getAllTiers($scope.selectedTier.level);
                $scope.$apply();
            }, function (error) {
                $scope.loadingTierLimits = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
    }
})();
