import CommentModel from "../models/comments.js";
import PostModel from "../models/posts.js";

const commentController = {

    //create comment
    createComment: async(req,res) =>{
        try {

            console.log('create comment');
            const { postId, commentContent} = req.body;

            if(!postId) throw new Error('ko tim thay bai viet');
            if(!commentContent) throw new Error('comment ko de trong');

            // const currentUser = req.user;
            const currentPost = await PostModel.findById(postId);

            if(!currentPost) throw new Error('Ko co thong tin bai viet');

            const newComment = await CommentModel.create({
                author: currentUser,
                post: postId,
                content: commentContent,
            });

            res.status(201).send({
                data: newComment,
                message: "create comment success",
            })
            
        } catch (error) {
            res.status(403).send({
                message: "create comment fail",
            })
        }
    },
};

export default commentController;