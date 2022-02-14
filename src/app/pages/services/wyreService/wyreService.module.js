(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreService', [ 
        "BlurAdmin.pages.services.wyreService.wyreServiceSettings"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('wyreService', {
                url: '/extensions/wyre',
                abstract:true,
                title: 'Wyre Extension'
            });

        $urlRouterProvider.when("/extensions/wyre", "/extensions/wyre/settings");
    }

})();
