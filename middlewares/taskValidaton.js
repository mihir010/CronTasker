const { body, param } = require('express-validator');

const createTaskValidationRules = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  body('due_date').isISO8601().withMessage('Due date must be a valid ISO8601 date'),
];

const createSubTaskValidationRules = [
  body('task_id').notEmpty().withMessage('Task ID is required'), // Add any additional validation rules as needed
];

const updateTaskValidationRules = [
  param('task_id').notEmpty().withMessage('Task ID is required'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid ISO8601 date'),
  body('status').optional({ nullable: true }).isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),
];

const updateSubTaskValidationRules = [
  param('subtask_id').notEmpty().withMessage('Subtask ID is required'),
  body('status').optional({ nullable: true }).isIn(['0', '1']).withMessage('Invalid status'),
];

const deleteTaskValidationRules = [
  param('task_id').notEmpty().withMessage('Task ID is required'),
];

const deleteSubTaskValidationRules = [
  param('subtask_id').notEmpty().withMessage('Subtask ID is required'),
];

module.exports = {
  createTaskValidationRules,
  createSubTaskValidationRules,
  updateTaskValidationRules,
  updateSubTaskValidationRules,
  deleteTaskValidationRules,
  deleteSubTaskValidationRules
};
