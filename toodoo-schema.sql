CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(15) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create default categories with hardcoded IDs
INSERT INTO categories (id, name) VALUES
    (1, 'personal'),
    (2, 'finance'),
    (3, 'home'),
    (4, 'errand'),
    (5, 'work')
ON CONFLICT (id) DO NOTHING;

-- Adjust the sequence to start from 6 after manual insert
SELECT setval(pg_get_serial_sequence('categories', 'id'), 6);

CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id INTEGER NOT NULL 
        REFERENCES categories ON DELETE CASCADE,
    user_id INTEGER NOT NULL 
        REFERENCES users ON DELETE CASCADE,
    complete_date TIMESTAMPTZ
);