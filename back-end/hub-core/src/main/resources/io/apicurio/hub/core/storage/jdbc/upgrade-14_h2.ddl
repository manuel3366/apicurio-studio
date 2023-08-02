-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- Upgrades the DB schema from version 13 to version 14.
-- *********************************************************************

UPDATE apicurio SET prop_value = 14 WHERE prop_name = 'db_version';

CREATE TABLE categories (id BIGINT AUTO_INCREMENT NOT NULL, owner VARCHAR(255) NOT NULL, name VARCHAR(40) NOT NULL, description VARCHAR(50) NOT NULL);
ALTER TABLE categories ADD PRIMARY KEY (id);
CREATE INDEX IDX_categories_1 ON categories(owner);