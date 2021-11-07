import { Router } from "express";
import PostController from "../controllers/post";
import Authentication from "../middlewares/auth";
import validator from "../middlewares/validator";
import {
  validatePost, validateComment, validateId, editValidator
} from "../validators/post";

const router = Router();

const { authenticate } = Authentication;
const {
  createPost, likePost, unlikePost, deletePost, addComment, getPosts, getPostById, editPost,
} = PostController;

router.get("/", authenticate, getPosts);
router.get("/:postId", authenticate, validator(validateId, false), getPostById);

router.post(
  "/", authenticate,
  validator(validatePost, false),
  createPost
);

router.post(
  "/:postId/comment", authenticate,
  validator(validateComment, false),
  addComment
);

router.patch(
  "/:postId/like", authenticate,
  validator(validateId, false), likePost
);

router.patch(
  "/:postId/unlike", authenticate,
  validator(validateId, false), unlikePost
);

router.patch(
  "/:postId/edit", authenticate,
  validator(editValidator, false), editPost
);

router.delete(
  "/:postId", authenticate,
  validator(validateId, false), deletePost
);

module.exports = router;
