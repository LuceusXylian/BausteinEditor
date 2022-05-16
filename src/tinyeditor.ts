/// <reference path="dialog.ts"/>
var dialog = new Dialog();


class TinyEditor {
    TOOLBAR_ITEM: string = '__toolbar-item';
    editor: HTMLElement;
    callback_onchange: Function|null = null;

    createElement(_type: string, _id: string, _class: string): HTMLElement {
        var element = document.createElement(_type);
        if(_id !== "") element.id = _id;
        if(_class !== "") element.className = _class;
        return element;
    }

    constructor(editor: HTMLElement, options: any) {
        this.editor = editor;
        editor.classList.add("__editor");
        editor.setAttribute('contentEditable', "true");
        
        if(typeof options.onchange === "function") this.callback_onchange = options.onchange;
    
        // Create a toolbar
        const toolbar = this.createToolbar(options);
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


        // add active tag event
        document.addEventListener('selectionchange', () => {
            
            /*
            for(let i = 0; i < this.toolbarButtons.length; i++) {
              let button = this.toolbarButtons[i];
              
              // don't remove active class on code toggle button
              if(button.dataset.action === 'toggle-view') continue;
              
              button.classList.remove('active');
            }
            */
            
            var selection: any = window.getSelection();
            if(!editor.contains(selection.anchorNode.parentNode)) return false;
        });

        // add paste event
        editor.addEventListener('paste', (e: any) => {
            e.preventDefault();
            
            let text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertHTML', false, text);
            if(this.callback_onchange !== null) this.callback_onchange();
        });


        // add paragraph tag on new line
        editor.addEventListener('keypress', (e: KeyboardEvent) => {
            if ((e.keyCode || e.which) === 13) {
                // don't add a p tag on list item
                var selection: any = window.getSelection();
                if(selection !== null && selection.anchorNode.parentNode.tagName === 'LI') return;
                
                document.execCommand('formatBlock', false, 'p');
            }
            if(this.callback_onchange !== null) this.callback_onchange();
        });
    }

    

    execCommand(commandId: any, value: any) {
        switch (commandId) {
            case "createLink":
                console.log("execCommand() [createLink] value:", value);
                this.execCommandLink();
                break;
        
            default:
                document.execCommand(commandId, false, value);
                break;
        }
        this.editor.focus();
        if(this.callback_onchange !== null) this.callback_onchange();
    }

    execCommandLink() {  
        `<label for="linkValue">Link</label>
        <input type="text" id="linkValue" placeholder="http://example.com">
        <label for="new-tab">Open in new tab</label>
        <input type="checkbox" id="new-tab">`

        // TODO: check for current
        var selection_ranges = this.saveSelection();
        if (selection_ranges === null) {
            console.log("[TinyEditor] User tried to create a link without selecting text");
        } else {
            var dialog_content = document.createElement("div");
            var row1 = dialog_content.appendChild(document.createElement("div")); row1.className = "row";
            row1.style.marginBottom = "10px";
            var link_input = row1.appendChild(document.createElement("input"));
            link_input.id = "link_input";
            link_input.type = "text";
            link_input.className = "form-control";
            link_input.placeholder = "Link eingeben.. z.B.: http://example.com";
    
            var row2 = dialog_content.appendChild(document.createElement("div")); row2.className = "row";
            var link_new_tab_input = row2.appendChild(document.createElement("input"));
            link_new_tab_input.id = "link_new_tab_input";
            link_new_tab_input.type = "checkbox";
            var link_new_tab_input_label = row2.appendChild(document.createElement("label"));
            link_new_tab_input_label.setAttribute("for", "link_new_tab_input");
            link_new_tab_input_label.innerHTML = "neuer Tab";
            link_new_tab_input_label.style.userSelect = "none";
            link_new_tab_input_label.style.cursor = "pointer";
    
            dialog.start('Link eingeben', dialog_content, 'Link setzen', null, null, () => {
                var linkValue = link_input.value;
                var newTab = link_new_tab_input.checked;    
              
                if (selection_ranges !== null) this.restoreSelection(selection_ranges);
                
                var newSelection = window.getSelection();
                if(newSelection !== null && newSelection.toString()) {
                    var new_a_element = document.createElement('a');
                    new_a_element.href = linkValue;
                    if(newTab) new_a_element.target = '_blank';
                    newSelection.getRangeAt(0).surroundContents(new_a_element);
                }
          
                dialog.close();
            });  
        }
        
    }


    createButton(commandId: any, title: any, child: any){
        const button = document.createElement('button');
        button.dataset.commandId = commandId;
        button.className = this.TOOLBAR_ITEM;
        button.title = title;
        button.type = 'button';
        button.appendChild(child);
        button.addEventListener('click', () => this.execCommand(commandId, null));
      
        return button;
    }
    
    createOption(value: any, text: any, selected: any) {
        const option = document.createElement('option');
        option.innerText = text;
      
        if (value) option.setAttribute('value', value);
        if (selected) option.setAttribute('selected', selected);
      
        return option;
    }

    createSelect(commandId: any, title: any, options: any) {
        const select = document.createElement('select');
        select.dataset.commandId = commandId;
        select.className = this.TOOLBAR_ITEM;
        select.title = title;
        select.addEventListener('change', e => {
            const target: any = e.target;
            if (e.target === null) {
                return;
            } else {
                return this.execCommand(commandId,target.options[target.selectedIndex].value);
            }
        });
      
        for (const option of options) {
          select.appendChild(
            this.createOption(option.value, option.text, option.selected)
          );
        }
      
        return select;
    }
    
    createIcon(className: any) {
        const icon = document.createElement('i');
        icon.className = className;
    
        return icon;
    }
    
    createInput(commandId: any, title: any, type: any) {
        const input = document.createElement('input');
        input.dataset.commandId = commandId;
        input.className = this.TOOLBAR_ITEM;
        input.title = title;
        input.type = type;
        input.addEventListener('change', e => {
            const target: any = e.target;
            return this.execCommand(commandId, target.value);
        });
    
        return input;
    }
    
    createSeparator() {
        const separator = document.createElement('span');
        separator.className = '__toolbar-separator';
      
        return separator;
    }

    createToolbar(options: any) {
        const toolbar = document.createElement('div');
        toolbar.className = '__toolbar';
        console.log("options", options);
    
        // Styles
        if (options.formatblock === true) {
            toolbar.appendChild(
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
                        { value: 'pre', text: 'Preformatted' },
                    ])
            );
        }
    
        // Font
        if (options.fontname === true) {
            toolbar.appendChild(
                this.createSelect(
                    'fontname',
                    'Font',
                    [
                        { value: 'serif', text: 'Serif', selected: true },
                        { value: 'sans-serif', text: 'Sans Serif' },
                        { value: 'monospace', text: 'Monospace' },
                        { value: 'cursive', text: 'Cursive' },
                        { value: 'fantasy', text: 'Fantasy' },
                    ])
            );
        }
    
        // Bold
        if (options.bold === true) {
            toolbar.appendChild(
                this.createButton('bold', 'Bold', this.createIcon('fas fa-bold'))
            );
        }
    
        // Italic
        if (options.italic === true) {
            toolbar.appendChild(
                this.createButton('italic', 'Italic', this.createIcon('fas fa-italic'))
            );
        }
    
        // Underline
        if (options.underline === true) {
            toolbar.appendChild(
            this.createButton(
                'underline',
                'Underline',
                this.createIcon('fas fa-underline'))
            );
        }
    
        // Text color
        if (options.textcolor === true) {
            toolbar.appendChild(
            this.createInput('forecolor', 'Text color', 'color')
            );
        }
    
        // Separator
        //toolbar.appendChild(this.createSeparator());
    
        // Left align
        if (options.textleft === true) {
            toolbar.appendChild(this.createSeparator());

            toolbar.appendChild(
            this.createButton(
                'justifyleft',
                'Left align',
                this.createIcon('fas fa-align-left'))
            );
        }
    
        // Center align
        if (options.textcenter === true) {
            toolbar.appendChild(
            this.createButton(
                'justifycenter',
                'Center align',
                this.createIcon('fas fa-align-center'))
            );
        }
    
        // Right align
        if (options.textright === true) {
            toolbar.appendChild(
            this.createButton(
                'justifyright',
                'Right align',
                this.createIcon('fas fa-align-right'))
            );
        }
    
        // Separator
        //toolbar.appendChild(this.createSeparator());
    
        // Numbered list
        if (options.insertorderedlist === true) {
            toolbar.appendChild(this.createSeparator());

            toolbar.appendChild(
            this.createButton(
                'insertorderedlist',
                'Numbered list',
                this.createIcon('fas fa-list-ol'))
            );
        }
    
        // Bulleted list
        if (options.insertunorderedlist === true) {
            toolbar.appendChild(
            this.createButton(
                'insertunorderedlist',
                'Bulleted list',
                this.createIcon('fas fa-list-ul'))
            );
        }
    
        // Decrease indent
        if (options.outdent === true) {
            toolbar.appendChild(
            this.createButton(
                'outdent',
                'Decrease indent',
                this.createIcon('fas fa-indent fa-flip-horizontal'))
            );
        }
    
        // Increase indent
        if (options.indent === true) {
            toolbar.appendChild(
            this.createButton(
                'indent',
                'Increase indent',
                this.createIcon('fas fa-indent'))
            );

            toolbar.appendChild(this.createSeparator());
        }
    
    
        // Create Hyperlink
        if (options.hyperlink === true) {
            toolbar.appendChild(
            this.createButton(
                'createLink',
                'Create Hyperlink',
                this.createIcon('fas fa-link'))
            );
        }
    
        // Clear formatting
        if (options.removeFormat === true) {
            toolbar.appendChild(
            this.createButton(
                'removeFormat',
                'Clear formatting',
                this.createIcon('fas fa-eraser'))
            );
        }
    
        return toolbar;
    }
    
    rgbToHex(color: string) {
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
    }

    saveSelection(): Range[] | null {
        if(window.getSelection) {
            var selection = window.getSelection();
            if(selection !== null && selection.getRangeAt && selection.rangeCount) {
                let ranges = [];
                for(var i = 0, len = selection.rangeCount; i < len; ++i) {
                    ranges.push(selection.getRangeAt(i));
                }
                return ranges;
            }
        }
        return null;
    }
    
    restoreSelection(ranges: Range[]) {
        if(ranges) {
            if(window.getSelection) {
                var current_selection = window.getSelection();
                if(current_selection !== null) {
                    current_selection.removeAllRanges();
                    for(var i = 0, len = ranges.length; i < len; ++i) {
                        current_selection.addRange(ranges[i]);
                    }
                    return true;
                }
            }
        }
        return false;
    }
}