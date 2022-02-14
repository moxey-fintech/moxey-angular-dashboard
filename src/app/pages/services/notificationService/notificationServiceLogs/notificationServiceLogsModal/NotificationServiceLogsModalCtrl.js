(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceLogs')
        .controller('NotificationServiceLogsModalCtrl', NotificationServiceLogsModalCtrl);

    /** @ngInject */
    function NotificationServiceLogsModalCtrl($scope,log,$sce) {
        $scope.log = log;
        $scope.html_message = $sce.trustAsHtml($scope.log.html_message);

    }
})();
