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

    }
});

const CommentModel = mongoose.model('comments', commentSchema);

export default CommentModel;