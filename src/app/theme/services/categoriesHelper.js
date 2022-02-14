(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('categoriesHelper', categoriesHelper);

    /** @ngInject */
    function categoriesHelper(localStorageManagement, environmentConfig, errorHandler, $http, serializeFiltersService) {

        return {
            fetchProductCategories: function(formattedUrl){
                return $http.get(formattedUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorageManagement.getValue('TOKEN')
                    }
                });
            },
            fetchAllProductCategories: function (serviceUrl, prevCount, prevCategories) {
                var vm = this, 
                completed = false,
                pageCount = ++prevCount || 1,
                allProductCategories = prevCategories;

                var formattedUrl = serviceUrl + 'admin/categories/?' + serializeFiltersService.serializeFilters({
                    page: pageCount,
                    page_size: 250,
                });                

                return new Promise(function(resolve, reject){ 
                    vm.fetchProductCategories(formattedUrl)
                    .then(function(res){
                        if(res.data.data.results.length > 0){
                            res.data.data.results.forEach(function(item){
                                allProductCategories.push(item);
                            });
                        }
                        completed = (res.data.data.count === allProductCategories.length);
                        resolve(completed);
                    })
                    .catch(function(error){
                        if(error.data.message && error.data.message == "Invalid page."){
                            completed = true;
                            resolve(completed);
                        }
                        else{
                           reject(error);                           
                        }   
                    });
                })
                .then(function(completed){
                    return !completed ? vm.fetchAllProductCategories(serviceUrl, pageCount, allProductCategories) : allProductCategories;
                })
                .catch(function(error){
                    throw error;
                });
            },
            formatAllProductCategories: function(allProductCategories){
                var vm = this,
                productCategories = [];
            
                allProductCategories.forEach(function(tier1Category){
                    if(tier1Category.parent === null){
                        tier1Category.showChildren = false;
                        tier1Category.isType = 'parent';
                        tier1Category.isChecked = false;
                        tier1Category.subCategories = [];
                        allProductCategories.forEach(function(tier2Category){
                            if(tier2Category.parent && tier2Category.parent.id === tier1Category.id){
                                tier2Category.showChildren = false;
                                tier2Category.isType = 'subCategory';
                                tier2Category.isChecked = false;
                                tier2Category.subCategories = [];
                                allProductCategories.forEach(function(tier3Category){
                                    if(tier3Category.parent && tier3Category.parent.id === tier2Category.id){
                                        tier3Category.showChildren = false;
                                        tier3Category.isType = 'subChildren';
                                        tier3Category.isChecked = false;
                                        tier3Category.subCategories = null;
                                        tier2Category.subCategories.push(tier3Category);
                                    }
                                });
                                tier1Category.subCategories.push(tier2Category);
                            }
                        });
                        productCategories.push(tier1Category);
                    }                    
                });
                vm.storeProductCategories(allProductCategories, productCategories);
            },
            getProductCategoryList: function(listName, serviceUrl){
                var vm = this;
                return new Promise(function(resolve, reject){
                    if(localStorageManagement.getValue(listName)){
                        var categoryList = JSON.parse(localStorageManagement.getValue(listName));
                        resolve(categoryList);
                    }
                    else {
                        vm.fetchAllProductCategories(serviceUrl, 0, [])
                        .then(function(res){
                            vm.formatAllProductCategories(res);
                            var categoryList = JSON.parse(localStorageManagement.getValue(listName));
                            resolve(categoryList);
                        })
                        .catch(function(error){
                            reject(error);
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }
                });
            },
            storeProductCategories: function(allProductCategories, productCategories){
                localStorageManagement.setValue('availableCategories', JSON.stringify(allProductCategories));
                localStorageManagement.setValue('productCategories', JSON.stringify(productCategories));
            }
        };
    }

})();
