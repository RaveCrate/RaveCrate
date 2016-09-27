var express = require('express');
var app = express();
app.disable('x-powered-by');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 5555;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-requested-with, Content-Type, origin, authorization, accept, client-security-token');
  next();
});

app.use(morgan('dev'));

//set static files location used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){ // any route that isn't API then load static index.html
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/login.html'));
});

app.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/signup.html'));
});

app.get('/events', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/events.html'));
});

app.get('/events/detail', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/eventDetail.html'));
});

app.get('/events/create', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/createevents.html'));
});

app.get('/freelancers', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/freelancer.html'));
});

app.get('/freelancers/signup', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/createfreelancer.html'));
});

app.get('/contact', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/contactUs.html'));
});

app.get('/about', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/about.html'));
});

app.get('/comingsoon', function(req, res){
    res.sendFile(path.join(__dirname + '/public/views/comingsoon.html'));
});

app.listen(port, function(){
  console.log('PORT ' + port + ' is up and running.');
  console.log('In the browser, go to localhost:' + port);
})
