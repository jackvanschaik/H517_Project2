/*** Side Plots ***/
function draw_proportions(data) {
    // process cancellation data
    var dg = group_by(data, "CARRIER_NAME", "DEP_DEL15");
    var carrier = [];
    var c_props = [];
    for (let [k, v] of Object.entries(dg)) {
        carrier.push(k);
        c_props.push(d3.mean(v.map(function(x) {return x == 1})));
    }

    // setup
    var margin = {top: 70, right: 30, bottom: 110, left: 60}
    var Width  = 600 - margin.left - margin.right;
    var Height = 300 - margin.top - margin.bottom;
    var n_x    = carrier.length;
    var p_max  = d3.max(c_props);
    // scales
    var x_scale = d3.scaleBand().range([0, Width]).domain(carrier).padding(0.2);
    var y_scale = d3.scaleLinear().range([Height, 0]).domain([0, p_max]);

    window["x_scale"] = x_scale;
    window["y_scale"] = y_scale;


    d3.select("#cancel_props")
        .append("g")
        .attr("transform", "translate(0," + Height + ")")
        .call(d3.axisBottom(x_scale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    d3.select("#cancel_props")
        .attr("transform", "translate(" + margin.left + ", 0)")
        .append("g")
        .call(d3.axisLeft(y_scale));

    // draw elements on svg
    d3.select("#cancel_props")
        .selectAll("rect")
        .data(c_props)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {return x_scale(carrier[i])})
        .attr("y", function(d) {return y_scale(d)})
        .attr("width", x_scale.bandwidth())
        .attr("height", function(d) {return y_scale(0) - y_scale(d)})
}

function draw_shruti_plot(data) {
  var test = d3.max(data, function (d) {
    return d.DEP_DELAY_NEW;
  });
  console.log(test + "Hi");

  var svg = d3
    .select("body")
    .select("#graphs")
    .append("svg")
    .attr("transform","translate( 0, -100)")
    .attr("width", 350)
    .attr("height", 350);

  //console.log(data);
  var dataset = data.map(function (d) {
    //console.log(d.DAY_OF_WEEK, "xxxxxxxxx");
    return { DAY_OF_WEEK: d.DAY_OF_WEEK, DEP_DELAY_NEW: d.DEP_DELAY_NEW };
  });
  //console.log(dataset);

  var padding = 20;
  //need to add this to adjust x and y margins independently -jack
  var y_paddding = 10;

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
    //.attr("fill", function (d, i) {
    //  return scaledColors(i);
    //})
    .attr("fill", "#d73027")
    .style("stroke", "#fee090")
    .style("stroke-width", "0.4")
    .attr("transform", "translate(" + padding + "," + padding * 13 + ")")
    .on("mouseover", function (d, i) {
      d3.select(this).transition().duration(300).attr("r", 5);

      svg
        .append("rect")
        .attr("id", "hah")
        .style("fill", "white")
        .attr("width", 155)
        .attr("height", 16)
        .style("pointer-events", "none")
        .attr("x", xScale(d.DAY_OF_WEEK))
        .attr("y", yScale(d.DEP_DELAY_NEW)+7)
        .attr("transform", "translate(" + padding + "," + padding * 13 + ")");

      svg
        .append("text")
        .attr("id", "tooltip")
        .attr("class", "ttp")
        .attr("x", xScale(d.DAY_OF_WEEK))
        .attr("y", yScale(d.DEP_DELAY_NEW))
        .attr("transform", "translate(" + padding + "," + padding * 14 + ")")
        //.attr("text-anchor", "middle")
        .style("position", "absolute")
        .style("font-size", "15px")
        .style("background", " rgb(226, 226, 240)")
        .style("color", "rgb(9, 23, 63)")
        .html("Delay in Minutes: " + d.DEP_DELAY_NEW);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").remove();
      d3.select("#hah").remove();
      d3.select(this).attr("r", 2);
    });

  var tickLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var yticks = [
    0, 107.4, 214.8, 322.2, 429.6, 537, 644.4, 751.8, 859.2, 966.6, 1074,
  ];
  var xAxis = d3.axisBottom().scale(xScale).tickValues([1, 2, 3, 4, 5, 6, 7]).tickFormat(function (d, i) {
      return tickLabels[i];
    });
  var yScale1 = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d.DEP_DELAY_NEW;
      }),
    ])
    .range([300 - padding * 2, padding * 2]);
  var yAxis = d3.axisLeft().scale(yScale1).tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
    .tickFormat(function (d, i) {
      return yticks[i];
    });
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
    .attr("transform", "translate(" + padding * 8.3 + "," + padding * 17 + ")")
    .style("text-anchor", "middle")
    .text("Day of the Week :: Delay in Minutes");

//   svg
//     .append("text")
//     .attr(
//       "transform",
//       "translate(" + (padding / 2 + 1) + "," + padding * 10 + "),rotate(-90)"
//     )
//     //.attr("transform", "rotate(-90)")
//     .style("text-anchor", "middle")
//     .text("Delay in minutes");

  // end of code bracket
}

function draw_ali_plots(data) {
    // Ali's code
    var margin = {top: 70, right: 30, bottom: 110, left: 60},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#my_chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform","translate(" + margin.left + "," + 0 + ")");
        //.attr("transform","translate(" + margin.left + "," + margin.top + ")");

    var airport = {};
    			//dataset = data;
    			data.forEach(element => { if (element.CARRIER_NAME in airport) {
    				airport [element.CARRIER_NAME].delay_values += (Number(element.DEP_DEL15) || 0)

    				airport [element.CARRIER_NAME].age[element.PLANE_AGE] = airport [element.CARRIER_NAME].age[element.PLANE_AGE] + 1 || 1

    			}
    			else {

    				var agenum = element.PLANE_AGE

    				airport [element.CARRIER_NAME] = {
    					delay_values: (Number(element.DEP_DEL15) || 0),
    					age: {[agenum]: 1}
    				}

    			}

    			});


    var x = d3.scaleBand()
      .range([ 0, width])
      .domain(Object.keys(airport))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // note: adding this line so the domain scales
    var del_max = d3.max(Object.entries(airport).map(function(x) {return x[1]['delay_values']}));

    var y = d3.scaleLinear()
      .domain([0, del_max])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll("mybar")
      .data(Object.keys(airport))
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d); })
        .attr("y", function(d) { return y(airport[d]["delay_values"]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(airport[d]["delay_values"]); })
        .attr("fill", "#a50026")
        .attr("class", function(d,i) { return d.replace(/\s+/g, '').replace('.', ''); })
        .on("mouseover", function(d,i){


          d3.selectAll("." + d.replace(/\s+/g, '').replace('.', ''))
          .attr("fill", "#ffffbf")
        }).on("mouseout", function(d,i) {
          d3.select("rect." + d.replace(/\s+/g, '').replace('.', ''))
         .attr("fill", "#a50026")
         d3.select("path." + d.replace(/\s+/g, '').replace('.', ''))
         .attr("fill", color(airport[d].planesOver25))
        });



         ///////////////////                            ////  AGES Pie Chart ////      ////////////////////////////////////
    var pieMargins = {}
    var ageschart = d3.select("#ages_chart").append("svg")
        .attr("width", 350)
        .attr("height", 350)

    for (const [key, {age}] of Object.entries(airport)) {

      var agetotal = Object.keys(age).filter(x => Number(x) >= 25)
      var total = 0;
      for (const x of agetotal) {
        total += age [x]
      }
      airport [key].planesOver25 = total
    }

    var radius = 80
    var g = ageschart.append("g")
    .style("transform", "translate(" + "45%" + "," + "25%" + ")")
      //.attr("transform", "translate(" + width/1.5 + "," + height/1.25 + ")")
      var color = d3.scaleOrdinal(d3.schemeCategory10)
      // assign color d3.scaleOrdinal([#hex1, #hex2])
    // console.log(airport)
      var pie = d3.pie().value(d => {
      console.log(d)
        return d.value})
      var path = d3.arc()
          .outerRadius(radius)
          .innerRadius(0);

      var label = d3.arc()
          .outerRadius(radius)
          .innerRadius(0);
      var arc = g.selectAll("arc").data(pie(Object.keys(airport).map(x => {
        return {
          value: airport[x].planesOver25,
          name: x
          }
      } ).filter(x => {

        return x.value !== 0})))
      .enter().append("g")

      arc.append("path")
        .attr("d", path)
        .attr("height",200)
        .attr("fill", function(d) {
          return color(d.value); })
          .attr("class", function(d,i) {

       return d.data.name.replace(/\s+/g, '').replace('.', ''); })
     .on("mouseover", function(d,i){

     d3.selectAll("." + d.data.name.replace(/\s+/g, '').replace('.', ''))
         .attr("fill", color(d.value))
       }).on("mouseout", function(d,i) {
        d3.select("rect." + d.data.name.replace(/\s+/g, '').replace('.', ''))
         .attr("fill", "#a50026")
         d3.select("path." + d.data.name.replace(/\s+/g, '').replace('.', ''))
         .attr("fill", color(d.value))
        });
      arc.append("text")
      .attr("transform", function(d) {
        console.log(d)
        var c = label.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse obtained from stackoverflow
            h = Math.sqrt(x*x + y*y);
            // console.log(c, h)
            if (d.value < 6){
              return "translate(" + (x/h * radius + 4) +  ',' +
           (y/h * radius + 12) +  ")";
            }
        return "translate(" + (x/h * radius) +  ',' +
           (y/h * radius) +  ")";
    })

          .text(function(d) {
          //  console.log(d)
            return d.value; });
      /*
      ageschart.append("g")
        .attr("transform", "translate(" + (width / 2) + "," + 70 + ")")
        .append("text")
        .text("Carriers with Planes over ages 25")
        .attr("class", "title") */
    }

/*** Main Map ***/
function draw_map(data) {

    var vars3 = window["vars3"];

      var svg = d3
        .select("body")
        .select("#maps")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      svg
        .selectAll("path")
        .data(topojson.feature(window["us"], window["us"].objects.states).features)
        .enter()
        .append("path")
        .attr("class", "states")
        .attr("d", path);

      svg
        .append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(window["us"], window["us"].objects.states)));

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
        .append("rect")
        .attr("id", "maptip")
        .style("fill", "white")
        .attr("width", 155)
        .attr("height", 16)
        .style("pointer-events", "none")
        .attr("x", d[0])
        .attr("y", d[1] - 13)
        .attr("transform", "translate(0,20)");
      svg
        .append("text")
        .attr("id", "tooltip")
        .attr("class", "ttp1")
        .attr("x", d[0])
        .attr("y", d[1])
        .attr("transform", "translate(0,20)")
        .style("position", "absolute")
        .style("font-size", "15px")
        //.attr("text-anchor", "middle")
        //.attr("fill", "black")
        .style("color", "rgb(9, 23, 63)")
        .html("Airport: " + d[2]);
    })
            .on("mouseout", function () {
              d3.select("#tooltip").remove();
              d3.select("#maptip").remove();
              d3.select(this)
                .attr("r", 3)
                .attr("fill", "brown")
                .style("opacity", 0.3);
            })
            .on("click", function(d) {
                window['airport'] = d[2];
                document.getElementById("textsearch").value = d[2];
                search_airports(airport = d[2]);
                visualize();
            })
}

/*** UI Reactivity ***/
function make_ui() {
    d3.select("#delayonly").on("change", function(d) { visualize()});
    d3.select("#depblock").on("change", function(d) { visualize()});
    d3.select("#dow").on("change", function(d) { visualize()});

    d3.select("#textsearch").on("keyup", function(d) { search_airports()});
}

function search_airports(airport = undefined) {
    var query = document.getElementById("textsearch").value;

    console.log("query: " + query);

    window['airport'] = airport;
    d3.select("#airports").selectAll("*").remove()
    if (query.length < 3) {
        if (query.length == 0) {
            visualize();
        }
        return null;
    }

    // get matching airport names
    // referred to MDN documentation on javascript regex
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    var airports = window["airports_list"];
    var re = new RegExp(query, 'i');
    var matches = []
    var ap;
    for (let i = 0; i < airports.length; i++) {
        if (airports[i].search(re) != -1) {
            matches.push(airports[i])
        }
    }
    console.log(matches);

    //create search links
    d3.select("#airports")
        .selectAll("input")
        .data(matches)
        .enter()
        .append("input")
        .attr("type", "button")
        .attr("value", function(d) {return d;})
        .attr("id", function(d, i) {
            return "id" + i;
        })
        .on("click", function(d) {
            window['airport'] = d;
            console.log(d);
            visualize();
        })

}

/*** Data Wrangling ***/
// Group the values in col_2 by col_1
function group_by(data, col_1, col_2) {
    var N = data.length;
    var d = {};
    var row, key, value;
    for (let i = 0; i < N; i++) {
        row   = data[i]
        key   = row[col_1]
        value = row[col_2]
        if (d[key] == undefined) {
            d[key] = [value]
        }
        else {
            d[key] = d[key].concat([value])
        }
    }
    return d;
}

// Filter to rows where column col has exactly value val
function filter_exact(data, col, val) {
    var N = data.length;
    var data_f = [];
    var row;
    for (let i = 0; i < N; i++) {
        row = data[i]
        if (row[col] == val) {
            data_f.push(row)
        }
    }
    console.log("Data filtered: " + N + " => " + data_f.length);
    return data_f;
}

/*** Main Drawing Function ***/
function visualize() {
    var data_f = data;

    // filter from UI
    if (document.getElementById("delayonly").checked == true) {
        data_f = filter_exact(data_f, "DEP_DEL15", 1);
    }
    if (document.getElementById("depblock").value != "All") {
        var block = document.getElementById("depblock").value;
        data_f = filter_exact(data_f, "DEP_BLOCK", block);
    }
    if (document.getElementById("dow").value != "0") {
        var dow = document.getElementById("dow").value;
        data_f = filter_exact(data_f, "DAY_OF_WEEK", dow);
    }
    if (window['airport'] != undefined) {
        data_f = filter_exact(data_f, "DEPARTING_AIRPORT", window['airport']);
    }

    // clear any previously drawn elements
    ["#cancel_props", "#cancel_x_axis", "#cancel_y_axis",
    "#delay_", "#delay_x_axis", "#delay_y_axis", "#my_chart",
    "#ages_chart", "maps", "graphs"]
        .map(function(x){ d3.select(x).selectAll("*").remove()});

    // update plots
    draw_proportions(data_f);
    //draw_delays(data_f);
    //
    draw_ali_plots(data_f);
    draw_shruti_plot(window["data_old"]);
}

/*** Load Data ***/
function load_data(step = 1) {
    if (step == 1) {
        d3.csv("data/departures_small.csv", function(data) {
            window["data"] = data;

            window["airports_list"] = d3.set(data.map(function(x) {
                return x['DEPARTING_AIRPORT'];
            })).values();
            console.log("Loaded departure data");

            newdataset = data.map(function (d) {
                return projection([d.LONGITUDE, d.LATITUDE]);
            });
            //console.log("projected?:", newdataset);

            airports = data.map(function (d) {
                return [d.DEPARTING_AIRPORT];
            });
            //console.log("airports?:", airports);

            for (var i = 0; i < data.length; i++) {
                localvars = d3.merge([newdataset[i], airports[i]]);
                vars3.push(localvars);
            }
            //console.log(vars3);
            window["vars3"] = vars3;

            load_data(step = 2);
        })
    }
    else if (step == 2) {
        d3.json("data/us.json", function(error, data) {
            if (error) throw error;
            window["us"] = data;
            console.log("Loaded US json");

            draw_map(data);

            load_data(step = 3);
        });
    }
    else if (step == 3) {
        d3.csv("data/departures_small_old.csv", function(data) {
            window["data_old"] = data;
            load_data(step = 4);
        })
    }
    else if (step == 4) {
        visualize();
        make_ui();
    }

}

/*** Kick-off the script ***/
// Global variables
var w = 600;
var h = 600;
var newdataset = [];
var vars3 = [];
var airports = [];
var projection = d3
  .geoAlbersUsa()
  //.translate([w / 2, h / 2])
  .translate([w / 2, h / 3])
  .scale([700]);
var path = d3.geoPath().projection(projection);

// main function
load_data();



