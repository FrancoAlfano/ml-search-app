import { query, validationResult } from 'express-validator';

const validateQuery = [
  query('q')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Query parameter q is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export default validateQuery;
