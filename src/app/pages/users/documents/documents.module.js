(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.documents', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('users.documents', {
                url: '/user-documents',
                views: {
                    'usersViews': {
                        templateUrl: 'app/pages/users/documents/documents.html',
                        controller: "DocumentsCtrl",
                    }
                },                
                params: {
                    status: null
                },
                title: 'User documents'
            });
    }

})();