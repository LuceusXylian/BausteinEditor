const TinyEditor = {
    TOOLBAR_ITEM:  '__toolbar-item',

    createButton: function(commandId: any, title: any, children: any, execCommand: any){
        const button = document.createElement('button');
        button.dataset.commandId = commandId;
        button.className = this.TOOLBAR_ITEM;
        button.title = title;
        button.type = 'button';
        button.insertAdjacentElement("beforeend", children);
        button.addEventListener('click', () => execCommand(commandId));
      
        return button;
    },
    
    createOption: function(value: any, text: any, selected: any) {
        const option = document.createElement('option');
        option.innerText = text;
      
        if (value) {
          option.setAttribute('value', value);
        }
      
        if (selected) {
          option.setAttribute('selected', selected);
        }
      
        return option;
    },
      
    createSelect: function(commandId: any, title: any, options: any, execCommand: any) {
        const select = document.createElement('select');
        select.dataset.commandId = commandId;
        select.className = this.TOOLBAR_ITEM;
        select.title = title;
        select.addEventListener('change', e => {
            const target: any = e.target;
            if (e.target === null) {
                return;
            } else {
                return execCommand(commandId,target.options[target.selectedIndex].value);
            }
        });
      
        for (const option of options) {
          select.insertAdjacentElement(
            "beforeend",
            this.createOption(option.value, option.text, option.selected)
          );
        }
      
        return select;
    },
    
    createIcon: function(className: any) {
        const icon = document.createElement('i');
        icon.className = className;
    
        return icon;
    },
    
    createInput: function(commandId: any, title: any, type: any, execCommand: any) {
        const input = document.createElement('input');
        input.dataset.commandId = commandId;
        input.className = this.TOOLBAR_ITEM;
        input.title = title;
        input.type = type;
        input.addEventListener('change', e => {
            const target: any = e.target;
            return execCommand(commandId, target.value);
        });
    
        return input;
    },
    
    createSeparator: function() {
        const separator = document.createElement('span');
        separator.className = '__toolbar-separator';
      
        return separator;
    },
      
    createToolbar: function(options: any, execCommand: any) {
        const toolbar = document.createElement('div');
        toolbar.className = '__toolbar';
    
        // Styles
        if (options.formatblock != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createSelect(
                'formatblock',
                'Styles',
                [
                { value: 'h1', text: 'Title 1' },
                { value: 'h2', text: 'Title 2' },
                { value: 'h3', text: 'Title 3' },
                { value: 'h4', text: 'Title 4' },
                { value: 'h5', text: 'Title 5' },
                { value: 'h6', text: 'Title 6' },
                { value: 'p', text: 'Paragraph', selected: true },
                { value: 'pre', text: 'Preformatted' }
                ],
                execCommand
            )
            );
        }
    
        // Font
        if (options.fontname != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createSelect(
                'fontname',
                'Font',
                [
                { value: 'serif', text: 'Serif', selected: true },
                { value: 'sans-serif', text: 'Sans Serif' },
                { value: 'monospace', text: 'Monospace' },
                { value: 'cursive', text: 'Cursive' },
                { value: 'fantasy', text: 'Fantasy' }
                ],
                execCommand
            )
            );
        }
    
        // Bold
        if (options.bold != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton('bold', 'Bold', this.createIcon('fas fa-bold'), execCommand)
            );
        }
    
        // Italic
        if (options.italic != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton('italic', 'Italic', this.createIcon('fas fa-italic'), execCommand)
            );
        }
    
        // Underline
        if (options.underline != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'underline',
                'Underline',
                this.createIcon('fas fa-underline'),
                execCommand
            )
            );
        }
    
        // Text color
        if (options.forecolor != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createInput('forecolor', 'Text color', 'color', execCommand)
            );
        }
    
        // Separator
        //toolbar.insertAdjacentElement("beforeend", this.createSeparator());
    
        // Left align
        if (options.justifyleft != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'justifyleft',
                'Left align',
                this.createIcon('fas fa-align-left'),
                execCommand
            )
            );
        }
    
        // Center align
        if (options.justifycenter != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'justifycenter',
                'Center align',
                this.createIcon('fas fa-align-center'),
                execCommand
            )
            );
        }
    
        // Right align
        if (options.justifyright != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'justifyright',
                'Right align',
                this.createIcon('fas fa-align-right'),
                execCommand
            )
            );
        }
    
        // Separator
        //toolbar.insertAdjacentElement("beforeend", this.createSeparator());
    
        // Numbered list
        if (options.insertorderedlist != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'insertorderedlist',
                'Numbered list',
                this.createIcon('fas fa-list-ol'),
                execCommand
            )
            );
        }
    
        // Bulleted list
        if (options.insertunorderedlist != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'insertunorderedlist',
                'Bulleted list',
                this.createIcon('fas fa-list-ul'),
                execCommand
            )
            );
        }
    
        // Decrease indent
        if (options.outdent != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'outdent',
                'Decrease indent',
                this.createIcon('fas fa-indent fa-flip-horizontal'),
                execCommand
            )
            );
        }
    
        // Increase indent
        if (options.indent != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'indent',
                'Increase indent',
                this.createIcon('fas fa-indent'),
                execCommand
            )
            );
        }
    
        // Separator
        //toolbar.insertAdjacentElement("beforeend", this.createSeparator());
    
        // Clear formatting
        if (options.removeFormat != 0) {
            toolbar.insertAdjacentElement(
            "beforeend",
            this.createButton(
                'removeFormat',
                'Clear formatting',
                this.createIcon('fas fa-eraser'),
                execCommand
            )
            );
        }
    
        return toolbar;
    },
    
    rgbToHex: function(color: string) {
        const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
        if (digits !== null && digits.length > 5) {
            const red = parseInt(digits[2]);
            const green = parseInt(digits[3]);
            const blue = parseInt(digits[4]);
            const rgb = blue | (green << 8) | (red << 16);
        
            var color_hex = rgb.toString(16);
            var to = 6 - color_hex.length;
            for (let i = 0; i < to; i++) {
                color_hex = "0" + color_hex;
            }
            return digits[1] + '#' + color_hex;
        }
    },
      
    transformToEditor: function(editor: any) {
        // Indicate that the element is editable
        editor.setAttribute('contentEditable', true);
    
        // Add a custom class
        editor.classList.add("__editor");
    
        // Create an exec command function
        const execCommand = function(commandId: any, value: any) {
            document.execCommand(commandId, false, value);
            editor.focus();
        }
    
        // Set default paragraph to <p>
        execCommand('defaultParagraphSeparator', 'p');
    
        // Create a toolbar
        const toolbar = this.createToolbar(editor.dataset, execCommand);
        editor.insertAdjacentElement("beforebegin", toolbar);
    
        // Listen for events to detect where the caret is
        const self = this;
        const updateActiveState = function() {
            const toolbarSelects = toolbar.querySelectorAll('select[data-command-id]');
            for (var i=0; i<toolbarSelects.length; i++) {
                const select: any = toolbarSelects[i];
                const value = document.queryCommandValue(select.dataset.commandId);
                const option: any = Array.from(select.options).find(
                    _option => {
                        const option: any = _option;
                        return option.value === value;
                    }
                );
                select.selectedIndex = option ? option.index : -1;
            }
    
            const toolbarButtons = toolbar.querySelectorAll('button[data-command-id]');
            for (var i=0; i<toolbarButtons.length; i++) {
                const button: any = toolbarButtons[i];
                const active = document.queryCommandState(button.dataset.commandId);
                button.classList.toggle('active', active);
            }
    
            const inputButtons = toolbar.querySelectorAll('input[data-command-id]');
            for (var i=0; i<inputButtons.length; i++) {
                const input: any = inputButtons[i];
                const value = document.queryCommandValue(input.dataset.commandId);
                input.value = self.rgbToHex(value);
            }
        }
        editor.addEventListener('keydown', updateActiveState);
        editor.addEventListener('keyup', updateActiveState);
        editor.addEventListener('click', updateActiveState);
        toolbar.addEventListener('click', updateActiveState);
    }
}