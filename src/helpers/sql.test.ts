import sqlForPartialUpdate from "./sql";

describe("sqlForPartialUpdate", function () {
    test("works: 1 item", function () {
        const result = sqlForPartialUpdate(
            { username: "testuser" },
            { username: "username", random: "random" });
        expect(result).toEqual({
            sqlSetCols: '"username"=$1',
            values: ["testuser"],
        });
    });

    test("works: 2 items", function () {
        const result = sqlForPartialUpdate(
            { name: "square", id: 3 },
            { isCool: "is_cool" });
        expect(result).toEqual({
            sqlSetCols: '"name"=$1, "id"=$2',
            values: ["square", 3],
        });
    });
});