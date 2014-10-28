'use strict';


// Patients controller
angular.module('patients').controller('PatientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patients', 'Logger', 'lodash', 'moment', '$modal', '$upload',
    function ($scope, $stateParams, $location, Authentication, Patients, Logger, lodash, Moment, $modal, $upload) {
        $scope.authentication = Authentication;
        $scope._ = lodash;
        $scope.Moment = Moment;
        $scope.genders = [
            {_id: 'male', name: 'Male'},
            {_id: 'female', name: 'Female'}
        ];
        $scope.photo = null;
        //$scope.photoCss = "{'background-image': 'url('+$scope.photo+')'}";

        //region Date functions
        $scope.today = function () {
            $scope.patient.birthDate = new Moment();
        };

        $scope.clear = function () {
            $scope.patient.birthDate = null;
        };

        $scope.maxDate = new Moment();
        $scope.minDate = new Moment().subtract(150, 'years');

        $scope.openDatePicker = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 6
        };

        $scope.format = 'yyyy/MM/dd';

        $scope.ageChanged = function (age) {
            $scope.patient.birthDate = new Moment().subtract(age, 'years').format('YYYY/MM/DD');
        };

        $scope.birthDateChanged = function (birthDate) {
            $scope.patient.age = new Moment().diff(new Moment(birthDate), 'years');
        };


//endregion Date Functions

        //region Helper functions

        lodash.mixin({
            'findByValues': function (collection, property, values) {
                return lodash.filter(collection, function (item) {
                    return lodash.contains(values, item[property]);
                });
            }
        });

        lodash.mixin({
            'findByValuesInPath': function (collection, property, values, path) {
                return lodash.filter(collection, function (item) {
                    return lodash.contains(lodash.map(values, path), item[property]);
                });
            }
        });

        //endregion Helper functions
        //region Photo
        //$scope.items = ['item1', 'item2', 'item3'];

        $scope.openModal = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (finalPhoto) {
                //console.log(finalPhoto);
                $scope.photo = finalPhoto;
                $scope.photoCss = "{'background-image': 'url('+$scope.photo+')'}";
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        //endregion Photo


        //select Gender
        $scope.toggleGenderSelection = function (gender_id) {
            //console.log(role_id);
            $scope.patient.gender = gender_id;
            //console.log($scope.manageUser._role);
        };


        var dataURItoBlob = function (dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: mimeString});
        };

        // Create new Patient
        $scope.create = function () {
            // Create new Patient object
            var patient = angular.fromJson(angular.toJson($scope.patient));
            if($scope.photo){
                lodash.extend(patient,{personalPhoto:true});
            }
            var blob = ($scope.photo)?dataURItoBlob($scope.photo):null;
            $upload.upload({
                url: '/patients', //upload.php script, node.js route, or servlet url
                method: 'POST',
                headers: {'Content-Type': 'multipart/form-data'},
                //withCredentials: true,
                data: patient,
                file: blob, // or list of files ($files) for html5 only
                fileName: 'personal-photo' // to modify the name of the file(s)
                // customize file formData name ('Content-Disposition'), server side file variable name.
                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
            }).success(function (response, status) {
                    $location.path('patients/' + response.id);

                    if (response.warn) {
                        Logger.warn(response.error.message, true);
                    }
                    else {
                        ///log success message
                        Logger.success('Patient created successfully', true);
                    }
                    // Clear form fields
                    $scope.initOne();
                }
            ).error(function (err) {
                    Logger.error(err, true);
                }
            );

            // Redirect after save
            /*patient.$save(function (response) {


             }, function (errorResponse) {
             ///log error message
             Logger.error(errorResponse.data.message, true);

             //$scope.error = errorResponse.data.message;
             });*/
        };

        // Remove existing Patient
        $scope.remove = function (patient) {
            if (patient) {
                patient.$remove(function () {
                    for (var i in $scope.patients) {
                        if ($scope.patients [i] === patient) {
                            $scope.patients.splice(i, 1);
                        }
                    }
                    ///log success message
                    Logger.success('Patient deleted successfully', true);
                }, function (errorResponse) {
                    ///log error message
                    Logger.error(errorResponse.data.message, true);
                });

            } else {
                $scope.patient.$remove(function () {
                    $location.path('patients');
                    ///log success message
                    Logger.success('Patient deleted successfully', true);
                }, function (errorResponse) {
                    ///log error message
                    Logger.error(errorResponse.data.message, true);
                });
            }
        };

        // Update existing Patient
        $scope.update = function () {
            var patient = $scope.patient;

            patient.$update(function () {
                $location.path('patients/' + patient.id);
                ///log success message
                Logger.success('Patient updated successfully', true);

            }, function (errorResponse) {
                ///log error message
                Logger.error(errorResponse.data.message, true);

                //$scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Patients
        $scope.find = function () {
            $scope.patients = Patients.query();
        };

        // Find existing Patient
        $scope.findOne = function () {
            $scope.patient = Patients.get({
                patientId: $stateParams.patientId
            }, function(){
                if($scope.patient.personalPhoto){
                    var filePath = 'patients/personal-photo/'+$scope.patient.id;
                    $scope.patient.personalPhoto=filePath;
                }
            });
        };

        // Find existing Patient
        $scope.initOne = function () {
            $scope.patient = new Patients({});
        };
    }
]);

angular.module('patients').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, Logger) {
//region Tabs
    $scope.tabs = [
        { active: true, disabled: false },
        { active: false, disabled: false },
        { active: false, disabled: true }
    ];
    //endregion Tabs

    var _video = null;
    $scope.photos = [];
    $scope.onSuccess = function (videoElem) {
        _video = videoElem;
    };
    $scope.photoWidth = null;
    $scope.photoHeight = null;
    $scope.finalPhoto = null;
    var getVideoData = function getVideoData() {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        $scope.photoWidth = document.defaultView.getComputedStyle(_video, "").getPropertyValue("width");
        $scope.photoHeight = document.defaultView.getComputedStyle(_video, "").getPropertyValue("height");
        return hiddenCanvas.toDataURL();//ctx.getImageData(0, 0,_video.width, _video.height);
    };
    $scope.makeSnapshot = function makeSnapshot() {
        //console.log('makeSnapshot');
        if (_video) {
            //console.log(_video);
            var idata = getVideoData();
            //console.log(idata);
            $scope.photos.push({src: idata})
        }
    };
    $scope.selectedPhoto = null;

    var img = new Image();
    img.onload = function () {
        var width = this.width;
        var height = this.height;
        var src = this.src;
        /*$scope.photoWidth = width;
         $scope.photoHeight = height;
         $scope.selectPhoto(src);*/
        //$scope.photoWidth = width;
        //$scope.photoHeight = height;
        /*$scope.$apply(function($scope) {
         $scope.photoWidth = width;
         $scope.photoHeight = height;

         //$scope.selectPhoto(src);
         });*/

    };

    $scope.inputImage = null;
    $scope.inputPhoto = function (files) {
        var file = files[0];
        //console.log(file);
        var reader = new FileReader();
        reader.onload = function (evt) {
            //console.log(evt);
            $scope.$apply(function ($scope) {
                $scope.inputImage = evt.target.result;
                img.src = evt.target.result;
                //$scope.selectedPhoto=evt.target.result;
                //console.log(evt.target.result);
                //$scope.tabs[2].disabled=false;
                //$scope.tabs[2].active=true;
            });
        };
        reader.readAsDataURL(file);

    };

    $scope.selectInputPhoto = function () {
        $scope.photoWidth = img.width;
        $scope.photoHeight = img.height;
        console.log($scope.photoWidth);
        console.log($scope.photoHeight);
        $scope.tabs[2].disabled = false;
        //$scope.tabs[2].active=true;
    }


    $scope.selectPhoto = function (photo) {
        //console.log('select photop');
        //console.log($scope.photoWidth);
        //console.log($scope.photoHeight);
        $scope.selectedPhoto = photo;
        $scope.tabs[2].disabled = false;
        $scope.tabs[2].active = true;

    }
    /*$scope.savePhoto=function(media){
     console.log('media\n\r');
     console.log(media);
     };*/

    $scope.webcamError = false;

    $scope.onCamError = function (err) {
        $scope.$apply(function () {
            $scope.webcamError = err;
        });
    }

    $scope.photoCropped = function ($dataURI) {
        $scope.finalPhoto = $dataURI;
        //console.log($dataURI);
    };

    $scope.ok = function () {
        //console.log($scope.finalPhoto);
        $modalInstance.close($scope.finalPhoto);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    //alert(err);
    //Logger.error(err,true);

});

angular.module('patients').directive('backImg', function () {
    return function (scope, element, attrs) {
        attrs.$observe('backImg', function (value) {
            element.css({
                'background-image': 'url(' + value + ')'
            });
        });
    };
});

angular.module('patients').directive('widthCss', function () {
    return function (scope, element, attrs) {
        attrs.$observe('widthCss', function (value) {
            element.css({
                'width': value
            });
        });
    };
});


angular.module('patients').directive('heightCss', function () {
    return function (scope, element, attrs) {
        attrs.$observe('heightCss', function (value) {
            element.css({
                'height': value
            });
        });
    };
});