const Joi = require('joi');

const committeeValidation = {
    create: Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Committee name cannot be empty',
            'any.required': 'Committee name is required',
        }),
        isActive: Joi.boolean().optional(),
    }),
    update: Joi.object({
        name: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
    }),
};

module.exports = {
    committeeValidation,
};
