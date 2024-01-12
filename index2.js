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
  host: "localhost",
  user: "root",
  password: "",
  database: "ludo",
});


connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});

app.post("/signup", (req, res) => {
  var name = req.body.name;
  var phone = req.body.phone;


  var sql = `INSERT INTO signup (uname, mobileNumber) VALUES ("${name}", "${phone}")`
  connection.query(sql, function (err, result) {
    if (err) throw err;
    else {
      console.log("record inserted");
      return res.send(result)
    }

  });
});

app.get("/getUserData", (req, res) => {
  console.log("104", req.query.userId)

  const userId = req.query.userId;
  console.log(userId)
  const sql = `SELECT uid, uname, mobileNumber,status FROM signup WHERE mobileNumber = ? `;
  connection.query(sql, [userId], function (err, result) {
    if (err) throw err;
    else {

      return res.send(result)
    }

  });
});

app.get("/verify", (req, res) => {


  const userId = req.query.userId;

  const sql = `SELECT uid, uname, mobileNumber,status FROM signup WHERE mobileNumber = ${userId} `;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    else {
      return res.send(result)
    }

  });
});



app.post("/changeStatus", (req, res) => {

  const userId = req.query.userId;

  var sql = `INSERT INTO signup (status) VALUES ("active") WHERE mobileNumber = ?`;
  connection.query(sql, [userId], function (err, result) {
    if (err) throw err;
    else {
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


