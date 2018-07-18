"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
class AuthController {
    login(passport) {
        return (req, res, next) => {
            passport.authenticate("login", (err, user, info) => {
                if (err) {
                    return res.status(400).json(err);
                }
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        errors: info.message
                    });
                }
                let token = null;
                if (process.env.JWT_SECRET) {
                    token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
                }
                const { email, username } = user;
                res.json({
                    token: token,
                    user: {
                        email,
                        username
                    }
                });
            })(req, res, next);
        };
    }
}
exports.AuthController = AuthController;
