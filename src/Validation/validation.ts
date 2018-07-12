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

}