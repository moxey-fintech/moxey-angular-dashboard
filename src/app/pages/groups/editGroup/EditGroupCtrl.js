(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.editGroup')
        .controller('EditGroupCtrl', EditGroupCtrl);

    /** @ngInject */
    function EditGroupCtrl($scope,localStorageManagement,Rehive,$stateParams,$location,errorHandler,toastr,environmentConfig,serializeFiltersService,Upload) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.groupName = ($stateParams.groupName == 'service') ? 'extension' : $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        vm.savedGroupColors = [];
        vm.colorIndex = -1;
        vm.companyColors = localStorageManagement.getValue('companyIdentifier') + "_group_colors";
        $scope.isPreset = false;
        // vm.color_picker = document.getElementById('editGroupColor');
        $scope.imageFile = {
            file: {},
            iconFile: {}
        };

        vm.initializeGroupHighlightColor = function(){
            vm.savedGroupColors = localStorageManagement.getValue(vm.companyColors) ? JSON.parse(localStorageManagement.getValue(vm.companyColors)) : [];
            vm.savedGroupColors.forEach(function(color){
                if(color.group === $scope.editGroupObj.name){
                    vm.colorIndex = vm.savedGroupColors.indexOf(color);
                    return;
                }
            });
            if(vm.colorIndex === -1){
                $scope.editGroupObj.group_highlight = {
                    group: $scope.editGroupObj.name,
                    color: "#022b36"
                };
                vm.savedGroupColors.push($scope.editGroupObj.group_highlight);
                vm.colorIndex = vm.savedGroupColors.length - 1;
            }else{
                $scope.editGroupObj.group_highlight = vm.savedGroupColors[vm.colorIndex];
            }
            // vm.color_picker.value = $scope.editGroupObj.group_highlight.color;
            // vm.color_picker.style.backgroundColor = vm.color_picker.value;
        };

        $scope.goToWalletExtension = function(view){
            $location.path('/extensions/app/app-config').search({showConfig: view});
        };

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.getGroup = function () {
            var groupName = $scope.groupName;
            if(groupName == 'extension'){
                groupName = 'service';
            }
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: groupName}).then(function (res) {
                    $scope.editGroupObj = res;
                    $scope.editGroupObj.prevName = res.name;
                    
                    if($scope.editGroupObj.name == 'service'){
                        $scope.editGroupObj.name = 'extension';
                        $scope.editGroupObj.label = 'Extension';
                        $scope.editGroupObj.prevName = 'extension';
                    }
                    $scope.isPreset = ($scope.editGroupObj.name === 'extension' || $scope.editGroupObj.name === 'admin');
                    if(!$scope.isPreset){
                        vm.initializeGroupHighlightColor();
                    }
                    $scope.loadingGroup = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroup();

        $scope.groupChanged = function(field){
            if(field == 'name' && $scope.editGroupObj.name){
                $scope.editGroupObj.name = $scope.editGroupObj.name.toLowerCase();
            }

            if(field == 'default' && $scope.editGroupObj.default){
                $scope.editGroupObj['public'] = true;
                vm.updatedGroup['public'] = $scope.editGroupObj['public'];
            } else if(field == 'public' && !$scope.editGroupObj.public){
                $scope.editGroupObj['default'] = false;
                vm.updatedGroup['default'] = $scope.editGroupObj['default'];
            }

            vm.updatedGroup[field] = $scope.editGroupObj[field];
        };

        $scope.trackColorChange = function(){
            $scope.editGroupObj.group_highlight.color = vm.color_picker.value;
            vm.color_picker.style.backgroundColor = vm.color_picker.value;
        };

        vm.updateGroupHighlightColor = function(){
            vm.savedGroupColors[vm.colorIndex] = $scope.editGroupObj.group_highlight;
            localStorageManagement.setValue(vm.companyColors, JSON.stringify(vm.savedGroupColors));
        };

        $scope.removeGroupIcon = function(){
            vm.updatedGroup.icon = null;
            $scope.updateGroupObj($scope.editGroupObj);

            // $scope.loadingGroup = true;
            // var null_img = new File([new Blob([], {type: 'image/png'})], null);
            // var formData = new FormData();
            // formData.append('file', null_img);
            
            // Upload.upload({
            //     url: environmentConfig.API +'admin/groups/' + $scope.editGroupObj.name + '/',
            //     data: {icon: null_img},
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': vm.token
            //     },
            //     method: "PATCH"
            // }).then(function (res) {
            //     if (res.status === 200 || res.status === 201) {
            //         toastr.success('Group icon removed successfully');
            //         $scope.loadingGroup = false;
            //         $scope.getGroup();
            //     }
            // }).catch(function (error) {
            //     $scope.loadingGroup = false;
            //     errorHandler.evaluateErrors(error.data);
            //     errorHandler.handleErrors(error);
            // });
        };

        $scope.uploadGroupIcon = function () {
            if(!$scope.imageFile.file.name && !$scope.imageFile.iconFile.name){
                return;
            }
            $scope.loadingGroup = true;

            var uploadDataObj = {
                // logo: $scope.imageFile.file.name ? $scope.imageFile.file : null,
                icon: $scope.imageFile.iconFile.name ? $scope.imageFile.iconFile : null
            };

            Upload.upload({
                url: environmentConfig.API +'admin/groups/' + $scope.editGroupObj.name + '/',
                data: serializeFiltersService.objectFilters(uploadDataObj),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                },
                method: "PATCH"
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    toastr.success('Group icon uploaded successfully');
                    $scope.loadingGroup = false;
                }
            }).catch(function (error) {
                $scope.loadingGroup = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.updateGroupObj = function (editGroupObj) {
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.update(editGroupObj.prevName,vm.updatedGroup).then(function (res) {
                    if(editGroupObj.prevName == editGroupObj.name){
                        $scope.loadingGroup = false;
                        toastr.success('Group successfully edited');
                        vm.updateGroupHighlightColor();
                        $scope.getGroup();
                    } else {
                        $location.path('/groups/' + res.name + '/details');
                        toastr.success('Group successfully edited');
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
