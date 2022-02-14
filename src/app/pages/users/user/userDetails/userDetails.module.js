(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.details', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user.details', {
                url: '/details',
                views: {
                    'userDetailsView': {
                        controller: "UserDetailsCtrl",
                        templateUrl: 'app/pages/users/user/userDetails/userDetails.html'
                    }
                },
                title: "User info"
            });
    }

})();