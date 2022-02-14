(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.logs', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user.logs', {
                url: '/user-logs',
                views: {
                    'userDetailsView': {
                        controller: "UserLogsCtrl",
                        templateUrl: 'app/pages/users/user/userLogs/userLogs.html'
                    }
                },
                title: "User logs"
            });
    }

})();