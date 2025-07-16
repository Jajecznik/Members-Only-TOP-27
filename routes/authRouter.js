const passport = require('passport');
const { Router } = require('express');
const router = Router();

const authController = require('../controllers/authController');

const { validationResult } = require('express-validator');
const validateUser = require('../validators/authValidator');

router.get('/', authController.getIndexPage);

router.get('/signin', authController.getSignInPage);
router.post('/signin', passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/signin"
}));

router.get('/signup', authController.getSignUpPage);
router.post('/signup', validateUser, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mappedErrors = {};

    errors.array().forEach(err => {
      if (!mappedErrors[err.path]) {
        mappedErrors[err.path] = err.msg;
      }
    });

    return authController.getSignUpPage(req, res, next, mappedErrors, req.body);
  }

  try {
    await authController.postSignUp(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/logout', authController.logout);

module.exports = router;