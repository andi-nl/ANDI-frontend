'use strict';
/*
  @name andiApp.controller:ModalInstanceCtrl
  @description : modal popup controller to put ok and cancel popup event
*/
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close({ txtvalue: $('#txtvalue').val() });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
