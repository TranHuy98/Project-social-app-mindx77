import { verifyToken } from "./token.js";

const authentication = {
    verifyAccessToken: (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) throw new Error('Cannot access');

            const token = authHeader.split(' ')[1];
            const data = verifyToken(token, "AT");

            req.user = data;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({
                message: "Verify fail",
            });
        }
    },
    validateSignUp: (req, res, next) => {
        try {
            const {userName, userEmail, userPassword } = req.body;
            if (!userEmail) throw new Error('Thiếu email!');
            if (userEmail) {
                const formatEmail = String(userEmail)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
                if (!formatEmail) throw new Error('Email không đúng định dạng!');
            }
            if (!userPassword) throw new Error('Thiếu password!');
            if (!userName) throw new Error('Thiếu userName!');
            next();
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            })
        }
    },
    validateLogIn: (req, res, next) => {
        try {
            const { userEmail, userPassword } = req.body;
            if (!userEmail) throw new Error('Thiếu email!');
            if (userEmail) {
                const formatEmail = String(userEmail)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
                if (!formatEmail) throw new Error('Email không đúng định dạng!');
            }
            if (!userPassword) throw new Error('Thiếu password!');
            next();
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            });
        }
    },
};

export default authentication;