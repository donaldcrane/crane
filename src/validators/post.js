import Joi from "joi";

import objectId from "./common";

const validatePost = {
  body: Joi.object({
    post: Joi.string().min(1).required(),
  }).required(),
};

const editValidator = {
  body: Joi.object({
    post: Joi.string().min(1).required(),
  }).required(),
  params: Joi.object({
    postId: objectId.required(),
  }).required(),
};

const validateComment = {
  body: Joi.object({
    comment: Joi.string().min(1).required(),
  }).required(),
};

const validateId = {
  params: Joi.object({
    postId: objectId.required(),
  }).required(),
};

export {
  validatePost, validateId, validateComment, editValidator
};
