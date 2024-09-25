import db from "../db";
import { NotFoundError } from "../expressError";
import Todo from "./todo";
import {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} from "../models/_testCommon";

// Setup and Cleanup for User/Author authorization as DB is queried
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function() {
    const newTodo = {
        name: "testTodo",
        userId: 1,
        categoryId: 5
    };
    test("works", async function() {
        const todo = await Todo.create(newTodo);
        expect(todo).toHaveProperty('categoryId', 5);
        const result = await db.query(
            `SELECT name, user_id AS "userId", category_id AS "categoryId"
             FROM todos
             WHERE id=$1`,
            [todo.id]
        );
        expect(result.rows[0]).toEqual(newTodo);
    })
});