const bcrypt = require('bcryptjs');
const db = require('../database/queries');

function getIndexPage(req, res) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect('/home');
  }

  res.render('index', {
    title: 'Members Only'
  });
}

function getSignInPage(req, res) {
  res.render('signIn', {
    title: 'Sign In'
  });
}

function getSignUpPage(req, res, next, errors = {}, formData = {}) {
  res.render('signUp', {
    title: 'Sign Up',
    errors: errors,
    data: formData
  });
}

async function postSignUp(req, res) {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser({ firstName, lastName, username, email, password: hashedPassword });

    // Set success flash message
    req.flash('success', 'Account created successfully! Please sign in.');
    res.redirect('/signin');
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).render('signUp', {
      title: 'Sign Up',
      errors: { general: 'An error occurred while creating the user.' },
      data: req.body
    });
  }
}

function logout(req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}

module.exports = {
  getIndexPage,
  getSignInPage,
  getSignUpPage,
  postSignUp,
  logout
};