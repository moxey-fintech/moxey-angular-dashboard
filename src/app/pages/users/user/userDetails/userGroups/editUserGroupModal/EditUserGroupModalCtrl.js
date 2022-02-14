(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserGroupModalCtrl', EditUserGroupModalCtrl);

    function EditUserGroupModalCtrl($rootScope,$scope,$uibModalInstance,toastr,userGroup,uuid,
                                    Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = uuid;
        vm.user = {};
        $scope.groupForReassigning = {};
        $scope.oldGroup = {};
        $scope.sameGroup = true;
        $scope.changeUserGroupDecision = false;
        $scope.loadingGroups = true;

        $scope.checkIfNewGroup = function () {
            if($scope.oldGroup.name == $scope.groupForReassigning.name){
                $scope.sameGroup = true;
            } else {
                $scope.sameGroup = false;
            }
        };

        $scope.changeUserGroupConfirm = function () {
            $scope.changeUserGroupDecision = !$scope.changeUserGroupDecision;
            if($scope.groupForReassigning.name === "service"){
                $scope.groupForReassigning.name = "extension";
            }
            if($scope.groupForReassigning.name === "service"){
                $scope.groupForReassigning.name = "extension";
            }
        };

        vm.getUser = function(){
            if(vm.token) {
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    vm.user = res;
                    $scope.userEmail = res.email;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        vm.getGroups = function () {
            if(vm.token) {
                $scope.loadingGroups = true;
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    $scope.loadingGroups = false;
                    res.results.forEach(function (group) {
                        if(group.name === "service"){
                            group.name = "extension";
                        }
                        if(group.name == userGroup.name){
                            $scope.groupForReassigning = group;
                            $scope.oldGroup = group;
                        }
                    });
                    $scope.groups = res.results;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getGroups();

        $scope.deleteUserGroup = function () {
            $scope.loadingGroups = true;
            if(vm.user.groups[0] && vm.user.groups[0].name){
                Rehive.admin.users.groups.delete(vm.user.id,vm.user.groups[0].name).then(function (res) {
                    vm.reassignUser();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                vm.reassignUser();
            }
        };

        vm.reassignUser = function () {
            if(vm.token) {
                Rehive.admin.users.groups.create(vm.user.id, {
                    group: ($scope.groupForReassigning.name === "extension") ? "service" : $scope.groupForReassigning.name
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    $rootScope.$broadcast('userGroupChanged','group changed');
                    toastr.success('User successfully reassigned');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
