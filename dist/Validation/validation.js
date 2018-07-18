"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validation {
    login(req, res, next) {
        req.checkBody("email", "invalid email").trim().isEmail();
        req.checkBody("password", "Should be at least 6 character long").trim().isLength({
            min: 6
        });
        req.sanitizeBody("email").trim();
        req.sanitizeBody("password").trim();
        const errors = req.validationErrors();
        if (errors) {
            return res.json({
                success: false,
                errors
            });
        }
        next();
    }
    signup(req, res, next) {
        req.checkBody("username", "should be at least 4 character long").trim().isLength({ min: 4 });
        req.checkBody("email", "invalid email").trim().isEmail();
        req.checkBody("password").trim().isLength({
            min: 6
        }).withMessage("Should be at least 6 character long").equals(req.body.confirmPassword).withMessage("passwords dose not match");
        req.sanitizeBody("email").trim();
        req.sanitizeBody("password").trim();
        req.sanitizeBody("username").trim();
        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({
                success: false,
                errors
            });
        }
        next();
    }
    createTodo(req, res, next) {
        req.checkBody("title").trim().notEmpty().withMessage("Should not be empty").isLength({ min: 4 }).withMessage("Should at least be 4 character long");
        req.checkBody("description").trim().notEmpty().withMessage("Should not be empty").isLength({ min: 4 }).withMessage("Should at least be 4 character long");
        req.sanitizeBody("title").trim();
        req.sanitizeBody("description").trim();
        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({
                success: false,
                errors
            });
        }
        next();
    }
    updateTodo(req, res, next) {
        req.checkBody("completed").isBoolean().withMessage("should be boolean");
        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({
                success: false,
                errors
            });
        }
        next();
    }
}
exports.Validation = Validation;
