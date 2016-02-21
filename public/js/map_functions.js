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
                    drawRegionsMap();
                    document.getElementById("tables").innerHTML = "";
                    $(this).remove();
                });
                drawMarkersMap(indiv_options, countries[item.row].country);
            }
            google.visualization.events.addListener(chart, 'select', mySelectHandler);
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

            var temp = [['City', 'Total Number of Resets']];

            for (var i = 0; i < cities.length; ++i)
                temp.push([cities[i].city, cities[i].total_reset]);

            var city_data = google.visualization.arrayToDataTable(temp);

            indiv_options['displayMode'] = 'markers';
        
            var chart = new google.visualization.GeoChart(document.getElementById("map"));

            function myIndivSelectHandler(){
                var selection = chart.getSelection();
                var item = selection[0];
                displayTable(cities[item.row].city);
            }

            google.visualization.events.addListener(chart, 'select', myIndivSelectHandler);
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
                console.log("\nRaw data:");
                console.log(data);
            }

        var table = '<table class ="table table-bordered">';
        table += '<caption style="font-size:200%; color:black;""><b>Machines in ' + city + '</b></caption>';
        table += '<tr>';

        var header = ['Serial Number', 'Average Lamp Time', 'Number of Resets'];
        for(var i = 0; i < header.length; ++i)
            table += '<th>' + header[i] + '</th>';
        table += '</tr>';

        for(var i = 0; i < machines.length; ++i){
            var row = '<tr>';
            row += '<td>' + machines[i].serial_number + '</td>';
            var avg = machines[i].total_lamp_time/machines[i].total_reset;
            row += '<td>' + avg + '</td>';
            row += '<td>' + machines[i].total_reset + '</td>';
            row += '</tr>'

            table += row;
        }

        table += '</table>'

        document.getElementById("tables").innerHTML = table;
    });
}