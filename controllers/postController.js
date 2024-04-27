import PostModel from "../models/posts.js";

const postController = {

    ///create post


    createPost: async (req, res) => {

        // console.log('ok');

        try {
            const { postTitle, postContent, postImage } = req.body;

            if (!postTitle) throw new Error("Chua co tieu de");
            if (!postContent) throw new Error("Chua co noi dung");

            const newPost = await PostModel.create({
                postTitle,
                postContent,
                postImage,
            });

            console.log(newPost);

            await newPost.save();

            res.status(201).send({
                data: newPost,
                messge: 'success',
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'create fail',
            })
        }
    },

    ///get all post

    getAllPost: async (req, res) => {
        try {
            const { pageNumber, pageSize } = req.query;
            const totalPosts = await PostModel.countDocuments();
            const totalPages = Math.ceil(totalPosts / Number(pageSize));
            const skip = (pageNumber - 1) * pageSize;
            const result = await PostModel.find({}).skip(skip).limit(pageSize);

            const data = {
                totalPosts,
                totalPages,
                currentPage: pageNumber,
                items: result,
            }

            res.status(200).send({
                data: data,
                message: 'success',
            })
        } catch (error) {
            res.status(500).json({ message: 'fail' })
        }
    },

    ///get a post

    getPostById: async (req, res) => {
        const postId = req.params;

        const post = await PostModel.findById(postId);

        res.status(200).send({
            data: post,
            message: 'success',

        })
    },

    //update post
    updatePost: async (req, res) => {

        try {
            const { postTitle, postContent } = req.body;
            const { id } = req.params;

            const currentUser = req.user;

            if (!postTitle) throw new Error("Chua co tieu de");
            if (!postContent) throw new Error("Chua co noi dung");

            const updatedPost = await PostModel.findOneAndUpdate({
                _id: id,
                author: currentUser,
            }, {
                postTitle,
                postContent,
            });

            res.status(201).send({
                data: updatedPost,
                messge: 'success',
            })
        } catch (error) {
            res.status(404).send({
                message: 'fail',
            })
        }
    },

    //delete post
    deletePost: async (req, res) => {
        try {
            const postId = req.params.postId;
            if(!postId) {
                return res.status(404).send({ message: 'bai viet ko ton tai' });
            }

            const currentPost = await PostModel.findById(postId.toString());
            if (!currentPost) {
                return res.status(404).send({ message: 'bai viet ko ton tai' });
            }

            await PostModel.findByIdAndDelete(postId.toString());
            res.status(200).send({ message: 'xoa bai viet thanh cong' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'xoa fail' });
        }
    },
}

export default postController;