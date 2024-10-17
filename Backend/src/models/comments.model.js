import mongoose,{Schema} from "mongoose";

const CommentSchema = new Schema({
  commentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
},{
    timestamps:true
});

export const Comment = mongoose.model('Comment', CommentSchema);

