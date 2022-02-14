(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification.email')
        .controller('CreateNotificationEmailCtrl', CreateNotificationEmailCtrl);

    /** @ngInject */
    function CreateNotificationEmailCtrl($scope,$http,localStorageManagement,notificationHtmlTags,$state,
                                         $location,extensionsHelper,$uibModal,errorHandler,toastr,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        $scope.addingEmailNotification =  true;
        $scope.selectedNotifType = 'email';
        $scope.pushEnabled = false;
        $scope.emailNotificationParams = {
            enabled: true,
            preference_enabled: false,
            event: '',
            template: ''
        };

        $scope.htmlTags = {
            tags: []
        };

        vm.emailEventOptionsObj = {
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

        $scope.emailTemplateOptions = [];
        $scope.emailEventOptions = ['','User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Email Create','User Email Update',
            'User Mobile Verify','User Mobile Create','User Mobile Update',  'User MFA SMS Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];
        $scope.emailEventOptions.sort();

        $scope.switchCreateNotificationView = function(type){
            if(type === 'sms'){
                $state.go('notificationService.createNotification.sms', {}, {reload: true});
            } else if (type === 'email'){
                $state.go('notificationService.createNotification.email', {}, {reload: true});
            } else if (type ==='push'){
                $state.go('notificationService.createNotification.push', {}, {reload: true});
            }
        };

        $scope.emailExpressionChanged = function () {
            if($scope.emailNotificationParams.expression.length > 250){
                toastr.error('Expression cannot exceed 250 characters');
            }
        };

        $scope.emailEventOptionChanged = function (event) {
            var newTagsArray = notificationHtmlTags.getNotificationHtmlTags(event);
            $scope.htmlTags.tags.splice(0,$scope.htmlTags.tags.length);
            newTagsArray.forEach(function (element) {
                $scope.htmlTags.tags.push(element);
            });
        };

        $scope.getEmailTemplateOptions = function () {
            // $scope.addingEmailNotification =  true;
            $http.get(vm.baseUrl + 'admin/templates/?type=email&page_size=250', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.addingEmailNotification =  false;
                    $scope.emailTemplateOptions = res.data.data.results;
                    $scope.emailTemplateOptions.unshift({name: 'No template selected'});
                    $scope.emailNotificationParams.template = $scope.emailTemplateOptions[0];
                }
            }).catch(function (error) {
                $scope.addingEmailNotification =  false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };        

        $scope.emailTemplateOptionChanged = function (template) {
            if(template.id){
                $http.get(vm.baseUrl + 'admin/templates/' + template.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        var templateObj = res.data.data;

                        $scope.emailTemplateOptions.forEach(function (template,index) {
                            if(template.name == templateObj.name){
                                $scope.emailNotificationParams = {
                                    template: $scope.emailTemplateOptions[index],
                                    name: templateObj.name,
                                    description: templateObj.description,
                                    subject: templateObj.subject,
                                    event: $filter('capitalizeDottedSentence')(templateObj.event),
                                    html_message: templateObj.html_message,
                                    text_message: templateObj.text_message,
                                    to_email: templateObj.to_email,
                                    expression: templateObj.expression,
                                    enabled: true,
                                    preference_enabled: false
                                };
                            }
                        });
                    }
                }).catch(function (error) {
                    $scope.addingEmailNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                $scope.emailNotificationParams = {
                    enabled: false,
                    preference_enabled: false,
                    event: '',
                    template: ''
                };
            }
        };

        $scope.addEmailNotification = function (option) {
            if($scope.emailNotificationParams.event){
                var event;
                event = $scope.emailNotificationParams.event.toUpperCase();
                event = event.replace(/ /g, '_');
                $scope.emailNotificationParams.event = vm.emailEventOptionsObj[event];
            }

            $scope.emailNotificationParams.type = 'email';
            
            var emailNotifName = $scope.emailNotificationParams.name.toLowerCase();
            emailNotifName = emailNotifName.charAt(0).toUpperCase() + emailNotifName.substring(1, emailNotifName.length);

            var emailNotificationObj = {
                name: emailNotifName,
                description: $scope.emailNotificationParams.description,
                subject: $scope.emailNotificationParams.subject,
                event: $scope.emailNotificationParams.event,
                html_message: $scope.emailNotificationParams.html_message,
                text_message: $scope.emailNotificationParams.text_message,
                to_email: $scope.emailNotificationParams.to_email,
                expression: $scope.emailNotificationParams.expression,
                enabled: $scope.emailNotificationParams.enabled,
                preference_enabled: $scope.emailNotificationParams.preference_enabled,
                type: $scope.emailNotificationParams.type
            };
            
            $scope.addingEmailNotification =  true;
            // return;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/notifications/',emailNotificationObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Notification added successfully');
                        if(option){
                            $scope.addingEmailNotification =  false;
                            if(option == 'add'){ $state.go('notificationService.createNotification.email', {}, {reload: true}) ;}
                            else{ $location.path('/extensions/notifications/' + res.data.data.id + '/edit/email'); }
                        }
                        else {
                            // $location.path('/services/notifications/list').search({type: 'email'});
                            $location.path('/extensions/notifications/list').search({type: 'email'});
                        }
                    }
                }).catch(function (error) {zzz
                    $scope.addingEmailNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openHtmlPreviewModal = function (page, size, htmlPreview) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'HtmlMessagePreviewModalCtrl',
                scope: $scope,
                resolve: {
                    htmlPreview: function () {
                        return htmlPreview;
                    }
                }
            });

            vm.theModal.result.then(function(){
            }, function(){
            });
        };

        $scope.goToEmailListView = function () {
            // $location.path('/services/notifications/list').search({type: 'email'});
            $location.path('/extensions/notifications/list').search({type: 'email'});
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
                    $scope.pushEnabled = res.data.data.push_enabled !== undefined ? res.data.data.push_enabled : false;
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
                $scope.getEmailTemplateOptions();
                vm.getCompanyDetails();
            })
            .catch(function(err){
                $scope.addingEmailNotification =  true;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
