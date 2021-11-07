import Joi from "joi";

const registerValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().min(5),
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  }).required(),
};

const loginValidation = {
  body: Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  }).required(),
};

const verifyValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().min(5).required(),
  }).required(),
};

const recoverValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }).required(),
};

const resetValidation = {
  body: Joi.object({
    token: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    retypePassword: Joi.string().min(5).required(),
  }).required(),
};

const profileValidation = {
  body: Joi.object({
    firstName: Joi.string().min(5),
    lastName: Joi.string().min(5),
  })
};

export {
  registerValidation, loginValidation, verifyValidation, recoverValidation, resetValidation, profileValidation
};
