import UserModel from "../models/users.js";
import { generateToken, verifyToken } from "../middlewares/token.js";
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
                userName: userName,
                userEmail: userEmail,
                userPassword: hash,
                salt: salt,

            });

            await newUser.save();
            res.status(200).send({
                data: newUser,
                message: 'dang ki thanh cong'
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'dang ki loi' })
        }
    },

    //login

    logIn: async (req, res) => {
        try {
            const { userEmail, userPassword } = req.body;
            const currentUser = await UserModel.findOne({ userEmail: userEmail });

            if (!currentUser) {
                console.log('email not found');
                throw new Error('email not existed');
            }

            const passwordMatched = bcrypt.compareSync(userPassword, currentUser.userPassword);

            if (!passwordMatched) {
                console.log('password wrong');
                throw new Error('password wrong');
            }

            // tao access token
            const accessToken = generateToken(
                {
                    userId: currentUser._id,
                    email: currentUser.userEmail,
                    tokenType: 'AT'
                },
                'AT'
            );

            // tao refresh token
            const refreshToken = generateToken(
                {
                    userId: currentUser._id,
                    userEmail: currentUser.userEmail,
                    tokenType: 'RT'
                },
                'RT'
            );

            req.user = currentUser;
            await currentUser.save();
            console.log(currentUser);

            //response
            res.status(200).send({
                message: 'Đăng nhập thành công',
                data: {
                    accessToken,
                    refreshToken,
                    userEmail: currentUser.userEmail,
                    userName: currentUser.userName
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'dang nhap that bai' });
        }
    },

    //dang xuat

    logOut: async (req, res) => {
        try {
            const currentUser = req.user;
            console.log(currentUser);

            if (!currentUser) {
                throw new Error('User not existed');
            }

            res.status(401).send({
                message: "dang xuat thanh cong",
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'logout fail',
            })
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

