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
var registered = ["peter", "igor"];
var adminPath = path.join(__dirname, 'admin');
var sess;
var body;


app.post('/register', (req, res) => {
    sess = req.session;
    body = req.body;
    registered.push(body.username);
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

    if (registered.indexOf(body.username) != -1){
      // User is registetered
      // You wouldnt just check the username to validate that he gets the cookie
        console.log('You are not logged in as admin, wait a second.');
        sess.admin = true;
        res.redirect('/admin');
    } else {
      res.redirect('login.html');
    }
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
