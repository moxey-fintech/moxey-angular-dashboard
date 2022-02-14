(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBasicInfoCtrl', UserBasicInfoCtrl);

    /** @ngInject */
    function UserBasicInfoCtrl($scope,$http,Rehive,$stateParams,localStorageManagement,$uibModal,errorHandler,toastr,$location,extensionsHelper) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        vm.baseUrl = null;
        var serviceName = "conversion_service";
        $scope.userIsUnder18 = false;
        $scope.loadingUserBasicInfo = true;
        $scope.birthDate = {
            year: '',
            month: '',
            day: ''
        };
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserBasicInfo = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    if(res.birth_date){
                        var birthdayStringArray = res.birth_date.split('-');
                        $scope.birthDate = {
                            year: birthdayStringArray[0],
                            month: birthdayStringArray[1],
                            day: birthdayStringArray[2]
                        };
                    }
                    $scope.user = res;
                    if($scope.user.birth_date){
                        $scope.userIsUnder18 = moment().diff($scope.user.birth_date, 'years') < 18;
                    }
                    if($scope.user.groups.length > 0 && $scope.user.groups[0].name === "service"){
                        $scope.user.groups[0].name = "extension";
                        $scope.user.first_name = $scope.user.first_name.replace("Service", "Extension");
                    }
                    if(vm.baseUrl){
                        vm.getUserDisplayCurrency();
                    } else {
                        $scope.loadingUserBasicInfo = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserBasicInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        vm.getUserDisplayCurrency = function(){
            $scope.loadingUserBasicInfo = true;
            $http.get(vm.baseUrl + 'admin/users/' + vm.uuid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + vm.token
                }
            }).then(function (res) {
                $scope.loadingUserBasicInfo = false;
                $scope.userDisplayCurrency = res.data.data;
            }).catch(function (error) {
                $scope.loadingUserBasicInfo = false;
                if(!error.status == 404){
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                }
            });
        };

        $scope.openUserBasicInfoModal = function (page, size, user) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'BasicInfoModalCtrl',
                scope: $scope,
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUser();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.getUser();
            })
            .catch(function(err){
                $scope.loadingUserBasicInfo = false;
                vm.getUser();
                // toastr.error("Conversion extension not activated for company");
                // $location.path('/users');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
