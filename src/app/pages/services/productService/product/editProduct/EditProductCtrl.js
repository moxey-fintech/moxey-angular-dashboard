(function () {
    'use strict';
    
    angular.module('BlurAdmin.pages.services.productService.editProduct')
    .controller('EditProductCtrl', EditProductCtrl);
    
    /** @ngInject */

    function EditProductCtrl($scope,$http,$location,localStorageManagement,$stateParams,$state,typeaheadService,categoriesHelper,identifySearchInput,
        Rehive,currencyModifiers,toastr,$filter,errorHandler,countriesList,Upload,serializeFiltersService,extensionsHelper,$uibModal,$ngConfirm) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        vm.productId = $stateParams.productId;
        $scope.editingProduct = true;
        $scope.showEmailSearchAccounts = false;
        $scope.showRefSearchAccounts = false;
        $scope.supplierAccountReference = '';
        $scope.editProductObj = {};
        vm.updatedProduct = {};
        $scope.imagesDeleted = [];
        $scope.pricesDeleted = [];
        $scope.countriesList = countriesList;
        $scope.virtualFormats = ["Barcode", "QR", "Raw text"];
        $scope.searchAccountBy = 'user';
        $scope.loadingCategories = false;
        $scope.categoriesEdited = false;
        $scope.categoriesMarkedForDeletion = [];
        $scope.productCategories = [];
        $scope.productIntegrations = [];
        $scope.showCategoriesPopUp = false;
        $scope.save_continue = false;
        $scope.save_add = false;
        $scope.save_close = false;
        $scope.searchAccount = false;
        $scope.searchUser = false;

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        vm.isEmpty = function(obj){
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    return false;
                }
            }
            return true;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getAccountsReferenceTypeahead = typeaheadService.getAccountsReferenceTypeahead();

        $scope.fetchProductIntegrations = function(){
            if(vm.token){
                $scope.addingProduct = true;
                $http.get(vm.serviceUrl + 'admin/integrations/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.productIntegrations = res.data.data.results;
                    $scope.addingProduct = false;
                }).catch(function (error) {
                    $scope.addingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }

        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingProduct = true;
                $http.get(vm.serviceUrl + 'admin/currencies/?page_size=250&archived=false', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.currencyOptions = res.data.data.results.slice();
                        // vm.getCategoriesLists();
                        vm.getProduct();                        
                    }
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getProduct = function () {
            if(vm.token) {
                $scope.editingProduct = true;
                $http.get(vm.serviceUrl + 'admin/products/' + vm.productId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        var editObj = res.data.data; 
                        if(editObj.supplier !== null && identifySearchInput.isEmail(editObj.supplier)){
                            $scope.getAllAccountsByUser(editObj.supplier, editObj);
                        } else if(editObj.account !== null) {
                            $scope.getAllAccountsByAccount(editObj.account, editObj);
                        } else {
                            vm.assignProductToScope(editObj);
                        }
                    }
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddProductIntegrationModal = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddProductIntegrationModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(newIntegration){
                if(newIntegration){
                    $scope.fetchProductIntegrations();
                }
            }, function(){
            });
        };

        $scope.getAllAccountsByAccount = function(accountRef, editObj){
            var filtersObj = {
                page_size: 250
            };
            if(accountRef){
                filtersObj.reference = accountRef;
            }
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.accountOptions = res.results.slice();
                    $scope.supplierAccountReference = accountRef;
                    var account = $scope.accountOptions[0];
                    $scope.searchAccountBy = 'reference';
                    if(editObj){
                        editObj.account = account;
                        $scope.searchAccount = false;
                        if(account.user && account.user.email){
                            $scope.showRefSearchAccounts = false;
                            $scope.getAllAccountsByUser(account.user.email, editObj);
                        } else {
                            $scope.showRefSearchAccounts = true;
                            vm.assignProductToScope(editObj);
                        }
                    } else {
                        $scope.showRefSearchAccounts = true;
                        $scope.searchAccount = false;
                        $scope.editProductObj.account = $scope.accountOptions[0];
                        $scope.productChanged('account');
                    }
                } else if(editObj){
                    vm.assignProductToScope(editObj);
                }
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.getAllAccountsByUser = function(userEmail,editObj){
            var filtersObj = {
                page_size: 250
            };
            if(userEmail){
                filtersObj.user = userEmail;
            }
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.accountOptions = res.results.slice();
                    $scope.productUserAccounts = [];
                    $scope.accountOptions.forEach(function(account){
                        if(account.user.email && account.user.email === userEmail){
                            $scope.productUserAccounts.push(account);
                        }
                    });
                    if($scope.productUserAccounts.length > 0){
                        $scope.searchAccountBy = 'user';
                        $scope.showEmailSearchAccounts = true;
                        $scope.searchUser = false;
                        if(editObj){
                            if(editObj.account){
                                if(!editObj.account.reference){
                                    editObj.account = $scope.productUserAccounts.find(function(account){
                                        return account.reference === editObj.account;
                                    });
                                }
                                editObj.supplier = editObj.account.user.email;
                            } else {
                                editObj.account = $scope.productUserAccounts[0];
                                editObj.supplier = $scope.productUserAccounts[0].user.email;
                            }
                            vm.assignProductToScope(editObj);
                        } else {
                            $scope.editProductObj.account = $scope.productUserAccounts[0];
                            vm.updatedProduct.supplier = userInfo;
                            vm.updatedProduct.account = $scope.editProductObj.account ? $scope.editProductObj.account.reference : null;
                            $scope.editingProduct = false;
                        }
                    } else if(editObj){
                        vm.assignProductToScope(editObj);
                    }
                } else if(editObj){
                    vm.assignProductToScope(editObj);
                }
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.onSelect = function($model){
            $scope.searchUser = true;
            $scope.editProductObj.supplier = $model;
        };

        $scope.triggerSearchByUser = function(){
            $scope.getAllAccountsByUser($scope.editProductObj.supplier);
        };

        $scope.referenceChanging = function(){
            $scope.showRefSearchAccounts = false;
            $scope.searchAccount = false;
        };

        $scope.onRefSelect = function($model){
            $scope.searchAccount = true;
            $scope.supplierAccountReference = $model;                     
        };

        $scope.triggerSearchByReference = function(){
            $scope.getAllAccountsByAccount($scope.supplierAccountReference);   
        };

        $scope.openAddAccountModal = function(page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NewAccountModalCtrl',
                scope: $scope,
                resolve: {
                    userEmail: function() {
                        return $scope.editProductObj.supplier;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getAllAccountsByUser($scope.editProductObj.supplier);
                }
            }, function(){
            });
        };

        vm.getCategoryFromTree = function(editCategory, categoriesList){
            categoriesList.forEach(function(category){
                if(category.id === editCategory.id){
                    category.isChecked = true;
                    $scope.editProductObj.categories.push(category);
                    $scope.editProductObj.selected_categories.push(category.name);
                }
            });
        };

        $scope.formatProductVariants = function(idx, isLast){
            var listLen = $scope.editProductObj.product_variants.variants.length;
            for(var idx = 0; idx < listLen; ++idx){
                $scope.editProductObj.product_variants.variants[idx].allow_custom_amount = false;
                if($scope.editProductObj.product_variants.variants[idx].prices.length > 0){
                    $scope.editProductObj.product_variants.variants[idx].allow_custom_amount = $scope.editProductObj.product_variants.variants[idx].prices[0].allow_custom_amount;
                    $scope.editProductObj.product_variants.variants[idx].prices.forEach(function(priceObj){
                        priceObj.amount = priceObj.amount ? currencyModifiers.convertFromCents(priceObj.amount, priceObj.currency.divisibility) : null;
                        priceObj.min_custom_amount = priceObj.min_custom_amount ? currencyModifiers.convertFromCents(priceObj.min_custom_amount, priceObj.currency.divisibility) : null;
                        priceObj.max_custom_amount = priceObj.max_custom_amount ? currencyModifiers.convertFromCents(priceObj.max_custom_amount, priceObj.currency.divisibility) : null;
                    });
                }                
            }
            $scope.editingProduct = false;
        };

        vm.assignProductToScope = function (editObj) {
            $scope.editProductObj = {
                id: editObj.id,
                name: editObj.name,
                description: editObj.description,
                short_description: editObj.short_description,
                quantity: editObj.quantity,
                type: editObj.type,
                seller: editObj.seller,
                virtual_type: editObj.virtual_type ? editObj.virtual_type : "internal",
                virtual_format: editObj.virtual_format ? (editObj.virtual_format === 'bar' ? "Barcode" : editObj.virtual_format === 'raw' ? "Raw text" : "QR") : "Raw",
                virtual_redemption: editObj.virtual_redemption ? editObj.virtual_redemption : "user",
                supplier: editObj.supplier,
                account: editObj.account,
                code: editObj.code,
                enabled: editObj.enabled,
                instant_buy: editObj.instant_buy,
                countries: [],
                categories: editObj.categories,
                selected_categories: [],
                metadata: {}, 
                prices: [],
                images: [],
                requires_shipping_address: editObj.requires_shipping_address,
                requires_billing_address: editObj.requires_billing_address,
                requires_contact_mobile: editObj.requires_contact_mobile,
                requires_contact_email: editObj.requires_contact_email,
                tracked: editObj.tracked.toString(),
                has_variants: "false",
                allow_custom_amount: false,
                product_variants: {
                    options: editObj.options ? editObj.options : [],
                    variants: editObj.variants ? editObj.variants : []
                }
            };

            $scope.editProductObj.metadata = vm.isEmpty(editObj.metadata) ? null : JSON.stringify(editObj.metadata);

            editObj.categories.forEach(function(editCategory){
                vm.getCategoryFromTree(editCategory, $scope.productCategories);
                
                $scope.productCategories.forEach(function(tier1Category){
                    if(tier1Category.subCategories.length > 0){
                        vm.getCategoryFromTree(editCategory, tier1Category.subCategories);
                        
                        tier1Category.subCategories.forEach(function(tier2Category){
                            if(tier2Category.subCategories.length > 0){
                                vm.getCategoryFromTree(editCategory, tier2Category.subCategories);
                            }
                        });
                    }
                });
            });

            editObj.countries.forEach(function(allowedCountry){
                $scope.countriesList.forEach(function(country){
                    if(country.code === allowedCountry){
                        $scope.editProductObj.countries.push(country);
                    }
                });
            });

            editObj.images.forEach(function(image){
                image.action = "default";
                $scope.editProductObj.images.push(image);
            });

            editObj.prices.forEach(function (price) {
                $scope.currencyOptions.forEach(function (currency) {
                    if(currency.code == price.currency.code){
                        $scope.editProductObj.prices.push({
                            id: price.id,
                            currency: currency,
                            amount: price.amount ? $filter("currencyModifiersFilter")(price.amount,currency.divisibility) : 0,
                            min_custom_amount: price.min_custom_amount ? $filter("currencyModifiersFilter")(price.min_custom_amount,currency.divisibility) : null,
                            max_custom_amount: price.max_custom_amount ? $filter("currencyModifiersFilter")(price.max_custom_amount,currency.divisibility) : null,
                            allow_custom_amount: price.allow_custom_amount,
                            disable: true
                        });
                    }
                });
            });
            if($scope.editProductObj.prices.length > 0){
                $scope.editProductObj.allow_custom_amount = $scope.editProductObj.prices[0].allow_custom_amount;
            }
            if($scope.editProductObj.seller && $scope.editProductObj.seller.id && $scope.editProductObj.account){
                $scope.editProductObj.seller.account = Object.assign({}, $scope.editProductObj.account);
            }
            $scope.categoriesMarkedForDeletion = $scope.editProductObj.categories;
            if($scope.editProductObj.product_variants.variants.length > 0){
                $scope.editProductObj.has_variants = "true";
                $scope.formatProductVariants();
            } else {
                $scope.editingProduct = false;                
            }
        };

        $scope.openCategorySelector = function(){
            $scope.showCategoriesPopUp = true;
        };

        $scope.hideCategorySelector = function(){
            $scope.showCategoriesPopUp = false;
        };

        $scope.trackCategoryChecked = function(category){
            category.isChecked ? $scope.addCategory(category) : $scope.removeCategory(category);
        };

        $scope.addCategory = function(category){
            $scope.editProductObj.categories.push(category);
            $scope.editProductObj.selected_categories.push(category.name);
            $scope.productChanged('categories');
        };
        
        $scope.removeCategory = function(category){
            $scope.editProductObj.categories = $scope.editProductObj.categories.filter(function(item){
                return item.id !== category.id;
            });    
            var idx = $scope.editProductObj.selected_categories.indexOf(category.name);
            if(idx > -1){
                $scope.editProductObj.selected_categories.splice(idx, 1);
            }  
            $scope.productChanged('categories');
        };

        $scope.productChanged = function(field){
            
            if(field === "description" && $scope.editProductObj.description.length > 255){
                toastr.error("Product description exceeds 255 characters.");
            }
            else if(field === "short_description" && $scope.editProductObj.short_description.length > 100){
                toastr.error("Product short description exceeds 100 characters.");
            }
            else if(field === 'categories' && !$scope.categoriesEdited){
                $scope.categoriesEdited = true;
            } 
            
            if(field === 'supplier'){
                $scope.showEmailSearchAccounts = false;
                $scope.searchUser = false;
                if(!vm.updatedProduct[field]){
                    vm.updatedProduct[field] = null;
                    vm.updatedProduct['account'] = null;
                }
            } 
            else if(field === 'account' && $scope.editProductObj[field]){
                vm.updatedProduct[field] = $scope.editProductObj[field].reference;
                vm.updatedProduct['supplier'] = $scope.editProductObj[field].user ? $scope.editProductObj[field].user.email : null;
            } 
            else {
                vm.updatedProduct[field] = $scope.editProductObj[field];
            }            
        };

        $scope.addEditImage = function(){
            $scope.editProductObj.images.push({
                file: {},
                action: "add",
                weight: $scope.editProductObj.length + 1
            });
            vm.updatedProduct.images = $scope.editProductObj.images;
        };

        $scope.removeEditImage = function(image){
            var idx = $scope.editProductObj.images.indexOf(image);
            if(image.id){
                $scope.imagesDeleted.push($scope.editProductObj.images[idx]);
            } 
            $scope.editProductObj.images.splice(idx, 1);
            vm.updatedProduct.images = $scope.editProductObj.images;
        };

        $scope.addEditPriceRow = function () {
            $scope.editProductObj.prices.push({currency: {}, amount: null, min_custom_amount: null, max_custom_amount: null, type: 'add'});
        };

        $scope.removePriceRow = function ($index) {
            if($scope.editProductObj.prices[$index].id){
                price.type = 'delete';
                $scope.pricesDeleted.push(price);
            }
            $scope.editProductObj.prices.splice($index, 1);
        };

        $scope.imageChanged = function(image){
            if(image.id){
                image.action = "change";
            }
            $scope.productChanged('images');
        };

        $scope.priceChanged = function (price) {
            $scope.editProductObj.prices.forEach(function (priceObj) {
                if(priceObj.id == price.id){
                    if(price.type != 'add'){
                        price.type = 'change';
                    }
                }
            });
        };

        $scope.manageProductVoucher = function(){
            $state.go('productService.vouchersList', {productId: $scope.editProductObj.id}, {reload: true});
        };

        vm.allEditedParamsCorrect = function(){
            if(vm.updatedProduct.account !== undefined && vm.updatedProduct.account === null){
                if(!($scope.editProductObj.seller && $scope.editProductObj.seller.account)){
                    toastr.error('No supplier account provided. Please search and choose a supplier account from the dropdown.');
                    return false;
                }
                delete vm.updatedProduct['account'];
            }

            if(vm.updatedProduct.metadata){
                if(vm.isJson(vm.updatedProduct.metadata)){
                    if(vm.isEmpty(vm.updatedProduct.metadata) || vm.updatedProduct.metadata === "{}"){
                        delete vm.updatedProduct.metadata;
                    }
                    else {
                        vm.updatedProduct.metadata = JSON.parse(vm.updatedProduct.metadata);
                    }
                }
                else {
                    toastr.error('Incorrect metadata format');
                    return false;
                }
            }
            else{
                vm.updatedProduct.metadata = {};
            }

            if(vm.updatedProduct.description && vm.updatedProduct.description.length > 255){
                toastr.error("Product description exceeds 255 characters.");
                return false;
            }
            else if(vm.updatedProduct.short_description && vm.updatedProduct.short_description.length > 100){
                toastr.error("Product short description exceeds 100 characters.");
                return false;
            }

            if(vm.updatedProduct.categories){
                var trackedCategories = [];

                vm.updatedProduct.categories.forEach(function(category){
                    trackedCategories.push(category.id);
                });

                vm.updatedProduct.categories = trackedCategories;
            }

            if(vm.updatedProduct.countries){
                vm.updatedProduct.countries = vm.updatedProduct.countries.slice();
            }

            if(vm.updatedProduct.type === 'physical'){
                if(vm.updatedProduct.virtual_type){ vm.updatedProduct.virtual_type = null;}
                if(vm.updatedProduct.virtual_format){ vm.updatedProduct.virtual_format = null;}
                if(vm.updatedProduct.virtual_redemption){ vm.updatedProduct.virtual_redemption = null;}
            }
            else if(vm.updatedProduct.virtual_format){
                vm.updatedProduct.virtual_format = vm.updatedProduct.virtual_format.toLowerCase().split(' ')[0];
            }

            if($scope.categoriesEdited){
                $scope.categoriesMarkedForDeletion.forEach(function(category){
                    vm.deleteProductCategories(category);
                });                
            }

            if(vm.updatedProduct.has_variants !== undefined
                && vm.updatedProduct.has_variants == 'false'
                && $scope.editProductObj.product_variants.variants.length > 0){
                $scope.editProductObj.product_variants.variants.forEach(function(variantObj, idx, arr){
                    $scope.deleteProductVariant(idx, true);
                }); 
                $scope.editProductObj.product_variants.variants = [];
            }            

            return true;
        };

        vm.deleteProductCategories = function(category){
            if(vm.token) {
                $http.delete(vm.serviceUrl + 'admin/products/' + vm.productId + '/categories/' + category.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.manageEditCompletion = function(){
            $scope.editingProduct = false;
            toastr.success('Product updated successfully');
            if($scope.save_continue){
                $state.go('productService.editProduct', {productId: vm.productId}, {reload: true});
            } else if($scope.save_add){
                $location.path('/extensions/product/create');
            } else if($scope.save_close){
                $location.path('/extensions/product/list');
            }
        };

        $scope.editProduct = function (saveOption) {
            if(!vm.allEditedParamsCorrect()){
                return false;
            }

            if(vm.token) {
                $scope.save_continue = false;
                $scope.save_add = false;
                $scope.save_close = false;
                
                $scope[saveOption] = true;  //resetting save options and triggering the selected.
                $scope.editingProduct = true;

                $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/',vm.updatedProduct, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if($scope.categoriesEdited && vm.updatedProduct.categories){
                        if((vm.updatedProduct.prices && vm.updatedProduct.prices.length > 0) && (vm.updatedProduct.images && vm.updatedProduct.images.length > 0)){
                            vm.addProductCategory(vm.updatedProduct.categories, null);
                        }
                        else{
                            vm.addProductCategory(vm.updatedProduct.categories, 'last');
                        }
                    }
                                        
                    if(vm.updatedProduct.prices && vm.updatedProduct.prices.length > 0){
                        if(vm.updatedProduct.images.length > 0){
                            vm.trackImageChanges(null);
                        }
                        if($scope.imagesDeleted.length > 0){
                            vm.trackDeletedImages(null);
                        }
                        vm.trackPricesChanges();
                    } 
                    else if(vm.updatedProduct.images && vm.updatedProduct.images.length > 0){
                        if($scope.imagesDeleted.length > 0){
                            vm.trackDeletedImages(null);
                        }
                        vm.trackImageChanges("noPrices");
                    }
                    else if($scope.imagesDeleted.length > 0){
                        vm.trackDeletedImages("noImages");
                    }
                    else {
                        vm.manageEditCompletion();
                    }
                    vm.trackPricesChanges();
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.addProductCategory = function(categoriesList, last){
            if(vm.token){
                $http.post(vm.serviceUrl + 'admin/products/' + vm.productId + '/categories/', {categories: categoriesList}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last){
                        vm.manageEditCompletion();
                    }
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.trackImageChanges = function(noPrices){
            vm.updatedProduct.images.forEach(function(image, idx, arr){
                if(noPrices && idx === arr.length -1 ){
                    if(image.id && image.action === 'change'){ vm.updateImage(image, idx, 'last'); }
                    else if(image.action === 'add'){ vm.addImage(image, idx, 'last'); }
                }
                else{
                    if(image.id && image.action === 'change'){ vm.updateImage(image, idx, null); }
                     else if(image.action === 'add'){ vm.addImage(image, idx, null); }
                }
            });
        };

        vm.addImage = function(imageObj, idx, last){
            if(vm.token){
                var uploadDataObj = {
                    file: imageObj.file
                };
    
                Upload.upload({
                    url: vm.serviceUrl + 'admin/products/' + vm.productId + '/images/',
                    data: serializeFiltersService.objectFilters(uploadDataObj),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    },
                    method: "POST"
                }).then(function (res) {
                    var image = res.data.data;
                    var imageIndex = idx + 1; 
                    $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/images/' + image.id + '/', {weight: imageIndex}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if(last){
                            vm.manageEditCompletion();
                        }
                    }).catch(function (error) {
                        $scope.editingProduct =  false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });                
            }
        };

        vm.updateImage = function(imageObj, idx, last){
            if(vm.token){
                
                var uploadDataObj = {
                    file: imageObj.file
                };

                Upload.upload({
                    url: vm.serviceUrl + 'admin/products/' + vm.productId + '/images/' + imageObj.id + '/',
                    data: serializeFiltersService.objectFilters(uploadDataObj),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    },
                    method: "PATCH"
                }).then(function (res) {
                    var image = res.data.data;
                    var imageIndex = idx + 1; 
                    $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/images/' + image.id + '/', {weight: imageIndex}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if(last){
                            vm.manageEditCompletion();
                        }
                    }).catch(function (error) {
                        $scope.editingProduct =  false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });                
            }
        };

        vm.trackDeletedImages = function(noImages){
            $scope.imagesDeleted.forEach(function(image, idx, arr){
                if(noImages && idx === arr.length -1 ){
                    vm.deleteImage(image, 'last');
                }
                else{
                    vm.deleteImage(image, null);
                }
            });
        };
        
        vm.deleteImage = function(imageObj, last){
            if(vm.token){
                Upload.upload({
                    url: vm.serviceUrl + 'admin/products/' + vm.productId + '/images/' + imageObj.id + '/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    },
                    method: "DELETE"
                }).then(function(res){
                    if(last){
                        vm.manageEditCompletion();
                    }
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });            
            }
        };

        vm.trackPricesChanges = function () {
            var pricesAdded = [];
            var pricesChanged = [];

            $scope.editProductObj.prices.forEach(function (priceObj,indx,array) {
                if(indx === (array.length - 1)){

                    if(priceObj.type == 'change'){
                        pricesChanged.push(priceObj);
                    } else if(priceObj.type == 'add'){
                        pricesAdded.push(priceObj);
                    }

                    vm.executeDeletePricesArray(pricesAdded,pricesChanged);
                    return false;
                }

                if(priceObj.type == 'change'){
                    pricesChanged.push(priceObj);
                } else if(priceObj.type == 'add'){
                    pricesAdded.push(priceObj);
                }
            });
        };

        vm.executeDeletePricesArray = function (pricesAdded,pricesChanged) {
            if($scope.pricesDeleted.length > 0){
                $scope.pricesDeleted.forEach(function(price,idx,array){
                    if(idx === array.length - 1){
                        vm.deletePrice(price,'last',pricesAdded,pricesChanged);
                        return false;
                    }
                    vm.deletePrice(price);
                });
            } else {
                vm.executeChangePricesArray(pricesAdded,pricesChanged);
            }
        };

        vm.deletePrice = function (priceObj,last,pricesAdded,pricesChanged) {
            if(priceObj && priceObj.id) {
                $http.delete(vm.serviceUrl + 'admin/products/' + vm.productId + '/prices/' + priceObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            vm.executeChangePricesArray(pricesAdded,pricesChanged);
                        }
                    }
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                if(last){
                    vm.executeChangePricesArray(pricesAdded,pricesChanged);
                }
            }
        };

        vm.executeChangePricesArray = function (pricesAdded,pricesChanged) {
            if(pricesChanged.length > 0){
                pricesChanged.forEach(function(price,idx,array){
                    var updatedPriceObj = {
                        currency: price.currency.code,
                        amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility),
                        min_custom_amount: price.min_custom_amount ? currencyModifiers.convertToCents(price.min_custom_amount, price.currency.divisibility) : null,
                        max_custom_amount: price.max_custom_amount ? currencyModifiers.convertToCents(price.max_custom_amount, price.currency.divisibility) : null,
                        allow_custom_amount: $scope.editProductObj.allow_custom_amount
                    };
                    if(idx === array.length - 1){
                        vm.updateChangedPrice(price,updatedPriceObj,'last',pricesAdded);
                        return false;
                    }
                    vm.updateChangedPrice(price,updatedPriceObj, null, null);
                });
            } else {
                vm.executeAddPricesArray(pricesAdded);
            }
        };

        vm.updateChangedPrice = function (price,priceUpdateObj,last,pricesAdded) {
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/prices/' + price.id + '/',priceUpdateObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            vm.executeAddPricesArray(pricesAdded);
                        }
                    }
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.executeAddPricesArray = function (pricesAdded) {
            if(pricesAdded.length > 0){
                pricesAdded.forEach(function(price,idx,array){
                    var newPriceObj = {
                        currency: price.currency.code,
                        amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility),
                        min_custom_amount: price.min_custom_amount ? currencyModifiers.convertToCents(price.min_custom_amount, price.currency.divisibility) : null,
                        max_custom_amount: price.max_custom_amount ? currencyModifiers.convertToCents(price.max_custom_amount, price.currency.divisibility) : null,
                        allow_custom_amount: $scope.editProductObj.allow_custom_amount
                    };
                    if(idx === array.length - 1){
                        vm.addPrice(newPriceObj,'last');
                        return false;
                    }
                    vm.addPrice(newPriceObj, null);
                });
            } else {
                vm.manageEditCompletion();
            }
        };

        vm.addPrice = function (priceObj,last) {
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/products/' + vm.productId + '/prices/',priceObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            vm.manageEditCompletion();
                        }
                    }
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.openAddOptionModal = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                backdrop: 'static',
                keyboard: false,
                controller: 'AddProductOptionsModalCtrl',
                scope: $scope,
                resolve: {
                    productId: function() {
                        return $scope.editProductObj.id;
                    }
                }
            });

            vm.theModal.result.then(function(newProductOption){
                if(newProductOption){
                    $scope.editProductObj.product_variants.options.push(newProductOption);
                }
            }, function(err){});
        };

        $scope.openEditOptionModal = function(page, size, $index){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditProductOptionsModalCtrl',
                scope: $scope,
                resolve: {
                    productId: function() {
                        return $scope.editProductObj.id;
                    },
                    editProductOption: function(){
                        return Object.assign({}, $scope.editProductObj.product_variants.options[$index]);
                    }
                }
            });

            vm.theModal.result.then(function(updatedProductOption){
                if(updatedProductOption){
                    $scope.editProductObj.product_variants.options[$index] = updatedProductOption;
                }
            }, function(){});
        };

        $scope.showDeleteProductOptionPrompt = function($index){
            $scope.deleteOptionObj = $scope.editProductObj.product_variants.options[$index];
            $ngConfirm({
                title: 'Remove product option',
                columnClass: 'medium',
                contentUrl: 'app/pages/services/productService/product/productOptionsModals/deleteProductOptionPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteProductOption($index);
                        }
                    }
                }
            });
        };
        
        $scope.deleteProductOption = function($index){
            if(vm.token){
                $scope.editingProduct = true;
                var productOption = $scope.editProductObj.product_variants.options[$index];
                $http.delete(vm.serviceUrl + 'admin/products/' + vm.productId + '/options/' + productOption.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {                        
                    $scope.editProductObj.product_variants.options.splice($index, 1);
                    $scope.editingProduct = false;
                    toastr.success("Product variant option removed successfully");
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddVariantModal = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                backdrop: 'static',
                keyboard: false,
                controller: 'AddProductVariantModalCtrl',
                scope: $scope,
                resolve: {
                    productId: function() {
                        return $scope.editProductObj.id;
                    },
                    currencyOptions: function() {
                        return $scope.currencyOptions;
                    },
                    productOptions: function() {
                        return $scope.editProductObj.product_variants.options;                      
                    }
                }
            });

            vm.theModal.result.then(function(newProductVariant){
                if(newProductVariant){
                    $scope.editProductObj.product_variants.variants.push(newProductVariant);
                }
            }, function(err){});
        };
        
        $scope.openEditVariantModal = function(page, size, $index){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditProductVariantModalCtrl',
                scope: $scope,
                resolve: {
                    productId: function() {
                        return $scope.editProductObj.id;
                    },
                    currencyOptions: function() {
                        return $scope.currencyOptions;
                    },
                    productOptions: function() {
                        return $scope.editProductObj.product_variants.options;                      
                    },
                    editVariantObj: function() {
                        return Object.assign({}, $scope.editProductObj.product_variants.variants[$index]);
                    }
                }
            });

            vm.theModal.result.then(function(updatedProductVariant){
                if(updatedProductVariant){
                    $scope.editProductObj.product_variants.variants[$index] = updatedProductVariant;
                }
            }, function(){});
        };
        
        $scope.showDeleteProductVariantPrompt = function($index){
            $scope.deleteProductVariantObj = $scope.editProductObj.product_variants.variants[$index];
            $ngConfirm({
                title: 'Remove product variant',
                columnClass: 'medium',
                contentUrl: 'app/pages/services/productService/product/productVariantModals/deleteProductVariantPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteProductVariant($index, false);
                        }
                    }
                }
            });
        };
        
        $scope.deleteProductVariant = function($index, bulkDeletion){
            if(vm.token){
                if(!bulkDeletion){
                    $scope.editingProduct = true;
                }
                var productVariant = $scope.editProductObj.product_variants.variants[$index];
                $http.delete(vm.serviceUrl + 'admin/products/' + $scope.editProductObj.id + '/variants/' + productVariant.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {                        
                    if(!bulkDeletion){
                        $scope.editProductObj.product_variants.variants.splice($index, 1);
                        $scope.editingProduct = false;
                        toastr.success("Product variant removed successfully");
                    }
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.backToProductList = function () {
            // $location.path('/services/product/list');
            $location.path('/extensions/product/list');
        };

        $scope.goToAddCategories = function(){
            $state.go('productService.categoriesList', {openAddCategory: true});
        };    
        
        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                categoriesHelper.getProductCategoryList('productCategories', vm.serviceUrl)
                .then(function(res){
                    $scope.productCategories = res;
                    vm.getCompanyCurrencies();
                })
                .catch(function(err){
                    $scope.editingProduct = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                });
            })
            .catch(function(err){
                $scope.editingProduct = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
        
    }
})();
