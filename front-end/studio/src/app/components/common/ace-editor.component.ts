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

import {Component, EventEmitter, Output, ElementRef, Input, forwardRef, OnInit, NgZone, OnDestroy, OnChanges, SimpleChanges} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import "brace";
import "brace/theme/eclipse";
import "brace/theme/monokai";
import "brace/theme/twilight";
import "brace/mode/json";
import "brace/mode/html";
import "brace/mode/markdown";
import "brace/mode/xml";
import "brace/mode/yaml";
import "brace/mode/graphqlschema";

declare var ace: any;

@Component({
    selector: 'ace-editor',
    template: '',
    styles: [':host { display:block;width:100%; }'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AceEditorComponent),
        multi: true
    }]
})
export class AceEditorComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
    @Output() onNewComment: EventEmitter<any> = new EventEmitter();
    @Output() textChanged = new EventEmitter();
    @Output() textChange = new EventEmitter();
    @Input() style: any = {};
    _options: any = {};
    _readOnly: boolean = false;
    _theme: string = "monokai";
    _mode: any = "html";z
    _commentsResume: any = new Map();
    _goToLine: number = 0;
    _autoUpdateContent: boolean = true;
    _editor: any;
    _durationBeforeCallback: number = 0;
    _wordWrap: boolean = false;
    _text: string = "";
    oldText: any;
    _addCommentFunction: any;
    timeoutSaving: any;

    /**
     * C'tor.
     * @param elementRef
     * @param zone
     */
    constructor(elementRef: ElementRef, private zone: NgZone) {
        let el = elementRef.nativeElement;
        zone.runOutsideAngular(() => {
            this._editor = ace["edit"](el);
            this._editor.$blockScrolling = Infinity;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            console.log("propName:" + propName);
            if (propName == "commentsResume") {
                this.addGutterDecorations(this._commentsResume);
            } else if (propName == "goToLine") {
                this.setGoToLine(this._goToLine);
            }
         }
    }

    ngOnInit() {
        this.init();
        this.initEvents();
    }

    ngOnDestroy() {
        this.destroy();
    }

    init() {
        this.setOptions(this._options || {});
        this.setTheme(this._theme);
        this.setMode(this._mode);
        this.setReadOnly(this._readOnly);
        this.addGutterDecorations(this._commentsResume);
        this.setGoToLine(this._goToLine);
    }

    initEvents() {
        this._editor.on('change', () => this.updateText());
        this._editor.on('paste', () => this.updateText());

        this._editor.on("guttermousedown", (e: any) => {
            var target = e.domEvent.target;

            /*if (target.className.indexOf("ace_gutter-cell") == -1){
                return;
            }

            if (!e.editor.isFocused()){
                return;
            }

            if (e.clientX > 25 + target.getBoundingClientRect().left){
                return;
            }*/

            var row = e.getDocumentPosition().row;
            this.onNewComment.emit(row + 1);
            e.stop();
        });
    }

    destroy() {
        this._editor.destroy();
    }

    focus(): void {
        this._editor.focus();
    }

    updateText() {
        let newVal = this._editor.getValue(), that = this;
        if (newVal === this.oldText) {
            return;
        }
        if (!this._durationBeforeCallback) {
            this._text = newVal;
            this.zone.run(() => {
                this.textChange.emit(newVal);
                this.textChanged.emit(newVal);
                this._onChange(newVal);
            });
        } else {
            if (this.timeoutSaving) {
                clearTimeout(this.timeoutSaving);
            }

            this.timeoutSaving = setTimeout(function () {
                that._text = newVal;
                this.zone.run( () => {
                    that.textChange.emit(newVal);
                    that.textChanged.emit(newVal);
                    that.timeoutSaving = null;
                });
            }, this._durationBeforeCallback);
        }
        this.oldText = newVal;
    }

    @Input() set options(options: any) {
        this.setOptions(options);
    }

    @Input() set commentsResume(commentsResume: any) {
        this._commentsResume = commentsResume;
    }

    @Input() set goToLine(goToLine: number) {
         this._goToLine = goToLine;
    }

    setGoToLine(goToLine: number){
        this._editor.gotoLine(goToLine, 0, true)
    }

    setOptions(options: any) {
        this._options = options;
        this._editor.setOptions(options || {});
    }

    @Input() set readOnly(readOnly: any) {
        this.setReadOnly(readOnly);
    }

    setReadOnly(readOnly: any) {
        this._readOnly = readOnly;
        this._editor.setReadOnly(readOnly);
    }

    addGutterDecorations(commentsResume: any) {
        for (let [key, value] of commentsResume) {
            if (value <= 8) {
                this._editor.session.addGutterDecoration(key-1, "ace-comment-editor-" + value);
            } else {
                this._editor.session.addGutterDecoration(key-1, "ace-comment-editor-more");
            }
        }

    }

    @Input() set theme(theme: any) {
        this.setTheme(theme);
    }

    setTheme(theme: any) {
        this._theme = theme;
        this._editor.setTheme(`ace/theme/${theme}`);
    }

    @Input() set mode(mode: any) {
        this.setMode(mode);
    }

    setMode(mode: any) {
        this._mode = mode;
        if (typeof this._mode === 'object') {
            this._editor.getSession().setMode(this._mode);
        } else {
            this._editor.getSession().setMode(`ace/mode/${this._mode}`);
        }
    }

    get value() {
        return this.text;
    }

    @Input()
    set value(value: string) {
        this.setText(value);
    }

    writeValue(value: any) {
        this.setText(value);
    }

    private _onChange = (_: any) => {
    };

    registerOnChange(fn: any) {
        this._onChange = fn;
    }

    private _onTouched = () => {
    };

    registerOnTouched(fn: any) {
        this._onTouched = fn;
    }

    get wordWrap() {
        return this._wordWrap;
    }

    @Input()
    set wordWrap(wordWrap: boolean) {
        this.setWordWrap(wordWrap);
    }

    setWordWrap(wordWrap: boolean) {
        this._wordWrap = wordWrap;
        this._editor.getSession().setUseWrapMode(true);
    }

    get text() {
        return this._text;
    }

    @Input()
    set text(text: string) {
        this.setText(text);
    }

    setText(text: any) {
        if (text === null || text === undefined) {
            text = "";
        }
        if (this._text !== text && this._autoUpdateContent === true) {
            this._text = text;
            this._editor.setValue(text);
            this._onChange(text);
            this._editor.clearSelection();
        }
    }

    @Input() set autoUpdateContent(status: any) {
        this.setAutoUpdateContent(status);
    }

    setAutoUpdateContent(status: any) {
        this._autoUpdateContent = status;
    }

    @Input() set durationBeforeCallback(num: number) {
        this.setDurationBeforeCallback(num);
    }

    setDurationBeforeCallback(num: number) {
        this._durationBeforeCallback = num;
    }

    getEditor() {
        return this._editor;
    }
}
