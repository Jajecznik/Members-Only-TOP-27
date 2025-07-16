require('dotenv').config();

const path = require('node:path');
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

if (!process.env.SESSION_SECRET || !process.env.APP_PORT || !process.env.APP_ADDRESS) {
  throw new Error('Missing environment variables in .env file.');
}

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Passport config
require('./passport/config')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRouter = require('./routes/authRouter');
const funcRouter = require('./routes/funcRouter');

app.use('/', authRouter);
app.use('/home', funcRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    isLoggedIn: req.isAuthenticated && req.isAuthenticated()
  });
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    error: err,
    isLoggedIn: req.isAuthenticated && req.isAuthenticated()
  });
});

// Start server
const PORT = process.env.APP_PORT;
const HOST = process.env.APP_ADDRESS;

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`)
});


