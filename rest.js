var mysql = require("mysql");
var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
    apiKey: 'AIzaSyD5kSQvenr8X3TcC-WrEDz1gyInAtB-CNo', // for Mapquest, OpenCage, Google Premier 
    formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

function REST_ROUTER(router,connection,hash) {
    var self = this;
    self.handleRoutes(router,connection,hash);
}
function verify(req, res, connection, hash, callback) {
    var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
    //console.log("Authorization Header is: ", auth);

    if(!auth) {     // No Authorization header was passed in so it's the first time the browser hit us
        // Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
        // Basic auth is quite literally the easiest and least secure, it simply gives back  base64( username + ":" + password ) from the browser
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    }

    else if(auth) {    // The Authorization was passed in so now we validate it

        var tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

        var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
        var plain_auth = buf.toString();        // read it back out as a string

        //console.log("Decoded Authorization ", plain_auth);

        // At this point plain_auth = "username:password"

        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];
        var query = "SELECT ??, ?? FROM ?? WHERE ??=?";
        var table = ["id", "password","User","user_name", username];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true});
            } else {
                if(rows.length == 0 || rows.affectedRows <= 0) {
                    res.statusCode = 401;
                    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                    res.json({"Error" : true});
                }
                else {
                    if(hash.verify(password, rows[0].password)) {   // Is the password correct?
                        callback(rows[0].id);
                    }
                    else {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.json({"Error" : true});
                    }
                }
            }
        });
    }
} 
REST_ROUTER.prototype.handleRoutes= function(router,connection,hash) {
    router.get("/",function(req,res){
        verify(req, res, connection, hash, function(id) { 
            res.json({"Message" : "Api home"});
        });
    })
    router.get("/login",function(req,res){
        verify(req, res, connection, hash, function(id) { 
            res.json({"Error" : false});
        });
    })
    router.post("/users",function(req,res){
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table = ["User","user_name","email", "password",
    			req.body.user_name, req.body.email,hash.generate(req.body.password)];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
        	   if(err.code == "ER_DUP_ENTRY") {
        		  res.json({"Error" : true, "Message" : "Error duplicate entry"});
        	   }
        	   else {
            	   res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                }
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });
    router.get("/users",function(req,res){
        verify(req, res, connection, hash, function(id) { 
            var query = "SELECT ??, ?? FROM ??";
            var table = ["user_name", "id","User"];
            query = mysql.format(query,table);
            connection.query(query,function(err,rows){
                if(err) {
                    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                } else { 
                    res.json({"Error" : false, "Message" : "Success", "Users" : rows});
                }
            });
        });
    });
    router.get("/users/:user_name",function(req,res){
        verify(req, res, connection, hash, function(id) { 
            var query = "SELECT id, user_name FROM User WHERE user_name=?";
            console.log(req.params.user_name);
            var table = [req.params.user_name];
            query = mysql.format(query,table);
            connection.query(query,function(err,rows){
                if(err) {
                    res.json({"Error" : true, "Message" : "Error executing MySQL query", "Error" : err});
                } else {
                    res.json({"Error" : false, "Message" : "Success", "Users" : rows});
                }
            });
        }); 
    });
    router.delete("/users/:user_name",function(req,res){
        verify(req, res, connection, hash, function(id) { 
            var query = "Select ?? FROM ?? WHERE ??=?";
            var table = ["id", "User", "user_name", req.params.user_name];
            query = mysql.format(query,table);
            connection.query(query,function(err,rows){
                if(err) {
                    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                } else {
                    if(rows.length == 0 || rows[0].id != id) {
                        res.json({"Error" : true, "Message" : "User not found or doesn't have permission to delete"});
                    }
                    else {
                        var query = "Delete FROM ?? WHERE ??=?";
                        var table = ["User","id",id];
                        query = mysql.format(query,table);
                        connection.query(query,function(err,rows){
                            if(err) {
                                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                            } else {
                                res.json({"Error" : false, "Message" : "Success User deleted"});
                            }
                        });
                    }
                }
            });
        });
    });
    router.get("/data/country",function(req,res){
        var query = "Select country, country_code, Count(distinct serial_number) AS number_units From ?? GROUP BY country";
        var table = ["DataRecord"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/year",function(req,res){
        var query = 'select Count(distinct serial_number) AS number_units, sum(lamp_time) AS total_lamp_time, sum(timer_reset) AS' +
                    'total_reset, sum(meter_on) AS total_meter_on, sum(meter_in) AS total_meter_in, sum(meter_time) AS total_meter_time, year(time_recorded) AS year from DataRecord group by YEAR(time_recorded)';
        var table = [];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/year/country/:country_query",function(req,res){
        var query = 'select Count(distinct serial_number) AS number_units, sum(lamp_time) AS total_lamp_time, sum(timer_reset) AS' +
                    'total_reset, sum(meter_in) AS total_meter_in, sum(meter_on) AS total_meter_on, sum(meter_time) AS total_meter_time, year(time_recorded) AS year from DataRecord WHERE country=? group by YEAR(time_recorded)';
        var table = [req.params.country_query];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/month",function(req,res){
        var query = 'select Count(distinct serial_number) AS number_units, sum(lamp_time) AS total_lamp_time, sum(timer_reset) AS total_reset, sum(meter_on)' + 
        'AS total_meter_on, sum(meter_in) AS total_meter_in, sum(meter_time) AS total_meter_time, month(time_recorded) AS month from DataRecord WHERE datediff(curDate(),time_recorded) <= 365  group by Month(time_recorded) order by Cast(datediff(date_add(time_recorded, INTERVAL 1 YEAR), curdate())/30 AS unsigned)';
        var table = [];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/month/country/:country_query",function(req,res){
       var query = 'select Count(distinct serial_number) AS number_units, sum(lamp_time) AS total_lamp_time, sum(timer_reset) AS total_reset, sum(meter_on)' + 
        'AS total_meter_on, sum(meter_in) AS total_meter_in, sum(meter_time) AS total_meter_time, month(time_recorded) AS month from DataRecord WHERE datediff(curDate(),time_recorded) <= 365  group by Month(time_recorded) order by Cast(datediff(date_add(time_recorded, INTERVAL 1 YEAR), curdate())/30 AS unsigned)';
        var table = [req.params.country_query];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/year/country",function(req,res){
        var query = 'select Count(distinct serial_number) AS number_units, sum(lamp_time) AS total_lamp_time, sum(timer_reset) AS' +
                    'total_reset, sum(meter_on) AS total_meter_on, sum(meter_in) AS total_meter_in, sum(meter_time) AS total_meter_time, year(time_recorded) AS year from DataRecord group by YEAR(time_recorded)';
        var table = [];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/month/country",function(req,res){
        var query = "Select country, country_code, Count(distinct serial_number) AS number_units From ?? GROUP BY country";
        var table = ["DataRecord"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/country/:country_query",function(req,res){
        var query = 'Select city, sum(lamp_time) AS total_lamp_time, sum(timer_reset) AS total_reset, sum(meter_on)' +
        ' AS total_meter_on, sum(meter_in) AS total_meter_in, sum(meter_time) AS total_meter_time, count(distinct serial_number) AS number_units From DataRecord WHERE country=? GROUP BY city';
        var table = [req.params.country_query];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/city/:city_query",function(req,res){
        var query = 'Select city, serial_number, sum(lamp_time) AS total_lamp_time, sum(timer_reset) AS total_reset, sum(meter_on) ' +
        'AS total_meter_on, sum(meter_time) AS total_meter_time, COUNT(id) AS total_records From DataRecord WHERE city=? GROUP BY serial_number';
        var table = [req.params.city_query];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data",function(req,res){
        var query = "SELECT * FROM ??"; //TODO Make more useful
        var table = ["DataRecord"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    router.get("/data/user/",function(req,res){
        var query = "select user_name, user_id, count(DataRecord.id) AS total_records FROM User JOIN DataRecord on User.id = DataRecord.user_id Group By user_id";
        var table = [];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });
    /*router.get("/data/sn/",function(req,res){
        var query = "select user_name, user_id, count(DataRecord.id) AS total_records FROM User JOIN DataRecord on User.id = DataRecord.user_id Group By user_id";
        var table = [];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "DataRecords" : rows});
            }
        });
    });*/
    router.post("/data",function(req,res){
        verify(req, res, connection, hash, function(id) {
            if(req.body.lat != null && req.body.lng != null) {
                geocoder.reverse({lat: req.body.lat, lon: req.body.lng}, function(err, resp) {
                    if(resp.raw.status != 'ZERO_RESULTS'){
                        query(resp[0].country, resp[0].countryCode, resp[0].city);
                    }
                    else {
                        query();
                    }
                });
            }
            else {
                query();
            }
            function query(country, countryCode, city){
                var query = "INSERT INTO DataRecord(??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, DATE(?));";
                var table = ["user_id", "lamp_time", "timer_reset", "serial_number",
                        "meter_on", "meter_in", "meter_time", gps_lat,gps_lng,country,country_code,city,time_recorded,
                        id, req.body.lamp_time, req.body.reset, req.body.sn, req.body.meter_on,  req.body.meter_in,
                        req.body.meter_time, req.body.lat, req.body.lng, country, countryCode, city, req.body.time];
                query = mysql.format(query,table);
                connection.query(query,function(err,rows){
                    if(err) {
                        res.json({"Error" : true, "Message" : "Error executing MySQL query", "error": err});
                    } else {
                        res.json({"Error" : false, "Message" : "Success", 
                            "City": city, "Country": country, "Country Code": countryCode});
                    }
                });
            }
        });
    });

}

module.exports = REST_ROUTER;