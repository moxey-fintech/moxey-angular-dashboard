(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.createProduct')
        .controller('AddProductCtrl', AddProductCtrl);

    /** @ngInject */
    function AddProductCtrl($scope,$http,$location,localStorageManagement,currencyModifiers,$state,typeaheadService,categoriesHelper,
                            Rehive,serializeFiltersService,toastr,errorHandler,countriesList,Upload,extensionsHelper,$uibModal,$ngConfirm) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        $scope.addingProduct = true;
        $scope.loadingCategories = false;
        $scope.showUserAccounts = false;
        $scope.showRefSearchAccounts = false;
        $scope.searchAccountBy = 'user';
        $scope.searchAccount = false;
        $scope.searchUser = false;
        $scope.charCount = 0;
        $scope.countriesList = countriesList;
        $scope.showCategoriesPopUp = false;
        $scope.updatingProductVariants = false;
        
        $scope.newProductParams = {
            name: '',
            has_variants: 'false',
            description: '',
            shortDescription: '',
            tracked: 'false',
            quantity: null,
            type: "physical",
            virtual_type: "internal",
            virtual_format: "Raw",
            virtual_redemption: "user",
            supplier: "",
            account: null,
            code: '',
            prices: [],
            images: [],
            categories: [],
            enabled: true,
            instantBuy: false,
            allowedCountries: [],
            integration: null,
            metadata: null,
            allow_custom_amount: false,
            requires_shipping_address: false,
            requires_billing_address: false,
            requires_contact_mobile: false,
            requires_contact_email: false,
            product_variants: {
                options: [],
                variants: []
            }
        };

        //#region Product handling        
        $scope.virtualFormats = ["Barcode", "QR", "Raw"];
        $scope.trackedCountries = [];
        $scope.productCategories = [];
        $scope.productIntegrations = [];
        $scope.save_continue = false;
        $scope.save_add = false;
        $scope.save_close = false;
        $scope.productId = null;

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        vm.preSortCurrencies = function(currency1, currency2){
            if(currency1.code < currency2.code){return -1;}
            if(currency1.code > currency2.code){return 1;}
            return 0;
        };

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
                $http.get(vm.serviceUrl + 'admin/currencies/?page_size=250&archived=false', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.currencyOptions = res.data.data.results.slice();
                    $scope.currencyOptions.sort(vm.preSortCurrencies);
                    $scope.fetchProductIntegrations();
                }).catch(function (error) {
                    $scope.addingProduct = false;
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

        $scope.formatOptionValues = function(){
            var optionValue = '';
        };

        $scope.countCharacters = function(){
            if($scope.newProductParams.description.length > 255){
                toastr.error("Short description length exceeds 255 characters");
            }
        };

        $scope.trackShortDescription = function(){
            if($scope.newProductParams.shortDescription.length > 100){
                toastr.error("Short description length exceeds 100 characters");
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
            $scope.newProductParams.categories.push(category);
        };
        
        $scope.removeCategory = function(category){
            $scope.newProductParams.categories = $scope.newProductParams.categories.filter(function(item){
                return item.id !== category.id;
            });            
        };

        vm.addProductParamsIsValid = function(){
            if(!$scope.newProductParams.account){
                toastr.error('No supplier account provided. Please search and choose a supplier account from the dropdown.');
                return false;
            }

            var metadata = {};
            $scope.trackedCountries = $scope.newProductParams.allowedCountries.slice();
            $scope.trackedCategories = [];

            $scope.newProductParams.categories.forEach(function(category){
                $scope.trackedCategories.push(category.id);
            });
            
            if($scope.newProductParams.metadata && !vm.isJson($scope.newProductParams.metadata)){
                toastr.error('Incorrect metadata format');
                return false;
            } 

            if($scope.newProductParams.description && $scope.newProductParams.description.length > 255){
                toastr.error("Description length exceeds 255 characters");
                return false;
            }

            if($scope.newProductParams.shortDescription && $scope.newProductParams.shortDescription.length > 100){
                toastr.error("Short description length exceeds 100 characters");
                return false;
            }

            if($scope.newProductParams.type == 'virtual' && $scope.newProductParams.virtual_format){
                $scope.newProductParams.virtual_format = $scope.newProductParams.virtual_format.toLowerCase().split(' ')[0];
                if($scope.newProductParams.virtual_format === 'barcode'){
                    $scope.newProductParams.virtual_format = "bar";
                }
            }

            return true;
        }

        vm.handleAddProductCompletion = function(){
            $scope.addingProduct =  false;
            toastr.success('Product added successfully');
            if($scope.save_continue){
                $state.go('productService.editProduct', {productId: $scope.product.id}, {reload: true});
            } else if($scope.save_add){
                $state.go('productService.createProduct', {}, {reload: true});
            } else if($scope.save_close){
                $location.path('/extensions/product/list');
            }
        };

        $scope.addNewProduct = function (saveOption) {
            if(!vm.addProductParamsIsValid()){
                return false;
            }

            var newProduct = {
                name: $scope.newProductParams.name,
                description: $scope.newProductParams.description || null,
                short_description: $scope.newProductParams.shortDescription || null,
                tracked: $scope.newProductParams.tracked === 'true',
                quantity: $scope.newProductParams.quantity || null,
                type: $scope.newProductParams.type,
                virtual_type: $scope.newProductParams.type == 'virtual' ? $scope.newProductParams.virtual_type : null,
                virtual_format: $scope.newProductParams.type == 'virtual' ? $scope.newProductParams.virtual_format : null,
                virtual_redemption: $scope.newProductParams.type == 'virtual' ? $scope.newProductParams.virtual_redemption : null,
                supplier: $scope.newProductParams.supplier || null,
                account: $scope.newProductParams.account ? $scope.newProductParams.account.reference : null,
                code: $scope.newProductParams.code || null,
                enabled: $scope.newProductParams.enabled.toString() || true,
                instant_buy: $scope.newProductParams.instantBuy.toString() || false,
                countries: $scope.trackedCountries.length > 0 ?$scope.trackedCountries : [],
                requires_shipping_address: $scope.newProductParams.requires_shipping_address,
                requires_billing_address: $scope.newProductParams.requires_billing_address,
                requires_contact_mobile: $scope.newProductParams.requires_contact_mobile,
                requires_contact_email: $scope.newProductParams.requires_contact_email,
                integration: $scope.newProductParams.integration ? $scope.newProductParams.integration.id : null,              
                metadata: $scope.newProductParams.metadata ? JSON.parse($scope.newProductParams.metadata) : {}
            };
            newProduct = serializeFiltersService.objectFilters(newProduct);

            if(vm.token) {
                $scope.save_continue = false;
                $scope.save_add = false;
                $scope.save_close = false;
                $scope[saveOption] = true;  //resetting save options and triggering the selected.
                $scope.addingProduct =  true;
                $http.post(vm.serviceUrl + 'admin/products/',newProduct, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.product = res.data.data;
                    $scope.productId = $scope.product.id;
                    $scope.newProductParams.has_variants == 'true' ? $scope.newProductParams.prices = [] : $scope.newProductParams.product_variants.variants = [];
                    if($scope.newProductParams.product_variants.options.length > 0 || $scope.newProductParams.product_variants.variants.length > 0){
                        if($scope.newProductParams.product_variants.options.length > 0){
                            $scope.newProductParams.product_variants.options.forEach(function(optionObject, idx, arr){
                                $scope.addOptionsToProduct(optionObject, (idx === arr.length-1));
                            });   
                        } else {   
                            $scope.handleProductionVariantAddition();                      
                        }
                    } else {
                        $scope.handleProductAssetAddition();
                    }
                }).catch(function (error) {
                    $scope.addingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.handleProductAssetAddition = function(){
            var hasImageOrPrice = ($scope.newProductParams.prices.length > 0 || $scope.newProductParams.images.length > 0);
            if($scope.newProductParams.categories.length > 0 || hasImageOrPrice){
                vm.addProductCategories($scope.product, $scope.newProductParams.categories, !hasImageOrPrice); 
                if(hasImageOrPrice){
                    if($scope.newProductParams.prices.length > 0){
                        ($scope.newProductParams.images.length > 0) ? vm.formatImagesForProduct($scope.product, null) : vm.formatPricesForProduct($scope.product);
                    } else{
                        vm.formatImagesForProduct($scope.product, "noPrices");
                    }            
                }
            } else {
                vm.handleAddProductCompletion();
            }
        };

        vm.addProductCategories = function(product, categoriesList, last){
            var categoryIds = [];
            categoriesList.forEach(function(category){
                categoryIds.push(category.id);
            });

            if(vm.token){
                $http.post(vm.serviceUrl + 'admin/products/' + product.id + '/categories/', {categories: categoryIds}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last){
                        vm.handleAddProductCompletion();
                    }
                }).catch(function (error) {
                    $scope.addingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getProduct = function(product){
            $http.get(vm.serviceUrl + 'admin/products/' + product.id + '', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        //#endregion

        //#region Product Options        
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
                        return null;
                    }
                }
            });

            vm.theModal.result.then(function(newProductOption){
                if(newProductOption){
                    $scope.newProductParams.product_variants.options.push(newProductOption);
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
                        return null;
                    },
                    editProductOption: function(){
                        return Object.assign({}, $scope.newProductParams.product_variants.options[$index]);
                    }
                }
            });

            vm.theModal.result.then(function(updatedProductOption){
                if(updatedProductOption){
                    $scope.newProductParams.product_variants.options[$index] = updatedProductOption;
                }
            }, function(){});
        };

        $scope.showDeleteProductOptionPrompt = function($index){
            $scope.deleteOptionObj = $scope.newProductParams.product_variants.options[$index];
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
                $scope.updatingProductVariants = true;
                var productOption = $scope.newProductParams.product_variants.options[$index];
                if(!productOption.id){
                    setTimeout(function(){
                        $scope.newProductParams.product_variants.variants.forEach(function(variant){
                            delete variant.options[productOption.name];
                        });
                        $scope.newProductParams.product_variants.options.splice($index, 1);
                        $scope.updatingProductVariants = false;
                        toastr.success("Product variant option removed successfully");
                    }, 1200);
                } else {                    
                    // $http.delete(vm.serviceUrl + 'admin/products/' + product.id + '/options/' + productOption.id + '/', {
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'Authorization': vm.token
                    //     }
                    // }).then(function (res) {                        
                    //     $scope.newProductParams.product_variants.options.splice($index, 1);
                    //     $scope.updatingProductVariants = false;
                    //     toastr.success("Product variant option removed successfully");
                    // }).catch(function (error) {
                    //     $scope.addingProduct =  false;
                    //     errorHandler.evaluateErrors(error.data);
                    //     errorHandler.handleErrors(error);
                    // });
                }
            }
        };

        $scope.addOptionsToProduct = function(optionObject, last){
            if(vm.token){
                $scope.addingNewProductOption = true;
                $http.post(vm.serviceUrl + 'admin/products/' + $scope.product.id + '/options/', optionObject, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last){
                        ($scope.newProductParams.product_variants.variants.length > 0) ? $scope.handleProductionVariantAddition() : $scope.handleProductAssetAddition();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        //#endregion   

        //#region Product variants
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
                        return null;
                    },
                    currencyOptions: function() {
                        return $scope.currencyOptions;
                    },
                    productOptions: function() {
                        return $scope.newProductParams.product_variants.options;                      
                    }
                }
            });

            vm.theModal.result.then(function(newProductVariant){
                if(newProductVariant){
                    $scope.newProductParams.product_variants.variants.push(newProductVariant);
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
                        return null;
                    },
                    currencyOptions: function() {
                        return $scope.currencyOptions;
                    },
                    productOptions: function() {
                        return $scope.newProductParams.product_variants.options;                      
                    },
                    editVariantObj: function() {
                        return Object.assign({}, $scope.newProductParams.product_variants.variants[$index]);
                    }
                }
            });

            vm.theModal.result.then(function(updatedProductVariant){
                if(updatedProductVariant){
                    $scope.newProductParams.product_variants.variants[$index] = updatedProductVariant;
                }
            }, function(){});
        };
        
        $scope.showDeleteProductVariantPrompt = function($index){
            $scope.deleteProductVariantObj = $scope.newProductParams.product_variants.variants[$index];
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
                            $scope.deleteProductVariant($index);
                        }
                    }
                }
            });
        };
        
        $scope.deleteProductVariant = function($index){
            if(vm.token){
                var productVariant = $scope.newProductParams.product_variants.variants[$index];
                if(!productVariant.id){
                    $scope.updatingProductVariants = true;
                    setTimeout(function(){
                        $scope.newProductParams.product_variants.variants.splice($index, 1);
                        $scope.updatingProductVariants = false;
                        toastr.success("Product variant removed successfully");
                    }, 1200);
                } else {
                    // $http.delete(vm.serviceUrl + 'admin/products/' + product.id + '/variants/' + productVariant.id + '/',
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //         'Authorization': vm.token
                        //     }
                        // }).then(function (res) {                        
                        //     $scope.newProductParams.product_variants.variants.splice($index, 1);
                        //     $scope.updatingProductVariants = false;
                        //     toastr.success("Product variant removed successfully");
                        // }).catch(function (error) {
                        //     $scope.addingProduct =  false;
                        //     errorHandler.evaluateErrors(error.data);
                        //     errorHandler.handleErrors(error);
                        // });
                }
            }
        };

        $scope.handleProductionVariantAddition = function(){
            $scope.newProductParams.product_variants.variants.forEach(function(variantObj, idx, arr){
                $scope.addVariantsToProduct(variantObj, (idx === arr.length-1));
            });
        };

        $scope.addVariantsToProduct = function(variantObj, last){
            if(vm.token){
                var variantPrices = Object.assign([], variantObj.prices);
                var variantHasCustomPrices = variantObj.allow_custom_amount;
                delete variantObj['prices'];
                delete variantObj['allow_custom_amount'];
                $http.post(vm.serviceUrl + 'admin/products/' + $scope.product.id + '/variants/', variantObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    variantObj = res.data.data;
                    variantObj.prices = variantPrices;
                    if(variantObj.prices.length > 0){
                        variantObj.prices.forEach(function(priceObj, idx, arr){
                            var newPriceObj = {
                                currency: priceObj.currency.code,
                                amount: priceObj.amount ? currencyModifiers.convertToCents(priceObj.amount, priceObj.currency.divisibility) : null,
                                min_custom_amount: priceObj.min_custom_amount ? currencyModifiers.convertToCents(priceObj.min_custom_amount, priceObj.currency.divisibility) : null,
                                max_custom_amount: priceObj.max_custom_amount ? currencyModifiers.convertToCents(priceObj.max_custom_amount, priceObj.currency.divisibility) : null,
                                allow_custom_amount: variantHasCustomPrices
                            };
                            $scope.addPricesToProductVariant(variantObj.id, newPriceObj, (last && (idx === arr.length - 1)));
                        });
                    } else if(last) {
                        $scope.handleProductAssetAddition();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addPricesToProductVariant = function(variantId, priceObj, last){
            if(vm.token){
                $http.post(vm.serviceUrl + 'admin/products/' + $scope.product.id + '/variants/' + variantId + '/prices/', priceObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last){
                        $scope.handleProductAssetAddition();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };
        //#endregion

        //#region Product images
        vm.formatImagesForProduct = function (product, noPrices) {
            $scope.newProductParams.images.forEach(function(image, idx, arr){
                if(image.file.name){
                    vm.addImagesToProducts(product, image, idx, (noPrices && (idx === arr.length-1) ));
                }
            });
            if(!noPrices){
                vm.formatPricesForProduct(product);
            }
        };

        vm.addImagesToProducts = function(product, imageFile, weight, last){
            if(vm.token){
                var uploadDataObj = {
                    file: imageFile.file
                };
    
                Upload.upload({
                    url: vm.serviceUrl + 'admin/products/' + product.id + '/images/',
                    data: serializeFiltersService.objectFilters(uploadDataObj),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token},
                    method: "POST"
                }).then(function (res) {
                    var imageObj = res.data.data;
                    imageObj.weight = weight + 1; 
                    $http.patch(vm.serviceUrl + 'admin/products/' + product.id + '/images/' + imageObj.id + '/', {weight: imageObj.weight}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if(last){
                            vm.handleAddProductCompletion();
                        }
                    }).catch(function (error) {
                        $scope.addingProduct =  false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }).catch(function (error) {
                    $scope.addingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
                
            }
        };

        $scope.addImage = function(){
            $scope.newProductParams.images.push({
                file: {}
            });
        };

        $scope.removeImage = function(image){
            $scope.newProductParams.images.forEach(function(item, index, array){
                if(item === image){
                    array.splice(index, 1);
                    return;
                }
            });
        };
        //#endregion

        //#region Product Prices
        $scope.updateAllowCustomAmountOnPrices = function(){
            $scope.newProductParams.prices.forEach(function(priceItem){
                priceItem.allow_custom_amount = $scope.newProductParams.allow_custom_amount;
            });
        };

        vm.formatPricesForProduct = function (product) {
            $scope.newProductParams.prices.forEach(function(price,idx,array){
                var newPriceObj = {
                    currency: price.currency.code,
                    amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility),
                    min_custom_amount: price.min_custom_amount ? currencyModifiers.convertToCents(price.min_custom_amount, price.currency.divisibility) : null,
                    max_custom_amount: price.max_custom_amount ? currencyModifiers.convertToCents(price.max_custom_amount, price.currency.divisibility) : null,
                    allow_custom_amount: price.allow_custom_amount
                };
                if(idx === array.length - 1){
                    vm.addPricesToProduct(product,newPriceObj,'last');
                    return false;
                }
                vm.addPricesToProduct(product,newPriceObj, null);
            });
        };

        vm.addPricesToProduct = function (product,priceObj,last) {
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/products/' + product.id + '/prices/',priceObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            vm.getProduct(product);
                            vm.handleAddProductCompletion();
                        }
                    }
                }).catch(function (error) {
                    $scope.addingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addPriceRow = function () {
            $scope.newProductParams.prices.push({
                currency: {}, 
                amount: null, 
                min_custom_amount: null, 
                max_custom_amount: null,
                allow_custom_amount: $scope.newProductParams.allow_custom_amount
            });
        };

        $scope.removeAddPriceRow = function ($index) {
            $scope.newProductParams.prices.splice($index, 1);
        };
        //#endregion

        //#region Product Accounts handling
        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getAccountsReferenceTypeahead = typeaheadService.getAccountsReferenceTypeahead();

        $scope.getAllReferenceAccounts = function(accountRef){
            var filtersObj = {
                page_size: 250
            };
            if(accountRef){
                filtersObj.reference = accountRef;
            }

            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.accountOptions = res.results.slice();
                    if($scope.accountOptions.length > 0){
                        $scope.showRefSearchAccounts = true;
                        $scope.searchAccount = false;
                        $scope.newProductParams.account = $scope.accountOptions[0];
                    }
                } 
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.getAllUserAccounts = function(userEmail){
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
                        if(account.user.email === userEmail){
                            $scope.productUserAccounts.push(account);
                        }
                    });
                    if($scope.productUserAccounts.length > 0){
                        $scope.showUserAccounts = true;
                        $scope.searchUser = false;
                        $scope.newProductParams.account = $scope.productUserAccounts[0];
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
            $scope.showUserAccounts = false;
            $scope.searchUser = false;
        };

        $scope.onSelect = function($model){
            $scope.searchUser = true;
            $scope.newProductParams.supplier = $model;
        };

        $scope.triggerSearchByUser = function(){
            $scope.getAllUserAccounts($scope.newProductParams.supplier);
        }

        $scope.referenceChanging = function(){
            $scope.showRefSearchAccounts = false;
            $scope.searchAccount = false;
        };

        $scope.onRefSelect = function($model){
            $scope.searchAccount = true;
            $scope.supplierAccountReference = $model;                     
        };

        $scope.triggerSearchByReference = function(){
            $scope.getAllReferenceAccounts($scope.supplierAccountReference);   
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
                        return $scope.newProductParams.supplier;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getAllUserAccounts($scope.newProductParams.supplier);
                }
            }, function(){
            });
        };
        //#endregion

        $scope.backToProductList = function () {
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
                    $scope.addingProduct = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                });
            })
            .catch(function(err){
                $scope.addingProduct = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();