var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql8');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

// default route
app.get('/', function(req, res) {
    return res.send({ error: true, message: 'hello' });
});

// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Senai115',
    database: 'sakila'
});

// connect to database
dbConn.connect();

// Retrieve user with username 
app.get('/user/:username&:password', function(req, res) {
    const username = req.params.username;
    const password = req.params.password;
    if (!username) {
        return res.status(400).send({ error: true, message: 'Please provide username' });
    }
    dbConn.query('SELECT * FROM sakila.staff WHERE username="' + username + '" AND password="' + password + '";', function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.send({ error: false, data: results[0], username, password });
        } else {
            return res.send({ error: true, data: results[0], username, password });
        }
    });
});

// Retrieve all users 
app.get('/users/', function(req, res) {
    dbConn.query('SELECT * FROM sakila.staff', function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.send({ error: false, data: results });
        } else {
            return res.send({ error: true, data: results });
        }
    });
});

// Retrieve user with id 
app.get('/user/:staff_id', function(req, res) {

    let user_id = req.params.staff_id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    dbConn.query('SELECT * FROM sakila.staff where staff_id=?', user_id, function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.send({ error: false, data: results[0], user_id });
        } else {
            return res.send({ error: true, data: results[0], user_id });
        }
    });
});


// Add a new user  
app.post('/add', function(req, res) {
    let user = req.body;
    console.log("add user");

    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }

    dbConn.query("INSERT INTO sakila.staff SET ? ", user, function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});

//  Update user with id
app.put('/update', function(req, res) {
    let user = req.body;

    if (!user.staff_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }

    dbConn.query("UPDATE sakila.staff SET ? WHERE staff_id = ?", [user, user.staff_id],
        function(error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
        });
});

//  Delete user
app.delete('/delete/:staff_id', function(req, res) {

    let user_id = req.params.staff_id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM sakila.staff WHERE staff_id = ?', [user_id], function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
});

// set port
app.listen(3060, function() {
    console.log('Node app is running on port 3060');
});

module.exports = app;