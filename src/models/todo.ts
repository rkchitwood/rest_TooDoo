import db from "../db";
import { NotFoundError } from "../expressError";
import sqlForPartialUpdate from "../helpers/sql";
import { TodoUpdateInterface } from "../interfaces/TodoInterface";
import { TodoInterface } from "../interfaces/TodoInterface";

/** SQL/TS abstraction functions for todos.
 * 
 * Contains full CRUD functionality.
 */
class Todo {

    /** Create a todo from data, update db and return company
     * 
     * { name, userId, categoryId } => { id, name, userId, categoryId, completeDate }
     */
    static async create ({name, userId, categoryId}: TodoInterface): Promise<TodoInterface> {
        const result = await db.query(
            `INSERT INTO todos
             (name, user_id, category_id)
             VALUES ($1, $2, $3)
             RETURNING id, name, user_id AS "userId", category_id AS "categoryId", complete_date AS "completeDate"`,
            [name, userId, categoryId]
        );
        const todo = result.rows[0];
        return todo;
    }

    /** Get todo via todo ID
     * 
     * Includes additional information by joining users and categories
     * 
     * { id } => { id, name, userId, categoryId, completeDate, userUsername, categoryName }
     */
    static async getById(id: number): Promise<TodoInterface> {
        const result = await db.query(
            `SELECT t.id AS "id",
                    t.name AS "name",
                    t.user_id AS "userId",
                    t.category_id AS "categoryId",
                    t.complete_date AS "completeDate",
                    u.username AS "userUsername",
                    c.name AS "categoryName"
                FROM todos t 
                JOIN users u 
                    ON t.user_id=u.id
                JOIN categories c
                    ON t.category_id=c.id
                WHERE t.id=$1`,
            [id]
        );
        const todo = result.rows[0];
        if (!todo) throw new NotFoundError("No todo found");
        return todo;
    }

    /** Get all incomplete todos for a user via userId  
     * 
     * Includes additional information by joining users and categories
     * 
     * { userId } => [ { id, name, userId, categoryId, completeDate, userUsername, categoryName }, ... ]
     */
    static async getUserTodos(userId: number): Promise<TodoInterface[]> {
        const userCheck = await db.query(
            `SELECT id
                FROM users
                WHERE id=$1`,
            [userId]
        );
        const user = userCheck.rows[0];
        if (!user) throw new NotFoundError("no user found");

        const result = await db.query(
            `SELECT t.id AS "id",
                    t.name AS "name",
                    t.user_id AS "userId",
                    t.category_id AS "categoryId",
                    t.complete_date AS "completeDate",
                    u.username AS "userUsername",
                    c.name AS "categoryName"
                FROM todos t 
                JOIN users u 
                    ON t.user_id=u.id
                JOIN categories c
                    ON t.category_id=c.id
                WHERE t.user_id=$1 AND t.complete_date IS NULL`,
            [userId]
        );
        const todos = result.rows;
        return todos;
    }

    /** Get all historical (completed) todos for a user  via userId
     * 
     * Includes additional information by joining users and categories
     * 
     * { userId } => [ { id, name, userId, categoryId, completeDate, userUsername, categoryName }, ... ]
    */
    static async getCompletedUserTodos(userId: number): Promise<TodoInterface[]> {
        const userCheck = await db.query(
            `SELECT id
                FROM users
                WHERE id=$1`,
            [userId]
        );
        const user = userCheck.rows[0];
        if (!user) throw new NotFoundError("no user found");

        const result = await db.query(
            `SELECT t.id AS "id",
                    t.name AS "name",
                    t.user_id AS "userId",
                    t.category_id AS "categoryId",
                    t.complete_date AS "completeDate",
                    u.username AS "userUsername",
                    c.name AS "categoryName"
                FROM todos t 
                JOIN users u 
                    ON t.user_id=u.id
                JOIN categories c
                    ON t.category_id=c.id
                WHERE t.user_id=$1 AND t.complete_date IS NOT NULL`,
            [userId]
        );
        const todos = result.rows;
        return todos;
    }

    /** Update todo data with data
     * 
     * Allows for partial update of possible data:
     * { name, categoryId, completeDate } => { id, name, userId, categoryId, completeDate }
    */
    static async update(id: number, data: TodoUpdateInterface): Promise<TodoInterface> {
        const { sqlSetCols, values } = sqlForPartialUpdate(
            data,
            {
                categoryId: "category_id",
                completeDate: "complete_date"
            }
        );
        const idIdx = "$" + (values.length + 1);
        const sqlQuery = `UPDATE todos
                          SET ${sqlSetCols}
                          WHERE id=${idIdx}
                          RETURNING id,
                                    name,
                                    user_id AS "userId",
                                    category_id AS "categoryId"
                                    complete_date AS "completeDate"`;
        const result = await db.query(sqlQuery, [...values, id]);
        const todo = result.rows[0];
        if (!todo) throw new NotFoundError("No todo found");
        return todo;
    }   

    /** Delete a given todo via ID from the database. Returns undefined */
    static async remove(id: number) {
        const result = await db.query(
            `DELETE
             FROM todos
             WHERE id=$1
             RETURNING id`,
            [id]
        );
        const todo = result.rows[0];
        if(!todo) throw new NotFoundError("No company found");
    }
}

export default Todo;