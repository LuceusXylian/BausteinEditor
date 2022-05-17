"use strict";
var dialog = new Dialog();
var TinyEditor = (function () {
    function TinyEditor(editor, options) {
        var _this = this;
        this.TOOLBAR_ITEM = '__toolbar-item';
        this.callback_onchange = null;
        this.editor = editor;
        editor.classList.add("__editor");
        editor.setAttribute('contentEditable', "true");
        if (typeof options.onchange === "function")
            this.callback_onchange = options.onchange;
        var toolbar = this.createToolbar(options);
        editor.insertAdjacentElement("beforebegin", toolbar);
        var self = this;
        var updateActiveState = function () {
            var toolbarSelects = toolbar.querySelectorAll('select[data-command-id]');
            var _loop_1 = function () {
                var select = toolbarSelects[i];
                var value = document.queryCommandValue(select.dataset.commandId);
                var option = Array.from(select.options).find(function (_option) {
                    var option = _option;
                    return option.value === value;
                });
                select.selectedIndex = option ? option.index : -1;
            };
            for (var i = 0; i < toolbarSelects.length; i++) {
                _loop_1();
            }
            var toolbarButtons = toolbar.querySelectorAll('button[data-command-id]');
            for (var i = 0; i < toolbarButtons.length; i++) {
                var button = toolbarButtons[i];
                var active = document.queryCommandState(button.dataset.commandId);
                button.classList.toggle('active', active);
            }
            var inputButtons = toolbar.querySelectorAll('input[data-command-id]');
            for (var i = 0; i < inputButtons.length; i++) {
                var input = inputButtons[i];
                var value = document.queryCommandValue(input.dataset.commandId);
                input.value = self.rgbToHex(value);
            }
        };
        editor.addEventListener('keydown', updateActiveState);
        editor.addEventListener('keyup', updateActiveState);
        editor.addEventListener('click', updateActiveState);
        toolbar.addEventListener('click', updateActiveState);
        document.addEventListener('selectionchange', function () {
            var selection = window.getSelection();
            if (selection.anchorNode !== null && !editor.contains(selection.anchorNode.parentNode))
                return false;
        });
        editor.addEventListener('paste', function (e) {
            e.preventDefault();
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertHTML', false, text);
            if (_this.callback_onchange !== null)
                _this.callback_onchange();
        });
        editor.addEventListener('keypress', function (e) {
            if ((e.keyCode || e.which) === 13) {
                var selection = window.getSelection();
                if (selection !== null && selection.anchorNode.parentNode.tagName === 'LI')
                    return;
                document.execCommand('formatBlock', false, 'p');
            }
        });
        if (this.callback_onchange !== null) {
            editor.addEventListener('keyup', function () {
                if (_this.callback_onchange !== null)
                    _this.callback_onchange();
            });
        }
    }
    TinyEditor.prototype.createElement = function (_type, _id, _class) {
        var element = document.createElement(_type);
        if (_id !== "")
            element.id = _id;
        if (_class !== "")
            element.className = _class;
        return element;
    };
    TinyEditor.prototype.execCommand = function (commandId, value) {
        switch (commandId) {
            case "createLink":
                this.execCommand_createLink();
                break;
            case "removeLink":
                this.execCommand_removeLink();
                break;
            default:
                document.execCommand(commandId, false, value);
                if (this.callback_onchange !== null)
                    this.callback_onchange();
                break;
        }
        this.editor.focus();
    };
    TinyEditor.prototype.execCommand_createLink = function () {
        var _this = this;
        var selection_ranges = this.saveSelection();
        if (selection_ranges.length === 0) {
            console.log("[TinyEditor] User tried to create a link without selecting text");
        }
        else {
            var dialog_content = document.createElement("div");
            var row1 = dialog_content.appendChild(document.createElement("div"));
            row1.className = "row";
            row1.style.marginBottom = "10px";
            var link_input = row1.appendChild(document.createElement("input"));
            link_input.id = "link_input";
            link_input.type = "text";
            link_input.className = "form-control";
            link_input.placeholder = "Link eingeben.. z.B.: http://example.com";
            var row2 = dialog_content.appendChild(document.createElement("div"));
            row2.className = "row";
            var link_new_tab_input = row2.appendChild(document.createElement("input"));
            link_new_tab_input.id = "link_new_tab_input";
            link_new_tab_input.type = "checkbox";
            var link_new_tab_input_label = row2.appendChild(document.createElement("label"));
            link_new_tab_input_label.setAttribute("for", "link_new_tab_input");
            link_new_tab_input_label.innerHTML = "neuer Tab";
            link_new_tab_input_label.style.userSelect = "none";
            link_new_tab_input_label.style.cursor = "pointer";
            var selected_element = this.getElementFromSelection(selection_ranges[0]);
            if (selected_element !== null) {
                link_input.value = selected_element.href;
                link_new_tab_input.checked = selected_element.target === "_blank";
            }
            dialog.start('Link eingeben', dialog_content, 'Link setzen', null, null, function () {
                var linkValue = link_input.value;
                var newTab = link_new_tab_input.checked;
                if (selection_ranges !== null)
                    _this.restoreSelection(selection_ranges);
                var newSelection = window.getSelection();
                if (newSelection !== null && newSelection.toString()) {
                    var new_a_element = document.createElement('a');
                    new_a_element.href = linkValue;
                    if (newTab)
                        new_a_element.target = '_blank';
                    newSelection.getRangeAt(0).surroundContents(new_a_element);
                }
                dialog.close();
                if (_this.callback_onchange !== null)
                    _this.callback_onchange();
            });
            setTimeout(function () {
                link_input.focus();
            }, 100);
        }
    };
    TinyEditor.prototype.execCommand_removeLink = function () {
        var selection_ranges = this.saveSelection();
        if (selection_ranges.length === 0) {
            console.log("[TinyEditor] User tried to create a link without selecting text");
        }
        else {
            var selected_element = this.getElementFromSelection(selection_ranges[0]);
            if (selected_element === null) {
                console.log("[TinyEditor] User tried to remove a link without selecting text");
            }
            else if (selected_element.tagName !== 'A') {
                console.log("[TinyEditor] User tried to remove a link without selecting an anchor element");
            }
            else {
                selected_element.outerHTML = selected_element.innerHTML;
            }
        }
    };
    TinyEditor.prototype.createButton = function (commandId, title, child) {
        var _this = this;
        var button = document.createElement('button');
        button.dataset.commandId = commandId;
        button.className = this.TOOLBAR_ITEM;
        button.title = title;
        button.type = 'button';
        button.appendChild(child);
        button.addEventListener('click', function () { return _this.execCommand(commandId, null); });
        return button;
    };
    TinyEditor.prototype.createOption = function (value, text, selected) {
        var option = document.createElement('option');
        option.innerText = text;
        if (value)
            option.setAttribute('value', value);
        if (selected)
            option.setAttribute('selected', selected);
        return option;
    };
    TinyEditor.prototype.createSelect = function (commandId, title, options) {
        var _this = this;
        var select = document.createElement('select');
        select.dataset.commandId = commandId;
        select.className = this.TOOLBAR_ITEM;
        select.title = title;
        select.addEventListener('change', function (e) {
            var target = e.target;
            if (e.target === null) {
                return;
            }
            else {
                return _this.execCommand(commandId, target.options[target.selectedIndex].value);
            }
        });
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            select.appendChild(this.createOption(option.value, option.text, option.selected));
        }
        return select;
    };
    TinyEditor.prototype.createIcon = function (className) {
        var icon = document.createElement('i');
        icon.className = className;
        return icon;
    };
    TinyEditor.prototype.createInput = function (commandId, title, type) {
        var _this = this;
        var input = document.createElement('input');
        input.dataset.commandId = commandId;
        input.className = this.TOOLBAR_ITEM;
        input.title = title;
        input.type = type;
        input.addEventListener('change', function (e) {
            var target = e.target;
            return _this.execCommand(commandId, target.value);
        });
        return input;
    };
    TinyEditor.prototype.createSeparator = function () {
        var separator = document.createElement('span');
        separator.className = '__toolbar-separator';
        return separator;
    };
    TinyEditor.prototype.createToolbar = function (options) {
        var toolbar = document.createElement('div');
        toolbar.className = '__toolbar';
        console.log("options", options);
        if (options.formatblock === true) {
            toolbar.appendChild(this.createSelect('formatblock', 'Styles', [
                { value: 'h1', text: 'Title 1' },
                { value: 'h2', text: 'Title 2' },
                { value: 'h3', text: 'Title 3' },
                { value: 'h4', text: 'Title 4' },
                { value: 'h5', text: 'Title 5' },
                { value: 'h6', text: 'Title 6' },
                { value: 'p', text: 'Paragraph', selected: true },
                { value: 'pre', text: 'Preformatted' },
            ]));
        }
        if (options.fontname === true) {
            toolbar.appendChild(this.createSelect('fontname', 'Font', [
                { value: 'serif', text: 'Serif', selected: true },
                { value: 'sans-serif', text: 'Sans Serif' },
                { value: 'monospace', text: 'Monospace' },
                { value: 'cursive', text: 'Cursive' },
                { value: 'fantasy', text: 'Fantasy' },
            ]));
        }
        if (options.bold === true) {
            toolbar.appendChild(this.createButton('bold', 'Bold', this.createIcon('fas fa-bold')));
        }
        if (options.italic === true) {
            toolbar.appendChild(this.createButton('italic', 'Italic', this.createIcon('fas fa-italic')));
        }
        if (options.underline === true) {
            toolbar.appendChild(this.createButton('underline', 'Underline', this.createIcon('fas fa-underline')));
        }
        if (options.textcolor === true) {
            toolbar.appendChild(this.createInput('forecolor', 'Text color', 'color'));
        }
        if (options.textleft === true) {
            toolbar.appendChild(this.createSeparator());
            toolbar.appendChild(this.createButton('justifyleft', 'Left align', this.createIcon('fas fa-align-left')));
        }
        if (options.textcenter === true) {
            toolbar.appendChild(this.createButton('justifycenter', 'Center align', this.createIcon('fas fa-align-center')));
        }
        if (options.textright === true) {
            toolbar.appendChild(this.createButton('justifyright', 'Right align', this.createIcon('fas fa-align-right')));
        }
        if (options.insertorderedlist === true) {
            toolbar.appendChild(this.createSeparator());
            toolbar.appendChild(this.createButton('insertorderedlist', 'Numbered list', this.createIcon('fas fa-list-ol')));
        }
        if (options.insertunorderedlist === true) {
            toolbar.appendChild(this.createButton('insertunorderedlist', 'Bulleted list', this.createIcon('fas fa-list-ul')));
        }
        if (options.outdent === true) {
            toolbar.appendChild(this.createButton('outdent', 'Decrease indent', this.createIcon('fas fa-indent fa-flip-horizontal')));
        }
        if (options.indent === true) {
            toolbar.appendChild(this.createButton('indent', 'Increase indent', this.createIcon('fas fa-indent')));
            toolbar.appendChild(this.createSeparator());
        }
        if (options.hyperlink === true) {
            toolbar.appendChild(this.createButton('createLink', 'Create Hyperlink', this.createIcon('fas fa-link')));
            toolbar.appendChild(this.createButton('removeLink', 'remove Hyperlink', this.createIcon('fas fa-unlink')));
        }
        if (options.removeFormat === true) {
            toolbar.appendChild(this.createButton('removeFormat', 'Clear formatting', this.createIcon('fas fa-eraser')));
        }
        return toolbar;
    };
    TinyEditor.prototype.rgbToHex = function (color) {
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
        if (digits !== null && digits.length > 5) {
            var red = parseInt(digits[2]);
            var green = parseInt(digits[3]);
            var blue = parseInt(digits[4]);
            var rgb = blue | (green << 8) | (red << 16);
            var color_hex = rgb.toString(16);
            var to = 6 - color_hex.length;
            for (var i = 0; i < to; i++) {
                color_hex = "0" + color_hex;
            }
            return digits[1] + '#' + color_hex;
        }
    };
    TinyEditor.prototype.saveSelection = function () {
        if (window.getSelection) {
            var selection = window.getSelection();
            if (selection !== null && selection.getRangeAt && selection.rangeCount) {
                var ranges = [];
                for (var i = 0, len = selection.rangeCount; i < len; ++i) {
                    ranges.push(selection.getRangeAt(i));
                }
                return ranges;
            }
        }
        throw new Error("window.getSelection() is not supported, by this browser.");
    };
    TinyEditor.prototype.restoreSelection = function (ranges) {
        if (ranges) {
            if (window.getSelection) {
                var current_selection = window.getSelection();
                if (current_selection !== null) {
                    current_selection.removeAllRanges();
                    for (var i = 0, len = ranges.length; i < len; ++i) {
                        current_selection.addRange(ranges[i]);
                    }
                    return true;
                }
            }
        }
        return false;
    };
    TinyEditor.prototype.getElementFromSelection = function (selection_range) {
        var selected_element = selection_range.startContainer;
        if (selected_element.parentElement !== null && selected_element.parentElement.tagName === "A") {
            return selected_element.parentElement;
        }
        else {
            if (selected_element.classList.contains("__editor")) {
                var link_elements = selected_element.querySelectorAll("a");
                if (link_elements.length === 1) {
                    return link_elements[0];
                }
            }
        }
        return null;
    };
    return TinyEditor;
}());
//# sourceMappingURL=tinyeditor.js.map