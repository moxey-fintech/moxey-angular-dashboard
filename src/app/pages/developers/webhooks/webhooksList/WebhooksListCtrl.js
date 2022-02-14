(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.list')
        .controller('WebhooksListCtrl', WebhooksListCtrl);

    /** @ngInject */

    function WebhooksListCtrl($scope,Rehive,$uibModal,serializeFiltersService,$filter,
                              $location,localStorageManagement,errorHandler,$window,$state) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = localStorageManagement.getValue('token');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedWebhooksListFilters = vm.companyIdentifier + 'webhooksListFilters';
        $scope.initialLoad = true;
        $scope.loadingWebhooks = true;
        $scope.filtersCount = 0;
        $scope.showingFilters = false;
        $scope.webhookList = [];
        $scope.webhooksSectionedList = {};

        $scope.eventOptions = ['User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Email Create','User Email Update',
            'User Mobile Verify','User Mobile Create','User Mobile Update', 'User Mfa Sms Verify',
            'Address Create','Address Update','Document Create','Document Update', 'Bank Account Create','Bank Account Update',
            'Crypto Account Create','Crypto Account Update','Transaction Create','Transaction Update','Transaction Delete',
            'Transaction Initiate','Transaction Execute'];

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

        var location = $location.path();
        var locationArray = location.split('/');

        $scope.locationIndicator = locationArray[(locationArray.length -1)];

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            eventFilter: false,
            urlFilter: false,
            secretFilter: false
        };

        $scope.applyFiltersObj = {
            eventFilter: {
                selectedEventOption: ''
            },
            urlFilter: {
                selectedUrlOption: ''
            },
            secretFilter: {
                selectedSecretOption: ''
            }
        };
        
        $scope.getServiceSize = function(service){
            var size = 0, key;
            for(key in service){
                if(service.hasOwnProperty(key)){
                    ++size;
                }
            }
            return size;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                eventFilter: false,
                urlFilter: false,
                secretFilter: false
            };
            $scope.showFilters();
            $scope.getWebhooks('applyfilter');
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        vm.getWebhooksFiltersObj = function(){
            $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};

            if($scope.initialLoad) {
                $scope.initialLoad = false;
                if (localStorageManagement.getValue(vm.savedWebhooksListFilters)) {
                    filterObjects = JSON.parse(localStorageManagement.getValue(vm.savedWebhooksListFilters));

                    $scope.filtersObj = filterObjects.filtersObj;

                    $scope.applyFiltersObj = {
                        eventFilter: {
                            selectedEventOption: filterObjects.applyFiltersObj.eventFilter.selectedEventOption
                        },
                        urlFilter: {
                            selectedUrlOption: filterObjects.applyFiltersObj.urlFilter.selectedUrlOption
                        },
                        secretFilter: {
                            selectedSecretOption: filterObjects.applyFiltersObj.secretFilter.selectedSecretOption
                        }
                    };
                    searchObj = filterObjects.searchObj;

                } else {
                    searchObj = {
                        page: 1,
                        page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25
                    };
                }
            } else {

                searchObj = {
                    page: $scope.pagination.pageNo,
                    page_size: $scope.pagination.itemsPerPage || 25,
                    event: $scope.filtersObj.eventFilter ? event : null,
                    url: $scope.filtersObj.urlFilter ? $scope.applyFiltersObj.urlFilter.selectedUrlOption : null,
                    secret: $scope.filtersObj.secretFilter ? $scope.applyFiltersObj.secretFilter.selectedSecretOption : null
                };

                vm.saveWebhooksListFiltersToLocalStorage({
                    searchObj: serializeFiltersService.objectFilters(searchObj),
                    filtersObj: $scope.filtersObj,
                    applyFiltersObj: $scope.applyFiltersObj
                });
            }

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            return serializeFiltersService.objectFilters(searchObj);
        };

        vm.saveWebhooksListFiltersToLocalStorage = function (filterObjects) {
            localStorageManagement.setValue(vm.savedWebhooksListFilters,JSON.stringify(filterObjects));
        };

        vm.getCorrectedWebhookEvent = function(event){
            var correctedEvent = "";
            switch(event){
                case 'email.create': 
                    correctedEvent = 'user.email.create';
                    break; 
                case 'email.update':
                    correctedEvent = 'user.email.update';
                    break;
                case 'mobile.create':
                    correctedEvent = 'user.mobile.create';
                    break;
                case 'mobile.update':
                    correctedEvent = 'user.mobile.update';
                    break;
                case 'mfa.sms.verify':
                    correctedEvent = 'user.mfa.sms.verify';
                    break;
                default: 
                    correctedEvent = event;
            }
            return correctedEvent;
        };

        vm.formatWebhooksList = function(webhookList){
            $scope.webhooksSectionedList = {};
            $scope.webhooksSectionedList = {
                bitcoin: {
                    name: "Bitcoin Service"
                },
                bitcoin_testnet: {
                    name: "Bitcoin-testnet Service"
                },
                conversion: {
                    name: "Conversion Service"
                },
                ethereum: {
                    name: "Ethereum Service"
                },
                exchange: {
                    name: "Exchange Service"
                },
                miscellaneous: {
                    name: "Miscellaneous webhooks"
                },
                notification: {
                    name: "Notification Service"
                },
                product: {
                    name: "Product Service"
                },
                reward: {
                    name: "Reward Service"
                },
                stellar: {
                    name: "Stellar Service"
                },
                stellar_testnet: {
                    name: "Stellar-testnet Service"
                }
            };

            if(!webhookList || !webhookList.length){return;}

            webhookList.forEach(function(webhook){
                var service = webhook.url.split('/')[2].split('.')[0].replace(/-/, '_');
                webhook.event = vm.getCorrectedWebhookEvent(webhook.event);
                var event = webhook.event.split('.')[0];
                webhook.event = $filter('capitalizeUnderscoredSentence')($filter('capitalizeDottedSentence')(webhook.event));
                if(!$scope.webhooksSectionedList[service]){
                    service = "miscellaneous";
                }

                if(!$scope.webhooksSectionedList[service][event]){
                    $scope.webhooksSectionedList[service][event]= {
                        records: []
                    };
                }

                // if(!$scope.webhooksSectionedList[service].name){
                //     $scope.webhooksSectionedList[service].name = service.charAt(0).toUpperCase() + service.substr(1) + " Service";
                // }

                if(!$scope.webhooksSectionedList[service][event].name){
                    $scope.webhooksSectionedList[service][event].name = event.charAt(0).toUpperCase() + event.substr(1);
                    $scope.webhooksSectionedList[service][event].name = $scope.webhooksSectionedList[service][event].name.replace(/_/g, ' ');
                }
                if(webhook.event.indexOf('Mfa') > -1){
                    webhook.event = webhook.event.replace(/Mfa/g, 'MFA');
                    webhook.event = webhook.event.replace(/Sms/g, 'SMS');
                }
                $scope.webhooksSectionedList[service][event].records.push(webhook);
            });
        };

        $scope.getWebhooks = function (applyFilter) {
            if(vm.token) {

                $scope.showingFilters = false;
                $scope.loadingWebhooks = true;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }

                if ($scope.webhookList.length > 0) {
                    $scope.webhookList.length = 0;
                }

                var webhooksFiltersObj = vm.getWebhooksFiltersObj();

                Rehive.admin.webhooks.get({filters: webhooksFiltersObj}).then(function (res) {
                    $scope.loadingWebhooks = false;
                    $scope.webhooksData = res;
                    $scope.webhookList = res.results;
                    $window.scrollTo(0, 0);
                    $scope.$apply();
                    vm.formatWebhooksList($scope.webhookList);
                }, function (error) {
                    $scope.loadingWebhooks = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getWebhooks();

        $scope.openCreateWebhookModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddWebhookModalCtrl',
                scope: $scope,
                resolve: {
                    webhookUrl: function () {
                        return $state.params.webhookUrl || '';
                    },
                    secret: function () {
                        return $state.params.secret || '';
                    }
                }
            });

            vm.theModal.result.then(function(webhook){
                if(webhook){
                    $scope.getWebhooks();
                }
            }, function(){
            });
        };

        $scope.openEditWebhookModal = function (page, size,webhook) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditWebhookModalCtrl',
                scope: $scope,
                resolve: {
                    webhook: function () {
                        return webhook;
                    }
                }
            });

            vm.theModal.result.then(function(webhook){
                if(webhook){
                    $scope.getWebhooks();
                }
            }, function(){
            });
        };

        $scope.openWebhooksModal = function (page, size,webhook) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'WebhooksModalCtrl',
                scope: $scope,
                resolve: {
                    webhook: function () {
                        return webhook;
                    }
                }
            });

            vm.theModal.result.then(function(webhook){
                if(webhook){
                    $scope.getWebhooks();
                }
            }, function(){
            });
        };

        if($state.params.from == "Notifications"){
            $scope.filtersObj.secretFilter = true;
            $scope.applyFiltersObj.secretFilter.selectedSecretOption = $state.params.secret;
            $scope.getWebhooks('applyFilter');
        } else if($state.params.secret || $state.params.webhookUrl){
            $scope.getWebhooks();
            $scope.openCreateWebhookModal('app/pages/developers/webhooks/webhooksList/addWebhookModal/addWebhookModal.html','md');
        }else{
            $scope.getWebhooks();
        }
    }
})();
