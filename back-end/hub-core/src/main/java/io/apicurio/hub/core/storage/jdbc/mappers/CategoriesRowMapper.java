/*
 * Copyright 2019 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.hub.core.storage.jdbc.mappers;

import io.apicurio.hub.core.beans.Categories;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * A row mapper to read a categories from a db row.
 * @author eric.wittmann@gmail.com
 */
public class CategoriesRowMapper implements RowMapper<Categories> {
    
    public static final CategoriesRowMapper instance = new CategoriesRowMapper();

    /**
     * @see RowMapper#map(ResultSet, StatementContext)
     */
    @Override
    public Categories map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            Categories categories = new Categories();
            categories.setId(rs.getLong("id"));
            categories.setName(rs.getString("name"));
            categories.setDescription(rs.getString("description"));
            return categories;
        } catch (Exception e) {
            throw new SQLException(e);
        }
    }
}