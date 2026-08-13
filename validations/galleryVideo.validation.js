const Joi = require('joi');

const galleryVideoValidation = {
    create: Joi.object({
        title: Joi.string().required().messages({
            'string.empty': 'Video title is required',
            'any.required': 'Video title is required'
        }),
        videoId: Joi.string().required().messages({
            'string.empty': 'YouTube Video ID is required',
            'any.required': 'YouTube Video ID is required'
        }),
        isActive: Joi.boolean().default(true)
    }),

    update: Joi.object({
        title: Joi.string().allow('', null),
        videoId: Joi.string().allow('', null),
        isActive: Joi.boolean()
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    })
};

module.exports = {
    galleryVideoValidation
};
