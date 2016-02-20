window.onload = function(){
    google.charts.load('current', {'packages':['geochart']});
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {
        var countries =[['Country', 'Percent of Total Machines In Use', 'Country Code']];
        countries.push(['South Africa', 8, 'ZA']);
        countries.push(['India', 16, 'IN']);
        countries.push(['Egypt', 25, 'EG']);
        countries.push(['China', 6, 'CH']);
        countries.push(['Italy', 13, 'IT']);
        countries.push(['France', 21, 'FR']);

        var temp = [];
        for (var i = 0; i < countries.length; ++i)
        {
            temp.push([countries[i][0], countries[i][1]]);
        }

        var data = google.visualization.arrayToDataTable(temp);
        var options = {legend: {textStyle: {color: 'white'}},
                        colorAxis: {colors: ['FFFFE0', 'yellow', 'orange', 'red', '8B0000']}};

        var chart = new google.visualization.GeoChart(document.getElementById("map"));

        function mySelectHandler(){
            var selection = chart.getSelection();
            var item = selection[0];
            var indiv_options = options;
            indiv_options['region'] = countries[item.row+1][2];
            indiv_options['legend'] = 'none';
            $('<button type="button">Go Back To World Map</button>').insertAfter('h1').click(function(){
                console.log("click");
                drawRegionsMap();
                $(this).remove();
            });
            drawMarkersMap(indiv_options);
        }
        google.visualization.events.addListener(chart, 'select', mySelectHandler);
        chart.draw(data, options);
    }

    function drawMarkersMap(indiv_options) {
        var cities = [
            ['City',   'Population', 'Area'],
            ['Rome',      2761477,    1285.31],
            ['Milan',     1324110,    181.76],
            ['Naples',    959574,     117.27],
            ['Turin',     907563,     130.17],
            ['Palermo',   655875,     158.9],
            ['Genoa',     607906,     243.60],
            ['Bologna',   380181,     140.7],
            ['Florence',  371282,     102.41],
            ['Fiumicino', 67370,      213.44],
            ['Anzio',     52192,      43.43],
            ['Ciampino',  38262,      11]
        ];

        var city_data = google.visualization.arrayToDataTable(cities);

        indiv_options['displayMode'] = 'markers';
        
        var chart = new google.visualization.GeoChart(document.getElementById("map"));

        function myIndivSelectHandler(){
            var selection = chart.getSelection();
            var item = selection[0];
            displayTable(cities[item.row+1][0]);
        }

        google.visualization.events.addListener(chart, 'select', myIndivSelectHandler);
        chart.draw(city_data, indiv_options);
    }

    function displayTable(city){
        var table = '<table class ="table table-bordered">'
        table += '<tr>';
        var header = ['Serial Number', '# Treated', 'Avg Time(s)'];
        for(var i = 0; i < header.length; ++i){
            table += '<th>' + header[i] + '</th>';
        }
        table += '</tr>';
        var sampleData = [[12345, 30, 12], [12346, 210, 11], [12347, 5, 17]];
        for(var i = 0; i < sampleData.length; ++i){
            var row = '<tr>'
            for(var j = 0; j < sampleData[i].length; ++j){
                row += '<td>' + sampleData[i][j] + '</td>';
            }
            row += '</tr>'
            table += row;
        }
        table += '</table>'
        document.getElementById("tables").innerHTML = table;
    }
}