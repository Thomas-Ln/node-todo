const express          = require('express');
const twig             = require('twig');
const bodyParser       = require('body-parser');
const session          = require('cookie-session');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app  = express();
const port = 3000;

// init session
app.use(session({secret: 'todotopsecret'}))

// todolist singleton
.use(function(req, res, next){
  if (typeof(req.session.todolist) == 'undefined') {
    req.session.todolist = []; }
  next();
})

// home (render todolist)
.get('/', function(req, res) {
  res.render('index.twig', {
    todoList: req.session.todolist
  });
})

// add new todo
.post('/add', urlencodedParser, function(req, res) {
  if (req.body.todo != '') {
    req.session.todolist.push(req.body.todo); }
  res.redirect('/');
})

//remove todo
.get('/delete/:id', function(req, res) {
    if (req.params.id != '') {
      req.session.todolist.splice(req.params.id - 1, 1); }
    res.redirect('/');
})

// 404 not found
.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('Page introuvable !');
})

//
.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
