"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const todo_1 = require("../Models/todo");
class TodoController {
    constructor() {
        this.getTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (req.user) {
                    const { _id: author } = req.user;
                    const todo = yield todo_1.Todo.findOne({ _id: id, author }).select("completed author title description createdAt completedAt");
                    if (!todo) {
                        throw `invalid id ${id}`;
                    }
                    res.json({
                        success: true,
                        todo
                    });
                }
            }
            catch (e) {
                if (e === `invalid id ${id}`) {
                    res.status(400).json({
                        success: false,
                        error: e
                    });
                }
                else {
                    res.status(400).json();
                }
            }
        });
        this.createNewTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { _id } = req.user;
                    const { title, description } = req.body;
                    const newTodo = new todo_1.Todo({ title, description, author: _id });
                    const todo = yield newTodo.save();
                    res.json({
                        success: true,
                        todo
                    });
                }
                else {
                    throw "";
                }
            }
            catch (e) {
                res.status(400).json();
            }
        });
        this.updateTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (req.user) {
                    const { id: author } = req.user;
                    const { completed } = req.body;
                    const date = new Date().toISOString();
                    const todo = yield todo_1.Todo.findOneAndUpdate({ author, _id: id }, { $set: { completedAt: date, completed } }, { new: true }).select("completed author title description createdAt completedAt");
                    if (!todo)
                        throw `invalid id ${id}`;
                    res.json({
                        success: true,
                        todo
                    });
                }
            }
            catch (e) {
                if (e === `invalid id ${id}`) {
                    res.status(400).json({
                        success: false,
                        error: e
                    });
                }
                else {
                    res.status(400).json({
                        success: false
                    });
                }
            }
        });
        this.deleteTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (req.user) {
                    const { _id: author } = req.user;
                    const todo = yield todo_1.Todo.findOneAndRemove({ author, _id: id }).select("completed author title description createdAt completedAt");
                    if (!todo) {
                        throw `invalid id ${id}`;
                    }
                    res.json({
                        success: true,
                        todo
                    });
                }
            }
            catch (e) {
                if (e === `invalid id ${id}`) {
                    res.status(400).json({
                        success: false,
                        error: e
                    });
                }
                else {
                    res.status(400).json();
                }
            }
        });
    }
    getAllTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { _id } = req.user;
                    const todos = yield todo_1.Todo.find({ author: _id }).select("completed author title description createdAt completedAt");
                    res.json({
                        success: true,
                        todos
                    });
                }
                else {
                    throw "";
                }
            }
            catch (e) {
                res.status(400).json();
            }
        });
    }
}
exports.TodoController = TodoController;
