import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    userEmail: {
        type: String,
    },
    userPassword: {
        type: String,
        require: true,
    },
    salt: {
        type: String,
    }
});

const UserModel = mongoose.model('users', userSchema);

export default UserModel;