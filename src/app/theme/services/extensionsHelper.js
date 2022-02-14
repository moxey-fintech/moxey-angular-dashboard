(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('extensionsHelper', extensionsHelper);

    /** @ngInject */
    function extensionsHelper(localStorageManagement, environmentConfig, $http, errorHandler) {
        return {
            fetchAdminServices: function () {
                return $http.get(environmentConfig.API + 'admin/services/?type=extension&page_size=50', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorageManagement.getValue('TOKEN')
                    }
                });
            },
            fetchActiveAdminServices: function () {
                return $http.get(environmentConfig.API + 'admin/services/?type=extension&active=true&page_size=50', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorageManagement.getValue('TOKEN')
                    }
                });
            },
            storeServicesListToLocalstorage: function (resolvedData) {
                var adminServicesList = resolvedData.data.data.results;
                var list = {};
                
                for(var i = 0; i < adminServicesList.length; ++i){
                    list[adminServicesList[i].slug] = {
                        id: adminServicesList[i].id,
                        active: adminServicesList[i].active,
                        url: adminServicesList[i].url
                    };
                }

                localStorageManagement.setValue('extensionsList', JSON.stringify(list));
            },
            getActiveServiceUrl: function(serviceName){
                var vm = this;
                return new Promise(function(resolve, reject){
                    var extensionsList = localStorageManagement.getValue('extensionsList') ? JSON.parse(localStorageManagement.getValue('extensionsList')) : {};
                    if(extensionsList === {}){
                        vm.fetchAdminServices()
                        .then(function(res){
                            vm.storeServicesListToLocalstorage(res);
                            var serviceUrl = vm.checkIfServiceActiveForCompany(serviceName) ? extensionsList[serviceName].url : null;
                            serviceUrl ? resolve(serviceUrl) : reject(serviceUrl);
                        })
                        .catch(function(error){
                            reject(error);
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        })
                    }
                    else {
                        var serviceUrl = vm.checkIfServiceActiveForCompany(serviceName) ? extensionsList[serviceName].url : null;
                        serviceUrl ? resolve(serviceUrl) : reject(serviceUrl);
                    }
                });
            },
            checkIfServiceActiveForCompany: function (serviceName) {
                var extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
                return extensionsList[serviceName] === undefined ? false : extensionsList[serviceName].active;
            },
            deactivateServiceInStoredList: function(serviceName){
                var extensionsList =  JSON.parse(localStorageManagement.getValue('extensionsList'));
                if(extensionsList[serviceName] !== undefined){
                    extensionsList[serviceName].active = false;
                    localStorageManagement.setValue('extensionsList', JSON.stringify(extensionsList));
                }
            },
            getActiveServiceId: function(serviceName){
                var vm = this;
                return vm.checkIfServiceActiveForCompany(serviceName) ? JSON.parse(localStorageManagement.getValue('extensionsList'))[serviceName].id : null;
            }
        };
    }

})();