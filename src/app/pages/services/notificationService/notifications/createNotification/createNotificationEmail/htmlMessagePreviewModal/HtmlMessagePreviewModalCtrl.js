(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification.email')
        .controller('HtmlMessagePreviewModalCtrl', HtmlMessagePreviewModalCtrl);

    /** @ngInject */
    function HtmlMessagePreviewModalCtrl($scope,localStorageManagement,$uibModalInstance,
                                         htmlPreview,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.htmlPreview = htmlPreview;

    }
})();
