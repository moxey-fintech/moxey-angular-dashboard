(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.createRewardsServiceCampaign')
        .controller('CreateRewardsServiceCampaignsCtrl', CreateRewardsServiceCampaignsCtrl);

    /** @ngInject */
    function CreateRewardsServiceCampaignsCtrl($scope,$rootScope,Rehive,typeaheadService,toastr,_,currencyModifiers,extensionsHelper,builderService,
                                               $http,localStorageManagement,$location,errorHandler,serializeFiltersService,$uibModal,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "rewards_service";
        // vm.serviceUrl = "https://reward.services.rehive.io/api/";
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.currencyOptions = [];
        $scope.addingCampaign =  true;
        $scope.campaignUserEmailForDebitAccount = '';
        $scope.campaignAccountRefForAccount = '';
        $scope.campaignDebitUserAccounts = [];
        $scope.searchDebitAccountBy = 'user';
        $scope.showDebitEmailSearchAccounts = false;
        $scope.showDebitRefSearchAccounts = false;
        $scope.searchDebitAccount = false;
        $scope.searchDebitUser = false;
        $scope.campaignRecipientChosen = 'name';
        $scope.timeframeOptions = ["None", "Daily", "Weekly", "Monthly"];
        $scope.rewardCampaignTemplates = [];
        $scope.newCampaignParams = {
            name: '',
            description: '',
            currency: {},
            startDate: null,
            endDate: null,
            total: null,
            fixedAmount: null,
            rewardPercentage: null,
            account: null,
            amountType: 'Fixed',
            active: true,
            max_per_user: null,
            visible: true,
            type: "claim",
            event: '',
            expression: '',
            event_user: "{{ user.id }}",
            event_amount: null,
            default_status: "accepted",
            groups: [],
            timeframe: "None",
            max_per_user_per_timeframe: null,
            credit_account_name: '',
            credit_account: '',
            template: null
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

        $scope.eventAmountTypeOptions = ['Fixed' , 'Percentage', 'Both'];
        $scope.claimAmountTypeOptions = ['Fixed'];
        $scope.claimSelected = true;

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
        $scope.getGroupsTypeahead = typeaheadService.getGroupsTypeahead();
        $scope.getAccountsReferenceTypeahead = typeaheadService.getAccountsReferenceTypeahead();       

        $scope.enableEditor = function() {
            //used to refresh the codemirror element to display latest ng-model
            $scope.editorEnabled = true;
        };

        $scope.getRewardCampaignTemplates = function(){
            if(vm.token){
                $scope.loadingTemplates = true;
                builderService.getBuilderTemplates({type: 'solution'})
                .then(function(res){
                    if(res.length > 0){
                        res.forEach(function(template){
                            if(template.id === 'rewards_templates'){
                                $scope.rewardCampaignTemplates = template.config.rewards_service.campaigns;
                            }
                        });
                    }
                    $scope.loadingTemplates = false;
                    $scope.$apply();
                })
                .catch(function(err){
                    $scope.loadingTemplates = false;
                    errorHandler.evaluateErrors(err);
                    errorHandler.handleErrors(err);
                    $scope.$apply();
                });
            }
        };

        $scope.mapRewardEvent = function(rewardEvent){
            var mappedEvent = null;
            $scope.eventOptions.forEach(function(event){
                var eventKey = event.toUpperCase().replaceAll(/ /g, '_');
                if(vm.eventOptionsObj[eventKey] === rewardEvent){
                    mappedEvent = event;
                    return false;
                }
            });
            return mappedEvent ? mappedEvent : rewardEvent;
        };

        $scope.setCampaignTemplateParams = function(){
            $scope.newCampaignParams.name = $scope.newCampaignParams.template.name;
            $scope.newCampaignParams.description = $scope.newCampaignParams.template.description;
            $scope.newCampaignParams.active = $scope.newCampaignParams.template.active;
            $scope.newCampaignParams.visible = $scope.newCampaignParams.template.visible;
            $scope.newCampaignParams.default_status = $scope.newCampaignParams.template.default_status;

            $scope.newCampaignParams.amountType = $filter('capitalizeWord')($scope.newCampaignParams.template.type);
            $scope.newCampaignParams.rewardPercentage = $scope.newCampaignParams.template.percentage;
            $scope.newCampaignParams.max_per_user = $scope.newCampaignParams.template.max_per_user;            

            $scope.newCampaignParams.event = $scope.mapRewardEvent($scope.newCampaignParams.template.event);
            $scope.newCampaignParams.event_user = $scope.newCampaignParams.template.event_user;
            $scope.newCampaignParams.event_amount = $scope.newCampaignParams.template.event_amount;
            $scope.newCampaignParams.expression = $scope.newCampaignParams.template.expression;
            $scope.newCampaignParams.type = $scope.newCampaignParams.template.claim ? 'claim' : 'event';
            $scope.setCampaignType($scope.newCampaignParams.type);
            $scope.enableEditor();
        };

        $scope.setCampaignType = function(campaignType){
            $scope.claimSelected = (campaignType === "claim");
        };

        $scope.eventExpressionChanged = function(){
            if($scope.newCampaignParams.expression.length > 150){
                $scope.newCampaignParams.expression = $scope.newCampaignParams.expression.substring(0, 150);
                toastr.error('Expression cannot exceed 150 characters');
            }
        };

        $scope.campaignChanged = function(fieldName){
            if(fieldName === 'credit_account_name'){
                $scope.newCampaignParams.credit_account_name = $scope.newCampaignParams.credit_account_name.toLowerCase();
            }
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                    $scope.currencyOptions = res.results.slice();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        $scope.addCampaign = function (newCampaignParams) {
            // if(moment(newCampaignParams.endDate).isBefore(moment(newCampaignParams.startDate))){
            //     toastr.error('End date cannot be in the past or before start date.');
            //     return;
            // }
            // else if(moment(newCampaignParams.startDate).isBefore(moment().subtract(1,'days'))){
            //     toastr.error('Start date cannot be in the past.');
            //     return;
            // }
            newCampaignParams.timeframe = newCampaignParams.timeframe.toLowerCase();
            var newCampaign = {
                name: newCampaignParams.name,
                description: newCampaignParams.description,
                currency: newCampaignParams.currency.code,
                company: $rootScope.pageTopObj.companyObj.id,
                start_date: null,
                end_date: null,
                total: newCampaignParams.total ? currencyModifiers.convertToCents(newCampaignParams.total,newCampaignParams.currency.divisibility) : null,
                fixed_amount: newCampaignParams.fixedAmount ? currencyModifiers.convertToCents(newCampaignParams.fixedAmount,newCampaignParams.currency.divisibility) : null,
                percentage: newCampaignParams.rewardPercentage ? newCampaignParams.rewardPercentage : null,
                account: (newCampaignParams.account && newCampaignParams.account.reference) ? newCampaignParams.account.reference : null,
                type: newCampaignParams.amountType ? newCampaignParams.amountType.toLowerCase() : null,
                max_per_user: newCampaignParams.max_per_user,
                active: newCampaignParams.active,
                visible: newCampaignParams.visible,
                claim: newCampaignParams.type === "claim",
                event: newCampaignParams.type === "claim" ? null : newCampaignParams.event,
                expression: newCampaignParams.type !== "claim" ? newCampaignParams.expression ? newCampaignParams.expression : null : null,
                event_user: newCampaignParams.type !== "claim" ? newCampaignParams.event_user !== "{{ user.id }}" ? newCampaignParams.event_user : "{{ user.id }}" : null,
                event_amount: newCampaignParams.type !== "claim" ? newCampaignParams.event_amount ? newCampaignParams.event_amount : null : null,
                default_status: newCampaignParams.default_status,
                groups: (_.map(newCampaignParams.groups,'text')),
                users: (_.map(newCampaignParams.users,'text')),
                timeframe: newCampaignParams.timeframe !== 'none' ? newCampaignParams.timeframe: null,
                max_per_user_per_timeframe: newCampaignParams.timeframe !== 'none' ? newCampaignParams.max_per_user_per_timeframe : null,
                credit_account_name: $scope.campaignRecipientChosen == 'name' && (
                    newCampaignParams.credit_account_name && newCampaignParams.credit_account_name !== '') ? newCampaignParams.credit_account_name.toLowerCase().replace(/ /g, '_') : null,
                credit_account: $scope.campaignRecipientChosen == 'reference' && (
                    newCampaignParams.credit_account && newCampaignParams.credit_account !== '') ? newCampaignParams.credit_account : null
            };
            newCampaign.start_date = new Date(newCampaignParams.startDate).getTime();
            newCampaign.end_date = new Date(newCampaignParams.endDate).getTime();

            // if(newCampaignParams.users.length > 0){
            //     newCampaign.users = _.map(newCampaignParams.users,'text');
            // }
            // if(newCampaignParams.groups.length > 0){
            //     newCampaign.groups = _.map(newCampaignParams.groups,'text');
            // }
            // if(newCampaignParams.tags.length > 0){
            //     newCampaign.tags = _.map(newCampaignParams.tags,'text');
            // }

            if(newCampaign.type == "both"){
                newCampaign.type = 'fixedpercentage';
            }

            if(newCampaign.event){
                var event;
                event = newCampaign.event.toUpperCase();
                event = event.replace(/ /g, '_');
                newCampaign.event = vm.eventOptionsObj[event];
            }

            if($scope.campaignRecipientChosen == 'name' && newCampaign.credit_account !== null){
                newCampaign.credit_account = null;
            } else if($scope.campaignRecipientChosen == 'reference' && newCampaign.credit_account_name !== null){
                newCampaign.credit_account_name = null;
            }
            
            newCampaign = serializeFiltersService.objectFilters(newCampaign);
            $scope.addingCampaign =  true;
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/campaigns/',newCampaign, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        toastr.success('Campaign added successfully');
                        // $location.path('/services/rewards/campaigns');
                        $location.path('/extensions/rewards/campaigns');
                    }
                }).catch(function (error) {
                    $scope.addingCampaign =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.getAllAccountsByReference = function(accountReference){
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
                        $scope.newCampaignParams.account = $scope.debitAccountOptions[0];
                    }
                } 
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.getAllAccountsByUser = function(userEmail){
            var filterObj = {
                page_size: 250
            };
            if(userEmail){
                filterObj.user = userEmail;
            }
            
            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.debitAccountOptions = res.results.slice();
                    $scope.campaignDebitUserAccounts = [];
                    $scope.debitAccountOptions.forEach(function(account){
                        if(account.user.email === userEmail){
                            $scope.campaignDebitUserAccounts.push(account);
                        }
                    });
                    if($scope.campaignDebitUserAccounts.length > 0){
                        $scope.showDebitEmailSearchAccounts = true;
                        $scope.searchDebitUser = false;
                        $scope.newCampaignParams.account = $scope.campaignDebitUserAccounts[0];
                    }
                } 
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.debitUserEmailChanging = function(){
            $scope.showDebitEmailSearchAccounts = false;
            $scope.searchDebitUser = false;
        };

        $scope.onDebitUserSelect = function($model){
            $scope.searchDebitUser = true;
            $scope.campaignUserEmailForDebitAccount = $model;
        };

        $scope.triggerSearchByDebitUser = function(){           
            $scope.getAllAccountsByUser($scope.campaignUserEmailForDebitAccount, null);
        };

        $scope.debitReferenceChanging = function(){
            $scope.showDebitRefSearchAccounts = false;
            $scope.searchDebitAccount = false;
        };

        $scope.onDebitReferenceSelect = function($model) {
            $scope.searchDebitAccount = true;
            $scope.campaignAccountRefForAccount = $model;
        };

        $scope.triggerSearchByDebitReference = function(){
            $scope.getAllAccountsByReference($scope.campaignAccountRefForAccount, null);   
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
                        return $scope.campaignUserEmailForDebitAccount;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getAllAccountsByUser($scope.campaignUserEmailForDebitAccount, null);
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
                vm.serviceUrl = serviceUrl;
                vm.getCompanyCurrencies();
                $scope.getRewardCampaignTemplates();
                $scope.addingCampaign = false;
            })
            .catch(function(err){
                console.log(err);
                $scope.addingCampaign = false;
                toastr.error("Extension not activated for company");
                // $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
