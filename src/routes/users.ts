/** Routes for users */

import jsonschema from "jsonschema";
import express from "express";
import User from "../models/user";
import { ensureCorrectUser } from "../middleware/auth";
import userUpdateSchema from "../schemas/userUpdate.json";
import { BadRequestError } from "../expressError";

const router = express.Router();

/** GET / [userId] => { user }
 *  Where user is: { id, username, score }
 * 
 * Authorization required: Correct user
*/
router.get("/:userId", ensureCorrectUser, async function(req, res, next) {
    try {
        const { userId } = req.params;
        const user = await User.getById(+userId);
        return res.json({ user });
    } catch(err) {
        return next(err);
    }
});

/** PATCH / [userId] => { updatedUser }
 * Where user is: { id, username }
 * 
 * Updates user. Fields can include { username, password }
 * 
 * Authorization required: Correct user
*/
router.patch("/:userId", ensureCorrectUser, async function(req, res, next) {
    try {
        const { userId } = req.params;
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs.join("\n"));
        }
        const user = await User.update(+userId, req.body);
        return res.json({ user });
    } catch(err) {
        return next(err);
    }
});

/** DELETE / [userId] => { deleted: id } 
 * Deletes user and returns success message
 * 
 * Authorization required: Correct user
*/
router.delete("/:userId", ensureCorrectUser, async function(req, res, next) {
    try {
        const { userId } = req.params;
        await User.remove(+userId);
        return res.json({ deleted: +userId });
    } catch(err) {
        return next(err);
    }
});

export default router;