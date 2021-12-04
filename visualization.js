var w = 960;
var h = 600;
var newdataset = [];
var vars3 = [];
var airports = [];
var projection = d3
  .geoAlbersUsa()
  .translate([w / 2, h / 2])
  .scale([1000]);
var path = d3.geoPath().projection(projection);

d3.json("data/us.json", function (error, us) {
  if (error) throw error;

  var svg = d3
    .select("body")
    .select("#maps")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .attr("class", "states")
    .attr("d", path);

  svg
    .append("path")
    .attr("class", "state-borders")
    .attr("d", path(topojson.mesh(us, us.objects.states)));

  d3.csv("data/departures_small1.csv", function (e, p) {
    if (e) {
      console.log(e);
    } else {
      //console.log("flight data:", p);
      newdataset = p.map(function (d) {
        return projection([d.LONGITUDE, d.LATITUDE]);
      });
      //console.log("projected?:", newdataset);

      airports = p.map(function (d) {
        return [d.DEPARTING_AIRPORT];
      });
      //console.log("airports?:", airports);

      for (var i = 0; i < p.length; i++) {
        localvars = d3.merge([newdataset[i], airports[i]]);
        vars3.push(localvars);
      }
      //console.log(vars3);

      svg
        .selectAll("circle")
        .data(vars3)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          //console.log("wth:", projection(d[0]));
          //return projection([d.LATITUDE, d.LONGITUDE])[0];
          return d[0];
        })
        .attr("cy", function (d) {
          //return projection([d.LATITUDE, d.LONGITUDE])[1];
          return d[1];
        })
        .attr("r", 3)
        .attr("fill", "brown")
        .style("opacity", 0.3)

        .on("mouseover", function (d, i) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr("r", 10)
            .attr("fill", "yellow");

          svg
            .append("text")
            .attr("id", "tooltip")
            .attr("class", "labels")
            .attr("x", d[0])
            .attr("y", d[1])
            .attr("transform", "translate(0,20)")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("background-color", "blue")
            .html("Airport: " + d[2]);
        })
        .on("mouseout", function () {
          d3.select("#tooltip").remove();
          d3.select(this)
            .attr("r", 3)
            .attr("fill", "brown")
            .style("opacity", 0.3);
        });

      svg
        .append("text")
        .attr("class", "labels")
        .attr("transform", "translate(480,580)")
        .style("text-anchor", "middle")
        .text("Airports in United States of America");
    }
  });

  //end of code bracket
});

d3.csv("data/departures_small.csv", function (data) {
  var test = d3.max(data, function (d) {
    return d.DEP_DELAY_NEW;
  });
  console.log(test + "Hi");

  var svg = d3
    .select("body")
    .select("#graphs")
    .append("svg")
    .attr("width", 450)
    .attr("height", 500);

  //console.log(data);
  var dataset = data.map(function (d) {
    //console.log(d.DAY_OF_WEEK, "xxxxxxxxx");
    return { DAY_OF_WEEK: d.DAY_OF_WEEK, DEP_DELAY_NEW: d.DEP_DELAY_NEW };
  });
  //console.log(dataset);

  var padding = 20;
  var xScale = d3
    .scaleLinear()
    .domain([0, 8])
    .range([padding, 300 - padding]);

  var yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d.DEP_DELAY_NEW;
      }),
    ])
    .range([400 - padding * 18, padding]);

  var scaledColors = d3.scale.category20b();

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.DAY_OF_WEEK);
    })
    .attr("cy", function (d) {
      return yScale(d.DEP_DELAY_NEW);
    })
    .attr("r", 2)
    .attr("fill", function (d, i) {
      return scaledColors(i);
    })
    .attr("transform", "translate(" + padding + "," + padding * 13 + ")")
    .on("mouseover", function (d, i) {
      d3.select(this).transition().duration(300).attr("r", 3);
      // .attr("fill", "red")
      // .moveToFront();
      //Create the tooltip label
      svg
        .append("text")
        .attr("id", "tooltip")
        .attr("class", "ttp")
        .attr("x", xScale(d.DAY_OF_WEEK))
        .attr("y", yScale(d.DEP_DELAY_NEW))
        .attr("transform", "translate(" + padding + "," + padding * 13 + ")")
        .attr("text-anchor", "middle")
        .style("position", "absolute")
        .style("font-size", "15px")
        .style("background", " rgb(226, 226, 240)")
        .style("color", "rgb(9, 23, 63)")
        .html("Delay in Minutes: " + d.DEP_DELAY_NEW);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").remove();
      d3.select(this).attr("r", 2);
    });

  var xAxis = d3.axisBottom().scale(xScale).tickValues([1, 2, 3, 4, 5, 6, 7]);
  var yScale1 = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d.DEP_DELAY_NEW;
      }),
    ])
    .range([300 - padding * 2, padding * 2]);
  var yAxis = d3.axisLeft().scale(yScale1);
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + "," + padding * 15 + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding * 2 + "," + padding * 2 + ")")
    .call(yAxis);

  svg
    .append("text")
    .attr("transform", "translate(" + padding * 7 + "," + padding * 17 + ")")
    .style("text-anchor", "middle")
    .text("Day of the Week");

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (padding / 2 + 1) + "," + padding * 10 + "),rotate(-90)"
    )
    //.attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Delay in minutes");

  svg
    .append("text")
    .attr("class", "labels")
    //.attr("text-anchor", "end")
    .attr("transform", "translate(" + padding * 7 + "," + padding * 18 + ")")
    .style("text-anchor", "middle")
    .text("Graph 1");

  // end of code bracket
});
