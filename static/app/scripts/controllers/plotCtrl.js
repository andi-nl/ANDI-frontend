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
app.controller('plotController', function ($scope, $http) {
  var plotCtrl = this;

  plotCtrl.render = function () {
    //var patientObj = $scope.$parent.submitData;
    //ocpuService.normcomp(patientObj).then(function (data) {
    //  var normcompData = JSON.parse(data);
    //  plotCtrl.plot(normcompData);
    //});
    $http.get('/static/app/data/normcomp.json').then(function (res) {
      //console.log(data);
      var data = res.data;
      data = JSON.stringify(data);
      var normcompData = JSON.parse(data);
      //console.log(normcompData);
      plotCtrl.plot(normcompData);
    });
  };

  plotCtrl.plot = function (normcompData) {
    var margin = {
      top: 80,
      right: 180,
      bottom: 80,
      left: 80
    };
    var width = 700 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var color = d3.scale.category10();

    normcompData = normcompData.map(function (p) {
      p.id = String(p.id);
      return p;
    });
    // patients array
    var patients = d3.nest()
      .key(function (p) { return p.id; })
      .entries(normcompData);

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

    var xScale = d3.scale.ordinal()
      .domain(tests)
      .rangePoints([0, width]);

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
  var marginLines, upperMargin, lowerMargin;
  var line = d3.svg.line();
  var legendSpace = 20;

  // legend
  patients.forEach(function (p, i) {
    linesGraph.append('text')
      .attr('x', width + margin.right / 2)
      .attr('y', i * (legendSpace))
      .attr('class', 'legend')
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
          this.active = active;
          if(active){
            d3.select(this).style('fill', '#ddd');
          } else {
            d3.select(this).style('fill', color(p.key));
          }
      })
      .text('patient: ' + p.key);

    });

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
      .enter()
      .append('circle')
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
      .enter()
      .append('circle')
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

      // add upper and lower margins
      marginLines = linesGraph.append('g')
        .attr('class', 'margin-lines')
        .selectAll('path')
        .data([patients[0]])
        .enter();
      upperMargin = marginLines.append('path')
        .attr('class', 'margin-line')
        .attr('d', pathUpperMargin);
      lowerMargin = marginLines.append('path')
        .attr('class', 'margin-line')
        .attr('d', pathLowerMargin);

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
            upperMargin.attr('d', pathUpperMargin);
            lowerMargin.attr('d', pathLowerMargin);

            g.attr("transform", function(d) { return "translate(" + position(d) + ")"; });
          })
          .on("dragend", function(d) {
            delete dragging[d];
            transition(d3.select(this)).attr("transform", "translate(" + xAxis(d) + ")");
            transition(foregroundLines).attr("d", path);
            transition(foreGroundCircles).attr('cx', circlex);
            upperMargin.attr('d', pathUpperMargin);
            lowerMargin.attr('d', pathLowerMargin);
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
        .attr('transform', 'rotate(45)');

    // add visible, undragable y axis
    linesGraph.append('g')
      .attr('class', 'axis')
      //.attr('transform', 'translate(10,0)')
      .call(yAxis);

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

  // Returns the path for the upper margin
  function pathUpperMargin(d) {
    return line(tests.map(function(p) {
      // p = plotname from patient data (one of the data points from the values array)
      var dataPoint = _.filter(d.values, ['plotname', p])[0];
      return [position(p), y[p](dataPoint.outeredge)];
    }));
  }

  // Returns the path for the lower margin
  function pathLowerMargin(d) {
    return line(tests.map(function(p) {
      // p = plotname from patient data (one of the data points from the values array)
      var dataPoint = _.filter(d.values, ['plotname', p])[0];
      return [position(p), y[p](dataPoint.inneredge)];
    }));
  }

  // Returns the path for the mean line
  function pathMean(d) {
    return line(tests.map(function(p) {
      return [position(p), y[p](0.0)];
    }));
  }

  function circlex(d){
    return position(d.plotname);
  }

    // add mean line
    marginLines.append('path')
      .attr('class', 'mean-line')
      .attr('d', pathMean);

    // tables

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
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndesFull) {
        $(nRow).css('color', color(aData[0]));
      }
    });

    $('#multi-var-table').dataTable({
      bFilter: false,
      data: dtMultiVarData,
      columns: dtMultiVarCols,
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndesFull) {
        $(nRow).css('color', color(aData[0]));
      }
    });
  };

  plotCtrl.render();
});
