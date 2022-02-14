(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAssets')
        .controller('AddStellarAssetsModalCtrl', AddStellarAssetsModalCtrl);

    function AddStellarAssetsModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper,$ngConfirm) {


        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "stellar_service";
        $scope.addingassets = true;
        $scope.fetchingIssuerDetails = false;
        $scope.basicDetailsFilled = false;
        // var horizonServer = new StellarSdk.Server('https://horizon.stellar.org');
        $scope.selectedPreListedAsset = null;
        $scope.submitted = false;
        $scope.preListedAssetsList = [];
        $scope.assetParams = {
            description: null,
            currency_code: null,
            address: null,
            unit: null,
            symbol: null,
            org_name: null,
            name: null,
            logo: null
        };
        
        $scope.checkBasicDetailsFilled = function(){
            if($scope.assetParams.currency_code && $scope.assetParams.address){
                // vm.searchForTomlConfig();
            }
        };
        
        // vm.searchForTomlConfig = function(){
        //     if(vm.token){
        //         $scope.fetchingIssuerDetails = true;
        //         horizonServer.accounts().accountId($scope.assetParams.address).call().then(function(issuerAccount){
        //             if(issuerAccount.home_domain){
        //                 StellarSdk.StellarTomlResolver.resolve(issuerAccount.home_domain)
        //                 .then(function(resolvedToml){                            
        //                     $scope.$apply(function(){
        //                         var customCurrency = null;
        //                         var tomlCurrencies = resolvedToml.CURRENCIES;
        //                         var tomlDocumentation = resolvedToml.DOCUMENTATION;
    
        //                         tomlCurrencies.forEach(function(currency){
        //                             if(currency.code === $scope.assetParams.currency_code){
        //                                 customCurrency = currency;
        //                             }
        //                         });
                                
        //                         $scope.assetParams.description = customCurrency ? customCurrency.desc : null;
        //                         $scope.assetParams.unit = customCurrency ? customCurrency.name : null;
        //                         $scope.assetParams.org_name = tomlDocumentation ? (tomlDocumentation.ORG_NAME ? tomlDocumentation.ORG_NAME : null) : null;
        //                         $scope.assetParams.name = customCurrency ? customCurrency.name : null;
        //                         $scope.assetParams.logo = customCurrency ? customCurrency.image : null;
                                
        //                         $scope.fetchingIssuerDetails = false;
        //                         $scope.basicDetailsFilled = true;
        //                     });
        //                 })
        //                 .catch(function(err){
        //                     $scope.$apply(function(){
        //                         $scope.basicDetailsFilled = true;
        //                         $scope.fetchingIssuerDetails = false;
        //                     });
        //                 })
        //             }
        //             else{
        //                 $scope.basicDetailsFilled = true;
        //                 $scope.fetchingIssuerDetails = false;
        //             }
        //             $scope.$apply();                   
        //         })
        //         .catch(function(err){
        //             $scope.$apply(function(){
        //                 $scope.fetchingIssuerDetails = false;
        //                 toastr.error('Invalid issuer address.');
        //             });
        //         });
        //     }
        // };

        $scope.confirmAddingNewAsset = function(){
            $ngConfirm({
                title: 'Confirmation',
                contentUrl: "app/pages/services/stellarService/stellarServiceAssets/addStellarAssetsModal/addStellarAssetConfirmationModal.html",
                animationBounce: 1,
                animationSpeed: 100,
                columnClass: 'medium',
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn pull-left'
                    },
                    ok: {
                        text: "Confirm",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.addAssets();
                        }
                    }
                }
            });

            setTimeout(function(){
                var elem = document.querySelector('.ng-confirm-box-p.col-md-8.col-md-offset-2');
                if(elem){
                    elem.style.left = '2px';
                }
            }, 200);
        };

        $scope.addAssets = function () {
            if(!$scope.isCustomAsset && $scope.selectedPreListedAsset){
                $scope.assetParams = {
                    description: $scope.selectedPreListedAsset.name,
                    currency_code: $scope.selectedPreListedAsset.code,
                    address: $scope.selectedPreListedAsset.address,
                    unit: $scope.selectedPreListedAsset.unit,
                    symbol: $scope.selectedPreListedAsset.symbol,
                    org_name: null,
                    name: null,
                    logo: $scope.selectedPreListedAsset.icon
                };
                delete $scope.assetParams['org_name'];
                delete $scope.assetParams['name'];
            }
            $scope.assetParams.currency_code = $scope.assetParams.currency_code.toUpperCase();
            $scope.addingassets = true;

            $http.post(vm.baseUrl + 'admin/asset/', $scope.assetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingassets = false;
                if (res.status === 201) {
                    toastr.success('Asset successfully added');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.fetchPreListedAssets = function(){
            $scope.addingassets = true;

            $http.get(vm.baseUrl + 'known-assets/', {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                $scope.selectedPreListedAsset = null;
                $scope.preListedAssetsList = res.data.data.results;
                if($scope.preListedAssetsList.length == 0){
                    $scope.isCustomAsset = true;
                }
                $scope.addingassets = false;
            }).catch(function (error) {
                $scope.addingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.fetchPreListedAssets();
            })
            .catch(function(err){
                $scope.addingassets = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
