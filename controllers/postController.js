import PostModel from "../models/posts.js";
import UserModel from "../models/users.js";

const postController = {

    ///create post


    createPost: async (req, res) => {

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
                messge: 'creat post success',
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

    //find post by title

    findPostsByTitle: async (req, res) => {
        try {
            const { title } = req.query;
            console.log(title);
            const foundPosts = await PostModel.find();

            console.log(foundPosts);

            res.status(201).json({
                data: foundPosts,
                message: 'Tim kiem post thanh cong',
            });

        } catch (error) {
            res.status(200).send({
                data: post,
                message: 'get post by name success',

            })
        }
    },

    //get a post by id

    getPostById: async (req, res) => {
        const postId = req.params.postId;

        try {
            const post = await PostModel.findById(postId);

            if (!post) {
                return res.status(404).json({ message: 'post not found' });
            }

            res.status(201).send({
                data: post,
                message: "get a post success"
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error when get post' });
        }
    },

    //update post
    updatePost: async (req, res) => {
        try {
            const { postTitle, postContent } = req.body;
            const { postId } = req.params;

            console.log('on update');

            if (!postTitle) throw new Error("Chua co tieu de");
            if (!postContent) throw new Error("Chua co noi dung moi");

            const updatedPost = await PostModel.findOneAndUpdate(
                {
                    _id: postId,
                },
                {
                    postTitle,
                    postContent,
                },
                { new: true }
            );

            if (!updatedPost) {
                return res.status(404).json({ error: "Không tìm thấy bài viết" });
            }

            res.status(201).json({
                data: updatedPost,
                message: "Cập nhật bài viết thành công",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //delete post
    deletePost: async (req, res) => {
        try {
            const postId = req.params.postId;
            if (!postId) {
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