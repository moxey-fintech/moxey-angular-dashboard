(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceBusinessView')
        .controller('BusinessServiceBusinessViewCtrl', BusinessServiceBusinessViewCtrl);

    function BusinessServiceBusinessViewCtrl($rootScope,$scope,Rehive,$http,$location,localStorageManagement,$uibModal,$stateParams,toastr,errorHandler,extensionsHelper,serializeFiltersService,Upload,$window) {

        var vm = this;
        vm.serviceUrl = null; 
        var serviceName = "business_service";
        $rootScope.dashboardTitle = 'Business extension | Moxey';
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.businessId = $stateParams.business_id;
        $scope.updatingBusiness = true;
        $scope.loadingBusinessDocuments = false;
        $scope.editBusinessObj = {};
        $scope.businessDocumentsList = [];
        $scope.businessDocumentsData = [];
        $scope.categoryOptions = [];
        vm.updatedBusinessParams = {};
        $scope.statusOptions = [{"value": "pending", "text": "Pending"}, {"value": "declined", "text": "Declined"}, {"value": "verified", "text": "Verified"} ];
        $scope.imageFile = {
            file: {},
            iconFile: {}
        };
        $scope.editingBusiness = false;

        $scope.businessDocumentsPagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        vm.getBusinessDocumentsUrl = function(){
            var searchObj = {
                page: $scope.businessDocumentsPagination.pageNo,
                page_size: $scope.businessDocumentsPagination.itemsPerPage || 10
            };

            return vm.serviceUrl + 'admin/businesses/' + vm.businessId + '/documents/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getBusinessDocuments = function (applyFilter) {
            $scope.loadingBusinessDocuments = true;
            if (applyFilter) {
                $scope.businessDocumentsPagination.pageNo = 1;
            }

            if ($scope.businessDocumentsList.length > 0) {
                $scope.businessDocumentsList.length = 0;
            }

            var businessDocumentsUrl = vm.getBusinessDocumentsUrl();
            if(vm.token) {
                $http.get(businessDocumentsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.businessDocumentsData = res.data.data;
                    $scope.businessDocumentsList = $scope.businessDocumentsData.results;
                    $scope.loadingBusinessDocuments = false;
                }).catch(function (error) {
                    $scope.loadingBusinessDocuments = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.getBusinessOwner = function() {
            if(vm.token) {
                Rehive.admin.users.get({filters: {user: $scope.editBusinessObj.owner}}).then(function (res) {
                    $scope.editBusinessObj.ownerObj = res.results.length > 0 ? res.results[0] : null;
                    $scope.updatingBusiness = false;
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.updatingBusiness = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCategories = function(currentCategory){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/business-categories/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.categoryOptions = res.data.data.results;
                    if(currentCategory){
                        var idx = $scope.categoryOptions.findIndex(function(category){
                            return category.id === currentCategory.id;
                        });
                        $scope.editBusinessObj.category = (idx > -1) ? $scope.categoryOptions[idx] : null;
                    }
                }).catch(function (error) {
                    $scope.editingBusiness =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.getBusiness = function () {
            $scope.updatingBusiness = true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/businesses/' + vm.businessId, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingBusiness = false;
                    $scope.editBusinessObj = res.data.data;
                    $scope.$watch('editBusinessObj.colors.primary', $scope.watchPrimaryColorChange);
                    $scope.$watch('editBusinessObj.colors.secondary', $scope.watchSecondaryColorChange);
                    vm.getCategories($scope.editBusinessObj.category);
                    $scope.getBusinessOwner();
                }).catch(function (error) {
                    $scope.updatingBusiness = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };    

        $scope.openViewBusinessDocumentModal = function (page, businessDocument) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                controller: 'ViewBusinessDocumentsModalCtrl',
                windowClass: 'document-modal-window',
                scope: $scope,
                resolve: {
                    document: function () {
                        return businessDocument;
                    },
                    businessId: function () {
                        return vm.businessId;
                    },
                    businessName: function () {
                        return $scope.editBusinessObj.name;
                    }
                }
            });

            vm.theModal.result.then(function(document){
                if(document){
                    $scope.getBusinessDocuments();
                }
            }, function(){
            });
        };

        $scope.trackBusinessParamsChange = function(fieldName,colorName){
            if(fieldName === 'category'){
                vm.updatedBusinessParams.category = $scope.editBusinessObj.category.id;
            } 
            else if (fieldName === 'colors'){
                if(!vm.updatedBusinessParams["colors"] || vm.updatedBusinessParams["colors"] === undefined){
                    vm.updatedBusinessParams["colors"] = Object.assign({}, $scope.editBusinessObj.colors);
                }
                vm.updatedBusinessParams.colors[colorName] = $scope.editBusinessObj.colors[colorName];
            }
            else {
                vm.updatedBusinessParams[fieldName] = $scope.editBusinessObj[fieldName];
            }
        };

        $scope.upload = function () {
            if(!$scope.imageFile.file.name && !$scope.imageFile.iconFile.name){
                return;
            }
            $scope.updatingLogo = true;

            var uploadDataObj = {
                logo: $scope.imageFile.file.name ? $scope.imageFile.file: null,
                icon: $scope.imageFile.iconFile.name ? $scope.imageFile.iconFile: null
            };

            Upload.upload({
                url: vm.serviceUrl + 'admin/businesses/' + vm.businessId + '/',
                data: serializeFiltersService.objectFilters(uploadDataObj),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "PATCH"
            }).then(function (res) {
                toastr.success('Image(s) uploaded successfully.');
                $scope.businessImageUrl = res.data.data.logo;
                $scope.updatingLogo = false;
            }).catch(function (error) {
                $scope.updatingLogo = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        
        $scope.updateBusinessDetails = function () { 
            vm.updatedBusinessParams = serializeFiltersService.objectFilters(vm.updatedBusinessParams);

            if(vm.token){
                $scope.updatingBusiness = true;
                $http.patch(vm.serviceUrl + 'admin/businesses/' + vm.businessId + '/', vm.updatedBusinessParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    toastr.success('Business successfully updated');
                    $scope.getBusiness();
                }).catch(function (error) {
                    $scope.updatingBusiness = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        $scope.watchPrimaryColorChange = function(newValue, oldValue){
            $scope.trackBusinessParamsChange('colors', 'primary');
       };

       $scope.watchSecondaryColorChange = function(newValue, oldValue){
            $scope.trackBusinessParamsChange('colors', 'secondary');
        };

        $scope.goToUserDetails = function() {
            $window.open('/#/user/' + $scope.editBusinessObj.owner + '/details','_blank');
        };

        $scope.backToBusinessess = function() {
            $location.path('/extensions/business/businesses');
        };

        $scope.toggleEditingBusinessDetails = function() {
            $scope.editingBusiness = !$scope.editingBusiness;
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getBusiness();
                $scope.getBusinessDocuments();
            })
            .catch(function(err){
                $scope.updatingBusiness = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
