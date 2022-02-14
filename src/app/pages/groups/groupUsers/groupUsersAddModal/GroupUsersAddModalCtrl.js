(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .controller('GroupUsersAddModalCtrl', GroupUsersAddModalCtrl);

    function GroupUsersAddModalCtrl($scope,$uibModalInstance,toastr,group,Rehive,
                                    localStorageManagement,errorHandler,typeaheadService) {

        var vm = this;
        vm.group = group;
        vm.token = localStorageManagement.getValue('token');
        $scope.userGroupParams = {
            inputType: 'Email'
        };
        $scope.loadingGroup = false;

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getUsersMobileTypeahead = typeaheadService.getUsersMobileTypeahead();

        $scope.getUserToAddToGroup = function(userGroupParams){
            if(vm.token) {
                $scope.loadingGroup = true;
                vm.filter = '';
                vm.filterString = '';
                vm.filterObj = {};

                if(userGroupParams.inputType == 'Email'){
                    vm.filter = 'email__contains';
                    vm.filterString = userGroupParams.email;
                } else if(userGroupParams.inputType == 'Mobile'){
                    vm.filter = 'mobile__contains';
                    vm.filterString = userGroupParams.mobile;
                } else {
                    vm.filter = 'id__contains';
                    vm.filterString = userGroupParams.id;
                }

                vm.filterObj[vm.filter] = vm.filterString;

                Rehive.admin.users.get({filters: vm.filterObj}).then(function (res) {
                    if(res.results.length == 0){
                        toastr.error('No user found');
                        $scope.loadingGroup = false;
                    } else {
                        $scope.user = res.results[0];
                        $scope.deleteUserGroup();
                    }
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteUserGroup = function () {
            $scope.loadingGroup = true;
            if($scope.user && $scope.user.groups[0] && $scope.user.groups[0].name){
                Rehive.admin.users.groups.delete($scope.user.id ,$scope.user.groups[0].name).then(function (res) {
                    vm.addUserToGroup();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                vm.addUserToGroup();
            }
        };

        vm.addUserToGroup = function(){
            if(vm.token) {
                Rehive.admin.users.groups.create($scope.user.id, {
                    group: vm.group.name
                }).then(function (res) {
                    $scope.loadingGroup = false;
                    toastr.success('Group successfully added');
                    $uibModalInstance.close(res);
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
