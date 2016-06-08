'use strict';
app.factory('diagnosisService', ['$window','$http', '$q', function(win,$http,$q) {
   var factory = {};
   /*
    return selected Normative date folder test data
   */
   factory.getTest = function(defaultFolder){
      return $q(function (resolve, reject)
        {
          $http.get('data/'+defaultFolder+'/tests.json')
          .success(function (data) 
          {
            var dataObj = {};
            dataObj.data = data;
            dataObj.defaultFolder = defaultFolder;
            resolve(dataObj);
          })
          .error(function (data, status) {
              if (status == 403)
              {
                  reject("wrong token");
              }
          });
        });
   }

   /*
    return selected Normative date List
   */
   factory.getRelease = function(defaultFolder){
      return $q(function (resolve, reject)
        {
          $http.get("data/release.json")
          .success(function(res){
              resolve( {   
                "type": "select", 
                "value": defaultFolder, 
                "values": res 
              });
          })
          .error(function (data, status) {
              if (status == 403)
              {
                  reject("wrong token");
              }
          });
        });
   }
   /*
    after form submit make line chart 
   */
   factory.lineChart = function(patientStats) {
   		$('#lines-graph').html('');
      	var margin = {
          top: 75,
          right: 150,
          bottom: 30,
          left: 50
        };
        var width = 1000 - margin.left - margin.right;
        var height = 550 - margin.top - margin.bottom;
        var color = d3.scale.category10();
        var patients = _.map(patientStats, function(patient) {
          return patient.id;
        });
        patients = _.union(patients);
        // scales
        var scalePadding = 0.5;
        var minScore = d3.min([d3.min(patientStats, function(d) {
            return d.inneredge;
          }),
          d3.min(patientStats, function(d) {
            return d.univariateT;
          })
        ]);
        minScore = minScore - scalePadding;
        var maxScore = d3.max([d3.max(patientStats, function(d) {
            return d.outeredge;
          }),
          d3.max(patientStats, function(d) {
            return d.univariateT;
          })
        ]);
        maxScore = maxScore + scalePadding;
        // for x need to translate test name to number
        var testnames = patientStats.map(function(t) {
          return t.plotname;
        });
        testnames = _.union(testnames);

        var xScale = d3.scale.linear()
          .domain([0, testnames.length - 1])
          .range([0, width])

        var yScale = d3.scale.linear()
          .domain([minScore, maxScore])
          .range([height, 0]);

        // define lines
        var outerLine = d3.svg.line()
          .x(function(d) {
            return xScale(testnames.indexOf(d['plotname']));
          })
          .y(function(d) {
            return yScale(d.outeredge)
          })

        var innerLine = d3.svg.line()
          .x(function(d) {
            return xScale(testnames.indexOf(d['plotname']));
          })
          .y(function(d) {
            return yScale(d.inneredge)
          })

        // lines connecting tests for single patients
        var patientLine = d3.svg.line()
          .x(function(d) {
            var xCoord = xScale(testnames.indexOf(d['plotname']));
            console.log(xCoord);
            return xCoord;
          })
          .y(function(d) {
            return yScale(d['univariateT']);
          });

        // define plot
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
          .orient("top")
          .tickValues(d3.range(testnames.length))
          .tickFormat(function(t) {
            return testnames[t];
          });
        linesGraph.append("g")
          .attr("class", "axis")
          .call(xAxis)
          .selectAll("text")
          .attr("dy", "-0.3em")
          .attr("transform", "rotate(45)");

        // add 'scatterplot' elements
        linesGraph.selectAll("circle")
          .data(patientStats)
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return xScale(testnames.indexOf(d['plotname']));
          })
          .attr("cy", function(d) {
            return yScale(d['univariateT']);
          })
          .attr("r", 4)
          .style("fill", function(d) {
            return color(d.id);
          });

        // add legend for patient
        var legendSpace = 20;
        patients.forEach(function(d, i) {
          linesGraph.append("text")
            .attr("x", width + margin.right / 2)
            .attr("y", i * (legendSpace))
            .style("fill", color(d))
            .text(d);
        });


        // connect patient tests
        patients.forEach(function(patient) {
          var onePatientStats = _.filter(patientStats, ["id", patient]);
          linesGraph.append("path")
            .style("stroke", color(onePatientStats[0].id))
            .style("fill", "none")
            .attr("d", patientLine(onePatientStats));
        })

        // add mean line
        linesGraph.append("line")
          .attr({
            x1: xScale(0),
            y1: yScale(0),
            x2: xScale(testnames.length - 1),
            y2: yScale(0)
          });

        // add upper and lower bounds
        linesGraph.append("path")
          .attr("class", "line")
          .attr("d", outerLine(patientStats));
        linesGraph.append("path")
          .attr("class", "line")
          .attr("d", innerLine(patientStats));
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
        var dtUniVarCols = uniVarColNames.map(function(column) {
          return {
            "title": column
          }
        });
        var dtUniVarData = patientStats.map(function(p) {
          var subp = _.pick(p, uniVarCols);
          return Object.values(subp);
        });
        var dtMultiVarCols = multiVarColNames.map(function(column) {
          return {
            "title": column
          }
        });
        // for multivariate only one row per patient
        var multiVarData = patients.map(function(patient) {
          return _.find(patientStats, ["id", patient]);
        });

        var dtMultiVarData = multiVarData.map(function(p) {
          var subp = _.pick(p, multiVarCols);
          return Object.values(subp);
        });
        // add tables
        $("#uni-var-table").dataTable({
          bFilter: false,
          data: dtUniVarData,
          columns: dtUniVarCols,
          fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndesFull) {
            $(nRow).css('color', color(aData[0]))
          }
        });

        $("#multi-var-table").dataTable({
          bFilter: false,
          data: dtMultiVarData,
          columns: dtMultiVarCols,
          fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndesFull) {
            $(nRow).css('color', color(aData[0]))
          }
        });
   }

   return factory;

}]);


