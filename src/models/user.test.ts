import db from "../db";
import User from "./user";

import {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} from "../models/_testCommon";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../expressError";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("authenticate", function() {
    test("works", async  function() {
        const user = await User.authenticate("user1", "password1");
        expect(user).toEqual({
            id: 1,
            username: "user1"
        });
    });

    test("unauth if no user", async function() {
        try {
            await User.authenticate("bad", "attempt");
            fail();
        } catch(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    test("unauth if wrong password", async function() {
        try {
            await User.authenticate("user1", "HACKS");
            fail();
        } catch(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });
});

describe("register", function() {
    test("works", async function() {
        const user = await User.register("user3", "password3");
        expect(user).toEqual({
            id: 3,
            username: "user3"
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'user3'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("bad request with dupe username", async function() {
        try {
            await User.register("user1", "notgonnawork");
            fail()
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

describe("getById", function() {
    test("works", async function() {
        const user = await User.getById(1);
        expect(user).toEqual({
            id: 1,
            username: "user1",
            score: 1
        });
    });

    test("not found if no user", async function() {
        try {
            await User.getById(0);
            fail();
        } catch(err) {
            expect (err instanceof NotFoundError).toBeTruthy();
        }
    });
});

describe("update", function() {
    test("works", async function() {
        const user = await User.update(1, { password: "newPassword" });
        expect(user).toEqual({
            id: 1,
            username: "user1"
        });
    });
    test("not found if no user", async function() {
        try {
            await User.update(0, { username: "fakename" });
            fail();
        } catch(err) {
            expect (err instanceof NotFoundError).toBeTruthy();
        }
    });
    test("bad request if no data", async function() {
        try {
            await User.update(1, {});
            fail();
        } catch(err) {
            expect (err instanceof BadRequestError).toBeTruthy();
        }
    });
});

describe("remove", function() {
    test("works", async function() {
        await User.remove(1);
        const res = await db.query(
        "SELECT id FROM users WHERE id=1");
        expect(res.rows.length).toEqual(0);
    });
    test("not found if no user", async function() {
        try {
            await User.remove(0);
            fail();
        } catch(err) {
            expect (err instanceof NotFoundError).toBeTruthy();
        }
    });
});