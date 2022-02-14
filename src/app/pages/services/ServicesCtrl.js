(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services')
        .controller('ServicesCtrl', ServicesCtrl);

    /** @ngInject */


    function ServicesCtrl($rootScope,$scope,$location,$http,environmentConfig,localStorageManagement,
                          errorHandler,$uibModal,$window,$intercom,$ngConfirm, toastr,extensionsHelper) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Extensions | Moxey';
        $scope.loadingServices = true;
        $scope.showingFilters = false;

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.closeOptionsBox = function () {
            $scope.optionsCode = '';
        };
        
        $scope.getAllServices = function(activeServices){
            $scope.loadingServices = true;

            extensionsHelper.fetchAdminServices()
            .then(function (res) {
                extensionsHelper.storeServicesListToLocalstorage(res); // storing the services to localstorage;
                var results = res.data.data.results;
                $scope.servicesList = [];
                $scope.serviceListOptions = [];
                results.forEach(function(service){
                    service.name = service.name.replace('Service', 'Extension');
                    service.active ? $scope.servicesList.push(service) : $scope.serviceListOptions.push(service);
                });
                $scope.loadingServices = false;
                if($location.search().slug){
                    var serviceSlug = $location.search().slug;
                    var service = $scope.serviceListOptions.find(function(service){
                        return service.slug === serviceSlug;
                    });
                    service && service !== undefined ? $scope.addServicePrompt(service) : $location.search('slug', null);
                }
            })
            .catch(function (error) {
                $scope.loadingServices = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }
        $scope.getAllServices();

        $scope.goToService = function($event,service) {
            var serviceName,serviceNameArray;

            localStorageManagement.setValue('SERVICEURL',service.url);
            localStorageManagement.setValue('SERVICEID',service.id);
            // var indexOfServiceWord = service.name.search('Service');
            var indexOfServiceWord = service.name.search('Extension');
            if(indexOfServiceWord > 0){
                serviceName = service.name.substring(0,indexOfServiceWord);
                serviceNameArray = serviceName.trim().split(' ');
                if(serviceNameArray.length > 1){
                    serviceName = serviceNameArray.join('-');
                } else {
                    serviceName = serviceNameArray.toString();
                }
            } else {
                serviceName = service.name;
            }
            var pathName = serviceName.toLowerCase().trim();
            if($location.search().slug){
                $location.search('service', null);
            }
            if($event.which === 1){
                // $location.path('/services/' + pathName);
                $location.path('/extensions/' + pathName);
            } else if($event.which === 2){
                // $window.open('/#/services/' + pathName,'_blank');
                $window.open('/#/extensions/' + pathName,'_blank');
            } else if($event.which === 3){
                // $window.open('/#/services/' + pathName,'_blank');
                $window.open('/#/extensions/' + pathName,'_blank');
            }
        };

        $scope.addServicePrompt = function(service) {
            var extensionName = service.name.replace("Service", "Extension");

            $ngConfirm({
                title: 'Add service',
                // contentUrl: 'app/pages/services/addServiceModal/addServicePrompt.html',
                content: 'Are you sure you want to add the ' + extensionName + '?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Add",
                        keys: ['enter'], // will trigger when enter is pressed
                        btnClass: 'btn-primary dashboard-btn',
                        action: function(scope){
                            // if(!scope.password){
                            //     toastr.error('Please enter your password');
                            //     return;
                            // }
                            // scope.addServices(scope.password, service);
                            scope.addServices(null, service);
                        }
                    }
                }
            });
        };

        $scope.addServices = function(password, service){
            $scope.loadingServices = true;
            if(vm.token) {
                // $http.put(environmentConfig.API + 'admin/services/' + service.id + '/',{password: password, terms_and_conditions: true, active: true}, {
                $http.put(environmentConfig.API + 'admin/services/' + service.id + '/',{terms_and_conditions: true, active: true}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if($location.search().slug){
                            $location.search('service', null);
                        }
                        $scope.loadingServices = false;
                        $scope.getAllServices();
                        toastr.success('Extension has been successfully activated');
                    }
                }).catch(function (error) {
                    $scope.loadingServices = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        // $scope.openAddServicesModal = function (page, size) {
        //     vm.theModal = $uibModal.open({
        //         animation: true,
        //         templateUrl: page,
        //         size: size,
        //         controller: 'AddServiceModalCtrl',
        //         scope: $scope
        //     });
        //
        //     vm.theModal.result.then(function(service){
        //         if(service){
        //             $scope.getServices();
        //         }
        //     }, function(){
        //     });
        // };
    }
})();
