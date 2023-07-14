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

import io.apicurio.hub.core.beans.Comment;
import io.apicurio.hub.core.beans.ValidationProfile;
import io.apicurio.hub.core.beans.ValidationSeverity;
import org.apache.commons.io.IOUtils;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

/**
 * A row mapper to read a comment from a db row.
 * @author eric.wittmann@gmail.com
 */
public class CommentRowMapper implements RowMapper<Comment> {
    
    public static final CommentRowMapper instance = new CommentRowMapper();

    /**
     * @see RowMapper#map(ResultSet, StatementContext)
     */
    @Override
    public Comment map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            Comment comment = new Comment();
            comment.setId(rs.getLong("id"));
            comment.setText(rs.getString("text_value"));
            comment.setRow(rs.getInt("row_num"));
            comment.setApiId(rs.getLong("api_id"));
            return comment;
        } catch (Exception e) {
            throw new SQLException(e);
        }
    }
}