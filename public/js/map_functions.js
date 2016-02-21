window.onload = function(){
    google.charts.load('current', {'packages':['geochart']});
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {
        $.ajax({
            type: "GET", //type of request: get is going to select data (basically all you will do).
            url: "/api/data/country", //website.com/.... (everything should be /api/<insert api endpoint>)
            dataType: 'json', //Parses data to json.
            /*headers: { //FOR LOGIN TO EDIT STUFF
            "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },*/
            //data: '{ "comment" }',
        }).done(function(data, status) {
                //alert(data);
                if(status == "success"){
                    if(!data.Error) {//not an error 
                        var countries = data.DataRecords;
                    }
                    else {
                        console.log(data.Message);
                    }
                }
            
            var temp = [['Country', 'Number of Machines']];
            for (var i = 0; i < countries.length; ++i)
                temp.push([countries[i].country, countries[i].number_units]);

            var dataVis = google.visualization.arrayToDataTable(temp);
            var options = { colorAxis: {colors: ['FF9', 'yellow', 'orange', 'red', '8B0000']},
                            backgroundColor: '87CEFA',
                            datalessRegionColor: 'F0FFF0'};

            var chart = new google.visualization.GeoChart(document.getElementById("map"));

            function mySelectHandler(){
                var selection = chart.getSelection();
                var item = selection[0];
                var indiv_options = options;
                indiv_options['region'] = countries[item.row].country_code;
                indiv_options['legend'] = 'none';
                indiv_options['colorAxis'] = {colors: ['FFD700', 'orange', 'red', '8B0000']};
                $('<button type="button">Go Back To World Map</button>').insertAfter('h1').click(function(){
                    var existing_button = document.getElementById('back_country');
                    if(existing_button)
                        existing_button.remove();
                    drawRegionsMap();
                    document.getElementById("tables").innerHTML = "";
                    $(this).remove();
                });
                drawMarkersMap(indiv_options, countries[item.row].country);
            }
            google.visualization.events.addListener(chart, 'select', mySelectHandler);
            displayLineWorld();
            chart.draw(dataVis, options);
        });
    }

    function drawMarkersMap(indiv_options, country) {
        $.ajax({
            type: "GET", //type of request: get is going to select data (basically all you will do).
            url: "/api/data/country/" + country, //website.com/.... (everything should be /api/<insert api endpoint>)
            dataType: 'json', //Parses data to json.
            /*headers: { //FOR LOGIN TO EDIT STUFF
            "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },*/
            //data: '{ "comment" }',
        }).done(function(data, status) {
                //alert(data);
                if(status == "success"){
                    if(!data.Error) {//not an error 
                        var cities = data.DataRecords;
                    }
                    else {
                        console.log(data.Message);
                    }
                }

            var temp = [['City', 'Total Number of Resets', 'Total Number of Machines']];

            for (var i = 0; i < cities.length; ++i)
                temp.push([cities[i].city, cities[i].total_reset, cities[i].number_units]);

            var city_data = google.visualization.arrayToDataTable(temp);

            indiv_options['displayMode'] = 'markers';
        
            var chart = new google.visualization.GeoChart(document.getElementById("map"));

            function myIndivSelectHandler(){
                var existing_button = document.getElementById('back_country');
                if(existing_button)
                    existing_button.remove();
                var selection = chart.getSelection();
                var item = selection[0];
                displayTable(cities[item.row].city);
                $('<button type="button" id="back_country">Show ' + country + ' Line Graphs</button>').insertAfter('#tables').click(function(){
                    document.getElementById("tables").innnerHTML = "";
                    displayLineCountry(country);
                    $(this).remove();
                });
            }

            google.visualization.events.addListener(chart, 'select', myIndivSelectHandler);
            displayLineCountry(country);
            chart.draw(city_data, indiv_options);
        });
    }
}

function displayTable(city){
    $.ajax({
            type: "GET", //type of request: get is going to select data (basically all you will do).
            url: "/api/data/city/" + city, //website.com/.... (everything should be /api/<insert api endpoint>)
            dataType: 'json', //Parses data to json.
            /*headers: { //FOR LOGIN TO EDIT STUFF
            "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },*/
            //data: '{ "comment" }',
    }).done(function(data, status) {
            //alert(data);
            if(status == "success"){
                if(!data.Error) {//not an error 
                    var machines = data.DataRecords;
                }
                else {
                    console.log(data.Message);
                }
            }

        var table = '<h4>Machines in ' + city + '</h4><table class ="table table-bordered">';
        table += '<tr>';

        var header = ['Serial Number', 'Average Lamp Time', 'Number of Resets'];
        for(var i = 0; i < header.length; ++i)
            table += '<th>' + header[i] + '</th>';
        table += '</tr>';

        for(var i = 0; i < machines.length; ++i){
            var row = '<tr>';
            row += '<td>' + machines[i].serial_number + '</td>';
            var avg = machines[i].total_lamp_time/machines[i].total_reset;
            avg = Math.round(avg * 100)/100;
            row += '<td>' + avg + '</td>';
            row += '<td>' + machines[i].total_reset + '</td>';
            row += '</tr>'

            table += row;
        }

        table += '</table>'

        document.getElementById("tables").innerHTML = table;
    });
}

function loadCountryLines(callback, country){

    var tabs = '<ul class="nav nav-tabs" role="tablist">' +
    '<li role="presentation" class="active"><a href="#country_month" aria-controls="country_month" role="tab" data-toggle="tab">This Year</a></li>' +
    '<li role="presentation"><a href="#country_year" aria-controls="country_year" role="tab" data-toggle="tab">All-time</a></li>' +
  '</ul>';

  tabs += '<div class="tab-content">' +
    '<div role="tabpanel" class="tab-pane active" id="country_month"></div>' +
    '<div role="tabpanel" class="tab-pane" id="country_year"></div>'+
  '</div>';

  document.getElementById("tables").innerHTML = tabs;
  callback();
}

function displayLineCountry(country){
    loadCountryLines(function() {
        $.ajax({
                type: "GET", //type of request: get is going to select data (basically all you will do).
                url: "/api/data/year/country/" + country, //website.com/.... (everything should be /api/<insert api endpoint>)
                dataType: 'json', //Parses data to json.
                /*headers: { //FOR LOGIN TO EDIT STUFF
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
                },*/
                //data: '{ "comment" }',
            }).done(function(data, status) {
                    //alert(data);
                    if(status == "success"){
                        if(!data.Error) {//not an error 
                            var years = data.DataRecords;
                        }
                        else {
                            console.log(data.Message);
                        }
                    }
            document.getElementById("country_year").innerHTML = '<div><h4>Total Number of Machines Used in ' + country + ' per Year</h4><canvas id="countryLine"></canvas></div>';
            document.getElementById("country_year").innerHTML += '<div><h4>Total Number of Timer Resets in ' + country + ' per Year</h4><canvas id="countryLineR"></canvas></div>';

            var ctx = document.getElementById("countryLine").getContext("2d");
            var ctx_r = document.getElementById("countryLineR").getContext("2d");

            var x_axis = [];
            var y_axis_number = [];
            var y_axis_resets = [];

            for(var i = 0; i < years.length; ++i)
                x_axis.push(years[i].year);
            for(var i = 0; i < years.length; ++i) {
                y_axis_number.push(years[i].number_units);
                y_axis_resets.push(years[i].AStotal_reset);
            }

            var data_number = {
                labels: x_axis,
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(216,191,216,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(70,70,70,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: y_axis_number
                }]
            };

            var data_resets = {
                labels: x_axis,
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(216,191,216,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(70,70,70,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: y_axis_resets
                }]
            };

            var options = {bezierCurve : false,
                            scaleBeginAtZero: true};

            var myLineChartNumber = new Chart(ctx).Line(data_number, options);
            var myLineChartResets = new Chart(ctx_r).Line(data_resets, options);
        });

        $.ajax({
                type: "GET", //type of request: get is going to select data (basically all you will do).
                url: "/api/data/month/country/" + country, //website.com/.... (everything should be /api/<insert api endpoint>)
                dataType: 'json', //Parses data to json.
                /*headers: { //FOR LOGIN TO EDIT STUFF
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
                },*/
                //data: '{ "comment" }',
            }).done(function(data, status) {
                    //alert(data);
                    if(status == "success"){
                        if(!data.Error) {//not an error 
                            var months = data.DataRecords;
                        }
                        else {
                            console.log(data.Message);
                        }
                    }

            var date = new Date();
            var cur_month = date.getMonth();
            var cur_year = date.getYear()%100;
            var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.getElementById("country_month").innerHTML = '<div><h4>Total Number of Machines Used in ' + country + ' This Past Year</h4><canvas id="countryLine"></canvas></div>';
            document.getElementById("country_month").innerHTML += '<div><h4>Total Number of Timer Resets in ' + country + ' This Past Year</h4><canvas id="countryLineR"></canvas></div>';

            var ctx = document.getElementById("countryLine").getContext("2d");
            var ctx_r = document.getElementById("countryLineR").getContext("2d");

            var x_axis = [];
            var y_axis_number = [];
            var y_axis_resets = [];

            for(var i = 0; i < months.length; ++i)
            {  
                var month = months[i].month;
                if(month <= cur_month)
                    x_axis.push(month_names[month-1] + " '" + cur_year);
                else
                    x_axis.push(month_names[month-1] + " '" + (cur_year-1));
            }
            for(var i = 0; i < months.length; ++i) {
                y_axis_number.push(months[i].number_units);
                y_axis_resets.push(months[i].total_reset);
            }

            var data_number = {
                labels: x_axis,
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(216,191,216,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(70,70,70,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: y_axis_number
                }]
            };

            var data_resets = {
                labels: x_axis,
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(216,191,216,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(70,70,70,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: y_axis_resets
                }]
            };

            var options = {bezierCurve : false,
                            scaleBeginAtZero: true};

            var myLineChartNumber = new Chart(ctx).Line(data_number, options);
            var myLineChartResets = new Chart(ctx_r).Line(data_resets, options);
        });
    });
}

function loadWorldLines(callback){

    var tabs = '<ul class="nav nav-tabs" role="tablist">' +
    '<li role="presentation" class="active"><a href="#world_month" aria-controls="world_month" role="tab" data-toggle="tab">This Year</a></li>' +
    '<li role="presentation"><a href="#world_year" aria-controls="world_year" role="tab" data-toggle="tab">All-time</a></li>' +
  '</ul>';

  tabs += '<div class="tab-content">' +
    '<div role="tabpanel" class="tab-pane active" id="world_month"></div>' +
    '<div role="tabpanel" class="tab-pane" id="world_year"></div>'+
  '</div>';

  document.getElementById("tables").innerHTML = tabs;
  callback();
}

function displayLineWorld(){
    loadWorldLines(function() {
        $.ajax({
                type: "GET", //type of request: get is going to select data (basically all you will do).
                url: "/api/data/year", //website.com/.... (everything should be /api/<insert api endpoint>)
                dataType: 'json', //Parses data to json.
                /*headers: { //FOR LOGIN TO EDIT STUFF
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
                },*/
                //data: '{ "comment" }',
            }).done(function(data, status) {
                    //alert(data);
                    if(status == "success"){
                        if(!data.Error) {//not an error 
                            var years = data.DataRecords;
                        }
                        else {
                            console.log(data.Message);
                        }
                    }
            document.getElementById("world_year").innerHTML = '<div><h4>Total Number of Machines Used Globally per Year</h4><canvas id="globalLine"></canvas></div>';
            document.getElementById("world_year").innerHTML += '<div><h4>Total Number of Timer Resets Globally per Year</h4><canvas id="globalLineR"></canvas></div>';

            var ctx = document.getElementById("globalLine").getContext("2d");
            var ctx_r = document.getElementById("globalLineR").getContext("2d");

            var x_axis = [];
            var y_axis_number = [];
            var y_axis_resets = [];

            for(var i = 0; i < years.length; ++i)
                x_axis.push(years[i].year);
            for(var i = 0; i < years.length; ++i){
                y_axis_number.push(years[i].number_units);
                y_axis_resets.push(years[i].AStotal_reset);
            }

            var data_number = {
                labels: x_axis,
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(216,191,216,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(70,70,70,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: y_axis_number
                }]
            };

            var data_resets = {
                labels: x_axis,
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(216,191,216,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(70,70,70,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: y_axis_resets
                }]
            };

            var options = {bezierCurve : false,
                            scaleBeginAtZero: true};

            var myLineChartNumber = new Chart(ctx).Line(data_number, options);
            var myLineChartResets = new Chart(ctx_r).Line(data_resets, options);
        });

        $.ajax({
                type: "GET", //type of request: get is going to select data (basically all you will do).
                url: "/api/data/month", //website.com/.... (everything should be /api/<insert api endpoint>)
                dataType: 'json', //Parses data to json.
                /*headers: { //FOR LOGIN TO EDIT STUFF
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
                },*/
                //data: '{ "comment" }',
            }).done(function(data, status) {
                    //alert(data);
                    if(status == "success"){
                        if(!data.Error) {//not an error 
                            var months = data.DataRecords;
                        }
                        else {
                            console.log(data.Message);
                        }
                    }

            var date = new Date();
            var cur_month = date.getMonth();
            var cur_year = date.getYear()%100;
            var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.getElementById("world_month").innerHTML = '<div><h4>Total Number of Machines Used Globally This Past Year</h4><canvas id="globalLine"></canvas></div>';
            document.getElementById("world_month").innerHTML += '<div><h4>Total Number of Timer Resets Globally This Past Year</h4><canvas id="globalLineR"></canvas></div>';

            var ctx = document.getElementById("globalLine").getContext("2d");
            var ctx_r = document.getElementById("globalLineR").getContext("2d");

            var x_axis = [];
            var y_axis_number = [];
            var y_axis_resets = [];

            for(var i = 0; i < months.length; ++i)
            {  
                var month = months[i].month;
                if(month <= cur_month)
                    x_axis.push(month_names[month-1] + " '" + cur_year);
                else
                    x_axis.push(month_names[month-1] + " '" + (cur_year-1));
            }
            for(var i = 0; i < months.length; ++i){
                y_axis_number.push(months[i].number_units);
                y_axis_resets.push(months[i].total_reset);
            }

            var data_number = {
                labels: x_axis,
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(216,191,216,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(70,70,70,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: y_axis_number
                }]
            };

            var data_resets = {
                labels: x_axis,
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(216,191,216,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(70,70,70,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: y_axis_resets
                }]
            };

            var options = {bezierCurve : false,
                            scaleBeginAtZero: true};

            var myLineChartNumber = new Chart(ctx).Line(data_number, options);
            var myLineChartResets = new Chart(ctx_r).Line(data_resets, options);
        });
    });
}