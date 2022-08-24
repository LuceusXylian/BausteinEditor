"use strict";
/// <reference path="dialog.ts"/>
/// <reference path="fontawsome_data.ts"/>
var dialog = new Dialog();
// enables usage of same Toolbar for multiple editors
var TinyEditorToolbar = /** @class */ (function () {
    function TinyEditorToolbar(targetElement, options) {
        var _this = this;
        this.TOOLBAR_ITEM = '__toolbar-item';
        this.toolbar_dom_items = [];
        this.selected_editor = null;
        this.icon_selector_modal_is_shown = false;
        this.icon_selector_modal_dom_resolve = null;
        this.toolbar_dom = targetElement;
        this.toolbar_dom.classList.add('__toolbar');
        this.icon_selector_modal_dom = document.body.appendChild(document.createElement("div"));
        this.icon_selector_modal_dom.className = "__icon-selector";
        this.icon_selector_modal_dom.style.display = "none";
        this.icon_selector_modal_dom_search = this.icon_selector_modal_dom.appendChild(document.createElement("input"));
        this.icon_selector_modal_dom_search.placeholder = "Suche nach Icon..";
        this.icon_selector_modal_dom_search.className = "__icon-selector-search form-control";
        this.icon_selector_modal_dom_search.addEventListener("input", function () {
            _this.icon_selector_modal_render(_this.icon_selector_modal_dom_search.value);
        });
        this.icon_selector_modal_dom_close = this.icon_selector_modal_dom.appendChild(document.createElement("div"));
        this.icon_selector_modal_dom_close.className = "__icon-selector-close";
        this.icon_selector_modal_dom_close.innerHTML = '<i class="fas fa-times" title="fas fa-times"></i>';
        this.icon_selector_modal_dom_close.addEventListener("click", function () { return _this.icon_selector_modal_close(); });
        this.icon_selector_modal_dom_content = this.icon_selector_modal_dom.appendChild(document.createElement("div"));
        this.icon_selector_modal_dom_content.className = "__icon-selector-content";
        // Styles
        if (options.formatblock === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSelect('formatblock', 'Styles', [
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
        // Font
        if (options.fontname === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSelect('fontname', 'Font', [
                { value: 'serif', text: 'Serif', selected: true },
                { value: 'sans-serif', text: 'Sans Serif' },
                { value: 'monospace', text: 'Monospace' },
                { value: 'cursive', text: 'Cursive' },
                { value: 'fantasy', text: 'Fantasy' },
            ]));
        }
        // Bold
        if (options.bold === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('bold', 'Bold', this.createIcon('fas fa-bold')));
        }
        // Italic
        if (options.italic === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('italic', 'Italic', this.createIcon('fas fa-italic')));
        }
        // Underline
        if (options.underline === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('underline', 'Underline', this.createIcon('fas fa-underline')));
        }
        // Text color
        if (options.textcolor === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createInput('forecolor', 'Text color', 'color'));
        }
        // Left align
        if (options.textleft === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('justifyleft', 'Left align', this.createIcon('fas fa-align-left')));
        }
        // Center align
        if (options.textcenter === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('justifycenter', 'Center align', this.createIcon('fas fa-align-center')));
        }
        // Right align
        if (options.textright === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('justifyright', 'Right align', this.createIcon('fas fa-align-right')));
        }
        // Numbered list
        if (options.insertorderedlist === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('insertorderedlist', 'Numbered list', this.createIcon('fas fa-list-ol')));
        }
        // Bulleted list
        if (options.insertunorderedlist === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('insertunorderedlist', 'Bulleted list', this.createIcon('fas fa-list-ul')));
        }
        // Decrease indent
        if (options.outdent === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('outdent', 'Decrease indent', this.createIcon('fas fa-indent fa-flip-horizontal')));
        }
        // Increase indent
        if (options.indent === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('indent', 'Increase indent', this.createIcon('fas fa-indent')));
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());
        }
        // Clear formatting
        if (options.removeFormat === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('removeFormat', 'Clear formatting', this.createIcon('fas fa-eraser')));
        }
        // Create image
        if (options.image === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('createImage', 'Create Image', this.createIcon('fas fa-image')));
        }
        // Create image
        if (options.image === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('createIcon', 'Create Icon', this.createIcon('fab fa-font-awesome-flag')));
        }
        // Create Hyperlink
        if (options.hyperlink === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('createLink', 'Create Hyperlink', this.createIcon('fas fa-link')));
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createButton('removeLink', 'remove Hyperlink', this.createIcon('fas fa-unlink')));
        }
        // Events
        this.toolbar_dom.addEventListener('click', function () { return _this.updateActiveState(); });
    }
    TinyEditorToolbar.prototype.icon_selector_modal_close = function () {
        this.icon_selector_modal_is_shown = false;
        this.icon_selector_modal_dom.style.display = "none";
        this.icon_selector_modal_dom_resolve = null;
    };
    TinyEditorToolbar.prototype.icon_selector_modal_render = function (search_text) {
        var _this = this;
        this.icon_selector_modal_dom_content.innerHTML = '';
        var _loop_1 = function (i) {
            var icon_class = FONTAWSOME_DATA.icons[i];
            if (search_text === "" || icon_class.indexOf(search_text) !== -1) {
                var icon_1 = this_1.icon_selector_modal_dom_content.appendChild(document.createElement("i"));
                icon_1.className = icon_class;
                icon_1.title = icon_class;
                icon_1.addEventListener("click", function () {
                    if (_this.icon_selector_modal_dom_resolve === null) {
                        console.error("this.icon_selector_modal_dom_resolve is null");
                    }
                    else {
                        _this.icon_selector_modal_dom_resolve(icon_1.className);
                    }
                    _this.icon_selector_modal_close();
                });
            }
        };
        var this_1 = this;
        for (var i = 0; i < FONTAWSOME_DATA.icons.length; i++) {
            _loop_1(i);
        }
    };
    TinyEditorToolbar.prototype.icon_selector_modal = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.icon_selector_modal_is_shown) {
                _this.icon_selector_modal_close();
                reject();
            }
            else {
                _this.icon_selector_modal_is_shown = true;
                _this.icon_selector_modal_dom.style.display = "";
                _this.icon_selector_modal_dom_resolve = resolve;
                _this.icon_selector_modal_render("");
            }
        });
    };
    TinyEditorToolbar.prototype.updateActiveState = function () {
        var toolbarSelects = this.toolbar_dom.querySelectorAll('select[data-command-id]');
        var _loop_2 = function () {
            var select = toolbarSelects[i];
            var value = document.queryCommandValue(select.dataset.commandId);
            var option = Array.from(select.options).find(function (_option) {
                var option = _option;
                return option.value === value;
            });
            select.selectedIndex = option ? option.index : -1;
        };
        for (var i = 0; i < toolbarSelects.length; i++) {
            _loop_2();
        }
        var toolbarButtons = this.toolbar_dom.querySelectorAll('button[data-command-id]');
        for (var i = 0; i < toolbarButtons.length; i++) {
            var button = toolbarButtons[i];
            var active = document.queryCommandState(button.dataset.commandId);
            button.classList.toggle('active', active);
        }
        var inputButtons = this.toolbar_dom.querySelectorAll('input[data-command-id]');
        for (var i = 0; i < inputButtons.length; i++) {
            var input = inputButtons[i];
            var value = document.queryCommandValue(input.dataset.commandId);
            var converted_value = this.rgbToHex(value);
            if (converted_value)
                input.value = converted_value;
        }
    };
    TinyEditorToolbar.prototype.rgbToHex = function (color) {
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
    TinyEditorToolbar.prototype.createButton = function (commandId, title, child) {
        var _this = this;
        var button = document.createElement('button');
        button.dataset.commandId = commandId;
        button.className = this.TOOLBAR_ITEM;
        button.title = title;
        button.type = 'button';
        button.appendChild(child);
        button.addEventListener('click', function () { if (_this.selected_editor !== null)
            _this.selected_editor.execCommand(commandId, null); });
        return button;
    };
    TinyEditorToolbar.prototype.createOption = function (value, text, selected) {
        var option = document.createElement('option');
        option.innerText = text;
        if (value)
            option.setAttribute('value', value);
        if (selected)
            option.setAttribute('selected', selected);
        return option;
    };
    TinyEditorToolbar.prototype.createSelect = function (commandId, title, options) {
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
                if (_this.selected_editor !== null)
                    return _this.selected_editor.execCommand(commandId, target.options[target.selectedIndex].value);
            }
        });
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            select.appendChild(this.createOption(option.value, option.text, option.selected));
        }
        return select;
    };
    TinyEditorToolbar.prototype.createIcon = function (className) {
        var icon = document.createElement('i');
        icon.className = className;
        return icon;
    };
    TinyEditorToolbar.prototype.createInput = function (commandId, title, type) {
        var _this = this;
        var input = document.createElement('input');
        input.dataset.commandId = commandId;
        input.className = this.TOOLBAR_ITEM;
        input.title = title;
        input.type = type;
        input.addEventListener('change', function (e) {
            var target = e.target;
            if (_this.selected_editor !== null)
                return _this.selected_editor.execCommand(commandId, target.value);
        });
        return input;
    };
    TinyEditorToolbar.prototype.createSeparator = function () {
        var separator = document.createElement('span');
        separator.className = '__toolbar-separator';
        return separator;
    };
    TinyEditorToolbar.prototype.showAllItems = function () {
        for (var i = 0; i < this.toolbar_dom_items.length; i++) {
            this.toolbar_dom_items[i].style.display = "";
        }
    };
    TinyEditorToolbar.prototype.hideAllItems = function () {
        for (var i = 0; i < this.toolbar_dom_items.length; i++) {
            this.toolbar_dom_items[i].style.display = "none";
        }
    };
    TinyEditorToolbar.prototype.showTheseItems = function (commandIds) {
        for (var a = 0; a < this.toolbar_dom_items.length; a++) {
            var item = this.toolbar_dom_items[a];
            item.style.display = "none";
            for (var b = 0; b < commandIds.length; b++) {
                var commandId = commandIds[b];
                if (item.getAttribute("data-command-id") === commandId) {
                    item.style.display = "";
                    break;
                }
            }
        }
    };
    return TinyEditorToolbar;
}());
var TinyEditor = /** @class */ (function () {
    function TinyEditor(editor, options) {
        var _this = this;
        this.callback_onchange = null;
        this.editor = editor;
        editor.classList.add("__editor");
        editor.setAttribute('contentEditable', "true");
        if (typeof options.onchange === "function")
            this.callback_onchange = options.onchange;
        this.callback_exec_command_create_image = options.exec_command_create_image;
        // Create a toolbar
        if (options.toolbar === null) {
            var toolbar_dom = this.editor.appendChild(document.createElement("div"));
            this.toolbar = new TinyEditorToolbar(toolbar_dom, options.tinyeditor_toolbar_options);
            this.toolbar.selected_editor = this;
        }
        else {
            this.toolbar = options.toolbar;
        }
        this.callback_onchange = options.onchange;
        // Listen for events to detect where the caret is
        editor.addEventListener('focusin', function () { _this.toolbar.selected_editor = _this; });
        editor.addEventListener('keydown', function () { return _this.toolbar.updateActiveState(); });
        editor.addEventListener('keyup', function () { return _this.toolbar.updateActiveState(); });
        editor.addEventListener('click', function () { return _this.toolbar.updateActiveState(); });
        document.addEventListener('selectionchange', function () {
            var selection = window.getSelection();
            if (selection.anchorNode !== null && !editor.contains(selection.anchorNode.parentNode))
                return false;
        });
        // add paste event
        editor.addEventListener('paste', function (e) {
            e.preventDefault();
            console.log("[TinyEditor] Paste event", e.clipboardData);
            if (e.clipboardData !== null) {
                var text = e.clipboardData.getData('text/plain');
                // delete html, head, body, img tags from text
                text = text.replace(/<html[^>]*>/gi, "");
                text = text.replace(/<\/html>/gi, "");
                text = text.replace(/<head[^>]*>/gi, "");
                text = text.replace(/<\/head>/gi, "");
                text = text.replace(/<body[^>]*>/gi, "");
                text = text.replace(/<\/body>/gi, "");
                text = text.replace(/<img[^>]*>/gi, "");
                document.execCommand('insertHTML', false, text);
                if (_this.callback_onchange !== null)
                    _this.callback_onchange();
            }
        });
        // add paragraph tag on new line
        editor.addEventListener('keypress', function (e) {
            if ((e.keyCode || e.which) === 13) {
                // don't add a p tag on list item
                var selection = window.getSelection();
                if (selection !== null && selection.anchorNode.parentNode.tagName === 'LI')
                    return;
                document.execCommand('formatBlock', false, 'p');
            }
        });
        // keyup for correct change event
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
            case "createImage":
                this.execCommand_createImage();
                break;
            case "createIcon":
                this.execCommand_createIcon();
                break;
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
    TinyEditor.prototype.execCommand_createImage = function () {
        var _this = this;
        var selection_ranges = this.saveSelection();
        if (selection_ranges.length === 0) {
            console.log("[TinyEditor] User tried to create a image without selecting text");
        }
        else {
            if (!this.editor.contains(selection_ranges[0].startContainer.parentNode)
                && selection_ranges[0].startContainer.parentNode === null || this.editor !== selection_ranges[0].startContainer.parentNode) {
                console.log("[TinyEditor] User tried to create a image without selecting text");
                this.editor.focus();
                selection_ranges = this.saveSelection();
            }
            var selected_element_1 = this.getElementFromSelection(selection_ranges[0]);
            this.callback_exec_command_create_image().then(function (image_url) {
                if (selected_element_1 === null) {
                    if (selection_ranges !== null)
                        _this.restoreSelection(selection_ranges);
                    var newSelection = window.getSelection();
                    if (newSelection !== null) {
                        var new_element_1 = _this.render_image_div(image_url, "200px", "200px");
                        newSelection.getRangeAt(0).insertNode(new_element_1);
                        setTimeout(function () { return new_element_1.focus(); }, 100);
                    }
                }
                else {
                    selected_element_1.style.backgroundImage = "url('" + image_url + "')";
                }
                if (_this.callback_onchange !== null)
                    _this.callback_onchange();
            });
        }
    };
    TinyEditor.prototype.execCommand_createIcon = function () {
        var _this = this;
        var selection_ranges = this.saveSelection();
        if (selection_ranges.length === 0) {
            console.info("[TinyEditor] User tried to create a icon without selecting text");
        }
        else {
            if (!this.editor.contains(selection_ranges[0].startContainer.parentNode)
                && selection_ranges[0].startContainer.parentNode === null || this.editor !== selection_ranges[0].startContainer.parentNode) {
                console.info("[TinyEditor] User tried to create a icon without selecting text");
                this.editor.focus();
                selection_ranges = this.saveSelection();
            }
            var selected_element_2 = this.getElementFromSelection(selection_ranges[0]);
            this.toolbar.icon_selector_modal().then(function (className) {
                if (selected_element_2 === null) {
                    if (selection_ranges !== null)
                        _this.restoreSelection(selection_ranges);
                    var newSelection = window.getSelection();
                    if (newSelection !== null) {
                        var new_element_2 = document.createElement("i");
                        new_element_2.className = className;
                        newSelection.getRangeAt(0).insertNode(new_element_2);
                        setTimeout(function () { return new_element_2.focus(); }, 100);
                    }
                }
                else {
                    selected_element_2.className = className;
                }
                if (_this.callback_onchange !== null)
                    _this.callback_onchange();
            });
        }
    };
    TinyEditor.prototype.render_image_div = function (image_url, width, height) {
        var _this = this;
        console.log("[TinyEditor] render_image_div");
        var new_element = document.createElement('div');
        new_element.contentEditable = "false";
        new_element.className = "image";
        new_element.style.maxWidth = "100%";
        new_element.style.width = width;
        new_element.style.height = height;
        new_element.style.resize = "both";
        new_element.style.overflow = "hidden";
        new_element.style.backgroundRepeat = "no-repeat";
        new_element.style.backgroundSize = "contain";
        new_element.style.backgroundImage = "url('" + image_url + "')";
        // resize image
        // get image natural size and set it to the attributes of the new element
        var img = new Image();
        img.src = image_url;
        img.onload = function () {
            new_element.dataset.width = img.naturalWidth.toString();
            new_element.dataset.height = img.naturalHeight.toString();
            new_element.style.height = new_element.clientWidth * (img.naturalHeight / img.naturalWidth) + "px";
            var ratio = img.naturalHeight / img.naturalWidth;
            if (!ratio) {
                console.error("[TinyEditor] Image has no ratio");
            }
            else {
                new_element.onmousemove = function () {
                    setTimeout(function () {
                        new_element.style.height = (new_element.clientWidth * ratio) + "px";
                    }, 1);
                };
                new_element.onmouseup = function () {
                    if (_this.callback_onchange !== null)
                        _this.callback_onchange();
                };
            }
        };
        // Context Menu
        var lux_context_menu = new LuxContextMenu(new_element);
        var context_menu_items = [];
        // float none
        var item = document.createElement("div");
        item.innerHTML = "Kein Textumlauf";
        item.addEventListener('click', function () {
            new_element.style.float = "";
            lux_context_menu.close();
            if (_this.callback_onchange !== null)
                _this.callback_onchange();
        });
        context_menu_items.push(item);
        // float left
        var item = document.createElement("div");
        item.innerHTML = "Textumlauf, Bild links";
        item.addEventListener('click', function () {
            new_element.style.float = "left";
            lux_context_menu.close();
            if (_this.callback_onchange !== null)
                _this.callback_onchange();
        });
        context_menu_items.push(item);
        // float right
        var item = document.createElement("div");
        item.innerHTML = "Textumlauf, Bild rechts";
        item.addEventListener('click', function () {
            new_element.style.float = "right";
            lux_context_menu.close();
            if (_this.callback_onchange !== null)
                _this.callback_onchange();
        });
        context_menu_items.push(item);
        lux_context_menu.set_items(context_menu_items);
        return new_element;
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
            row1.style.marginBottom = "10px";
            var link_input = row1.appendChild(document.createElement("input"));
            link_input.id = "link_input";
            link_input.type = "text";
            link_input.className = "be-form-control";
            link_input.placeholder = "Link eingeben.. z.B.: http://example.com";
            var row2 = dialog_content.appendChild(document.createElement("div"));
            row2.style.marginBottom = "10px";
            var link_new_tab_input = row2.appendChild(document.createElement("input"));
            link_new_tab_input.id = "link_new_tab_input";
            link_new_tab_input.type = "checkbox";
            link_new_tab_input.style.marginRight = "4px";
            var link_new_tab_input_label = row2.appendChild(document.createElement("label"));
            link_new_tab_input_label.setAttribute("for", "link_new_tab_input");
            link_new_tab_input_label.innerHTML = "neuer Tab";
            link_new_tab_input_label.style.userSelect = "none";
            link_new_tab_input_label.style.cursor = "pointer";
            // link-marker class toggler 
            var row3 = dialog_content.appendChild(document.createElement("div"));
            row3.style.marginBottom = "10px";
            var link_marker_input = row3.appendChild(document.createElement("input"));
            link_marker_input.id = "link_marker_input";
            link_marker_input.type = "checkbox";
            link_marker_input.style.marginRight = "4px";
            var link_marker_input_label = row3.appendChild(document.createElement("label"));
            link_marker_input_label.setAttribute("for", "link_marker_input");
            link_marker_input_label.innerHTML = "Link-Marker";
            link_marker_input_label.className = "link-marker";
            link_marker_input_label.style.userSelect = "none";
            link_marker_input_label.style.cursor = "pointer";
            // class
            var row4 = dialog_content.appendChild(document.createElement("div"));
            var class_input = row4.appendChild(document.createElement("input"));
            class_input.id = "class_input";
            class_input.type = "text";
            class_input.className = "be-form-control";
            class_input.placeholder = "Class eingeben.. z.B.: link-marker";
            // if exists: get selected AnchorElement
            var selected_element = this.getElementFromSelection(selection_ranges[0]);
            if (selected_element !== null) {
                link_input.value = selected_element.href;
                link_new_tab_input.checked = selected_element.target === "_blank";
                link_marker_input.checked = selected_element.className.includes("link-marker");
                class_input.value = selected_element.className;
            }
            // Events
            link_marker_input.addEventListener('change', function () {
                var class_value_split = class_input.value.split(" ");
                if (link_marker_input.checked) {
                    if (!class_value_split.includes("link-marker"))
                        class_value_split.push("link-marker");
                }
                else {
                    class_value_split.splice(class_value_split.indexOf("link-marker"), 1);
                }
                class_input.value = class_value_split.join(" ");
            });
            class_input.addEventListener('change', function () {
                var class_value_split = class_input.value.split(" ");
                link_marker_input.checked = class_value_split.includes("link-marker");
            });
            dialog.start('Link eingeben', dialog_content, 'Link setzen', null, null, function () {
                var linkValue = link_input.value;
                var newTab = link_new_tab_input.checked;
                if (selection_ranges !== null)
                    _this.restoreSelection(selection_ranges);
                var newSelection = window.getSelection();
                if (newSelection !== null && newSelection.toString()) {
                    var new_a_element = document.createElement('a');
                    new_a_element.href = linkValue;
                    new_a_element.className = class_input.value;
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
        console.log("selection_range", selection_range);
        console.log("selected_element", selected_element);
        if (selected_element.parentElement !== null && selected_element.parentElement.tagName === "A") {
            return selected_element.parentElement;
        }
        else if (selected_element.nodeName !== "#text") {
            // if is editor it self, check if only one link exists
            if (selected_element.classList.contains("__editor")) {
                var link_elements = selected_element.querySelectorAll("a");
                if (link_elements.length === 1) {
                    return link_elements[0];
                }
            }
        }
        return null;
    };
    TinyEditor.prototype.import = function (content) {
        this.editor.innerHTML = content;
        var images = this.editor.getElementsByTagName("img");
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            var image_url = image.src;
            image.replaceWith(this.render_image_div(image_url, image.style.width, image.style.height));
        }
    };
    TinyEditor.prototype.export = function () {
        var content = "";
        this.editor.childNodes.forEach(function (node) {
            if (node.nodeName === "#text") {
                content += node.textContent;
            }
            else {
                var html_element = node;
                if (html_element.className === "image") {
                    var image_url = html_element.style.backgroundImage.replace("url(", "").replace(")", "").replace('"', "").replace('"', "");
                    var style = 'max-width: 100%; height: auto; width: ' + html_element.clientWidth + 'px;';
                    if (html_element.style.float)
                        style += ' float: ' + html_element.style.float + ';';
                    content += '<img src="' + image_url + '" class="image" style="' + style + '">';
                }
                else if (html_element.tagName === "A") {
                    content += html_element.outerHTML;
                    console.log("html_element.outerHTML", html_element.outerHTML);
                }
                else {
                    content += html_element.outerHTML;
                }
            }
        });
        return content;
    };
    return TinyEditor;
}());
var LuxContextMenu = /** @class */ (function () {
    function LuxContextMenu(target) {
        var _this = this;
        this.context_menu_items = [];
        this.target = target;
        var context_menu = document.getElementById("lux-context-menu");
        if (context_menu === null) {
            context_menu = document.body.appendChild(document.createElement("div"));
            context_menu.id = "lux-context-menu";
            context_menu.className = "__context_menu";
            context_menu.style.display = "none";
            // close context menu on click outside
            document.addEventListener('click', function (e) {
                if (e.target !== _this.context_menu) {
                    _this.context_menu.style.display = "none";
                }
            });
        }
        this.context_menu = context_menu;
        this.target.oncontextmenu = function (e) {
            e.preventDefault();
            _this.context_menu.innerHTML = '';
            for (var i = 0; i < _this.context_menu_items.length; i++) {
                _this.context_menu.appendChild(_this.context_menu_items[i]);
            }
            _this.context_menu.style.top = e.clientY + "px";
            _this.context_menu.style.left = e.clientX + "px";
            _this.context_menu.style.display = "block";
        };
    }
    LuxContextMenu.prototype.set_items = function (items) {
        this.context_menu_items = items;
        for (var i = 0; i < this.context_menu_items.length; i++) {
            this.context_menu_items[i].className = "__context_menu_item";
        }
        return this;
    };
    LuxContextMenu.prototype.close = function () {
        this.context_menu.style.display = "none";
    };
    return LuxContextMenu;
}());
