const express = require('express');
const mysql = require("mysql");
const bodyParser = require("body-parser");
const http = require('http');
const socketIO = require('socket.io');
const socketController = require('./controllers/socketController');
const app = express();
const cors = require('cors');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
const server = http.createServer(app);
const io = socketIO(server);

// Socket.io connection handling
io.on('connection', (socket) => {
  socketController.handleConnection(socket, io);
});



const connection = mysql.createConnection({
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "ludo",

   host:"119.18.54.135",
   user:"mclinpll_ludo_user",
   password:"!2MRVcTj4SeB",
  database:"mclinpll_ludo",



});


// connection.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("connected");
//   }
// });


function handleDisconnect() {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Connected to MySQL");
    }
  });

  connection.on('error', (err) => {
    console.error('MySQL connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.post("/signup", (req, res) => {
  var name = req.body.name;
  var phone = req.body.phone;


  var RoboNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  var Roboname = "Robo"


var sql = `INSERT INTO registration (name, mobile,playerType) VALUES ("${name}", "${phone}","Human")`
  connection.query(sql, function (err, result) {
    if (err) throw err;
    else{
        console.log("record inserted");
        var sql1 = `INSERT INTO registration (name, mobile,playerType) VALUES ("${Roboname}", "${RoboNumber}","Robot")`
      connection.query(sql1, function (err, result) {
    if (err) throw err;
    else{
        console.log("record inserted");
       
    }
   
  });
        return res.send(result)
    }
   
  });
});

app.get("/getUserData", (req, res) => {
  console.log("104",req.query.userId)
   
    const userId = req.query.userId;
    console.log(userId)
    const sql = `SELECT id, name, mobile FROM registration WHERE mobile = ? `;
    connection.query(sql,[userId] ,function (err, result) {
      if (err) throw err;
      else{
   
          return res.send(result)
      }
  
    });
});

app.get("/verify", (req, res) => {
   
     
      const userId = req.query.userId;
      console.log("76",userId)

      const sql = `SELECT id, name, mobile FROM registration WHERE mobile = ${userId}`;
      connection.query(sql,function (err, result) {
        if (err) throw err;
        else{
            // console.log("verify")
            console.log(result)
            return res.send(result)
        }
    
      });
});

app.post("/changeStatus", (req, res) => {

  const userId = req.query.userId;

var sql = `INSERT INTO registration (status) VALUES ("active") WHERE mobile = ?`;
  connection.query(sql, [userId],function (err, result) {
    if (err) throw err;
    else{
        console.log("status changed");
        return res.send(result)
    }
   
  });
});

// Start the server

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

