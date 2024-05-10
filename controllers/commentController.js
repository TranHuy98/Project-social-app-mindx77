import CommentModel from "../models/comments.js";
import PostModel from "../models/posts.js";
import UserModel from "../models/users.js";

const commentController = {

    //create comment
    createComment: async (req, res) => {
        try {

            console.log('create comment');
            const { commentContent } = req.body;
            const { postId } = req.params;

            console.log(postId);

            if (!postId) throw new Error('ko tim thay bai viet');
            if (!commentContent) throw new Error('comment ko de trong');

            const userInfo = req.user;
            const currentAuthor = await UserModel.findById(userInfo.userId);
            console.log(currentAuthor);


            const currentPost = await PostModel.findById(postId);

            if (!currentPost) throw new Error('Ko co thong tin bai viet');

            const newComment = await CommentModel.create({
                author: currentAuthor,
                post: postId,
                content: commentContent,
            });

            console.log(newComment._id);
            console.log(newComment.content);
            console.log('xem comment');

            const updatedPost = await PostModel.findByIdAndUpdate(
                postId,
                { $push: { comments: newComment } },
                { new: true }
            );

            await updatedPost.save();

            console.log(updatedPost.comments);

            res.status(201).send({
                data: newComment,
                commentLocation: postId,
                message: "create comment success",
            })

        } catch (error) {

            console.log(error);
            res.status(403).send({
                message: "create comment fail",
            })
        }
    },

    //get all comments
    getAllComments: async (req, res) => {
        try {
            const { postId } = req.params;
            const currentPost = await PostModel.findById(postId);

            const commentIds = currentPost.comments;
            const commentsArray = [];

            for (const commentId of commentIds) {
                try {
                    const comment = await CommentModel.findById(commentId.toString());

                    console.log(comment);
                    if (comment) {
                        commentsArray.push(comment);
                    }
                } catch (error) {
                    console.error(`Error finding comment with id ${commentId}:`, error);
                }
            }

            console.log(commentsArray);

            res.status(200).send({
                data: commentsArray,
                message: "get all comment success",
            })
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: "get all comments fail",
            })
        }
    },

    //update comment
    updateComment: async (req, res) => {
        try {
            const userInfo = req.user;
            const currentAuthor = await UserModel.findById(userInfo.userId);
            console.log(currentAuthor);

            const { postId, commentId } = req.params;
            if (!postId) throw new Error('Khong tim thay bai viet');
            if (!commentId) throw new Error("Khong tim thay comment");

            const currentComment = await CommentModel.findById(commentId);
            console.log(currentComment);

            if (currentComment.author.toString() !== currentAuthor.id && currentComment.post.toString() !== postId) {
                console.log('cannot update comment');

                res.status(400).send({
                    message: "Ko co quyen sua comment",
                })
            };

            const newComment = req.body;

            console.log(newComment);

            const updatedComment = await CommentModel.findByIdAndUpdate(commentId, {
                content: newComment.content,
                createdAt: Date.now(),
            }, { new: true });

            await updatedComment.save();


            res.status(201).send({
                message: "update comment success",
                data: updatedComment,
            })
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: "update comment fail",
            })
        }
    },

    //xoa comment
    deleteComment: async (req, res) => {
        try {
            const userInfo = req.user;
            const currentAuthor = await UserModel.findById(userInfo.userId);
            console.log(currentAuthor);

            const { postId, commentId } = req.params;
            if (!postId) throw new Error('Khong tim thay bai viet');
            if (!commentId) throw new Error("Khong tim thay comment");

            const currentComment = await CommentModel.findById(commentId);
            console.log(currentComment);

            if (currentComment.author.toString() !== currentAuthor.id && currentComment.post.toString() !== postId) {
                console.log('cannot delete comment');

                res.status(400).send({
                    message: "Ko co quyen xoa comment",
                })
            };

            await CommentModel.findByIdAndDelete(commentId);


            res.status(201).send({
                message: "delete comment success",
            })
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: "delete comment fail",
            })
        }
    },
};

export default commentController;