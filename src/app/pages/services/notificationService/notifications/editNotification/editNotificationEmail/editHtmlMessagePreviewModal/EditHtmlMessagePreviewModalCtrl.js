(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotification.email')
        .controller('EditHtmlMessagePreviewModalCtrl', EditHtmlMessagePreviewModalCtrl);

    /** @ngInject */
    function EditHtmlMessagePreviewModalCtrl($scope,localStorageManagement,$uibModalInstance,
                                         htmlPreview,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.htmlPreview = htmlPreview;

    }
})();
