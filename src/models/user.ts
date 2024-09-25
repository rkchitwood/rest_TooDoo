import db from "../db";
import bcrypt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../config";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../expressError";
import { UserInterface } from "../interfaces/UserInterface";
import sqlForPartialUpdate from "../helpers/sql";

/** SQL/TS abstraction functions for users.
 * 
 * Contains full CRUD functionality.
 */

class User {

    /** Authenticate user from username & password
     * 
     * Returns an instance of user (without password)
     * { id, username }
     * 
     * Raises UnauthorizedError if invald.
     */
    static async authenticate(username: string, password: string): Promise<UserInterface> {
        const result = await db.query(
            `SELECT id,
                    username,
                    password
                FROM users
                WHERE username=$1`,
            [username]
        );
        const user = result.rows[0];
        if (user) {
            const authorized = await bcrypt.compare(password, user.password);
            if (authorized === true) {
                delete user.password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user via username & password
     * 
     * Returns an instance of user (without password)
     * { id, username }
     * 
     * Raises BadRequestError on duplicates
     */
    static async register(username: string, password: string): Promise<UserInterface> {
        const dupe = await db.query(
            `SELECT username
             FROM users
             WHERE username=$1`,
            [username]
        );
        if (dupe.rows[0]) throw new BadRequestError("duplicate email");

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (username, password)
                VALUES ($1, $2)
                RETURNING id, username`,
            [username, hashedPassword]
        );
        const user = result.rows[0];
        return user;
    }

    /** Get user by ID.
     * Includes a user's "score" => # of completed todos
     * 
     * { id, username, score }
     */
    static async getById(id: number) : Promise<UserInterface>{
        const userRes = await db.query(
            `SELECT id, username
             FROM users
             WHERE id=$1`,
            [id]
        );
        const user = userRes.rows[0];
        if (!user) throw new NotFoundError("No user found");

        const scoreRes = await db.query(
            `SELECT COUNT(*)
             FROM users u
                JOIN todos t
                    ON u.id=t.user_id
                WHERE u.id=$1 AND t.complete_date IS NOT NULL`,
            [id]
        );
        user.score = scoreRes.rows[0];
        return user;
    }

    /** Update user with any of acceptable data (partial update OK)
     * Data can include:
     *  { username, password }
     * 
     * Returns { id, username }
     * 
     * WARNING: This function can set a new password.
     * Callers of this function must be certain of proper
     * validation to avoid serious security risks.
    */
    static async update(userId: number, data: Partial<UserInterface>) : Promise<UserInterface>{
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }
        const { sqlSetCols, values } = sqlForPartialUpdate(data, {});
        const userIdIdx = "$" + (values.length + 1);
        const sqlQuery = `UPDATE users
                          SET ${sqlSetCols}
                          WHERE id=${userIdIdx}
                          RETURNING id, username`;
        const result = await db.query(sqlQuery, [...values, userId]);
        const user = result.rows[0];
        if (!user) throw new NotFoundError("No user found");
        return user;
    }


    /** Delete user from DB and returns undefined */
    static async remove(userId: number) {
        const result = await db.query(
            `DELETE
             FROM users
             WHERE id=$1
             RETURNING id`,
            [userId]
        );
        const user = result.rows[0];
        if (!user) throw new NotFoundError("No user found");
    }

}
export default User;