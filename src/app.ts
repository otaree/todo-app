import * as dotenv from 'dotenv';
dotenv.config();
import express = require("express");
import mongoose = require("mongoose");
import passport = require('passport');
import helmet = require("helmet");
import expressValidator = require("express-validator");
import * as bodyParser from "body-parser";
import { Request, Response } from 'express';

import { Auth } from './Authentication/auth';
import { Validation } from './Validation/validation';
import { AuthController } from './Controller/auth.controller';

class App {
    app: express.Application;
    auth: Auth;
    validator: Validation;
    authController: AuthController;

    constructor() {
        this.app = express();
        this.auth = new Auth();
        this.validator = new Validation;
        this.authController = new AuthController();
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
        this.app.use(passport.authenticate("jwt", { session: false}));
        this.app.get("/protected", (req: Request, res: Response) => {
            res.json({
                success: true,
                message: "This is protected route."
            });
        });
    }
}

export default new App().app;