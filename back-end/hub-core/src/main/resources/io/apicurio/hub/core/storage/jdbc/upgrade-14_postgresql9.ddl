-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: PostgreSQL 9+
-- Upgrades the DB schema from version 13 to version 14.
-- *********************************************************************

UPDATE apicurio SET prop_value = 14 WHERE prop_name = 'db_version';

CREATE TABLE categories (id BIGSERIAL NOT NULL PRIMARY KEY, owner VARCHAR(255) NOT NULL, name VARCHAR(40) NOT NULL, description VARCHAR(50) NOT NULL);
CREATE INDEX IDX_categories_1 ON categories(owner);