import bcrypt from "bcrypt";
import db from "../db";
import { BCRYPT_WORK_FACTOR } from "../config";
import createToken from "../helpers/tokens";

async function commonBeforeAll() {
    // connect to DB
    await db.connect();

    // ensure test db clean
    await db.query("DELETE FROM todos");
    await db.query("DELETE FROM users");   
    
    // insert test users
    await db.query(
        `INSERT INTO users (id, username, password)
         VALUES (1, 'user1', $1),
                (2, 'user2', $2)`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR)
        ]
    );

    // increment sql serial primary number to avoid dupes
    await db.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`);

    // insert open test todos
    await db.query(
        `INSERT INTO todos (id,
                            name, 
                            user_id, 
                            category_id)
         VALUES ($1, $2, $3, $4),
                ($5, $6, $7, $8)`,
         [
            1, "todo1", 1, 3,
            2, "todo2", 2, 4
         ]
    );

    // insert completed test todo
    await db.query(
        `INSERT INTO todos (id, 
                            name, 
                            user_id, 
                            category_id, 
                            complete_date)
         VALUES ($1, $2, $3, $4, $5)`,
        [
            3, "done_todo", 1, 1, "2024-09-25 09:00:00-05"
        ]
    );

    // increment sql serial primary number to avoid dupes
    await db.query(`SELECT setval('todos_id_seq', (SELECT MAX(id) FROM todos));`);
}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}

const user1Token = createToken({ id: 1, username: "user1" })

export {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    user1Token
};