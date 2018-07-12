import {
    Request,
    Response,
    NextFunction
} from 'express';


export class Validation {
    login(req: Request, res: Response, next: NextFunction) {
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

    signup(req: Request, res: Response, next: NextFunction) {
        req.checkBody("username", "should be at least 4 character long").trim().isLength({ min: 4 });
        req.checkBody("email", "invalid email").trim().isEmail();
        req.checkBody("password", "Should be at least 6 character long").trim().isLength({
            min: 6
        }).equals(req.body.confirmPassword);
        req.sanitizeBody("email").trim();
        req.sanitizeBody("password").trim();
        req.sanitizeBody("username").trim();

        const errors = req.validationErrors();

        if (errors) {
            return res.json({
                success: false,
                errors
            });
        }

        next();
    }

    createTodo(req: Request, res: Response, next: NextFunction) {
        req.checkBody("title").trim().notEmpty().withMessage("Should not be empty").isLength({ min: 4 }).withMessage("Should at least be 4 character long");
        req.checkBody("description").trim().notEmpty().withMessage("Should not be empty").isLength({ min: 4 }).withMessage("Should at least be 4 character long");

        req.sanitizeBody("title").trim();
        req.sanitizeBody("description").trim();

        const errors = req.validationErrors();

        if (errors) {
            return res.json({
                success: false,
                errors
            });
        }

        next()
    }

    updateTodo(req: Request, res: Response, next: NextFunction) {
        req.checkBody("completed").isBoolean().withMessage("should be boolean");

        const errors = req.validationErrors();

        if (errors) {
            return res.json({
                success: false,
                errors
            });
        }
        next();
    }

}