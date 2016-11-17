angular
  .module('andiApp')
  .controller('testSelectionController', testSelectionController);

testSelectionController.$inject = [
  '$rootScope', '$scope', '$location', '$timeout', '$uibModal', '$q',
  'patientDataservice', 'testTableService', '$window', 'ivhTreeviewMgr'
];

function testSelectionController($rootScope, $scope, $location, $timeout,
  $uibModal, $q, patientDataservice, testTableService, $window, ivhTreeviewMgr) {
  var vm = this;

  var testArr = [];
  $rootScope.tests = ($rootScope.tests !== undefined) ? $rootScope.tests : [];
  $rootScope.selectedTest = ($rootScope.selectedTest !== undefined) ? $rootScope.selectedTest : {};     // Make selected test object
  $rootScope.filebutton = true;
  $rootScope.nomative = ($rootScope.nomative !== undefined) ? $rootScope.nomative : '';
  $rootScope.nodeArr = ($rootScope.nodeArr !== undefined) ? $rootScope.nodeArr : [];
  $scope.normativedatalabel = true;
  $scope.downloadtemplate = false;
  $rootScope.fileData = '';

  vm.templateData = '';

  /* Normative Date Change Time load new selected date test data*/
  testTableService.getRelease(function (response) {
    $scope.folders = response;
    var val = ($rootScope.nomative !== '') ? $rootScope.nomative : $scope.folders.value;
    treeData(val);
  });

  vm.getTreeData = function (val) {
    treeData(val);
  }
  var treeData = function (val) {
    testTableService.getTest(val, function (dataObj) {
      $scope.normativedatalabel = true;
      $rootScope.tests = dataObj.data;
      $rootScope.nomative = dataObj.defaultFolder;
      if ($rootScope.selectedTest !== undefined) {
        angular.forEach($rootScope.selectedTest, function (value, key) {
          testArr.push(value.id);
        });
        ivhTreeviewMgr.selectEach($rootScope.tests, testArr);
      }
    });
  };

  vm.go = function (path) {
    // TODO: make sure tests are selected (issue #127)

    // Add intermediary variables to $rootScope.selectedTest
    testTableService.getTestsDataFromCsv().then(function success(response){
      var csvConfig = {
        header: true,
        dynamicTyping: true,
      };
      var data = Papa.parse(response.data, csvConfig);
      var tests = data.data;

      var selectedTestsWithComputedVarArguments = {};
      var computedVarArgs;
      angular.forEach($rootScope.selectedTest, function(test){
        computedVarArgs = test.computed_variable_arguments.split(',');
        if(computedVarArgs[0] !== ""){
          computedVarArgs.forEach(function(arg){
            var add = _.find(tests, function(t) { return t.ID === arg; });
            add.intermediary = true;
            add.intermediaryValueFor = test.id;
            add.disabled = false;
            add.class = 'intermediary';
            selectedTestsWithComputedVarArguments[arg] = add;
          });
          test.class = 'computed';
        }
        test.disabled = false;
        selectedTestsWithComputedVarArguments[test.id] = test;
      });
      $rootScope.selectedTest = selectedTestsWithComputedVarArguments;
    }, function error(response){
      console.log('error');
      console.log(response);
    });

    $location.path(path);
  };

  /* get selected Normative Date test List*/
  // this.getTreeData();
  /*
    get Normative Date  Dropdown List and pass defaultFolder value
    to select by default date
  */
  vm.selectDate = function () {
    $scope.normativedatalabel = false;
  };

  /*
    In *test selection page* test search textbox time expand all tree data and
    textbox clear time collapse all tree data
  */
  vm.treeExpanded = function (val) {
    testTableService.expandCollapseTree(val);
  };

  /*
  get Selected test list object , when user click any test that time this
  event called
  */
  vm.getSelectedNodes = function (node) {
    if (node.selected === true && (node.children !== undefined && node.children.length === 0)) {
      if ($rootScope.nodeArr.indexOf(node.id) < 0) {
        $rootScope.nodeArr.push(node.id);
      };
      $rootScope.selectedTest[node.id] = node;
    }
    if (node.selected === false && (node.children !== undefined && node.children.length === 0)) {
      if ($rootScope.selectedTest[node.id] !== undefined) {
        delete $rootScope.selectedTest[node.id];
        var arr = [];
        angular.forEach($rootScope.nodeArr, function (nodeval, nodekey) {
          if (nodeval !== node.id) {
            this.push(nodeval);
          }
        }, arr);
        $rootScope.nodeArr = arr;
      }
    }
    $scope.downloadtemplate = !(_.isEmpty($rootScope.selectedTest));
    if (node.selected === true || (node.children !== undefined && node.children.length > 0)) {
      return node.id;
    }
  };

  /*
   upload csv file and make form based on csv file
  */
  vm.uploadCsv = function () {
    var files = $('#files')[0].files; // get file content
    $rootScope.fileData = files;
    if (files.length) {
      // open model popup for replace constant value
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'static/app/views/replaceViewDialog.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
        }
      });
      // modal popup success
      modalInstance.result.then(function (obj) {
        $rootScope.txtvalue = obj.txtvalue;
        $('.fileinput').hide();
        $rootScope.filebutton = false;
        $location.path('/data-entry');
      }, function () {
        // show errors
        console.log('Modal dismissed at: ' + new Date());
      });
    }
  };

  /*
   * Create csv upload file, using papa parse
   */
  vm.dataTemplate = function(){
    var fields = ["", "Information", "Patient 1"];
    var data = [
      ["id", "(alphanumeric)", ""],
      ["age", "(in years)", ""],
      ["sex", "(M-0 F-1)", ""],
      ["education", "(1-7)", ""]
    ];
    var info;

    _.forEach($rootScope.selectedTest, function(value, key){
      info = "("+value.lowweb+"-"+value.highweb;
      if(value.intermediary){
        info = info+"; intermediary value for "+value.intermediaryValueFor;
      }
      info = info+")";
      data.push([key, info, ""]);
    });

    // set the data for the download template
    var config = {
      delimiter: '\t'
    }
    var csvData = Papa.unparse({
      fields: fields,
      data: data
    }, config)
    vm.templateData = 'data:text/csv;charset=UTF-8,' + encodeURI(csvData);
  };
}
