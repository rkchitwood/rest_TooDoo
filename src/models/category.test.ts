import db from "../db";
import { NotFoundError } from "../expressError";
import Category from "./category";
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

describe("getAll", function () {
    test("works", async function () {
        const categories = await Category.getAll();
        expect(categories.length).toEqual(5);
    });
});

describe("getById", function () {    
    test("works", async function () {
        const category = await Category.getById(1);
        expect(category).toEqual({id: 1, name: "personal"});
    });

    test("NotFoundError if not found", async function () {
        try {
            await Category.getById(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});