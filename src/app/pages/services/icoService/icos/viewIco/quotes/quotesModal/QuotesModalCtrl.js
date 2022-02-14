(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.quotes')
        .controller('QuotesModalCtrl', QuotesModalCtrl);

    function QuotesModalCtrl($uibModalInstance,$scope,quote,icoObj,$location) {

        $scope.quote = quote;
        $scope.icoObj = icoObj;

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + $scope.quote.user + '/details');
        }
    }

})();
