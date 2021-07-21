const mongoose = require("mongoose");

const UserSchma = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", UserSchma);

module.exports = User;