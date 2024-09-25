import request from "supertest";
import app from "./app";
import db from "./db";

beforeAll(async function () {
    await db.connect();
});
  
afterAll(async function () {
    await db.end();
});

test("not found for site 404", async function() {
    const resp = await request(app).get("/no-such-path");
    expect(resp.statusCode).toEqual(404);
});

test("not found for site 404 (test stack print)", async function () {
    process.env.NODE_ENV = "";
    const resp = await request(app).get("/no-such-path");
    expect(resp.statusCode).toEqual(404);
    delete process.env.NODE_ENV;
});