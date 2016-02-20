var mysql = require("mysql");
function REST_ROUTER(router,connection,hash) {
    var self = this;
    self.handleRoutes(router,connection,hash);
}
function verify(req, res, connection, hash, callback) {
    var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
    console.log("Authorization Header is: ", auth);

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

        console.log("Decoded Authorization ", plain_auth);

        // At this point plain_auth = "username:password"

        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];
        var query = "SELECT ??, ?? FROM ?? WHERE ??=?";
        var table = ["id", "password","User","user_name", username];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                console.log("here");
                console.log(rows);
                if(rows.length == 0 || rows.affectedRows <= 0) {
                    res.statusCode = 401;
                    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                    res.json({"Error" : true, "Message" : "Error authenticating"});
                }
                else {
                    if(hash.verify(password, rows[0].password)) {   // Is the password correct?
                        callback({"id": rows[0].id});
                    }
                    else {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.json({"Error" : true, "Message" : "Error authenticating pass"});
                    }
                }
            }
        });
    }
} 
REST_ROUTER.prototype.handleRoutes= function(router,connection,hash) {
    router.get("/",function(req,res){
        //console.log(req);
        verify(req, res, connection, hash, function(id) { 
            res.json({"Message" : "Api home", "req" : req.header});
        });
    })
    router.post("/users",function(req,res){
        verify(req, res, connection, hash, function(id) { 
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
    });
    router.get("/users",function(req,res){
        verify(req, res, connection, hash, function(id) { 
            var query = "SELECT * FROM ??";
            var table = ["User"];
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
            var query = "SELECT * FROM ?? WHERE ??=?";
            var table = ["User","user_name",req.params.user_name];
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
    router.get("/data",function(req,res){
        verify(req, res, connection, hash, function(id) { 
            var query = "SELECT * FROM ??";
            var table = ["DataRecord"];
            query = mysql.format(query,table);
            connection.query(query,function(err,rows){
                if(err) {
                    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                } else {
                    res.json({"Error" : false, "Message" : "Success", "Data Records" : rows});
                }
            });
        });
    });
    router.post("/data",function(req,res){
        verify(req, res, connection, hash, function(id) { 
            var query = "INSERT INTO ??(??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            var table = ["DataRecord"];
            query = mysql.format(query,table);
            connection.query(query,function(err,rows){
                if(err) {
                    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                } else {
                    res.json({"Error" : false, "Message" : "Success", "Data Records" : rows});
                }
            });
        });
    });

}

module.exports = REST_ROUTER;