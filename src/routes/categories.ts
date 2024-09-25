/** Routes for categories */

import jsonschema from "jsonschema";
import express from "express";
import Category from "../models/category";
import { ensureLoggedIn } from "../middleware/auth";

const router = express.Router();

/** GET / => [ { category }, ... ]
 * Where category is { id, name }
 * 
 * Authorization required: logged in user
 */
router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const categories = await Category.getAll();
        return res.json({ categories });
    } catch(err) {
        return next(err);
    }
});

/** GET / [categoryId] => { category }
 * Where category is { id, name }
 * 
 * Authorization required: logged in user
 */
router.get("/:categoryId", ensureLoggedIn, async function(req, res, next) {
    try {
        const { categoryId } = req.params;
        const category = await Category.getById(+categoryId);
        return res.json({ category });
    } catch(err) {
        return next(err);
    }
});

export default router;