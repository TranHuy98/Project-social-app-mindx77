import { Router } from "express";

import postController from "../controllers/postController.js";
import authentication from "../middlewares/authentication.js";



const postRouter = Router();

postRouter.post('', postController.createPost);
postRouter.get('', postController.getAllPost);
postRouter.get('/:postId', postController.getPostById);
postRouter.put('/:postId',authentication.verifyAccessToken ,postController.updatePost);
postRouter.delete('/:postId', postController.deletePost);

export default postRouter;