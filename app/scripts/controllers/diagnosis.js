'use strict';
//test data goes here
/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */
var defaultFolder = '2016-01-14';
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

app.controller('TableController', function($scope) {
  var dum={};
  this.tree_data = [];
  this.exportCSV=function(){};
  this.getPat=function(){
     return ($scope.patient[0]);
  };
  this.changeEnvironment = function(val){
  };
});
app.controller('treeController', function($http,$scope,$timeout,$uibModal,$q,diagnosisService,$window) {
  this.tests    = [];
  this.treeArr  = [];
  this.txtvalue = '';
  this.txtReplace = '';
  this.isExpanded = false;
  this.alertMessage = '';
  this.counter = 2;
  var tree;
  this.tabledata= {'0':'Table 0'};
  this.my_tree = tree = {};
  this.counterlimit = 0;
  this.col_defs = [
      {
          field: "label",
          sortable : true,                                        
          sortingType : "string"
      },
  ];
  this.expanding_property = {
      field: "id",
      displayName: "id Name",
      sortable : true,
      filterable: true
  };
  this.submited = false;
  
  diagnosisService.getTest(defaultFolder)
    .then(function goToHome(dataObj) {
      $scope.treeCtrl.tests =  dataObj.data;
      $scope.patient.nomative = dataObj.defaultFolder;
    })
    .catch(function showerror(msg) {
        //show error
        $window.alert(msg);
    });

  diagnosisService.getRelease(defaultFolder)
    .then(function goToHome(folderObj) {
      $scope.folders = folderObj;
    })
    .catch(function showerror(msg) {
        //show error
        $window.alert(msg);
    });

  this.my_tree_handler = function (branch) {
      console.log('you clicked on', branch);
  };

  this.getTreeData = function(val){
    diagnosisService.getTest(val)
    .then(function goToHome(dataObj) {
      $scope.treeCtrl.tests =  dataObj.data;
      $scope.patient.nomative = dataObj.defaultFolder;
    })
    .catch(function showerror(msg) {
        //show error
        $window.alert(msg);
    });
  };

  this.treeExpanded = function(){
  $scope.$$postDigest( function () {
      if($scope.testSearch==='' && $scope.treeCtrl.isExpanded===true){
          $('.ivh-treeview-node-label').trigger('click');
          $scope.treeCtrl.isExpanded = false;
        }
         if($scope.testSearch!=='' && $scope.testSearch.length>0 && $scope.treeCtrl.isExpanded===false){
          $('.ivh-treeview-node-label').trigger('click');
          $scope.treeCtrl.isExpanded = true;
        }
    });
  };

  this.awesomeCallback = function(node, tree) {
    // Do something with node or tree
  };
  this.otherAwesomeCallback = function(node, isSelected, tree) {
    // Do soemthing with node or tree based on isSelected
  };
  this.getSelectedNodes=function(node){
    //return node.label;
    if (node.isSelected===true || node.children.length>0) {
      return node.id;
    }
  };
  this.getjson=function (tests) {
     var k =JSON.stringify(tests);
     return k;
  };
  this.isActive = function(node) {
    if (node.isSelected===true) {
      return node.id;
    }
  };
  /// Important function for tree traversal 
  var arr=[];
  this.process = function(key,value) {
      arr.push(key + " : "+value);
  };
  this.traverse = function(o,func) {
      for (var i in o) {
          func.apply(this,[i,o[i]]);  
          if (o[i] !== null && typeof(o[i])==="object") {
              //going on step down in the object tree!!
              traverse(o[i],func);
          }
      }
  };
  //that's all... no magic, no bloated framework
  this.fun=function(tests){
      var arr=[];
      var coll=[];
      this.process = function(key,value) {
          arr.push(key + " : "+value);
      };
      this.traverse = function(o,func) {
          for (var i in o) {
              func.apply(this,[i,o[i]]);
              if (o[i] !== null && typeof(o[i])==="object" && o[i].isSelected) {
                  console.log(o[i].id);
                  this.traverse(o[i],func);
              }
          }
      };
      this.traverse(tests,this.process);
      return(arr);
  };
  // This function counts the number of occurance of each element in the array
  this.countArrElements = function (arr) {
      var a = [], b = [], prev;
      arr.sort();
      for ( var i = 0; i < arr.length; i++ ) {
          if ( arr[i] !== prev ) {
              a.push(arr[i]);
              b.push(1);
          } else {
              b[b.length-1]++;
          }
          prev = arr[i];
      }
      return [a, b];
  };
  this.addPatient=function(){
        this.counterlimit++;
        this.tabledata[this.counterlimit] = 'Table '+this.counterlimit;
        this.counter++;
        
  };
  // remove the selected column
  this.removeColumn = function (index) {
    // remove the column specified in index
    // you must cycle all the rows and remove the item
    // row by row

    delete this.tabledata[index];
    delete $scope.patient[index];
    this.counter--;
  };

  this.disableDate = function(index){
    if($scope.patient.form['age'+index].$viewValue!==''){
      $('#birthdate'+index).attr('disabled',true);
      $('#testdate'+index).attr('disabled',true);
      $scope.patient.form['birthdate'+index].$setViewValue('1992-05-06');
      $scope.patient.form['testdate'+index].$setViewValue('1992-05-06');
    }
    else{
      $('#birthdate'+index).attr('disabled',false);
      $('#testdate'+index).attr('disabled',false); 
      $scope.patient.form['birthdate'+index].$setViewValue('');
      $scope.patient.form['testdate'+index].$setViewValue('');
    }
  };

  this.calculateAge = function(index){
      var birthDate = $scope.patient.form['birthdate'+index].$viewValue;
      var testDate = $scope.patient.form['testdate'+index].$viewValue;
      if(testDate!=='' && birthDate!==''){
        var d1 = moment(birthDate);
        var d2 = moment(testDate);
        var years = moment.duration(d2.diff(d1)).asYears();
        $scope.patient.form['age'+index].$setViewValue(years);
        $('#age'+index).val(years);
      }
  };

  this.submit=function(isValid){
  // check to make sure the form is completely valid
    if ($scope.patient.form.$invalid) {
        console.log($scope.patient.form.$error);
        $scope.treeCtrl.submited = true;
    }
    else{
      $scope.treeCtrl.submited = true;
      var limit = 1;
      var patientObj = {conf:$scope.patient.conf,sig:$scope.patient.sig,nomative:$scope.patient.nomative};
      for (var i in $scope.patient) {
        if(limit<this.counter){
          var patientTest = [];
          for (var key in $scope.patient[i].test) {
            if ($scope.patient[i].test.hasOwnProperty(key)) {
              var idField =  key;//(key).replace(/_/g," ");
              var labelField =  findTest(idField,'id');
              patientTest.push({
                                id:idField,
                                label:labelField.label,
                                Dataset:labelField.Dataset,
                                'SPSS name':labelField['SPSS name'],
                                highborder:labelField.highborder,
                                highweb:labelField.highweb,
                                lowborder:labelField.lowborder,
                                lowweb:labelField.lowweb,
                                value:$scope.patient[i].test[key]
                              });
            }
            patientObj[i] = {id:$scope.patient[i].id,
                            age:$scope.patient[i].age,
                            'birthdate':$scope.patient[i].birthdate,
                            'testdate':$scope.patient[i].testdate,
                            sex:$scope.patient[i].sex,
                            education:$scope.patient[i].education,
                            test:patientTest};
          }
          limit++;
        }
      }
      $scope.submitData1 = JSON.stringify(patientObj);     
      $scope.submitData = patientObj;
      $scope.submitData = $scope.submitData1.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
      $scope.$parent.panel.next();
      $scope.$broadcast("MoveToChart"); 
    } 
  };

  this.verifyId = function() {
    var sorted = [];
    for (var i in $scope.patient) {
      if($scope.patient[i].id!==null && $scope.patient[i].id!==undefined)
      {
        if ($.inArray($scope.patient[i].id, sorted) >= 0) {
          $scope.patient.form['id'+i].$setValidity('duplicate',!true);
        }
        else{
          sorted.push($scope.patient[i].id);
          $scope.patient.form['id'+i].$setValidity('duplicate',!false);
        }
      } 
    }
  };

  this.uploadCsv = function(){
    var files = $("#fileContent")[0].files;
    var sorted = [];

    if (files.length) {
      $scope.opts =  {
                  animation: $scope.animationsEnabled,
                  templateUrl: 'views/replaceViewDialog.html',
                  controller: 'ModalInstanceCtrl',
                  size: '',
                  resolve: {
                  }
              };
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/replaceViewDialog.html',
        controller: 'ModalInstanceCtrl',
        size: '',
        resolve: {
        }
      });
      modalInstance.result.then(function (obj) {
        $scope.treeCtrl.txtvalue = obj.txtvalue;
        var replacearr = obj.txtvalue.split(";");
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            var rows = contents.split('\n');
            $scope.patient[0] = {'id':'','age':'','birthdate':'','testdate':'','sex':'','education':'','test':{}};
            
            angular.forEach(rows, function(val,key) {
              var data = val.split(';');
              if(key===1){
                var k = 1;
                for(var i=0;i<data.length;i++){
                  if(data[i]!=='' && i>1){
                    $scope.patient[k] = {'id':'','age':'','birthdate':'','testdate':'','sex':'','education':'','test':{}};
                    $timeout(function() {
                      $scope.treeCtrl.counterlimit++;
                      $scope.treeCtrl.tabledata[$scope.treeCtrl.counterlimit] = 'Table '+$scope.treeCtrl.counterlimit;
                      $scope.treeCtrl.counter++;
                    }, 50);
                    k++;
                  }
                }
              }

              if(key>0){
                $timeout(function() {
                  for(var j=0;j<data.length;j++){
                    var fieldVal = '';
                    if(data[j]!=='' && j!==0){
                      if(key>4){
                        var field = data[0];//data[0].replace(/ /g,"_");//'#test'+j+'_'+data[0].replace(/ /g,"");
                        fieldVal = data[j];//parseInt(data[j]);
                        if ($.inArray(fieldVal, replacearr) >= 0) {
                          fieldVal = 999999999;
                        }
                        else{
                          fieldVal = parseInt(fieldVal);
                        }
                        $scope.patient.form['test'+(j-1)+'_'+field].$setViewValue(fieldVal);
                        $scope.patient[j-1].test[field] = fieldVal;
                        $('#test'+(j-1)+'_'+field.replace(/ /g,"_")).val(fieldVal);
                      }
                      else{
                        $scope.patient.form[data[0]+(j-1)].$setViewValue(data[j]);
                        fieldVal = data[j];
                        if(data[0]==='age'){
                          $('#birthdate'+(j-1)).attr('disabled',true);
                          $('#testdate'+(j-1)).attr('disabled',true);
                          $scope.patient.form['birthdate'+(j-1)].$setViewValue('1992-05-06');
                          $scope.patient.form['testdate'+(j-1)].$setViewValue('1992-05-06');
                          fieldVal = parseInt(fieldVal);
                        }
                        if(data[0]==='sex' || data[0]==='education'){
                          fieldVal = parseInt(fieldVal);
                        }
                        document.getElementById(data[0]+(j-1)).value = fieldVal;
                        //$('#'+data[0]+(j-1)).val(data[j]);
                      }
                    } 
                  }
                  $('.remBtn').parent().html('Patient');
                  $("#fileContent").val(''); 
                }, 50);
              }

            });
        };
        r.readAsText(files[0]);  
        $('.fileinput').hide();
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }
  };

  var findTest = function(value,findField){
    $scope.testid = {};
    $scope.keepgoing = true;
    childTest($scope.treeCtrl.tests,value,findField);
    $scope.keepgoing = true;
    return $scope.testid;
  };

  var childTest = function(scope,value,findField){
    angular.forEach(scope, function(childVal,childKey) {
      if($scope.keepgoing) {
        if(childVal.children.length>0){
          childTest(childVal.children,value,findField);
        }
        else
        {
          if(childVal[findField]===value){
            $scope.testid = childVal;
            $scope.keepgoing = false;
          }
        }
      }
    });
  };

});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close({txtvalue:$('#txtvalue').val()});
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


app.controller('plotController', function($scope,$http,diagnosisService){

  $scope.$on('MoveToChart', function(e) {  
    $scope.plotCtrl.FormChart();
  });
  /* Chart options */
  this.FormChart=function(){
    if($scope.patient.chart==="scatter"){

    }
    else if($scope.patient.chart==="radar"){

    }
    else{
      var patientObj = $scope.$parent.submitData;
      var config = {
          headers: {
            'Content-Type': 'application/json;'
          }
      };
      $http.post('http://145.100.58.103:5000/formTestScores',patientObj, config)
      .success(function (data) {
          console.log(data);
          diagnosisService.lineChart(data);
      })
      .error(function (data) {
        console.log(data);  
      });
    }
  };
  
});


