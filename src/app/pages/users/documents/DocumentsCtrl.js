(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.documents')
        .controller('DocumentsCtrl', DocumentsCtrl);

    /** @ngInject */
    function DocumentsCtrl($rootScope,$state,Rehive,$scope,typeaheadService,$location,$uibModal,multiOptionsFilterService,currenciesList,
                       localStorageManagement,errorHandler,$window,toastr,serializeFiltersService,$filter,$intercom,$http,environmentConfig) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $rootScope.dashboardTitle = 'Users | Moxey';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        vm.savedGroupColors = [];
        vm.companyColors = localStorageManagement.getValue('companyIdentifier') + "_group_colors";
        $scope.documentsStateMessage = '';
        $scope.documents = [];
        $scope.documentsData = {};
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
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
            'other': 'Other',
            'generic_proof_of_address': 'Generic Proof Of Address',
            'generic_proof_of_identity': 'Generic Proof Of Identity',
            'generic_advanced_proof_of_identity': 'Generic Advanced Proof Of Identity'
        };

        vm.documentCategorySlugsOptionsObj = {
            'proof_of_income': 'Proof Of Income',
            'proof_of_address': 'Proof Of Address',
            'proof_of_identity': 'Proof Of Identity',
            'advanced_proof_of_identity': 'Advanced Proof Of Identity',
            'other': 'Other'
        };
        $scope.documentStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        $scope.currencyOptions = [];
        $scope.filtersCount = 0;
        $scope.initialLoad = true;
        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.headerColumns = [
            {colName: 'Type',fieldName: 'document_type',visible: true},
            {colName: 'Category',fieldName: 'document_category',visible: true},
            {colName: 'Status',fieldName: 'status',visible: true},
            {colName: 'Date Created',fieldName: 'formatted_created',visible: true},
            {colName: 'Date updated',fieldName: 'formatted_updated',visible: true},
            {colName: 'Note',fieldName: 'note',visible: true}
        ];

        $scope.filtersObj = {
            statusFilter: false,
            pageSizeFilter: false
        };

        $scope.applyFiltersObj = {
            statusFilter: {
                selectedStatus: 'Pending'
            },
            paginationFilter: {
                itemsPerPage: 25,
                pageNo: 1,
                maxSize: 5
            },
        };
        
        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
            // $scope.showingColumnFilters = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                statusFilter: false,
                pageSizeFilter: false
            };
            $scope.showFilters();
            $scope.getAllDocuments('applyfilter');
        };        

        $scope.pageSizeChanged =  function () {
            if($scope.applyFiltersObj.paginationFilter.itemsPerPage > 250){
                $scope.applyFiltersObj.paginationFilter.itemsPerPage = 250;
            }
        };

        vm.getDocumentFiltersObj = function(){
            $scope.filtersCount = 0;
            var searchObj = {};
            searchObj = {
                orderby: 'created',
                page: $scope.applyFiltersObj.paginationFilter.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter ? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatus.toLowerCase() : null
            };

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }
    
            return serializeFiltersService.objectFilters(searchObj);
        };

        vm.getAllDocumentsApiCall = function (documentsFiltersObj) {
            Rehive.admin.users.documents.get({filters: documentsFiltersObj}).then(function (res) {
                $scope.documentsData = res;                
                vm.formatDocumentsArray(res.results);
                $scope.documentsStateMessage = $scope.documents.length == 0 ? 'No documents have been found' : '';
                $scope.loadingUsers = false;
                $scope.$apply();
            }, function (error) {
                $scope.loadingUsers = false;
                $scope.documentsStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.getAllDocuments = function(applyFilter){
            $scope.documentsStateMessage = '';
            $scope.loadingUsers = true;
            $scope.showingFilters = false;
            var documentsFiltersObj = {};

            if(applyFilter){
                $scope.applyFiltersObj.paginationFilter.pageNo = 1;
            }

            if($scope.documents.length > 0 ){
                $scope.documents.length = 0;
            }

            documentsFiltersObj = vm.getDocumentFiltersObj();
            vm.getAllDocumentsApiCall(documentsFiltersObj);
        };

        vm.formatDocumentsArray = function (documentsArray) {
            documentsArray.forEach(function (document) {
                document.document_category = vm.documentCategorySlugsOptionsObj[document.document_category];
                document.document_type = vm.documentTypeSlugOptionsObj[document.document_type];
                document.hasExpired = false;
                if(document.expires){
                    var timeDiff = new Date().getTime() - document.expires;
                    document.hasExpired = timeDiff > 0 && Math.floor(timeDiff/(1000*60*60*24)) > 0;
                    document.expires = $filter('date')(document.expires,'MMM d, y');
                } else {
                    document.expires = "--";
                }
                $scope.documents.push(document);
            });
            $scope.$apply();
        };

        if($state.params.status){
            $scope.filtersObj.statusFilter = true;
            $scope.applyFiltersObj.statusFilter.selectedStatus = $state.params.status;
            $scope.getAllDocuments('applyFilter');
        } else {
            $scope.getAllDocuments(null);
        }

        $scope.openViewDocumentModal = function (page, document) {
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
                        return document.user.id;
                    }
                }
            });

            vm.theModal.result.then(function(successObj){
                if(successObj.success){
                    $scope.getAllDocuments('applyFilter');
                }
            }, function(){
            });
        };
    }
})();
