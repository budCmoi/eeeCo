import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  MONGODB_URI: Joi.string().allow('').optional(),
  USE_IN_MEMORY_DB: Joi.boolean().truthy('true').falsy('false').default(false),
  JWT_SECRET: Joi.string().min(16).default('change-this-secret-before-production'),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  GOOGLE_CLIENT_ID: Joi.string().allow('').optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').optional(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().default('http://localhost:4000/api/auth/google/callback'),
  STRIPE_SECRET_KEY: Joi.string().allow('').optional(),
  STRIPE_SUCCESS_URL: Joi.string().uri().default('http://localhost:3000/account?payment=success'),
  STRIPE_CANCEL_URL: Joi.string().uri().default('http://localhost:3000/checkout'),
  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),
  CLOUDINARY_API_KEY: Joi.string().allow('').optional(),
  CLOUDINARY_API_SECRET: Joi.string().allow('').optional()
});