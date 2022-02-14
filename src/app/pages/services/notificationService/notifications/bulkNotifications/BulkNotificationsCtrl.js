(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.bulkNotifications')
        .controller('BulkNotificationsCtrl', BulkNotificationsCtrl);

    /** @ngInject */
    function BulkNotificationsCtrl($scope,$http,localStorageManagement,_,errorHandler,$location,toastr,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        $scope.allBulkNotifications = {
            emailBulkEnabled : false,
            smsBulkEnabled : false
        };
        $scope.addingBulkNotification = true;
        $scope.bulkEmailEventOptions = [];
        $scope.bulkSmsEventOptions = [];

        $scope.getEmailTemplate = function () {
            $http.get(vm.baseUrl + 'admin/templates/?type=email&page_size=250', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.bulkEmailEventOptions = res.data.data.results;
                    $scope.getSmsTemplate();
                }
            }).catch(function (error) {
                $scope.addingBulkNotification = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };        

        $scope.getSmsTemplate = function () {
            $scope.addingBulkNotification = true;
            $http.get(vm.baseUrl + 'admin/templates/?type=sms&page_size=250', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.addingBulkNotification = false;
                    $scope.bulkSmsEventOptions = res.data.data.results;
                }
            }).catch(function (error) {
                $scope.addingBulkNotification = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.toggleAllBulkNotificationsStatus = function (bulkArray,type) {
            bulkArray.forEach(function (notif) {
                if(type == 'email'){
                    if($scope.allBulkNotifications.emailBulkEnabled){
                        notif.enabled = true;
                    } else{
                        notif.enabled = false;
                    }
                } else {
                    if($scope.allBulkNotifications.smsBulkEnabled){
                        notif.enabled = true;
                    } else{
                        notif.enabled = false;
                    }
                }
            });
        };

        $scope.bulkSmsEventChanged = function () {
            var smsEnabledCount = 0;
            $scope.bulkSmsEventOptions.forEach(function (notif) {
                if(notif.enabled){
                    smsEnabledCount = smsEnabledCount + 1;
                }
            });
            if(smsEnabledCount == $scope.bulkSmsEventOptions.length){
                $scope.allBulkNotifications.smsBulkEnabled = true;
            } else {
                $scope.allBulkNotifications.smsBulkEnabled = false;
            }
        };

        $scope.bulkEmailEventChanged = function () {
            var emailEnabledCount = 0;
            $scope.bulkEmailEventOptions.forEach(function (notif) {
                if(notif.enabled){
                    emailEnabledCount = emailEnabledCount + 1;
                }
            });
            if(emailEnabledCount == $scope.bulkEmailEventOptions.length){
                $scope.allBulkNotifications.emailBulkEnabled = true;
            } else {
                $scope.allBulkNotifications.emailBulkEnabled = false;
            }
        };

        $scope.findEnabledNotifications = function () {
            var enabledEmailEventsArray =[];
            var enabledSmsEventsArray =[];

            $scope.bulkEmailEventOptions.forEach(function (emailNotif,index,arr) {
                if(emailNotif.enabled){
                    enabledEmailEventsArray.push(emailNotif);
                }
            });

            $scope.bulkSmsEventOptions.forEach(function (smsNotif,index,arr) {
                if(smsNotif.enabled){
                    enabledSmsEventsArray.push(smsNotif);
                }
            });

            vm.addBulkNotifications(enabledEmailEventsArray,enabledSmsEventsArray);
        };

        vm.addBulkNotifications = function (enabledEmailEventsArray,enabledSmsEventsArray) {

            if(enabledEmailEventsArray.length > 0){
                enabledEmailEventsArray.forEach(function (emailNotif,index,arr) {
                    if(index == (arr.length - 1)){
                        // last email notification
                        if(enabledSmsEventsArray.length > 0){
                            vm.addNotification(emailNotif,null,'email');

                            // iterating over the sms array
                            enabledSmsEventsArray.forEach(function (smsNotif,smsIndex,smsArr) {
                                if(smsIndex == (smsArr.length - 1)){
                                    vm.addNotification(smsNotif,'last','sms');
                                } else {
                                    vm.addNotification(smsNotif,null,'sms');
                                }
                            });
                        } else {
                            vm.addNotification(emailNotif,'last','email');
                        }
                    } else {
                        vm.addNotification(emailNotif,null,'email');
                    }
                });
            } else if(enabledSmsEventsArray.length > 0){
                enabledSmsEventsArray.forEach(function (smsNotif,smsIndex,smsArr) {
                    if(smsIndex == (smsArr.length - 1)){
                        vm.addNotification(smsNotif,'last','sms');
                    } else {
                        vm.addNotification(smsNotif,null,'sms'); 
                    }
                });
            }
        };

        vm.addNotification = function (notification,last,type) {
            var notificationObj = {};

            if(type == 'email'){
                notificationObj = {
                    name: notification.name,
                    description: notification.description,
                    subject: notification.subject,
                    event: notification.event,
                    html_message: notification.html_message,
                    text_message: notification.text_message,
                    to_email: notification.to_email,
                    expression: notification.expression,
                    enabled: notification.enabled,
                    preference_enabled: false,
                    type: 'email'
                };
            } else {
                notificationObj = {
                    name: notification.name,
                    description: notification.description,
                    subject: notification.subject,
                    event: notification.event,
                    sms_message: notification.sms_message,
                    to_mobile: notification.to_mobile,
                    expression: notification.expression,
                    enabled: notification.enabled,
                    preference_enabled: false,
                    type: 'sms'
                };
            }

            $scope.addingBulkNotification =  true;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/notifications/',notificationObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(last){
                            toastr.success('Bulk notifications added successfully');
                            // $location.path('/services/notifications/list');
                            $location.path('/extensions/notifications/list');
                        }
                    }
                }).catch(function (error) {
                    $scope.addingBulkNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goBackListView = function () {
            // $location.path('/services/notifications/list');
            $location.path('/extensions/notifications/list');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.getEmailTemplate();
            })
            .catch(function(err){
                $scope.addingBulkNotification = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
