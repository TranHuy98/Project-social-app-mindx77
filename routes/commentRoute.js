import { Router } from "express";
import commentController from "../controllers/commentController.js";
import authentication from "../middlewares/authentication.js";

const commentRouter = Router();

commentRouter.post('/:postId', authentication.verifyAccessToken ,commentController.createComment);

commentRouter.get('/:postId', commentController.getAllComments);

commentRouter.put('/:postId/:commentId', authentication.verifyAccessToken, commentController.updateComment);

commentRouter.delete('/:postId/:commentId', authentication.verifyAccessToken, commentController.deleteComment);

export default commentRouter;