const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

let fs = require('fs');
let path = require('path');
app.set('view engine', 'ejs');

// Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
let headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000 // 30 days
};

// Connection to mongo
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/IOT';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// API
const APIRoutes = require("./routes");
app.use(APIRoutes);

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('app listening on port 3000!')
})