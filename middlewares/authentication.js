import { verifyToken } from "./token.js";

const authentication = {

    verifyAccessToken: (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) throw new Error('cannot access');

            const token = authHeader.split('')[1];
            const data = verifyToken(token, "AT");

            req.user = data;
            next();
        } catch (error) {
            console.error(error);
            res.status(404).send({
                message: "verify fail",
            });
        }
    },
}

export default authentication;