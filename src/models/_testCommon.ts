import bcrypt from "bcrypt";
import db from "../db";
import { BCRYPT_WORK_FACTOR } from "../config";

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

    // insert test todos
    await db.query(
        `INSERT INTO todos (name, 
                            user_id, 
                            category_id,
                            id)
         VALUES ($1, $2, $3),
         VALUES ($4, $5, $6)`,
         [
            "todo1", 1, 3,
            "todo2", 2, 4
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

export {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
};