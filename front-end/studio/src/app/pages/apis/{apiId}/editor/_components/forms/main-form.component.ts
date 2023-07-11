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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {OasDocument, Library, CommandFactory} from "@apicurio/data-models";
import {Comment} from "../../../../../../models/comment.model";
import {SourceFormComponent} from "./source-form.base";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {ICommand} from "@apicurio/data-models";
import {EditorsService} from "../../_services/editors.service";


@Component({
    selector: "main-form",
    templateUrl: "main-form.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainFormComponent extends SourceFormComponent<OasDocument> {

    _document: OasDocument;
    _showComments: boolean = true;
    _comments: any = [new Comment(), new Comment(), new Comment()];
    _visibleComment: any = [false, false, false];
    _commentsResume: any = new Map();
    _goToLine: number = 0;
    @Input()
    set document(doc: OasDocument) {
        this._document = doc;
        this.sourceNode = doc;
        this.revertSource();
    }
    get document(): OasDocument {
        return this._document;
    }

    editorOpen: boolean;
    editorModel: Comment;

    public constructor(protected changeDetectorRef: ChangeDetectorRef,
                       protected selectionService: SelectionService,
                       protected commandService: CommandService,
                       protected documentService: DocumentService,
                       private editors: EditorsService) {
        super(changeDetectorRef, selectionService, commandService, documentService);
    }

    ngOnInit() {
        this.calculateCommentResume();
        console.log("this._comments.length:" + this._comments.length);
        console.log("this._commentsResume.get(1):" + this._commentsResume.get(1));
    }

    /**
     * Returns true if the form is for an OpenAPI 3.x document.
     */
    public is3xForm(): boolean {
        return this.document.is3xDocument();
    }

    protected createEmptyNodeForSource(): OasDocument {
        return <OasDocument> Library.createDocument(this.document.getDocumentType());
    }

    protected createReplaceNodeCommand(node: OasDocument): ICommand {
        return CommandFactory.createReplaceDocumentCommand(this.document, node);
    }

    public saveSource(): void {
        super.saveSource();
        this.sourceNode = this._document;
    }

    public isShowComments(): boolean {
        return this._showComments;
    }

    public showComments() {
        this._showComments = !this._showComments;
    }

    /**
     * Edit the given comment, or create a new comment if none is given.
     * @param comment
     */
    editComment(comment?: Comment): void {
        console.log("comment:" + comment);
        this.editorModel = new Comment();
        if (comment) {
            this.editorModel.id = comment.id;
            this.editorModel.row = comment.row;
            this.editorModel.text = comment.text;
            this.editorModel.apiId = comment.apiId;
        } else {
            this.editorModel.id = null;
            this.editorModel.row = 3;
            this.editorModel.text = "";
            this.editorModel.apiId = 1;
        }
        this.editorOpen = true;
        this.collapseAllExcept(null);
    }

    public onNewCommentFunction(row: number): void{
        console.log("row value:" + row);
        let comment = new Comment();
        comment.row = row;
        this.editComment(comment);
    }


    /**
     * Called when the user clicks Save on the Create/Edit Validation Profile editor.
     */
    saveComment(): void {
        let comment: Comment = this.editorModel;

        // Create a new profile
        if (comment.id === null) {
            this._comments.push(comment);
            this._visibleComment.push(false);
            this.calculateCommentResume()
            this.editorOpen = false;
            /*let info: CreateValidationProfile = {
                name: this.editorModel.name,
                description: this.editorModel.description,
                severities: this.editorModel.severities
            };
            this.validationService.createValidationProfile(info).then( profile => {
                this.profiles.push(profile);
                this.editorOpen = false;
            }).catch( error => {
                this.error(error);
            });*/
        }

        // Update an existing profile
        /*if (profile.id !== null) {
            let update: UpdateValidationProfile = {
                name: this.editorModel.name,
                description: this.editorModel.description,
                severities: this.editorModel.severities
            };
            this.validationService.updateValidationProfile(this.editorModel.id, update).then( newProfile => {
                let idx: number = -1;
                this.profiles.forEach( (p, pidx) => {
                    if (p.id === profile.id) {
                        idx = pidx;
                    }
                });
                if (idx >= 0) {
                    this.profiles.splice(idx, 1, newProfile);
                }

                this.editorOpen = false;
            }).catch( error => {
                this.error(error);
            });
        }*/

    }

    calculateCommentResume(){
        this._commentsResume = new Map();
        for (let i = 0; i < this._comments.length; i++) {
            let count = 1;
            if (this._commentsResume.has(this._comments[i].row)) {
                count = this._commentsResume.get(this._comments[i].row) + count;
            }
            this._commentsResume.set(this._comments[i].row, count);
        }
    }

    toggleCollapse(id: number): void {
        this.collapseAllExcept(id);
        this.editorOpen = false;
        this._visibleComment[id] = !this._visibleComment[id];
    }

    collapseAllExcept(id: number): void {
        for (let i = 0; i < this._visibleComment.length; i++) {
            if (i != id) {
                this._visibleComment[i] = false;
            }
        }
    }

    public goToLineInEditor(row: number): void {
        this._goToLine = row;
    }

}
