import db from "../db";
import { NotFoundError } from "../expressError";
import Todo from "./todo";
import {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} from "../models/_testCommon";

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
        expect(todo).toHaveProperty('userId', 1);
        expect(todo).toHaveProperty('name', 'testTodo');
        expect(todo).toHaveProperty('id');
        const result = await db.query(
            `SELECT name, user_id AS "userId", category_id AS "categoryId"
             FROM todos
             WHERE id=$1`,
            [todo.id]
        );
        expect(result.rows[0]).toEqual(newTodo);
    })
});

describe("getById", function() {
    test("works", async function() {
        const todo = await Todo.getById(1);
        expect(todo).toEqual({
            id: 1,
            name: "todo1",
            userId: 1,
            categoryId: 3,
            completeDate: null,
            userUsername: "user1",
            categoryName: "home"
        });
    });

    test("not found if bad ID", async function() {
        try {
            await Todo.getById(0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

describe("getUserTodos", function() {
    test("works", async function() {
        const todos = await Todo.getUserTodos(1);
        expect(todos.length).toEqual(1);
        expect(todos[0]).toEqual({
            id: 1,
            name: "todo1",
            userId: 1,
            categoryId: 3,
            completeDate: null,
            userUsername: "user1",
            categoryName: "home"
        });
    });

    test("not found if no user", async function() {
        try {
            await Todo.getUserTodos(0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }        
    });    
});

describe("getCompletedUserTodos", function() {
    test("works", async function() {
        const todos = await Todo.getCompletedUserTodos(1);
        expect(todos.length).toEqual(1);
        expect(todos[0]).toEqual({
            id: 3,
            name: "done_todo",
            userId: 1,
            categoryId: 1,
            completeDate: new Date("2024-09-25T14:00:00.000Z"),
            userUsername: "user1",
            categoryName: "personal"
        });
    });

    test("not found if no user", async function() {
        try {
            await Todo.getCompletedUserTodos(0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }        
    });   
});

describe("update", function() {
    const updateData = {
        name: "updated_todo",
        categoryId: 2
    }

    test("works", async function() {
        const todo = await Todo.update(3, updateData);
        expect(todo).toEqual({
            id: 3,
            name: "updated_todo",
            userId: 1,
            categoryId: 2,
            completeDate: new Date("2024-09-25T14:00:00.000Z")
        });
    });

    test("not found if no todo", async function() {
        try {
            await Todo.update(0, updateData);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});