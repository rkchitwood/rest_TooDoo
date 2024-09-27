/** Authentication routes */

import jsonschema from "jsonschema";

import User from "../models/user";
import express from "express";
import createToken from "../helpers/tokens";
import userAuthSchema from "../schemas/userAuth.json";
import userRegisterSchema from "../schemas/userRegister.json";
import { BadRequestError } from "../expressError";

const router = express.Router();

/** POST /auth/token: { username, password } => { JWT, user }
 * 
 * Returns a JWT token with User
*/
router.post("/token", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs.join("\n"));
        }
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token })
    } catch(err) {
        return next(err);
    }
});

/** POST /auth/register: { username, password } => { JWT, newUser }
 * 
 * Returns a JWT token with User
 */
router.post("/register", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs.join("\n"));
        }
        const { username, password } = req.body;
        const newUser = await User.register(username, password);
        const token = createToken(newUser);
        return res.status(201).json({ token });;
    } catch(err) {
        return next(err);
    }
});

export default router;