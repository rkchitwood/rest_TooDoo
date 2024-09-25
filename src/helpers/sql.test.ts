import sqlForPartialUpdate from "./sql";

describe("sqlForPartialUpdate", function () {
    test("works: 1 item", function () {
        const result = sqlForPartialUpdate(
            { username: "testuser" },
            { username: "username", random: "random" });
        expect(result).toEqual({
            sqlSetCols: '"email"=$1',
            values: ["testuser"],
        });
    });

    test("works: 2 items", function () {
        const result = sqlForPartialUpdate(
            { shape: "square", isCool: "false" },
            { isCool: "is_cool" });
        expect(result).toEqual({
            sqlSetCols: '"shape"=$1, "is_cool"=$2',
            values: ["square", "false"],
        });
    });
});