/** Configuration for application */

import { config } from "dotenv";
import "colors";
config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = process.env.PORT ? +process.env.PORT : 3001;

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "postgresql:///toodoo_test"
        : process.env.DATABASE_URL || "postgresql:///toodoo";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

console.log("toodoo Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database REPLACE?:".yellow, getDatabaseUri().replace(/:[^:]+@/, ':***@')); // Redacts password
console.log("---");

export {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
};