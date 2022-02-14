(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.list')
        .controller('AddUserModalCtrl', AddUserModalCtrl);

    /** @ngInject */
    function AddUserModalCtrl($scope,Rehive,$uibModalInstance,cleanObject,
                         localStorageManagement,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.showingMoreDetails = false;
        $scope.newUserParams = {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            mobile: '',
            id_number: '',
            language: '',
            metadata: '',
            timezone: '',
            groups: '',
            nationality: "US"
        };

        $scope.fixformat = function(){
            $scope.newUserParams.username = $scope.newUserParams.username.toLowerCase();
            $scope.newUserParams.username = $scope.newUserParams.username.replace(/ /g, '_');
        };

        vm.getGroups = function () {
            if(vm.token){
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    $scope.loadingUsers = false;
                    $scope.groups = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getGroups();

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.addNewUser = function (newUserParams) {
            var updatedParams = Object.assign({}, newUserParams);
            if(updatedParams.metadata === ''){
                updatedParams.metadata = '{}';
            } else {
                if(vm.isJson(updatedParams.metadata)){
                    updatedParams.metadata = updatedParams.metadata;
                } else {
                    toastr.error('Invalid metadata format');
                    return;
                }
            }

            if(updatedParams.groups && updatedParams.groups.name){
                updatedParams.groups = updatedParams.groups.name;
            }
            
            updatedParams = cleanObject.cleanObj(updatedParams);
            var formData = new FormData();
            
            for(var key in updatedParams) {
                if (updatedParams.hasOwnProperty(key)) {
                    formData.append(key, updatedParams[key]);
                }
            }
            
            $scope.loadingUsers = true;
            Rehive.admin.users.create(formData).then(function (res) {
                $scope.newUserParams = {
                    nationality: "US",
                    metadata: ''
                };
                $uibModalInstance.close(true);
                toastr.success('User successfully added');
                $scope.$apply();
            }, function (error) {
                $scope.loadingUsers = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });

        };

        $scope.toggleMoreDetails = function () {
            $scope.showingMoreDetails = !$scope.showingMoreDetails;
        };

    }
})();
