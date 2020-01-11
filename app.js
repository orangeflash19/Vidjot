const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

//map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connect to mongoose database
mongoose.connect('mongodb://localhost/vidjot-dev', {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
 .then(() => console.log('Mongodb Connected......'))
 .catch(err => console.log(err));

//handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded( { extended: false } ) );
app.use(bodyParser.json());

//method override Middleware
app.use(methodOverride('_method'));

//express session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//flash Middleware
app.use(flash());

//global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Index or homepage route
app.get('/', (req, res) => {
  const title = 'Welcome to Vidjot!';
  res.render('index', {
    title: title
  });
});

//about route
app.get('/about', (req, res) => {
  res.render('about');
});




//starts the server
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
