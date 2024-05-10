import { Router } from "express";
import userController from "../controllers/userController.js";
import authentication from "../middlewares/authentication.js";

const userRouter = Router();


userRouter.post('/signup', authentication.validateSignUp ,userController.signUp);
userRouter.post('/login', authentication.validateLogIn,userController.logIn);
userRouter.post('/logout', authentication.verifyAccessToken ,userController.logOut);
userRouter.get('/:userId', authentication.verifyAccessToken, userController.getUserInfo);
userRouter.put('/:userId', authentication.verifyAccessToken, userController.updateUserInfo);


export default userRouter;