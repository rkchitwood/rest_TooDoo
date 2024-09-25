\echo 'delete and recreate toodoo db?'
\prompt 'return for yes or CTRL-C to cancel' input

DROP DATABASE toodoo;
CREATE DATABASE toodoo;

\connect toodoo

\i toodoo-schema.sql

\echo 'delete and recreate toodoo_test db.?'
\prompt 'return for yes or CTRL-C to cancel' input

DROP DATABASE toodoo_test;
CREATE DATABASE toodoo_test;

\connect toodoo_test;

\i toodoo-schema.sql