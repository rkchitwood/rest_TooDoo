import request from "supertest";
import app from "../app";
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

describe("POST /auth/token", function () {
    test("works", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: "user1",
                password: "password1",
            });
        expect(resp.body).toEqual({
            "token": expect.any(String),
        });
    });

    test("unauth with non-existent user", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: "no-such-user",
                password: "hacks!",
            });
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth with wrong password", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: "user1",
                password: "hackerman",
            });
        expect(resp.statusCode).toEqual(401);
      });
    
    test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/auth/token")
        .send({
            username: "u1",
        });
        expect(resp.statusCode).toEqual(400);
    });
});

describe("POST /auth/register", function () {
    test("works for anon", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "user3",
                password: "password3"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            "token": expect.any(String),
        });
    });
  
    test("bad request with missing fields", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "new",
            });
        expect(resp.statusCode).toEqual(400);
    });
  
    test("bad request with duplicate data", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "user1",
                firstName: "newpassword"
            });
        expect(resp.statusCode).toEqual(400);
    });
  });