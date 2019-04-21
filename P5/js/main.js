/**
 * Created by Josufi and Wang on 4/15/19.
 */


d3.csv("data/colleges.csv", function(param_data) {

    /*
     * Load the map of the United States with colleges as points
     */
    function load_map() {
        var mapWidth = 1000;
        var mapHeight = 800;
        var zooming = false;
        var projection = d3.geoAlbersUsa()
            .translate([mapWidth/2, mapHeight/2])
            .scale([1400]);
        var path = d3.geoPath()
            .projection(projection);

        var zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', zoomed);
        var currMapTrans = [0,0];
        var currMapScale = 1;

        // var brushOffset = geoPathGroupBounds.x - svgBounds.x;
        // var brushXDomain = [brushOffset, geoPathGroupBounds.width + brushOffset];
        // // 0 or top whichever is a larger number; bottom or height whichever is smaller
        // var brushYDomain = [
        //     (geoPathGroupBounds.top < 0 ? 0 : geoPathGroupBounds.top),
        //     (geoPathGroupBounds.bottom < this.height ? geoPathGroupBounds.bottom : this.height),
        // ];

        var brush = d3.brush()
            .extent([[0, 0], [mapWidth, mapHeight]])
            .on("start", clear)
            // .on("end", brushend);

        var dx,
            dy,
            x,
            y;


        var svg = d3.select("#map")
            .append("svg")
            .attr("width", mapWidth)
            .attr("height", mapHeight)
            .style("float", "left")

        var g = svg.append("g");


        d3.select("body").on("keydown", function () {
            d3.select(".brush").style('opacity', 0);
            zooming = d3.event.ctrlKey || d3.event.metaKey;
        });

        d3.select("body").on("keyup", function () {
            zooming = false;
        });


        d3.json("data/us-states.json", function(json) {
            g.selectAll("path")
                .data(json.features)
                .enter().append("path")
                .attr("d", path)
                .style("stroke", "fff")
                .style("stroke-width","1")
                .style("fill", "#a1d99b");


            d3.select("g")
              .call(brush)

            g.selectAll("circle")
                .data(param_data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    if (projection([d.longitude, d.latitude])) {
                        return projection([d.longitude, d.latitude])[0];
                    }
                })
                .attr("cy", function (d) {
                    if (projection([d.longitude, d.latitude])) {
                        return projection([d.longitude, d.latitude])[1];
                    }
                })
                .attr("r", 1)
                .style("fill", "#43a2ca");


            // var svgBounds = svg.node().getBoundingClientRect();
            // var geoPathGroupBounds = g.node().getBoundingClientRect();
            // var brushOffset = geoPathGroupBounds.x - svgBounds.x;
            // var brushXDomain = [brushOffset, geoPathGroupBounds.width + brushOffset];
            // console.log(brushOffset);
            // console.log(brushXDomain);
            // var brushYDomain = [
            //     (geoPathGroupBounds.top < 0 ? 0 : geoPathGroupBounds.top),
            //     (geoPathGroupBounds.bottom < mapHeight ? geoPathGroupBounds.bottom : mapHeight),
            // ];
            //
            // brush
            //   .extent[d3.scaleOrdinal().range(brushXDomain), d3.scaleOrdinal().range(brushYDomain)]
            //
            // console.log(brushYDomain);
            // if (!zooming) {
            //   d3.select("g")
            //     .call(brush)
            // }
        });



        // svg.call(zoom);


        // function brushend() {
        //   var s = d3.event.selection,
        //       dx = s[1][0] - s[0][0],
        //       dy = s[1][1] - s[0][1],
        //       x = (s[0][0] + s[1][0]) / 2,
        //       y = (s[0][1] + s[1][1]) / 2;
        //   // console.log(s);
        //   // console.log(dx);
        //   // console.log(dy);
        //   // console.log(x);
        //   // console.log(y);
        //
        //   console.log(currMapScale);
        //   console.log(currMapTrans);
        //
        //   currMapScale = Math.max(1, Math.min(40, 0.9 / Math.max(dx / mapWidth, dy / mapHeight)));
        //   currMapTrans = [(mapWidth / 2) - (currMapScale * x), (mapHeight / 2) - (currMapScale * y)];
        //
        //   console.log(currMapScale);
        //   console.log(currMapTrans);
        //
        //   svg.transition()
        //       .duration(750)
        //       .call(zoom.transform, d3.zoomIdentity.translate(currMapTrans[0], currMapTrans[1]).scale(currMapScale));
        //
        //   svg.select(".brush")
        //       .call(zoom.transform, d3.zoomIdentity.translate(currMapTrans[0], currMapTrans[1]).scale(currMapScale));
        //
        //
        // }

        console.log(currMapScale);
        console.log(currMapTrans);

        function clear() {
          svg.transition()
              .duration(750)
              // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
              // .call( zoom.transform, d3.zoomIdentity );
        }

        function zoomed() {
            // console.log(d3.event.transform);
              currMapScale = d3.event.transform.k;
              console.log(currMapScale);
              g
                  .selectAll('path') // To prevent stroke width from scaling
                  .attr('transform', d3.event.transform)
              g
                  .selectAll('circle')
                  .attr('transform', d3.event.transform);

              g
                  .selectAll(".brush")
                  .attr('transform', d3.event.transform);
        }
    }

    /*
     * Fill in basic info (control, region, locale, admission rate, act, sat, undergraduate population)
     *
     * @param index corresponding to the dropdown selection
     */
    function create_basic_info(index) {
        d3.select("#control").text(param_data[index]["Control"]);
        d3.select("#region").text(param_data[index]["Region"]);
        d3.select("#locale").text(param_data[index]["Locale"]);
        d3.select("#admission").text(param_data[index]["Admission Rate"]);
        d3.select("#act").text(param_data[index]["ACT Median"]);
        d3.select("#sat").text(param_data[index]["SAT Average"]);
        d3.select("#undergrad").text(param_data[index]["Undergrad Population"]);
    }

    /*
     * Create third pie chart (student status)
     *
     * @param index corresponding to the dropdown selection
     */
    function create_pie_chart_1(index) {
        var percent_part_time = Math.round(+param_data[index]["% Part-time Undergrads"] * 100);
        var percent_full_time = 100 - percent_part_time;

        var pie1_data =
            {
                labels: ["Part-time Undergrads", "Full-time Undergrads"],
                values: [percent_part_time, percent_full_time]
            };

        if (percent_part_time !== 0) {
            create_pie("#pies", pie1_data, "#pie1", ["#7fc97f", "#beaed4"], "Student Status");
            show("#pie1");
        } else {
            hide("#pie1");
        }
    }

    /*
     * Create third pie chart (employment rate)
     *
     * @param index corresponding to the dropdown selection
     */
    function create_pie_chart_2(index) {
        var num_unemployed = +param_data[index]["Number of Unemployed 8 years after entry"],
            num_employed = +param_data[index]["Number of Employed 8 years after entry"];

        var total = num_employed + num_unemployed;

        var percent_unemployed = Math.round(num_unemployed / total * 100),
            percent_employed = Math.round(num_employed / total * 100);

        console.log(percent_employed);

        var pie2_data =
            {
                labels: ["Unemployed 8 years after entry", "Employed 8 years after entry"],
                values: [percent_unemployed, percent_employed]
            };

        if (num_unemployed !== 0 && num_employed !== 0) {
            create_pie("#pies", pie2_data, "#pie2", ["#fbb4ae", "#b3cde3"], "Employment Rate");
            show("#pie2");
        } else {
            hide("#pie2");
        }
    }

    /*
     * Create third pie chart (ethnicity dist.)
     *
     * @param index corresponding to the dropdown selection
     */
    function create_pie_chart_3(index) {
        var white = +(param_data[index]["% White"] * 100).toFixed(2),
            black = +(param_data[index]["% Black"] * 100).toFixed(2),
            hispanic = +(param_data[index]["% Hispanic"] * 100).toFixed(2),
            asian = +(param_data[index]["% Asian"] * 100).toFixed(2),
            american_indian = +(param_data[index]["% American Indian"] * 100).toFixed(2),
            pacific_islander = +(param_data[index]["% Pacific Islander"] * 100).toFixed(2),
            biracial = +(param_data[index]["% Biracial"] * 100).toFixed(2),
            nonresident = +(param_data[index]["% Nonresident Aliens"] * 100).toFixed(2);

        var pie3_data =
            {
                labels: ["White", "Black", "Hispanic", "Asian", "American Indian", "Pacific Islander", "Biracial", "Nonresidents"],
                values: [white, black, hispanic, asian, american_indian, pacific_islander, biracial, nonresident]
            };

        console.log(pie3_data);

        create_pie("#pies", pie3_data, "#pie3",
            ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"], "Ethnicity Distribution");
        show("#pie3")
    }

    /*
     * Initialize visualization based on first dropdown (default)
     */
    function init() {
        create_basic_info(0);
        create_pie_chart_1(0);
        create_pie_chart_2(0);
        create_pie_chart_3(0);
    }

    /*
     * Add select and handle changes in dropdown
     */
    function dynamic_selection() {
        var select = d3.select("#dropdown")
            .append("select")
            .attr("id", "colleges")
            .attr("class", "select");

        select.selectAll("option")
            .data(param_data)
            .enter()
            .append("option")
            .attr("value", function (d, i) { return i; })
            .text(function (d) { return d.Name; });

        select
            .on("change", function(d, i) {
                hide("#pie1");
                hide("#pie2");
                hide("#pie3");
                var value = d3.select(this).property("value");
                create_basic_info(value);
                create_pie_chart_1(value);
                create_pie_chart_2(value);
                create_pie_chart_3(value);
            });
    }

    /*
     * Generic pie chart creation
     *
     * @param chart pass in a div id corresponding to the type of chart(s)
     * @param param_data the object data passed in
     * @param id id for the specific chart being created (ex. #pie1 for first pie chart)
     * @param colors for the pie chart
     * @title title of the chart, displayed on the right
     */
    function create_pie(chart, param_data, id, colors, title) {
        var margin = {top: 20, right: 45, bottom: 20, left: 80};

        var tooltip = d3.select(chart)
            .append('div')
            .attr('class', 'tooltip');

        tooltip.append('div')
            .attr('class', 'label');

        var data = param_data;

        var width = 300,
            height = 300,
            radius = 100;

        var color = d3.scaleOrdinal()
            .range(colors);

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d; });

        var svg = d3.select(chart).select(id)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.append("text")
            .attr("class", "title")
            .attr("x", width/2 + margin.right)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .text(title);

        var g = svg.selectAll(".arc")
            .data(pie(data.values))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data); });

        var path = svg.selectAll('path');

        path.on('mouseover', function(d, i) {
            var percent = d.data;
            tooltip.select('.label').html(data.labels[i] + ": " + percent + "%");
            tooltip.style('display', 'block');
        });

        path.on('mouseout', function() {
            tooltip.style('display', 'none');
        });

        path.on('mousemove', function(d) {
            tooltip.style('top', (d3.event.pageY + 10) + 'px')
                .style('left', (d3.event.pageX + 10) + 'px');
        });

    }

    /*
     * Animation to hide charts
     */
    function hide(id) {
        d3.select(id)
            .transition()
            .style("width", 0)
            .delay(100)
            .duration(500);
    }

    /*
     * Animation to display charts
     */
    function show(id) {
        d3.select(id)
            .transition()
            .style("width", 425)
            .delay(100)
            .duration(500);
    }

    // Functions called to initiate vis, init displays the default vis and dynamic selection controls
    // updating the charts based on different selections
    init();
    dynamic_selection();
    load_map();
});
