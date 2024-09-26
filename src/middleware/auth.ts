/** Middleware to handle common authorization cases from routes */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { UnauthorizedError } from "../expressError";
import Todo from "../models/todo";

/** Middleware: authenticate user
 * 
 * If a token is provided, verify it and store on res.locals if valid.
 * Not an error for none or invalid
 */
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch(err) {
        return next();
    }
}

/** Middleware: ensure user is logged in
 * 
 * Raises Unauthorized Error if not
 */
function ensureLoggedIn(req: Request, res: Response, next: NextFunction) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch(err) {
        return next(err);
    }
}

/** Middleware: ensure user is author of todo in params
 * 
 * Raises Unauthorized Error if not
 */
async function ensureAuthor(req: Request, res: Response, next: NextFunction) {
    try {
        const { todoId } = req.params;
        const todo = await Todo.getById(+todoId);
        if (!res.locals.user || todo.userId !== res.locals.user.id) throw new UnauthorizedError();
        return next();
    } catch(err) {
        return next(err);
    }
}

/** Middleware: ensure logged in user matches user in params
 * 
 * Raises Unauthorized Error if not
 */
async function ensureCorrectUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = res.locals.user;
        if(!user || user.id !== +req.params.userId)  throw new UnauthorizedError();
        return next();
    } catch(err) {
        return next(err);
    }
}

export {
    authenticateJWT,
    ensureLoggedIn,
    ensureAuthor,
    ensureCorrectUser
};
