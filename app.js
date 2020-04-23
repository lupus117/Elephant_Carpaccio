/******************************/
/* SETUP VARIABLES AND USINGS */
/******************************/

/* requirements */
const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

/* important variables */
const app = express();
const port = process.env.PORT || 3000;
const url = "/api";
/* Connect node and mysql: https://invidio.us/watch?v=XuLRKMqozwA */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ElephantDB',
    insecureAuth: true
});

connection.connect();

app.use(express.json());

/* enable CORS */
app.use(function(req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

EnsureThatTableStatesExists();

/****************/
/* END OF SETUP */
/****************/

/* listen for requests */
app.listen(port, () =>
{
    console.log(`Server running on port: ${port}`);
    console.log(`Access API at: \"localhost:${port}${url}\"`);
});


/*************/
/* FUNCTIONS */
/*************/

function GetState(state, callback)
{
    connection.query('SELECT * FROM states WHERE state=?', state, function(err, result){
        if(err)
        {
            console.error(err);
            return(err);
        }
        callback(result[0]);
    });
}

function EnsureThatTableStatesExists()
{
    connection.query('CREATE TABLE IF NOT EXISTS states (id INT PRIMARY KEY AUTO_INCREMENT, State VARCHAR(255) NOT NULL, TaxRate DECIMAL(6,4));', function(err, result){
        if(err)
        {
            console.error(err);
            return;
        }
        console.log("\nGENERATING TABLE \"states\"");
        AddStateToStatesTable();
        console.error(result);
    });
}

function AddStateToStatesTable()
{
    /* add example account */
    let state = { id: 1, State:"UT", TaxRate:"6.85" };
    connection.query('INSERT IGNORE INTO states set ?', state, function(err, result){
        if(err)
        {
            console.error(err);
            return;
        }
        console.log("\nGENERATING DATA FOR TABLE \"States\"...");
        console.error(result);
    });
}
