import { Strategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Request, Response } from 'express';

import { User } from '../Models/user';

export class Auth {
    signup = async (req: Request, res: Response) => {

        try {
            const { username, email, password } = req.body;
            const newUser = new User({ username, email, password });
            await newUser.save();
            res.json({
                success: true,
                message: "create new user"
            });
        } catch (e) {
            res.status(400).json({
                error: e
            });
        }
    }

    login(): Strategy {
        return new Strategy({
            usernameField: "email",
            passwordField: "password",
            session: false,
            passReqToCallback: true
        }, async (req: Request, email: string, password: string, done: Function) => {
            try {
                const user = await User.findOne({ email });
                if (!user) throw "Email not found";
                const isValidPassword: boolean = await user.comparePassword(password);
                if (!isValidPassword) throw "Incorrect password";
                done(null, user);
            } catch (e) {
                if (e === "Email not found" || e === "Incorrect password") {
                    done(null, false, { message: e });
                } else {
                    done(e);
                }
            }
        });
    }

    isAuthentic(): JWTStrategy {
        return new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, async (payload, done) => {
            try {
                const user = await User.findById(payload._id);
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (e) {
                done(e);
            }
        });
    }
}