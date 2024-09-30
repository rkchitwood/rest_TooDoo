CREATE DATABASE IF NOT EXISTS toodoo;

\connect toodoo

\i toodoo-schema.sql

CREATE DATABASE  IF NOT EXISTS toodoo_test;

\connect toodoo_test;

\i toodoo-schema.sql