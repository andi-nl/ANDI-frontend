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
  @name andiApp.controller:plotController
  @description : put third tab chart event
*/
app.controller('plotController', function ($scope, ocpuService) {

  var plotCtrl = this;

  plotCtrl.render = function () {
    var patientObj = $scope.$parent.submitData;
    ocpuService.normcomp(patientObj).then(function (data) {
      var normcompData = JSON.parse(data);
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
    var patients = _.map(normcompData, function (patient) {
      return patient.id;
    });
    patients = _.union(patients);

    // tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

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
      .rangePoints([0, width])

    var yScale = d3.scale.linear()
      .domain([minScore, maxScore])
      .range([height, 0]);

    // define lines
    var outerLine = d3.svg.line()
      .x(function (d) {
        return xScale(d.plotname);
      })
      .y(function (d) {
        return yScale(d.outeredge)
      })

    var innerLine = d3.svg.line()
      .x(function (d) {
        return xScale(d.plotname);
      })
      .y(function (d) {
        return yScale(d.inneredge)
      })

    // lines connecting tests for single patients
    var patientLine = d3.svg.line()
      .x(function (d) {
        var xCoord = xScale(d.plotname);
        return xCoord;
      })
      .y(function (d) {
        return yScale(d['univariateT']);
      });

    // define scatter plot
    var linesGraph = d3.select("#lines-graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

    // define axes

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");
    linesGraph.append("g")
      .attr("class", "axis")
      .call(yAxis);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("top");

    linesGraph.append("g")
      .attr("class", "axis")
      .call(xAxis)
      .selectAll("text")
      .attr("dy", "-0.3em")
      .attr("transform", "rotate(45)");

    // add 'scatterplot' elements
    linesGraph.selectAll("circle")
      .data(normcompData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d.plotname);
      })
      .attr("cy", function (d) {
        return yScale(d['univariateT']);
      })
      .attr("r", 4)
      .style("fill", function (d) {
        return color(d.id);
      })
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .8);
        div.html("<span style='color:" + color(d.id) + "'>" + "patient: " + d.id + "<br/>" + d.shortestname + "<br/>" + d.univariateT + "</span")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // add legend for patient
    var legendSpace = 20;

    patients.forEach(function (p, i) {
      linesGraph.append("text")
        .attr("x", width + margin.right / 2)
        .attr("y", i * (legendSpace))
        .style("fill", color(p))
        .on("click", function (el) {
          var active = this.active ? false : true;
          var newOpacity = active ? 0 : 0.5;
          d3.select("#tag" + p.replace(/\s+/g, ""))
            .transition().duration(100)
            .style("opacity", newOpacity);
          this.active = active;
        })
        .text("patient: " + p);
    });


    // connect patient tests
    patients.forEach(function (p) {
      var onePatientStats = _.filter(normcompData, ["id", p]);
      linesGraph.append("path")
        .attr("class", "patient-line")
        .attr("d", patientLine(onePatientStats))
        .attr("id", "tag" + p.replace(/\s+/g, ""))
        .style("stroke", color(onePatientStats[0].id))
        .style("fill", "none");;
    })

    // add mean line
    linesGraph.append("line")
      .attr({
        x1: xScale(tests[tests.length]),
        y1: yScale(0),
        x2: xScale(tests[tests.length - 1]),
        y2: yScale(0)
      });

    // add upper and lower bounds
    linesGraph.append("path")
      .attr("class", "line")
      .attr("d", outerLine(normcompData));
    linesGraph.append("path")
      .attr("class", "line")
      .attr("d", innerLine(normcompData));


    // tables

    // columns
    var uniVarCols = [
      "id", "plotname", "univariatedifferences", "univariateT",
      "univariatedf", "univariatep"
    ];
    var uniVarColNames = [
      "patient", "test variable", "difference", "t-value",
      "degrees of freedom", "p-value"
    ];

    var multiVarCols = [
      "id", "multivariatedifference", "multivariateT",
      "multivariatedf", "multivariatep"
    ];
    var multiVarColNames = [
      "patient", "sum of differences", "multivariate statistic",
      "degrees of freedom", "p-value"
    ];

    var dtUniVarCols = uniVarColNames.map(function (column) {
      return {
        "title": column
      }
    });

    var dtUniVarData = normcompData.map(function (p) {
      var subp = _.pick(p, uniVarCols);
      var values = []
      for (var key in subp) {
        values.push(subp[key]);
      };
      return values;
    });

    var dtMultiVarCols = multiVarColNames.map(function (column) {
      return {
        "title": column
      }
    });

    // for multivariate only one row per patient

    var multiVarData = patients.map(function (patient) {
      return _.find(normcompData, ["id", patient]);
    });

    var dtMultiVarData = multiVarData.map(function (p) {
      var subp = _.pick(p, multiVarCols);
      var values = []
      for (var key in subp) {
        values.push(subp[key]);
      };
      return values;
    });

    // add tables
    $("#uni-var-table").dataTable({
      bFilter: false,
      data: dtUniVarData,
      columns: dtUniVarCols,
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndesFull) {
        $(nRow).css('color', color(aData[0]))
      }
    });

    $("#multi-var-table").dataTable({
      bFilter: false,
      data: dtMultiVarData,
      columns: dtMultiVarCols,
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndesFull) {
        $(nRow).css('color', color(aData[0]))
      }
    });
  };

  plotCtrl.render();

});
