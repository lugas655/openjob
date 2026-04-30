// lugas_hermanto_zVUj
const Joi = require('joi');

const UserRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(1).optional(),
  fullname: Joi.string().min(1).optional(),
  role: Joi.string().optional(),
}).unknown(true);

const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(true);

const CompanySchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  location: Joi.string().trim().min(1).required(), // TAMBAHAN BARU
  description: Joi.string().allow('', null).optional(),
}).unknown(true);

const CategorySchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().allow('', null).optional(),
}).unknown(true);

const JobSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
}).unknown(true);

const ApplicationSchema = Joi.object({
  job_id: Joi.string().optional(),
  jobId: Joi.string().optional(),
}).unknown(true).custom((value, helpers) => {
  if (!value.job_id && !value.jobId) {
    return helpers.error('any.invalid');
  }
  return value;
}).messages({
  'any.invalid': 'job_id atau jobId wajib diisi',
});

module.exports = { UserRegisterSchema, LoginSchema, CompanySchema, CategorySchema, JobSchema, ApplicationSchema };