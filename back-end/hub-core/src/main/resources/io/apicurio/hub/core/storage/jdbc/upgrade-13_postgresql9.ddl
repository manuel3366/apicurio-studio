-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: PostgreSQL 9+
-- Upgrades the DB schema from version 12 to version 13.
-- *********************************************************************

UPDATE apicurio SET prop_value = 13 WHERE prop_name = 'db_version';

CREATE TABLE comments (id BIGSERIAL NOT NULL PRIMARY KEY, owner VARCHAR(255) NOT NULL, text_value VARCHAR(255) NOT NULL, row_num INTEGER NOT NULL, api_id BIGINT NOT NULL);
CREATE INDEX IDX_comments_1 ON comments(owner);
