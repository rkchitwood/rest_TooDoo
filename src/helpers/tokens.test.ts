import jwt from "jsonwebtoken";
import createToken from "./tokens";
import { SECRET_KEY } from "../config";

describe("createToken", function () {
    test("works", function() {
        const token = createToken({ id: 1, username: "testuser" });
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            id: 1,
            username: "testuser"
        });
    });
});