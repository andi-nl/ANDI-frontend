'use strict';
//test data goes here
/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */

/*
  @name andiApp.controller:PanelCtrl
  @description : change tab code made in this controller
*/
app.controller("PanelController",function($scope,$rootScope){
  this.tab=1; // Default Active Tab
  /*show and hide the clicked tab panel*/
  this.isSelected= function(checkTab){
    return this.tab === checkTab;
  };
  /*previous button click event to backward one tab*/
  this.previous = function(){
    $rootScope.filebutton = true;
    return this.tab       = this.tab-1;
  };
  /*next button click event to move on tab forward*/
  this.next   = function(){
    return this.tab = this.tab+1;
  };
});