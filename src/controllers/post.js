import models from "../models";
import { successResponse } from "../utils/responses";

/**
 * @class PostController
 * @description create, seller Post
 * @exports PostController
 */
export default class PostController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async createPost(req, res) {
    const { post } = req.body;
    const Posts = await models.Post.create({ post, owner: req.user.id });
    return successResponse(
      res,
      201,
      "Posts created successfully",
      Posts
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async likePost(req, res) {
    const { postId } = req.params;
    const Post = await models.Post.findById({ _id: postId });
    if (!Post) { return res.status(404).json({ status: 404, error: "Post not found." }); }
    const user = await models.Post.findOne({ likes: req.user._id });
    if (user) { return res.status(403).json({ status: 403, error: "Sorry you can only like post once." }); }

    await models.Post.updateOne(
      { _id: postId },
      { $inc: { likes_count: 1 } }
    );
    const liked_Post = await models.Post.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: [req.user._id] } },
      { new: true },
    );
    return successResponse(
      res,
      200,
      "Successfully liked Post.",
      liked_Post
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async unlikePost(req, res) {
    const { postId } = req.params;
    const { _id } = req.user;
    const Post = await models.Post.findOne({ _id: postId });
    if (!Post) { return res.status(404).json({ status: 404, error: "Post not found." }); }
    const user = await models.Post.findOne({ likes: req.user._id });
    if (!user) { return res.status(403).json({ status: 403, error: "Sorry you have to like post once." }); }

    await models.Post.updateOne(
      { _id: postId },
      { $inc: { likes_count: -1 } }
    );
    const unliked_Post = await models.Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { likes: _id } },
      { new: true }
    );
    return successResponse(
      res,
      200,
      "Successfully unliked Post.",
      unliked_Post
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async deletePost(req, res) {
    const { postId } = req.params;
    const Post = await models.Post.findById({ _id: postId });
    if (!Post) { return res.status(404).json({ status: 404, error: "Post not found." }); }
    if (req.user.id !== Post.owner.toString()) {
      return res.status(409).json({
        status: 409, error: "Unauthorized Access, only owner can delete post."
      });
    }
    await models.Post.findByIdAndRemove({ _id: postId });
    return successResponse(
      res,
      200,
      "Successfully Deleted Post.",
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async addComment(req, res) {
    const { comment } = req.body;
    const { postId } = req.params;
    const Post = await models.Post.findById({ _id: postId });
    if (!Post) { return res.status(404).json({ status: 404, error: "Post not found." }); }
    const newComment = { comment, owner: req.user.id };
    const createdComment = await models.Comment.create(newComment);
    await models.Post.updateOne(
      { _id: postId },
      { $addToSet: { comment: [createdComment._id] }, },
      { new: true },
    );
    return successResponse(
      res,
      201,
      "Comment added successfully.",
      createdComment
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getPosts(req, res) {
    const Posts = await models.Post.find({}).populate([
      {
        path: "owner",
        select: "username firstName lastName"
      },
      {
        path: "likes",
        select: "username firstName lastName",
      },
      { path: "comments", populate: "owner" },
    ]).lean();
    return successResponse(
      res,
      200,
      "Successfully retrieved all Posts.",
      Posts
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getPostById(req, res) {
    const { postId } = req.params;
    const Post = await models.Post.findOne({ _id: postId }).populate([
      {
        path: "owner",
        select: "username firstName lastName"
      },
      {
        path: "likes",
        select: "username firstName lastName",
      },
      { path: "comments", populate: "owner" },
    ]).lean();
    if (!Post) { return res.status(404).json({ status: 404, error: "Post not found." }); }
    return successResponse(
      res,
      200,
      "Successfully retrieved Post.",
      Post
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async editPost(req, res) {
    const { postId } = req.params;
    const { post } = req.body;
    const Post = await models.Post.findOne({ _id: postId });
    if (!Post) { return res.status(404).json({ status: 404, error: "Post not found." }); }
    const newPost = await models.Post.findByIdAndUpdate(
      { _id: postId },
      { post }, { new: true }
    );
    return successResponse(
      res,
      200,
      "Successfully edited Post.",
      newPost
    );
  }
}
