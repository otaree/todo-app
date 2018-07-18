import { Types } from 'mongoose';
import jwt = require("jsonwebtoken");



const userOneId = Types.ObjectId();
const userTwoId = Types.ObjectId();

let userOneToken: string;
let userTwoToken: string;

if (process.env.JWT_SECRET) {
    userOneToken = jwt.sign({ _id: userOneId.toHexString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
    userTwoToken = jwt.sign({ _id: userTwoId.toHexString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
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


const todoOneId = Types.ObjectId();
const todoTwoId = Types.ObjectId();

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



export { users, todos, userOneId, userTwoId, userOneToken, userTwoToken };