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

describe("GET /users/:userId", function() {
    test("works", async function() {
        const resp = await request(app)
            .get("/users/1")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({
            user: {
                id: 1,
                username: "user1",
                score: 1
            }
        });
    });
    
    test("unauth if mismatch", async function() {
        const resp = await request(app)
            .get("/users/2")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(401);
    });
});

describe("PATCH /users/:userId", function() {
    test("works", async function() {
        const resp = await request(app)
            .patch(`/users/1`)
            .send({
                username: "user1NEW",
            })
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({
            user: {
                id: 1,
                username: "user1NEW"
            }
        })
    });

    test("unauth if mismatch", async function() {
        const resp = await request(app)
            .patch(`/users/2`)
            .send({
                username: "user2NEW",
            })
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request on bad data", async function() {
        const resp = await request(app)
            .patch(`/users/1`)
            .send({
                fakeField: "randomstuff",
            })
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

describe("DELETE /users/:userId", function() {
    test("works", async function() {
        const resp = await request(app)
            .delete(`/users/1`)
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({ deleted: 1 });
    });

    test("unauth if mismatch", async function() {
        const resp = await request(app)
            .delete(`/users/u1`)
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.statusCode).toEqual(401);
    });
});