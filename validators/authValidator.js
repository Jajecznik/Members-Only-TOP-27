const db = require('../database/queries');
const { body } = require('express-validator');

const validateUser = [
  body('firstName').trim()
    .isAlpha().withMessage('First name must contain only letters')
    .isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters long'),
  body('lastName').trim()
    .isAlpha().withMessage('Last name must contain only letters')
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters long'),
  body('username').trim()
    .isAlphanumeric().withMessage('Username must contain only letters and numbers')
    .isLength({ min: 4, max: 16 }).withMessage('Username must be between 1 and 16 characters long')
    .custom(async (value) => {
      const user = await db.getUserByUsername(value);
      if (user) {
        throw new Error('Username is already taken');
      }
    }),
  body('email').trim()
    .isEmail().withMessage('Enter a valid email address')
    .custom(async (value) => {
      const user = await db.getUserByEmail(value);
      if (user) {
        throw new Error('Email is already registered');
      }
    }),
  body('password').trim()
    .isLength({ min: 8, max: 32 }).withMessage('Password must be between 8 and 32 characters long')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/).withMessage('Password must contain at least one digit')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

module.exports = validateUser;