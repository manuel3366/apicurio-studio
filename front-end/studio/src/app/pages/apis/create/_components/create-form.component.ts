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

import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {IAuthenticationService} from "../../../../services/auth.service";
import {DropDownOption, DropDownOptionValue as Value} from '../../../../components/common/drop-down.component';
import {ApisService} from "../../../../services/apis.service";
import {LinkedAccountsService} from "../../../../services/accounts.service";
import {TemplateService} from "../../../../services/template.service";
import {ApiDesignTemplate} from "../../../../models/api-design-template.model";
import {ConfigService} from "../../../../services/config.service";
import {Category} from "../../../../models/categories.model";
import {CategoryService} from "../../../../services/categories.service";

export interface CreateApiFormData {
    type: string;
    name: string;
    category: any;
    description: string;
    template?: ApiDesignTemplate
}

@Component({
    selector: "createapi-form",
    templateUrl: "create-form.component.html",
    styleUrls: ["create-form.component.css"]
})
export class CreateApiFormComponent {

    categories: any = [];

    @Output() onCreateApi = new EventEmitter<CreateApiFormData>();

    model: CreateApiFormData = {
        type: "OpenAPI30",
        name: null,
        description: null,
        template: null,
        category: null
    };
    creatingApi: boolean = false;
    error: string;
    toptions: DropDownOption[];
    categoryOptions: DropDownOption[];

    /**
     * Constructor.
     * @param apisService
     * @param authService
     * @param accountsService
     * @param templateService
     */
    constructor(private apisService: ApisService,
                @Inject(IAuthenticationService) private authService: IAuthenticationService,
                private accountsService: LinkedAccountsService, private templateService: TemplateService,
                private config: ConfigService, private categoriesService: CategoryService)
    {
        this.creatingApi = false;
    }

    public ngOnInit(): void {
        this.toptions = [
            new Value("Open API 2.0 (Swagger)", "OpenAPI20"),
            new Value("Open API 3.0.2", "OpenAPI30")
        ];
        if (this.config.isAsyncAPIEnabled()) {
            this.toptions.push(new Value("Async API 2.0.0", "AsyncAPI20"));
        }
        if (this.config.isGraphQLEnabled()) {
            this.toptions.push(new Value("GraphQL", "GraphQL"));
        }
       this.categoriesService.getCategories().then( categories => {
           console.log("[CategoriesPageComponent] Default categories loaded: ", categories);
           this.categories = categories;
           this.categoryOptions = [];
           for(var i = 0; i < this.categories.length; i++){
                this.categoryOptions.push(new Value(this.categories[i].name, this.categories[i].id));
           }

       }).catch( error => {
           console.error("[CategoriesPageComponent] Error fetching built in validation profiles:" + error);
       });

    }


    public typeOptions(): DropDownOption[] {
        return this.toptions;
    }

    public categoryOption(): DropDownOption[] {
       return this.categoryOptions;
    }

    public changeType(value: string): void {
        this.model.type = value;
        this.model.template = null;

    }

    public changeCategory(value: string): void {
            this.model.category = value;
    }

    public templates(): ApiDesignTemplate[] {
        return this.templateService.getTemplates(this.model.type);
    }

    /**
     * Called when the user clicks the "Create API" submit button on the form.
     */
    public createApi(): void {
        this.creatingApi = true;
        this.onCreateApi.emit(this.model);
    }
}
