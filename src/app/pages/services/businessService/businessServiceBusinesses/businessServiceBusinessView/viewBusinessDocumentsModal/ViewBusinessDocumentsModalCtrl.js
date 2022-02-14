(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceBusinessView')
        .controller('ViewBusinessDocumentsModalCtrl', ViewBusinessDocumentsModalCtrl);

    function ViewBusinessDocumentsModalCtrl($scope,$http,$location,$uibModalInstance,document,toastr,$filter,businessId,businessName,
                                   localStorageManagement,errorHandler,extensionsHelper,$ngConfirm,metadataTextService) {

        var vm = this;
        vm.serviceUrl = null; 
        var serviceName = "business_service";
        vm.updatedDocument = {};
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.businessId = businessId;
        $scope.businessName = businessName;
        $scope.pdfSelected = false;
        $scope.editDocument = document;
        $scope.updatingDocument = true;
        $scope.showingDocumentFile = true;
        $scope.documentHasExpired = false;
        $scope.defaultImageUrl = "/assets/img/app/placeholders/hex_grey.svg";
        $scope.documentStatusOptions = ['Pending', 'Declined', 'Verified'];

        vm.getUserDocument = function () {
            if(vm.token){
                $scope.updatingDocument = true;
                $http.get(vm.serviceUrl + 'admin/businesses/' + $scope.businessId + '/documents/' + $scope.editDocument.id, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) { 
                    $scope.editDocument = res.data.data;
                    if($scope.editDocument.file){
                        $scope.pdfSelected = $scope.editDocument.file.endsWith('.pdf');
                    }
                    $scope.editDocument.status = $filter('capitalizeWord')($scope.editDocument.status);
                    $scope.editDocument.formatted_metadata = metadataTextService.convertToText($scope.editDocument.metadata)
                    $scope.updatingDocument = false;
                    // $scope.$apply();
                }, function (error) {
                    $scope.updatingDocument = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    // $scope.$apply();
                });
            }
        };

        $scope.documentChanged = function (field) {
            vm.updatedDocument[field] = $scope.editDocument[field];
        };

        $scope.updateDocument = function () {
            $scope.updatingDocument = true;
            vm.updatedDocument.status ? vm.updatedDocument.status = vm.updatedDocument.status.toLowerCase() : '';

            $scope.updatingDocument = true;
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/businesses/' + $scope.businessId + '/documents/' + $scope.editDocument.id,  vm.updatedDocument, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    toastr.success('Business document updated successfully');
                    $uibModalInstance.close(res);
                    $scope.updatingDocument = false;
                }).catch(function (error) {
                    $scope.updatingDocument = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openDeleteUserDocumentModal = function (page) {
            $ngConfirm({
                columnClass: 'medium',
                title: 'Delete business document',
                contentUrl: page,
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText !== 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            scope.deleteBusinessDocument();
                        }
                    }
                }
            });
        };

        $scope.deleteBusinessDocument = function() {
            $scope.updatingDocument = true;
            if(vm.token) {
                $http.delete(vm.serviceUrl + 'admin/businesses/' + $scope.businessId + '/documents/' + $scope.editDocument.id, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    toastr.success('Business document deleted successfully');
                    $uibModalInstance.close(res);
                    $scope.updatingDocument = false;
                }).catch(function (error) {
                    $scope.updatingDocument = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getUserDocument();
            })
            .catch(function(err){
                $scope.updatingDocument = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
