// deno-lint-ignore-file no-window
import { Dialog } from './dialog.ts';
import { FONTAWSOME_DATA } from './fontawsome_data.ts';


export interface ExecCommandCreateImage {
    (): Promise<string>;
}

export interface TinyEditorOptions {
    toolbar: TinyEditorToolbar|null;
    onchange: (()=>void)|null;
    exec_command_create_image: ExecCommandCreateImage;
    tinyeditor_toolbar_options: TinyEditorToolbarOptions;
}

export interface TinyEditorToolbarOptions {
    formatblock: boolean;
    fontname: boolean;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    textcolor: boolean;
    textleft: boolean;
    textcenter: boolean;
    textright: boolean;
    insertorderedlist: boolean;
    insertunorderedlist: boolean;
    outdent: boolean;
    indent: boolean;
    removeFormat: boolean;
    image: boolean;
    icons: boolean;
    hyperlink: boolean;
}

// enables usage of same Toolbar for multiple editors
export class TinyEditorToolbar {
    TOOLBAR_ITEM: string = '__toolbar-item';
    toolbar_dom: HTMLElement;
    toolbar_dom_items: HTMLElement[] = [];
    selected_editor: TinyEditor|null = null;
    icon_selector_modal_is_shown: boolean = false;
    icon_selector_modal_dom: HTMLElement;
    icon_selector_modal_dom_close: HTMLElement;
    icon_selector_modal_dom_search: HTMLInputElement;
    icon_selector_modal_dom_content: HTMLElement;
    icon_selector_modal_dom_resolve: ((icon_class_name: string)=>void)|null = null;

    icon_selector_modal_close() {
        this.icon_selector_modal_is_shown = false;
        this.icon_selector_modal_dom.style.display = "none";
        this.icon_selector_modal_dom_resolve = null;
    }

    icon_selector_modal_render() {
        this.icon_selector_modal_dom_content.innerHTML = '';
        const search_text = this.icon_selector_modal_dom_search.value;
        for (let i = 0; i < FONTAWSOME_DATA.icons.length; i++) {
            const icon_class = FONTAWSOME_DATA.icons[i];
            if (search_text === "" || icon_class.indexOf(search_text) !== -1) {
                const icon = this.icon_selector_modal_dom_content.appendChild(document.createElement("i"));
                icon.className = icon_class;
                icon.title = icon_class;
                icon.addEventListener("click", () => {
                    if (this.icon_selector_modal_dom_resolve === null) {
                        console.error("this.icon_selector_modal_dom_resolve is null");
                    } else {
                        this.icon_selector_modal_dom_resolve(icon.className);
                    }
                    
                    this.icon_selector_modal_close();
                });
            }
        }
    }

    icon_selector_modal(): Promise<string> {
        return new Promise((resolve: ((icon_class_name: string)=>void)|null) => {
            if (this.icon_selector_modal_is_shown) {
                this.icon_selector_modal_close();
            } else {
                this.icon_selector_modal_is_shown = true;
                this.icon_selector_modal_dom.style.display = "";
                this.icon_selector_modal_dom_resolve = resolve;
                this.icon_selector_modal_dom.style.display = "";
                this.icon_selector_modal_render();
                this.icon_selector_modal_dom.style.display = "";
            }
        });
    }

    constructor(targetElement: HTMLElement, options: TinyEditorToolbarOptions) {
        this.toolbar_dom = targetElement;
        this.toolbar_dom.classList.add('__toolbar');

        this.icon_selector_modal_dom = this.toolbar_dom.appendChild( document.createElement("div") );
        this.icon_selector_modal_dom.id = targetElement.id+"__icon-selector";
        this.icon_selector_modal_dom.className = "__icon-selector";
        this.icon_selector_modal_dom.style.display = "none";

        this.icon_selector_modal_dom_search = this.icon_selector_modal_dom.appendChild( document.createElement("input") );
        this.icon_selector_modal_dom_search.placeholder = "Icon..";
        this.icon_selector_modal_dom_search.className = "__icon-selector-search be-form-control";
        this.icon_selector_modal_dom_search.addEventListener("input", () => {
            this.icon_selector_modal_render();
        });

        this.icon_selector_modal_dom_close = this.icon_selector_modal_dom.appendChild( document.createElement("div") );
        this.icon_selector_modal_dom_close.className = "__icon-selector-close";
        this.icon_selector_modal_dom_close.innerHTML = '<i class="fa-solid fa-times" title="fa-solid fa-times"></i>';
        this.icon_selector_modal_dom_close.addEventListener("click", () => this.icon_selector_modal_close() );

        this.icon_selector_modal_dom_content = this.icon_selector_modal_dom.appendChild( document.createElement("div") );
        this.icon_selector_modal_dom_content.className = "__icon-selector-content";
    
        // Styles
        if (options.formatblock === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
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
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
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
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('bold', 'Bold', this.createIcon('fa-solid fa-bold'))
            );
        }
    
        // Italic
        if (options.italic === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('italic', 'Italic', this.createIcon('fa-solid fa-italic'))
            );
        }
    
        // Underline
        if (options.underline === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('underline', 'Underline', this.createIcon('fa-solid fa-underline'))
            );
        }
    
        // Text color
        if (options.textcolor === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createInput('forecolor', 'Text color', 'color')
            );
        }
    
        // Left align
        if (options.textleft === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());

            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('justifyleft', 'Left align', this.createIcon('fa-solid fa-align-left'))
            );
        }
    
        // Center align
        if (options.textcenter === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('justifycenter', 'Center align',  this.createIcon('fa-solid fa-align-center'))
            );
        }
    
        // Right align
        if (options.textright === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('justifyright', 'Right align', this.createIcon('fa-solid fa-align-right'))
            );
        }
    
        // Numbered list
        if (options.insertorderedlist === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());

            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('insertorderedlist', 'Numbered list', this.createIcon('fa-solid fa-list-ol'))
            );
        }
    
        // Bulleted list
        if (options.insertunorderedlist === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('insertunorderedlist', 'Bulleted list', this.createIcon('fa-solid fa-list-ul'))
            );
        }
    
        // Decrease indent
        if (options.outdent === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('outdent', 'Decrease indent', this.createIcon('fa-solid fa-indent fa-flip-horizontal'))
            );
        }
    
        // Increase indent
        if (options.indent === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('indent', 'Increase indent', this.createIcon('fa-solid fa-indent'))
            );

            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());
        }
    
        // Clear formatting
        if (options.removeFormat === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('removeFormat', 'Clear formatting', this.createIcon('fa-solid fa-eraser'))
            );
        }
    
        // Create image
        if (options.image === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton(
                    'createImage',
                    'Create Image',
                    this.createIcon('fa-solid fa-image'))
            );
        }
    
        // Create image
        if (options.image === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton(
                    'createIcon',
                    'Create Icon',
                    this.createIcon('fa-solid fa-flag'))
            );
        }
    
        // Create Hyperlink
        if (options.hyperlink === true) {
            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('createLink', 'Create Hyperlink', this.createIcon('fa-solid fa-link'))
            );

            this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
                this.createButton('removeLink', 'remove Hyperlink', this.createIcon('fa-solid fa-unlink'))
            );
        }

        // Events
        this.toolbar_dom.addEventListener('click', () => this.updateActiveState() );
    }

    updateActiveState() {
        const toolbarSelects = this.toolbar_dom.querySelectorAll('select[data-command-id]');
        for (let i=0; i<toolbarSelects.length; i++) {
            const select = <HTMLSelectElement> toolbarSelects[i];
            const value = document.queryCommandValue(select.dataset.commandId!);
            const option = Array.from(select.options).find(
                _option => {
                    const option = _option;
                    return option.value === value;
                }
            );
            select.selectedIndex = option ? option.index : -1;
        }

        const toolbarButtons = this.toolbar_dom.querySelectorAll('button[data-command-id]');
        for (let i=0; i<toolbarButtons.length; i++) {
            const button = <HTMLButtonElement>  toolbarButtons[i];
            const active = document.queryCommandState(button.dataset.commandId!);
            button.classList.toggle('active', active);
        }

        const inputButtons = this.toolbar_dom.querySelectorAll('input[data-command-id]');
        for (let i=0; i<inputButtons.length; i++) {
            const input = <HTMLInputElement> inputButtons[i];
            const value = document.queryCommandValue(input.dataset.commandId!);
            const converted_value = this.rgbToHex(value);
            if(converted_value) input.value = converted_value;
        }
    }

    rgbToHex(color: string): string|null {
        const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
        if (digits !== null && digits.length > 5) {
            const red = parseInt(digits[2]);
            const green = parseInt(digits[3]);
            const blue = parseInt(digits[4]);
            const rgb = blue | (green << 8) | (red << 16);
        
            let color_hex = rgb.toString(16);
            const to = 6 - color_hex.length;
            for (let i = 0; i < to; i++) {
                color_hex = "0" + color_hex;
            }
            return digits[1] + '#' + color_hex;
        }
        return null;
    }

    createButton(commandId: string, title: string, child: HTMLElement): HTMLButtonElement {
        const button = document.createElement('button');
        button.dataset.commandId = commandId;
        button.className = this.TOOLBAR_ITEM;
        button.title = title;
        button.type = 'button';
        button.appendChild(child);
        button.addEventListener('click', () => { if(this.selected_editor !== null) this.selected_editor.execCommand(commandId, ""); });
      
        return button;
    }

    createOption(value: string, text: string, selected: boolean): HTMLOptionElement {
        const option = document.createElement('option');
        option.innerText = text;
      
        if (value) option.setAttribute('value', value);
        if (selected) option.selected = true;
      
        return option;
    }

    createSelect(commandId: string, title: string, options: {text: string, value: string, selected?: boolean}[]): HTMLSelectElement {
        const select = document.createElement("select");
        select.dataset.commandId = commandId;
        select.className = this.TOOLBAR_ITEM;
        select.title = title;
        select.addEventListener("change", e => {
            if (e.target === null) {
                return;
            } else {
                const target: HTMLSelectElement = <HTMLSelectElement> e.target;
                if(this.selected_editor !== null) return this.selected_editor.execCommand(commandId, target.options[target.selectedIndex].value);
            }
        });
      
        for (const option of options) {
          select.appendChild(
            this.createOption(option.value, option.text, option.selected === true)
          );
        }
      
        return select;
    }
    
    createIcon(className: string): HTMLElement {
        const icon = document.createElement('i');
        icon.className = className;
    
        return icon;
    }
    
    createInput(commandId: string, title: string, type: string): HTMLInputElement {
        const input = document.createElement('input');
        input.dataset.commandId = commandId;
        input.className = this.TOOLBAR_ITEM;
        input.title = title;
        input.type = type;
        input.addEventListener('change', () => {
            if(this.selected_editor !== null) return this.selected_editor.execCommand(commandId, input.value);
        });
    
        return input;
    }
    
    createSeparator(): HTMLElement {
        const separator = document.createElement('span');
        separator.className = '__toolbar-separator';
      
        return separator;
    }

    showAllItems() {
        for (let i = 0; i < this.toolbar_dom_items.length; i++) {
            this.toolbar_dom_items[i].style.display = "";
        }
    }

    hideAllItems() {
        for (let i = 0; i < this.toolbar_dom_items.length; i++) {
            this.toolbar_dom_items[i].style.display = "none";
        }
    }

    showTheseItems(commandIds: string[]) {
        for (let a = 0; a < this.toolbar_dom_items.length; a++) {
            const item = this.toolbar_dom_items[a];
            item.style.display = "none";
            for (let b = 0; b < commandIds.length; b++) {
                const commandId = commandIds[b];
                if (item.getAttribute("data-command-id") === commandId) {
                    item.style.display = "";
                    break;
                }
            }
        }
    }
}

export class TinyEditor {
    private editor: HTMLElement;
    private toolbar: TinyEditorToolbar;
    callback_onchange: (()=>void)|null = null;
    callback_exec_command_create_image: ExecCommandCreateImageEvent;
    dialog: Dialog = new Dialog(document.body);

    createElement(_type: string, _id: string, _class: string): HTMLElement {
        const element = document.createElement(_type);
        if(_id !== "") element.id = _id;
        if(_class !== "") element.className = _class;
        return element;
    }

    constructor(editor: HTMLElement, options: TinyEditorOptions) {
        this.editor = editor;
        editor.classList.add("__editor");
        editor.setAttribute('contentEditable', "true");
        
        if(typeof options.onchange === "function") this.callback_onchange = options.onchange;
        this.callback_exec_command_create_image = options.exec_command_create_image;
        
        // Create a toolbar
        if(options.toolbar === null) {
            const toolbar_dom = this.editor.appendChild(document.createElement("div"));
            this.toolbar = new TinyEditorToolbar(toolbar_dom, options.tinyeditor_toolbar_options);
            this.toolbar.selected_editor = this;
        } else {
            this.toolbar = options.toolbar;
        }
        this.callback_onchange = options.onchange;
    
        // Listen for events to detect where the caret is
        editor.addEventListener('focusin', () => { this.toolbar.selected_editor = this; } );
        editor.addEventListener('keydown', () => this.toolbar.updateActiveState() );
        editor.addEventListener('keyup', () => this.toolbar.updateActiveState() );
        editor.addEventListener('click', () => this.toolbar.updateActiveState() );


        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if(selection !== null && selection.anchorNode !== null && !editor.contains(selection.anchorNode.parentNode)) return false;
        });

        // add paste event
        editor.addEventListener('paste', (e: ClipboardEvent) => {
            e.preventDefault();
            console.log("[TinyEditor] Paste event", e.clipboardData);
            
            if (e.clipboardData !== null) {
                let text = e.clipboardData.getData('text/plain');
                // delete html, head, body, img tags from text
                text = text.replace(/<html[^>]*>/gi, "");
                text = text.replace(/<\/html>/gi, "");
                text = text.replace(/<head[^>]*>/gi, "");
                text = text.replace(/<\/head>/gi, "");
                text = text.replace(/<body[^>]*>/gi, "");
                text = text.replace(/<\/body>/gi, "");
                text = text.replace(/<img[^>]*>/gi, "");

                document.execCommand('insertHTML', false, text);
                if(this.callback_onchange !== null) this.callback_onchange();
            }
        });


        // add paragraph tag on new line
        editor.addEventListener('keypress', (e: KeyboardEvent) => {
            if ((e.keyCode || e.which) === 13) {
                // don't add a p tag on list item
                const selection = window.getSelection();
                if (selection !== null) {
                    const selection_element = <HTMLElement> selection.anchorNode!.parentNode!;
                    if(selection_element.tagName === 'LI') return;
                }
                
                document.execCommand('formatBlock', false, 'p');
            }
        });


        // keyup for correct change event
        if(this.callback_onchange !== null) {
            editor.addEventListener('keyup', () => {
                if(this.callback_onchange !== null) this.callback_onchange();
            });
        }
        
    }

    execCommand(commandId: string, value: string) {
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
                if(this.callback_onchange !== null) this.callback_onchange();
                break;
        }
        this.editor.focus();
    }

    execCommand_createImage() {  
        let selection_ranges = this.saveSelection();
        if (selection_ranges.length === 0) {
            console.log("[TinyEditor] User tried to create a image without selecting text");
        } else {
            if(!this.editor.contains(selection_ranges[0].startContainer.parentNode) 
                && selection_ranges[0].startContainer.parentNode === null || this.editor !== selection_ranges[0].startContainer.parentNode) {
                console.log("[TinyEditor] User tried to create a image without selecting text");
                this.editor.focus();
                selection_ranges = this.saveSelection();
            }

            const selected_element = <HTMLImageElement|null> this.getElementFromSelection(selection_ranges[0]);

            this.callback_exec_command_create_image().then((image_url: string) => {
                if(selected_element === null) {
                    if (selection_ranges !== null) this.restoreSelection(selection_ranges);
                
                    const newSelection = window.getSelection();
                    if(newSelection !== null) {
                        const new_element = this.render_image_div(image_url, "200px", "200px");
                        newSelection.getRangeAt(0).insertNode(new_element);
                        setTimeout(() => new_element.focus(), 100);
                    }
                } else {
                    selected_element.style.backgroundImage = "url('" + image_url + "')";
                }

                if(this.callback_onchange !== null) this.callback_onchange();
            });

        }
    }

    execCommand_createIcon() {  
        let selection_ranges = this.saveSelection();
        if (selection_ranges.length === 0) {
            console.info("[TinyEditor] User tried to create a icon without selecting text");
        } else {
            if(!this.editor.contains(selection_ranges[0].startContainer.parentNode) 
                && selection_ranges[0].startContainer.parentNode === null || this.editor !== selection_ranges[0].startContainer.parentNode) {
                console.info("[TinyEditor] User tried to create a icon without selecting text");
                this.editor.focus();
                selection_ranges = this.saveSelection();
            }

            this.toolbar.icon_selector_modal().then((className: string) => {
                if (selection_ranges !== null) this.restoreSelection(selection_ranges);
                
                const newSelection = window.getSelection();
                if(newSelection !== null) {
                    const new_element = document.createElement("i");
                    new_element.className = className;
                    newSelection.getRangeAt(0).insertNode(new_element);
                    setTimeout(() => new_element.focus(), 100);
                }
                
                if(this.callback_onchange !== null) this.callback_onchange();
            });

        }
    }

    render_image_div(image_url: string, width: string, height: string): HTMLElement {
        console.log("[TinyEditor] render_image_div");
        const new_element = document.createElement('div');
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
        const img = new Image();
        img.src = image_url;
        img.onload = () => {
            new_element.dataset.width = img.naturalWidth.toString();
            new_element.dataset.height = img.naturalHeight.toString();
            new_element.style.height = new_element.clientWidth * (img.naturalHeight / img.naturalWidth) + "px";

            const ratio = img.naturalHeight / img.naturalWidth;
            if (!ratio) {
                console.error("[TinyEditor] Image has no ratio");
            } else {
                new_element.onmousemove = () => {
                    setTimeout(() => {
                        new_element.style.height = (new_element.clientWidth * ratio) + "px";
                    }, 1);
                };

                new_element.onmouseup = () => {
                    if(this.callback_onchange !== null) this.callback_onchange();
                };
            }
        }


        // Context Menu
        const lux_context_menu = new LuxContextMenu(new_element);
        const context_menu_items = [];

        // float none
        const item1 = document.createElement("div");
        item1.innerHTML = "Kein Textumlauf";
        item1.addEventListener('click', () => {
            new_element.style.float = "";
            lux_context_menu.close();
            if(this.callback_onchange !== null) this.callback_onchange();
        });
        context_menu_items.push(item1);

        // float left
        const item2 = document.createElement("div");
        item2.innerHTML = "Textumlauf, Bild links";
        item2.addEventListener('click', () => {
            new_element.style.float = "left";
            lux_context_menu.close();
            if(this.callback_onchange !== null) this.callback_onchange();
        });
        context_menu_items.push(item2);

        // float right
        const item3 = document.createElement("div");
        item3.innerHTML = "Textumlauf, Bild rechts";
        item3.addEventListener('click', () => {
            new_element.style.float = "right";
            lux_context_menu.close();
            if(this.callback_onchange !== null) this.callback_onchange();
        });
        context_menu_items.push(item3);

        lux_context_menu.set_items(context_menu_items);
        return new_element;
    }

    execCommand_createLink() {  
        const selection_ranges = this.saveSelection();
        if (selection_ranges.length === 0) {
            console.log("[TinyEditor] User tried to create a link without selecting text");
        } else {
            const dialog_content = document.createElement("div");
            const row1 = dialog_content.appendChild(document.createElement("div"));
            row1.style.marginBottom = "10px";
            const link_input = row1.appendChild(document.createElement("input"));
            link_input.id = "link_input";
            link_input.type = "text";
            link_input.className = "be-form-control";
            link_input.placeholder = "Link eingeben.. z.B.: http://example.com";
    
            const row2 = dialog_content.appendChild(document.createElement("div"));
            row2.style.marginBottom = "10px";
            const link_new_tab_input = row2.appendChild(document.createElement("input"));
            link_new_tab_input.id = "link_new_tab_input";
            link_new_tab_input.type = "checkbox";
            link_new_tab_input.style.marginRight = "4px";
            const link_new_tab_input_label = row2.appendChild(document.createElement("label"));
            link_new_tab_input_label.setAttribute("for", "link_new_tab_input");
            link_new_tab_input_label.innerHTML = "neuer Tab";
            link_new_tab_input_label.style.userSelect = "none";
            link_new_tab_input_label.style.cursor = "pointer";
    
            // link-marker class toggler 
            const row3 = dialog_content.appendChild(document.createElement("div"));
            row3.style.marginBottom = "10px";
            const link_marker_input = row3.appendChild(document.createElement("input"));
            link_marker_input.id = "link_marker_input";
            link_marker_input.type = "checkbox";
            link_marker_input.style.marginRight = "4px";
            const link_marker_input_label = row3.appendChild(document.createElement("label"));
            link_marker_input_label.setAttribute("for", "link_marker_input");
            link_marker_input_label.innerHTML = "Link-Marker";
            link_marker_input_label.className = "link-marker";
            link_marker_input_label.style.userSelect = "none";
            link_marker_input_label.style.cursor = "pointer";

            // class
            const row4 = dialog_content.appendChild(document.createElement("div"));
            const class_input = row4.appendChild(document.createElement("input"));
            class_input.id = "class_input";
            class_input.type = "text";
            class_input.className = "be-form-control";
            class_input.placeholder = "Class eingeben.. z.B.: link-marker";
    
            // if exists: get selected AnchorElement
            const selected_element = <HTMLAnchorElement|null> this.getElementFromSelection(selection_ranges[0]);
            if (selected_element !== null) {
                link_input.value = selected_element.href;
                link_new_tab_input.checked = selected_element.target === "_blank";
                link_marker_input.checked = selected_element.className.includes("link-marker");
                class_input.value = selected_element.className;
            }

            // Events
            link_marker_input.addEventListener('change', () => {
                const class_value_split = class_input.value.split(" ");
                if(link_marker_input.checked) {
                    if(!class_value_split.includes("link-marker")) class_value_split.push("link-marker");
                } else {
                    class_value_split.splice(class_value_split.indexOf("link-marker"), 1);
                }
                class_input.value = class_value_split.join(" ");
            });

            class_input.addEventListener('change', () => {
                const class_value_split = class_input.value.split(" ");
                link_marker_input.checked = class_value_split.includes("link-marker");
            });


            this.dialog.start('Link eingeben', dialog_content, 'Link setzen', null, null, () => {
                const linkValue = link_input.value;
                const newTab = link_new_tab_input.checked;
              
                if (selection_ranges !== null) this.restoreSelection(selection_ranges);
                
                const newSelection = window.getSelection();
                if(newSelection !== null && newSelection.toString()) {
                    const new_a_element = document.createElement('a');
                    new_a_element.href = linkValue;
                    new_a_element.className = class_input.value;
                    if(newTab) new_a_element.target = '_blank';
                    newSelection.getRangeAt(0).surroundContents(new_a_element);
                }
          
                this.dialog.close();
                if(this.callback_onchange !== null) this.callback_onchange();
            });

            setTimeout(() => {
                link_input.focus();
            }, 100);

        }
    }

    execCommand_removeLink() {
        const selection_ranges = this.saveSelection();
        if (selection_ranges.length === 0) {
            console.log("[TinyEditor] User tried to create a link without selecting text");
        } else {
            const selected_element = <HTMLAnchorElement|null> this.getElementFromSelection(selection_ranges[0]);
            if(selected_element === null) {
                console.log("[TinyEditor] User tried to remove a link without selecting text");
            } else if(selected_element.tagName !== 'A') {
                console.log("[TinyEditor] User tried to remove a link without selecting an anchor element");
            } else {
                selected_element.outerHTML = selected_element.innerHTML;
            }
        }
    }

    
    saveSelection(): Range[] {
        if(window.getSelection) {
            const selection = window.getSelection();
            if(selection !== null && selection.getRangeAt && selection.rangeCount) {
                const ranges = [];
                for(let i = 0, len = selection.rangeCount; i < len; ++i) {
                    ranges.push(selection.getRangeAt(i));
                }
                return ranges;
            }
        }
        
        throw new Error("window.getSelection() is not supported, by this browser.");
    }
    
    restoreSelection(ranges: Range[]): boolean {
        if(ranges) {
            if(window.getSelection) {
                const current_selection = window.getSelection();
                if(current_selection !== null) {
                    current_selection.removeAllRanges();
                    for(let i = 0, len = ranges.length; i < len; ++i) {
                        current_selection.addRange(ranges[i]);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    getElementFromSelection(selection_range: Range): HTMLElement|null {
        const selected_element: HTMLElement = <HTMLElement> selection_range.startContainer;
        console.log("selection_range", selection_range);
        console.log("selected_element", selected_element);
        if (selected_element.parentElement !== null && selected_element.parentElement.tagName === "A") {
            return selected_element.parentElement;
        } else if(selected_element.nodeName !== "#text") {
            // if is editor it self, check if only one link exists
            if (selected_element.classList.contains("__editor")) {
                const link_elements = selected_element.querySelectorAll("a");
                if (link_elements.length === 1) {
                    return link_elements[0];
                }
            }
        }

        return null;
    }

    import(content: string) {
        this.editor.innerHTML = content;
        const images = this.editor.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
            const image = <HTMLImageElement> images[i];
            const image_url = image.src;

            image.replaceWith( this.render_image_div(image_url, image.style.width, image.style.height) );
        }
    }

    export(): string {
        let content = "";
        this.editor.childNodes.forEach(node => {
            if (node.nodeName === "#text") {
                content += node.textContent;
            } else {
                const html_element = <HTMLElement> node;
                if (html_element.className === "image") {
                    const image_url = html_element.style.backgroundImage.replace("url(", "").replace(")", "").replace('"', "").replace('"', "");
                    let style = 'max-width: 100%; height: auto; width: '+html_element.clientWidth+'px;';
                    if (html_element.style.float) style += ' float: '+html_element.style.float+';';
                    
                    content += '<img src="'+image_url+'" class="image" style="'+style+'">';
                } else if(html_element.tagName === "A") {
                    content += html_element.outerHTML;
                    console.log("html_element.outerHTML", html_element.outerHTML);
                } else {
                    content += html_element.outerHTML;
                }
            }
        });

        return content;
    }

}

export interface ExecCommandCreateImageEvent {
    (): Promise<string>;
}


export class LuxContextMenu {
    private target: HTMLElement;
    private context_menu: HTMLElement;
    private context_menu_items: HTMLElement[] = [];

    constructor(target: HTMLElement) {
        this.target = target;

        let context_menu = document.getElementById("lux-context-menu");
        if (context_menu === null) {
            context_menu = document.body.appendChild( document.createElement("div") );
            context_menu.id = "lux-context-menu";
            context_menu.className = "__context_menu";
            context_menu.style.display = "none";

            // close context menu on click outside
            document.addEventListener('click', (e: MouseEvent) => {
                if(e.target !== this.context_menu) {
                    this.context_menu.style.display = "none";
                }
            });
        }
        this.context_menu = context_menu;

        this.target.oncontextmenu = (e: MouseEvent) => {
            e.preventDefault();
            this.context_menu.innerHTML = '';
            for (let i = 0; i < this.context_menu_items.length; i++) {
                this.context_menu.appendChild(this.context_menu_items[i]);
            }

            this.context_menu.style.top = e.clientY + "px";
            this.context_menu.style.left = e.clientX + "px";
            this.context_menu.style.display = "block";
        };
        
    }

    set_items(items: HTMLElement[]): LuxContextMenu {
        this.context_menu_items = items;
        for (let i = 0; i < this.context_menu_items.length; i++) {
            this.context_menu_items[i].className = "__context_menu_item";
        }
        return this;
    }

    close() {
        this.context_menu.style.display = "none";
    }
}