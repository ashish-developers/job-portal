const { body, query, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
  next();
};

const createRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('employment_type_id').optional().isInt({ min: 1 }),
  body('openings').optional().isInt({ min: 1 }),
  body('salary_min').optional().isFloat({ min: 0 }),
  body('salary_max').optional().isFloat({ min: 0 }),
  body('skill_ids').optional().isArray(),
];

const updateRules = [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('openings').optional().isInt({ min: 1 }),
  body('salary_min').optional().isFloat({ min: 0 }),
  body('salary_max').optional().isFloat({ min: 0 }),
  body('skill_ids').optional().isArray(),
];

const searchRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('salary_min').optional().isFloat({ min: 0 }),
  query('salary_max').optional().isFloat({ min: 0 }),
];

module.exports = { handle, createRules, updateRules, searchRules };
