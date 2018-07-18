"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const helmet = require("helmet");
const expressValidator = require("express-validator");
const bodyParser = __importStar(require("body-parser"));
const auth_1 = require("./Authentication/auth");
const validation_1 = require("./Validation/validation");
const auth_controller_1 = require("./Controller/auth.controller");
const todo_controller_1 = require("./Controller/todo.controller");
class App {
    constructor() {
        this.app = express();
        this.auth = new auth_1.Auth();
        this.validator = new validation_1.Validation;
        this.authController = new auth_controller_1.AuthController();
        this.todoController = new todo_controller_1.TodoController();
        this.config();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(expressValidator());
        this.app.use(helmet());
        this.app.use(passport.initialize());
        passport.use("login", this.auth.login());
        passport.use("jwt", this.auth.isAuthentic());
        this.connectDb();
        this.setupRoutes();
    }
    connectDb() {
        if (process.env.NODE_ENV === "test") {
            if (process.env.MONGODB_URI_TEST) {
                mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true });
            }
        }
        else {
            if (process.env.MONGODB_URI) {
                mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
            }
        }
    }
    setupRoutes() {
        this.app.post("/signup", this.validator.signup, this.auth.signup);
        this.app.post("/login", this.validator.login, this.authController.login(passport));
        this.app.get("/todos", passport.authenticate("jwt", { session: false }), this.todoController.getAllTodos);
        this.app.post("/todo", passport.authenticate("jwt", { session: false }), this.validator.createTodo, this.todoController.createNewTodo);
        this.app.route("/todo/:id")
            .get(passport.authenticate("jwt", { session: false }), this.todoController.getTodo)
            .put(passport.authenticate("jwt", { session: false }), this.validator.updateTodo, this.todoController.updateTodo)
            .delete(passport.authenticate("jwt", { session: false }), this.todoController.deleteTodo);
    }
}
exports.default = new App().app;
