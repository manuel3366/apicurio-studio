/**
 * @license
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

import {Component, Inject} from "@angular/core";
import {IAuthenticationService} from "../../../services/auth.service";
import {AbstractPageComponent} from "../../../components/page-base.component";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ValidationProfileExt, ValidationService} from "../../../services/validation.service";
import {CategoryService} from "../../../services/categories.service";
import {CreateValidationProfile, UpdateValidationProfile, ValidationProfile} from "../../../models/validation.model";
import {Category} from "../../../models/categories.model";
import {ValidationProblemSeverity, ValidationRuleSet} from "@apicurio/data-models";

/**
 * The Settings/Profile Page component.
 */
@Component({
    selector: "categories-page",
    templateUrl: "categories.page.html",
    styleUrls: ["categories.page.css"]
})
export class CategoriesPageComponent extends AbstractPageComponent {

    categories: any = [];

    editorOpen: boolean;
    editorModel: Category;

    /**
     * C'tor.
     * @param authService
     * @param route
     * @param titleService
     * @param categoriesService
     */
    constructor(@Inject(IAuthenticationService) private authService: IAuthenticationService, route: ActivatedRoute,
                titleService: Title, private categoriesService: CategoryService) {
        super(route, titleService);
    }


    /**
     * The page title.
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Settings - Category";
    }

    /**
     * Load page data asynchronously.
     */
    public loadAsyncPageData(): void {
        console.log("[CategoriesPageComponent] loadAsyncPageData!!");

        this.categoriesService.getCategories().then( categories => {
            console.log("[CategoriesPageComponent] Default categories loaded: ", categories);
            this.categories = categories;
        }).catch( error => {
            console.error("[CategoriesPageComponent] Error fetching built in validation profiles.");
            this.error(error);
        });
    }



    /**
     * Edit the given profile, or create a new profile if none is given.
     * @param profile
     */
    editCategory(category?: Category): void {
        this.editorModel = new Category();
        if (category) {
            this.editorModel.id = category.id;
            this.editorModel.name = category.name;
            this.editorModel.description = category.description;
        } else {
            this.editorModel.id = null;
            this.editorModel.name = null;
            this.editorModel.description = "";
        }
        this.editorOpen = true;
    }

    /**
    * Called when the user clicks Save on the Create/Edit Validation Profile editor.
    */
        saveCategory(): void {
            let category: Category = this.editorModel;

            // Create a new profile
            if (category.id === null) {
                this.categoriesService.createCategory(category).then( category => {
                    this.categories.push(category);
                    this.editorOpen = false;
                }).catch( error => {
                    this.error(error);
                });
            }
            // Update an existing profile
            if (category.id !== null) {
            this.categoriesService.updateCategory(category.id, category).then( newCategory => {
                 let idx: number = -1;
                  this.categories.forEach( (p, pidx) => {
                     if (p.id === newCategory.id) {
                       idx = pidx;
                     }
                  });
                  if (idx >= 0) {
                     this.categories.splice(idx, 1, category);
                  }

                    this.editorOpen = false;
            }).catch( error => {
                    this.error(error);
               });
            }
         //this.editorOpen = false;
    }


    /**
     * Called to delete a profile.
     * @param profile
     */
    deleteCategory(category: Category): void {
        this.categories.splice(this.categories.indexOf(category), 1);
        this.categoriesService.deleteCategory(category.id).catch( error => {
            this.error(error);
        });
    }

}
