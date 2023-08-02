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

import io.apicurio.hub.core.beans.Categories;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collection;

/**
 * The interface that defines how to interact with categories in the Hub API.
 * 
 * @author eric.wittmann@gmail.com
 */
@Path("categories")
public interface ICategoriesResource {
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    Collection<Categories> listCategories() throws ServerError;


    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    Categories createCategories(Categories categories) throws ServerError;

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{categoriesId}")
    void updateCategories(@PathParam("categoriesId") String categoriesId, Categories categories) throws ServerError, NotFoundException;

    @DELETE
    @Path("{categoriesId}")
    void deleteCategories(@PathParam("categoriesId") String categoriesId) throws ServerError, NotFoundException;


}
