/**
 * @license
 * Copyright 2017 JBoss Inc
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

import {Injectable} from "@angular/core";
import {
    DefaultSeverityRegistry,
    IValidationSeverityRegistry,
    ValidationProblemSeverity,
    ValidationRuleMetaData
} from "@apicurio/data-models";
import {AbstractHubService} from "./hub";
import {HttpClient} from "@angular/common/http";
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {Category} from "../models/categories.model";

/**
 * A service that manages the list of validation profiles the user can choose from.  Also allows the
 * user to manage custom validation profiles.  This service will remember the validation profile
 * chosen for a particular API in the browser's local storage.
 */
@Injectable()
export class CategoryService extends AbstractHubService {

    private categories: Category[] = [];

    /**
     * Constructor.
     * @param http
     * @param authService
     * @param config
     */
    constructor(http: HttpClient, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
    }


    /**
     * Gets all of the validation profiles for the current user.
     */
    public getCategories(): Promise<Category[]> {
        console.info("[Categories] Getting all categories for api");

        let url: string = this.endpoint("/categories");
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[Categories] Fetching categories: %s", url);
        return this.httpGet<Category[]>(url, options).then( categories => {
            this.categories = categories.map(categories => {
                return {
                    id: categories.id,
                    name: categories.name,
                    description: categories.description
                }
            });
            return this.categories;
        });
    }

    /**
     * Called to create a custom validation profile.
     * @param categories
     */
    public createCategory(categories: Category): Promise<Category> {
        console.info("[Category] Creating a categories for id %s", categories.id);

        let createUrl: string = this.endpoint("/categories");
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[Category] Creating a categories: %s", createUrl);
        return this.httpPostWithReturn<Category, Category>(createUrl, categories, options).then( p => {
            let newCategories: Category = {
                id: p.id,
                name: p.name,
                description: p.description
            };
            return newCategories;
        });
    }

    /**
     * Called to update a validation profile on the server.
     * @param profileId
     * @param update
     */
    public updateCategory(categoriesId: number, categories: Category): Promise<Category> {
        console.info("[Category] Updating a categories with id %o", categories);

        let updateUrl: string = this.endpoint("/categories/:categoriesId", {
            categoriesId: categoriesId
        });
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[Category] Updating a categories: %s", updateUrl);
        return this.httpPut<Category>(updateUrl, categories, options).then( () => {
            let updatedCategory: Category = {
                id: categoriesId,
                name: categories.name,
                description: categories.description
            };
            return updatedCategory;
        });
    }

    /**
     * Called to delete a validation profile from the server.
     * @param profileId
     */
    public deleteCategory(profileId: number): Promise<void> {
        console.info("[CategoryService] Deleting a validation profile with id %o", profileId);

        let deleteUrl: string = this.endpoint("/categoryProfiles/:profileId", {
            profileId: profileId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[CategoryService] Deleting a validation profile: %s", deleteUrl);
        return this.httpDelete(deleteUrl, options).then( () => {

        });

    }

}
