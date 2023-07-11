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

import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {Comment} from "../../models/comment.model";

@Component({
    selector: "comment-editor",
    templateUrl: "comment-editor.component.html",
    styleUrls: ["comment-editor.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class CommentEditorComponent {

    @Input() comment: Comment;
    @Input() closable: boolean = true;

    @Output() onSave: EventEmitter<void> = new EventEmitter<void>();
    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Constructor.
     */
    constructor() {
        console.log("On CommentEditorComponent");
    }


}
