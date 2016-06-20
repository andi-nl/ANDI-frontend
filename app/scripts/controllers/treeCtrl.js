'use strict';
/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */
/*
  @name andiApp.controller:treeController
  @description : we put form submit and csv upload code here
*/
app.controller('treeController', function($http,$rootScope,$scope,$timeout,$uibModal,$q,diagnosisService,$window,ivhTreeviewMgr,defaultFolder) {
  this.tests        = [];
  this.txtvalue     = '';
  this.txtReplace   = '';
  this.alertMessage = '';
  this.counter      = 1;
  this.ageCalculate = true;
  this.submited     = false; // for custom validation flag
  this.selectedTest = {};     // Make selected test object
  /*Patient List*/
  this.patient      = [{'id':'','age':'','birthdate':'','testdate':'','sex':'','education':'','test':{}}];
  $rootScope.filebutton = true;
  $scope.patientData= {};
  $scope.nodeArr    = [];
  $scope.message    = 'Data Uploaded successfully.';
  $scope.normativedatalabel = true;
  $scope.downloadtemplate   = false;
  /*Datepicker code*/
  $scope.popup2     = { opened: false };
  $scope.popup1     = { opened: false };
  /*End Datepicker code*/
  /*Normative Date Change Time load new selected date test data*/
  this.getTreeData = function(val){
    diagnosisService.getTest(val)
    .then(function goToHome(dataObj) {
      //show success
      $scope.normativedatalabel   = true;
      $scope.treeCtrl.tests       =  dataObj.data;
      $scope.patientData.nomative = dataObj.defaultFolder;
      $timeout(function(){
         ivhTreeviewMgr.selectEach($scope.treeCtrl.tests, ['m']);
      },1000);
    })
    .catch(function showerror(msg) {
        //show error
        $window.alert(msg);
    });
  };
  /*get selected Normative Date test List*/
  this.getTreeData(defaultFolder);
  /*
    get Normative Date  Dropdown List and pass defaultFolder value
    to select by default date
  */
  diagnosisService.getRelease(defaultFolder)
    .then(function goToHome(folderObj) {
      //show success
      $scope.folders = folderObj;
    })
    .catch(function showerror(msg) {
        //show error
        $window.alert(msg);
    });
  this.selectDate = function(){
    $scope.normativedatalabel = false;
  };
  /*
    In tab1 test search textbox time expand all tree data and 
    textbox clear time collapse all tree data
  */
  this.treeExpanded = function(){
    if($scope.testSearch===''){
      ivhTreeviewMgr.collapseRecursive($scope.treeCtrl.tests, $scope.treeCtrl.tests);
    }
    if($scope.testSearch!=='' && $scope.testSearch.length>0){
      ivhTreeviewMgr.expandRecursive($scope.treeCtrl.tests, $scope.treeCtrl.tests);
    }
  };
  /*
  get Selected test list object , when user click any test that time this 
  event called
  */
  this.getSelectedNodes=function(node){
    if (node.isSelected===true && (node.children!==undefined && node.children.length===0)) {
      if($scope.nodeArr.indexOf(node.id)<0){
        $scope.nodeArr.push(node.id);
      };
      this.selectedTest[node.id] = node;
      this.patient[0].test = this.selectedTest;
    }
    if (node.isSelected===false && (node.children!==undefined && node.children.length===0)) {
      if(this.selectedTest[node.id]!==undefined){
        delete this.selectedTest[node.id];
      }
    }
    $scope.downloadtemplate = !(_.isEmpty(this.selectedTest));
    if (node.isSelected===true || (node.children!==undefined && node.children.length>0)) {
      return node.id;
    }
  };
  /* 
    Add Patient button event , when user click add patient button
    that time push new object in patient array
  */
  this.addPatient=function(){
    this.patient.push({'id':'','age':'','birthdate':'','testdate':'','sex':'','education':'','test':this.selectedTest});
    this.counter++;
  };
  /*
   remove patient inside form and also check atleast one patient data
    needed to process further 
  */
  this.removeColumn = function (index,event) {
    // remove the column specified in index
    // you must cycle all the rows and remove the item
    // row by row
    if(this.patient.length>1){
      this.patient.splice(index, 1);
      var formObj = $scope.patient.form;
      delete $scope.patient['form'];
      var x=[];
      $.each($scope.patient, function(i,n) {
          x.push(n);
      });
      x.splice(index, 1);
      $scope.patient = x.reduce(function(o, v, i) {
        o[i] = v;
        return o;
      }, {});
      $scope.patient.form = formObj;
      this.counter--;
    }
    else{
      alert('Data for atleast one patient needs to be filled in !');
      event.preventDefault();
    }
  };
  /*
    patient form age enter time disable particular column
    birthdate and testdate field
  */
  this.disableDate = function(index){
    if($scope.patient.form['age'+index].$viewValue!==''){
      $('#birthdate'+index).attr('disabled',true);
      $('#testdate'+index).attr('disabled',true);
    }
    else{
      $('#birthdate'+index).attr('disabled',false);
      $('#testdate'+index).attr('disabled',false); 
    }
  };
  /*
    age field calculation on birthdate and testdate filed
  */
  this.calculateAge = function(index){
    if(this.ageCalculate){
      var birthDate = $scope.patient.form['birthdate'+index].$viewValue;
      var testDate = $scope.patient.form['testdate'+index].$viewValue;
      if(testDate!=='' && birthDate!==''){
        var d1 = moment(birthDate);
        var d2 = moment(testDate);
        var yrs = moment.duration(d2.diff(d1)).asYears();
        var years = Math.round(yrs)
        $scope.patient.form['age'+index].$setViewValue(years);
        $('#age'+index).val(years);
      }
    }
  };
  /*
   form id field unique validation check
  */
  this.verifyId = function() {
    var sorted = [];
    for (var i in $scope.patient) {
      if($scope.patient[i].id!==null && $scope.patient[i].id!=='' && $scope.patient[i].id!==undefined )
      {
        if (sorted.indexOf($scope.patient[i].id) >= 0) {
          $scope.patient.form['id'+i].$setValidity('duplicate',!true);
          //$scope.patient.form['id0'].$setValidity('duplicate',!true);
        }
        else{
          sorted.push($scope.patient[i].id);
          $scope.patient.form['id'+i].$setValidity('duplicate',!false);
        }
      } 
    }
  };
  /*
   Submit form event to create patient object and move to next tab
  */
  this.submit   = function(isValid){
    // check to make sure the form is completely valid
    if ($scope.patient.form.$invalid) {
        $scope.treeCtrl.submited = true;
    }
    else{
      $scope.treeCtrl.submited  = true;
      var limit                 = 0;
      //make Patient Object
      var patientObj            = {conf:$scope.patientData.conf,
                                    sig:$scope.patientData.sig,
                                    nomative:$scope.patientData.nomative,
                                    chart : $scope.patientData.chart};
      for (var i in $scope.patient) {
        if(limit<this.counter){
          var patientTest = [];
            
            angular.forEach($scope.nodeArr,function(nodeval,nodekey){
              var labelField =  findTest(nodeval,'id');
              if($scope.patient[i].test!==undefined && $scope.patient[i].test[nodeval]!==undefined){
                patientTest.push({
                                  id:nodeval,
                                  label:labelField.label,
                                  Dataset:labelField.Dataset,
                                  'SPSS name':labelField['SPSS name'],
                                  highborder:labelField.highborder,
                                  highweb:labelField.highweb,
                                  lowborder:labelField.lowborder,
                                  lowweb:labelField.lowweb,
                                  value:$scope.patient[i].test[nodeval]
                                });
              }
              else{
                patientTest.push({
                                  id:nodeval,
                                  label:labelField.label,
                                  Dataset:labelField.Dataset,
                                  'SPSS name':labelField['SPSS name'],
                                  highborder:labelField.highborder,
                                  highweb:labelField.highweb,
                                  lowborder:labelField.lowborder,
                                  lowweb:labelField.lowweb,
                                  value:999999999
                                });
              }
              patientObj[i] = {id:$scope.patient[i].id,
                              age:$scope.patient[i].age,
                              'birthdate':$scope.patient[i].birthdate,
                              'testdate':$scope.patient[i].testdate,
                              sex:$scope.patient[i].sex,
                              education:$scope.patient[i].education,
                              test:patientTest};
            });
          limit++;
        }
      }
     // $scope.submitData1 = JSON.stringify(patientObj);     
      $scope.submitData = patientObj;
      console.log(patientObj);
      //$scope.submitData = $scope.submitData1.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
      $scope.$parent.panel.next();       // move to next tab event
      $scope.$broadcast("MoveToChart"); 
    } 
  };
  /*
   upload csv file and make form based on csv file
  */
  this.uploadCsv = function(){
    var files = $("#files")[0].files; //get file content
    var sorted = [];
    if (files.length) {
      // open model popup for replace constant value
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/replaceViewDialog.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
        }
      });
      // modal popup success
      modalInstance.result.then(function (obj) {
        $scope.treeCtrl.txtvalue = obj.txtvalue;
        var replacearr = obj.txtvalue.split(";");
        var r = new FileReader();
        /*
        read csv file and make daynamic form
        */
        r.onload              = function(e) {
            var contents      = e.target.result;
            var rows          = contents.split('\n');
            $scope.patient[0] = {'id':'','age':'','birthdate':'','testdate':'','sex':'','education':'','test':{}};
            $scope.nodeArr    = [];
            $scope.treeCtrl.selectedTest = {}; 
            angular.forEach(rows, function(val,key) {
              var data = val.split(';');
              if(key===1){
                var k = 1;
                for(var i=0;i<data.length;i++){
                  if(data[i]!=='' && i>1){
                    $scope.patient[k] = {'id':'','age':'','birthdate':'','testdate':'','sex':'','education':'','test':{}};
                    $scope.treeCtrl.counter++;
                    k++;
                  }
                }
              }
              if(key>4){
                if(data[0]!=='' && $scope.nodeArr.indexOf(data[0])<0){
                  $scope.nodeArr.push(data[0]);
                };
                if(isNaN(parseInt(data[0])) && data[0]!=='')
                {
                  var IdAvailability = findTest(data[0],'id');
                  if(IdAvailability && IdAvailability.id !== null && IdAvailability.id !== undefined ){
                      $scope.treeCtrl.selectedTest[data[0]] = '';
                  }
                  else{
                    $scope.message    = 'WARNING: Not all data was imported !';
                  }
                }
              }
            });
            angular.forEach($scope.patient, function(val,key) {
              if(parseInt(key))
              {
                $scope.treeCtrl.patient[key] = val;
              }
            });
            $timeout(function() {
              angular.forEach(rows, function(val,key) {
                var data = val.split(';');
                if(key>0){
                  for(var j=0;j<data.length;j++){
                    var fieldVal = '';
                    if(data[j]!=='' && j!==0){
                      if(key>4){
                        var IdAvailability = findTest(data[0],'id');
                       
                        if(IdAvailability && IdAvailability.id !== null && IdAvailability.id !== undefined ){
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
                      }
                      else{
                        $scope.patient.form[data[0]+(j-1)].$setViewValue(data[j]);
                        fieldVal = data[j];
                        if(data[0]==='age'){
                          $('#birthdate'+(j-1)).attr('disabled',true);
                          $('#testdate'+(j-1)).attr('disabled',true);
                          fieldVal = parseInt(fieldVal);
                        }
                        if(data[0]==='sex' || data[0]==='education'){
                          fieldVal = parseInt(fieldVal);
                        }
                        document.getElementById(data[0]+(j-1)).value = fieldVal;
                      }
                    } 
                  }
                  $("#files").val(''); 
                }
              });
              alert($scope.message);

            }, 100);
            $timeout(function() {
              $('#id1').trigger('change');
            },1000);

        };
        r.readAsText(files[0]);  
        $rootScope.filebutton = false;// hide the file field
        $('.fileinput').hide(); 
        $scope.$parent.panel.next();
      }, function () {
        //show errors
        console.log('Modal dismissed at: ' + new Date());
      });
    }
  };
  /*
  based on findField find particular test and return test object
  */
  var findTest = function(value,findField){
    $scope.testid   = {};
    $scope.keepgoing = true; //flag set false when test successfully finf
    childTest($scope.treeCtrl.tests,value,findField); // check on child test
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
            ivhTreeviewMgr.select($scope.treeCtrl.tests,$scope.treeCtrl.tests[3].children[0]);
            $scope.testid = childVal;
            $scope.keepgoing = false;
          }
        }
      }
    });
  };
});