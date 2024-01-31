const { body } = require('express-validator');

const createUserValidationRules = [
  body('phone_number').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 characters long'),
  body('priority').isInt({ min: 0, max: 2 }).withMessage('Priority must be 0, 1, or 2'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
];

const loginUserValidationRules = [
  body('phone_number').notEmpty().withMessage('Phone number cannot be empty'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
];

module.exports = {
  createUserValidationRules,
  loginUserValidationRules
};
