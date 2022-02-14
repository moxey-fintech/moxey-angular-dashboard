(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification.push')
        .controller('CreateNotificationPushCtrl', CreateNotificationPushCtrl);

    /** @ngInject */
    function CreateNotificationPushCtrl($scope,$http,localStorageManagement,$location,errorHandler,$state,
                                       notificationHtmlTags,toastr,$filter,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        $scope.addingPushNotification =  true;
        $scope.selectedNotifType = 'push';
        $scope.pushNotificationParams = {
            enabled: true,
            preference_enabled: false,
            event: '',
            template: ''
        };
        $scope.expressionPlaceholder = "e.g. {{id}} or {{user.id}}"
        $scope.pushTags = {
            tags: []
        };

        vm.pushEventOptionsObj = {
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

        $scope.pushTemplateOptions = [];
        $scope.pushEventOptions = ['','User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Email Create','User Email Update',
            'User Mobile Verify','User Mobile Create','User Mobile Update', 'User MFA SMS Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];

        $scope.pushEventOptions.sort();

        $scope.switchCreateNotificationView = function(type){
            if(type === 'sms'){
                $state.go('notificationService.createNotification.sms', {}, {reload: true});
            } else if (type === 'email'){
                $state.go('notificationService.createNotification.email', {}, {reload: true});
            } else if (type ==='push'){
                $state.go('notificationService.createNotification.push', {}, {reload: true});
            }
        };

        $scope.editorPushOptions = {
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

        $scope.pushExpressionChanged = function () {
            if($scope.pushNotificationParams.pushExpression.length > 250){
                toastr.error('Expression cannot exceed 250 characters');
            }
        };

        $scope.pushEventOptionChanged = function (event) {
            var newTagsArray = notificationHtmlTags.getNotificationHtmlTags(event);
            $scope.pushTags.tags.splice(0,$scope.pushTags.tags.length);
            newTagsArray.forEach(function (element) {
                $scope.pushTags.tags.push(element);
            });
        };

        $scope.getPushTemplateOptions = function () {
            
            $http.get(vm.baseUrl + 'admin/templates/?type=push&page_size=250', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.addingPushNotification =  false;
                    $scope.pushTemplateOptions = res.data.data.results;
                    $scope.pushTemplateOptions.unshift({name: 'No template selected'});
                    $scope.pushNotificationParams.template = $scope.pushTemplateOptions[0];
                }
            }).catch(function (error) {
                $scope.addingPushNotification =  false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };        

        $scope.pushTemplateOptionChanged = function (template) {
            if(template.id){
                $http.get(vm.baseUrl + 'admin/templates/' + template.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        var templateObj = res.data.data;

                        $scope.pushTemplateOptions.forEach(function (template,index) {
                            if(template.name == templateObj.name){
                                var notifEvent = $filter('capitalizeDottedSentence')(templateObj.event);
                                $scope.pushNotificationParams = {
                                    template: $scope.pushTemplateOptions[index],
                                    name: templateObj.name,
                                    description: templateObj.description,
                                    subject: templateObj.subject,
                                    event: notifEvent === 'MFA SMS Verify' ? 'User MFA SMS Verify' : notifEvent,
                                    push_message: templateObj.push_message,
                                    to_user: templateObj.to_user,
                                    pushExpression: templateObj.expression,
                                    enabled: true,
                                    preference_enabled: false
                                };
                            }
                        });
                    }
                }).catch(function (error) {
                    $scope.addingPushNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                $scope.pushNotificationParams = {
                    enabled: false,
                    preference_enabled: false,
                    event: '',
                    template: ''
                };
            }
        };

        $scope.addPushNotification = function (option) {
            if($scope.pushNotificationParams.event){
                var event;
                event = $scope.pushNotificationParams.event.toUpperCase();
                event = event.replace(/ /g, '_');
                $scope.pushNotificationParams.event = vm.pushEventOptionsObj[event];
            }

            $scope.pushNotificationParams.type = 'push';

            var pushNotifName = $scope.pushNotificationParams.name.toLowerCase();
            pushNotifName = pushNotifName.charAt(0).toUpperCase() + pushNotifName.substring(1, pushNotifName.length);

            var pushNotificationObj = {
                name: pushNotifName,
                description: $scope.pushNotificationParams.description,
                subject: $scope.pushNotificationParams.subject,
                event: $scope.pushNotificationParams.event,
                push_message: $scope.pushNotificationParams.push_message,
                to_user: $scope.pushNotificationParams.to_user,
                expression: $scope.pushNotificationParams.pushExpression,
                enabled: $scope.pushNotificationParams.enabled,
                preference_enabled: $scope.pushNotificationParams.preference_enabled,
                type: $scope.pushNotificationParams.type
            };

            $scope.addingPushNotification =  true;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/notifications/',pushNotificationObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Notification added successfully');
                        if(option){
                            $scope.addingPushNotification =  false;
                            if(option == 'add'){ $state.go('notificationService.createNotification.push', {}, {reload: true}) ;}
                            else{ $location.path('/extensions/notifications/' + res.data.data.id + '/edit/push'); }
                        }
                        else {
                            // $location.path('/services/notifications/list').search({type: 'push'});
                            $location.path('/extensions/notifications/list').search({type: 'push'});
                        }
                    }
                }).catch(function (error) {
                    $scope.addingPushNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToPushListView = function () {
            // $location.path('/services/notifications/list').search({type: 'push'});
            $location.path('/extensions/notifications/list').search({type: 'push'});
        };

        vm.getCompanyDetails = function () {
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    // $scope.company = res.data.data;
                    var pushEnabled = res.data.data.push_enabled !== undefined ? res.data.data.push_enabled : false;
                    if(pushEnabled){
                        $scope.getPushTemplateOptions();
                    } else {
                        toastr.error("Push notifications are not activated for company");
                        $location.path('/extensions/notifications/list');
                    }
                    
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.getCompanyDetails();
            })
            .catch(function(err){
                $scope.addingPushNotification = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
