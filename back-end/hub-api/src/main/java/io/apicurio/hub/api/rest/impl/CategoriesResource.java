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
import io.apicurio.hub.api.rest.ICategoriesResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.beans.Categories;
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
public class CategoriesResource implements ICategoriesResource {

    private static Logger logger = LoggerFactory.getLogger(CategoriesResource.class);

    @Inject
    private IStorage storage;
    @Inject
    private ISecurityContext security;
    @Inject
    private IApiMetrics metrics;

    /**
     * @see ICategoriesResource#listCategories() ()
     */
    @Override
    public Collection<Categories> listCategories() throws ServerError {
        metrics.apiCall("/categories", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Listing categories for {}", user);
            return this.storage.listCategories(user);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ICategoriesResource#createCategories(Categories)
     */
    @Override
    public Categories createCategories(Categories categories) throws ServerError {
        metrics.apiCall("/categories", "POST");
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Creating a new categories for {} and api : {}", user, categories.getName());

            long pid = storage.createCategories(user, categories);
            categories.setId(pid);
            return categories;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ICategoriesResource#updateCategories(String, Categories)
     */
    @Override
    public void updateCategories(String CategoriestId, Categories categories)
            throws ServerError, NotFoundException {
        metrics.apiCall("/categories/{CategoriestId}", "PUT");
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Updating an existing categories for {} and api: {}", user, categories.getName());

            storage.updateCategories(user, categories);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ICategoriesResource#deleteCategories(String)
     */
    @Override
    public void deleteCategories(String CategoriestId) throws ServerError, NotFoundException {
        metrics.apiCall("/categories/{CategoriestId}", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Deleting categories for {} with ID: ", user, CategoriestId);
            this.storage.deleteCategories(user, Long.parseLong(CategoriestId));
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

}
