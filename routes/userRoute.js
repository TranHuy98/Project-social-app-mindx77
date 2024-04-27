import { Router } from "express";
import userController from "../controllers/userController.js";
import authentication from "../middlewares/authentication.js";

const userRouter = Router();

userRouter.post('/signup', userController.signUp);
userRouter.post('/login', userController.logIn);
userRouter.get('/:userId', authentication.verifyAccessToken, userController.getUserInfo);
userRouter.put('/:userId', authentication.verifyAccessToken, userController.updateUserInfo);

export default userRouter;