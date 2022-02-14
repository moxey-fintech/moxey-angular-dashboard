(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserDocumentsCtrl', UserDocumentsCtrl);

    /** @ngInject */
    function UserDocumentsCtrl($scope,Rehive,$uibModal,$stateParams,localStorageManagement,errorHandler,$window,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserDocuments = true;
        vm.documentTypeSlugOptionsObj = {
            'utility_bill': 'Utility Bill',
            'bank_statement': 'Bank Statement',
            'lease_or_rental_agreement': 'Lease Or Rental Agreement',
            'municipal_rate_and_taxes': 'Municipal Rate and Taxes Invoice',
            'mortgage_statement': 'Mortgage Statement',
            'telephone': 'Telephone or Cellular Account',
            'insurance_policy': 'Insurance Policy Document',
            'retail_store': 'Statement of Account Issued by a Retail Store',
            'government_id': 'Government Issued ID',
            'passport': 'Passport',
            'drivers_license': 'Drivers License',
            'id_confirmation': 'ID Confirmation Photo',
            'payslip': 'Payslip',
            'employment_letter': 'Employment Letter',
            'financial_statement': 'Financial Statement',
            'generic_proof_of_address': 'Generic Proof Of Address',
            'generic_proof_of_identity': 'Generic Proof Of Identity',
            'generic_advanced_proof_of_identity': 'Generic Advanced Proof Of Identity',
            'other': 'Other'
        };

        vm.documentCategorySlugsOptionsObj = {
            'proof_of_income': 'Proof Of Income',
            'proof_of_address': 'Proof Of Address',
            'proof_of_identity': 'Proof Of Identity',
            'advanced_proof_of_identity': 'Advanced Proof Of Identity',
            'other': 'Other'
        };

        vm.getUserDocuments = function(){
            if(vm.token) {
                $scope.loadingUserDocuments = true;
                var filtersObj = {
                    orderby: 'created',
                    user: vm.uuid
                }
                Rehive.admin.users.documents.get({filters: filtersObj}).then(function (res) {
                    $scope.loadingUserDocuments = false;
                    $scope.userDocuments = res.results; 
                    $scope.userDocuments.forEach(function(userDocument){
                        userDocument.document_category = vm.documentCategorySlugsOptionsObj[userDocument.document_category];
                        userDocument.document_type = vm.documentTypeSlugOptionsObj[userDocument.document_type];
                        userDocument.hasExpired = false;
                        if(userDocument.expires){
                            var timeDiff = new Date().getTime() - userDocument.expires;
                            userDocument.hasExpired = timeDiff > 0 && Math.floor(timeDiff/(1000*60*60*24)) > 0;
                            userDocument.expires = $filter('date')(userDocument.expires,'MMM d, y');
                        } else {
                            userDocument.expires = "--";
                        }
                    });
                    
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserDocuments = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserDocuments();

        $scope.openUserDocumentModal = function (page, document) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                controller: 'UserDocumentModalCtrl',
                windowClass: 'document-modal-window',
                scope: $scope,
                resolve: {
                    document: function () {
                        return document;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(successObj){
                if(successObj.success){
                    vm.getUserDocuments();
                }
                if(!successObj.dontReload){
                    $window.location.reload();
                }
            }, function(){
            });
        };

        $scope.openAddUserDocumentModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserDocumentModalCtrl',
                scope: $scope,
                resolve: {
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theAddModal.result.then(function(){
                vm.getUserDocuments();
            }, function(){
            });
        };



    }
})();
