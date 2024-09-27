import request from "supertest";
import app from "../app";
import {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    user1Token
} from "../models/_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /todos", function() {
    const newTodo = {
        name: "todo4",
        categoryId: 1
    };

    test("works", async function() {
        const resp = await request(app)
            .post("/todos")
            .send(newTodo)
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            todo: {
                id: 4,
                name: "todo4",
                userId: 1,
                categoryId: 1,
                completeDate: null
            }
        });
    });

    test("bad request with missing data", async function() {
        const resp = await request(app)
            .post("/todos")
            .send({ name: "onlyName"})
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("unauthorized if anon", async function() {
        const resp = await request(app)
            .post("/todos")
            .send(newTodo);
        expect(resp.statusCode).toEqual(401);
    });
});

describe("GET /todos", function() {
    test("works", async function() {
        const resp = await request(app)
            .get("/todos")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({
            todos: [
                {
                    id: 1,
                    name: "todo1",
                    userId: 1,
                    categoryId: 3,
                    completeDate: null,
                    userUsername: "user1",
                    categoryName: "home"
                }
            ]
        });
    });

    test("unauthorized if anon", async function() {
        const resp = await request(app).get("/todos");
        expect(resp.statusCode).toEqual(401);
    });
});

describe("GET /todos/:todoId", function() {
    test("works", async function() {
        const resp = await request(app)
            .get("/todos/1")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({
            todo: {
                id: 1,
                name: "todo1",
                userId: 1,
                categoryId: 3,
                completeDate: null,
                userUsername: "user1",
                categoryName: "home"
            }
        });
    });

    test("unauthorized if not author", async function() {
        const resp = await request(app)
            .get("/todos/2")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if bad ID", async function() {
        const resp = await request(app).get("/todos/0");
        expect(resp.statusCode).toEqual(404);
    });
});

describe("GET /todos/history", function() {
    test("works", async function() {
        const resp = await request(app)
            .get("/todos/history")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({
            todos: [
                {
                    id: 3,
                    name: "done_todo",
                    userId: 1,
                    categoryId: 1,
                    completeDate: "2024-09-25T14:00:00.000Z",
                    userUsername: "user1",
                    categoryName: "personal"
                }
            ]
        });
    });

    test("unauthorized if anon", async function() {
        const resp = await request(app).get("/todos/history");
        expect(resp.statusCode).toEqual(401);
    });

});

describe("PATCH /todos/:todoId", function() {
    test("works", async function() {
        const resp = await request(app)
            .patch("/todos/1")
            .send({
                name: "todo1UPDATED"
            })
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({
            todo: {
                id: 1,
                name: "todo1UPDATED",
                userId: 1,
                categoryId: 3,
                completeDate: null
            }            
        });
    });
    test("not found if bad ID", async function() {
        const resp = await request(app)
            .patch("/todos/0")
            .send({
                name: "todo0UPDATED"
            })
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(404);
    })
    test("unauthorized if not author", async function() {
        const resp = await request(app)
            .patch("/todos/2")
            .send({
                name: "todo2UPDATED"
            })
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(401);
    });
});

describe("DELETE /todos/:todoId", function() {
    test("works", async function() {
        const resp = await request(app)
            .delete("/todos/1")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({ deleted: 1 })
    });
    test("not found if bad ID", async function() {
        const resp = await request(app)
            .delete("/todos/0")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(404);
    })
    test("unauthorized if not author", async function() {
        const resp = await request(app)
            .delete("/todos/2")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(401);
    });
});