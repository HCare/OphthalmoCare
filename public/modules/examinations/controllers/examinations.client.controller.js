'use strict';

// Examinations controller
angular.module('examinations').controller('ExaminationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Examinations', 'lodash', '$q','Patient','CoreProperties','ActionsHandler','Toolbar',
	function($scope, $stateParams, $location, Authentication, Examinations, lodash, $q, Patient, CoreProperties, ActionsHandler, Toolbar) {
		$scope.authentication = Authentication;
        //$scope.examination={};
        /*$scope.examination.colors=null;
        $scope.availableColors=['Red', 'Green', 'Yellow', 'Cool', 'Purple', 'Moove', 'Create', 'Do']*/
        $scope.tagTransform = function (newTag) {
            var item = {
                label: newTag,
                value:newTag.toLowerCase()
            };
            return item;
        };

       //region schema form
        $scope.form=[
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"appearanceOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                tagging: $scope.tagTransform ,
                                taggingLabel: '(new)',
                                taggingTokens: 'ENTER'
                            }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Appearance</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"appearanceOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"eyeLidOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Eye Lid</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"eyeLidOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"lacrimalSystemOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Lacrimal System</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"lacrimalSystemOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"conjunctivaOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Conjunctiva</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"conjunctivaOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"scleraOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Sclera</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"scleraOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"corneaOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Cornea</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"corneaOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"anteriorChamberOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Anterior Chamber</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"anteriorChamberOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"irisOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Iris</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"irisOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"pupilOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Pupil</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"pupilOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"lensOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Lens</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"lensOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"fundusOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Fundus</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"fundusOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"opticNerveOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">Optic Nerve</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"opticNerveOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"eomOD",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">EOM</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"eomOS",
                                feedback:"{'glyphicontop': true, 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError()}",
                                notitle: true,
                                options : {
                                    tagging: $scope.tagTransform ,
                                    taggingLabel: '(new)',
                                    taggingTokens: 'ENTER'
                                }}
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"vaOD",
                                type:"text",
                                notitle: true
                            }
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">V/A</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"vaOS",
                                notitle: true,
                                type:"text"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"bcvaOD",
                                type:"text",
                                notitle: true
                            }
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">BCVA</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"bcvaOS",
                                notitle: true,
                                type:"text"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"bcvaWithOD",
                                type:"text",
                                notitle: true
                            }
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">BCVA With</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"bcvaWithOS",
                                notitle: true,
                                type:"text"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "section",
                "htmlClass": "row",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"iopOD",
                                type:"text",
                                notitle: true
                            }
                        ]
                    },
                    {
                        "type": "help",
                        "helpvalue":"<label class=\"control-label ng-binding\">IOP</label>",
                        "htmlClass": "col-xs-2 col-centered"
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5",
                        "items": [
                            {   key:"iopOS",
                                notitle: true,
                                type:"text"
                            }
                        ]
                    }
                ]
            },
            {
                "key": "comment",
                "type": "textarea",
                "placeholder": "Make a comment"
            },
            {
                "type": "submit",
                "style": "btn-default",
                "title": "OK"
            }
        ];

        $scope.schema={
            "type": "object",
            "title": "Examination",
            "properties": {
                "appearanceOD": {
                    "title": "Appearance",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal"
                    /*,
                    items: [
                        { value: '1', label: 'Normal' }
                    ]*/
                },
                "appearanceOS": {
                    "title": "Appearance",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal"
                    /*,
                    items: [
                        { value: '1', label: 'Normal' }
                    ]*/
                },
                "eyeLidOD": {
                    "title": "Eye Lid",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"No Abnormality Detected",
                    items: [
                        { value: 'rl', label: 'RL' },
                        { value: 'entropion', label: 'Entropion' },
                        { value: 'ectropion', label: 'Ectropion' },
                        { value: 'eistichiasis', label: 'Distichiasis' },
                        { value: 'ptosis', label: 'Ptosis' },
                        { value: 'chalazion', label: 'Chalazion' },
                        { value: 'stye', label: 'Stye' },
                        { value: 'blepharitis', label: 'Blepharitis' },
                        { value: 'mass', label: 'Mass' },
                        { value: 'madarosis', label: 'Madarosis' },
                        { value: 'epicanthaus', label: 'Epicanthaus' },
                        { value: 'blepharochalasis', label: 'Blepharochalasis' },
                        { value: 'dermatochalasis', label: 'Dermatochalasis' },
                        { value: 'oedema', label: 'Oedema' }
                    ]
                },
                "eyeLidOS": {
                    "title": "Eye Lid",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"No Abnormality Detected",
                    items: [
                        { value: 'rl', label: 'RL' },
                        { value: 'entropion', label: 'Entropion' },
                        { value: 'ectropion', label: 'Ectropion' },
                        { value: 'eistichiasis', label: 'Distichiasis' },
                        { value: 'ptosis', label: 'Ptosis' },
                        { value: 'chalazion', label: 'Chalazion' },
                        { value: 'stye', label: 'Stye' },
                        { value: 'blepharitis', label: 'Blepharitis' },
                        { value: 'mass', label: 'Mass' },
                        { value: 'madarosis', label: 'Madarosis' },
                        { value: 'epicanthaus', label: 'Epicanthaus' },
                        { value: 'blepharochalasis', label: 'Blepharochalasis' },
                        { value: 'dermatochalasis', label: 'Dermatochalasis' },
                        { value: 'oedema', label: 'Oedema' }
                    ]
                },
                "lacrimalSystemOD": {
                    "title": "Lacrimal System",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal"
                    /*,
                     items: [
                     { value: '1', label: 'Normal' }
                     ]*/
                },
                "lacrimalSystemOS": {
                    "title": "Lacrimal System",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal"
                    /*,
                     items: [
                     { value: '1', label: 'Normal' }
                     ]*/
                },
                "conjunctivaOD": {
                    "title": "Conjunctiva",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal",
                    items: [
                        { value: 'active-trachoma', label: 'Active trachoma' },
                        { value: 't-iii', label: 'T III' },
                        { value: 'mpc', label: 'MPC' },
                        { value: 'pc', label: 'PC' },
                        { value: 'allergy', label: 'Allergy' },
                        { value: 'vernal-keratoconjunctivitis', label: 'Vernal keratoconjunctivitis' },
                        { value: 'ptrygeum', label: 'Ptrygeum' },
                        { value: 'ptds', label: 'PTDs' }
                    ]
                },
                "conjunctivaOS": {
                    "title": "Conjunctiva",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal",
                    items: [
                        { value: 'active-trachoma', label: 'Active trachoma' },
                        { value: 't-iii', label: 'T III' },
                        { value: 'mpc', label: 'MPC' },
                        { value: 'pc', label: 'PC' },
                        { value: 'allergy', label: 'Allergy' },
                        { value: 'vernal-keratoconjunctivitis', label: 'Vernal keratoconjunctivitis' },
                        { value: 'ptrygeum', label: 'Ptrygeum' },
                        { value: 'ptds', label: 'PTDs' }
                    ]
                },
                "scleraOD": {
                    "title": "Sclera",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal",
                    items: [
                        { value: 'nodular-episcleritis', label: 'Nodular Episcleritis' },
                        { value: 'diffuse-episcleritis', label: 'Diffuse Episcleritis' },
                        { value: 'scleritis', label: 'Scleritis' }
                    ]
                },
                "scleraOS": {
                    "title": "Sclera",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal",
                    items: [
                        { value: 'nodular-episcleritis', label: 'Nodular Episcleritis' },
                        { value: 'diffuse-episcleritis', label: 'Diffuse Episcleritis' },
                        { value: 'scleritis', label: 'Scleritis' }
                    ]
                },
                "corneaOD": {
                    "title": "Cornea",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Ps, Clear Centre",
                    items: [
                        { value: 'scar-of-previous-op.', label: 'Scar of previous op.' },
                        { value: 'ps', label: 'Ps' },
                        { value: 'nebula', label: 'Nebula' },
                        { value: 'corneal-ulcer', label: 'Corneal Ulcer' },
                        { value: 'leukoma-adherent', label: 'Leukoma adherent' },
                        { value: 'leukoma-non-adherent', label: 'Leukoma non-adherent' },
                        { value: 'keratitis', label: 'Keratitis' },
                        { value: 'keratoconus', label: 'Keratoconus' },
                        { value: 'arcus-senilis', label: 'Arcus senilis' },
                        { value: 'degeneration', label: 'Degeneration' },
                        { value: 'stromal-dystophy', label: 'Stromal Dystophy' },
                        { value: 'endothelial-dystophy', label: 'Endothelial Dystophy' },
                        { value: 'epithelial-oedema', label: 'Epithelial Oedema' },
                        { value: 'stromal oedema', label: 'Stromal Oedema' },
                        { value: 'striated-keratopathy', label: 'Striated Keratopathy' }
                    ]
                },
                "corneaOS": {
                    "title": "Cornea",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Ps, Clear Centre",
                    items: [
                        { value: 'scar-of-previous-op.', label: 'Scar of previous op.' },
                        { value: 'ps', label: 'Ps' },
                        { value: 'nebula', label: 'Nebula' },
                        { value: 'corneal-ulcer', label: 'Corneal Ulcer' },
                        { value: 'leukoma-adherent', label: 'Leukoma adherent' },
                        { value: 'leukoma-non-adherent', label: 'Leukoma non-adherent' },
                        { value: 'keratitis', label: 'Keratitis' },
                        { value: 'keratoconus', label: 'Keratoconus' },
                        { value: 'arcus-senilis', label: 'Arcus senilis' },
                        { value: 'degeneration', label: 'Degeneration' },
                        { value: 'stromal-dystophy', label: 'Stromal Dystophy' },
                        { value: 'endothelial-dystophy', label: 'Endothelial Dystophy' },
                        { value: 'epithelial-oedema', label: 'Epithelial Oedema' },
                        { value: 'stromal oedema', label: 'Stromal Oedema' },
                        { value: 'striated-keratopathy', label: 'Striated Keratopathy' }
                    ]
                },
                "anteriorChamberOD": {
                    "title": "Anterior Chamber",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal Depth No Abnormal Content",
                    items: [
                        { value: 'cells', label: 'Cells' },
                        { value: 'flare', label: 'Flare' },
                        { value: 'level-hyphema', label: 'level Hyphema' },
                        { value: 'diffuse-hyphema', label: 'Diffuse Hyphema' },
                        { value: 'inflammatory-membrane', label: 'Inflammatory membrane' },
                        { value: 'hypopion', label: 'Hypopion' }
                    ]
                },
                "anteriorChamberOS": {
                    "title": "Anterior Chamber",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal Depth No Abnormal Content",
                    items: [
                        { value: 'cells', label: 'Cells' },
                        { value: 'flare', label: 'Flare' },
                        { value: 'level-hyphema', label: 'level Hyphema' },
                        { value: 'diffuse-hyphema', label: 'Diffuse Hyphema' },
                        { value: 'inflammatory-membrane', label: 'Inflammatory membrane' },
                        { value: 'hypopion', label: 'Hypopion' }
                    ]
                },
                "irisOD": {
                    "title": "Iris",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal Color And Pattern"
                    /*,
                     items: [
                     { value: '1', label: 'Normal' }
                     ]*/
                },
                "irisOS": {
                    "title": "Iris",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal Color And Pattern"
                    /*,
                     items: [
                     { value: '1', label: 'Normal' }
                     ]*/
                },
                "pupilOD": {
                    "title": "Pupil",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"R R R Direct and Cons."
                    /*,
                     items: [
                     { value: '1', label: 'Normal' }
                     ]*/
                },
                "pupilOS": {
                    "title": "Pupil",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"R R R Direct and Cons."
                    /*,
                     items: [
                     { value: '1', label: 'Normal' }
                     ]*/
                },
                "lensOD": {
                    "title": "Lens",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Clear In Place",
                    items: [
                        { value: 'imsc', label: 'IMSC' },
                        { value: 'nuclear-cataract', label: 'Nuclear cataract' },
                        { value: 'complicated-cataract', label: 'Complicated cataract' },
                        { value: 'subluxated', label: 'Subluxated' },
                        { value: 'pseudoexfoliation', label: 'Pseudoexfoliation' },
                        { value: 'microspherophakia', label: 'Microspherophakia' }
                    ]
                },
                "lensOS": {
                    "title": "Lens",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Clear In Place",
                    items: [
                        { value: 'imsc', label: 'IMSC' },
                        { value: 'nuclear-cataract', label: 'Nuclear cataract' },
                        { value: 'complicated-cataract', label: 'Complicated cataract' },
                        { value: 'subluxated', label: 'Subluxated' },
                        { value: 'pseudoexfoliation', label: 'Pseudoexfoliation' },
                        { value: 'microspherophakia', label: 'Microspherophakia' }
                    ]
                },
                "fundusOD": {
                    "title": "Fundus",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal",
                    items: [
                        { value: 'tessellated', label: 'Tessellated' },
                        { value: 'myopic', label: 'Myopic' },
                        { value: 'mild-npdr', label: 'Mild NPDR' },
                        { value: 'sever npdr', label: 'Sever NPDR' },
                        { value: 'pdr', label: 'PDR' },
                        { value: 'macular-oedema', label: 'Macular Oedema' },
                        { value: 'drusen', label: 'Drusen' },
                        { value: 'amd', label: 'AMD' },
                        { value: 'vein-occlusion', label: 'Vein occlusion' },
                        { value: 'artery-occlusion', label: 'Artery occlusion' }
                    ]
                },
                "fundusOS": {
                    "title": "Fundus",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal",
                    items: [
                        { value: 'tessellated', label: 'Tessellated' },
                        { value: 'myopic', label: 'Myopic' },
                        { value: 'mild-npdr', label: 'Mild NPDR' },
                        { value: 'sever npdr', label: 'Sever NPDR' },
                        { value: 'pdr', label: 'PDR' },
                        { value: 'macular-oedema', label: 'Macular Oedema' },
                        { value: 'drusen', label: 'Drusen' },
                        { value: 'amd', label: 'AMD' },
                        { value: 'vein-occlusion', label: 'Vein occlusion' },
                        { value: 'artery-occlusion', label: 'Artery occlusion' }
                    ]
                },
                "opticNerveOD": {
                    "title": "Optic Nerve",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal",
                    items: [
                        { value: 'pale', label: 'Pale' },
                        { value: 'atrophy', label: 'Atrophy' },
                        { value: 'increased-cd-ratio', label: 'Increased C/D ratio' },
                        { value: 'cupping', label: 'Cupping' },
                        { value: 'papilloedema', label: 'Papilloedema' },
                        { value: 'tilted', label: 'Tilted' }
                    ]
                },
                "opticNerveOS": {
                    "title": "Optic Nerve",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Normal",
                    items: [
                        { value: 'pale', label: 'Pale' },
                        { value: 'atrophy', label: 'Atrophy' },
                        { value: 'increased-cd-ratio', label: 'Increased C/D ratio' },
                        { value: 'cupping', label: 'Cupping' },
                        { value: 'papilloedema', label: 'Papilloedema' },
                        { value: 'tilted', label: 'Tilted' }
                    ]
                },
                "eomOD": {
                    "title": "EOM",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Free Balanced Ocular Motility In The Sex Cardinal Directions"
                    /*,
                     items: [
                     { value: '1', label: 'Normal' }
                     ]*/
                },
                "eomOS": {
                    "title": "EOM",
                    "type": "array",
                    format: "uiselect",
                    placeholder:"Free Balanced Ocular Motility In The Sex Cardinal Directions"
                    /*,
                     items: [
                     { value: '1', label: 'Normal' }
                     ]*/
                },
                "vaOD":{
                    "title":"V/A",
                    "type":"string"
                },
                "vaOS":{
                    "title":"V/A",
                    "type":"string"
                },
                "bcvaOD":{
                    "title":"BCVA",
                    "type":"string"
                },
                "bcvaOS":{
                    "title":"BCVA",
                    "type":"string"
                },
                "bcvaWithOD":{
                    "title":"BCVA With",
                    "type":"string"
                },
                "bcvaWithOS":{
                    "title":"BCVA With",
                    "type":"string"
                },
                "iopOD":{
                    "title":"IOP",
                    "type":"string"
                },
                "iopOS":{
                    "title":"IOP",
                    "type":"string"
                },
                "comment": {
                    "title": "Comment",
                    "type": "string",
                    "maxLength": 20,
                    "validationMessage": "Don't be greedy!"
                }
            },
            "required": [
                "name",
                "email",
                "comment"
            ]
        };


        $scope.onSubmit = function(form) {
            // First we broadcast an event so all fields validate themselves
            $scope.$broadcast('schemaFormValidate');

            // Then we check if the form is valid
            if (form.$valid) {
                console.log($scope.examination.eyelid);
                //$scope.create();
            }
        }
        //endregion schema form

      		// Create new Examination
		$scope.create = function() {
			// Create new Examination object
			var examination = new Examinations ({
				name: this.name
			});

			// Redirect after save
			examination.$save(function(response) {
				$location.path('examinations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Examination
		$scope.remove = function( examination ) {
			if ( examination ) { examination.$remove();

				for (var i in $scope.examinations ) {
					if ($scope.examinations [i] === examination ) {
						$scope.examinations.splice(i, 1);
					}
				}
			} else {
				$scope.examination.$remove(function() {
					$location.path('examinations');
				});
			}
		};

		// Update existing Examination
		$scope.update = function() {
			var examination = $scope.examination ;

			examination.$update(function() {
				$location.path('examinations/' + examination._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Examinations
		$scope.find = function() {
			$scope.examinations = Examinations.query();
		};

		// Find existing Examination
		$scope.findOne = function() {
			$scope.examination = Examinations.get({ 
				examinationId: $stateParams.examinationId
			});
		};

        $scope.initOne=function(){
            var patient=Patient.getCurrentPatient();
            if(patient){
                CoreProperties.setPageSubTitle(patient.fullName);
                Toolbar.addToolbarCommand('clearExamination', null, 'Clear', 'clear', 0);
                Toolbar.addToolbarCommand('saveExamination', 'create_examination', 'Save', 'save', 1);

            }
            $scope.examination = new Examinations({});
        }

        ActionsHandler.onActionFired('fire', $scope, function(action, args) {
            console.log('event received');
            //console.log(action.name);
        });
	}
]);