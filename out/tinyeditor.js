"use strict";
var TinyEditor = {
    TOOLBAR_ITEM: '__toolbar-item',
    createButton: function (commandId, title, children, execCommand) {
        var button = document.createElement('button');
        button.dataset.commandId = commandId;
        button.className = this.TOOLBAR_ITEM;
        button.title = title;
        button.type = 'button';
        button.insertAdjacentElement("beforeend", children);
        button.addEventListener('click', function () { return execCommand(commandId); });
        return button;
    },
    createOption: function (value, text, selected) {
        var option = document.createElement('option');
        option.innerText = text;
        if (value) {
            option.setAttribute('value', value);
        }
        if (selected) {
            option.setAttribute('selected', selected);
        }
        return option;
    },
    createSelect: function (commandId, title, options, execCommand) {
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
                return execCommand(commandId, target.options[target.selectedIndex].value);
            }
        });
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            select.insertAdjacentElement("beforeend", this.createOption(option.value, option.text, option.selected));
        }
        return select;
    },
    createIcon: function (className) {
        var icon = document.createElement('i');
        icon.className = className;
        return icon;
    },
    createInput: function (commandId, title, type, execCommand) {
        var input = document.createElement('input');
        input.dataset.commandId = commandId;
        input.className = this.TOOLBAR_ITEM;
        input.title = title;
        input.type = type;
        input.addEventListener('change', function (e) {
            var target = e.target;
            return execCommand(commandId, target.value);
        });
        return input;
    },
    createSeparator: function () {
        var separator = document.createElement('span');
        separator.className = '__toolbar-separator';
        return separator;
    },
    createToolbar: function (options, execCommand) {
        var toolbar = document.createElement('div');
        toolbar.className = '__toolbar';
        if (options.formatblock != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createSelect('formatblock', 'Styles', [
                { value: 'h1', text: 'Title 1' },
                { value: 'h2', text: 'Title 2' },
                { value: 'h3', text: 'Title 3' },
                { value: 'h4', text: 'Title 4' },
                { value: 'h5', text: 'Title 5' },
                { value: 'h6', text: 'Title 6' },
                { value: 'p', text: 'Paragraph', selected: true },
                { value: 'pre', text: 'Preformatted' }
            ], execCommand));
        }
        if (options.fontname != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createSelect('fontname', 'Font', [
                { value: 'serif', text: 'Serif', selected: true },
                { value: 'sans-serif', text: 'Sans Serif' },
                { value: 'monospace', text: 'Monospace' },
                { value: 'cursive', text: 'Cursive' },
                { value: 'fantasy', text: 'Fantasy' }
            ], execCommand));
        }
        if (options.bold != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('bold', 'Bold', this.createIcon('fas fa-bold'), execCommand));
        }
        if (options.italic != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('italic', 'Italic', this.createIcon('fas fa-italic'), execCommand));
        }
        if (options.underline != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('underline', 'Underline', this.createIcon('fas fa-underline'), execCommand));
        }
        if (options.forecolor != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createInput('forecolor', 'Text color', 'color', execCommand));
        }
        if (options.justifyleft != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('justifyleft', 'Left align', this.createIcon('fas fa-align-left'), execCommand));
        }
        if (options.justifycenter != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('justifycenter', 'Center align', this.createIcon('fas fa-align-center'), execCommand));
        }
        if (options.justifyright != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('justifyright', 'Right align', this.createIcon('fas fa-align-right'), execCommand));
        }
        if (options.insertorderedlist != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('insertorderedlist', 'Numbered list', this.createIcon('fas fa-list-ol'), execCommand));
        }
        if (options.insertunorderedlist != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('insertunorderedlist', 'Bulleted list', this.createIcon('fas fa-list-ul'), execCommand));
        }
        if (options.outdent != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('outdent', 'Decrease indent', this.createIcon('fas fa-indent fa-flip-horizontal'), execCommand));
        }
        if (options.indent != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('indent', 'Increase indent', this.createIcon('fas fa-indent'), execCommand));
        }
        if (options.removeFormat != 0) {
            toolbar.insertAdjacentElement("beforeend", this.createButton('removeFormat', 'Clear formatting', this.createIcon('fas fa-eraser'), execCommand));
        }
        return toolbar;
    },
    rgbToHex: function (color) {
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
    },
    transformToEditor: function (editor) {
        editor.setAttribute('contentEditable', true);
        editor.classList.add("__editor");
        var execCommand = function (commandId, value) {
            document.execCommand(commandId, false, value);
            editor.focus();
        };
        execCommand('defaultParagraphSeparator', 'p');
        var toolbar = this.createToolbar(editor.dataset, execCommand);
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
    }
};
//# sourceMappingURL=tinyeditor.js.map