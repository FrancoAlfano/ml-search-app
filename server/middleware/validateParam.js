import { param, validationResult } from 'express-validator';

const validateParam = [
  param('id')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('ID parameter is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export default validateParam;
