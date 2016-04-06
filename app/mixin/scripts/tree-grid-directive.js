angular
    .module('template/treeGrid/treeGrid.html', [])
    .run([
      '$templateCache',
      function ($templateCache) {
            $templateCache.put('template/treeGrid/treeGrid.html',
            "<div>\n" +
            "<table ng-style=\"{ width:row1.treeIndex===0? '600px' : '' }\" class=\"table table-bordered\" export-csv=\"csv\" separator=\";\" ng-repeat=\"row1 in tree_field\">\n" +
            "        <tr>\n" +
            "         <td class=\"left-td\" ng-if=\"row1.treeIndex === 0\">Demographics</td>\n" +
            "         <td ng-if=\"row1.treeIndex === 0\">Patient</td>\n" +
            "         <td ng-if=\"row1.treeIndex !== 0\">\n" +
            "           <div ng-if=\"row1.treeIndex !== 0\">\n" +
            "           <span ng-show=\"treeDisable\" >Patient</span>\n" +
            "             <button ng-hide=\"treeDisable\" class=\"remBtn\"  ng-click=\"row1.treeTableControl.removeColumn(row1.treeIndex)\">Remove</button>\n" +
            "           </div>\n" +
            "         </td>\n" +
            "        </tr>\n" +
            "        <tr>\n" +
            "          <td class=\"left-td\" ng-if=\"row1.treeIndex === 0\">id</td>\n" +
            "          <td>\n" +
            "          <input ng-disabled=\"treeDisable\"  type=\"text\" name=\"id{{row1.treeIndex}}\" id=\"id{{row1.treeIndex}}\" ng-model=\"row1.patient[row1.treeIndex].id\" required>\n" +
            "           <span class=\"has-error\" ng-show=\"row1.patient.form.id{{row1.treeIndex}}.$error.required && treeTableControl.submited\">Required</span> </td>\n"+
            "        </tr>\n" +
            "      <tr>\n" +
            "        <td class=\"left-td\" ng-if=\"row1.treeIndex === 0\">age</td>\n" +
            "        <td>\n" +
            "        <input ng-disabled=\"treeDisable\" type=\"date\" name=\"age{{row1.treeIndex}}\" id=\"age{{row1.treeIndex}}\" ng-model=\"row1.patient[row1.treeIndex].age\" required>\n" +
            "           <span class=\"has-error\" ng-show=\"row1.patient.form.age{{row1.treeIndex}}.$error.required && treeTableControl.submited\">Required</span> </td>\n" +
            "        </td>\n" +
            "      </tr>\n" +
            "      <tr>\n" +
            "        <td class=\"left-td\" ng-if=\"row1.treeIndex === 0\">sex</td>\n" +
            "        <td>\n" +
            "          <select ng-disabled=\"treeDisable\" name=\"sex{{row1.treeIndex}}\" id=\"sex{{row1.treeIndex}}\" ng-model=\"row1.patient[row1.treeIndex].sex\" required>\n" +
            "                  <option value=\"0\"> Male </option>\n" +
            "                  <option value=\"1\"> Female</option> \n" +
            "                </select>\n" +
            "          <span class=\"has-error\" ng-show=\"row1.patient.form.sex{{row1.treeIndex}}.$error.required && treeTableControl.submited\">Required</span> </td>\n" +
            "        </td>\n" +
            "      </tr>\n" +
            "      <tr>\n" +
            "          <td class=\"left-td\" ng-if=\"row1.treeIndex === 0\">education</td>\n" +
            "          <td>\n" +
            "            <select ng-disabled=\"treeDisable\" name=\"education{{row1.treeIndex}}\" id=\"education{{row1.treeIndex}}\" ng-model=\"row1.patient[row1.treeIndex].education\" required>\n" +
            "              <option value=\"1\"> Verhage 1 </option>\n" +
            "              <option value=\"2\"> Verhage 2 </option>\n" +
            "              <option value=\"3\"> Verhage 3</option> \n" +
            "              <option value=\"4\"> Verhage 4</option> \n" +
            "              <option value=\"5\"> Verhage 5</option> \n" +
            "              <option value=\"6\"> Verhage 6</option> \n" +
            "              <option value=\"7\"> Verhage 7</option> \n" +
            "            </select>\n" +
            "          <span class=\"has-error\" ng-show=\"row1.patient.form.education{{row1.treeIndex}}.$error.required && treeTableControl.submited\">Required</span> </td>\n" +
            "        </td>\n" +
            "      </tr>\n" +
            "     <tr ng-repeat=\"row in tree_rows | searchFor:$parent.filterString:expandingProperty:colDefinitions track by row.branch.uid\"\n" +
            "      ng-if=\"row.branch.isSelected && row.branch.level!==1\"  ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? 'active':'')\" class=\"tree-grid-row\">\n" +
            "       <td class=\"left-td\" ng-if=\"row1.treeIndex === 0\" colspan=\"{{row.colspan}}\" ><span class=\"indented tree-label\" ng-click=\"on_user_click(row.branch)\">\n" +
            "             {{row.branch[expandingProperty.field] || row.branch[expandingProperty]}}</span>\n" +
            "       </td>\n" +
            "       <td ng-repeat=\"col in colDefinitions\">\n" +
            "         <input ng-model=\"row1.patient[row1.treeIndex].test[row.id]\" name=\"test{{row1.treeIndex}}_{{row.id}}\" id=\"test{{row1.treeIndex}}_{{row.id}}\"  ng-disabled=\"treeDisable\" type=\"number\" min=\"{{row.branch.lowweb}}\" max=\"{{row.branch.highweb}}\" required>\n" +
            "          <span class=\"has-error\" ng-show=\"row1.patient.form.test{{row1.treeIndex}}_{{row.id}}.$error.required && treeTableControl.submited\">Required</span>\n" +
            "          <span class=\"has-error\" ng-show=\"row1.patient.form.test{{row1.treeIndex}}_{{row.id}}.$error.min && treeTableControl.submited\">Enter value between {{row.branch.lowweb}} to {{row.branch.highweb}}</span>\n" +
            "          <span class=\"has-error\" ng-show=\"row1.patient.form.test{{row1.treeIndex}}_{{row.id}}.$error.max && treeTableControl.submited\">Enter value between {{row.branch.lowweb}} to {{row.branch.highweb}}</span>\n" +
            "          <span class=\"has-error\" ng-show=\"row1.patient.form.test{{row1.treeIndex}}_{{row.id}}.$error.number && treeTableControl.submited\">Not valid number!</span> </td>\n" +
            "       </td>\n" +
            "     </tr>\n" +
            " </table>\n" +
            "</div>\n" +
            "");
      }]);
  angular
    .module('treeGrid', [
      'template/treeGrid/treeGrid.html'
    ])
    .directive('compile', [
      '$compile',
      function ($compile) {
        return {
          restrict: 'A',
          link    : function (scope, element, attrs) {
            scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);
            // Watch for changes to expression.
            scope.$watch(attrs.compile, function (new_val) {
              /*
               * Compile creates a linking function
               * that can be used with any scope.
               */
              var link = $compile(new_val);
              /*
               * Executing the linking function
               * creates a new element.
               */
              var new_elem = link(scope);
              // Which we can then append to our DOM element.
              element.append(new_elem);
            });
          }
        };
      }])

    .directive('treeGrid', [
      '$timeout',
      'treegridTemplate',
      function ($timeout,
                treegridTemplate) {
        return {
          restrict   : 'E',
          templateUrl: function (tElement, tAttrs) {
            return tAttrs.templateUrl || treegridTemplate.getPath();
          },
          replace    : true,
          scope      : {
            treeIndex       : '=',
            treeData        : '=',
            treeObj         : '=',
            treeDisable         : '=',
            treeTable       : '=',
            colDefs         : '=',
            expandOn        : '=',
            onSelect        : '&',
            onClick         : '&',
            initialSelection: '@',
            treeControl     : '='
          },
          link       : function (scope, element, attrs) {
            var error, expandingProperty, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;

            error = function (s) {
              console.log('ERROR:' + s);
              debugger;
              return void 0;
            };
            attrs.iconExpand = attrs.iconExpand ? attrs.iconExpand : 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
            attrs.iconCollapse = attrs.iconCollapse ? attrs.iconCollapse : 'icon-minus glyphicon glyphicon-minus fa fa-minus';
            attrs.iconLeaf = attrs.iconLeaf ? attrs.iconLeaf : 'icon-file  glyphicon glyphicon-file  fa fa-file';
            attrs.sortedAsc = attrs.sortedAsc ? attrs.sortedAsc : 'icon-file  glyphicon glyphicon-chevron-up  fa angle-up';
            attrs.sortedDesc = attrs.sortedDesc ? attrs.sortedDesc : 'icon-file  glyphicon glyphicon-chevron-down  fa angle-down';
            attrs.expandLevel = attrs.expandLevel ? attrs.expandLevel : '3';
            expand_level = parseInt(attrs.expandLevel, 10);
            if (!scope.treeData) {
              //alert('No data was defined for the tree, please define treeData!');
              return;
            }
            var getExpandingProperty = function getExpandingProperty() {
              if (attrs.expandOn) {
                expandingProperty = scope.expandOn;
                scope.expandingProperty = scope.expandOn;
              } else {
                if (scope.treeData.length) {
                  var _firstRow = scope.treeData[0],
                    _keys = Object.keys(_firstRow);
                  for (var i = 0, len = _keys.length; i < len; i++) {
                    if (typeof (_firstRow[_keys[i]]) === 'string') {
                      expandingProperty = _keys[i];
                      break;
                    }
                  }
                  if (!expandingProperty) expandingProperty = _keys[0];
                  scope.expandingProperty = expandingProperty;
                }
              }
            };
            getExpandingProperty();
            if (!attrs.colDefs) {
              if (scope.treeData.length) {
                var _col_defs = [],
                  _firstRow = scope.treeData[0],
                  _unwantedColumn = ['children', 'level', 'expanded', expandingProperty];
                for (var idx in _firstRow) {
                  if (_unwantedColumn.indexOf(idx) === -1) {
                    _col_defs.push({
                      field: idx
                    });
                  }
                }
                scope.colDefinitions = _col_defs;
              }
            } else {
              scope.colDefinitions = scope.colDefs;
            }
            for_each_branch = function (f) {
              var do_f, root_branch, _i, _len, _ref, _results;
              do_f = function (branch, level) {
                var child, _i, _len, _ref, _results;
                f(branch, level);
                if (branch.children != null) {
                  _ref = branch.children;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    child = _ref[_i];
                    _results.push(do_f(child, level + 1));
                  }
                  return _results;
                }
              };
              _ref = scope.treeData;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                root_branch = _ref[_i];
                _results.push(do_f(root_branch, 1));
              }
              return _results;
            };
            selected_branch = null;
            select_branch = function (branch) {
              if (!branch) {
                if (selected_branch != null) {
                  selected_branch.selected = false;
                }
                selected_branch = null;
                return;
              }
              if (branch !== selected_branch) {
                if (selected_branch != null) {
                  selected_branch.selected = false;
                }
                branch.selected = true;
                selected_branch = branch;
                expand_all_parents(branch);
                if (branch.onSelect != null) {
                  return $timeout(function () {
                    return branch.onSelect(branch);
                  });
                } else {
                  if (scope.onSelect != null) {
                    return $timeout(function () {
                      return scope.onSelect({
                        branch: branch
                      });
                    });
                  }
                }
              }
            };
            scope.on_user_click = function (branch) {
              if (scope.onClick) {
                scope.onClick({
                  branch: branch
                });
              }
            };
            scope.user_clicks_branch = function (branch) {
              if (branch !== selected_branch) {
                  select_branch(branch);
              }
            };
/*
            scope.createModel = function(row){
              var tid = (row.branch.tableId).replace('-','.')
              return row.patient[row.treeIndex]+'.'+tid;
            };*/
            /* sorting methods */
            scope.sortBy = function (col) {
              if (col.sortDirection === "asc") {
                 sort_recursive(scope.treeData, col, true);
                 col.sortDirection = "desc";
                   col.sortingIcon = attrs.sortedDesc;
              } else {
                 sort_recursive(scope.treeData, col, false);
                 col.sortDirection = "asc";
                 col.sortingIcon = attrs.sortedAsc;
              }
                col.sorted = true;
                resetSorting(col);
              };
            var sort_recursive = function(elements, col, descending) {
              elements.sort(sort_by(col, descending));
              for (var i = 0; i < elements.length; i++) {
                  sort_recursive(elements[i].children, col, descending);
              }
            };
            var sort_by = function(col, descending) {
              var direction = !descending ? 1 : -1;
              if (col.sortingType === "custom" && typeof col.sortingFunc === "function") {
                return function (a, b) {
                  return col.sortingFunc(a, b) * direction;
                };
              }
              var key = function(x) {
                return (x[col.field] === null ? "" : x[col.field].toLowerCase());
              };
              switch(col.sortingType) {
                case "number":
                  key = function(x) { return parseFloat(x[col.field]); };
                  break;
                case "date":
                  key = function (x) { return new Date(x[col.field]); };
                  break;
              }
              return function (a, b) {
                return a = key(a), b = key(b), direction * ((a > b) - (b > a));
              };
            }
            var resetSorting = function(sortedCol) {
              var arraySize = scope.colDefinitions.length;
              for (var i= 0;i<arraySize;i++) {
                var col = scope.colDefinitions[i];
                if (col.field != sortedCol.field) {
                  col.sorted = false;
                    col.sortDirection = "none"; 
                }
              }
            }
              
            /* end of sorting methods */
            
            get_parent = function (child) {
              var parent;
              parent = void 0;
              if (child.parent_uid) {
                for_each_branch(function (b) {
                  if (b.uid === child.parent_uid) {
                    return parent = b;
                  }
                });
              }
              return parent;
            };
            for_all_ancestors = function (child, fn) {
              var parent;
              parent = get_parent(child);
              if (parent != null) {
                fn(parent);
                return for_all_ancestors(parent, fn);
              }
            };
            expand_all_parents = function (child) {
              return for_all_ancestors(child, function (b) {
                return b.expanded = true;
              });
            };

            scope.tree_rows = [];
            scope.tree_field = [{
              treeIndex: scope.treeIndex,
              patient  : scope.treeObj,
              treeTableControl : scope.treeTable,
              treeSubmitted     : scope.treeSubmitted
            }];
            scope.treeTableControl = scope.treeTable;
            scope.treeTableControlIndex  = scope.treeIndex;

         
            on_treeData_change = function () {
              getExpandingProperty();

              var add_branch_to_list, root_branch, _i, _len, _ref, _results;
              for_each_branch(function (b, level) {
                if (!b.uid) {
                  return b.uid = "" + Math.random();
                }
              });
              for_each_branch(function (b, level) {
                return b.tableId = (b.label).replace(/ /g,"_");
              });
              for_each_branch(function (b) {
                return b.validid = (b.id).replace(/ /g,"");
              });

              for_each_branch(function (b) {
                var child, _i, _len, _ref, _results;
                if (angular.isArray(b.children)) {
                  _ref = b.children;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    child = _ref[_i];
                    _results.push(child.parent_uid = b.uid);
                  }
                  return _results;
                }
              });
              scope.tree_rows = [];

              for_each_branch(function (branch) {
                var child, f;
                if (branch.children) {
                  if (branch.children.length > 0) {
                    f = function (e) {
                      if (typeof e === 'string') {
                        return {
                          label   : e,
                          children: []
                        };
                      } else {
                        return e;
                      }
                    };
                    return branch.children = (function () {
                      var _i, _len, _ref, _results;
                      _ref = branch.children;
                      _results = [];
                      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        child = _ref[_i];
                        _results.push(f(child));
                      }
                      return _results;
                    })();
                  }
                } else {
                  return branch.children = [];
                }
              });
              add_branch_to_list = function (level, branch, visible) {
                var child, child_visible, tree_icon, _i, _len, _ref, _results;
                if (branch.expanded == null) {
                  branch.expanded = false;
                }
                if (!branch.children || branch.children.length === 0) {
                  tree_icon = attrs.iconLeaf;
                } else {
                  if (branch.expanded) {
                    tree_icon = attrs.iconCollapse;
                  } else {
                    tree_icon = attrs.iconExpand;
                  }
                }
                branch.level = level;
                if(branch.isSelected && branch.children.length===0 ){
                  scope.tree_rows.push({
                    id       : (branch.id).replace(/ /g,"_"),
                    level    : level,
                    branch   : branch,
                    label    : branch.label,
                    tree_icon: tree_icon,
                    visible  : visible,
                    treeIndex: scope.treeIndex,
                    patient  : scope.treeObj,
                    colspan   : (branch.children.length>0)?2:1,
                    validid : (branch.id).replace(/ /g,""),
                  });
                }
                if (branch.children != null) {
                  _ref = branch.children;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    child = _ref[_i];
                    child_visible = visible && branch.expanded;
                    _results.push(add_branch_to_list(child.level, child, true));
                    //_results.push(add_branch_to_list(level + 1, child, child_visible));
                  }
                  return _results;
                }
              };
              _ref = scope.treeData;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                root_branch = _ref[_i];
                _results.push(add_branch_to_list(1, root_branch, true));
              }
              return _results;
            };

            scope.$watch('treeData', on_treeData_change, true);

            if (attrs.initialSelection != null) {
              for_each_branch(function (b) {
                if (b.label === attrs.initialSelection) {
                  return $timeout(function () {
                    return select_branch(b);
                  });
                }
              });
            }
            n = scope.treeData.length;
            for_each_branch(function (b, level) {
              b.level = level;
              return b.expanded = b.level < expand_level;
            });
            if (scope.treeControl != null) {
              if (angular.isObject(scope.treeControl)) {
                tree = scope.treeControl;
                tree.expand_all = function () {
                  return for_each_branch(function (b, level) {
                    return b.expanded = true;
                  });
                };
                tree.collapse_all = function () {
                  return for_each_branch(function (b, level) {
                    return b.expanded = false;
                  });
                };
                tree.get_first_branch = function () {
                  n = scope.treeData.length;
                  if (n > 0) {
                    return scope.treeData[0];
                  }
                };
                tree.select_first_branch = function () {
                  var b;
                  b = tree.get_first_branch();
                  return tree.select_branch(b);
                };
                tree.get_selected_branch = function () {
                  return selected_branch;
                };
                tree.get_parent_branch = function (b) {
                  return get_parent(b);
                };
                tree.select_branch = function (b) {
                  select_branch(b);
                  return b;
                };
                tree.get_children = function (b) {
                  return b.children;
                };
                tree.select_parent_branch = function (b) {
                  var p;
                  if (b == null) {
                    b = tree.get_selected_branch();
                  }
                  if (b != null) {
                    p = tree.get_parent_branch(b);
                    if (p != null) {
                      tree.select_branch(p);
                      return p;
                    }
                  }
                };
                tree.add_branch = function (parent, new_branch) {
                  if (parent != null) {
                    parent.children.push(new_branch);
                    parent.expanded = true;
                  } else {
                    scope.treeData.push(new_branch);
                  }
                  return new_branch;
                };
                tree.add_root_branch = function (new_branch) {
                  tree.add_branch(null, new_branch);
                  return new_branch;
                };
                tree.expand_branch = function (b) {
                  if (b == null) {
                    b = tree.get_selected_branch();
                  }
                  if (b != null) {
                    b.expanded = true;
                    return b;
                  }
                };
                tree.collapse_branch = function (b) {
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    b.expanded = false;
                    return b;
                  }
                };
                tree.get_siblings = function (b) {
                  var p, siblings;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    p = tree.get_parent_branch(b);
                    if (p) {
                      siblings = p.children;
                    } else {
                      siblings = scope.treeData;
                    }
                    return siblings;
                  }
                };
                tree.get_next_sibling = function (b) {
                  var i, siblings;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    siblings = tree.get_siblings(b);
                    n = siblings.length;
                    i = siblings.indexOf(b);
                    if (i < n) {
                      return siblings[i + 1];
                    }
                  }
                };
                tree.get_prev_sibling = function (b) {
                  var i, siblings;
                  if (b == null) {
                    b = selected_branch;
                  }
                  siblings = tree.get_siblings(b);
                  n = siblings.length;
                  i = siblings.indexOf(b);
                  if (i > 0) {
                    return siblings[i - 1];
                  }
                };
                tree.select_next_sibling = function (b) {
                  var next;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    next = tree.get_next_sibling(b);
                    if (next != null) {
                      return tree.select_branch(next);
                    }
                  }
                };
                tree.select_prev_sibling = function (b) {
                  var prev;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    prev = tree.get_prev_sibling(b);
                    if (prev != null) {
                      return tree.select_branch(prev);
                    }
                  }
                };
                tree.get_first_child = function (b) {
                  var _ref;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                      return b.children[0];
                    }
                  }
                };
                tree.get_closest_ancestor_next_sibling = function (b) {
                  var next, parent;
                  next = tree.get_next_sibling(b);
                  if (next != null) {
                    return next;
                  } else {
                    parent = tree.get_parent_branch(b);
                    return tree.get_closest_ancestor_next_sibling(parent);
                  }
                };
                tree.get_next_branch = function (b) {
                  var next;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    next = tree.get_first_child(b);
                    if (next != null) {
                      return next;
                    } else {
                      next = tree.get_closest_ancestor_next_sibling(b);
                      return next;
                    }
                  }
                };
                tree.select_next_branch = function (b) {
                  var next;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    next = tree.get_next_branch(b);
                    if (next != null) {
                      tree.select_branch(next);
                      return next;
                    }
                  }
                };
                tree.last_descendant = function (b) {
                  var last_child;
                  if (b == null) {
                    debugger;
                  }
                  n = b.children.length;
                  if (n === 0) {
                    return b;
                  } else {
                    last_child = b.children[n - 1];
                    return tree.last_descendant(last_child);
                  }
                };
                tree.get_prev_branch = function (b) {
                  var parent, prev_sibling;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    prev_sibling = tree.get_prev_sibling(b);
                    if (prev_sibling != null) {
                      return tree.last_descendant(prev_sibling);
                    } else {
                      parent = tree.get_parent_branch(b);
                      return parent;
                    }
                  }
                };
                return tree.select_prev_branch = function (b) {
                  var prev;
                  if (b == null) {
                    b = selected_branch;
                  }
                  if (b != null) {
                    prev = tree.get_prev_branch(b);
                    if (prev != null) {
                      tree.select_branch(prev);
                      return prev;
                    }
                  }
                };
              }
            }
          }
        };
      }
    ])

    .provider('treegridTemplate', function () {
      var templatePath = 'template/treeGrid/treeGrid.html';

      this.setPath = function (path) {
        templatePath = path;
      };



      this.$get = function () {
        return {
          getPath: function () {
            return templatePath;
          }
        };
      };
    })

  .filter('searchFor', function() {
    return function(arr, filterString, expandingProperty, colDefinitions) {
      var filtered = [];
      //only apply filter for strings 3 characters long or more
       if (!filterString || filterString.length < 3) {         
         for (var i = 0; i < arr.length; i++) {
                  var item = arr[i];
                  if (item.visible) {
                     filtered.push(item);
               }
          }
       } else {
        var ancestorStack = [];
        var currentLevel = 0;
              for (var i = 0; i < arr.length; i++) {
                 var item = arr[i];
                 while (currentLevel >= item.level) {
                   throwAway = ancestorStack.pop();
                   currentLevel--;
                 }
                 ancestorStack.push(item);
                 currentLevel = item.level;
                 if (include(item, filterString, expandingProperty, colDefinitions)) {
                  for(var ancestorIndex = 0; ancestorIndex < ancestorStack.length; ancestorIndex++) {
                    ancestor = ancestorStack[ancestorIndex];
                    if(ancestor.visible){
                      filtered.push(ancestor);
                    }
                  } 
                    ancestorStack = [];
                 }
              }
       }
           return filtered;
    };
    
    function include(item, filterString, expandingProperty, colDefinitions){
      var includeItem = false;
      var filterApplied = false;
      //first check the expandingProperty
      if (expandingProperty.filterable) {
        filterApplied = true;
          if(checkItem(item, filterString, expandingProperty)) {
            includeItem = true;
          }
      }
      //then check each of the other columns
      var arraySize = colDefinitions.length;
          for (var i= 0;i<arraySize;i++) {
            var col = colDefinitions[i];
            if (col.filterable) {
            filterApplied = true;
              if(checkItem(item, filterString, col)) {
                includeItem = true;
              }
          }           
          }
      if (filterApplied) {
          return includeItem;
      } else {
        return true;
      }     
    }
    
    function checkItem(item, filterString, col) {
      if (col.sortingType === "number") {
        if (item.branch[col.field] != null
              && parseFloat(item.branch[col.field]) === parseFloat(filterString)) {
          return true;
          }
      } else {
         if (item.branch[col.field] != null
          && item.branch[col.field].toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
           return true;
         }
      }
    }
  });
