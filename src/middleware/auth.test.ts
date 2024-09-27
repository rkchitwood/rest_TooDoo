import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../expressError";
import { 
    authenticateJWT,
     ensureLoggedIn, 
     ensureCorrectUser, 
     ensureAuthor 
    } from "./auth";

import { SECRET_KEY } from "../config";
const testJwt = jwt.sign({ id: 1, username: "test" }, SECRET_KEY);
const badJwt = jwt.sign({ id: 1, username: "test" }, "NOT_SECRET_KEY");
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

describe("authenticateJWT", function () {
    test("works: via header", function () {
        expect.assertions(2);
        const req = { 
            headers: { authorization: `Bearer ${testJwt}` } 
        } as Partial<Request>;
        const res = { 
            locals: {} 
        } as Partial<Response>;
        const next: NextFunction = function (err?: any) {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req as Request, res as Response, next);
        expect(res.locals).toEqual({
            user: {
                iat: expect.any(Number),
                id: 1,
                username: "test"
            },
        });
    });
  
    test("works: no header", function () {
        expect.assertions(2);
        const req = {} as Partial<Request>;
        const res = { locals: {} } as Partial<Response>;
        const next: NextFunction = function (err?: any) {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req as Request, res as Response, next);
        expect(res.locals).toEqual({});
    });
  
    test("works: invalid token", function () {
        expect.assertions(2);
        const req = { 
            headers: { authorization: `Bearer ${badJwt}` } 
        } as Partial<Request>;
        const res = { locals: {} } as Partial<Response>;
        const next: NextFunction = function (err: any) {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req as Request, res as Response, next);
        expect(res.locals).toEqual({});
    });
});

describe("ensureLoggedIn", function () {
    test("works", function () {
        expect.assertions(1);
        const req = {} as Partial<Request>;
        const res = { 
            locals: { user: { id: 1, username: "test" } } 
        } as Partial<Response>;
        const next: NextFunction = function (err?: any) {
            expect(err).toBeFalsy();
        };
        ensureLoggedIn(req as Request, res as Response, next);
    });
  
    test("unauth if no login", function () {
        expect.assertions(1);
        const req = {} as Partial<Request>;
        const res = { locals: {} } as Partial<Response>;
        const next: NextFunction = function (err?: any) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        ensureLoggedIn(req as Request, res as Response, next);
    });
});

describe("ensureAuthor", function () {
    test("works - matching ID", async function () {        
        // todo 1 in DB: { id: 1, user_id: 1 ... }

        expect.assertions(1);
        const req = { params: { todoId: "1" } } as Partial<Request>;
        const res = { 
            locals: { user: { id: 1, username: "user1" } } 
        } as Partial<Response>;
        const next: NextFunction = function (err?: any) {
            expect(err).toBeFalsy();
        };
        await ensureAuthor(req as Request, res as Response, next);
    });
    test("unauth if mismatch", async function () {
        // todo 2 in DB: { id: 2, user_id: 2 ... }

        expect.assertions(1);
        const req = { params: { todoId: "2" } } as Partial<Request>;
        const res = { 
            locals: { user: { id: 1, username: "user1" } } 
        } as Partial<Response>;
        const next: NextFunction = function (err?: any) {
            expect(err).toBeTruthy();
        };
        await ensureAuthor(req as Request, res as Response, next);
    })
});

describe("ensureCorrectUser", function () {
    test("works - matching ID", async function () {
        expect.assertions(1);
        const req = { params: { userId: "1" } } as Partial<Request>;
        const res = { 
            locals: { user: { id: 1, username: "user1" } } 
        } as Partial<Response>;
        const next: NextFunction = function (err?: any) {
            expect(err).toBeFalsy();
        };
        await ensureCorrectUser(req as Request, res as Response, next);
    });

    test("unauth if mismatch", async function () {
        expect.assertions(1);
        const req = { params: { userId: "2" } } as Partial<Request>;
        const res = { 
            locals: { user: { id: 1, username: "user1" } } 
        } as Partial<Response>;
        const next: NextFunction = function (err?: any) {
            expect(err).toBeTruthy();
        };
        await ensureCorrectUser(req as Request, res as Response, next);
    });
});