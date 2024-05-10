import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
    },
    content: {
        type: String,

    },
    createAt: {
        type: Date,
        default: Date.now,
    }
});

const CommentModel = mongoose.model('comments', commentSchema);

export default CommentModel;