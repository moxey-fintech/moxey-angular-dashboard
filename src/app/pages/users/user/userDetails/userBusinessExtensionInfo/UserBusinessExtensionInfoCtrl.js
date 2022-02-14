(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBusinessExtensionInfoCtrl', UserBusinessExtensionInfoCtrl);

    /** @ngInject */
    function UserBusinessExtensionInfoCtrl($scope,$http,Rehive,$stateParams,localStorageManagement,$uibModal,errorHandler,toastr,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        vm.baseUrl = null;
        var serviceName = "business_service";
        $scope.businessExtensionMetadata = null;
        $scope.hasBusinesses = false;
        $scope.loadingUserBusinessExtensionInfo = false;

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserBusinessExtensionInfo = true;
                $scope.businessExtensionMetadata = {};
                $scope.hasBusinesses = false;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.loadingUserBusinessExtensionInfo = false;
                    $scope.user = res;
                    if($scope.user.metadata 
                        && $scope.user.metadata.service_business 
                        && $scope.user.metadata.service_business.businesses){
                        $scope.businessExtensionMetadata = Object.assign({}, $scope.user.metadata.service_business.businesses);
                        $scope.hasBusinesses = Object.keys($scope.businessExtensionMetadata).length > 0;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserBusinessExtensionInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        // vm.getUser();

        $scope.goToBusinessView = function(businessName) {
            if(vm.baseUrl){
                $location.path('/extensions/business/businesses/' + businessName);
            } else {
                toastr.error("Business extension is not activated. Please activate the extension to see the detailed view of the business");
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            $scope.loadingUserBusinessExtensionInfo = true;
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.getUser();
            })
            .catch(function(err){
                $scope.loadingUserBusinessExtensionInfo = false;
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
