import UserModel from "../models/users.js";
import { generateToken } from "../middlewares/token.js";
import bcrypt from 'bcryptjs';

const userController = {
    //sign up

    signUp: async (req, res) => {

        console.log('ok');

        try {

            const { userName, userEmail, userPassword } = req.body;
            const existedEmail = await UserModel.findOne({ userEmail });
            if (existedEmail) throw new Error('email existed');

            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(userPassword, salt);


            const newUser = await UserModel.create({
                userEmail,
                userName,
                userPassword: hash,
                salt: salt,
            });

            await newUser.save();
            res.status(200).send({
                data: newUser,
                message: 'success'
            });

        } catch (error) {
            res.status(500).json({ message: 'error' })
        }
    },

    //login

    logIn: async (req, res) => {
        try {

            console.log('in login');
            const { email, password } = req.body;
            const currentUser = await UserModel.findOne({ userEmail: email });

            if (!currentUser) {
                console.log('email not found');
                throw new Error('email not existed');
            }

            const passwordMatched = bcrypt.compareSync(password, currentUser.userPassword);

            if (!passwordMatched) {
                console.log('password wrong');
                throw new Error('password wrong');
            }

            //generate token
            // const getUser = currentUser.toObject();
            const accessToken = generateToken({
                userId: currentUser._id,
                email: currentUser.userEmail,
                tokenType: 'AT'
            }, 'AT');

            const refreshToken = generateToken({
                userId: currentUser._id,
                userEmail: currentUser.userEmail,
                tokenType: 'RT'
            }, 'RT');

            //response
            res.status(200).send({
                message: 'login success',
                userEmail: currentUser.userEmail,
                user: currentUser.userName,
            });
        } catch (error) {
            res.status(500).json({ message: 'error' });
        }
    },

    //get user info
    getUserInfo: async (req, res) => {
        try {
            const { userId } = req.params;
            const currentUser = await UserModel.findById(userId, {
                userPassword: 0,
                salt: 0
            });
            res.status(200).send({
                data: currentUser,
                message: 'get user info success',
                success: true
            })
        } catch (error) {
            res.status(401).send({
                data: null,
                message: error.message,
            });
        }
    },

    //update user

    updateUserInfo: async (req, res) => {
        try {
            const { userId } = req.params;

            const currentUser = await UserModel.findById(userId);
            if (!currentUser) throw new Error('user ko ton tai');

            const { name, email, password } = req.body;
            const user = req.user;
            const updatedUser = await UserModel.findByIdAndUpdate({
                _id: userId,
            }, {
                name,
                email,
                password,
            });

            console.log('updating');
            res.status(200).send({
                data: updatedUser,
                message: 'success'
            });

        } catch (error) {

            console.error(error);
            res.status(500).send({
                message: "update fail",
            })
        }
    },


};

export default userController;

