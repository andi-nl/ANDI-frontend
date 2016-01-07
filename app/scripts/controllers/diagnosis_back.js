'use strict';

/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */


app.controller('EditableColumnCtrl', function($scope, $filter, $http, $q) {
  $scope.users = [
    {id: 1, name: 'Age', status: 2},
    {id: 2, name: 'Sex', status: 1},
    {id: 3, name: 'Education', status: 2}
  ]; 

  $scope.rows = [
    {id: 1, name: 'comes from tree', status: 2}
  ]; 

  $scope.columns = [
    {id: 1, name: 'Patient', status: 2}
  ]; 


  $scope.sex = [
    {value:1,text:'Female'},
    {value:2,text:'Male'}
  ];



  $scope.education=[
    {value:1,text:'Primary'},
    {value:2,text:'Secondary'},
    {value:3,text:'High Secondary'},
    {value:4,text:'High School'},
    {value:5,text:'University degree'},
    {value:6,text:'Highly Educated'},
    {value:7,text:'Other'}
  ];

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ]; 

  $scope.tests = {'test1':true, 'test2':true, 'test3':false};

  $scope.patients = [
    {'age':22, 'test1': 1, 'test2': 2}, 
    {'age':23, 'test1': 3, 'test2':4}, 
    {'age':23, 'test1': 3, 'test2':4}
  ];

  $scope.showStatus = function(user) {
    var selected = [];
    if(user.status) {
      selected = $filter('filter')($scope.sex, {value: user.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };


  $scope.showEducation = function(user) {
    var selected = $filter('filter')($scope.education, 
    {
      value: $scope.education
    });
    return ($scope.education && selected.length) ? selected[0].text : 'Not set';
  };


  $scope.showSex = function() {
    var selected = $filter('filter')($scope.sex, 
    {
      value: $scope.sex
    });
    return ($scope.sex && selected.length) ? selected[0].text : 'Not set';
  };

  $scope.showAge = function() {
          dob: new Date(1984, 4, 15);
  };


  $scope.addRow = function() {
    $scope.inserted = {
      id: $scope.rows.length+1,
      name: '',
      status:null
    };
    $scope.rows.push($scope.inserted);
  };


  $scope.addPatient = function() {
    alert("Hello World")
  };

});

app.run(function(editableOptions) {
  editableOptions.theme = 'bs2'; // bootstrap3 theme. Can be also 'bs2', 'default'

});


app.controller('radarCtrl',function ($http){
  var ctrl = this;
        // function init
    ctrl.init = function() {
      // initialize controller variables
      ctrl.examples = [
        "patient_data",
        "data_plant_seasons",
        "data_car_ratings"
      ];
      ctrl.exampleSelected = ctrl.examples[0];

      // initialize controller functions
      ctrl.selectExample(ctrl.exampleSelected);
      ctrl.config = {
        w: 250,
        h: 250,
        facet: false,
        levels: 5,
        levelScale: 0.85,
        labelScale: 0.9,
        facetPaddingScale: 2.1,
        showLevels: true,
        showLevelsLabels: false,
        showAxesLabels: true,
        showAxes: true,
        showLegend: true,
        showVertices: true,
        showPolygons: true
      };
    }

    // function getData
    ctrl.getData=function($fileContent) {
      ctrl.csv = $fileContent;
    }

    // function selectExample
    ctrl.selectExample=function(item) {
      var file = item + ".csv";
      $http.get(file).success(function(data) {
        ctrl.csv = data;
      });
    }
    ctrl.init();

});

app.controller('RCtrl', function ($scope){
  $("#cmdGoR").click(function () {
              var resultsUrlPrefix = "http://public.opencpu.org",
                  url = resultsUrlPrefix + "/ocpu/library/base/R/identity/save";
              var rCommands = $("#txtRCommands").val();
              $.post(url,
              {
                  x: rCommands
              },
              function (data) {
                
                var statResultsLink = resultsUrlPrefix + data.toString().match(/.+\/stdout/m),
                    chartLink = resultsUrlPrefix + data.toString().match(/.+\/graphics\/[1]/m);
               
                  //Add statistical (textual) results to results div
                  $('#results').append("<br/>");
                  $('<div/>', {
                      id: 'statResults'
                  }).appendTo('#results');
                
                  $("#statResults").load(statResultsLink);

                  //Add charts results to results div
                  $('#results').append("<br/>");
                    $('<img/>', {
                        id: 'chartResults',
                        src: chartLink
                    }).appendTo('#results');

              })
              .error(function (jqXHR, status, error) {
                  alert(jqXHR.responseText);
              });
          });

});

app.directive('radar',function($scope){
      return {
        restrict: "AE",
        scope: {
          csv: "=",
          config: "="
        },
        link: radarDraw
      };
  });
 

app.directive('onReadFile',function($parse) {
      return {
        restrict: "A",
        scope: false,
        link: function(scope, element, attrs) {
          var fn = $parse(attrs.onReadFile);
          element.on("change", function(onChangeEvent) {
            var reader = new FileReader();
            reader.onload = function(onLoadEvent) {
              scope.$apply(function() {
                fn(scope, {
                  $fileContent: onLoadEvent.target.result
                });
              });
            };
            reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
          });
        }
      };
  });

app.controller('treeCtrl', function ($scope) {

$scope.data =
[
    { "name" : "Intelligence tests / premorbid IQ tests", "children" : [
          { "name" : "Dutch Adult Reading Test (DART/NART)", "children" : [] 
          },
          { "name" : "Wechsler Adult Intelligence Scale", "children" : [] 
          },
          { "name" : "WAIS-NL (1970)","children": [
            {"name": "WAIS_NL_Digitspan","children":[]},
            {"name": "WAIS_NL_Information","children":[]},
            {"name": "WAIS_NL_arithmetic","children":[]},
            {"name": "WAIS_NL_Similarities","children":[]},
            {"name": "WAIS_NL_Coding","children":[]},
            {"name": "WAIS_NL_PictureCompletion","children":[]},
            {"name": "WAIS_NL_BlockDesign","children":[]}
          ] 
          },
          { "name" : "WAIS-R","children" : 
            [
                  {"name" : "WAIS_R_Digitspan", "children" : []},
                  {"name" : "WAIS_R_Coding", "children" : []}
            ]
        },
        { "name" : "WAIS-III_NL","children": [
            {"name": "WAIS_III_NL_VisualPuzzle","children":[]},
            {"name": "WAIS_III_NL_Comprehension","children":[]},
            {"name": "WAIS_III_NL_SymbolSearch","children":[]},
            {"name": "WAIS_III_NL_Information","children":[]},
            {"name": "WAIS_III_NL_Arithmetic","children":[]},
            {"name": "WAIS_III_LeNoSeq","children":[]},
            {"name": "WAIS_III_NL_PictureComplet","children":[]},
            {"name": "WAIS_III_NL_Similarities","children":[]},
            {"name": "WAIS_III_NL_Coding","children":[]},
            {"name": "WAIS_III_NL_Digitspan","children":[]},
            {"name": "WAIS_III_NL_LetterNumber_Sequencing","children":[]},
            {"name": "WAIS_III_NL_MatrixReasoning","children":[]},
            {"name": "WAIS_III_NL_BlockDesign","children":[]},
            {"name": "WAIS_III_NL_Vocabulary","children":[]}            
          ] 
          },
          { "name" : "WAIS-IV_NL", "children" : 
              [
                  { "name" : "WAIS-IV_Digitspan", "children" : [] },
                { "name" : "WAIS-IV Picture Completion", "children" : [] }
              ]
            },   
            {"name": "Wechsler Memory Scales","children":[]},
            {"name": "WMS-R_NL","children":[
                          {"name": "WMS_R_NL_WordPairs","children":[]},
                          {"name": "WMS_R_NL_VisualRepro","children":[]},
                          {"name": "WMS_R_NL_Digitspan","children":[]},
                          {"name": "WMS_R_NL_PatternRecognition","children":[]},
                          {"name": "WMS_R_NL_VisualPairedAssociation","children":[]}
           ]},
          { "name" : "WMS-III_NL", "children" : 
              [
                  { "name" : "WMS_III_NL_SpatialSpan", "children" : [] },
                { "name" : "WMS_III_NL_FaceRecog", "children" : [] }
              ]
            },
            {"name": "Coding Task","children":[]}, 
            {"name": "Wechsler Intelligence Scale Children","children":[]}, 
            {"name": "WISC_NL","children":[
              {"name": "WISC_NL_Mazes","children":[]}, 
            ]},
            {"name": "WISC-R_NL","children":[
              {"name": "WISC_R_NL_plaatjes","children":[]}, 
              {"name": "WISC_R_NL_rekenen","children":[]}, 
              {"name": "WISC_R_NL_blokpatronen","children":[]}, 
              {"name": "WISC_R_NL_woordenschat","children":[]}, 
              {"name": "WISC_R_NL_total","children":[]}, 
              {"name": "WISC_R_NL_Mazes","children":[]}, 
              ]
          }, 
            {"name": "WISC-III_NL","children":[
              {"name": "WISC_III_NL_SymbolSubstitution","children":[]}, 
              {"name": "WISC_III_NL_plaatjes","children":[]}, 
              {"name": "WISC_III_NL_blokpatronen","children":[]}, 
              {"name": "WISC_III_NL_rekenen","children":[]}, 
              {"name": "WISC_III_NL_woordkennis","children":[]}, 
              {"name": "WISC_III_NL_symbolcomparisson","children":[]},
              {"name": "WISC_III_NL_digitspan","children":[]}, 
              ]
          }, 
            {"name": "Groninger Intelligentie Test","children":[]}, 
            {"name": "GIT1","children":[
              {"name": "GIT1_Legkaarten","children":[]}, 
              {"name": "GIT1_Matrijzen","children":[]}, 
              {"name": "GIT1_Woordopnoemen","children":[]}, 
              {"name": "GIT1_Cijferen","children":[]},
              {"name": "GIT1_Lijntekeningen","children":[]}
            ]}, 
            {"name": "Raven Matrices","children":[]}, 
            {"name": "Raven Coloured Progressive Matrices (RCPM)","children":[]}, 
            {"name": "Raven Standard Progressive Matrices (RSPM)","children":[]}, 
            {"name": "Differentiële Aanleg Testserie (DAT):","children":[
              {"name": "DAT","children":[]}, 
            ]}
      ]
  },
    {"name" : "Language Tests", "children" : [
       { "name" : "Boston Naming Test (BNT)", "children" : [] },
       { "name" : "Token Test", "children" : [] },
       { "name" : "Peabody Picture Vocabulary Test-Third Edition (PPVT-III)", "children" : [] }      
    ] },
    { "name" : "Memory Tests", "children" : [
       { "name" : "Verbale Leer en Geheugen Taak (VLGT)", "children" : [] },
       { "name" : "(Rey) Auditory Verbal Learning Test (AVLT)", "children" : [] },
       { "name" : "10 Word Test (10wt)", "children" : [] },        
       { "name" : "(Rey) Visual Design Learning Test (VDLT)", "children" : [] },
       { "name" : "Rey Complex Figure Task (RCFT)", "children" : [] },       
       { "name" : "Boston Naming Test (BNT)", "children" : [] },
       { "name" : "Rivermead Behaviour Memory Test (RBMT)", "children" : [] },
       { "name" : "Benton Visual Retention Task (BVRT)", "children" : [] },
       { "name" : "The Enhanced Cued Recall Test (ECR)", "children" : [] },
       { "name" : "Visual Association Test (VAT)", "children" : [] },
       { "name" : "Corsi Block Tapping Test (Corsi)", "children" : [] }, 
       { "name" : "Fepsy Tapping Test (Fepsy)", "children" : [] },
       { "name" : "Self-ordered pointing task (SOP)", "children" : [] },
       { "name" : "Location Learning Test (LLT)", "children" : [] }, 
       { "name" : "Selective Reminding Test (SRT)", "children" : [] },
       { "name" : "Memory Update (MU)", "children" : [] },
       { "name" : "The Doors and People test (Doors)", "children" : [] },
     { "name" : "Amsterdamse Korte-Termijn Geheugen Taak (AKGT)", "children" : [] },
    ] },
    {"name" : "Perception Tests", "children" : [
       { "name" : "Benton’s Judgment of Line Orientation Test (JLO)", "children" : [] },
       { "name" : "Degraded Facial Affect Recognition (DFAR)", "children" : [] },
       { "name" : "Benton Face Recognition Test (BFRT)", "children" : [] },      
       { "name" : "Bourdon-Wierma dot cancellation Test (BD): ", "children" : [] },
       { "name" : "Bourdon-Vos Test (BVT)", "children" : [] }  
    ] },
    {"name" : "Motor/Praxis Tests", "children" : [
       { "name" : "Grooved Pegboard (GroPeg)", "children" : [] },
       { "name" : "Purdue Pegboard Test (PPT)", "children" : [] },
       { "name" : "Vienna Test System (VTS)", "children" : [] },       
       { "name" : "Beery VMI (BVMI)", "children" : [] }
    ] },
    {"name" : "Attention and Working Memory", "children" : [
       { "name" : "Trail Making Task (TMT)", "children" : [] },
       { "name" : "Stroop", "children" : [] },
       { "name" : "TestD2", "children" : [] },       
       { "name" : "Test battery of Attentional Performance (TAP)", "children" : [] },
       { "name" : "Paced Auditory Serial Addition Test (PASAT)", "children" : [] },
       { "name" : "HQ - Continuous Performance Test (HQ-CPT)", "children" : [] },  
    ] },    
    {"name" : "Executive Functions", "children" : [
       { "name" : "Semantic Fluency", "children" : [] },
       { "name" : "Letter Fluency", "children" : [] },
       { "name" : "The Five Point Test (FPT)", "children" : [] },      
       { "name" : "Wisconsin card sorting test (WCST)", "children" : [] },
       { "name" : "Behavioural Assessment of the Dysexecutive Syndrome (BADS)", "children" : [] },
       { "name" : "Ruff Figural Fluency Task (RFFT)", "children" : [] },  
       { "name" : "Tower of London (TOL)", "children" : [] },  
       { "name" : "Eriksen Flanker Task (FLANK)", "children" : [] },
       { "name" : "Brixton Spatial Anticipation Test (BSAT)", "children" : [] },  
       { "name" : "Hayling Sentence Completion Test (HSCT)", "children" : [] },  
       { "name" : "Response shifting task (RST)", "children" : [] }
    ] },
    {"name" : "Cognitive screening tools / dementia screening", "children" : [
       { "name" : "Mini-Metal state Examination (MMSE)", "children" : [] },
       { "name" : "Benton Temporal Orientation Test (BTO)", "children" : [] },
       { "name" : "7 minute dementia screen (SevenMin)", "children" : [] },      
       { "name" : "Cognitieve Screening Test (CST)", "children" : [] },
       { "name" : "Cambridge Cognitive Examination (CAMCOG)", "children" : [] },
       { "name" : "Montreal Cognitive Assessment (MoCA)", "children" : [] },  
       { "name" : "Mattis Dementia Scale (MDS)", "children" : [] },  
       { "name" : "Amsterdamse Dementie Screening Test (ADS)", "children" : [] },
       { "name" : "Cognitive Failures Questionnaire (CFQ)", "children" : [] },  
       { "name" : "Clock drawing", "children" : [] },  
       { "name" : "Symbol Digit Modalities Test (SDMT)", "children" : [] }
    ] },
    {"name" : "Social Cognition", "children" : [
       { "name" : "Emotion Recognition Task (ERT)", "children" : [] },
       { "name" : "Guilford’s Cartoon Predictions Test (GPT)", "children" : [] },
       { "name" : "Happe Cartoon test (HCT)", "children" : [] },       
       { "name" : "Reading the Mind in the Eyes test (RME)", "children" : [] },
       { "name" : "Hinting Task (HT)", "children" : [] }
    ] },    
    { "name" : "Questionnaires depression/anxiety", "children" : [
       { "name" : "Hospital Anxiety Depression Scale (HADS)", "children" : [] },
       { "name" : "Inventory of Depressive Symptomatology (IDS)", "children" : [] },
       { "name" : "Center for Epidemiological Studies Depression Scale (CES-D)", "children" : [] },        
       { "name" : "Profile of Mood States (POMS)", "children" : [] },
       { "name" : "Rand Mental Health Inventory (MHI)", "children" : [] },       
       { "name" : "Liebowitz Social Anxiety Scale (LSAL)", "children" : [] },
       { "name" : "The AMC Linear Disability Score (ALDS)", "children" : [] },
       { "name" : "The Short Form (36) Health Survey (SF-36)", "children" : [] },
       { "name" : "Symptom Checklist (SCL-90)", "children" : [] },
       { "name" : "NEO Five Factor Inventory (NEO-FFI)", "children" : [] },
       { "name" : "Multidimensional fatigue inventory (MFI-20)", "children" : [] }, 
       { "name" : "Utrechtse Coping Lijst (UCL)", "children" : [] },
       { "name" : "The World Health Organization Quality of Life (WHOQol)", "children" : [] },
       { "name" : "Becks Anxiety Inventory (BAI)", "children" : [] }, 
       { "name" : "Becks Depression Inventory (BDI)", "children" : [] },
       { "name" : "Hopkins Symptoms Checklist (HSCL-25)", "children" : [] },
       { "name" : "Cognitive Failures Questionnaire (CFQ)", "children" : [] },
     { "name" : "Checklist Individual Strength (CIS20r)", "children" : [] },
     { "name" : "Assesment of Depression Inventory (ADI)", "children" : [] }

    ] },
    { "name" : "ADHD / Children", "children" : [
       { "name" : "Wender Utah ADHD Rating Scale (WURS)", "children" : [] },
       { "name" : "Rösler ADHD questionnaire (RAQ)", "children" : [] },
       { "name" : "Connors’ Adult ADHD Rating Scale (CAARS)", "children" : [] },       
       { "name" : "ADHD Vragenlijst (AVL)", "children" : [] },
       { "name" : "Vragenlijst voor Inventarisatie van Sociaal Gedrag van Kinderen (VISK)", "children" : [] },       
       { "name" : "Strengths & Difficulties Questionnaires (SDQ)", "children" : [] },
       { "name" : "Child Behaviour Checklist (CBCL)", "children" : [] },
       { "name" : "Reynell Developmental Language Scales (RDLS)", "children" : [] },
       { "name" : "Behavior Rating Inventory of Executive Function(BRIEF)", "children" : [] },
       { "name" : "PedsQLTM 4.0", "children" : [] },
       { "name" : "Test of Everyday Attention for Children (TEA-CH)", "children" : [] }, 
       { "name" : "Disruptive Behavior Disorders (DBD)", "children" : [] },
       { "name" : "Vragenlijst voor Gedragsproblemen bij Kinderen 6-16 jaar (VVGK-16)", "children" : [] },
       { "name" : "Behavior Disorder Scale (BDS)", "children" : [] }, 
       { "name" : "Leidse Diagnostische Test (LDT)", "children" : [] },
       { "name" : "Children Communication Checklist (CCC)", "children" : [] },
       { "name" : "Gedragsvragenlijst voor Kleuters (GVK)", "children" : [] }

    ] },    
];

  $scope.selectOnly1Or2 = function(item, selectedItems) {
    if (selectedItems  !== undefined && selectedItems.length >= 20) {
      return false;
    } else {
      return true;
    }
  };

  $scope.switchViewCallback = function(scopeObj) {
      scopeObj.switchViewLabel = 'Multiple Test Selection';
      scopeObj.inputModel = data;
      scopeObj.selectOnlyLeafs = true;
      print (data)
  }

  $scope.getData=function(selectedItems){
    return(selectedItems)
  }

});
