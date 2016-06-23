'use strict';
angular
	.module('andiApp')
  	.factory('patientDataservice', patientDataservice);

patientDataservice.$inject = ['testTableService','$rootScope'];

function patientDataservice(testTableService,$rootScope) {
	var limit                 = 0;
	var patientObj            = {};
 	var patientTest 		  = {};
 	var d1 = '';
    var d2 = '';
    var yrs = '';
    var years = '';
  	return {
      	addPatient		: addPatient,
      	submitPatient 	: submitPatient,
      	calculateAge 	: calculateAge
  	};
  	function addPatient(selectedTest) {
		  return { 'id': '', 'age': '', 'birthdate': '', 'testdate': '', 'sex': '', 'education': '', 'test': selectedTest };		
  	}
  	function submitPatient($scope){
      //make Patient Object
      	limit                 = 0;
      	patientObj.settings            = {conf:$scope.patientData.conf,
                                    sig:$scope.patientData.sig,
                                    nomative:$rootScope.nomative,
                                    chart : $rootScope.chart};
        patientObj.patientScores = [];
      	for (var i in $scope.patient) {
	        if(limit<$scope.dataEntry.counter){
             	var patientTest  = {id:$scope.patient[i].id,
	                              age:$scope.patient[i].age,
	                              'birthdate':$scope.patient[i].birthdate,
	                              'testdate':$scope.patient[i].testdate,
	                              sex:$scope.patient[i].sex,
	                              education:$scope.patient[i].education,
	                              test:[]};

	            angular.forEach($scope.nodeArr,function(nodeval,nodekey){
	              var labelField =  testTableService.findTest(nodeval,'id');
	              if($scope.patient[i].test!==undefined && $scope.patient[i].test[nodeval]!==undefined){
	                patientTest.test.push({
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
	                patientTest.test.push({
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
             		
	            });
				patientObj.patientScores.push(patientTest);
	          limit++;
	        }
      	}
      	return patientObj;
  	}
  	function calculateAge(birthDate,testDate){
  		d1 = moment(birthDate);
        d2 = moment(testDate);
        yrs = moment.duration(d2.diff(d1)).asYears();
        years = Math.round(yrs);
        return years;
  	}
};
