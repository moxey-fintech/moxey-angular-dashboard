(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.overview')
        .controller('GroupsOverviewCtrl', GroupsOverviewCtrl);

    /** @ngInject */
    function GroupsOverviewCtrl($rootScope,$scope,localStorageManagement,$uibModal,
                                errorHandler,serializeFiltersService,toastr,Rehive,$intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.dashboardTitle = 'Groups | Moxey';
        $scope.showingGroupFilters = false;
        $scope.groups = [];
        $scope.groupOptions = [];

        $scope.filtersObj = {
            nameFilter: false
        };
        $scope.applyFiltersObj = {
            nameFilter:{
                selectedGroup: {}
            }
        };

        $scope.showGroupFilters = function () {
            $scope.showingGroupFilters = !$scope.showingGroupFilters;
        };

        $scope.hideGroupFilters = function () {
            $scope.showingGroupFilters = false;
        };

        $scope.closeOptionsBox = function () {
            $scope.optionsName = '';
        };

        $scope.showGroupsOptions = function (code) {
            $scope.optionsName = code;
        };

        $scope.clearGroupFilters = function () {
            $scope.filtersObj = {
                nameFilter: false
            };
            $scope.hideGroupFilters();
            $scope.getGroups('applyfilter');
        };

        vm.getGroupFiltersObj = function () {
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            var searchObj = {
                page_size: 250,
                name: $scope.filtersObj.nameFilter ? $scope.applyFiltersObj.nameFilter.selectedGroup.name: null
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getGroups = function (dontShowLoadingImage) {
            if(vm.token) {
                $scope.showingGroupFilters = false;

                if(!dontShowLoadingImage){
                    $scope.loadingGroups = true;
                }

                // if ($scope.groups.length > 0) {
                //     $scope.groups.length = 0;
                // }

                var groupFiltersObj = vm.getGroupFiltersObj();

                Rehive.admin.groups.get({filters: groupFiltersObj}).then(function (res) {
                    $scope.groups = res.results;
                    if($scope.groupOptions.length === 0){
                        $scope.groupOptions = $scope.groups.slice();
                    }
                    $scope.groups.forEach(function(element,idx,array){
                        if(!element.icon){
                            element.short_name = element.name.length > 5 ? element.name.substring(0, 5) : element.name;
                            element.short_name = element.short_name.toUpperCase();
                        }
                        
                        (idx === array.length - 1) ? vm.getGroupUsers(element,'last') : vm.getGroupUsers(element);
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroups();

        vm.getGroupUsers = function (group,last) {
            if(vm.token) {
                Rehive.admin.users.overview.get({filters: {
                    group: group.name
                }}).then(function (res) {
                    $scope.groups.forEach(function (element,index) {
                        if(element.name == 'service'){
                            element.name = 'extension';
                        }
                        if(element.name == group.name){
                            element.totalUsers = res.total;
                            element.deactiveUsers = res.archived;
                        }
                    });
                    if(last){
                        $scope.loadingGroups = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.updateGroup = function(group,type){
            var updateObj = {};

            if(type == 'default'){
                group.public = true;
                updateObj.default = group.default;
                updateObj.public = true;
            } else if(type == 'public' && !group.public){
                updateObj.default = false;
                updateObj.public = group.public;
            } else {
                updateObj.public = group.public;
            }

            if(vm.token) {
                Rehive.admin.groups.update(group.name,updateObj).then(function (res) {
                    $scope.loadingGroups = false;
                    if((type == 'default') || (type == 'public' && !group.public)){
                        $scope.getGroups('dontShowLoadingImage');
                    }
                    toastr.success('Group successfully updated');
                    $scope.$apply();
                }, function (error) {
                    group[type] = !group[type];
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.restoreGroup = function (group) {
            $scope.loadingGroups = true;
            Rehive.admin.groups.update(group.name,{archived: false}).then(function (res) {
                $scope.closeOptionsBox();
                $scope.getGroups();
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroups = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAddGroupModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddGroupsModalCtrl'
            });

            vm.theModal.result.then(function(group){
                if(group){
                    $scope.getGroups();
                }
            }, function(){
            });
        };

        $scope.openDeleteGroupModal = function (page, size, group) {
            vm.theDeleteModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteGroupModalCtrl',
                scope: $scope,
                resolve: {
                    group: function () {
                        return group;
                    }
                }
            });

            vm.theDeleteModal.result.then(function(group){
                if(group){
                    $scope.getGroups();
                }
            }, function(){
            });
        };


    }
})();
