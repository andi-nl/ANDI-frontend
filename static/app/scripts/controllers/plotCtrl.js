'use strict';
// test data goes here
/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */
/*
  @name andiApp.controller:plotController
  @description : put third tab chart event
*/
//app.controller('plotController', function ($scope, ocpuService) {
app.controller('plotController', function ($scope, ocpuService) {
  var plotCtrl = this;

  $scope.errorMessage = null;
  $scope.ellipsePlotWarning = null;

  var patients;
  plotCtrl.normcompDataCsv = '';
  plotCtrl.patientDataCsv = '';

  var color = d3.scale.category10();

  var add_legend = function (element, patients, pos){
    var legendSpace = 20;
    element.append('text')
      .attr('x', pos)
      .attr('y', 0)
      .attr('class', 'legend legend-title')
      .text('Click to (de)select:');

    patients.forEach(function (p, i) {
        element.append('text')
          .attr('x', pos)
          .attr('y', (i+1) * (legendSpace))
          .attr('class', 'legend legend-p' + p.key.replace(/\s+/g, ''))
          .style('fill', color(p.key))
          .on('click', function () {
            var active = this.active !== true;
            var newOpacity = active ? 0 : 0.5;
            d3.select('#tag' + p.key.replace(/\s+/g, ''))
              .transition().duration(100)
              .style('opacity', newOpacity);
              this.active = active;
            d3.selectAll('.circle' + p.key.replace(/\s+/g, ''))
              .transition().duration(100)
              .style('opacity', newOpacity);
              d3.selectAll('.legend-p' + p.key.replace(/\s+/g, '')).forEach(function (e){
                e.active = active;
              });
              if(active){
                d3.selectAll('.legend-p' + p.key.replace(/\s+/g, '')).style('fill', '#ddd');
              } else {
                d3.selectAll('.legend-p' + p.key.replace(/\s+/g, '')).style('fill', color(p.key));
              }
          })
          .text('patient: ' + p.key);
    });
  };

  plotCtrl.render = function () {
    var patientObj = $scope.$parent.submitData;
    ocpuService.normcomp(patientObj).then(function (data) {
      console.log(data);
      $scope.errorMessage = null;

      if('error' in data.data){
        console.log('error in plotCtrl: '+data.data.error);
        $scope.errorMessage = data.data.error;
      } else {
        // set export data
        var csvExportConfig = {quotes: false, delimiter: "\t", newline: "\r\n"};
        var csvData = Papa.unparse(data.data.data, csvExportConfig);
        plotCtrl.normcompDataCsv = 'data:text/plain;charset=utf-8,' + encodeURI(csvData);

        var pData = transformPatientScores(data.data.input.patientScores, data.data.tests);
        csvData = Papa.unparse(pData, csvExportConfig);
        plotCtrl.patientDataCsv = 'data:text/plain;charset=utf-8,' + encodeURI(csvData);

        patients = d3.nest()
          .key(function (p) { return p.id; })
          .entries(data.data.data);

        plotCtrl.plotLines(data.data.data);
        plotCtrl.plotTables(data.data.data);
        plotCtrl.plotEllipses(data.data.ellipse, data.data.tests);
      }

    });

    /*d3.queue()
        .defer(d3.json, "static/app/data/normcomp2.json")
        .defer(d3.json, "static/app/data/ellipsepoints3.json")
        .await(function (error, normcomp, ellipses_points) {
            if (error){ throw error; }

            console.log(normcomp);
            console.log(Papa.unparse(normcomp, {quotes: false, delimiter: "\t", newline: "\r\n"}));

            var csvData = Papa.unparse(normcomp, {quotes: false, delimiter: "\t", newline: "\r\n"});
            plotCtrl.normcompDataCsv = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);

            patients = d3.nest()
              .key(function (p) { return p.id; })
              .entries(normcomp);

            var tests = ["AVLT-total_1_to_5", "AVLT-delayed_recall_1_to_5", "AVLT-recognition_1_to_5"];

            plotCtrl.plotLines(normcomp);
            plotCtrl.plotTables(normcomp);
            plotCtrl.plotEllipses(ellipses_points, tests);
        });*/

    function transformPatientScores(patientScores, tests) {
      var data = [];
      var rows = ['id', 'age', 'sex', 'education'];
      rows = rows.concat(tests);

      var columns = [];
      patientScores.forEach(function (p, i) {
        columns.push('Patient ' + (i+1));
        p.test.forEach(function (t){
          p[t.id] = t.value;

        });
      });

      rows.forEach(function (row){
        var rowObj = {'': row};
        columns.forEach(function (c, i){
          rowObj[c] = patientScores[i][row];
        });

        data.push(rowObj);
      });
      return data;
    }
  };

  plotCtrl.plotLines = function (normcompData) {
    var margin = {
      top: 50,
      right: 180,
      bottom: 20,
      left: 50
    };
    var width = 700 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    normcompData = normcompData.map(function (p) {
      p.id = String(p.id);
      return p;
    });

    // tooltip
    var div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // scales
    var scalePadding = 0.5;
    var minScore = d3.min([d3.min(normcompData, function (d) {
      return d.inneredge;
    }),
      d3.min(normcompData, function (d) {
        return d.univariateT;
      })
    ]);
    minScore = minScore - scalePadding;
    var maxScore = d3.max([d3.max(normcompData, function (d) {
      return d.outeredge;
    }),
      d3.max(normcompData, function (d) {
        return d.univariateT;
      })
    ]);
    maxScore = maxScore + scalePadding;

    // for x need to translate test name to number
    var tests = normcompData.map(function (t) {
      return t.plotname;
    });
    tests = _.union(tests);

    var yScale = d3.scale.linear()
      .domain([minScore, maxScore])
      .range([height, 0]);

    // define plot
    var linesGraph = d3.select('#lines-graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')');

    var xAxis = d3.scale.ordinal().rangePoints([0, width], 1),
      y = {},
      dragging = {};

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

    xAxis.domain(tests);
    tests.forEach(function(element){
      y[element] = yScale;
    });

    var backgroundLines, foregroundLines;
    var backgroundCircles, foreGroundCircles;
    var line = d3.svg.line();

    // legend
    add_legend(linesGraph, patients, width + margin.right / 2);

    // Add margin areas
    // d3 area example: http://www.mattlayman.com/2015/d3js-area-chart.html
    var upperMarginArea = d3.svg.area()
      .x(function (d) {
        return xAxis(d);
      })
      .y0(function (d) {
        return y[d](0.0)
      })
      .y1(function (d) {
        var dataPoint = _.filter(patients[0].values, ['plotname', d])[0];
        return y[d](dataPoint.outeredge);
      });

    var upperMargin = linesGraph.append('path')
        .attr('class', 'margin-area')
        .datum(tests)
        .attr('d', upperMarginArea);

    var lowerMarginArea = d3.svg.area()
      .x(function (d) {
        return xAxis(d);
      })
      .y0(function (d) {
        var dataPoint = _.filter(patients[0].values, ['plotname', d])[0];
        return y[d](dataPoint.inneredge);
      })
      .y1(function (d) {
        return y[d](0.0);
      });

      var lowerMargin = linesGraph.append('path')
          .attr('class', 'margin-area')
          .datum(tests)
          .attr('d', lowerMarginArea);

    // add mean line
    linesGraph.append('path')
        .attr('class', 'mean-line')
        .attr('d', pathMean);

    // add grey lines for context
    backgroundLines = linesGraph.append('g')
        .attr('class', 'background-lines')
        .selectAll('path')
        .data(patients)
      .enter().append('path')
        .attr('class', 'patient-line')
        .attr('d', path)
        .style('stroke', '#ddd')
        .style('fill', 'none');

    // add colored lines (connect patient tests)
    foregroundLines = linesGraph.append('g')
        .attr('class', 'foreground-lines')
        .selectAll('path')
        .data(patients)
      .enter().append('path')
        .attr('class', 'patient-line')
        .attr('d', path)
        .attr('id', function(p){ return 'tag' + p.key.replace(/\s+/g, ''); })
        .style('stroke', function(p){ return color(p.key); })
        .style('fill', 'none');

    // Add unselected (grey) dots and lines to graph
    backgroundCircles = linesGraph.append('g')
        .attr('class', 'background-circles')
        .selectAll('circle.background')
        .data(normcompData)
      .enter().append('circle')
        .attr('cx', function (d) {
          return xAxis(d.plotname);
        })
        .attr('cy', function (d) {
          return yScale(d.univariateT);
        })
        .attr('r', 4)
        .attr('class', 'background-circle')
        .style('fill', '#ddd');

    // add 'scatterplot' elements
    foreGroundCircles = linesGraph.append('g')
        .attr('class', 'foreground-circles')
        .selectAll('circle.foreground')
        .data(normcompData)
      .enter().append('circle')
        .attr('cx', function (d) {
          return xAxis(d.plotname);
        })
        .attr('cy', function (d) {
          return yScale(d.univariateT);
        })
        .attr('r', 4)
        .style('fill', function (d) {
          return color(d.id);
        })
        .attr('class', function (d) {
            return 'circle'+d.id+' foreground-circle';
          })
        .on('mouseover', function (d) {
          div.transition()
            .duration(200)
            .style('opacity', 0.8);
          div.html("<span style='color:" + color(d.id) + "'>" + 'patient: ' + d.id + '<br/>' + d.shortestname + '<br/>' + d.univariateT + '</span')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function () {
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });

    var g = linesGraph.selectAll(".dimension")
        .data(tests)
      .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + xAxis(d) + ")"; })
        .call(d3.behavior.drag()
          .origin(function(d) { return {x: xAxis(d)}; })
          .on("dragstart", function(d) {
            dragging[d] = xAxis(d);
            backgroundLines.attr("visibility", "hidden");
            backgroundCircles.attr("visibility", "hidden");
          })
          .on("drag", function(d) {
            dragging[d] = Math.min(width, Math.max(0, d3.event.x));

            // update lines
            foregroundLines.attr("d", path);
            tests.sort(function(a, b) { return position(a) - position(b); });
            xAxis.domain(tests);

            // update circles
            foreGroundCircles.attr('cx', circlex);

            // update margin lines
            upperMargin.attr('d', upperMarginArea);
            lowerMargin.attr('d', lowerMarginArea);

            g.attr("transform", function(d) { return "translate(" + position(d) + ")"; });
          })
          .on("dragend", function(d) {
            delete dragging[d];
            transition(d3.select(this)).attr("transform", "translate(" + xAxis(d) + ")");
            transition(foregroundLines).attr("d", path);
            transition(foreGroundCircles).attr('cx', circlex);
            upperMargin.attr('d', upperMarginArea);
            lowerMargin.attr('d', lowerMarginArea);
            backgroundLines
                .attr("d", path)
              .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
            backgroundCircles
                .attr('cx', function (d) {
                  return position(d.plotname);
                })
              .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
          }));

    // add invisible, dragable y axis for each test
    g.append('g')
        .attr('class', 'axis hide-axis')
        .each(function(d) { d3.select(this).call(yAxis.scale(y[d])); })
      .append('text')
        .style("text-anchor", "middle")
        .text(function(d) { return d; })
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(45)')
        .on("mouseover", function () {
          d3.select(this)
          .transition()
            .style('font-size', 16);
        })
        .on("mouseout", function () {
          d3.select(this)
          .transition()
            .style('font-size', 11);
        });

    // add visible, undragable y axis
    // This axis only has integers as labels, because otherwise the y axis label
    // placement is suboptimal.
    yAxis.tickFormat(d3.format('d'));
    var yaxis = linesGraph.append('g')
      .attr('class', 'axis')
      .call(yAxis);

    // mean/normal labels on y axis
    var axisPadding = 5;
    yaxis.append('text')
        .attr('dx', xAxis(tests[tests.length-1]) + axisPadding)
        .attr('dy', yScale(0.0))
        .attr('class', 'axis axis-label')
        .text('mean');

    yaxis.append('text')
        .attr('dx', xAxis(tests[tests.length-1]) + axisPadding)
        .attr('dy', yScale(patients[0].values[0].outeredge/2))
        .attr('class', 'axis axis-label')
        .text('normal');

    yaxis.append('text')
        .attr('dx', xAxis(tests[tests.length-1]) + axisPadding)
        .attr('dy', yScale(patients[0].values[0].inneredge/2))
        .attr('class', 'axis axis-label')
        .text('normal');

    // add y axis label
    yaxis.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-25,'+(height/2)+')rotate(-90)')
      .attr('class', 'axis axis-label')
      .text('Test statistic');

    function position(d) {
      var v = dragging[d];
      return v == null ? xAxis(d) : v;
    }

    function transition(g) {
      return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
      // d = patient from patients
      // {id = 'id',
      //  values = []}
      return line(tests.map(function(p) {
        // p = plotname from patient data (one of the data points from the values array)
        var dataPoint = _.filter(d.values, ['plotname', p])[0];
        return [position(p), y[p](dataPoint.univariateT)];
      }));
    }

    // Returns the path for the mean line
    function pathMean() {
      return line(tests.map(function(p) {
        return [position(p), y[p](0.0)];
      }));
    }

    function circlex(d){
      return position(d.plotname);
    }
  };

  plotCtrl.plotTables = function (normcompData) {

    // columns
    var uniVarCols = [
      'id', 'plotname', 'univariatedifferences', 'univariateT',
      'univariatedf', 'univariatep'
    ];

    var uniVarColNames = [
      'patient', 'test variable', 'difference', 't-value',
      'degrees of freedom', 'p-value'
    ];

    var multiVarCols = [
      'id', 'multivariatedifference', 'multivariateT',
      'multivariatedf', 'multivariatep'
    ];

    var multiVarColNames = [
      'patient', 'sum of differences', 'multivariate statistic',
      'degrees of freedom', 'p-value'
    ];

    var dtUniVarCols = uniVarColNames.map(function (column) {
      return {
        'title': column
      };
    });

    var dtUniVarData = normcompData.map(function (p) {
      var subp = _.pick(p, uniVarCols);
      var values = [];
      for (var key in subp) {
        values.push(subp[key]);
      }
      return values;
    });

    var dtMultiVarCols = multiVarColNames.map(function (column) {
      return {
        'title': column
      };
    });

    // for multivariate only one row per patient
    var dtMultiVarData = patients.map(function (p) {
      var values = [];
      p.values.forEach(function(element) {
        var subp = _.pick(element, multiVarCols);
        for (var key in subp) {
          values.push(subp[key]);
        }
      });

      return values;
    });

    // add tables
    $('#uni-var-table').dataTable({
      bFilter: false,
      data: dtUniVarData,
      columns: dtUniVarCols,
      fnRowCallback: function (nRow, aData) {
        $(nRow).css('color', color(aData[0]));
      }
    });

    $('#multi-var-table').dataTable({
      bFilter: false,
      data: dtMultiVarData,
      columns: dtMultiVarCols,
      fnRowCallback: function (nRow, aData) {
        $(nRow).css('color', color(aData[0]));
      }
    });
  };

  plotCtrl.plotEllipses = function (points, tests) {
    var width = 700,
        height = 500,
        size = 30,
        padding = 5;

    var x = d3.scale.linear()
        .range([padding / 2, size - padding / 2])
        .domain([-3, 3]);

    var y = d3.scale.linear()
        .range([size - padding / 2, padding / 2])
        .domain([-3, 3]);

    var dim = d3.scale.linear()
        .range([0, size - padding])
        .domain([0, 6]);

    d3.queue()
        .defer(d3.csv, "static/app/data/ellipseparams.csv")
        .await(function (error, ellipses) {
            if (error){ throw error; }
            facets(ellipses, points, tests);
        });

    function facets(ellipses, points, tests) {
      ellipses.forEach(function (d) {
        d.test1 = String(d.test1);
        d.test2 = String(d.test2);
        d.cx = +d.cx;
        d.cy = +d.cy;
        d.rx = +d.rx;
        d.ry = +d.ry;
        d.angle = +d.angle;
      });

      var svg = d3.select('#ellipses-graph').append("svg")
          .attr("width", width)
          .attr("height", height)
          .append('g')
          .attr("transform", "translate(" + 4 * size + "," + padding / 2 + ")");

      var h = (tests.length + 0.5) * size;

      // add empty strings to list of tests to shift the origin of the graph
      var yDomain = tests.slice(0);
      yDomain.push('');

      var xDomain = tests.slice(0);
      xDomain.splice(0, 0, '');

      var xOuter = d3.scale.ordinal()
          .domain(xDomain)
          .rangePoints([0, h]);
      var yOuter = d3.scale.ordinal()
          .domain(yDomain)
          .rangePoints([0, h]);

      var xAxis = d3.svg.axis()
          .scale(xOuter)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(yOuter)
          .orient("left");

      add_legend(svg, patients, width/2);

      console.log(ellipses);
      var sEllipses = ellipses.filter(function (e) {
        var keep1 = false,
            keep2 = false;
        tests.forEach(function (test){
          if(test === e.test1) {
            keep1 = true;
          }
          if(test == e.test2) {
            keep2 = true;
          }
        });
        return keep1 && keep2;
      });

      console.log(sEllipses);

      var div = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);

      // Draw lightly colored squares behind the ellipses, to mark the area in which
      // datapoints can be plotted for this ellipse
      svg.selectAll('rect.ellipse-background')
            .data(sEllipses)
          .enter().append('rect')
            .attr("transform", function (d) {
              // We put test2 in xOuter and test1 in yOuter, because we want to
              // fill the lower left triangle with ellipses.
              return "translate(" + xOuter(d.test2) + "," + yOuter(d.test1) + ")";
            })
            .attr('class', 'ellipse-background')
            .attr('x', -size/2)
            .attr('y', -size/2)
            .attr('width', size)
            .attr('height', size)

      // Draw ellipses
      svg.selectAll('ellipse')
            .data(sEllipses)
          .enter().append("ellipse")
            .attr("rx", function (d) { return dim(d.rx); })
            .attr("ry", function (d) { return dim(d.ry); })
            .attr("transform", function (d) {
                var angle = -(90 - d.angle);
                // We put test2 in xOuter and test1 in yOuter, because we want to
                // fill the lower left triangle with ellipses.
                return "translate(" + xOuter(d.test2) + "," + yOuter(d.test1) + ") rotate(" + angle + ")";
            })
            .style("fill", "green")
            .style("opacity", 0.3)
            .on('mouseover', function (d) {
              div.transition()
                .duration(200)
                .style('opacity', 0.8);
              div.html('<span>' + d.test1 + '</br>vs.</br>' + d.test2 + '</span>')
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
              div.transition()
                .duration(500)
                .style('opacity', 0);
            });

            // Filter data points that are outside the grey square
            var visiblePoints = points.filter(function(d) {
              // Because test2 is the x axis and test1 the y axis, we have to
              // switch x and y here.
              if(x(d.y) > size || x(d.y) < 0){
                return false;
              }
              if(y(d.x) > size || y(d.x) < 0){
                return false;
              }
              return true;
            });

            // Display warning if points have been filtered.
            if(visiblePoints.length < points.length){
              $scope.ellipsePlotWarning = 'Some data points are outside the visible area of the graph. These have been removed.';
            }

            // Plot grey circles (for context)
            svg.selectAll("circle.ellipse-data-background")
                .data(visiblePoints)
              .enter().append("circle")
                // Because test2 is the x axis and test1 the y axis, we have to
                // switch x and y here.
                .attr('cx', function (d) {
                  return x(d.y);
                })
                .attr('cy', function (d) {
                  return y(d.x);
                })
                .attr('r', 4)
                .attr("transform", function (d) {
                  // We put test2 in xOuter and test1 in yOuter, because the
                  // ellipses are in the lower left triangle.
                  var translate = (xOuter(d.test2) - size/2 + "," + (yOuter(d.test1) - size/2));
                  return "translate(" + translate + ")";
                })
                .attr('class', 'ellipse-data-background')
                .style("fill", '#ddd');

            // Plot colored circles
            svg.selectAll("circle.ellipse-data-foreground")
                .data(visiblePoints)
              .enter().append("circle")
                // Because test2 is the x axis and test1 the y axis, we have to
                // switch x and y here.
                .attr('cx', function (d) {
                  return x(d.y);
                })
                .attr('cy', function (d) {
                  return y(d.x);
                })
                .attr('r', 4)
                .attr("transform", function (d) {
                  // We put test2 in xOuter and test1 in yOuter, because the
                  // ellipses are in the lower left triangle.
                  var translate = (xOuter(d.test2) - size/2 + "," + (yOuter(d.test1) - size/2));
                  return "translate(" + translate + ")";
                })
                .attr('class', function (d) {
                    return 'circle'+d.id+ ' ellipse-data-foreground';
                })
                .style("fill", function(p){ return color(p.id); })
                .style("opacity", 0.5);

            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(xAxis)
                .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)");

            // Add the Y Axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
          }
    };

  plotCtrl.render();
});
