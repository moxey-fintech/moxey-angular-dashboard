(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserDocumentModalCtrl', UserDocumentModalCtrl);

    function UserDocumentModalCtrl($scope,Rehive,$uibModalInstance,document,toastr,$filter,uuid,$window,typeaheadService,
                                   $uibModal,localStorageManagement,errorHandler,metadataTextService,resourcesList,serializeFiltersService) {

        var vm = this;
        vm.uuid = uuid;
        vm.updatedDocument = {};
        vm.addressTracking = {};
        vm.token = localStorageManagement.getValue('token');
        $scope.pdfSelected = false;
        $scope.rehiveContextData = {
            full_document: false,
            image_quality: false,
            color_document: false
        };
        $scope.documentView = '';
        $scope.document = {};
        $scope.metadataExists = false;
        $scope.updatingDocument = false;
        $scope.showingDocumentFile = true;
        $scope.documentHasExpired = false;
        $scope.userIsUnder18 = false;
        $scope.userDisplayName = '';
        $scope.defaultImageUrl = "/assets/img/app/placeholders/hex_grey.svg";
        $scope.documentStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        $scope.documentTypeOptions = ['Utility Bill','Bank Statement','Lease Or Rental Agreement',
            'Municipal Rate and Taxes Invoice','Mortgage Statement','Telephone or Cellular Account','Insurance Policy Document',
            'Statement of Account Issued by a Retail Store','Government Issued ID','Passport','Drivers License','Payslip','Employment Letter',
            'Financial Statement','ID Confirmation Photo','Other','Generic Proof Of Address','Generic Proof Of Identity','Generic Advanced Proof Of Identity'];

        $scope.documentTypeOptions = $scope.documentTypeOptions.sort();

        $scope.displayTab = function(tab){
            $scope.documentView = tab;
        };
        $scope.displayTab('document');

        $scope.documentTypeOptionsObj = {
            'Utility Bill': 'utility_bill',
            'Bank Statement': 'bank_statement',
            'Lease Or Rental Agreement': 'lease_or_rental_agreement',
            'Municipal Rate and Taxes Invoice': 'municipal_rate_and_taxes',
            'Mortgage Statement': 'mortgage_statement',
            'Telephone or Cellular Account': 'telephone',
            'Insurance Policy Document': 'insurance_policy',
            'Statement of Account Issued by a Retail Store': 'retail_store',
            'Government Issued ID': 'government_id',
            'Passport': 'passport',
            'Drivers License': 'drivers_license',
            'ID Confirmation Photo': 'id_confirmation',
            'Payslip': 'payslip',
            'Employment Letter': 'employment_letter',
            'Financial Statement': 'financial_statement',
            'Generic Proof Of Address': 'generic_proof_of_address',
            'Generic Proof Of Identity': 'generic_proof_of_identity',
            'Generic Advanced Proof Of Identity': 'generic_advanced_proof_of_identity',
            'Other': 'other'
        };

        $scope.documentTypeSlugOptionsObj = {
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

        $scope.documentCategorySlugsOptionsObj = {
            'proof_of_income': 'Proof Of Income',
            'proof_of_address': 'Proof Of Address',
            'proof_of_identity': 'Proof Of Identity',
            'advanced_proof_of_identity': 'Advanced Proof Of Identity',
            'other': 'Other'
        };
        $scope.imageNotFinishedLoading = false;

        vm.getUserAddress = function(){
            if(vm.token){
                $scope.updatingDocument = true;
                Rehive.admin.users.addresses.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.updatingDocument = false;
                    $scope.userAddresses = res.results;
                    $scope.userAddresses.forEach(function(address){
                        address.type = $filter('capitalizeWord')(address.type);
                        address.status = $filter('capitalizeWord')(address.status);
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingDocument = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        vm.getUser = function(){
            if(vm.token){
                $scope.updatingDocument = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.user = res;
                    if($scope.user.birth_date){
                        $scope.userIsUnder18 = moment().diff($scope.user.birth_date, 'years') < 18;
                    }
                    $scope.userInfo = {
                        status: $filter('capitalizeWord')($scope.user.status)
                    };
                    
                    if(!$scope.userAddresses || $scope.userAddresses === undefined){
                        vm.getUserAddress();
                    } else {
                        $scope.updatingDocument = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingDocument = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        }; 

        vm.getUserDocument = function () {
            if(vm.token){
                $scope.updatingDocument = true;
                Rehive.admin.users.documents.get({ id: document.id }).then(function (res) {
                    $scope.document = res;   
                    if($scope.document.file){
                        $scope.pdfSelected = $scope.document.file.endsWith('.pdf');
                    }
                    //checking metadata exists & has issuance
                    var documentIssuance = null;
                    if($scope.document.metadata && Object.keys($scope.document.metadata).length == 0){
                        $scope.metadataExists = false;
                    } else {
                        $scope.metadataExists = true;
                        $scope.rehiveContextData = {
                            full_document: $scope.document.metadata.rehive_context && $scope.document.metadata.rehive_context.full_document ? $scope.document.metadata.rehive_context.full_document : false,
                            image_quality: $scope.document.metadata.rehive_context && $scope.document.metadata.rehive_context.image_quality ? $scope.document.metadata.rehive_context.image_quality : false,
                            color_document: $scope.document.metadata.rehive_context && $scope.document.metadata.rehive_context.color_document ? $scope.document.metadata.rehive_context.color_document : false
                        };
                        if($scope.document.document_category === 'proof_of_identity' && $scope.document.metadata.issuance !== undefined){
                            documentIssuance = $scope.document.metadata.issuance;
                        }
                    }
                    if(typeof document.metadata == 'string'){
                        try{
                            document.metadata = JSON.parse(res.metadata);
                        } catch(err) {
                            document.metadata = {metadata: res.metadata};
                        }
                    }
                    // replacing slugs with labels:
                    $scope.document.document_category = $scope.documentCategorySlugsOptionsObj[$scope.document.document_category];
                    $scope.document.document_type = $scope.documentTypeSlugOptionsObj[$scope.document.document_type];

                    $scope.document.created = $filter('date')($scope.document.created,'MMM d, y');
                    if($scope.document.expires){
                        var timeDiff = new Date().getTime() - $scope.document.expires;
                        $scope.documentHasExpired = timeDiff > 0 && Math.floor(timeDiff/(1000*60*60*24)) > 0;
                        // $scope.documentHasExpired = (new Date().getDay() - new Date($scope.document.expires).getDay()) > 0;
                        $scope.document.expires = $filter('date')($scope.document.expires,'MMM d, y');
                    } else {
                        $scope.document.expires = '--'; 
                    }
                    
                    $scope.editDocument = {
                        file: {},
                        issuance: documentIssuance,
                        document_type: document.document_type,
                        document_category: document.document_category,
                        status: $filter('capitalizeWord')(document.status),
                        note: document.note,
                        // metadata: document.metadata
                        metadata: $scope.document.metadata,
                        formatted_metadata: metadataTextService.convertToText($scope.document.metadata)
                    };
                    $scope.updatingDocument = false;
                    if(!$scope.user || $scope.user === undefined){ vm.getUser(); }
                    else {
                        if($scope.user.birth_date){
                            $scope.userIsUnder18 = moment().diff($scope.user.birth_date, 'years') < 18;
                        }
                        $scope.userInfo = {
                            status: $filter('capitalizeWord')($scope.user.status)
                        };
                        if(!$scope.userAddresses || $scope.userAddresses === undefined){ vm.getUserAddress(); }
                        else {
                            $scope.userAddresses.forEach(function (element) {
                                element.status = $filter('capitalizeWord')(element.status);
                            });                            
                        }
                    }  

                    $scope.getRequestLogs();                 
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingDocument = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserDocument();

        $scope.viewUser = function(){
            $window.open('/#/user/' + $scope.user.id + '/details','_blank');
        }

        $scope.kycDocumentSelected = function (field) {
            $scope.showingDocumentFile = false;
            $scope.documentChanged(field);
        };

        $scope.documentChanged = function (field) {
            if(field === 'full_document' || field === 'image_quality' || field === 'color_document'){
                if(vm.updatedDocument.metadata === undefined){ vm.updatedDocument.metadata = JSON.parse(JSON.stringify($scope.editDocument.metadata)); }
                if(vm.updatedDocument.metadata.rehive_context === undefined){ vm.updatedDocument.metadata.rehive_context = {}; }
                vm.updatedDocument.metadata.rehive_context = $scope.rehiveContextData;
            } else {
                vm.updatedDocument[field] = $scope.editDocument[field];
            }
        };

        $scope.updateDocument = function () {
            $scope.updatingDocument = true;
            vm.updatedDocument.status ? vm.updatedDocument.status = vm.updatedDocument.status.toLowerCase() : '';
            if(vm.updatedDocument.metadata !== undefined) {
                try {
                    vm.updatedDocument.metadata = JSON.stringify(vm.updatedDocument.metadata);
                } catch (e){
                    vm.updatedDocument.metadata = $scope.editDocument.metadata;
                    if(vm.updatedDocument.metadata.rehive_context === undefined){ vm.updatedDocument.metadata.rehive_context = {}; }
                    vm.updatedDocument.metadata.rehive_context = $scope.rehiveContextData;
                    vm.updatedDocument.metadata = JSON.stringify(vm.updatedDocument.metadata);
                }
            }
            if(vm.updatedDocument['document_type']){
                vm.updatedDocument['document_type'] = $scope.documentTypeOptionsObj[vm.updatedDocument['document_type']];
            }

            var fileSelected = vm.updatedDocument.file,
                formData = new FormData();

            if(fileSelected) {
                formData.append('file', fileSelected);
                delete vm.updatedDocument.file;
            }

            for (var key in vm.updatedDocument) {
                if (vm.updatedDocument[key]) {
                    formData.append(key, vm.updatedDocument[key]);
                }
            }
            Rehive.admin.users.documents.update($scope.document.id, formData).then(function (res) {
                toastr.success('Document successfully updated');
                if($scope.document.document_category == 'Proof Of Address'){
                    $scope.executeUpdateUserAddressFromDocumentModal();
                    $scope.$apply();
                } else {
                    $scope.updatingDocument = false;
                    $uibModalInstance.close({success: true, dontReload: true});
                    $scope.$apply();
                }
            }, function (error) {
                $scope.updatingDocument = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.restoreDocument = function () {
            $scope.updatingDocument = true;

            var formData = new FormData();

            formData.append('archived', false);

            Rehive.admin.users.documents.update($scope.document.id, formData).then(function (res) {
                $scope.updatingDocument = false;
                $uibModalInstance.close({success: true, dontReload: true});
                $scope.$apply();
            }, function (error) {
                $scope.updatingDocument = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.updateUserBasicInfoFromDocumentModal = function(){
            if(vm.token) {
                var formData = new FormData();

                formData.append('status', $scope.userInfo.status.toLowerCase());

                Rehive.admin.users.update(vm.uuid, formData).then(function (res) {
                    $scope.updatingDocument = false;
                    $uibModalInstance.close({success: true, dontReload: true});
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.addressStatusTracking = function (address) {
            vm.addressTracking[address.id] = address.status;
        };

        $scope.executeUpdateUserAddressFromDocumentModal = function () {
            var objectLength = Object.keys(vm.addressTracking).length,
                count = 0;

            if(objectLength > 0){
                for(var key in vm.addressTracking){
                    if((count + 1) == objectLength){
                        $scope.updateUserAddressFromDocumentModal(key,vm.addressTracking[key],'last');
                    } else {
                        $scope.updateUserAddressFromDocumentModal(key,vm.addressTracking[key]);
                    }
                    count = count + 1;
                }
            } else {
                $scope.updatingDocument = false;
                $uibModalInstance.close({success: true, dontReload: true});
            }
        };

        $scope.updateUserAddressFromDocumentModal = function(id,status,last){
            if(vm.token) {
                Rehive.admin.users.addresses.update(id,{
                    status: status.toLowerCase()
                }).then(function (res) {
                    if(last){
                        $scope.updatingDocument = false;
                        $uibModalInstance.close({success: true, dontReload: true});
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openDeleteUserDocumentModal = function (page, size) {
            vm.theDeleteModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteDocumentModalCtrl',
                scope: $scope,
                resolve: {
                    document: function () {
                        return $scope.document;
                    }
                }
            });

            vm.theDeleteModal.result.then(function(successObj){
                if(successObj.success){
                    $uibModalInstance.close(successObj);
                } else {
                    vm.getUserDocument();
                }
            }, function(){
            });
        };

        //#region Document logs
        $scope.requestLogs = [];
        $scope.loadingRequestLogs = false;
        $scope.showingFilters = false;
        $scope.filtersCount = 0;
        $scope.initialLoad = true;
        $scope.resourceTypeObj = resourcesList.getResourceTypesObj();

        $scope.showRequestLogsFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.methodsAllowed = {
            get: false,
            post: false,
            patch: false,
            // put: false,
            delete: false
        };

        $scope.filtersObj = {
            methodFilter: false,
            pathFilter: false,
            contentTypeFilter: false,
            statusCodeFilter: false
        };

        $scope.applyFiltersObj = {
            methodFilter: {
                selectedMethods: []
            },
            pathFilter: {
                selectedPath: null
            },
            contentTypeFilter: {
                selectedContentType: null
            },
            statusCodeFilter: {
                selectedStatusCode: null
            }
        };

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.updateMethodsRequested = function(){
            $scope.applyFiltersObj.methodFilter.selectedMethods = [];
            for(var method in $scope.methodsAllowed){
                if($scope.methodsAllowed[method]){
                    $scope.applyFiltersObj.methodFilter.selectedMethods.push(method.toUpperCase());
                    if(method === 'patch'){
                        $scope.applyFiltersObj.methodFilter.selectedMethods.push("PUT");
                    }
                }
            }
        };
        
        vm.initializeMethodFilters = function(){
            $scope.methodsAllowed = {
                get: false,
                post: true,
                patch: true,
                put: true,
                delete: true
            };            
        };

        vm.getRequestLogsFiltersObj = function(){
            $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};
            if(!$scope.filtersObj.methodFilter){
                vm.initializeMethodFilters();
            }
            $scope.updateMethodsRequested();
            searchObj = {
                page: $scope.pagination.pageNo || 1,
                page_size: $scope.pagination.itemsPerPage || 25,
                resource_id: $scope.document.id,
                resource: 'document',
                path: $scope.filtersObj.pathFilter ? ($scope.applyFiltersObj.pathFilter.selectedPath ? $scope.applyFiltersObj.pathFilter.selectedPath : null): null,
                method__in: $scope.applyFiltersObj.methodFilter.selectedMethods.join(','),
                content_type: $scope.filtersObj.contentTypeFilter ? ($scope.applyFiltersObj.contentTypeFilter.selectedContentType ? $scope.applyFiltersObj.contentTypeFilter.selectedContentType : null): null,
                status_code: $scope.filtersObj.statusCodeFilter ? ($scope.applyFiltersObj.statusCodeFilter.selectedStatusCode ? $scope.applyFiltersObj.statusCodeFilter.selectedStatusCode : null): null,
                orderby: '-created'
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

        $scope.getRequestLogs = function (applyFilter) {
            if(vm.token) {
                $scope.loadingRequestLogs = true;
                $scope.showingFilters = false;
                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }
                if ($scope.requestLogs.length > 0) {
                    $scope.requestLogs.length = 0;
                }
                var requestLogsFiltersObj = vm.getRequestLogsFiltersObj();

                Rehive.admin.requests.get({filters: requestLogsFiltersObj}).then(function (res) {
                    $scope.userLogsData = res;
                    vm.formatRequestLogsArray($scope.userLogsData.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingRequestLogs = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.formatRequestLogsArray = function (documentLogsArray) {
            documentLogsArray.forEach(function (requestLogObj,index,array) {
                var userDisplayName = ((requestLogObj.user.first_name && requestLogObj.user.first_name !== "") ? 
                requestLogObj.user.first_name : '');
                userDisplayName += userDisplayName !== '' ? ' ' : '';
                userDisplayName += ((requestLogObj.user.last_name && requestLogObj.user.last_name !== "") ? 
                requestLogObj.user.last_name : '');
                if(userDisplayName === ''){
                    userDisplayName = requestLogObj.user.email ? requestLogObj.user.email : "User " + requestLogObj.user.id;
                }
                var requestLog = {
                    id: requestLogObj.id,
                    user: requestLogObj.user.email || requestLogObj.user.mobile,
                    key: requestLogObj.key,
                    scheme: requestLogObj.scheme,
                    path: requestLogObj.path,
                    method: requestLogObj.method,
                    content_type: requestLogObj.content_type,
                    resource_type: $scope.resourceTypeObj[requestLogObj.resource] !== undefined ? $filter("formatUnderscoreToWhitespacedFilter")($scope.resourceTypeObj[requestLogObj.resource].toLowerCase()) : requestLogObj.resource,
                    status_code: requestLogObj.status_code,
                    created_date: $filter("date")(requestLogObj.created,'mediumDate') + ' ' + $filter("date")(requestLogObj.created,'shortTime'),
                    updated_date: $filter("date")(requestLogObj.updated,'mediumDate') + ' ' + $filter("date")(requestLogObj.updated,'shortTime')
                };
                var documentType = requestLogObj.resource == 'document' && requestLogObj.method == 'POST' 
                && requestLogObj.body.document_type ? $filter("formatUnderscoreToWhitespacedFilter")(requestLogObj.body.document_type) : null;
                requestLog.request_action = resourcesList.getFormattedRequestAction(userDisplayName, requestLog.method, requestLog.path, requestLog.status_code, requestLog.resource_type, documentType);
                requestLog.failed_request = (!requestLog.status_code || requestLog.status_code === 200 || requestLog.status_code === 201) ? false : true;
                requestLog.request_action = requestLog.request_action
                                            .replaceAll(/added a/g, "added the")
                                            .replaceAll(/edited a/g, "edited the")
                                            .replaceAll(/viewed a/g, "viewed the");
                $scope.requestLogs.push(requestLog);
            });
            
            $scope.loadingRequestLogs = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                methodFilter: false,
                pathFilter: false,
                contentTypeFilter: false,
                statusCodeFilter: false
            };
            $scope.showRequestLogsFilters();
            $scope.getRequestLogs('applyfilter');
        };

        $scope.goToRequestLog = function (page,size,log) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'RequestLogModalCtrl',
                scope: $scope,
                resolve: {
                    log: function () {
                        return log;
                    }
                }
            });
        };

        $scope.closeColumnFiltersBox = function () {
            $scope.showingColumnFilters = false;
        };
        //#endregion

    }
})();
