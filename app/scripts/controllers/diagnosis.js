'use strict';
//test data goes here
/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */

var defaultFolder = '2016-01-14';  //default folder name when we take test data
/*
  @name andiApp.controller:PanelCtrl
  @description : change tab code made in this controller
*/
app.controller("PanelController",function(){
  this.tab=1; // Default Active Tab
  /*Tab Click Event*/
  this.selectTab=function(setTab){
    this.tab=setTab;
  };
  /*show the clicked tab panel*/
  this.isSelected=function(checkTab){
    return this.tab === checkTab;
  };
  /*previous button click event to backward one tab*/
  this.previous =function(){
    return this.tab= this.tab-1;
  };
  /*next button click event to move on tab forward*/
  this.next=function(){
    return this.tab = this.tab+1;
  };
});
/*
  @name andiApp.controller:treeController
  @description : we put form submit and csv upload code here
*/
app.controller('treeController', function($http,$scope,$timeout,$uibModal,$q,diagnosisService,$window) {
  
  this.tests    = [];
  var arr=[];
  this.txtvalue = '';
  this.txtReplace = '';
  this.isExpanded = false;
  this.alertMessage = '';
  this.counter = 1;
  this.ageCalculate = true;
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
  this.submited     = false; // for custom validation flag
  this.selectedTest = {};     // Make selected test object
  /*Patient List*/
  this.patient      = [{'id':'','age':'','birthdate':'','testdate':'','sex':'','education':'','test':{}}];
  $scope.patientData= {};
  $scope.message    = 'Data Uploaded successfully.';

  /*Datepicker code*/

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: false,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };
  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };
  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.popup2 = {
    opened: false
  };
  $scope.popup1 = {
    opened: false
  };
  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
    /*End Datepicker code*/

  /*get selected Normative Date test List*/
  diagnosisService.getTest(defaultFolder)
    .then(function goToHome(dataObj) { 
      //show success
      $scope.treeCtrl.tests =  dataObj.data;
      $scope.patientData.nomative = dataObj.defaultFolder;
    })
    .catch(function showerror(msg) {
        //show  error
        $window.alert(msg);
    });

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

  this.my_tree_handler = function (branch) {
      console.log('you clicked on', branch);
  };
  /*Normative Date Change Time load new selected date test data*/
  this.getTreeData = function(val){
    diagnosisService.getTest(val)
    .then(function goToHome(dataObj) {
      //show success
      $scope.treeCtrl.tests       =  dataObj.data;
      $scope.patientData.nomative = dataObj.defaultFolder;
    })
    .catch(function showerror(msg) {
        //show error
        $window.alert(msg);
    });
  };

  /*
    In tab1 test search textbox time expand all tree data and 
    textbox clear time collapse all tree data
  */
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

  this.otherAwesomeCallback = function(node, isSelected, tree) {
    // Do soemthing with node or tree based on isSelected
  };

  /*
  get Selected test list object , when user click any test that time this 
  event called
  */
  this.getSelectedNodes=function(node){
    //return node.label;
    if (node.isSelected===true && node.children.length===0) {
      this.selectedTest[node.id] = node;
      this.patient[0].test = this.selectedTest;
    }
    if (node.isSelected===false && node.children.length===0) {
      if(this.selectedTest[node.id]!==undefined){
        delete this.selectedTest[node.id];
      }
    }
    if (node.isSelected===true || node.children.length>0) {
      return node.id;
    }
  };

  /*Return JSON Data*/
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
  /* This function counts the number of occurance of each element
   in the array
  */
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
      $scope.patient.form['birthdate'+index].$setViewValue('1992-13-13');
      $scope.patient.form['testdate'+index].$setViewValue('1992-13-13');
    }
    else{
      $('#birthdate'+index).attr('disabled',false);
      $('#testdate'+index).attr('disabled',false); 
      $scope.patient.form['birthdate'+index].$setViewValue('');
      $scope.patient.form['testdate'+index].$setViewValue('');
    }
  };

  /*
    age field calculation on birthdate and testdate filed
  */
  this.calculateAge = function(index){
    if(this.ageCalculate){
      var birthDate = $scope.patient.form['birthdate'+index].$viewValue;
      var testDate = $scope.patient.form['testdate'+index].$viewValue;
      if(testDate!=='' && birthDate!=='' && testDate!=='1992-13-13' && birthDate!=='1992-13-13'){
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
   Submit form event to create patient object and move to next tab
  */
  this.submit=function(isValid){
    // check to make sure the form is completely valid
    if ($scope.patient.form.$invalid) {
        console.log($scope.patient.form.$error);
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
          for (var key in $scope.patient[i].test) {
            if ($scope.patient[i].test.hasOwnProperty(key)) {
              var idField =  key;
              //find test detail on id field
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
      console.log(patientObj);
      $scope.submitData = $scope.submitData1.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
      $scope.$parent.panel.next();       // move to next tab event
      $scope.$broadcast("MoveToChart"); 
    } 
  };

  /*
   form id field unique validation check
  */
  this.verifyId = function() {
    var sorted = [];
    for (var i in $scope.patient) {
      if($scope.patient[i].id!==null && $scope.patient[i].id!==undefined )
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
        size: '',
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
                    $scope.treeCtrl.counter++;
                    k++;
                  }
                }
              }
              if(key>4){
                if(isNaN(parseInt(data[0])) && data[0]!=='')
                {
                  var IdAvailability = findTest(data[0],'id');
                  if(IdAvailability && IdAvailability.id !== null && IdAvailability.id !== undefined ){
                      $scope.treeCtrl.selectedTest[data[0]] = '';
                  }
                  else{
                    $scope.message    = 'Not All Data Uploaded successfully.';
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
                          $scope.patient.form['birthdate'+(j-1)].$setViewValue('1992-13-13');
                          $scope.patient.form['testdate'+(j-1)].$setViewValue('1992-13-13');
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
                 // $('.remBtn').parent().html('Patient');
                  $("#files").val(''); 
                }
              });
              alert($scope.message);
            }, 1000);
        };
        r.readAsText(files[0]);  
        $('.fileinput').hide(); // hide the file field
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
            $scope.testid = childVal;
            $scope.keepgoing = false;
          }
        }
      }
    });
  };


});

/*
  @name andiApp.controller:ModalInstanceCtrl
  @description : modal popup controller to put ok and cancel popup event
*/
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close({txtvalue:$('#txtvalue').val()});
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


/*
  @name andiApp.controller:plotController
  @description : put third tab chart event
*/
app.controller('plotController', function($scope,$http,diagnosisService){
  //call during secont tab next button click time
  $scope.$on('MoveToChart', function(e) {  
    $scope.plotCtrl.FormChart();
  });
  /* Chart options */
  this.FormChart=function(){
    if($scope.patient.chart==="scatter"){ // scatter chart load

    }
    else if($scope.patient.chart==="radar"){ // radar chart load

    }
    else{ // defaut chart load
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


