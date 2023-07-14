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

package io.apicurio.hub.api.rest;

import io.apicurio.hub.core.beans.Comment;
import io.apicurio.hub.core.beans.CreateValidationProfile;
import io.apicurio.hub.core.beans.UpdateValidationProfile;
import io.apicurio.hub.core.beans.ValidationProfile;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collection;

/**
 * The interface that defines how to interact with validation profiles in the Hub API.
 * 
 * @author eric.wittmann@gmail.com
 */
@Path("comments")
public interface ICommentResource {
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    Collection<Comment> listComments() throws ServerError;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{apiId}")
    Collection<Comment> listCommentsByApiId(@PathParam("apiId") String apiId) throws ServerError;
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    Comment createComment(Comment comment) throws ServerError;

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{commentId}")
    void updateComment(@PathParam("commentId") String commentId, Comment comment) throws ServerError, NotFoundException;

    @DELETE
    @Path("{commentId}")
    void deleteComment(@PathParam("commentId") String commentId) throws ServerError, NotFoundException;


}
