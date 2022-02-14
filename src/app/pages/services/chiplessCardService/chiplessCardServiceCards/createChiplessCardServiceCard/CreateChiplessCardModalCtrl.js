(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceCards')
        .controller('CreateChiplessCardModalCtrl', CreateChiplessCardModalCtrl);

    function CreateChiplessCardModalCtrl($scope,environmentConfig,Rehive,serializeFiltersService,$uibModalInstance,toastr,typeaheadService,extensionsHelper,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "chipless_card_service";
        vm.exisitingCard = [];
        $scope.addingCard = true;
        // $scope.userEmailForAccount = '';
        $scope.showEmailSearchAccounts = false;
        $scope.searchAccount = false;
        $scope.searchUser = false;
        $scope.userAccounts = [];
        $scope.newCardParams = {
            user: "",
            account: "",
            pin: "",
            id: "",
            number: "",
            enabled: true
        };    

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        
        $scope.findUserObj = function (user) {
            $scope.addingCard = true;
            $http.get(environmentConfig.API + 'admin/users/?user=' + encodeURIComponent(user), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if(res.data.data.results.length == 1){
                    vm.addCard(res.data.data.results[0]);               
                }
            }).catch(function (error) {
                $scope.addingCard = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.getAllAccountsByUser = function(userEmail){
            var filterObj = {
                page_size: 250
            };
            if(userEmail){
                filterObj.user = userEmail;
            }
            
            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.accountOptions = res.results.slice();
                    $scope.userAccounts = [];
                    $scope.accountOptions.forEach(function(account){
                        if(account.user.email === userEmail){
                            $scope.userAccounts.push(account);
                        }
                    });
                    if($scope.userAccounts.length > 0){
                        $scope.showEmailSearchAccounts = true;
                        $scope.searchUser = false;
                        $scope.newCardParams.account = $scope.userAccounts[0];
                    }
                } 
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.emailChanging = function(){
            $scope.showEmailSearchAccounts = false;
            $scope.searchUser = false;
        };

        $scope.onUserSelect = function($model){
            $scope.searchUser = true;
            $scope.newCardParams.user = $model;
            $scope.getAllAccountsByUser($scope.newCardParams.user, null);
        };

        vm.addCard = function (user) {            

            var cardObj = {
                user: user.id,
                account: $scope.newCardParams.account.reference,
                pin: $scope.newCardParams.pin !== "" ? $scope.newCardParams.pin : null,
                id: $scope.newCardParams.id !== "" ? $scope.newCardParams.id : null,
                number: $scope.newCardParams.number !== "" ? $scope.newCardParams.number : null,
                enabled: $scope.newCardParams.enabled 
            };

            cardObj = serializeFiltersService.objectFilters(cardObj);

            if(vm.token){
                $scope.addingCard = true;
                $http.post(vm.baseUrl + 'admin/cards/', cardObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingCard = false;
                    toastr.success('Card successfully added');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.addingCard = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };
        

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.addingCard = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.addingCard = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();