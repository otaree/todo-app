import * as dotenv from 'dotenv';
dotenv.config();
import express = require("express");
import mongoose = require("mongoose");
import passport = require('passport');
import helmet = require("helmet");
import expressValidator = require("express-validator");
import * as bodyParser from "body-parser";

import { Auth } from './Authentication/auth';
import { Validation } from './Validation/validation';
import { AuthController } from './Controller/auth.controller';
import { TodoController } from './Controller/todo.controller';

class App {
    app: express.Application;
    auth: Auth;
    validator: Validation;
    authController: AuthController;
    todoController: TodoController;

    constructor() {
        this.app = express();
        this.auth = new Auth();
        this.validator = new Validation;
        this.authController = new AuthController();
        this.todoController = new TodoController();
        this.config();
    }

    private config(): void {
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

    private connectDb(): void {
        mongoose.connect(process.env.MONGODB_URI || "",  { useNewUrlParser: true });
    }

    private setupRoutes(): void {
        this.app.post("/signup", this.validator.signup, this.auth.signup);
        this.app.post("/login", this.validator.login, this.authController.login(passport));
        this.app.get("/todos", passport.authenticate("jwt", { session: false}), this.todoController.getAllTodos);
        this.app.post("/todo", passport.authenticate("jwt", { session: false}), this.validator.createTodo, this.todoController.createNewTodo);
        this.app.route("/todo/:id")
            .get(passport.authenticate("jwt", { session: false }), this.todoController.getTodo)
            .put(passport.authenticate("jwt", { session: false }), this.validator.updateTodo, this.todoController.updateTodo)
            .delete(passport.authenticate("jwt", { session: false }), this.todoController.deleteTodo);
    }
}

export default new App().app;