(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.companySettings')
        .controller('CompanySettingsCtrl', CompanySettingsCtrl);

    /** @ngInject */
    function CompanySettingsCtrl($ngConfirm, $scope,Rehive,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.companyImageUrl = "/assets/img/app/placeholders/hex_grey.svg";
        $scope.loadingCompanySettings = true;
        $scope.company = {
            details : {
                settings: {}
            }
        };
        vm.updatedCompanySettings = {};
        vm.updatedCompanySettings = {
            settings: {}
        };
        $scope.companySettingsObj = {};
        $scope.statusOptions = ['Pending','Complete'];
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT').toLowerCase();
        $scope.companyDateFormat = ['mm/dd/yyyy','dd/mm/yyyy'];

        $scope.companyDateFormatChanged = function (companyDateFormatString) {
            var string;
            if(companyDateFormatString == 'mm/dd/yyyy'){
                string = 'MM/dd/yyyy';
            } else {
                string = 'dd/MM/yyyy';
            }

            localStorageManagement.setValue('DATE_FORMAT',string);
        };

        vm.getCompanySettings = function () {
            if(vm.token) {
                $scope.loadingCompanySettings = true;
                Rehive.admin.company.get().then(function (res) {
                    $scope.loadingCompanySettings = false;
                    $scope.company.details = res;
                    $scope.companySettingsObj = $scope.company.details.settings;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanySettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanySettings();

        $scope.toggleCompanySettings = function (groupSetting,type) {

            var updatedSetting = {};

            if(type == 'default_transaction_status' || type == 'default_session_duration'){
                updatedSetting[type] = groupSetting;
            } else {
                updatedSetting[type] = !groupSetting;
            }

            if(vm.token) {
                Rehive.admin.company.settings.update(updatedSetting).then(function (res) {
                    $scope.companySettingsObj = {};
                    $scope.companySettingsObj = res;
                    toastr.success("Company setting successfully updated");
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.loadingCompanyNotifications = true;

        vm.getCompanyNotifications = function () {
            if(vm.token) {
                $scope.loadingCompanyNotifications = true;
                Rehive.admin.notifications.get().then(function (res) {
                    $scope.loadingCompanyNotifications = false;
                    $scope.notifications = res;
                    $scope.notifications.forEach(function(notification){
                        if(notification.description == "Account password reset notifications"){
                            notification.description = "Send password set/reset notifications";
                        }
                        else if(notification.description == "Account verification notifications"){
                            notification.description = "Send email/mobile verification notifications";
                        }
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanyNotifications = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyNotifications();

        $scope.toggleNotificationEnabled = function(notification){
            if(notification.description == "Send password set/reset notifications" && notification.enabled){
                $ngConfirm({
                    title: 'Warning',
                    content: "You are about to disable sending password set/reset notifications to users. " +
                        "Unless you have added custom emails in the <a href='/#/services/notifications'>Notifications Service</a>, manually added-users" +
                        " will not be able to set their password and no users will be able to set their password. " +
                        "Are you sure you want to continue?",
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: $scope,
                    buttons: {
                        close: {
                            text: "No",
                            btnClass: 'btn-default pull-left dashboard-btn'
                        },
                        ok: {
                            text: "Disable",
                            btnClass: 'btn-danger dashboard-btn',
                            keys: ['enter'], // will trigger when enter is pressed
                            action: function(scope){
                                notification.enabled = !notification.enabled;
                                $scope.saveNotifications(notification);
                            }
                        }
                    }
                });
            }
            else if(notification.description == "Send email/mobile verification notifications" && notification.enabled){
                $ngConfirm({
                    title: 'Warning',
                    content: "You are about to disable sending email/mobile verification notifications to users. " +
                        "Unless you have added custom emails in the <a href='/#/services/notifications'>Notifications Service</a>, users will not be able " +
                        "to verify their email addresses or mobile numbers. Are you sure you want to continue?",
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: $scope,
                    buttons: {
                        close: {
                            text: "No",
                            btnClass: 'btn-default pull-left dashboard-btn'
                        },
                        ok: {
                            text: "Disable",
                            btnClass: 'btn-danger dashboard-btn',
                            keys: ['enter'], // will trigger when enter is pressed
                            action: function(scope){
                                notification.enabled = !notification.enabled;
                                $scope.saveNotifications(notification);
                            }
                        }
                    }
                });
            }
            else {
                notification.enabled = !notification.enabled;
                $scope.saveNotifications(notification);
            }
        };

        $scope.saveNotifications = function(notification){
            $scope.loadingCompanyNotifications = true;
            Rehive.admin.notifications.update(notification.id, {enabled: notification.enabled}).then(function (res) {
                $scope.loadingCompanyNotifications = false;
                toastr.success('You have successfully updated the notification');
                $scope.$apply();
            }, function (error) {
                $scope.loadingCompanyNotifications = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
