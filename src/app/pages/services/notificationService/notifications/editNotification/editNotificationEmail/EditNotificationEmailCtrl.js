(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotification.email')
        .controller('EditNotificationEmailCtrl', EditNotificationEmailCtrl);

    /** @ngInject */
    function EditNotificationEmailCtrl($scope,$http,localStorageManagement,notificationHtmlTags,extensionsHelper,$state,
                                       $uibModal,$filter,errorHandler,$location,$stateParams,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        vm.updatedNotification = {};
        $scope.loadingNotifications = true;
        $scope.editNotification = {
            enabled: false,
            preference_enabled: false
        };
        $scope.htmlTags = {
            tags: []
        };
        $scope.editorEnabled= false;

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

        $scope.eventOptions = ['','User Create','User Update','User Password Reset','User Password Set',
            'User Email Verify','User Email Create','User Email Update', 'User MFA SMS Verify',
            'User Mobile Verify','User Mobile Create','User Mobile Update', 
            'Address Create','Address Update','Document Create',
            'Document Update', 'Bank Account Create','Bank Account Update','Crypto Account Create',
            'Crypto Account Update', 'Transaction Create','Transaction Update','Transaction Delete',
            'Transaction Initiate','Transaction Execute'];
        $scope.eventOptions.sort();
        
        $scope.editNotificationEditorOptions = {
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

        $scope.enableEditor = function() {
            //used to refresh the codemirror element to display latest ng-model
            $scope.editorEnabled = true;
        };

        vm.getSingleNotification = function () {
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/notifications/' + $stateParams.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingNotifications =  false;
                    if (res.status === 200 || res.status === 201) {
                        var notificationObj = res.data.data;
                        if(notificationObj.event){
                            notificationObj.event = $filter('capitalizeDottedSentence')(notificationObj.event);
                            notificationObj.event = $filter('capitalizeUnderscoredSentence')(notificationObj.event);
                        }

                        $scope.editNotification = {
                            id: notificationObj.id,
                            name: notificationObj.name,
                            description: notificationObj.description,
                            subject: notificationObj.subject,
                            event: notificationObj.event,
                            html_message: notificationObj.html_message,
                            text_message: notificationObj.text_message,
                            to_email: notificationObj.to_email,
                            expression: notificationObj.expression,
                            enabled: notificationObj.enabled,
                            preference_enabled: notificationObj.preference_enabled
                        };
                        $scope.enableEditor();
                        $scope.emailEditEventOptionChanged(notificationObj.event);
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.emailEditEventOptionChanged = function (event) {
            var newTagsArray = notificationHtmlTags.getNotificationHtmlTags(event);
            $scope.htmlTags.tags.splice(0,$scope.htmlTags.tags.length);
            newTagsArray.forEach(function (element) {
                $scope.htmlTags.tags.push(element);
            });
        };

        $scope.goToNotificationListView = function () {
            // $location.path('/services/notifications/list');
            $location.path('/extensions/notifications/list');
        };

        $scope.notificationChanged = function (field) {
            if($scope.editNotification.expression && $scope.editNotification.expression.length > 250){
                toastr.error('Expression cannot exceed 250 characters');
            }

            // if(field == 'name'){
            //     $scope.editNotification.name = $scope.editNotification.name.toLowerCase();
            // }
            if(field == 'event'){
                $scope.emailEditEventOptionChanged($scope.editNotification.event);
            }

            vm.updatedNotification[field] = $scope.editNotification[field];
        };

        $scope.updateNotification = function (option) {
            $scope.loadingNotifications =  true;
            if(vm.updatedNotification.event){
                var event = vm.updatedNotification.event.toUpperCase();
                event = event.replace(/ /g, '_');
                vm.updatedNotification.event = vm.eventOptionsObj[event];
            }

            vm.updatedNotification.type = 'email';

            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/notifications/' + $scope.editNotification.id + '/',vm.updatedNotification, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Notification updated successfully');
                        if(option){
                            $scope.loadingNotifications =  false;
                            if(option == 'add'){ $state.go('notificationService.createNotification.email', {}, {reload: true}) ;}
                        }
                        else {
                            // $location.path('/services/notifications/list');
                            $location.path('/extensions/notifications/list');
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditHtmlPreviewModal = function (page, size, htmlPreview) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditHtmlMessagePreviewModalCtrl',
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

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.getSingleNotification();
            })
            .catch(function(err){
                $scope.loadingNotifications = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
