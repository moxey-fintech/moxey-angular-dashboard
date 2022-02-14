(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupStats')
        .controller('GroupStatsCtrl', GroupStatsCtrl);

    /** @ngInject */
    function GroupStatsCtrl($scope,localStorageManagement,Rehive,$stateParams,$location,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupName = ($stateParams.groupName == 'service') ? 'extension' : $stateParams.groupName;
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.getGroup = function () {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: groupName}).then(function (res) {
                    if(res.name === "service"){
                        res.name = "extension";
                    }
                    $scope.editGroupObj = res;
                    $scope.editGroupObj.prevName = res.name;
                    vm.getGroupUsers($scope.editGroupObj);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroup();

        vm.getGroupUsers = function (group) {
            group.name = (group.name === "extension") ? "service" : group.name;
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.users.overview.get({filters: {
                    group: group.name
                }}).then(function (res) {
                    $scope.totalUsersCount = res.total;
                    $scope.deactiveUsersCount = res.archived;
                    vm.getGroupUsersPerDay(group);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getGroupUsersPerDay = function (group) {
            group.name = (group.name === "extension") ? "service" : group.name;
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.users.overview.get({filters: {
                    group: group.name,
                    created__lt: Date.parse(moment(new Date()).add(1,'days').format('YYYY-MM-DD') +'T00:00:00'),
                    created__gt: Date.parse(moment(new Date()).format('YYYY-MM-DD') +'T00:00:00')
                }}).then(function (res) {
                    $scope.newUsersToday = res.total;
                    $scope.loadingGroup = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };




    }
})();
