(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.editRewardsServiceCampaign')
        .controller('EditRewardsServiceCampaignsCtrl', EditRewardsServiceCampaignsCtrl);

    /** @ngInject */
    function EditRewardsServiceCampaignsCtrl($scope,$stateParams,Rehive,typeaheadService,toastr,_,$filter,extensionsHelper,$uibModal,
                                             $http,localStorageManagement,$location,errorHandler,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "rewards_service";
        // vm.baseUrl = "https://reward.services.rehive.io/api/";
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.campaignId = $stateParams.campaignId;
        $scope.currencyOptions = [];
        $scope.updatingCampaign =  true;
        $scope.editCampaignParams = {};
        $scope.campaignDebitUserEmailForAccount = '';
        $scope.campaignReferencefForDebitAccount = '';
        $scope.campaignDebitUserAccounts = [];
        $scope.searchDebitAccountBy = 'user';
        $scope.showDebitEmailSearchAccounts = false;
        $scope.showDebitRefSearchAccounts = false;
        $scope.showAdvancedOptions = false;
        vm.updatedCampaignObj = {};
        $scope.eventAmountTypeOptions = ['Fixed' , 'Percentage', 'Both'];
        $scope.claimAmountTypeOptions = ['Fixed'];
        $scope.editorEnabled= false;
        $scope.campaignRecipientChosen = 'name';
        $scope.timeframeOptions = ["None", "Daily", "Weekly", "Monthly"];
        vm.eventOptionsObj = {
            USER_CREATE: 'user.create',
            USER_UPDATE: 'user.update',
            USER_PASSWORD_RESET: 'user.password.reset',
            USER_PASSWORD_SET: 'user.password.set',
            USER_EMAIL_VERIFY: 'user.email.verify',
            USER_EMAIL_CREATE: 'email.create',
            USER_EMAIL_UPDATE: 'email.update',
            USER_MOBILE_VERIFY: 'user.mobile.verify',
            USER_MOBILE_CREATE: 'mobile.create',
            USER_MOBILE_UPDATE: 'mobile.update',
            USER_MFA_SMS_VERIFY: 'mfa.sms.verify',
            ADDRESS_CREATE: 'address.create',
            ADDRESS_UPDATE: 'address.update',
            DOCUMENT_CREATE: 'document.create',
            DOCUMENT_UPDATE: 'document.update',
            BANK_ACCOUNT_CREATE: 'bank_account.create',
            BANK_ACCOUNT_UPDATE: 'bank_account.update',
            CRYPTO_ACCOUNT_CREATE: 'crypto_account.create',
            CRYPTO_ACCOUNT_UPDATE: 'crypto_account.update',
            TRANSACTION_CREATE: 'transaction.create',
            TRANSACTION_UPDATE: 'transaction.update',
            TRANSACTION_DELETE: 'transaction.delete',
            TRANSACTION_INITIATE: 'transaction.initiate',
            TRANSACTION_EXECUTE: 'transaction.execute'
        };

        $scope.eventOptions = ['','User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Email Create','User Email Update',
            'User Mobile Verify','User Mobile Create','User Mobile Update',  'User Mfa Sms Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = $scope.companyDateFormatString;
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup2 = {};
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getAccountsReferenceTypeahead = typeaheadService.getAccountsReferenceTypeahead();
        $scope.getGroupsTypeahead = typeaheadService.getGroupsTypeahead();
        
        $scope.setCampaignType = function(campaignType){
            $scope.claimSelected = (campaignType === "claim");
        };

        $scope.editorEmailOptions = {
            lineWrapping : true,
            lineNumbers: true,
            theme: 'monokai',
            autoCloseTags: true,
            smartIndent: false,
            extraKeys: {
                "Ctrl-Space": "autocomplete"
            },
            mode: 'xml'
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.updatingCampaign = true;
                Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.currencyOptions = res.results.slice();
                        // $scope.getAllAccountsByUser();
                        $scope.getCampaign();
                        $scope.$apply();
                    } else {
                        // $scope.getAllAccountsByUser();
                        $scope.getCampaign();
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.updatingCampaign = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };        

        $scope.enableEditor = function() {
            //used to refresh the codemirror element to display latest ng-model
            $scope.editorEnabled = true;
        };

        $scope.getCampaign = function () {
            if(vm.token) {
                $scope.updatingCampaign = true;
                $http.get(vm.baseUrl + 'admin/campaigns/' + vm.campaignId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var editObj = {};
                    editObj = res.data.data;
                    $scope.currencyOptions.forEach(function (element) {
                        if(element.code == editObj.currency.code){
                            editObj.currency = element;
                            editObj.start_date = moment(editObj.start_date).toDate();
                            editObj.end_date = moment(editObj.end_date).toDate();
                            editObj.total = currencyModifiers.convertFromCents(editObj.total,editObj.currency.divisibility);
                            editObj.percentage = $filter('capitalizeWord')(editObj.type) == 'Percentage' || $filter('capitalizeWord')(editObj.type) !== 'Both' ? editObj.percentage : null;
                            editObj.fixed_amount = $filter('capitalizeWord')(editObj.type) == 'Fixed' || $filter('capitalizeWord')(editObj.type) !== 'Both' ? currencyModifiers.convertFromCents(editObj.fixed_amount,editObj.currency.divisibility) : null;
                            editObj.type = $filter('capitalizeWord')(editObj.type) == 'Fixed' ? 'Fixed' :
                                $filter('capitalizeWord')(editObj.type) == 'Percentage' ? 'Percentage' : 'Both';
                            editObj.default_status = editObj.default_status ? editObj.default_status : "accepted";
                            editObj.timeframe = editObj.timeframe ? $filter('capitalizeWord')(editObj.timeframe) : "None";
                            editObj.max_per_user_per_timeframe = editObj.max_per_user_per_timeframe ? editObj.max_per_user_per_timeframe : null;
                            $scope.campaignRecipientChosen = editObj.credit_account ? "reference" : "name";
                            if(editObj.claim){
                                $scope.claimSelected = true;
                                editObj.reward_type = "claim";
                                editObj.expression = '';
                                editObj.event_user = "{{ user.id }}";
                                editObj.event_amount = null;
                                editObj.event = '';
                            } else {
                                $scope.claimSelected = false;
                                editObj.reward_type = "event";
                                editObj.expression = editObj.expression ? editObj.expression : '';
                                editObj.event_user = editObj.event_user ? editObj.event_user : "{{ user.id }}";
                                editObj.event_amount = editObj.event_amount ? editObj.event_amount : null;
                                if(editObj.event == 'email.create' || editObj.event == 'email.update' || editObj.event == 'mobile.create' || editObj.event == 'mobile.update'){
                                    editObj.event = 'user.' + editObj.event;
                                }
                                editObj.event = $filter('capitalizeDottedSentence')(editObj.event);
                                editObj.event = $filter('capitalizeUnderscoredSentence')(editObj.event);
                            }

                            editObj.active = editObj.active;
                            editObj.groups = editObj.groups ? editObj.groups : [];
                            editObj.users = editObj.users ? editObj.users : [];
                            if(editObj.account){
                                Rehive.admin.accounts.get({reference: editObj.account}).then(function (res) {
                                    editObj.account = res;
                                    $scope.editCampaignParams = editObj;
                                    if($scope.editCampaignParams.account.user){
                                        $scope.campaignReferencefForDebitAccount = '';
                                        $scope.campaignDebitUserEmailForAccount = $scope.editCampaignParams.account.user.email;
                                        $scope.searchDebitAccountBy = 'user';
                                        $scope.getAllAccountsByUser($scope.campaignDebitUserEmailForAccount, "fromCampaign");
                                    } else {
                                        $scope.campaignDebitUserEmailForAccount = '';
                                        $scope.campaignReferencefForDebitAccount = $scope.editCampaignParams.account.reference;
                                        $scope.searchDebitAccountBy = 'reference';
                                        $scope.getAllAccountsByReference($scope.campaignReferencefForDebitAccount, "fromCampaign");
                                    }                                    
                                    $scope.$apply();
                                }, function (error) {
                                    $scope.updatingCampaign =  false;
                                    errorHandler.evaluateErrors(error);
                                    errorHandler.handleErrors(error);
                                    $scope.$apply();
                                });

                            } else {
                                $scope.editCampaignParams = editObj;
                                $scope.updatingCampaign =  false;
                                $scope.enableEditor();
                            }
                        }
                    });
                }).catch(function (error) {
                    $scope.updatingCampaign =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.campaignChanged = function(field){
            if(field === 'credit_account_name'){
                $scope.editCampaignParams.credit_account_name = $scope.editCampaignParams.credit_account_name.toLowerCase().replace(/ /g, '_');
            }
            vm.updatedCampaignObj[field] = $scope.editCampaignParams[field];
            if(field === "expression"){
                if($scope.editCampaignParams.expression.length > 150){
                    $scope.editCampaignParams.expression = $scope.editCampaignParams.expression.substring(0, 150);
                    toastr.error('Expression cannot exceed 150 characters');
                }
            }
        };

        $scope.updateCampaign = function () {
            $scope.editorEnabled = false;

            // if(moment(vm.updatedCampaignObj.end_date).isBefore(moment(vm.updatedCampaignObj.start_date))){
            //     toastr.error('End date cannot be in the past or before start date.');
            //     return;
            // }

            if(vm.updatedCampaignObj.start_date){
                vm.updatedCampaignObj.start_date = new Date(vm.updatedCampaignObj.start_date).getTime();
            }
            if(vm.updatedCampaignObj.end_date){
                vm.updatedCampaignObj.end_date = new Date(vm.updatedCampaignObj.end_date).getTime();
            }
            if(vm.updatedCampaignObj.currency && vm.updatedCampaignObj.currency.code){
                vm.updatedCampaignObj.currency = vm.updatedCampaignObj.currency.code;
            }
            if(vm.updatedCampaignObj.total){
                vm.updatedCampaignObj.total = currencyModifiers.convertToCents(vm.updatedCampaignObj.total,$scope.editCampaignParams.currency.divisibility);
                vm.updatedCampaignObj.currency = $scope.editCampaignParams.currency.code;
            }
            if(vm.updatedCampaignObj.fixed_amount){
                vm.updatedCampaignObj.fixed_amount = currencyModifiers.convertToCents(vm.updatedCampaignObj.fixed_amount,$scope.editCampaignParams.currency.divisibility);
                vm.updatedCampaignObj.currency = $scope.editCampaignParams.currency.code;
            }
            if(vm.updatedCampaignObj.percentage){
                vm.updatedCampaignObj.percentage = vm.updatedCampaignObj.percentage ? vm.updatedCampaignObj.percentage : null;
                vm.updatedCampaignObj.currency = $scope.editCampaignParams.currency.code;
            }
            if(vm.updatedCampaignObj.type){
                vm.updatedCampaignObj.type = vm.updatedCampaignObj.type.toLowerCase();
                if(vm.updatedCampaignObj.type == 'both'){
                    vm.updatedCampaignObj.type = 'fixedpercentage';
                }
            }
            if(vm.updatedCampaignObj.account && vm.updatedCampaignObj.account.reference){
                vm.updatedCampaignObj.account = vm.updatedCampaignObj.account.reference;
            }
            if(vm.updatedCampaignObj.users){
                vm.updatedCampaignObj.users = (_.map(vm.updatedCampaignObj.users,'text'));
            }
            if(vm.updatedCampaignObj.groups){
                vm.updatedCampaignObj.groups = (_.map(vm.updatedCampaignObj.groups,'text'));
            }

            if(vm.updatedCampaignObj.timeframe){
                if(vm.updatedCampaignObj.timeframe !== 'None'){
                    vm.updatedCampaignObj.timeframe = vm.updatedCampaignObj.timeframe.toLowerCase();
                    vm.updatedCampaignObj.max_per_user_per_timeframe = vm.updatedCampaignObj.max_per_user_per_timeframe ? vm.updatedCampaignObj.max_per_user_per_timeframe : (
                        $scope.editCampaignParams.max_per_user_per_timeframe ? $scope.editCampaignParams.max_per_user_per_timeframe : null
                    );
                } else {
                    vm.updatedCampaignObj.timeframe = null;
                    vm.updatedCampaignObj.max_per_user_per_timeframe = null;
                }
            }

            if(vm.updatedCampaignObj.credit_account_name){
                vm.updatedCampaignObj.credit_account_name = vm.updatedCampaignObj.credit_account_name.toLowerCase().replace(/ /g, '_');
            }

            if($scope.campaignRecipientChosen == 'name' && vm.updatedCampaignObj.credit_account !== null){
                vm.updatedCampaignObj.credit_account = null;
            } else if($scope.campaignRecipientChosen == 'reference' && vm.updatedCampaignObj.credit_account_name !== null){
                vm.updatedCampaignObj.credit_account_name = null;
            }
            
            if(vm.updatedCampaignObj.reward_type){
                if(vm.updatedCampaignObj.reward_type === "claim"){
                    vm.updatedCampaignObj.claim = true;
                    vm.updatedCampaignObj.event = '';
                    vm.updatedCampaignObj.event_user = '';
                    vm.updatedCampaignObj.event_amount = null;
                    vm.updatedCampaignObj.expression = '';
                } else if(vm.updatedCampaignObj.reward_type === "event"){
                    vm.updatedCampaignObj.claim = false;
                    vm.updatedCampaignObj.event_user = $scope.editCampaignParams.event_user;
                    vm.updatedCampaignObj.event_amount = $scope.editCampaignParams.event_amount;
                    vm.updatedCampaignObj.expression = $scope.editCampaignParams.expression;
                    if(vm.updatedCampaignObj.event){
                        var event = vm.updatedCampaignObj.event.toUpperCase().replace(/ /g, '_');
                        vm.updatedCampaignObj.event = vm.eventOptionsObj[event];
                    }
                }
            } 
            else if(vm.updatedCampaignObj.event){
                var event = vm.updatedCampaignObj.event.toUpperCase().replace(/ /g, '_');
                vm.updatedCampaignObj.event = vm.eventOptionsObj[event];
            }

            $scope.updatingCampaign =  true;
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/campaigns/' + $scope.editCampaignParams.id + '/',vm.updatedCampaignObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Campaign updated successfully');
                        $scope.getCampaign();
                    }
                }).catch(function (error) {
                    $scope.updatingCampaign =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.getAllAccountsByReference = function(accountReference, fromCampaign){
            var filterObj = {
                page_size: 250
            };
            if(accountReference){
                filterObj.reference = accountReference;
            } 
            
            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.debitAccountOptions = res.results.slice();

                    if($scope.debitAccountOptions.length > 0){
                        $scope.showDebitRefSearchAccounts = true;
                        $scope.searchDebitAccount = false;
                        $scope.editCampaignParams.account = $scope.debitAccountOptions.find(function(account){
                            return account.reference === accountReference;
                        });
                    }
                    if(fromCampaign){
                        $scope.updatingCampaign =  false;
                    } else {
                        $scope.campaignChanged('account');
                    }
                } 

                $scope.enableEditor();
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.getAllAccountsByUser = function(userEmail, fromCampaign){
            var filterObj = {
                page_size: 250
            };
            if(userEmail){
                filterObj.user = userEmail;
            } 
            
            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                $scope.campaignDebitUserAccounts = [];
                if(res.results.length > 0){
                    $scope.debitAccountOptions = res.results.slice();
                    if(userEmail){
                        $scope.debitAccountOptions.forEach(function(account){
                            if(account.user.email === $scope.campaignDebitUserEmailForAccount){
                                $scope.campaignDebitUserAccounts.push(account);
                            }
                        });
                    } 
                    if($scope.campaignDebitUserAccounts.length > 0){
                        $scope.showDebitEmailSearchAccounts = true;
                        $scope.searchDebitUser = false;
                        $scope.editCampaignParams.account = $scope.campaignDebitUserAccounts.find(function(account){
                            return account.reference === $scope.editCampaignParams.account.reference;
                        });
                    } 

                    if(fromCampaign){
                        $scope.updatingCampaign =  false;
                    }
                } else {
                    $scope.showDebitEmailSearchAccounts = true;
                    $scope.searchDebitUser = false;
                }

                $scope.enableEditor();
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.debitEmailChanging = function(){
            $scope.showDebitEmailSearchAccounts = false;
            $scope.searchDebitUser = false;
        };

        $scope.onDebitUserSelect = function($model){
            $scope.searchDebitUser = true;
            $scope.campaignDebitUserEmailForAccount = $model;
        };

        $scope.triggerSearchByDebitUser = function(){       
            $scope.getAllAccountsByUser($scope.campaignDebitUserEmailForAccount, null);
        };

        $scope.debitReferenceChanging = function(){
            $scope.showDebitRefSearchAccounts = false;
            $scope.searchDebitAccount = false;
        };

        $scope.onDebitReferenceSelect = function($model) {
            $scope.searchDebitAccount = true;
            $scope.campaignReferencefForDebitAccount = $model;
        };

        $scope.triggerSearchByDebitReference = function(){
            $scope.getAllAccountsByReference($scope.campaignReferencefForDebitAccount, null);
        };

        $scope.openAddAccountModal = function(page, size, userEmail) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NewAccountModalCtrl',
                scope: $scope,
                resolve: {
                    userEmail: function() {
                        return userEmail;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getAllAccountsByUser(userEmail, null);
                }
            }, function(){
            });
        };

        $scope.goToCampaignListView = function () {
            // $location.path('/services/rewards/campaigns');
            $location.path('/extensions/rewards/campaigns');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.getCompanyCurrencies();                
            })
            .catch(function(err){
                $scope.updatingCampaign = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
