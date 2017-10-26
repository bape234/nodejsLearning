var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(express.static('open'));
app.use(session({secret: 'mySecret'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Imagine this was the db with the names and pw hased and not just an array of strings:)
var registered = new Array();
var adminPath = path.join(__dirname, 'admin');
var sess;
var body;

// username
function User(username, password) {
  this.username = username;
  this.password = password;
}

app.post('/register', (req, res) => {
    sess = req.session;
    body = req.body;
    registered.push(new User(body.username, body.password));
    console.log("registered persons are: " + registered)
    res.redirect('/index.html');
});

app.post('/login', (req, res) => {
  sess = req.session;
  body = req.body;
  if (sess.admin) {
    console.log('You are logged in as admin.')
    res.sendFile(path.join(adminPath, 'admin.html' ));
  }
  else {
    console.log(body.username);
    for (var i = 0; i < registered.length; i++) {
      if (registered[i].username == body.username && registered[i].password == body.password) {
                console.log('Succesfully logged in');
                sess.admin = true;
                res.redirect('/admin');
                return;
      }
    }

    console.log('failed to log in, wrong credentials')
    res.redirect('login.html');
  }
});

app.get('/admin', (req, res) => {
  sess = req.session;
  if (sess.admin) {
    res.sendFile(path.join(adminPath, 'admin.html'));
  } else {
    res.redirect('/index.html');
  }

});

app.listen(3000,function(){
  console.log("App Started on PORT 3000");
});
