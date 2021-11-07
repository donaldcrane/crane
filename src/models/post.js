import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    post: { type: String, trim: true,required: true, },
    owner: { type: Schema.Types.ObjectId, ref: "user" },
    likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    likes_count: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

postSchema.index({
  post: "text"
});


module.exports = {
  postSchema,
  Post: model("post", postSchema),
};
