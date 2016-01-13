'use strict';

/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */

app.controller("PanelController",function(){
  this.tab=1;
  this.selectTab=function(setTab){
    this.tab=setTab;
  };
  this.isSelected=function(checkTab){
    return this.tab === checkTab;
  };

  this.previous =function(){
    return this.tab= this.tab-1;
  };
  this.next=function(){
    return this.tab = this.tab+1;
  };
});


app.controller('treeController', function() {

  this.tests=tests;
  


  this.awesomeCallback = function(node, tree) {
    // Do something with node or tree
  };

  this.otherAwesomeCallback = function(node, isSelected, tree) {
    // Do soemthing with node or tree based on isSelected
  };
  
  this.getSelectedNodes=function(node){
    if (node.isSelected==true) {
      return node.label;
    };
  };

  this.getjson=function (tests) {
     var k =JSON.stringify(tests);
     return k;
  };

  this.isActive = function(node) {
    if (node.isSelected==true) {
      return node.id;
    };
  };


//my function keep life simple
this.extractLabelistSelected =function(tests){
    var key = []
    var value = []
    var obj = {}
        for(var i=0;i<tests.length;i++){
        key.push(tests[i].lebel);
        value.push(tests[i].isSelected)
           if(typeof(tests[i].children)=="object"){
                for (var j =0; j<tests[i].children.length;j++){
                    key.push(tests[i].children[j].label)
                    value.push(tests[i].children[j].isSelected)
                }
           }
        }
        for (var i = 0; i < key.length; i++) {
            obj[key[i]] = value[i]
        }
        return(key);
}

});

//test data goes here
var tests =
[
  {
    "id": "0",
    "value": "",
    "label": "Intelligence tests / premorbid IQ tests",
    "children": [
      {
        "id": "0-0",
        "value": "",
        "label": "Dutch Adult Reading Test (DART/NART)",
        "children": []
      },
      {
        "id": "0-1",
        "value": "",
        "label": "Wechsler Adult Intelligence Scale",
        "children": []
      },
      {
        "id": "0-2",
        "value": "",
        "label": "WAIS-NL (1970)",
        "children": [
          {
            "id": "0-2-0",
            "value": "",
            "label": "WAIS_NL_Digitspan",
            "children": []
          },
          {
            "id": "0-2-1",
            "value": "",
            "label": "WAIS_NL_Information",
            "children": []
          },
          {
            "id": "0-2-2",
            "value": "",
            "label": "WAIS_NL_arithmetic",
            "children": []
          },
          {
            "id": "0-2-3",
            "value": "",
            "label": "WAIS_NL_Similarities",
            "children": []
          },
          {
            "id": "0-2-4",
            "value": "",
            "label": "WAIS_NL_Coding",
            "children": []
          },
          {
            "id": "0-2-5",
            "value": "",
            "label": "WAIS_NL_PictureCompletion",
            "children": []
          },
          {
            "id": "0-2-6",
            "value": "",
            "label": "WAIS_NL_BlockDesign",
            "children": []
          }
        ]
      },
      {
        "id": "0-3",
        "value": "",
        "label": "WAIS-R",
        "children": [
          {
            "id": "0-3-0",
            "value": "",
            "label": "WAIS_R_Digitspan",
            "children": []
          },
          {
            "id": "0-3-1",
            "value": "",
            "label": "WAIS_R_Coding",
            "children": []
          }
        ]
      },
      {
        "id": "0-4",
        "value": "",
        "label": "WAIS-III_NL",
        "children": [
          {
            "id": "0-4-0",
            "value": "",
            "label": "WAIS_III_NL_VisualPuzzle",
            "children": []
          },
          {
            "id": "0-4-1",
            "value": "",
            "label": "WAIS_III_NL_Comprehension",
            "children": []
          },
          {
            "id": "0-4-2",
            "value": "",
            "label": "WAIS_III_NL_SymbolSearch",
            "children": []
          },
          {
            "id": "0-4-3",
            "value": "",
            "label": "WAIS_III_NL_Information",
            "children": []
          },
          {
            "id": "0-4-4",
            "value": "",
            "label": "WAIS_III_NL_Arithmetic",
            "children": []
          },
          {
            "id": "0-4-5",
            "value": "",
            "label": "WAIS_III_LeNoSeq",
            "children": []
          },
          {
            "id": "0-4-6",
            "value": "",
            "label": "WAIS_III_NL_PictureComplet",
            "children": []
          },
          {
            "id": "0-4-7",
            "value": "",
            "label": "WAIS_III_NL_Similarities",
            "children": []
          },
          {
            "id": "0-4-8",
            "value": "",
            "label": "WAIS_III_NL_Coding",
            "children": []
          },
          {
            "id": "0-4-9",
            "value": "",
            "label": "WAIS_III_NL_Digitspan",
            "children": []
          },
          {
            "id": "0-4-10",
            "value": "",
            "label": "WAIS_III_NL_LetterNumber_Sequencing",
            "children": []
          },
          {
            "id": "0-4-11",
            "value": "",
            "label": "WAIS_III_NL_MatrixReasoning",
            "children": []
          },
          {
            "id": "0-4-12",
            "value": "",
            "label": "WAIS_III_NL_BlockDesign",
            "children": []
          },
          {
            "id": "0-4-13",
            "value": "",
            "label": "WAIS_III_NL_Vocabulary",
            "children": []
          }
        ]
      },
      {
        "id": "0-5",
        "value": "",
        "label": "WAIS-IV_NL",
        "children": [
          {
            "id": "0-5-0",
            "value": "",
            "label": "WAIS-IV_Digitspan",
            "children": []
          },
          {
            "id": "0-5-1",
            "value": "",
            "label": "WAIS-IV Picture Completion",
            "children": []
          }
        ]
      },
      {
        "id": "0-6",
        "value": "",
        "label": "Wechsler Memory Scales",
        "children": []
      },
      {
        "id": "0-7",
        "value": "",
        "label": "WMS-R_NL",
        "children": [
          {
            "id": "0-7-0",
            "value": "",
            "label": "WMS_R_NL_WordPairs",
            "children": []
          },
          {
            "id": "0-7-1",
            "value": "",
            "label": "WMS_R_NL_VisualRepro",
            "children": []
          },
          {
            "id": "0-7-2",
            "value": "",
            "label": "WMS_R_NL_Digitspan",
            "children": []
          },
          {
            "id": "0-7-3",
            "value": "",
            "label": "WMS_R_NL_PatternRecognition",
            "children": []
          },
          {
            "id": "0-7-4",
            "value": "",
            "label": "WMS_R_NL_VisualPairedAssociation",
            "children": []
          }
        ]
      },
      {
        "id": "0-8",
        "value": "",
        "label": "WMS-III_NL",
        "children": [
          {
            "id": "0-8-0",
            "value": "",
            "label": "WMS_III_NL_SpatialSpan",
            "children": []
          },
          {
            "id": "0-8-1",
            "value": "",
            "label": "WMS_III_NL_FaceRecog",
            "children": []
          }
        ]
      },
      {
        "id": "0-9",
        "value": "",
        "label": "Coding Task",
        "children": []
      },
      {
        "id": "0-10",
        "value": "",
        "label": "Wechsler Intelligence Scale Children",
        "children": []
      },
      {
        "id": "0-11",
        "value": "",
        "label": "WISC_NL",
        "children": [
          {
            "id": "0-11-0",
            "value": "",
            "label": "WISC_NL_Mazes",
            "children": []
          }
        ]
      },
      {
        "id": "0-12",
        "value": "",
        "label": "WISC-R_NL",
        "children": [
          {
            "id": "0-12-0",
            "value": "",
            "label": "WISC_R_NL_plaatjes",
            "children": []
          },
          {
            "id": "0-12-1",
            "value": "",
            "label": "WISC_R_NL_rekenen",
            "children": []
          },
          {
            "id": "0-12-2",
            "value": "",
            "label": "WISC_R_NL_blokpatronen",
            "children": []
          },
          {
            "id": "0-12-3",
            "value": "",
            "label": "WISC_R_NL_woordenschat",
            "children": []
          },
          {
            "id": "0-12-4",
            "value": "",
            "label": "WISC_R_NL_total",
            "children": []
          },
          {
            "id": "0-12-5",
            "value": "",
            "label": "WISC_R_NL_Mazes",
            "children": []
          }
        ]
      },
      {
        "id": "0-13",
        "value": "",
        "label": "WISC-III_NL",
        "children": [
          {
            "id": "0-13-0",
            "value": "",
            "label": "WISC_III_NL_SymbolSubstitution",
            "children": []
          },
          {
            "id": "0-13-1",
            "value": "",
            "label": "WISC_III_NL_plaatjes",
            "children": []
          },
          {
            "id": "0-13-2",
            "value": "",
            "label": "WISC_III_NL_blokpatronen",
            "children": []
          },
          {
            "id": "0-13-3",
            "value": "",
            "label": "WISC_III_NL_rekenen",
            "children": []
          },
          {
            "id": "0-13-4",
            "value": "",
            "label": "WISC_III_NL_woordkennis",
            "children": []
          },
          {
            "id": "0-13-5",
            "value": "",
            "label": "WISC_III_NL_symbolcomparisson",
            "children": []
          },
          {
            "id": "0-13-6",
            "value": "",
            "label": "WISC_III_NL_digitspan",
            "children": []
          }
        ]
      },
      {
        "id": "0-14",
        "value": "",
        "label": "Groninger Intelligentie Test",
        "children": []
      },
      {
        "id": "0-15",
        "value": "",
        "label": "GIT1",
        "children": [
          {
            "id": "0-15-0",
            "value": "",
            "label": "GIT1_Legkaarten",
            "children": []
          },
          {
            "id": "0-15-1",
            "value": "",
            "label": "GIT1_Matrijzen",
            "children": []
          },
          {
            "id": "0-15-2",
            "value": "",
            "label": "GIT1_Woordopnoemen",
            "children": []
          },
          {
            "id": "0-15-3",
            "value": "",
            "label": "GIT1_Cijferen",
            "children": []
          },
          {
            "id": "0-15-4",
            "value": "",
            "label": "GIT1_Lijntekeningen",
            "children": []
          }
        ]
      },
      {
        "id": "0-16",
        "value": "",
        "label": "Raven Matrices",
        "children": []
      },
      {
        "id": "0-17",
        "value": "",
        "label": "Raven Coloured Progressive Matrices (RCPM)",
        "children": []
      },
      {
        "id": "0-18",
        "value": "",
        "label": "Raven Standard Progressive Matrices (RSPM)",
        "children": []
      },
      {
        "id": "0-19",
        "value": "",
        "label": "Differentiële Aanleg Testserie (DAT):",
        "children": [
          {
            "id": "0-19-0",
            "value": "",
            "label": "DAT",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": "1",
    "value": "",
    "label": "Language Tests",
    "children": [
      {
        "id": "1-0",
        "value": "",
        "label": "Boston Naming Test (BNT)",
        "children": []
      },
      {
        "id": "1-1",
        "value": "",
        "label": "Token Test",
        "children": []
      },
      {
        "id": "1-2",
        "value": "",
        "label": "Peabody Picture Vocabulary Test-Third Edition (PPVT-III)",
        "children": []
      }
    ]
  },
  {
    "id": "2",
    "value": "",
    "label": "Memory Tests",
    "children": [
      {
        "id": "2-0",
        "value": "",
        "label": "Verbale Leer en Geheugen Taak (VLGT)",
        "children": []
      },
      {
        "id": "2-1",
        "value": "",
        "label": "(Rey) Auditory Verbal Learning Test (AVLT)",
        "children": []
      },
      {
        "id": "2-2",
        "value": "",
        "label": "10 Word Test (10wt)",
        "children": []
      },
      {
        "id": "2-3",
        "value": "",
        "label": "(Rey) Visual Design Learning Test (VDLT)",
        "children": []
      },
      {
        "id": "2-4",
        "value": "",
        "label": "Rey Complex Figure Task (RCFT)",
        "children": []
      },
      {
        "id": "2-5",
        "value": "",
        "label": "Boston Naming Test (BNT)",
        "children": []
      },
      {
        "id": "2-5",
        "value": "",
        "label": "Rivermead Behaviour Memory Test (RBMT)",
        "children": []
      },
      {
        "id": "2-7",
        "value": "",
        "label": "Benton Visual Retention Task (BVRT)",
        "children": []
      },
      {
        "id": "2-8",
        "value": "",
        "label": "The Enhanced Cued Recall Test (ECR)",
        "children": []
      },
      {
        "id": "2-9",
        "value": "",
        "label": "Visual Association Test (VAT)",
        "children": []
      },
      {
        "id": "2-10",
        "value": "",
        "label": "Corsi Block Tapping Test (Corsi)",
        "children": []
      },
      {
        "id": "2-11",
        "value": "",
        "label": "Fepsy Tapping Test (Fepsy)",
        "children": []
      },
      {
        "id": "2-12",
        "value": "",
        "label": "Self-ordered pointing task (SOP)",
        "children": []
      },
      {
        "id": "2-13",
        "value": "",
        "label": "Location Learning Test (LLT)",
        "children": []
      },
      {
        "id": "2-14",
        "value": "",
        "label": "Selective Reminding Test (SRT)",
        "children": []
      },
      {
        "id": "2-15",
        "value": "",
        "label": "Memory Update (MU)",
        "children": []
      },
      {
        "id": "2-16",
        "value": "",
        "label": "The Doors and People test (Doors)",
        "children": []
      },
      {
        "id": "2-17",
        "value": "",
        "label": "Amsterdamse Korte-Termijn Geheugen Taak (AKGT)",
        "children": []
      }
    ]
  },
  {
    "id": "3",
    "value": "",
    "label": "Perception Tests",
    "children": [
      {
        "id": "3-0",
        "value": "",
        "label": "Benton’s Judgment of Line Orientation Test (JLO)",
        "children": []
      },
      {
        "id": "3-1",
        "value": "",
        "label": "Degraded Facial Affect Recognition (DFAR)",
        "children": []
      },
      {
        "id": "3-2",
        "value": "",
        "label": "Benton Face Recognition Test (BFRT)",
        "children": []
      },
      {
        "id": "3-3",
        "value": "",
        "label": "Bourdon-Wierma dot cancellation Test (BD): ",
        "children": []
      },
      {
        "id": "3-4",
        "value": "",
        "label": "Bourdon-Vos Test (BVT)",
        "children": []
      }
    ]
  },
  {
    "id": "4",
    "value": "",
    "label": "Motor/Praxis Tests",
    "children": [
      {
        "id": "4-0",
        "value": "",
        "label": "Grooved Pegboard (GroPeg)",
        "children": []
      },
      {
        "id": "4-1",
        "value": "",
        "label": "Purdue Pegboard Test (PPT)",
        "children": []
      },
      {
        "id": "4-2",
        "value": "",
        "label": "Vienna Test System (VTS)",
        "children": []
      },
      {
        "id": "4-3",
        "value": "",
        "label": "Beery VMI (BVMI)",
        "children": []
      }
    ]
  },
  {
    "id": "5",
    "value": "",
    "label": "Attention and Working Memory",
    "children": [
      {
        "id": "5-0",
        "value": "",
        "label": "Trail Making Task (TMT)",
        "children": []
      },
      {
        "id": "5-1",
        "value": "",
        "label": "Stroop",
        "children": []
      },
      {
        "id": "5-2",
        "value": "",
        "label": "TestD2",
        "children": []
      },
      {
        "id": "5-3",
        "value": "",
        "label": "Test battery of Attentional Performance (TAP)",
        "children": []
      },
      {
        "id": "5-4",
        "value": "",
        "label": "Paced Auditory Serial Addition Test (PASAT)",
        "children": []
      },
      {
        "id": "5-5",
        "value": "",
        "label": "HQ - Continuous Performance Test (HQ-CPT)",
        "children": []
      }
    ]
  },
  {
    "id": "6",
    "value": "",
    "label": "Executive Functions",
    "children": [
      {
        "id": "6-0",
        "value": "",
        "label": "Semantic Fluency",
        "children": []
      },
      {
        "id": "6-1",
        "value": "",
        "label": "Letter Fluency",
        "children": []
      },
      {
        "id": "6-2",
        "value": "",
        "label": "The Five Point Test (FPT)",
        "children": []
      },
      {
        "id": "6-3",
        "value": "",
        "label": "Wisconsin card sorting test (WCST)",
        "children": []
      },
      {
        "id": "6-4",
        "value": "",
        "label": "Behavioural Assessment of the Dysexecutive Syndrome (BADS)",
        "children": []
      },
      {
        "id": "6-5",
        "value": "",
        "label": "Ruff Figural Fluency Task (RFFT)",
        "children": []
      },
      {
        "id": "6-6",
        "value": "",
        "label": "Tower of London (TOL)",
        "children": []
      },
      {
        "id": "6-7",
        "value": "",
        "label": "Eriksen Flanker Task (FLANK)",
        "children": []
      },
      {
        "id": "6-8",
        "value": "",
        "label": "Brixton Spatial Anticipation Test (BSAT)",
        "children": []
      },
      {
        "id": "6-9",
        "value": "",
        "label": "Hayling Sentence Completion Test (HSCT)",
        "children": []
      },
      {
        "id": "6-10",
        "value": "",
        "label": "Response shifting task (RST)",
        "children": []
      }
    ]
  },
  {
    "id": "7",
    "value": "",
    "label": "Cognitive screening tools / dementia screening",
    "children": [
      {
        "id": "7-0",
        "value": "",
        "label": "Mini-Metal state Examination (MMSE)",
        "children": []
      },
      {
        "id": "7-1",
        "value": "",
        "label": "Benton Temporal Orientation Test (BTO)",
        "children": []
      },
      {
        "id": "7-2",
        "value": "",
        "label": "7 minute dementia screen (SevenMin)",
        "children": []
      },
      {
        "id": "7-3",
        "value": "",
        "label": "Cognitieve Screening Test (CST)",
        "children": []
      },
      {
        "id": "7-4",
        "value": "",
        "label": "Cambridge Cognitive Examination (CAMCOG)",
        "children": []
      },
      {
        "id": "7-5",
        "value": "",
        "label": "Montreal Cognitive Assessment (MoCA)",
        "children": []
      },
      {
        "id": "7-6",
        "value": "",
        "label": "Mattis Dementia Scale (MDS)",
        "children": []
      },
      {
        "id": "7-7",
        "value": "",
        "label": "Amsterdamse Dementie Screening Test (ADS)",
        "children": []
      },
      {
        "id": "7-8",
        "value": "",
        "label": "Cognitive Failures Questionnaire (CFQ)",
        "children": []
      },
      {
        "id": "7-9",
        "value": "",
        "label": "Clock drawing",
        "children": []
      },
      {
        "id": "7-10",
        "value": "",
        "label": "Symbol Digit Modalities Test (SDMT)",
        "children": []
      }
    ]
  },
  {
    "id": "8",
    "value": "",
    "label": "Social Cognition",
    "children": [
      {
        "id": "8-0",
        "value": "",
        "label": "Emotion Recognition Task (ERT)",
        "children": []
      },
      {
        "id": "8-1",
        "value": "",
        "label": "Guilford’s Cartoon Predictions Test (GPT)",
        "children": []
      },
      {
        "id": "8-2",
        "value": "",
        "label": "Happe Cartoon test (HCT)",
        "children": []
      },
      {
        "id": "8-3",
        "value": "",
        "label": "Reading the Mind in the Eyes test (RME)",
        "children": []
      },
      {
        "id": "8-4",
        "value": "",
        "label": "Hinting Task (HT)",
        "children": []
      }
    ]
  },
  {
    "id": "9",
    "value": "",
    "label": "Questionnaires depression/anxiety",
    "children": [
      {
        "id": "9-0",
        "value": "",
        "label": "Hospital Anxiety Depression Scale (HADS)",
        "children": []
      },
      {
        "id": "9-1",
        "value": "",
        "label": "Inventory of Depressive Symptomatology (IDS)",
        "children": []
      },
      {
        "id": "9-2",
        "value": "",
        "label": "Center for Epidemiological Studies Depression Scale (CES-D)",
        "children": []
      },
      {
        "id": "9-3",
        "value": "",
        "label": "Profile of Mood States (POMS)",
        "children": []
      },
      {
        "id": "9-4",
        "value": "",
        "label": "Rand Mental Health Inventory (MHI)",
        "children": []
      },
      {
        "id": "9-5",
        "value": "",
        "label": "Liebowitz Social Anxiety Scale (LSAL)",
        "children": []
      },
      {
        "id": "9-6",
        "value": "",
        "label": "The AMC Linear Disability Score (ALDS)",
        "children": []
      },
      {
        "id": "9-7",
        "value": "",
        "label": "The Short Form (36) Health Survey (SF-36)",
        "children": []
      },
      {
        "id": "9-8",
        "value": "",
        "label": "Symptom Checklist (SCL-90)",
        "children": []
      },
      {
        "id": "9-9",
        "value": "",
        "label": "NEO Five Factor Inventory (NEO-FFI)",
        "children": []
      },
      {
        "id": "9-10",
        "value": "",
        "label": "Multidimensional fatigue inventory (MFI-20)",
        "children": []
      },
      {
        "id": "9-11",
        "value": "",
        "label": "Utrechtse Coping Lijst (UCL)",
        "children": []
      },
      {
        "id": "9-12",
        "value": "",
        "label": "The World Health Organization Quality of Life (WHOQol)",
        "children": []
      },
      {
        "id": "9-13",
        "value": "",
        "label": "Becks Anxiety Inventory (BAI)",
        "children": []
      },
      {
        "id": "9-14",
        "value": "",
        "label": "Becks Depression Inventory (BDI)",
        "children": []
      },
      {
        "id": "9-15",
        "value": "",
        "label": "Hopkins Symptoms Checklist (HSCL-25)",
        "children": []
      },
      {
        "id": "9-16",
        "value": "",
        "label": "Cognitive Failures Questionnaire (CFQ)",
        "children": []
      },
      {
        "id": "9-17",
        "value": "",
        "label": "Checklist Individual Strength (CIS20r)",
        "children": []
      },
      {
        "id": "9-18",
        "value": "",
        "label": "Assesment of Depression Inventory (ADI)",
        "children": []
      }
    ]
  },
  {
    "id": "10",
    "value": "",
    "label": "ADHD / Children",
    "children": [
      {
        "id": "10-0",
        "value": "",
        "label": "Wender Utah ADHD Rating Scale (WURS)",
        "children": []
      },
      {
        "id": "10-1",
        "value": "",
        "label": "Rösler ADHD questionnaire (RAQ)",
        "children": []
      },
      {
        "id": "10-2",
        "value": "",
        "label": "Connors’ Adult ADHD Rating Scale (CAARS)",
        "children": []
      },
      {
        "id": "10-3",
        "value": "",
        "label": "ADHD Vragenlijst (AVL)",
        "children": []
      },
      {
        "id": "10-4",
        "value": "",
        "label": "Vragenlijst voor Inventarisatie van Sociaal Gedrag van Kinderen (VISK)",
        "children": []
      },
      {
        "id": "10-5",
        "value": "",
        "label": "Strengths & Difficulties Questionnaires (SDQ)",
        "children": []
      },
      {
        "id": "10-6",
        "value": "",
        "label": "Child Behaviour Checklist (CBCL)",
        "children": []
      },
      {
        "id": "10-7",
        "value": "",
        "label": "Reynell Developmental Language Scales (RDLS)",
        "children": []
      },
      {
        "id": "10-8",
        "value": "",
        "label": "Behavior Rating Inventory of Executive Function(BRIEF)",
        "children": []
      },
      {
        "id": "10-9",
        "value": "",
        "label": "PedsQLTM 4.0",
        "children": []
      },
      {
        "id": "10-10",
        "value": "",
        "label": "Test of Everyday Attention for Children (TEA-CH)",
        "children": []
      },
      {
        "id": "10-11",
        "value": "",
        "label": "Disruptive Behavior Disorders (DBD)",
        "children": []
      },
      {
        "id": "10-12",
        "value": "",
        "label": "Vragenlijst voor Gedragsproblemen bij Kinderen 6-16 jaar (VVGK-16)",
        "children": []
      },
      {
        "id": "10-13",
        "value": "",
        "label": "Behavior Disorder Scale (BDS)",
        "children": []
      },
      {
        "id": "10-14",
        "value": "",
        "label": "Leidse Diagnostische Test (LDT)",
        "children": []
      },
      {
        "id": "10-15",
        "value": "",
        "label": "Children Communication Checklist (CCC)",
        "children": []
      },
      {
        "id": "10-16",
        "value": "",
        "label": "Gedragsvragenlijst voor Kleuters (GVK)",
        "children": []
      }
    ]
  }
]


app.controller('TableController', function($scope) {

  this.tests1 = {'test1':true, 'test2':true, 'test3':false};
  this.tests2 = {'test1':false, 'test2':true, 'test3':true};


  this.patients= pat;
  var dum={};
  var tests={};
  
 /* this.calculateAge = function (birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
   };
*/

  this.createPatientObject=function(){
   //var age= this.calculateAge($scope.patient.age);

   dum= {"patient.id":$scope.patient.id,
         "patient.age":$scope.patient.age,
         "patient.sex":$scope.patient.sex,
         "patient.education":$scope.patient.education
        };
   return dum;
  };


  this.createTestObject=function(){
   return $scope.patient.test.value;
  };

  this.addPatient=function(){};

  this.exportCSV=function(){};

  this.submit=function(){
    alert("Calling R function here");
  };

});



var pat = [{
  "patient.id":9999,
  "patient.age":"12/12/1975",
  "patient.sex":0,
  "patient.education":"Higher Education"
},{
  "patient.id":3333,
  "patient.age":"22/02/1995",
  "patient.sex":1,
  "patient.education":"University Degree"
}
];


// this controller is not in use
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


app.controller('plotController', function($scope){

this.lineChart = function(){
    this.options = {
                chart: {
                    type: 'cumulativeLineChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 65
                    },
                    x: function(d){ return d[0]; },
                    y: function(d){ return d[1]/100; },
                    average: function(d) { return d.mean/100; },

                    color: d3.scale.category10().range(),
                    duration: 300,
                    useInteractiveGuideline: true,
                    clipVoronoi: false,

                    xAxis: {
                        axisLabel: 'X Axis',
                        tickFormat: function(d) {
                            return d3.time.format('%m/%d/%y')(new Date(d))
                        },
                        showMaxMin: false,
                        staggerLabels: true
                    },

                    yAxis: {
                        axisLabel: 'Y Axis',
                        tickFormat: function(d){
                            return d3.format(',.1%')(d);
                        },
                        axisLabelDistance: 20
                    }
                }
            };
    this.data = [
                {
                    key: "Long",
                    values: [ [ 1083297600000 , -2.974623048543] , [ 1085976000000 , -1.7740300785979] , [ 1088568000000 , 4.4681318138177] , [ 1091246400000 , 7.0242541001353] , [ 1093924800000 , 7.5709603667586] , [ 1096516800000 , 20.612245065736] , [ 1099195200000 , 21.698065237316] , [ 1101790800000 , 40.501189458018] , [ 1104469200000 , 50.464679413194] , [ 1107147600000 , 48.917421973355] , [ 1109566800000 , 63.750936549160] , [ 1112245200000 , 59.072499126460] , [ 1114833600000 , 43.373158880492] , [ 1117512000000 , 54.490918947556] , [ 1120104000000 , 56.661178852079] , [ 1122782400000 , 73.450103545496] , [ 1125460800000 , 71.714526354907] , [ 1128052800000 , 85.221664349607] , [ 1130734800000 , 77.769261392481] , [ 1133326800000 , 95.966528716500] , [ 1136005200000 , 107.59132116397] , [ 1138683600000 , 127.25740096723] , [ 1141102800000 , 122.13917498830] , [ 1143781200000 , 126.53657279774] , [ 1146369600000 , 132.39300992970] , [ 1149048000000 , 120.11238242904] , [ 1151640000000 , 118.41408917750] , [ 1154318400000 , 107.92918924621] , [ 1156996800000 , 110.28057249569] , [ 1159588800000 , 117.20485334692] , [ 1162270800000 , 141.33556756948] , [ 1164862800000 , 159.59452727893] , [ 1167541200000 , 167.09801853304] , [ 1170219600000 , 185.46849659215] , [ 1172638800000 , 184.82474099990] , [ 1175313600000 , 195.63155213887] , [ 1177905600000 , 207.40597044171] , [ 1180584000000 , 230.55966698196] , [ 1183176000000 , 239.55649035292] , [ 1185854400000 , 241.35915085208] , [ 1188532800000 , 239.89428956243] , [ 1191124800000 , 260.47781917715] , [ 1193803200000 , 276.39457482225] , [ 1196398800000 , 258.66530682672] , [ 1199077200000 , 250.98846121893] , [ 1201755600000 , 226.89902618127] , [ 1204261200000 , 227.29009273807] , [ 1206936000000 , 218.66476654350] , [ 1209528000000 , 232.46605902918] , [ 1212206400000 , 253.25667081117] , [ 1214798400000 , 235.82505363925] , [ 1217476800000 , 229.70112774254] , [ 1220155200000 , 225.18472705952] , [ 1222747200000 , 189.13661746552] , [ 1225425600000 , 149.46533007301] , [ 1228021200000 , 131.00340772114] , [ 1230699600000 , 135.18341728866] , [ 1233378000000 , 109.15296887173] , [ 1235797200000 , 84.614772549760] , [ 1238472000000 , 100.60810015326] , [ 1241064000000 , 141.50134895610] , [ 1243742400000 , 142.50405083675] , [ 1246334400000 , 139.81192372672] , [ 1249012800000 , 177.78205544583] , [ 1251691200000 , 194.73691933074] , [ 1254283200000 , 209.00838460225] , [ 1256961600000 , 198.19855877420] , [ 1259557200000 , 222.37102417812] , [ 1262235600000 , 234.24581081250] , [ 1264914000000 , 228.26087689346] , [ 1267333200000 , 248.81895126250] , [ 1270008000000 , 270.57301075186] , [ 1272600000000 , 292.64604322550] , [ 1275278400000 , 265.94088520518] , [ 1277870400000 , 237.82887467569] , [ 1280548800000 , 265.55973314204] , [ 1283227200000 , 248.30877330928] , [ 1285819200000 , 278.14870066912] , [ 1288497600000 , 292.69260960288] , [ 1291093200000 , 300.84263809599] , [ 1293771600000 , 326.17253914628] , [ 1296450000000 , 337.69335966505] , [ 1298869200000 , 339.73260965121] , [ 1301544000000 , 346.87865120765] , [ 1304136000000 , 347.92991526628] , [ 1306814400000 , 342.04627502669] , [ 1309406400000 , 333.45386231233] , [ 1312084800000 , 323.15034181243] , [ 1314763200000 , 295.66126882331] , [ 1317355200000 , 251.48014579253] , [ 1320033600000 , 295.15424257905] , [ 1322629200000 , 294.54766764397] , [ 1325307600000 , 295.72906119051] , [ 1327986000000 , 325.73351347613] , [ 1330491600000 , 340.16106061186] , [ 1333166400000 , 345.15514071490] , [ 1335758400000 , 337.10259395679] , [ 1338436800000 , 318.68216333837] , [ 1341028800000 , 317.03683945246] , [ 1343707200000 , 318.53549659997] , [ 1346385600000 , 332.85381464104] , [ 1348977600000 , 337.36534373477] , [ 1351656000000 , 350.27872156161] , [ 1354251600000 , 349.45128876100]]
                    ,
                    mean: 250
                },
                {
                    key: "Short",
                    values: [ [ 1083297600000 , -0.77078283705125] , [ 1085976000000 , -1.8356366650335] , [ 1088568000000 , -5.3121322073127] , [ 1091246400000 , -4.9320975829662] , [ 1093924800000 , -3.9835408823225] , [ 1096516800000 , -6.8694685316805] , [ 1099195200000 , -8.4854877428545] , [ 1101790800000 , -15.933627197384] , [ 1104469200000 , -15.920980069544] , [ 1107147600000 , -12.478685045651] , [ 1109566800000 , -17.297761889305] , [ 1112245200000 , -15.247129891020] , [ 1114833600000 , -11.336459046839] , [ 1117512000000 , -13.298990907415] , [ 1120104000000 , -16.360027000056] , [ 1122782400000 , -18.527929522030] , [ 1125460800000 , -22.176516738685] , [ 1128052800000 , -23.309665368330] , [ 1130734800000 , -21.629973409748] , [ 1133326800000 , -24.186429093486] , [ 1136005200000 , -29.116707312531] , [ 1138683600000 , -37.188037874864] , [ 1141102800000 , -34.689264821198] , [ 1143781200000 , -39.505932105359] , [ 1146369600000 , -45.339572492759] , [ 1149048000000 , -43.849353192764] , [ 1151640000000 , -45.418353922571] , [ 1154318400000 , -44.579281059919] , [ 1156996800000 , -44.027098363370] , [ 1159588800000 , -41.261306759439] , [ 1162270800000 , -47.446018534027] , [ 1164862800000 , -53.413782948909] , [ 1167541200000 , -50.700723647419] , [ 1170219600000 , -56.374090913296] , [ 1172638800000 , -61.754245220322] , [ 1175313600000 , -66.246241587629] , [ 1177905600000 , -75.351650899999] , [ 1180584000000 , -81.699058262032] , [ 1183176000000 , -82.487023368081] , [ 1185854400000 , -86.230055113277] , [ 1188532800000 , -84.746914818507] , [ 1191124800000 , -100.77134971977] , [ 1193803200000 , -109.95435565947] , [ 1196398800000 , -99.605672965057] , [ 1199077200000 , -99.607249394382] , [ 1201755600000 , -94.874614950188] , [ 1204261200000 , -105.35899063105] , [ 1206936000000 , -106.01931193802] , [ 1209528000000 , -110.28883571771] , [ 1212206400000 , -119.60256203030] , [ 1214798400000 , -115.62201315802] , [ 1217476800000 , -106.63824185202] , [ 1220155200000 , -99.848746318951] , [ 1222747200000 , -85.631219602987] , [ 1225425600000 , -63.547909262067] , [ 1228021200000 , -59.753275364457] , [ 1230699600000 , -63.874977883542] , [ 1233378000000 , -56.865697387488] , [ 1235797200000 , -54.285579501988] , [ 1238472000000 , -56.474659581885] , [ 1241064000000 , -63.847137745644] , [ 1243742400000 , -68.754247867325] , [ 1246334400000 , -69.474257009155] , [ 1249012800000 , -75.084828197067] , [ 1251691200000 , -77.101028237237] , [ 1254283200000 , -80.454866854387] , [ 1256961600000 , -78.984349952220] , [ 1259557200000 , -83.041230807854] , [ 1262235600000 , -84.529748348935] , [ 1264914000000 , -83.837470195508] , [ 1267333200000 , -87.174487671969] , [ 1270008000000 , -90.342293007487] , [ 1272600000000 , -93.550928464991] , [ 1275278400000 , -85.833102140765] , [ 1277870400000 , -79.326501831592] , [ 1280548800000 , -87.986196903537] , [ 1283227200000 , -85.397862121771] , [ 1285819200000 , -94.738167050020] , [ 1288497600000 , -98.661952897151] , [ 1291093200000 , -99.609665952708] , [ 1293771600000 , -103.57099836183] , [ 1296450000000 , -104.04353411322] , [ 1298869200000 , -108.21382792587] , [ 1301544000000 , -108.74006900920] , [ 1304136000000 , -112.07766650960] , [ 1306814400000 , -109.63328199118] , [ 1309406400000 , -106.53578966772] , [ 1312084800000 , -103.16480871469] , [ 1314763200000 , -95.945078001828] , [ 1317355200000 , -81.226687340874] , [ 1320033600000 , -90.782206596168] , [ 1322629200000 , -89.484445370113] , [ 1325307600000 , -88.514723135326] , [ 1327986000000 , -93.381292724320] , [ 1330491600000 , -97.529705609172] , [ 1333166400000 , -99.520481439189] , [ 1335758400000 , -99.430184898669] , [ 1338436800000 , -93.349934521973] , [ 1341028800000 , -95.858475286491] , [ 1343707200000 , -95.522755836605] , [ 1346385600000 , -98.503848862036] , [ 1348977600000 , -101.49415251896] , [ 1351656000000 , -101.50099325672] , [ 1354251600000 , -99.487094927489]]
                    ,
                    mean: -60
                },


                {
                    key: "Gross",
                    mean: 125,
                    values: [ [ 1083297600000 , -3.7454058855943] , [ 1085976000000 , -3.6096667436314] , [ 1088568000000 , -0.8440003934950] , [ 1091246400000 , 2.0921565171691] , [ 1093924800000 , 3.5874194844361] , [ 1096516800000 , 13.742776534056] , [ 1099195200000 , 13.212577494462] , [ 1101790800000 , 24.567562260634] , [ 1104469200000 , 34.543699343650] , [ 1107147600000 , 36.438736927704] , [ 1109566800000 , 46.453174659855] , [ 1112245200000 , 43.825369235440] , [ 1114833600000 , 32.036699833653] , [ 1117512000000 , 41.191928040141] , [ 1120104000000 , 40.301151852023] , [ 1122782400000 , 54.922174023466] , [ 1125460800000 , 49.538009616222] , [ 1128052800000 , 61.911998981277] , [ 1130734800000 , 56.139287982733] , [ 1133326800000 , 71.780099623014] , [ 1136005200000 , 78.474613851439] , [ 1138683600000 , 90.069363092366] , [ 1141102800000 , 87.449910167102] , [ 1143781200000 , 87.030640692381] , [ 1146369600000 , 87.053437436941] , [ 1149048000000 , 76.263029236276] , [ 1151640000000 , 72.995735254929] , [ 1154318400000 , 63.349908186291] , [ 1156996800000 , 66.253474132320] , [ 1159588800000 , 75.943546587481] , [ 1162270800000 , 93.889549035453] , [ 1164862800000 , 106.18074433002] , [ 1167541200000 , 116.39729488562] , [ 1170219600000 , 129.09440567885] , [ 1172638800000 , 123.07049577958] , [ 1175313600000 , 129.38531055124] , [ 1177905600000 , 132.05431954171] , [ 1180584000000 , 148.86060871993] , [ 1183176000000 , 157.06946698484] , [ 1185854400000 , 155.12909573880] , [ 1188532800000 , 155.14737474392] , [ 1191124800000 , 159.70646945738] , [ 1193803200000 , 166.44021916278] , [ 1196398800000 , 159.05963386166] , [ 1199077200000 , 151.38121182455] , [ 1201755600000 , 132.02441123108] , [ 1204261200000 , 121.93110210702] , [ 1206936000000 , 112.64545460548] , [ 1209528000000 , 122.17722331147] , [ 1212206400000 , 133.65410878087] , [ 1214798400000 , 120.20304048123] , [ 1217476800000 , 123.06288589052] , [ 1220155200000 , 125.33598074057] , [ 1222747200000 , 103.50539786253] , [ 1225425600000 , 85.917420810943] , [ 1228021200000 , 71.250132356683] , [ 1230699600000 , 71.308439405118] , [ 1233378000000 , 52.287271484242] , [ 1235797200000 , 30.329193047772] , [ 1238472000000 , 44.133440571375] , [ 1241064000000 , 77.654211210456] , [ 1243742400000 , 73.749802969425] , [ 1246334400000 , 70.337666717565] , [ 1249012800000 , 102.69722724876] , [ 1251691200000 , 117.63589109350] , [ 1254283200000 , 128.55351774786] , [ 1256961600000 , 119.21420882198] , [ 1259557200000 , 139.32979337027] , [ 1262235600000 , 149.71606246357] , [ 1264914000000 , 144.42340669795] , [ 1267333200000 , 161.64446359053] , [ 1270008000000 , 180.23071774437] , [ 1272600000000 , 199.09511476051] , [ 1275278400000 , 180.10778306442] , [ 1277870400000 , 158.50237284410] , [ 1280548800000 , 177.57353623850] , [ 1283227200000 , 162.91091118751] , [ 1285819200000 , 183.41053361910] , [ 1288497600000 , 194.03065670573] , [ 1291093200000 , 201.23297214328] , [ 1293771600000 , 222.60154078445] , [ 1296450000000 , 233.35556801977] , [ 1298869200000 , 231.22452435045] , [ 1301544000000 , 237.84432503045] , [ 1304136000000 , 235.55799131184] , [ 1306814400000 , 232.11873570751] , [ 1309406400000 , 226.62381538123] , [ 1312084800000 , 219.34811113539] , [ 1314763200000 , 198.69242285581] , [ 1317355200000 , 168.90235629066] , [ 1320033600000 , 202.64725756733] , [ 1322629200000 , 203.05389378105] , [ 1325307600000 , 204.85986680865] , [ 1327986000000 , 229.77085616585] , [ 1330491600000 , 239.65202435959] , [ 1333166400000 , 242.33012622734] , [ 1335758400000 , 234.11773262149] , [ 1338436800000 , 221.47846307887] , [ 1341028800000 , 216.98308827912] , [ 1343707200000 , 218.37781386755] , [ 1346385600000 , 229.39368622736] , [ 1348977600000 , 230.54656412916] , [ 1351656000000 , 243.06087025523] , [ 1354251600000 , 244.24733578385]]
                },
                {
                    key: "S&P 1500",
                    values: [ [ 1083297600000 , -1.7798428181819] , [ 1085976000000 , -0.36883324836999] , [ 1088568000000 , 1.7312581046040] , [ 1091246400000 , -1.8356125950460] , [ 1093924800000 , -1.5396564170877] , [ 1096516800000 , -0.16867791409247] , [ 1099195200000 , 1.3754263993413] , [ 1101790800000 , 5.8171640898041] , [ 1104469200000 , 9.4350145241608] , [ 1107147600000 , 6.7649081510160] , [ 1109566800000 , 9.1568499314776] , [ 1112245200000 , 7.2485090994419] , [ 1114833600000 , 4.8762222306595] , [ 1117512000000 , 8.5992339354652] , [ 1120104000000 , 9.0896517982086] , [ 1122782400000 , 13.394644048577] , [ 1125460800000 , 12.311842010760] , [ 1128052800000 , 13.221003650717] , [ 1130734800000 , 11.218481009206] , [ 1133326800000 , 15.565352598445] , [ 1136005200000 , 15.623703865926] , [ 1138683600000 , 19.275255326383] , [ 1141102800000 , 19.432433717836] , [ 1143781200000 , 21.232881244655] , [ 1146369600000 , 22.798299192958] , [ 1149048000000 , 19.006125095476] , [ 1151640000000 , 19.151889158536] , [ 1154318400000 , 19.340022855452] , [ 1156996800000 , 22.027934841859] , [ 1159588800000 , 24.903300681329] , [ 1162270800000 , 29.146492833877] , [ 1164862800000 , 31.781626082589] , [ 1167541200000 , 33.358770738428] , [ 1170219600000 , 35.622684613497] , [ 1172638800000 , 33.332821711366] , [ 1175313600000 , 34.878748635832] , [ 1177905600000 , 40.582332613844] , [ 1180584000000 , 45.719535502920] , [ 1183176000000 , 43.239344722386] , [ 1185854400000 , 38.550955100342] , [ 1188532800000 , 40.585368816283] , [ 1191124800000 , 45.601374057981] , [ 1193803200000 , 48.051404337892] , [ 1196398800000 , 41.582581696032] , [ 1199077200000 , 40.650580792748] , [ 1201755600000 , 32.252222066493] , [ 1204261200000 , 28.106390258553] , [ 1206936000000 , 27.532698196687] , [ 1209528000000 , 33.986390463852] , [ 1212206400000 , 36.302660526438] , [ 1214798400000 , 25.015574480172] , [ 1217476800000 , 23.989494069029] , [ 1220155200000 , 25.934351445531] , [ 1222747200000 , 14.627592011699] , [ 1225425600000 , -5.2249403809749] , [ 1228021200000 , -12.330933408050] , [ 1230699600000 , -11.000291508188] , [ 1233378000000 , -18.563864948088] , [ 1235797200000 , -27.213097001687] , [ 1238472000000 , -20.834133840523] , [ 1241064000000 , -12.717886701719] , [ 1243742400000 , -8.1644613083526] , [ 1246334400000 , -7.9108408918201] , [ 1249012800000 , -0.77002391591209] , [ 1251691200000 , 2.8243816569672] , [ 1254283200000 , 6.8761411421070] , [ 1256961600000 , 4.5060912230294] , [ 1259557200000 , 10.487179794349] , [ 1262235600000 , 13.251375597594] , [ 1264914000000 , 9.2207594803415] , [ 1267333200000 , 12.836276936538] , [ 1270008000000 , 19.816793904978] , [ 1272600000000 , 22.156787167211] , [ 1275278400000 , 12.518039090576] , [ 1277870400000 , 6.4253587440854] , [ 1280548800000 , 13.847372028409] , [ 1283227200000 , 8.5454736090364] , [ 1285819200000 , 18.542801953304] , [ 1288497600000 , 23.037064683183] , [ 1291093200000 , 23.517422401888] , [ 1293771600000 , 31.804723416068] , [ 1296450000000 , 34.778247386072] , [ 1298869200000 , 39.584883855230] , [ 1301544000000 , 40.080647664875] , [ 1304136000000 , 44.180050667889] , [ 1306814400000 , 42.533535927221] , [ 1309406400000 , 40.105374449011] , [ 1312084800000 , 37.014659267156] , [ 1314763200000 , 29.263745084262] , [ 1317355200000 , 19.637463417584] , [ 1320033600000 , 33.157645345770] , [ 1322629200000 , 32.895053150988] , [ 1325307600000 , 34.111544824647] , [ 1327986000000 , 40.453985817473] , [ 1330491600000 , 46.435700783313] , [ 1333166400000 , 51.062385488671] , [ 1335758400000 , 50.130448220658] , [ 1338436800000 , 41.035476682018] , [ 1341028800000 , 46.591932296457] , [ 1343707200000 , 48.349391180634] , [ 1346385600000 , 51.913011286919] , [ 1348977600000 , 55.747238313752] , [ 1351656000000 , 52.991824077209] , [ 1354251600000 , 49.556311883284]]
                }
            ];
};

this.radarChart=function(){
       this.options = {
        pointLabelFontSize: 19,
       };

      this.labels =["WAIS-R", "Dutch Adult Reading Test", "WAIS_R_Digitspan", "WAIS_R_Coding", "WAIS_III_NL_MatrixReasoning", "WAIS_III_NL_Comprehension", "WMS_R_NL_WordPairs"];

      this.data = [
        [65, 59, 90, 81, 56, 55, 40],
        [28, 48, 40, 19, 96, 27, 100]
      ]; 
  };

});