import db from "../db";
import User from "./user";

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

