"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jwt = require("jsonwebtoken");
const userOneId = mongoose_1.Types.ObjectId();
exports.userOneId = userOneId;
const userTwoId = mongoose_1.Types.ObjectId();
exports.userTwoId = userTwoId;
let userOneToken;
exports.userOneToken = userOneToken;
let userTwoToken;
exports.userTwoToken = userTwoToken;
if (process.env.JWT_SECRET) {
    exports.userOneToken = userOneToken = jwt.sign({ _id: userOneId.toHexString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
    exports.userTwoToken = userTwoToken = jwt.sign({ _id: userTwoId.toHexString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
const users = [
    {
        _id: userOneId,
        username: "Test1",
        password: "password",
        email: "test1@test.com"
    },
    {
        _id: userTwoId,
        username: "Test2",
        password: "password",
        email: "test2@test.com"
    }
];
exports.users = users;
const todoOneId = mongoose_1.Types.ObjectId();
const todoTwoId = mongoose_1.Types.ObjectId();
const todos = [
    {
        _id: todoOneId,
        title: "Test Title 1",
        description: "Test Description 1",
        author: userOneId
    },
    {
        _id: todoTwoId,
        title: "Test Title 2",
        description: "Test Description 2",
        author: userTwoId
    }
];
exports.todos = todos;
