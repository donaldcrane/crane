import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    comment: {type: String, required: true},
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

commentSchema.index({
  comment: "text"
});

module.exports = {
  commentSchema,
  Comment: model("comment", commentSchema),
};
