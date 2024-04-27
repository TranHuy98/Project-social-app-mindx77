import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        require: true,
    },
    postContent: {
        type: String,
        require: true,
    },
    postImage: [{
        type: String,
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }],
});

const PostModel = mongoose.model('posts', postSchema);

export default PostModel;