/** Routes for todos */

import jsonschema from "jsonschema";
import express from "express";
import Todo from "../models/todo";
import { ensureLoggedIn, ensureAuthor } from "../middleware/auth";
import todoNewSchema from "../schemas/todoNew.json";
import todoUpdateSchema from "../schemas/todoUpdate.json";
import { BadRequestError } from "../expressError";

const router = express.Router();

/** GET / history => [ { todo }, ... ]
 * Get all historical complete todos for a user where todo is:
 *  { id, name, userId, categoryId, completeDate, userUsername, categoryName }
 * 
 * Authorization required: logged in user
*/
router.get("/history", ensureLoggedIn, async function(req, res, next) {
    try {
        console.log("IN /HISTORY ==============================================")
        const { user } = res.locals;
        const todos = await Todo.getCompletedUserTodos(user.id);
        return res.json({ todos });
    } catch(err) {
        return next(err);
    }
});

/** POST / { todo } => { todo }
 * 
 * todo should be { name, categoryId }
 * 
 * Authorization required: logged in user
 */
router.post("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, todoNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs.join("\n"));
        }
        const { name, categoryId } = req.body;
        const { user } = res.locals;
        const todo = await Todo.create({name, userId: user.id, categoryId});
        return res.status(201).json({ todo });
    } catch(err) {
        return next(err);
    }
});

/** GET / => [ { todo }, ... ]
 * Get all incomplete todos for a user where todo is:
 *  { id, name, userId, categoryId, completeDate, userUsername, categoryName }
 * 
 * Authorization required: logged in user
*/
router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const { user } = res.locals;
        const todos = await Todo.getUserTodos(user.id);
        return res.json({ todos });
    } catch(err) {
        return next(err);
    }
});

/** GET / [todoId] => { todo } 
 * 
 * Returns additional information about a todo via its ID:
 * { id, name, userId, categoryId, completeDate, userUsername, categoryName }
 * 
 * Authorization required: logged in author of todo (ensureAuthor)
*/
router.get("/:todoId", ensureAuthor, async function(req, res, next) {
    try {
        const { todoId } = req.params;
        const todo = await Todo.getById(+todoId);
        return res.json({ todo });
    } catch(err) {
        return next(err);
    }
});



/** PATCH /[todoId] { dataToUpdate } => { updatedTodo } 
 * Update todo. Fields can include:
 *  { name, categoryId, completeDate }
 *  Returns { id, name, userId, categoryId, completeDate }
 * 
 * Authorization required: logged in author of todo (ensureAuthor)
*/
router.patch("/:todoId", ensureAuthor, async function(req, res, next) {
    try {
        const { todoId } = req.params;
        const validator = jsonschema.validate(req.body, todoUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs.join("\n"));
        }
        const todo = await Todo.update(+todoId, req.body);
        return res.json({ todo });
    } catch(err) {
        return next(err);
    }
});

/** DELETE / [todoId] => { deleted: id } 
 * Deletes a todo and returns success message
 * 
 * Authorization required: logged in author of todo (ensureAuthor)
*/
router.delete("/:todoId", ensureAuthor, async function(req, res, next) {
    try {
        const { todoId } = req.params;
        await Todo.remove(+todoId);
        return res.json({ deleted: +todoId });
    } catch(err) {
        return next(err);
    }
});

export default router;