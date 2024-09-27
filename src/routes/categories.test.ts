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

describe("GET /categories", function() {
    test("works", async function() {
        const resp = await request(app)
            .get("/categories")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({
            categories:
                [
                    {
                        id: 1,
                        name: "personal"
                    },
                    {
                        id: 2,
                        name: "finance"
                    },
                    {
                        id: 3,
                        name: "home"
                    },
                    {
                        id: 4,
                        name: "errand"
                    },
                    {
                        id: 5,
                        name: "work"
                    }
                ]
        });
    });
    test("unauthorized if anon", async function() {
        const resp = await request(app).get("/categories");
        expect(resp.statusCode).toEqual(401);
    });
});

describe("GET /categories/:id", function() {
    test("works", async function() {
        const resp = await request(app)
            .get("/categories/1")
            .set("authorization", `Bearer ${user1Token}`);
        expect(resp.body).toEqual({
            category: {
                id: 1,
                name: "personal"
            }
        });
    });
    test("not found if bad ID", async function() {
        const resp = await request(app)
            .get("/categories/0")
            .set("authorization", `Bearer ${user1Token}`);
            expect(resp.statusCode).toEqual(404);
    });
    test("unauthorized if anon", async function() {
        const resp = await request(app).get("/categories/1");
        expect(resp.statusCode).toEqual(401);
    });
});