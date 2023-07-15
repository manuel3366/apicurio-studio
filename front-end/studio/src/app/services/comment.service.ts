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
import {Comment} from "../models/comment.model";

/**
 * A service that manages the list of validation profiles the user can choose from.  Also allows the
 * user to manage custom validation profiles.  This service will remember the validation profile
 * chosen for a particular API in the browser's local storage.
 */
@Injectable()
export class CommentService extends AbstractHubService {

    private comments: Comment[] = [];

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
    public getCommentsByApiId(apiId: number): Promise<Comment[]> {
        console.info("[Comment] Getting all comments for api");

        let url: string = this.endpoint("/comments/:apiId", {
            apiId: apiId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[Comment] Fetching comments: %s", url);
        return this.httpGet<Comment[]>(url, options).then( comments => {
            this.comments = comments.map(comment => {
                return {
                    id: comment.id,
                    text: comment.text,
                    row: comment.row,
                    apiId: comment.apiId
                }
            });
            return this.comments;
        });
    }

    /**
     * Called to create a custom validation profile.
     * @param comment
     */
    public createValidationProfile(comment: Comment): Promise<Comment> {
        console.info("[Comment] Creating a comment for Api %s", comment.apiId);

        let createUrl: string = this.endpoint("/comments");
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[Comment] Creating a comment: %s", createUrl);
        return this.httpPostWithReturn<Comment, Comment>(createUrl, comment, options).then( p => {
            let newComment: Comment = {
                id: p.id,
                text: p.text,
                row: p.row,
                apiId: p.apiId
            };
            return newComment;
        });
    }

    /**
     * Called to update a validation profile on the server.
     * @param profileId
     * @param update
     */
    public updateComment(commentId: number, comment: Comment): Promise<Comment> {
        console.info("[Comment] Updating a comment with id %o", comment);

        let updateUrl: string = this.endpoint("/comments/:commentId", {
            commentId: commentId
        });
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[Comment] Updating a comment: %s", updateUrl);
        return this.httpPut<Comment>(updateUrl, comment, options).then( () => {
            let updatedComment: Comment = {
                id: commentId,
                text: comment.text,
                row: comment.row,
                apiId: comment.apiId
            };
            /*let profileIndex: number = -1;
            this.profiles.forEach( (p, idx) => {
                if (p.id === profileId) {
                    profileIndex = idx;
                }
            });
            if (profileIndex === -1) {
                this.profiles.push(updatedProfile);
            } else {
                this.profiles.splice(profileIndex, 1, updatedProfile);
            }*/
            return updatedComment;
        });
    }

    /**
     * Called to delete a validation profile from the server.
     * @param profileId
     */
    /*public deleteValidationProfile(profileId: number): Promise<void> {
        console.info("[ValidationService] Deleting a validation profile with id %o", profileId);

        let deleteUrl: string = this.endpoint("/validationProfiles/:profileId", {
            profileId: profileId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[ValidationService] Deleting a validation profile: %s", deleteUrl);
        return this.httpDelete(deleteUrl, options).then( () => {
            let profileIndex: number = -1;
            this.profiles.forEach( (p, idx) => {
                if (p.id === profileId) {
                    profileIndex = idx;
                }
            });
            if (profileIndex !== -1) {
                this.profiles.splice(profileIndex, 1);
            }
        });

    }*/



}
