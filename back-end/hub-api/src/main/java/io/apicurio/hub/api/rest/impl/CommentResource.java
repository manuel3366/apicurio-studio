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

package io.apicurio.hub.api.rest.impl;

import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.ICommentResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.beans.Comment;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.PathParam;
import java.util.Collection;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class CommentResource implements ICommentResource {

    private static Logger logger = LoggerFactory.getLogger(CommentResource.class);

    @Inject
    private IStorage storage;
    @Inject
    private ISecurityContext security;
    @Inject
    private IApiMetrics metrics;

    /**
     * @see ICommentResource#listComments()
     */
    @Override
    public Collection<Comment> listComments() throws ServerError {
        metrics.apiCall("/comments", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Listing Comments for {}", user);
            return this.storage.listComments(user);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ICommentResource#listCommentsByApiId(String)
     */
    @Override
    public Collection<Comment> listCommentsByApiId(@PathParam("apiId") String apiId) throws ServerError {
        metrics.apiCall("/comments/{apiId}", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Listing Comment for {} and API {}", user, apiId);
            return this.storage.listCommentsByApiId(user, Long.parseLong(apiId));
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ICommentResource#createComment(Comment)
     */
    @Override
    public Comment createComment(Comment comment) throws ServerError {
        metrics.apiCall("/comments", "POST");
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Creating a new comment for {} and api : {}", user, comment.getApiId());

            long pid = storage.createComment(user, comment);
            comment.setId(pid);
            return comment;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ICommentResource#updateComment(String, Comment)
     */
    @Override
    public void updateComment(String commentId, Comment comment)
            throws ServerError, NotFoundException {
        metrics.apiCall("/comments/{commentId}", "PUT");
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Updating an existing comment for {} and api: {}", user, comment.getApiId());

            storage.updateComment(user, comment);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ICommentResource#deleteComment(String)
     */
    @Override
    public void deleteComment(String commentId) throws ServerError, NotFoundException {
        metrics.apiCall("/comments/{commentId}", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Deleting comment for {} with ID: ", user, commentId);
            this.storage.deleteComment(user, Long.parseLong(commentId));
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

}
