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
}
