(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco')
        .controller('ViewIcoCtrl', ViewIcoCtrl);

    /** @ngInject */
    function ViewIcoCtrl($scope,localStorageManagement,$location,$stateParams) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');

        $scope.goToIcoOptions = function(path){
            // $location.path('/services/ico/' + $stateParams.id + path);
            $location.path('/extensions/ico/' + $stateParams.id + path);
        };




    }
})();
