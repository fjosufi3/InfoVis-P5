/**
 * Created by Josufi on 4/15/19.
 */

d3.csv("data/colleges.csv", function(param_data) {

    function create_basic_info(index) {
        d3.select("#control").text(param_data[index]["Control"]);
        d3.select("#region").text(param_data[index]["Region"]);
        d3.select("#locale").text(param_data[index]["Locale"]);
        d3.select("#admission").text(param_data[index]["Admission Rate"]);
        d3.select("#act").text(param_data[index]["ACT Median"]);
        d3.select("#sat").text(param_data[index]["SAT Average"]);
        d3.select("#undergrad").text(param_data[index]["Undergrad Population"]);
    }

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

    function init() {
        create_basic_info(0);
        create_pie_chart_1(0);
        create_pie_chart_2(0);
        create_pie_chart_3(0);
    }

    function dynamic_selection() {
        var select = d3.select("#dropdown")
            .append("select")
            .attr("id", "colleges");

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

    function hide(id) {
        d3.select(id)
            .transition()
            .style("width", 0)
            .delay(100)
            .duration(500);
    }

    function show(id) {
        d3.select(id)
            .transition()
            .style("width", 425)
            .delay(100)
            .duration(500);
    }

    init();
    dynamic_selection();
});