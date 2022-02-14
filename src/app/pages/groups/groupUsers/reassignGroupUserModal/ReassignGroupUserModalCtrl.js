(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .controller('ReassignGroupUserModalCtrl', ReassignGroupUserModalCtrl);

    function ReassignGroupUserModalCtrl($scope,$uibModalInstance,toastr,user,Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.user = user;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupForReassigning = {};
        $scope.decisionMadeToChangeGroup = false;
        $scope.oldGroup = {};
        $scope.userEmail = '';
        $scope.sameGroup = true;
        $scope.groups = [];

        $scope.checkIfNewGroup = function () {
            if($scope.oldGroup.name == $scope.groupForReassigning.name){
                $scope.sameGroup = true;
            } else {
                $scope.sameGroup = false;
            }
        };

        $scope.decisionMadeToChangeGroupFunction = function () {
            $scope.decisionMadeToChangeGroup = !$scope.decisionMadeToChangeGroup;
            if($scope.oldGroup.name === "service"){
                $scope.oldGroup.name = "extension";
            }
            if($scope.groupForReassigning.name === "service"){
                $scope.groupForReassigning.name = "extension";
            }
        };

        vm.getUser = function(){
            if(vm.token) {
                Rehive.admin.users.get({filters: {id: vm.user.id}}).then(function (res) {
                    vm.user = res.results[0];
                    $scope.userEmail = vm.user ? vm.user.email : '';
                    $scope.oldGroup = vm.user ? vm.user.groups[0] : null;
                    $scope.checkIfNewGroup();
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
                Rehive.admin.groups.get().then(function (res) {
                    $scope.loadingGroups = false;
                    $scope.groups = res.results;
                    if(res.results.length > 0){
                        $scope.groupForReassigning = res.results[0];
                    }
                    for(var i = 0; i < $scope.groups.length; ++i){
                        if($scope.groups[i].name === "service"){
                            $scope.groups[i].name = "extension";
                        }
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
        vm.getGroups();

        $scope.deleteUserGroup = function () {
            $scope.loadingGroups = true;
            if(vm.user && vm.user.groups[0] && vm.user.groups[0].name){
                if(vm.user.groups[0].name === "extension"){
                    vm.user.groups[0].name = "service";
                }
                Rehive.admin.users.groups.delete(vm.user.id,vm.user.groups[0].name).then(function (res) {
                    vm.reassignUser();
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
