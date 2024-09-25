import { Client } from "pg";
import { getDatabaseUri } from "./config";

let db: Client;

if (process.env.NODE_ENV === "production") {
    db = new Client({
        connectionString: getDatabaseUri(),
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    db = new Client({
        connectionString: getDatabaseUri(),
    });
}

// Automatically connect if not testing
if (!getDatabaseUri().includes("test")) {
    (async () => {
        await db.connect();
    })();
}

export default db;
