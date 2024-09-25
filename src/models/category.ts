import db from "../db";
import { NotFoundError } from "../expressError";
import { CategoryInterface } from "../interfaces/CategoryInterface";

/** SQL/JS abstraction functions for categories.
 * 
 * Only READ supported for pre-created categories.
 */
class Category {

    /** Retrieves all categories from DB */
    static async getAll(): Promise<CategoryInterface[]> {
        const result = await db.query(
            `SELECT id, name
             FROM categories`
        );
        return result.rows;
    }

    /** Fetch category by ID */
    static async getById(id: number): Promise<CategoryInterface> {
        const result = await db.query(
            `SELECT id, name
             FROM categories
             WHERE id=$1`,
            [id]
        );
        const cat = result.rows[0];
        if (!cat) throw new NotFoundError("No category found");
        return cat;
    }
}

export default Category;