// deno-lint-ignore-file no-window
import { Dialog } from "./dialog.ts";
import { LOCALES } from './locales.ts';
import { LuxDragDrop } from './lux_drag_drop.ts';
import { TinyEditor, TinyEditorToolbar, TinyEditorToolbarOptions } from "./tinyeditor.ts";

type FormControl = HTMLInputElement|HTMLSelectElement|HTMLButtonElement;

const bausteinRenderType = {
    bausteinSelector: -1,
    layout: 0,
    table: 1,
    tableRow: 2,
    tableCell: 3,
    plaintext: 4,
    richtext: 5,
    image: 6,
    button: 7,
    spoiler: 8,
    spoiler_toggler: 9,
    spoiler_content: 10,
    iframe: 11,
    container: 12,
    shortcode: 13,
    static_undeletable: 14,

    isParentType: function (renderType: number) {
        return renderType === this.container || renderType === this.layout || renderType === this.table || renderType === this.tableRow || renderType === this.spoiler;
    }   
};

export class Position {
    public parent: number | null;
    public sort: number;

    constructor(parent: number | null, sort: number) {
        this.parent = parent;
        this.sort = sort;
    }
}

interface BausteinStylePropertyOption { locale_key: string, value: string }
export interface MediaImageData { file_id: number, name: string, url: string }

class BausteinStyleProperty {
	public name: string;
	public type: string;
	public suffix: string[];
	public options: BausteinStylePropertyOption[];
	public useAsClass: boolean;
	public showInBausteinAttributesSidebar: boolean;

    constructor(name: string, type: string, suffix: string[], options: BausteinStylePropertyOption[], useAsClass: boolean, showInBausteinAttributesSidebar: boolean) {
        this.name = name;
        this.type = type;
        this.suffix = suffix;
        this.options = options;
        this.useAsClass = useAsClass;
        this.showInBausteinAttributesSidebar = showInBausteinAttributesSidebar;
    }

    get_html_options(): HTMLOptionElement[] {
        const html_options = [];

        for (let b = 0; b < this.options.length; b++) {
            html_options[b] = document.createElement("option");
            html_options[b].innerHTML = LOCALES.get_item(this.options[b].locale_key);
            html_options[b].value = this.options[b].value;
        }

        return html_options;
    }
}

class BausteinStyle {
	public property: BausteinStyleProperty;
	public value: string;

    constructor(property: BausteinStyleProperty, value: string) {
        this.property = property;
        this.value = value;
    }
}

class BausteinAttribute {
	public name: string;
	public value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

class ToggleableClass {
    public name: string;
    public active: boolean;
    public toggleable: boolean;

    constructor(name: string, active: boolean, toggleable: boolean) {
        this.name = name;
        this.active = active;
        this.toggleable = toggleable;
    }
}

class BausteinTemplate {
	public type: string;
	public tag: string;
	public renderType: number;
	public style: BausteinStyle[];
	public content: string = "";
	public class: string = "";
	public toggleableClasses: ToggleableClass[];
    public icon: string|null;
	public attributes: BausteinAttribute[]; // aditional attributes, will be set before the other attributes like class and style

    // columns, rows for table and layout
	public columns: number = 0;
	public rows: number = 0;

    constructor(type: string, icon: string|null, tag: string, renderType: number, toggleableClasses: ToggleableClass[], attributes: BausteinAttribute[], style: BausteinStyle[]) {
        this.type = type;
        this.icon = icon;
        this.tag = tag; // empty string for text node
        this.renderType = renderType;
        this.toggleableClasses = toggleableClasses;

        for (let i = 0; i < this.toggleableClasses.length; i++) {
            const toggableClass = this.toggleableClasses[i];
            if (toggableClass.active) {
                if(this.class !== "") this.class += " ";    
                this.class += toggableClass.name;    
            }
        }

        this.attributes = [];
        // Objects are reference types, we need to use clone here
        for (let i = 0; i < attributes.length; i++) {
            this.attributes[i] = new BausteinAttribute(attributes[i].name, attributes[i].value);
        }
        
        this.style = [];
        // Objects are reference types, we need to use clone here
        for (let i = 0; i < style.length; i++) {
            this.style[i] = new BausteinStyle(style[i].property, style[i].value);
        }
    }

    addClass(clazz: string) {
        const classList = this.class.trim().split(" ");
        if (classList.indexOf(clazz) === -1) {
            classList.push(clazz);
            this.class = classList.join(" ");
        }
    }

    removeClass(clazz: string) {
        const classList = this.class.trim().split(" ");
        const index = classList.indexOf(clazz);
        if (index !== -1) {
            classList.splice(index, 1);
            this.class = classList.join(" ");
        }
    }

    getAttribute(name: string) {
        for (let i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].name === name) {
                return this.attributes[i].value;
            }
        }
        return null;
    }

    setAttribute(name: string, value: string) {
        for (let i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].name === name) {
                this.attributes[i].value = value;
                return;
            }
        }
        this.attributes.push(new BausteinAttribute(name, value));
    }

    isParentType(): boolean {
        return bausteinRenderType.isParentType(this.renderType);
    }

    getStyle(name: string) {
        for (let i = 0; i < this.style.length; i++) {
            if (this.style[i].property.name === name) {
                return this.style[i];
            }
        }
        return null;
    }

    getStyleValue(name: string, def: string) {
        const style = this.getStyle(name);
        if (style) {
            return style.value;
        }
        return def;
    }

    setStyle(name: string, value: string) {
        for (let i = 0; i < this.style.length; i++) {
            if (this.style[i].property.name === name) {
                this.style[i].value = value;
                return;
            }
        }
        this.addStyle(name, value);
    }

    private addStyle(name: string, value: string) {
        this.style.push(new BausteinStyle(new BausteinStyleProperty(name, name, [], [], false, false), value));
    }

}

class Baustein extends BausteinTemplate {
    public id: number;
    public title: string;
	public position: Position;

    constructor(id: number, position: Position, type: string, tag: string, renderType: number, toggleableClasses: ToggleableClass[], attributes: BausteinAttribute[], style: BausteinStyle[]) {
        const newToggleableClasses: ToggleableClass[] = [];
        for (let i = 0; i < toggleableClasses.length; i++) {
            toggleableClasses[i] = new ToggleableClass(toggleableClasses[i].name, toggleableClasses[i].active, toggleableClasses[i].toggleable);
        }

        super(type, null, tag, renderType, newToggleableClasses, attributes, style);

        this.id = id;
        this.title = LOCALES.get_item(type);
        this.position = position;
    }
}

interface BausteinEditorOptions {
    assets?: { baustein_image_placeholder: string },
    api_endpoints?: { image_search: string },
    image_upload?: ()=>Promise<MediaImageData>,
    media_register?: (media_data: MediaImageData)=>void,
    preview_iframe_url?: string,
    locale?: string,
}

interface BausteinEditorData {bausteine: Baustein[]}

export class BausteinEditor {
	public dom_id: string;
	private baustein_counter: number = 0;
	private baustein_id_counter: number = 0;
	private cursor_mode: number = 0;
	private image_upload: (()=>Promise<MediaImageData>)|null = null;
	private media_register: ((media_data: MediaImageData)=>void)|null = null;
	private preview_iframe_url: string|null = null;
    private dialog: Dialog;


    private tinyeditor_toolbar_options: TinyEditorToolbarOptions = {
        formatblock: false,
        fontname: false,
        bold: true,
        italic: true,
        underline: true,
        textcolor: true,
        textleft: true,
        textcenter: true,
        textright: true,
        insertorderedlist: true,
        insertunorderedlist: true,
        outdent: true,
        indent: true,
        removeFormat: true,
        image: true,
        icons: true,
        hyperlink: true,
    };
    tinyeditor_toolbar: TinyEditorToolbar;
    
	public styleProperties = {
        font_size: new BausteinStyleProperty("font-size", "select", [], [
            { locale_key: "normal", value: "" },
            { locale_key: "smaller", value: "smaller" },
            { locale_key: "small", value: "small" },
            { locale_key: "medium", value: "medium" },
            { locale_key: "large", value: "large" },
            { locale_key: "larger", value: "larger" }
        ], true, true),
    
        font_weight: new BausteinStyleProperty("font-weight", "select", [], [
            { locale_key: "normal", value: "" },
            { locale_key: "bold", value: "bold" },
            { locale_key: "bolder", value: "bolder" },
            { locale_key: "lighter", value: "lighter" }
        ], false, true),
    
        text_decoration: new BausteinStyleProperty("text-decoration", "select", [], [
            { locale_key: "normal", value: "" },
            { locale_key: "underline", value: "underline" },
            { locale_key: "dotted", value: "dotted" }
        ], false, true),
    
        font_style: new BausteinStyleProperty("font-style", "select", [], [
            { locale_key: "normal", value: "" },
            { locale_key: "italic", value: "italic" },
            { locale_key: "oblique", value: "oblique" }
        ], false, true),
    
        text_align: new BausteinStyleProperty("text-align", "select", [], [
            { locale_key: "normal", value: "" },
            { locale_key: "left", value: "left" },
            { locale_key: "center", value: "center" },
            { locale_key: "right", value: "right" }
        ], false, true),
    
        color: new BausteinStyleProperty("color", "color", [], [], false, true),
        background_color: new BausteinStyleProperty("background-color", "color", [], [], false, true),
        background_image: new BausteinStyleProperty("background-image", "image", [], [], false, true),
    
        width: new BausteinStyleProperty("width", "number", ["px", "%"], [{ locale_key: "auto", value: "auto" }], false, false),
        height: new BausteinStyleProperty("height", "number", ["px", "%"], [{ locale_key: "auto", value: "auto" }], false, false),
        max_width: new BausteinStyleProperty("max-width", "number", ["px", "%"], [{ locale_key: "auto", value: "auto" }], false, true),
        max_height: new BausteinStyleProperty("max-height", "number", ["px", "%"], [{ locale_key: "auto", value: "auto" }], false, true),
    
        margin_top: new BausteinStyleProperty("margin-top", "number", ["px"], [{ locale_key: "auto", value: "auto" }], false, false),
        margin_right: new BausteinStyleProperty("margin-right", "number", ["px"], [{ locale_key: "auto", value: "auto" }], false, false),
        margin_bottom: new BausteinStyleProperty("margin-bottom", "number", ["px"], [{ locale_key: "auto", value: "auto" }], false, false),
        margin_left: new BausteinStyleProperty("margin-left", "number", ["px"], [{ locale_key: "auto", value: "auto" }], false, false),
    
        border_width_top: new BausteinStyleProperty("border-top-width", "number", ["px"], [], false, false),
        border_width_right: new BausteinStyleProperty("border-right-width", "number", ["px"], [], false, false),
        border_width_bottom: new BausteinStyleProperty("border-bottom-width", "number", ["px"], [], false, false),
        border_width_left: new BausteinStyleProperty("border-left-width", "number", ["px"], [], false, false),
    
        padding_top: new BausteinStyleProperty("padding-top", "number", ["px"], [], false, false),
        padding_right: new BausteinStyleProperty("padding-right", "number", ["px"], [], false, false),
        padding_bottom: new BausteinStyleProperty("padding-bottom", "number", ["px"], [], false, false),
        padding_left: new BausteinStyleProperty("padding-left", "number", ["px"], [], false, false),
    };
    private stylePropertiesArray = Object.values(this.styleProperties);
	be: HTMLElement;
	underlay: HTMLElement;
	main: HTMLElement;
	sidebar: HTMLElement;
	toolbar: HTMLElement;
	cursormodechanger: HTMLElement;
	cursormodechanger_default: HTMLElement;
	cursormodechanger_drag: HTMLElement;
	toolbar_baustein: HTMLElement;
	content: HTMLElement;
	preview: HTMLElement;
	preview_button_desktop: HTMLButtonElement;
	preview_button_mobile: HTMLButtonElement;
	preview_button: HTMLButtonElement;
	preview_close_button: HTMLButtonElement;
	preview_content: HTMLElement;
	sidebar_content__site: HTMLElement;
	sidebar_content__baustein: HTMLElement;
	sidebar_content__baustein_styles: HTMLElement;
	ajax_loader: HTMLElement;
	bausteine: HTMLElement[] = [];
	addBausteinSelectorItems: { title: string; icon: string | null; items: BausteinTemplate[]; }[];
    getStylePropertyByName(name: string): BausteinStyleProperty {
        for (let i = 0; i < this.stylePropertiesArray.length; i++) {
            if (this.stylePropertiesArray[i].name === name) {
                return <BausteinStyleProperty> this.stylePropertiesArray[i];
            }            
        }
        return new BausteinStyleProperty(name, "", [], [], false, false);
    }

	public data: BausteinEditorData = {
        bausteine: []
    };

	public types = {
        bausteinSelector: new BausteinTemplate("bausteinSelector", '', "", bausteinRenderType.bausteinSelector, [], [], [])
        ,page_content: new BausteinTemplate("page_content", '', "", bausteinRenderType.static_undeletable, [], [], [])
        ,h1: new BausteinTemplate("h1", '<b>H1</b>', "h1", bausteinRenderType.richtext, [], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h2: new BausteinTemplate("h2", '<b>H2</b>', "h2", bausteinRenderType.richtext, [], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h3: new BausteinTemplate("h3", '<b>H3</b>', "h3", bausteinRenderType.richtext, [], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h4: new BausteinTemplate("h4", '<b>H4</b>', "h4", bausteinRenderType.richtext, [], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h5: new BausteinTemplate("h5", '<b>H5</b>', "h5", bausteinRenderType.richtext, [], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h6: new BausteinTemplate("h6", '<b>H6</b>', "h6", bausteinRenderType.richtext, [], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,text: new BausteinTemplate("text", '<i class="fa-solid fa-paragraph"></i>', "div", bausteinRenderType.richtext, [], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
                { property: this.styleProperties.background_image, value:"" }, 
            ])
        ,btn_primary: new BausteinTemplate("btn_primary", '<i class="fa-solid fa-exclamation"></i>', "a", bausteinRenderType.button, [ new ToggleableClass("btn", true, false), new ToggleableClass("btn-primary", true, false) ], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
                { property: this.styleProperties.background_image, value:"" }, 
            ])
        ,btn_seccond: new BausteinTemplate("btn_seccond", '<i class="fa-solid fa-exclamation"></i>', "a", bausteinRenderType.button, [ new ToggleableClass("btn", true, false), new ToggleableClass("btn-secondary", true, false) ], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
                { property: this.styleProperties.background_image, value:"" }, 
            ])
        ,btn_cta: new BausteinTemplate("btn_cta", '<i class="fa-solid fa-exclamation"></i>', "a", bausteinRenderType.button, [ new ToggleableClass("btn", true, false), new ToggleableClass("btn-cta", true, false) ], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
                { property: this.styleProperties.background_image, value:"" }, 
            ])
        ,html: new BausteinTemplate("html", '<i class="fa-solid fa-html5"></i>', "div", bausteinRenderType.plaintext, [], [], [
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
            ])
        ,script: new BausteinTemplate("script", '<i class="fa-solid fa-code"></i>', "script", bausteinRenderType.plaintext, [], [], [])
        ,iframe: new BausteinTemplate("iframe", '<i class="fa-solid fa-code"></i>', "iframe", bausteinRenderType.iframe, [ new ToggleableClass("d-block", true, false) ], [
            new BausteinAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"),
            new BausteinAttribute("allowfullscreen", "allowfullscreen")
        ], [
            { property: this.styleProperties.width, value:"100%" },
            { property: this.styleProperties.height, value:"300px" },
        ])
        ,shortcode: new BausteinTemplate("shortcode", '<b>[..]</b>', "", bausteinRenderType.shortcode, [], [], [])
        ,image: new BausteinTemplate("image", '<i class="fa-solid fa-image"></i>', "img", bausteinRenderType.image, [], [], [
            { property: this.styleProperties.max_width, value:"100%" },
            { property: this.styleProperties.max_height, value:"" },
        ])
        ,spoiler: new BausteinTemplate("spoiler", '<i class="fa-solid fa-box"></i>', "div", bausteinRenderType.spoiler, [], [], [])
        ,spoiler_toggler: new BausteinTemplate("spoiler_toggler", '<i class="fa-solid fa-box"></i>', "div", bausteinRenderType.spoiler_toggler, [], [], [])
        ,spoiler_content: new BausteinTemplate("spoiler_content", '<i class="fa-solid fa-box"></i>', "div", bausteinRenderType.spoiler_content, [ new ToggleableClass("collapse", true, false) ], [], [])
        ,layout: new BausteinTemplate("layout", '<i class="fa-solid fa-layer-group" style="transform: rotate(90deg);"></i>', "div", bausteinRenderType.layout, [ new ToggleableClass("row", true, false) ], [], [ 
            { property: this.styleProperties.max_width, value:"" }, 
            { property: this.styleProperties.max_height, value:"" }, 
            { property: this.styleProperties.color, value:"" },
            { property: this.styleProperties.background_color, value:"" }, 
            { property: this.styleProperties.background_image, value:"" }, 
        ])
        ,container: new BausteinTemplate("container", '<i class="fa-solid fa-layer-group"></i>', "div", bausteinRenderType.container, [], [], [
            { property: this.styleProperties.max_width, value:"" }, 
            { property: this.styleProperties.max_height, value:"" }, 
            { property: this.styleProperties.color, value:"" },
            { property: this.styleProperties.background_color, value:"" }, 
            { property: this.styleProperties.background_image, value:"" }, 
        ])
        ,table: new BausteinTemplate("table", '<i class="fa-solid fa-table"></i>', "table", bausteinRenderType.table, [ new ToggleableClass("rsp-table", true, false) ], [], [ 
            { property: this.styleProperties.max_width, value:"" }, 
            { property: this.styleProperties.max_height, value:"" }, 
            { property: this.styleProperties.color, value:"" },
            { property: this.styleProperties.background_color, value:"" }, 
            { property: this.styleProperties.background_image, value:"" }, 
        ])
        ,tableRow: new BausteinTemplate("tableRow", '<i class="fa-solid fa-table"></i>', "tr", bausteinRenderType.tableRow, [], [], [])
        ,th: new BausteinTemplate("th", '<i class="fa-solid fa-table"></i>', "th", bausteinRenderType.tableCell, [], [], [
            { property: this.styleProperties.font_size, value:"" },
            { property: this.styleProperties.text_align, value:"" },
            { property: this.styleProperties.font_weight, value:"" },
            { property: this.styleProperties.text_decoration, value:"" },
            { property: this.styleProperties.font_style, value:"" },
            { property: this.styleProperties.color, value:"" },
            { property: this.styleProperties.background_color, value:"" }, 
            { property: this.styleProperties.background_image, value:"" }, 
        ])
        ,td: new BausteinTemplate("td", '<i class="fa-solid fa-table"></i>', "td", bausteinRenderType.tableCell, [], [], [
            { property: this.styleProperties.font_size, value:"" },
            { property: this.styleProperties.text_align, value:"" },
            { property: this.styleProperties.font_weight, value:"" },
            { property: this.styleProperties.text_decoration, value:"" },
            { property: this.styleProperties.font_style, value:"" },
            { property: this.styleProperties.color, value:"" },
            { property: this.styleProperties.background_color, value:"" }, 
            { property: this.styleProperties.background_image, value:"" }, 
        ])
    };

    /** types_array gets updated after render() gets called */
    private types_array: BausteinTemplate[] = [];
    getBausteinType(type: string): BausteinTemplate {
        for (let i = 0; i < this.types_array.length; i++) {
            if (this.types_array[i].type === type) {
                return this.types_array[i];
            }            
        }
        return this.types_array[0];
    }

	public be_bausteinSelector_isOpen: boolean = false;
	public selected_baustein: HTMLElement | null = null;
	public selected_baustein_id: number | null = null;
	public open_baustein_attributes__baustein_id: number | null = null;
	public open_baustein_attributes__formcontrols: (HTMLInputElement | HTMLSelectElement | HTMLButtonElement)[] = [];
    public assets = {
        baustein_image_placeholder: "/img/baustein-image-placeholder.png"
    };
    public api_endpoints = {
        image_search: "",
    };
    public shortcodes = []

    createElement<K extends keyof HTMLElementTagNameMap>(tag: K, _id: string, _class: string): HTMLElementTagNameMap[K] {
        const element = document.createElement(tag);
        if(_id !== "") element.id = _id;
        if(_class !== "") element.className = _class;
        return element;
    }

    constructor(parent: HTMLElement, options: BausteinEditorOptions) {
        this.dom_id = parent.id;

        // Options
        if(typeof options !== "undefined") {
            if(typeof options.locale !== "undefined") LOCALES.select_locale(options.locale);
            if(typeof options.assets !== "undefined") this.assets = options.assets;
            if(typeof options.api_endpoints !== "undefined") this.api_endpoints = options.api_endpoints;
            if(typeof options.image_upload !== "undefined") this.image_upload = options.image_upload;
            if(typeof options.media_register !== "undefined") this.media_register = options.media_register;
            if(typeof options.preview_iframe_url !== "undefined") this.preview_iframe_url = options.preview_iframe_url;
        }

        this.addBausteinSelectorItems = [
             { title: LOCALES.get_item("titles"), icon: '<i class="fa-solid fa-heading"></i>', items: [ this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6 ] }
            ,{ title: LOCALES.get_item(this.types.text.type), icon: this.types.text.icon, items: [this.types.text] }
            ,{ title: LOCALES.get_item(this.types.image.type), icon: this.types.image.icon, items: [this.types.image] }
            ,{ title: LOCALES.get_item(this.types.container.type), icon: this.types.container.icon, items: [this.types.container] }
            ,{ title: LOCALES.get_item(this.types.layout.type), icon: this.types.layout.icon, items: [this.types.layout] }
            ,{ title: LOCALES.get_item(this.types.table.type), icon: this.types.table.icon, items: [this.types.table] }
            ,{ title: LOCALES.get_item("buttons"), icon: '<i class="fa-solid fa-exclamation"></i>', items: [this.types.btn_primary, this.types.btn_seccond, this.types.btn_cta] }
            ,{ title: LOCALES.get_item("misc"), icon: '<i class="fa-solid fa-cubes"></i>', items: [ this.types.spoiler, this.types.script, this.types.shortcode, this.types.iframe ] }
        ];

        // DOM
        this.be = parent;
        this.be.classList.add("be");
        this.dialog = new Dialog(this.be)

        this.underlay = this.be.appendChild(
            this.createElement("div", this.dom_id+'_underlay', "__dialog")
        );
        this.underlay.style.display = "none";

        this.main = this.be.appendChild(
            this.createElement("div", this.dom_id+"_main", "be_main")
        );
        this.sidebar = this.be.appendChild(
            this.createElement("div", this.dom_id+"_sidebar", "be_sidebar")
        );

        this.toolbar = this.main.appendChild(
            this.createElement("div", "", "be_toolbar")
        );

        this.cursormodechanger = this.toolbar.appendChild(
            this.createElement("div", "", "be_cursormodechanger")
        );
        this.cursormodechanger_default = this.cursormodechanger.appendChild(
            this.createElement("div", "", "be_cursormodechanger_item active be_cursormodechanger_default")
        );
        this.cursormodechanger_default.innerHTML = '<i class="fa-solid fa-mouse-pointer"></i>';
        this.cursormodechanger_drag = this.cursormodechanger.appendChild(
            this.createElement("div", "", "be_cursormodechanger_item be_cursormodechanger_drag")
        );
        this.cursormodechanger_drag.innerHTML = '<i class="fa-solid fa-arrows-alt"></i>';

        this.toolbar_baustein = this.toolbar.appendChild(
            this.createElement("div", "", "be_toolbar_baustein")
        );

        
        this.content = this.main.appendChild(
            this.createElement("div", this.dom_id+"_content", "be_content")
        );
        this.preview = this.main.appendChild(
            this.createElement("div", this.dom_id+"_preview", "be_preview")
        );
        
        this.preview_button_desktop = <HTMLButtonElement> this.preview.appendChild(
            this.createElement("button", this.dom_id+"_preview_button_desktop", "be_preview_button_desktop")
        );
        this.preview_button_desktop.innerHTML = '<i class="fa-solid fa-desktop"></i> Desktop';
        this.preview_button_desktop.style.display = "none";
        this.preview_button_desktop.type = "button";
        
        this.preview_button_mobile = <HTMLButtonElement> this.preview.appendChild(
            this.createElement("button", this.dom_id+"_preview_button_mobile", "be_preview_button_mobile")
        );
        this.preview_button_mobile.innerHTML = '<i class="fa-solid fa-mobile-alt"></i> Mobile';
        this.preview_button_mobile.style.display = "none";
        this.preview_button_mobile.type = "button";

        this.preview_button = <HTMLButtonElement> this.preview.appendChild(
            this.createElement("button", this.dom_id+"_preview_button", "be_preview_button")
        );
        this.preview_button.innerHTML = '<i class="fa-solid fa-eye"></i> ' + LOCALES.get_item("preview");
        this.preview_button.type = "button";

        this.preview_close_button = <HTMLButtonElement> this.preview.appendChild(
            this.createElement("button", this.dom_id+"_preview_close_button", "be_preview_close_button")
        );
        this.preview_close_button.innerHTML = '<i class="fa-solid fa-times"></i> ' + LOCALES.get_item("close_preview");
        this.preview_close_button.style.display = "none";
        this.preview_close_button.type = "button";

        this.preview_content = this.preview.appendChild(
            this.createElement("div", this.dom_id+"_preview_content", "be_preview_content")
        );
        this.preview_content.style.display = "none";

        //this.sidebar_header = this.sidebar.appendChild(
        //    this.createElement("div", this.dom_id+"_sidebar_header", "be_sidebar_header")
        //);
        this.sidebar_content__site = this.sidebar.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__site", "be_sidebar_content")
        );
        this.sidebar_content__baustein = this.sidebar.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__baustein", "be_sidebar_content")
        );
        this.sidebar_content__baustein.style.display = "none";
        this.sidebar_content__baustein_styles = this.sidebar_content__baustein.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__baustein_styles", "")
        );
        
        /*
        this.sidebar_header_col__site = this.sidebar_header.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_header_col__site", "be_sidebar_header_col active")
        );
        this.sidebar_header_col__site.innerHTML = "Artikel";

        this.sidebar_header_col__baustein = this.sidebar_header.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_header_col__baustein", "be_sidebar_header_col disabled")
        );
        this.sidebar_header_col__baustein.innerHTML = "Baustein";
        */

        // TinyEditor Setup
        this.tinyeditor_toolbar = new TinyEditorToolbar(this.toolbar, this.tinyeditor_toolbar_options);
        this.tinyeditor_toolbar.hideAllItems();
        

        // Construct ajax loader
        this.ajax_loader = this.be.appendChild( this.createElement("div", this.dom_id+"-ajax-loader", "be-ajax-loader") );
        this.ajax_loader.style.display = "none";
        

        // Events
        this.cursormodechanger_default.addEventListener("click", () => {
            this.cursor_mode = 0;
            this.cursormodechanger_default.classList.add("active");
            this.cursormodechanger_drag.classList.remove("active");
        });
        this.cursormodechanger_drag.addEventListener("click", () => {
            this.cursor_mode = 1;
            this.cursormodechanger_default.classList.remove("active");
            this.cursormodechanger_drag.classList.add("active");
        });

        [this.preview_button, this.preview_close_button].forEach((element) => {
            element.addEventListener("click", () => {
                if (this.preview_content.style.display === "none") {
                    this.preview_content.style.display = "";
                    this.preview_render();

                    this.preview_content.style.height = "400px";
                    this.content.style.height = "calc(100% - 50px - 46px - "+this.preview_content.style.height+")";
                    this.preview_button_mobile.style.display = "";
                    this.preview_content.style.width = "";
                    this.preview_content.classList.remove("mobile");

                    this.preview_button.style.display = "none";
                    this.preview_close_button.style.display = "";
                } else {
                    this.preview_content.style.display = "none";
                    this.content.style.height = "";
                    this.preview_button_desktop.style.display = "none";
                    this.preview_button_mobile.style.display = "none";
                    
                    this.preview_button.style.display = "";
                    this.preview_close_button.style.display = "none";
                }
            });
        });

        this.preview_button_desktop.addEventListener("click", () => {
            this.preview_button_desktop.style.display = "none";
            this.preview_button_mobile.style.display = "";
            this.preview_content.style.width = "";
            this.preview_content.classList.remove("mobile");
        });

        this.preview_button_mobile.addEventListener("click", () => {
            this.preview_button_desktop.style.display = "";
            this.preview_button_mobile.style.display = "none";
            this.preview_content.style.width = "320px";
            this.preview_content.classList.add("mobile");
        });
        
        this.render();
    }

    add_static_undeletable(baustein_type: BausteinTemplate, check_exists: boolean) {
        if (check_exists) {
            for (let i = 0; i < this.data.bausteine.length; i++) {
                if (this.data.bausteine[i].type === baustein_type.type) return;
            }
        }

        this.addBaustein(baustein_type, new Position(null, this.getPositionSort(false)), false);
    }
    
    renderBausteinSelector(position: Position, hide: boolean, bausteinHasParent: boolean): HTMLElement {
        //console.log("renderBausteinSelector", position, hide, bausteinHasParent);
        const selector_dom_id = this.dom_id + "_" + position.parent + "_" + position.sort;
        const position_parent = position.parent;
        const position_sort = position.sort;

        let clz = "be_bausteinSelector_container";
        if (hide) {
            clz += " hidden";
        }

        const be_bausteinSelector_container = this.createElement("div", "", clz);
        be_bausteinSelector_container.dataset.position_parent = position_parent+"";
        be_bausteinSelector_container.dataset.position_sort = position_sort+"";

        const be_bausteinSelector_outer = be_bausteinSelector_container.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector', "be_bausteinSelector_outer")
        );

        const be_bausteinSelector = be_bausteinSelector_outer.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector', "be_bausteinSelector")
        );
        be_bausteinSelector.appendChild(
            this.createElement("i", "", "fa-solid fa-plus-square")
        );

        const be_bausteinSelector_layer = this.be.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector_layer', "be_bausteinSelector_layer")
        );
        be_bausteinSelector_layer.style.display = "none";

        const be_bausteinSelector_layer_title_container = be_bausteinSelector_layer.appendChild(
            this.createElement("div", "", "be_bausteinSelector_layer_title_container")
        );
        const be_bausteinSelector_layer_title = be_bausteinSelector_layer_title_container.appendChild(
            this.createElement("div", "", "be_bausteinSelector_layer_title")
        );
        be_bausteinSelector_layer_title.innerHTML = LOCALES.get_item("add_new_block");
        const be_bausteinSelector_layer_close: HTMLButtonElement = <HTMLButtonElement> be_bausteinSelector_layer_title_container.appendChild(
            this.createElement("button", selector_dom_id+'bausteinSelector_layer_close', "be_bausteinSelector_layer_close")
        );
        be_bausteinSelector_layer_close.type = "button"
        be_bausteinSelector_layer_close.innerHTML = "&times;";

        const be_bausteinSelector_layer_item_container1 = be_bausteinSelector_layer.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector_layer_item_container1', "be_bausteinSelector_layer_item_container")
        );

        const be_bausteinSelector_layer_item_container2 = be_bausteinSelector_layer.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector_layer_item_container2', "be_bausteinSelector_layer_item_container")
        );



        for (let i = 0; i < this.addBausteinSelectorItems.length; i++) {
            const itemset = this.addBausteinSelectorItems[i];
            const itemset_single = itemset.items.length === 1;
            
            const be_bausteinSelector_layer_item: HTMLButtonElement = <HTMLButtonElement> be_bausteinSelector_layer_item_container1.appendChild(
                this.createElement("button", "", "be_bausteinSelector_layer_item")
            );
            be_bausteinSelector_layer_item.type = "button";
            be_bausteinSelector_layer_item.dataset.category = i.toString();
            if (itemset_single) be_bausteinSelector_layer_item.dataset.type = itemset.items[0].type.toString();

            const title1 = be_bausteinSelector_layer_item.appendChild(
                this.createElement("div", "", "be_bausteinSelector_layer_item_title1")
            );

            const title2 = be_bausteinSelector_layer_item.appendChild(
                this.createElement("div", "", "be_bausteinSelector_layer_item_title2")
            );

            if (itemset_single) {
                if(itemset.items[0].icon !== null) title1.innerHTML = itemset.items[0].icon;
                title2.innerHTML = LOCALES.get_item(itemset.items[0].type);
            } else {
                if(itemset.icon !== null) title1.innerHTML = itemset.icon;
                title2.innerHTML = itemset.title;
            }

            
            be_bausteinSelector_layer_item.addEventListener("click", () => {
                if(itemset_single) {
                    this.addBaustein(itemset.items[0], new Position(position.parent, position.sort), true);
                    this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                } else {
                    const types_array = itemset.items;
                    be_bausteinSelector_layer_item_container2.innerHTML = "";
                    
                    for (let b = 0; b < types_array.length; b++) {
                        const be_bausteinSelector_layer_item: HTMLButtonElement = <HTMLButtonElement> be_bausteinSelector_layer_item_container2.appendChild(
                            this.createElement("button", "", "be_bausteinSelector_layer_item")
                        );
                        be_bausteinSelector_layer_item.type  = "button";
                        be_bausteinSelector_layer_item.dataset.type  = types_array[b].type;
                        be_bausteinSelector_layer_item.innerHTML = 
                              '<div class="be_bausteinSelector_layer_item_title1">'+types_array[b].icon+'</div>'
                            + '<div class="be_bausteinSelector_layer_item_title2">'+LOCALES.get_item(types_array[b].type)+'</div>';

                        if(types_array[b].renderType === bausteinRenderType.button) {
                            types_array[b].class.split(" ").forEach((className) => {
                                be_bausteinSelector_layer_item.classList.add(className);
                            });
                        }

                        const types_array_row = b;
                        be_bausteinSelector_layer_item.addEventListener("click", () => {
                            this.addBaustein(types_array[types_array_row], new Position(position.parent, position.sort), true);
                            this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                        });
                    }

                    be_bausteinSelector_layer_item_container1.style.display = "none";
                    be_bausteinSelector_layer_item_container2.style.display = "";
                }
            });
        }


        be_bausteinSelector.addEventListener("click", () => { this.bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2); });
        be_bausteinSelector_layer_close.addEventListener("click", () => { this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer); });
        
        return be_bausteinSelector_container;
    }
    
    // iterate through all bausteine and check if columns/rows are the same as presented in data.bausteine
    rowcol_amount_evaluate() {
        for (let i = 0; i < this.data.bausteine.length; i++) {
            const baustein = this.data.bausteine[i];
            if (baustein.renderType === bausteinRenderType.table || baustein.renderType === bausteinRenderType.tableRow || baustein.renderType === bausteinRenderType.layout || baustein.renderType === bausteinRenderType.container) {
                let amount, new_baustein_type;
                
                if (baustein.renderType === bausteinRenderType.tableRow || baustein.renderType === bausteinRenderType.layout) {
                    // check columns amount
                    amount = baustein.columns;
                    new_baustein_type = this.types.bausteinSelector;
                } else if (baustein.renderType === bausteinRenderType.container) {
                    // check rows amount for container
                    amount = baustein.rows;
                    new_baustein_type = this.types.bausteinSelector;
                } else {
                    // check rows amount
                    amount = baustein.rows;
                    new_baustein_type = this.types.tableRow;
                }

                const children = this.getBausteineChildren(baustein.id);

                if (children.length < amount) {
                    // add bausteine of type bausteinSelector
                    for (let j = children.length; j < amount; j++) {
                        this.addBaustein(new_baustein_type, new Position(baustein.id, this.getPositionSort(false)), false);
                    }
                } else if(children.length > amount) {
                    // remove bausteine; to do this first we add all bausteine who are have not the parent of this table, then we add the rest
                    const new_bausteine_array = [];
                    for (let j = 0; j < this.data.bausteine.length; j++) {
                        if (this.data.bausteine[j].position.parent !== baustein.id) {
                            new_bausteine_array.push(this.data.bausteine[j]);
                        }
                    }

                    for (let j = 0; j < baustein.columns; j++) {
                        new_bausteine_array.push(children[j]);
                    }

                    this.data.bausteine = new_bausteine_array;
                }
            }
        }
    }

    addBaustein(baustein_template: BausteinTemplate, position: Position, do_render: boolean): Promise<Baustein> {
        return new Promise<Baustein>((resolve, reject) => {
            const parent_baustein = position.parent === null? null : this.getBaustein(position.parent);
            let baustein_class = baustein_template.class;

            if (parent_baustein !== null) {
                if (parent_baustein.renderType === bausteinRenderType.layout) {
                    // Layout children should have class="col"
                    if(baustein_class !== "") baustein_class += " ";
                    baustein_class += "col";
                } else if (parent_baustein.renderType === bausteinRenderType.tableRow && baustein_template.type === this.types.text.type) {
                    // IF parent is tableRow AND child is type "text" then change it to td
                    baustein_template = this.types.td;
                    baustein_class = baustein_template.class
                }
            }

            console.log("addBaustein( type:", baustein_template.type, ", position:", position, " )");

            
            const baustein_id = this.baustein_id_counter;
            const baustein = new Baustein(
                baustein_id, position, baustein_template.type, baustein_template.tag, baustein_template.renderType, baustein_template.toggleableClasses, baustein_template.attributes, baustein_template.style
            );
            baustein.class = baustein_class;

            const actual_addBaustein = () => {
                this.baustein_id_counter += 1;
        
                // handle default style
                for (let i = 0; i < baustein.style.length; i++) {
                    const style = baustein.style[i];
                    if (style.value === "" && style.property.options.length > 0) {
                        style.value = style.property.options[0].value;
                    }
                }
                
                if(baustein.getStyle("margin-top") === null) baustein.setStyle("margin-top", "8px");
                if(baustein.getStyle("margin-bottom") === null) baustein.setStyle("margin-bottom", "8px");

                
                // test if on the same position is a Baustein typeof BausteinSelector
                let baustein_type_baustein_selector_index = null;
                if (baustein.renderType !== bausteinRenderType.bausteinSelector) {
                    for (let r = 0; r < this.data.bausteine.length; r++) {
                        if (this.data.bausteine[r].position.parent === position.parent && this.data.bausteine[r].position.sort === position.sort) {
                            if (this.data.bausteine[r].renderType === bausteinRenderType.bausteinSelector) {
                                baustein_type_baustein_selector_index = r;
                            }
                            break;
                        }
                    }
                }

                if (baustein_type_baustein_selector_index === null) {
                    // any baustein with equel or greater then position.sort += 1
                    for (let r = 0; r < this.data.bausteine.length; r++) {
                        if (this.data.bausteine[r].position.sort >= position.sort) {
                            this.data.bausteine[r].position.sort++;
                        }
                    }
                    this.data.bausteine.push(baustein);
                } else {
                    this.data.bausteine.splice(baustein_type_baustein_selector_index, 1);
                    this.data.bausteine.push(baustein);
                }

                if (baustein.renderType === bausteinRenderType.spoiler) {
                    const spoiler_id = new Date().getTime();
                    this.addBaustein(this.types.spoiler_toggler, new Position(baustein_id, this.getPositionSort(false)), false)
                        .then((that_baustein) => {
                            that_baustein.attributes = [
                                new BausteinAttribute("data-bs-toggle", "collapse"),
                                new BausteinAttribute("aria-expanded", "false"),
                                new BausteinAttribute("data-bs-target", "#be-bs-collapse-content"+spoiler_id),
                                new BausteinAttribute("aria-controls", "be-bs-collapse-content"+spoiler_id),
                            ];
                    });
                    this.addBaustein(this.types.spoiler_content, new Position(baustein_id, this.getPositionSort(false)), false)
                        .then((that_baustein) => { that_baustein.attributes = [new BausteinAttribute("id", "be-bs-collapse-content"+spoiler_id)] });
                } else {
                    // IF is ParentType THEN add dummy Bausteine to the Baustein-Array
                    if (baustein.isParentType()) {
                        if (baustein.renderType === bausteinRenderType.table) {
                            for (let row = 0; row < baustein.rows; row++) {
                                this.addBaustein(this.types.tableRow, new Position(baustein_id, this.getPositionSort(false)), false);
                            }
                        } else if (baustein.renderType === bausteinRenderType.container) {
                            for (let row = 0; row < baustein.rows; row++) {
                                this.addBaustein(this.types.bausteinSelector, new Position(baustein_id, this.getPositionSort(false)), false);
                            }
                        } else {
                            for (let column = 0; column < baustein.columns; column++) {
                                this.addBaustein(this.types.bausteinSelector, new Position(baustein_id, this.getPositionSort(false)), false);
                            }
                        }
                    }
                }

        
                if(do_render) {
                    this.render();
                    if(baustein.renderType !== bausteinRenderType.bausteinSelector) this.selectBaustein(baustein_id);
                }
                resolve(baustein);
            }
            
            if (baustein.renderType === bausteinRenderType.layout || baustein.renderType === bausteinRenderType.container || baustein.renderType === bausteinRenderType.table) {
                this.dialog_rowcol(baustein)
                    .then(() => actual_addBaustein())
                    .catch(() => reject());
            } else if (baustein.renderType === bausteinRenderType.image) {
                this.dialog_media(baustein.renderType)
                    .then((image_url: string) => {
                        baustein.content = image_url;
                        actual_addBaustein();
                    })
                    .catch(() => reject());
            } else {
                if (baustein.renderType === bausteinRenderType.tableRow && parent_baustein !== null) {
                    // TableRow inherit columns count from Table
                    baustein.columns = parent_baustein.columns;
                }
                actual_addBaustein();
            } 
        });
    }

    selectBaustein(baustein_id: number) {
        this.bausteine.forEach((be_baustein) => { be_baustein.classList.remove("selected"); });
        this.selected_baustein = document.getElementById(this.dom_id+'_be_baustein_item'+baustein_id);
        this.selected_baustein?.classList.add("selected");
        this.selected_baustein_id = baustein_id;
        this.open_baustein_attributes(baustein_id);

        // TinyEditorToolbar show/hide Handler
        const baustein = this.getBaustein(baustein_id);
        switch (baustein.renderType) {
            case bausteinRenderType.richtext:
            case bausteinRenderType.tableCell:
                this.tinyeditor_toolbar.showAllItems();
                break;
                
            case bausteinRenderType.button:
                this.tinyeditor_toolbar.showTheseItems([
                    "bold", "italic", "underline", "forecolor", "removeFormat", "createImage", "createIcon"
                ]);
                break;
                
            default:
                this.tinyeditor_toolbar.hideAllItems();
                break;
        }
    }

    getBaustein(baustein_id: number): Baustein {
        for (let i = 0; i < this.data.bausteine.length; i++) {
            if (this.data.bausteine[i].id === baustein_id) {
                return this.data.bausteine[i];
            }
        }
        throw new Error("getBaustein() can not get Baustein with id: "+baustein_id);
    }

    getBausteinFromPosition(position: Position): Baustein|null {
        for (let i = 0; i < this.data.bausteine.length; i++) {
            if (this.data.bausteine[i].position.parent === position.parent && this.data.bausteine[i].position.sort === position.sort) {
                return this.data.bausteine[i];
            }
        }
        return null;
    }

    getPositionSort(getFirst: boolean): number {
        let positionSort = 1;
        if (getFirst) {
            for (let i = 0; i < this.data.bausteine.length; i++) {
                if (this.data.bausteine[i].position.sort < positionSort) {
                    positionSort =  this.data.bausteine[i].position.sort;
                }
            }
    
            return positionSort -1;
        } else {
            for (let i = 0; i < this.data.bausteine.length; i++) {
                if (this.data.bausteine[i].position.sort > positionSort) {
                    positionSort =  this.data.bausteine[i].position.sort;
                }
            }
    
            return positionSort +1;
        }
    }

    getBausteineChildren(parent: number | null): Baustein[] {
        const bausteine = [];
        for (let i = 0; i < this.data.bausteine.length; i++) {
            if (this.data.bausteine[i].position.parent === parent) {
                bausteine[bausteine.length] = this.data.bausteine[i];
            }
        }
        return bausteine.sort((a: Baustein, b: Baustein) => {
            return a.position.sort > b.position.sort? 1 : -1;
        });
    }

    deleteBaustein(baustein_id: number) {
        console.log("deleteBaustein() baustein_id", baustein_id)
        this.deleteBaustein_helper(baustein_id);

        this.selected_baustein_id = null;
        this.open_baustein_attributes__baustein_id = null;
        this.rowcol_amount_evaluate();
        this.render();
        window.focus();
        if (document.activeElement === null) {
            console.error("document.activeElement is null");
        } else {
            const activeElement = <HTMLElement> document.activeElement;
            activeElement.blur();
        }
    }

    private deleteBaustein_helper(baustein_id: number) {
        // delete children
        const children = this.getBausteineChildren(baustein_id);
        for (let i = 0; i < children.length; i++) {
            this.deleteBaustein_helper(children[i].id);
        }

        // delete baustein
        for (let row = 0; row < this.data.bausteine.length; row++) {
            if (this.data.bausteine[row].id === baustein_id) {
                this.data.bausteine.splice(row, 1);
                break;
            }
        }
    }

    moveBaustein(baustein_id: number, position_new: Position) {
        const baustein = this.getBaustein(baustein_id);
        console.log("moveBaustein old position.sort", baustein.position.sort, "new position.sort", position_new.sort);

        // Illegal moves: Table child must be TableRow, TableRow out of Table, TableCell out of TableRow
        if(position_new.parent !== null) {
            const new_baustein_parent = this.getBaustein(position_new.parent);
            if (baustein.renderType === bausteinRenderType.tableRow ) {
                if (new_baustein_parent.renderType !== bausteinRenderType.table) {
                    console.info("[BausteinEditor] can not move tableRow out of table. target must be a table");
                    return false;
                } 
            } else if (baustein.renderType === bausteinRenderType.tableCell) {
                if (new_baustein_parent.renderType !== bausteinRenderType.tableRow) {
                    console.info("[BausteinEditor] can not move tableCell out of tableRow, target must be a tableRow");
                    return false;
                }
            }

            if (new_baustein_parent.renderType === bausteinRenderType.table && baustein.renderType !== bausteinRenderType.tableRow) {
                console.info("[BausteinEditor] can not move Baustein of type '"+baustein.type+"' to table, Baustein must be a tableRow");
                return false;
            }
        }

        let test_position_new_parent = position_new.parent;
        let parentIsInChild = false;
        while (test_position_new_parent !== null) {
            if (baustein_id === test_position_new_parent) {
                parentIsInChild = true;
                break;
            }
            test_position_new_parent = this.getBaustein(test_position_new_parent).position.parent;
        }

        if (parentIsInChild) {
            console.info("moveBaustein() can not move parent Baustein into child");
            return false;
        } else if(baustein.position.parent === position_new.parent && baustein.position.sort === position_new.sort) {
            console.info("moveBaustein() can not move Baustein into same position");
            return false;
        } else {
            // IF position is baustein of type bausteinSelector
            const test_baustein = this.getBausteinFromPosition(position_new);
            if(test_baustein !== null && test_baustein.renderType === bausteinRenderType.bausteinSelector) {
                const test_baustein_index = this.data.bausteine.indexOf(test_baustein);
                if (test_baustein_index === -1) {
                    console.info("[BausteinEditor] moveBaustein() can not find Baustein index with position: "+position_new.parent+", "+position_new.sort);
                } else {
                    // Special cases
                    if (position_new.parent !== null) {
                        const new_baustein_parent = this.getBaustein(position_new.parent);
                        
                        // move baustein to Layout
                        if (new_baustein_parent.renderType === bausteinRenderType.layout) {
                            baustein.addClass("col");
                        } else {
                            baustein.removeClass("col");
                        }
                    } else {
                        baustein.removeClass("col");
                    }

                    // Now for real: move Baustein
                    this.data.bausteine.splice(test_baustein_index, 1);
                    baustein.position.parent = position_new.parent;
                    baustein.position.sort = position_new.sort;
                    this.rowcol_amount_evaluate();
                    this.render();
                    return true;
                }
            }

            if (position_new.sort - baustein.position.sort === 1) {
                position_new.sort += 1;
            }

            baustein.position.parent = position_new.parent;
            baustein.position.sort = position_new.sort;
    
    
            // any baustein with equel or greater then position.sort++
            for (let r = 0; r < this.data.bausteine.length; r++) {
                if (this.data.bausteine[r].id !== baustein_id && this.data.bausteine[r].position.sort >= baustein.position.sort) {
                    this.data.bausteine[r].position.sort++;
                }
            }
    
            this.rowcol_amount_evaluate();
            this.render();
        }

        return true;
    }

    printBausteinePosition() {
        console.log("printBausteinePosition()");
        for (let i = 0; i < this.data.bausteine.length; i++) {
            console.log(this.data.bausteine[i].id, this.data.bausteine[i].position);
        }
    }

    changeBaustein(baustein_id: number, type: string) {
        const baustein = this.getBaustein(baustein_id);
        const new_baustein = this.getBausteinType(type);
        baustein.renderType = new_baustein.renderType;
        baustein.tag = new_baustein.tag;
        baustein.type = new_baustein.type;
        baustein.title = LOCALES.get_item(new_baustein.type);

        this.render();
    }

    getChangeBausteinOptions(current_renderType: number, current_type: string): HTMLOptionElement[] {
        const options: HTMLOptionElement[] = [];
        for (let i = 0; i < this.types_array.length; i++) {
            const element = this.types_array[i];
            if (element.renderType === current_renderType && element.type !== current_type) {
                const b = options.length;
                options[b] = document.createElement("option");
                options[b].value = element.type; 
                options[b].innerHTML = element.icon + " " + LOCALES.get_item(element.type);
            }
        }

        return options;
    }
    

    renderBaustein(baustein: Baustein, position: Position): HTMLElement {
        const baustein_id = baustein.id;
        const position_parent = position.parent;
        const position_sort = position.sort;
        const baustein_dom_id = this.dom_id+'_be_baustein_item'+baustein_id;
        const baustein_editor_id = baustein_dom_id+'_editor';
        const baustein_type_object = this.getBausteinType(baustein.type);
        const elements_drag_not_allowed: Element[] = [];
        
        let baustein_dom: HTMLElement;
        if (baustein.renderType === bausteinRenderType.bausteinSelector) {
            baustein_dom = this.renderBausteinSelector(new Position(position_parent, position_sort), false, false);
        } else {
            baustein_dom = this.createElement("div", baustein_dom_id, "be_baustein");
            baustein_dom.dataset.type = baustein.type;
            baustein_dom.dataset.position_parent = position_parent+"";
            baustein_dom.dataset.position_sort = position_sort+"";
    
            const is_selected_baustein = this.selected_baustein_id !== null && this.selected_baustein_id === baustein_id;
            if (is_selected_baustein) {
                baustein_dom.classList.add("selected")
            }
    
            
            // Baustein indicator
            if (baustein.renderType !== bausteinRenderType.static_undeletable) {
                const baustein_indicator: HTMLLabelElement = <HTMLLabelElement> baustein_dom.appendChild(
                    this.createElement("label", baustein_dom_id+"_indicator", "baustein_indicator")
                );
                baustein_indicator.addEventListener("click", () => {
                    this.selectBaustein(baustein_id);
                }, false);
        
                if (position_parent === null) {
                    const baustein_indicator_position: HTMLElement = <HTMLElement> baustein_indicator.appendChild(
                        this.createElement("span", "", "baustein_indicator_position")
                    );
                    baustein_indicator_position.innerHTML = this.baustein_counter.toString();
                    this.baustein_counter++;
                }
        
                const changeBausteinOptions = this.getChangeBausteinOptions(baustein.renderType, baustein.type);
                if (changeBausteinOptions.length === 0) {
                    const baustein_indicator_title: HTMLLabelElement = <HTMLLabelElement> baustein_indicator.appendChild(
                        this.createElement("span", "", "baustein_indicator_title")
                    );
                    baustein_indicator_title.innerHTML = baustein_type_object.icon + " " + baustein.title;
                } else {
                    // Icon
                    if(baustein_type_object.icon !== null) baustein_indicator.innerHTML = baustein_type_object.icon;
    
                    // Baustein Indicator Changer
                    const baustein_indicator_changer: HTMLSelectElement = <HTMLSelectElement> baustein_indicator.appendChild(
                        this.createElement("select", "", "baustein_indicator_changer")
                    );
                    baustein_indicator_changer.tabIndex = -1;
                    baustein_indicator_changer.addEventListener("change", () => {
                        this.changeBaustein(baustein_id, baustein_indicator_changer.value);
                    });
            
                    const baustein_indicator_option: HTMLOptionElement = <HTMLOptionElement> baustein_indicator_changer.appendChild(
                        this.createElement("option", "", "")
                    );
                    baustein_indicator_option.value = baustein.type; 
                    baustein_indicator_option.innerHTML = baustein.title;
                    baustein_indicator_option.selected = true;
                    baustein_indicator_option.style.display = "none";
        
                    for (let i = 0; i < changeBausteinOptions.length; i++) {
                        baustein_indicator_changer.appendChild(changeBausteinOptions[i]);
                    }
                }
            }
    
            let baustein_item: HTMLElement|null = null;
            switch (baustein.renderType) {
                case bausteinRenderType.static_undeletable: {
                    baustein.content = "["+baustein.type+"]";
                    baustein_dom.addEventListener("click", () => { this.selectBaustein(baustein_id); });
                    const text = baustein_dom.appendChild(this.createElement("div", baustein_editor_id, "be_baustein_item"));
                    text.style.overflow = "hidden";
                    text.style.userSelect = "none";
                    text.style.padding = "4px";
                    text.innerHTML = LOCALES.get_item(baustein.type);
                } break;
                case bausteinRenderType.container:
                case bausteinRenderType.layout:
                case bausteinRenderType.table: 
                case bausteinRenderType.tableRow: 
                case bausteinRenderType.spoiler: {
                const bausteine_inner = this.getBausteineChildren(baustein.id);
                    for (let row = 0; row < bausteine_inner.length; row++) {
                        const baustein_inner = bausteine_inner[row];
                        baustein_dom.appendChild(this.renderBaustein(baustein_inner, new Position(baustein_id, baustein_inner.position.sort)));
                    }
                } break;
                    
                case bausteinRenderType.spoiler_toggler: 
                case bausteinRenderType.spoiler_content: {
                const bausteine_inner = this.getBausteineChildren(baustein.id);
                    if (bausteine_inner.length === 0) {
                        const show_layout_items = baustein.renderType === bausteinRenderType.spoiler_content;
                        baustein_dom.appendChild(this.renderBausteinSelector(new Position(baustein_id, this.getPositionSort(false)), false, show_layout_items));
                    } else {
                        for (let row = 0; row < bausteine_inner.length; row++) {
                            const baustein_inner = bausteine_inner[row];
                            baustein_dom.appendChild(this.renderBaustein(baustein_inner, new Position(baustein_id, baustein_inner.position.sort)));
                        }
                    }
                } break;

                case bausteinRenderType.shortcode: {
                    const shortcode_trimmed = baustein.content.replace("[", "").replace("]", "").trim();
                    let disable_editor_input = shortcode_trimmed === "";

                    const editor_select = <HTMLSelectElement>baustein_dom.appendChild(this.createElement("select", "", "form-control"));
                    editor_select.autocomplete = "off";
                    editor_select.style.border = "0";
                    const option_placeholder_dom = <HTMLOptionElement>editor_select.appendChild(document.createElement("option"));
                    option_placeholder_dom.value = "";
                    option_placeholder_dom.innerHTML = LOCALES.get_item("shortcode_select");
                    option_placeholder_dom.style.display = "none";

                    for (let i = 0; i < this.shortcodes.length; i++) {
                        const shortcode = this.shortcodes[i];
                        const shortcode_dom = <HTMLOptionElement>editor_select.appendChild(document.createElement("option"));
                        shortcode_dom.value = shortcode;
                        shortcode_dom.innerHTML = shortcode;
                        if (shortcode === shortcode_trimmed) {
                            disable_editor_input = true;
                            shortcode_dom.selected = true;
                        }
                    }

                    const option_other_dom = <HTMLOptionElement>editor_select.appendChild(document.createElement("option"));
                    option_other_dom.value = "-1";
                    option_other_dom.innerHTML = LOCALES.get_item("custom_other")


                    const editor_input = <HTMLInputElement>baustein_dom.appendChild(this.createElement("input", "", "form-control"));
                    editor_input.type = "text";
                    editor_input.value = baustein.content;
                    editor_input.style.border = "0";

                    if (disable_editor_input) {
                        editor_input.style.display = "none";
                    } else {
                        editor_select.style.display = "none";
                    }

                    [editor_select, editor_input].forEach((editor) => {
                        ["click", "focusin"].forEach((event_type)  => {
                            editor.addEventListener(event_type, () => { this.selectBaustein(baustein_id); });
                        });
                    });

                    editor_select.addEventListener("change", () => {
                        if (editor_select.value !== "") {
                            if (editor_select.value === "-1") {
                                editor_input.style.display = "block";
                                editor_select.style.display = "none";
                            } else {
                                editor_input.value = "[" + editor_select.value + "]";
                                baustein.content = editor_input.value;
                                this.preview_render();
                            }
                        }
                    });

                    editor_input.addEventListener("change", () => {
                        editor_input.value = editor_input.value.trim();
                        if (editor_input.value.substring(0, 1) !== "[") editor_input.value = "[" + editor_input.value;
                        if (editor_input.value.substring(editor_input.value.length - 1) !== "]") editor_input.value = editor_input.value + "]";
                        baustein.content = editor_input.value;
                        this.preview_render();
                    });
                } break;
                    
                case bausteinRenderType.image: {
                    const image: HTMLImageElement = <HTMLImageElement> baustein_dom.appendChild(
                        this.createElement("img", baustein_editor_id, "be_baustein_item")
                    );
                    // WENN dataset.src empty ist, dann ist nur der Placeholder vorhanden
                    image.dataset.src = baustein.content;
                    if (baustein.content === "") {
                        image.src = this.assets.baustein_image_placeholder;
                    } else {
                        image.src = baustein.content;
                    }
    
                    image.style.maxWidth = "100%";
    
                    image.addEventListener("click", () => {
                        this.selectBaustein(baustein_id);
                    });
    
                    // remove ghost image
                    image.addEventListener("dragstart", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                } break;
    
                case bausteinRenderType.iframe: {
                    const be_baustein_item_overlay = baustein_dom.appendChild(
                        this.createElement("div", "", "be_baustein_item_overlay")
                    );
                    be_baustein_item_overlay.addEventListener("click", () => {
                        this.selectBaustein(baustein_id);
                    });

                    const iframe: HTMLIFrameElement = <HTMLIFrameElement> baustein_dom.appendChild(
                        this.createElement("iframe", baustein_editor_id, "be_baustein_item")
                    );
                    iframe.src = baustein.getAttribute("src")||"about:blank";
                    iframe.style.width = "100%";
                    iframe.style.height = "100%";
                    iframe.style.border = "0";
    
                    iframe.addEventListener("click", () => {
                        this.selectBaustein(baustein_id);
                    });
                } break;
    
                default:{
                    let editor: HTMLElement;
                    switch (baustein.renderType) {
                        case bausteinRenderType.button:
                        case bausteinRenderType.tableCell:
                        case bausteinRenderType.richtext: {
                            if (baustein.renderType === bausteinRenderType.button) {
                                const placeholder_text = "Buttontext eingeben";
    
                                editor = baustein_dom.appendChild(
                                    this.createElement("a", baustein_editor_id, "be_baustein_item "+baustein.class)
                                );
                                editor.style.userSelect = "text";
                                
                                if(baustein.content === "") editor.innerHTML = placeholder_text;
                                else editor.innerHTML = baustein.content;
                                editor.setAttribute("contenteditable", "true");
    
                                editor.addEventListener("input", () => {
                                    baustein.content = editor.innerHTML;
                                    this.preview_render();
                                });
    
                                editor.addEventListener("focusin", () => {
                                    if(baustein.content === "") {
                                        editor.innerHTML = "";
                                    }
                                });
    
                                editor.addEventListener("focusout", () => {
                                    if(baustein.content === "") {
                                        editor.innerHTML = placeholder_text;
                                    }
                                });
                                
                            } else {
                                editor = baustein_dom.appendChild(
                                    this.createElement("div", baustein_editor_id, "be_baustein_item")
                                );
                                editor.style.minHeight = "100px";
                            }
            
                            const tiny_editor = new TinyEditor(editor, {
                                toolbar: this.tinyeditor_toolbar,
        
                                onchange: () => {
                                    baustein.content = tiny_editor.export();
                                    this.preview_render();
                                    if (baustein.renderType !== bausteinRenderType.button) {
                                        editor.style.height = '1px';
                                        editor.style.height = editor.scrollHeight + 'px';
                                    }
                                },
                                exec_command_create_image: () => {
                                    return new Promise((resolve, reject) => {
                                        this.dialog_media(bausteinRenderType.image).then((image_url) => {
                                            resolve(image_url);
                                        }).catch((error) => {
                                            reject(error);
                                        });
                                    });
                                },

                                tinyeditor_toolbar_options: this.tinyeditor_toolbar_options
                            });
                            if(is_selected_baustein) this.tinyeditor_toolbar.selected_editor = tiny_editor;
                            tiny_editor.import(baustein.content);
                            
                            editor.addEventListener("focusin", () => {
                                this.tinyeditor_toolbar.selected_editor = tiny_editor;
                            });
                        } break;
                        
                        default: {
                            editor = baustein_dom.appendChild(
                                this.createElement("textarea", baustein_editor_id, "be_baustein_item")
                            );
                            editor.innerHTML = baustein.content;
                            editor.focus();
                                
                            const editor_textarea = <HTMLTextAreaElement> editor;
                            editor_textarea.addEventListener("input", () => {
                                editor_textarea.style.height = '1px';
                                editor_textarea.style.height = editor_textarea.scrollHeight + 'px';
                                baustein.content = editor_textarea.value;
                            });
                        } break;
                    }
                    
                    baustein_item = editor;
                    editor.draggable = false;
                    editor.addEventListener("focusin", () => {
                        this.selectBaustein(baustein_id);
                    });
    
                    elements_drag_not_allowed.push(editor);
                } break;
            }

            if (baustein_item === null) {
                for (let a = 0; a < baustein.style.length; a++) {
                    const element = baustein.style[a];
                    if (element.value !== "") {
                        baustein_dom.style.setProperty(element.property.name, element.value);
                    }
                }
            } else {
                for (let a = 0; a < baustein.style.length; a++) {
                    const element = baustein.style[a];
                    if (element.value !== "") {
                        if (element.property.name.indexOf("width") !== -1 || element.property.name.indexOf("height") !== -1 || element.property.name.indexOf("margin") !== -1 || element.property.name.indexOf("border") !== -1 || element.property.name.indexOf("padding") !== -1) {
                            baustein_dom.style.setProperty(element.property.name, element.value);
                        } else {
                            baustein_item.style.setProperty(element.property.name, element.value);
                        }
                    }
                }
            }
    
            baustein_dom.addEventListener("click", (e: MouseEvent) => {
                if (e.target) {
                    const target = <HTMLElement> e.target;
                    if (target.id === baustein_dom_id) {
                        this.selectBaustein(baustein_id);
                    }
                }
                return false;
            }, false);
    
    
            // handle draggable condition
            if(baustein.renderType !== bausteinRenderType.tableRow) {
                const baustein_dom_const = baustein_dom;
                new LuxDragDrop(this.main, baustein_dom_const, {
                    mousedown: (event: MouseEvent) => {
                        const document_activeElement = document.activeElement;
                        if (document_activeElement === null) {
                            console.error("[BausteinEditor] document.activeElement is null");
                        } else {
                            console.log("dragdrop baustein_dom_const", baustein_dom_const)
                            console.log("dragdrop event", event)
                            let allow_dragdrop;
                            if (this.cursor_mode === 0) {
                                // prevent draggable from starting if the click is on the editor
                                allow_dragdrop = elements_drag_not_allowed.includes(document_activeElement) === false;
                                console.log("allow_dragdrop", allow_dragdrop);
                            } else if(this.cursor_mode === 1) {
                                allow_dragdrop = true;
                            } else {
                                console.info("[BausteinEditor] draggable not implemented for cursor mode:", this.cursor_mode);
                                return false;
                            }

                            if (allow_dragdrop) {
                                // Test if the draggable is baustein_dom
                                if (baustein_dom_const === event.target) {
                                    return true;
                                }
                                
                                // Test if the draggable is baustein_dom at least one of its children
                                for (let i = 0; i < baustein_dom_const.children.length; i++) {
                                    const child = baustein_dom_const.children[i];
                                    if (child === event.target) {
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    },
                    mousemove: null,
                    mouseup: (e: MouseEvent, reciever_element: HTMLElement) => {
                        // Go up the DOM Tree until we find a parent with the dataset "position_parent"
                        for (let tries = 0; tries < 4; tries++) {
                            if(typeof reciever_element.dataset.position_parent === "string") {
                                break;
                            } else {
                                if (reciever_element.parentElement === null) {
                                    console.error("[BausteinEditor]", "reciever_element.parentElement is null");
                                    break;
                                } else {
                                    reciever_element = reciever_element.parentElement;
                                }
                            }
                        }
        
                        if (typeof reciever_element.dataset.position_parent !== "string") {
                            console.info("[BausteinEditor]", "reciever_element.dataset.position_parent is not a string");
                        } else if (typeof reciever_element.dataset.position_sort !== "string") {
                            console.error("[BausteinEditor]", "reciever_element.dataset.position_sort is not a string");
                        } else {
                            const old_baustein_id = baustein_id;
                            const new_position = { 
                                parent: reciever_element.dataset.position_parent === "0" ? 0 : (parseInt(reciever_element.dataset.position_parent) || null), 
                                sort: reciever_element.dataset.position_sort === "0" ? 0 : (parseInt(reciever_element.dataset.position_sort) || null) 
                            };
        
                            console.log("drop on addBausteinSelector: old_baustein_id", old_baustein_id, "new position", new_position);
                            
                            if (new_position.sort === null) {
                                console.error("[BausteinEditor] LuxClickHoldDrag.callback_mouseup: new_position.sort is null");
                            } else {
                                this.moveBaustein(old_baustein_id, new Position(new_position.parent, new_position.sort));
                            }
                        }
                    }, maxsizes: true
                });
                baustein_dom.addEventListener("dragend", () => {
                    baustein_dom.draggable = false;
                });
            }
        }

        this.bausteine.push(baustein_dom);
        return baustein_dom;
    }

    
    render() {
        this.content.innerHTML = "";
        this.baustein_counter = 0;
        this.bausteine = [];
        this.types_array = Object.values(this.types);

        /*  Bausteine Recursive Graph Array
            this.data.bausteine[row] :: .parent :: .position
        */
        const bausteine = this.getBausteineChildren(null);
        for (let row = 0; row < bausteine.length; row++) {
            const baustein = bausteine[row];

            this.content.appendChild( 
                this.renderBausteinSelector(new Position(null, baustein.position.sort), true, true)
            );

            this.content.appendChild( 
                this.renderBaustein(baustein, new Position(null, baustein.position.sort))
            );
        }

        this.content.appendChild(
            this.renderBausteinSelector(new Position(null, this.getPositionSort(false)), false, true)
        );

                
        this.preview_render();
    }
    
    bausteinSelector_open(be_bausteinSelector: HTMLElement, be_bausteinSelector_layer: HTMLElement, be_bausteinSelector_layer_item_container1: HTMLElement, be_bausteinSelector_layer_item_container2: HTMLElement) { 
        const max_width = 446;
        const window_width = window.innerWidth;
        const window_height = window.innerHeight;

        this.underlay.style.display = "";
        be_bausteinSelector_layer.style.display = "";
        be_bausteinSelector_layer_item_container1.style.display = ""; 
        be_bausteinSelector_layer_item_container2.style.display = "none";
        be_bausteinSelector_layer.style.maxWidth = max_width + "px";
        be_bausteinSelector_layer.style.top = (window_height/2 - be_bausteinSelector_layer.clientHeight/2) + "px";
        be_bausteinSelector_layer.style.left = (window_width/2 - max_width/2) + "px";
        
        console.log("be_bausteinSelector", be_bausteinSelector)
        this.be_bausteinSelector_isOpen = true; 
    }
    bausteinSelector_close(be_bausteinSelector: HTMLElement, be_bausteinSelector_layer: HTMLElement) { 
        this.underlay.style.display = "none";
        be_bausteinSelector_layer.style.display = "none";
        this.be_bausteinSelector_isOpen = false;
    }
    
    bausteinSelector_toggle(be_bausteinSelector: HTMLElement, be_bausteinSelector_layer: HTMLElement, be_bausteinSelector_layer_item_container1: HTMLElement, be_bausteinSelector_layer_item_container2: HTMLElement) { 
        if(this.be_bausteinSelector_isOpen) { 
            this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
        } else { 
            this.bausteinSelector_open(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2);
        } 
    }
    
    apply_styles() { 
        // Apply Baustein Styles
        if (this.selected_baustein !== null && this.selected_baustein_id !== null) {
            const baustein = this.getBaustein(this.selected_baustein_id);
            const selected_baustein_editor: HTMLElement = <HTMLElement> this.selected_baustein.lastChild;
            
            for (let i = 0; i < this.open_baustein_attributes__formcontrols.length; i++) {
                const formcontrol = this.open_baustein_attributes__formcontrols[i];
                const property_name: string = formcontrol.name;
                const value = typeof formcontrol.dataset.value === "undefined"? formcontrol.value : formcontrol.dataset.value;

                let baustein_style_index: number = baustein.style.length;
                for (let b = 0; b < baustein.style.length; b++) {
                    if (baustein.style[b].property.name === property_name) {
                        baustein_style_index = b;
                        break;
                    }
                }

                if(baustein_style_index === baustein.style.length) {
                    if(value === "" || value === "0" || value === "auto") continue;
                    const new_style = new BausteinStyle(this.getStylePropertyByName(property_name), "");
                    if(new_style.property.options.length > 0 && new_style.property.options[0].value === value) continue;
                    baustein.style[baustein_style_index] = new_style;
                }

                baustein.style[baustein_style_index].value = value;
                
                let target;
                if (baustein.isParentType() || property_name.indexOf("margin") === 0 || property_name.indexOf("border") === 0 || property_name.indexOf("padding") === 0) {
                    target = this.selected_baustein;
                } else {
                    target = selected_baustein_editor;
                }

                if (baustein.style[baustein_style_index].property.useAsClass) {
                    for (let h = 0; h < baustein.style[baustein_style_index].property.options.length; h++) {
                        const class_value = baustein.style[baustein_style_index].property.options[h].value;
                        if(target.classList.contains(class_value)) target.classList.remove(baustein.style[baustein_style_index].property.options[h].value);
                    }
                    if(baustein.style[baustein_style_index].value !== "") target.classList.add(baustein.style[baustein_style_index].value);
                } else {
                    target.style.setProperty(baustein.style[baustein_style_index].property.name, baustein.style[baustein_style_index].value);
                }
            }
        }

        this.preview_render();
    }

    /// create a forminput. first options item is default value. Returns {content: HTMLElement, input: HTMLInputElement|HTMLSelectElement}
    formcontrol(domArk: string, type: string, name: string, title: string | null, value: string
        , options: { suffix?: string[], html_options?: HTMLOptionElement[], number_default?: number, number_min?: number, number_max?: number, onchange?: (form_control: FormControl)=>void }
    ): {content: HTMLElement, input: FormControl} {
        const fc_dom_id = (this.dom_id+'_'+domArk+'_fc_'+name);
        let useDataValue = false;
        const suffix_const: string[] = options.suffix || [];
        let suffix_default: string = suffix_const.length? suffix_const[0] : "";

        const be_formrow = this.createElement("div", "", "be_formrow");
        let form_control: FormControl;

        if (type === "image") {
            const image_source_text = be_formrow.appendChild( document.createElement("div") );
            image_source_text.innerText = value;
            image_source_text.style.fontSize = "0.6rem";
            image_source_text.style.marginBottom = "2px";
            
            form_control = <HTMLButtonElement> be_formrow.appendChild(
                this.createElement("button", fc_dom_id, "be-form-control")
            );
            form_control.type = "button";
            form_control.innerHTML = title!.toString();
            form_control.name = name;
            form_control.value = value;

            form_control.addEventListener("click", () => {
                if (this.selected_baustein_id !== null) {
                    this.dialog_media(bausteinRenderType.image).then((image_url) => {
                        image_source_text.innerText = image_url;
                        form_control.value = image_url;
                        if(options.onchange) options.onchange(form_control);
                    });
                }
            });
        } else {
            if (type === "checkbox") {
                form_control = <HTMLInputElement> be_formrow.appendChild(
                    this.createElement("input", fc_dom_id, "be-form-control")
                );
                form_control.type = "checkbox";
                form_control.name = name;
                form_control.value = value;
                form_control.style.marginRight = "4px";

                if (title !== null) {
                    const label: HTMLLabelElement = <HTMLLabelElement> be_formrow.appendChild(
                        this.createElement("label", "", "")
                    );
                    label.htmlFor = fc_dom_id;
                    label.innerHTML = title;
                }
                
            } else {
                if (title !== null) {
                    const label: HTMLLabelElement = <HTMLLabelElement> be_formrow.appendChild(
                        this.createElement("label", "", "")
                    );
                    label.htmlFor = fc_dom_id;
                    label.innerHTML = title;
                }
                
                const form_control_container = be_formrow.appendChild(
                    this.createElement("div", "", "be-form-control-container")
                );
                if (type === "number") {
                    form_control_container.classList.add("number");
                }
        
                if (type === "select") {
                    form_control = <HTMLSelectElement> form_control_container.appendChild(
                        this.createElement("select", fc_dom_id, "be-form-control")
                    );
                    form_control.name = name;
                    
                    if (options.html_options) {
                        for (let i = 0; i < options.html_options.length; i++) {
                            const option_element: HTMLOptionElement = <HTMLOptionElement> form_control.appendChild(
                                this.createElement("option", "", "")
                            );
                            option_element.value = options.html_options[i].value;
                            option_element.innerHTML = options.html_options[i].text;
                
                            if (options.html_options[i].value == value) {
                                option_element.setAttribute("selected", "selected");
                            }
                        }
                    }
                } else {
                    form_control = <HTMLInputElement> form_control_container.appendChild(
                        this.createElement("input", fc_dom_id, "be-form-control")
                    );
                    form_control.name = name;
                    form_control.value = value;
        
                    if (type === "color") {
                        form_control.type = "color";
                        useDataValue = true;
                    } else if (type === "number") {
                        form_control.type = "text";
                        form_control.dataset.suffix = suffix_default;
        
                        const form_control_container_up: HTMLInputElement = <HTMLInputElement> form_control_container.appendChild(
                            this.createElement("div", "", "be-form-control-container_up")
                        );
                        form_control_container_up.innerHTML = '⮝';
        
                        const form_control_container_down: HTMLInputElement = <HTMLInputElement> form_control_container.appendChild(
                            this.createElement("div", "", "be-form-control-container_down")
                        );
                        form_control_container_down.innerHTML = '⮟';
        
                        const number_default = options.number_default? options.number_default : 0;
                        const number_min = options.number_min? options.number_min : null;
                        const number_max = options.number_max? options.number_max : null;
                        
                        const formcontrol_number = (add: number) => {
                            const value = form_control.value.replace(" ", "");

                            // constants check onChange; if one matches, use it
                            if (add === 0 && options.html_options && options.html_options.length > 0) {
                                for (let i = 0; i < options.html_options.length; i++) {
                                    const option = options.html_options[i];
                                    
                                    if (option.value === value) {
                                        form_control.value = value;
                                        return;
                                    }
                                }
                            }
                            
                            // number check
                            let num = parseFloat(value);
                            if (isNaN(num)) {
                                num = number_default;
                            } else {
                                const cmp_suffix = form_control.value.replace(num.toString(), "");
                                for(let i = 0; i < suffix_const.length; i++) {
                                    if (cmp_suffix === suffix_const[i]) {
                                        suffix_default = suffix_const[i];
                                        break;
                                    }
                                }
                            }
                            
                            const countDecimals = num % 1? num.toString().split(".")[1].length : 0;
                            if (countDecimals === 0) {
                                num = num + add;
                            } else {
                                const mltp = Math.pow(10, countDecimals);
                                num = Math.floor((num*mltp) + (add*mltp))/mltp;
                            }
                            
                            if (number_min !== null && num < number_min) {
                                num = number_min;
                            } else if (number_max !== null && num > number_max) {
                                num = number_max;
                            }
        
                            form_control.value = num.toString() + suffix_default;
                        }
            
                        form_control.addEventListener("change", () => { 
                            formcontrol_number(0);
                            if(options.onchange) options.onchange(form_control); 
                        });
                        form_control.addEventListener("keydown", (e: KeyboardEvent) => { 
                            const steps = e.shiftKey? 10 : (e.ctrlKey? 0.1 : 1)
            
                            const keyCode = e.which | e.keyCode;
                            if (keyCode === 38) {
                                formcontrol_number(steps);
                                if(options.onchange) options.onchange(form_control); 
                                return false;
                            } else if(keyCode === 40) {
                                formcontrol_number(-steps);
                                if(options.onchange) options.onchange(form_control); 
                                return false;
                            }
                        });
                        form_control_container_up.addEventListener("click", () => { formcontrol_number(+1); if(options.onchange) options.onchange(form_control);  });
                        form_control_container_down.addEventListener("click", () => { formcontrol_number(-1); if(options.onchange) options.onchange(form_control);  });
                    } else {
                        form_control.type = "text";
                    }
                }
            }
    
            // Events
            if (type !== "number") {
                const _useDataValue = useDataValue;
                if (_useDataValue) {
                    form_control.dataset.value = value;
                }
    
                form_control.addEventListener("change", () => { 
                    if (_useDataValue) {
                        form_control.dataset.value = form_control.value;
                    }
                    if(options.onchange) options.onchange(form_control); 
                });
            }
    
            form_control.autocomplete = "off";
        }

        return { content: be_formrow, input: form_control };
    }

    /// helper funktion for creating a forminput of layout devtool. Position values: null = do not set, empty = center, non-empty = normal 
    layout_fc(baustein: Baustein, styleName: string, default_value: string, top: string | null, right: string | null, bottom: string | null, left: string | null) {
        const bausteinStyleProperty = this.getStylePropertyByName(styleName);
        const bausteinStyleValue = baustein.getStyleValue(styleName, default_value);
        
        const formcontrol = this.formcontrol("baustein", "number", bausteinStyleProperty.name, null, bausteinStyleValue, {
            suffix: bausteinStyleProperty.suffix, html_options: bausteinStyleProperty.get_html_options(), onchange: () => this.apply_styles()
        });
        const be_layout_fc: HTMLInputElement = <HTMLInputElement> formcontrol.content;
        be_layout_fc.style.width = "34px";
        be_layout_fc.style.height = "30px";

        if(top !== null) be_layout_fc.style.top = top === ""? "calc(50% - ("+be_layout_fc.style.height+" / 2))" : top;
        if(bottom !== null) be_layout_fc.style.bottom = bottom === ""? "calc(50% - ("+be_layout_fc.style.height+" / 2))" : bottom;
        if(left !== null) be_layout_fc.style.left = left === ""? "calc(50% - ("+be_layout_fc.style.width+" / 2))" : left;
        if(right !== null) be_layout_fc.style.right = right === ""? "calc(50% - ("+be_layout_fc.style.width+" / 2))" : right;

        this.open_baustein_attributes__formcontrols.push(formcontrol.input);
        return be_layout_fc;
    }

    open_baustein_attributes(baustein_id: number) {
        if (this.open_baustein_attributes__baustein_id === null || this.open_baustein_attributes__baustein_id !== baustein_id) {
            const current_baustein = this.getBaustein(baustein_id);
            this.open_baustein_attributes__baustein_id = baustein_id;
            this.open_baustein_attributes__formcontrols = [];
            this.sidebar_content__baustein_styles.innerHTML = "";

            if(current_baustein.renderType === bausteinRenderType.static_undeletable) return;

            // Layout view like Firefox DevTools
            const be_layout_view = this.sidebar_content__baustein_styles.appendChild(
                this.createElement("div", "", "be_layout_view")
            );

            // margin
            const be_layout_view_margin = be_layout_view.appendChild(
                this.createElement("div", "", "be_layout_view_margin")
            );
            const be_layout_view_margin_indicator = be_layout_view_margin.appendChild(
                this.createElement("div", "", "be_layout_view_indicator")
            );
            be_layout_view_margin_indicator.innerHTML = "margin";

            be_layout_view_margin.appendChild(this.layout_fc(current_baustein, "margin-top", "0", "-6px", null, null, ""));
            be_layout_view_margin.appendChild(this.layout_fc(current_baustein, "margin-top", "0", "-6px", null, null, ""));
            be_layout_view_margin.appendChild(this.layout_fc(current_baustein, "margin-bottom", "0", null, null, "-6px", ""));
            be_layout_view_margin.appendChild(this.layout_fc(current_baustein, "margin-left", "0", "", null, null, "-6px"));
            be_layout_view_margin.appendChild(this.layout_fc(current_baustein, "margin-right", "0", "", "-6px", null, null));

            // border
            const be_layout_view_border = be_layout_view_margin.appendChild(
                this.createElement("div", "", "be_layout_view_border")
            );
            const be_layout_view_border_indicator = be_layout_view_border.appendChild(
                this.createElement("div", "", "be_layout_view_indicator")
            );
            be_layout_view_border_indicator.setAttribute("style", "top: -8px; left: 8px;");
            be_layout_view_border_indicator.innerHTML = 'border <i class="fa-solid fa-edit"></i>';

            be_layout_view_border_indicator.addEventListener("click", () => {
                this.dialog_border(current_baustein);
            });

            be_layout_view_border.appendChild(this.layout_fc(current_baustein, "border-top-width", "0", "-13px", null, null, ""));
            be_layout_view_border.appendChild(this.layout_fc(current_baustein, "border-bottom-width", "0", null, null, "-13px", ""));
            be_layout_view_border.appendChild(this.layout_fc(current_baustein, "border-left-width", "0", "", null, null, "-14px"));
            be_layout_view_border.appendChild(this.layout_fc(current_baustein, "border-right-width", "0", "", "-14px", null, null));

            // padding
            const be_layout_view_padding = be_layout_view_border.appendChild(
                this.createElement("div", "", "be_layout_view_padding")
            );
            const be_layout_view_padding_indicator = be_layout_view_padding.appendChild(
                this.createElement("div", "", "be_layout_view_indicator")
            );
            be_layout_view_padding_indicator.innerHTML = "padding";

            be_layout_view_padding.appendChild(this.layout_fc(current_baustein, "padding-top", "0", "0px", null, null, ""));
            be_layout_view_padding.appendChild(this.layout_fc(current_baustein, "padding-bottom", "0", null, null, "0px", ""));
            be_layout_view_padding.appendChild(this.layout_fc(current_baustein, "padding-left", "0", "", null, null, "8px"));
            be_layout_view_padding.appendChild(this.layout_fc(current_baustein, "padding-right", "0", "", "8px", null, null));

            // inner
            const be_layout_view_inner = be_layout_view_padding.appendChild(
                this.createElement("div", "", "be_layout_view_inner")
            );
            be_layout_view_inner.appendChild(this.layout_fc(current_baustein, "width", "auto", null, null, null, null));
            be_layout_view_inner.appendChild(this.createElement("span", "", "be_layout_wh_delimiter")).innerHTML = " &times; ";
            be_layout_view_inner.appendChild(this.layout_fc(current_baustein, "height", "auto", null, null, null, null));
            ///////////////////////////////////////////////////////


            if (current_baustein.renderType === bausteinRenderType.image) {
                const image_fcr = this.formcontrol("image_selector", "image", "", "Bild", current_baustein.content, {
                    onchange: (form_control) => {
                        current_baustein.content = form_control.value;
                        if (this.selected_baustein !== null) {
                            const img = this.selected_baustein.querySelector("img");
                            if (img !== null) {
                                img.src = form_control.value;
                            }
                        }
                    }
                });
                this.sidebar_content__baustein_styles.appendChild(image_fcr.content);

                const alt_formcontroll = this.formcontrol("baustein_alt", "text", "alt", 'Alternativtext (alt)', current_baustein.getAttribute("alt")||"", {
                    onchange: () => {
                        current_baustein.setAttribute("alt", alt_formcontroll.input.value);
                    }
                });
                this.sidebar_content__baustein_styles.appendChild(alt_formcontroll.content);

                const title_formcontroll = this.formcontrol("baustein_title", "text", "title", 'Titel', current_baustein.getAttribute("title")||"", {
                    onchange: () => {
                        current_baustein.setAttribute("title", title_formcontroll.input.value);
                    }
                });
                this.sidebar_content__baustein_styles.appendChild(title_formcontroll.content);

            } else if (current_baustein.renderType === bausteinRenderType.iframe) {
                const iframe_fcr = this.formcontrol("src_input", "text", "", "Webseiten URL", current_baustein.getAttribute("src")||"", {
                    onchange: (form_control) => {
                        current_baustein.setAttribute("src", form_control.value);
                        if (this.selected_baustein !== null) {
                            const iframe = this.selected_baustein.querySelector("iframe");
                            if (iframe !== null) {
                                iframe.src = form_control.value;
                            }
                        }
                    }
                });
                this.sidebar_content__baustein_styles.appendChild(iframe_fcr.content);

            } else if (current_baustein.renderType === bausteinRenderType.container || current_baustein.renderType === bausteinRenderType.layout || current_baustein.renderType === bausteinRenderType.table) {
                const rowcol_container = this.sidebar_content__baustein_styles.appendChild(this.createElement("div", "", "be_rowcol_container"));
                const table_children = current_baustein.renderType === bausteinRenderType.table? this.getBausteineChildren(current_baustein.id) : [];

                if (current_baustein.renderType === bausteinRenderType.table || current_baustein.renderType === bausteinRenderType.layout) {
                    const columns_fcr = this.formcontrol("dialog", "number", "columns", LOCALES.get_item("columns"), current_baustein.columns.toString(), {
                        number_default: 1, number_min: 1, number_max: 40,
                        onchange: () => {
                            const parsed_value = parseInt(columns_fcr.input.value);
                            console.log("parsed_value", parsed_value)
                            if(isNaN(parsed_value) === false) {
                                console.log("current_baustein.columns", current_baustein.columns)
                                current_baustein.columns = parsed_value;
                                console.log("current_baustein.columns 2", current_baustein.columns)
                                table_children.forEach(child => child.columns = parsed_value);
                                this.rowcol_amount_evaluate();
                                this.render();
                            }
                        }
                    });
                    columns_fcr.content.style.display = "inline-block";
                    columns_fcr.content.style.verticalAlign = "top";
                    columns_fcr.content.style.width = "100px";
                    rowcol_container.appendChild(columns_fcr.content);
                }
                
                if(current_baustein.renderType === bausteinRenderType.table ||current_baustein.renderType === bausteinRenderType.container) {
                    const rows_fcr = this.formcontrol("dialog", "number", "rows", LOCALES.get_item("rows"), current_baustein.rows.toString(), {
                        number_default: 1, number_min: 1, number_max: 40,
                        onchange: () => {
                            const parsed_value = parseInt(rows_fcr.input.value);
                            if(isNaN(parsed_value) === false) {
                                current_baustein.rows = parsed_value;
                                this.rowcol_amount_evaluate();
                                this.render();
                            }
                        }
                    });
                    rows_fcr.content.style.display = "inline-block";
                    rows_fcr.content.style.verticalAlign = "top";
                    rows_fcr.content.style.width = "100px";
                    rowcol_container.appendChild(rows_fcr.content);
                }

            } else if (current_baustein.tag === "a") {
                const href_formcontroll = this.formcontrol("baustein_href", "text", "href", 'Link (href)', current_baustein.getAttribute("href")||"", {
                    onchange: () => {
                        current_baustein.setAttribute("href", href_formcontroll.input.value);
                    }
                });
                this.sidebar_content__baustein_styles.appendChild(href_formcontroll.content);

                // new tab
                const target_formcontroll = this.formcontrol("baustein_target", "checkbox", "target", 'in neuen Tab öffnen', current_baustein.getAttribute("target")||"", {
                    onchange: () => {
                        const target_formcontroll_input = <HTMLInputElement> target_formcontroll.input;
                        current_baustein.setAttribute("target", target_formcontroll_input.checked? "_blank" : "");
                    }
                });
                this.sidebar_content__baustein_styles.appendChild(target_formcontroll.content);

                const title_formcontroll = this.formcontrol("baustein_title", "text", "title", 'Title', current_baustein.getAttribute("title")||"", {
                    onchange: () => {
                        current_baustein.setAttribute("title", title_formcontroll.input.value);
                    }
                });
                this.sidebar_content__baustein_styles.appendChild(title_formcontroll.content);
            }
    
            for (let i = 0; i < current_baustein.style.length; i++) {
                const element = current_baustein.style[i];
                if (element.property.showInBausteinAttributesSidebar) {
                    // styleProperty is necessery to fix the bug where a refernce points to an undefined object
                    const styleProperty = this.getStylePropertyByName(element.property.name);
    
                    const formcontrol = this.formcontrol("baustein", styleProperty.type, styleProperty.name, LOCALES.get_item(styleProperty.name), element.value, {
                        suffix: styleProperty.suffix, html_options: styleProperty.get_html_options(), onchange: () => {
                            this.apply_styles();
                        }
                    });
                    this.sidebar_content__baustein_styles.appendChild(formcontrol.content)
                    this.open_baustein_attributes__formcontrols.push(formcontrol.input)
                }
            }


            // toggleableClasses
            if (current_baustein.toggleableClasses.length > 0) {
                const toggleableClasses_container = this.sidebar_content__baustein_styles.appendChild(this.createElement("div", "", "be_toggleable_classes_container"));
                const toggleableClasses_title = toggleableClasses_container.appendChild(this.createElement("div", "", "be_toggleable_classes_title"));
                toggleableClasses_title.innerHTML = LOCALES.get_item("toggleable_classes");
                const toggleableClasses_content = toggleableClasses_container.appendChild(this.createElement("div", "", "be_toggleable_classes_content"));
                for (let i = 0; i < current_baustein.toggleableClasses.length; i++) {
                    const toggleableClass = current_baustein.toggleableClasses[i];
                    if (toggleableClass.toggleable) {
                        const toggleableClass_container = toggleableClasses_content.appendChild(this.createElement("div", "", "be_toggleable_class_container"));
    
                        const toggleableClass_class_input = this.createElement("input", "", "be_toggleable_class_class_input");
                        toggleableClass_container.append(toggleableClass_class_input);
                        toggleableClass_class_input.type = "checkbox";
                        toggleableClass_class_input.checked = toggleableClass.active;
                        toggleableClass_class_input.addEventListener("change", () => {
                            toggleableClass.active = toggleableClass_class_input.checked;

                            // IF is active, add class to class, otherwise remove class
                            if (toggleableClass.active) {
                                current_baustein.addClass(toggleableClass.name);
                            } else {
                                current_baustein.removeClass(toggleableClass.name);
                            }
                        });
    
                        const toggleableClass_label = toggleableClass_container.appendChild(this.createElement("label", "", "be_toggleable_class_title"));
                        toggleableClass_label.innerHTML = toggleableClass.name;
                    }
                }
            }
            
            
            const class_formcontroll = this.formcontrol("baustein_class", "text", "class"
                , LOCALES.get_item("css_classes") + ' <div style="font-size: 11px; margin-bottom: 2px;">' + LOCALES.get_item("css_classes_advanced") + '</div>'
                , current_baustein.class, {
                    onchange: () => {
                        current_baustein.class = class_formcontroll.input.value;
                    }
            });
            this.sidebar_content__baustein_styles.appendChild(class_formcontroll.content);


            if (current_baustein.renderType !== bausteinRenderType.spoiler_toggler 
                && current_baustein.renderType !== bausteinRenderType.spoiler_content 
                && current_baustein.renderType != bausteinRenderType.static_undeletable) {
                const baustein_delete_button: HTMLButtonElement = <HTMLButtonElement> this.sidebar_content__baustein_styles.appendChild(
                    this.createElement("button", this.dom_id+'_deleteBaustein', "be-form-control bautstein-delete")
                )
                baustein_delete_button.innerHTML = LOCALES.get_item("delete_block");
                baustein_delete_button.type = "button";
        
                baustein_delete_button.addEventListener("click", () => {
                    this.dialog.start(LOCALES.get_item("delete_block"), LOCALES.get_item("confirm_delete"), null, LOCALES.get_item("delete"), LOCALES.get_item("cancel"), null, () => {
                        this.close_baustein_attributes();
                        this.deleteBaustein(baustein_id);
                        this.dialog.close();
                    });
                });
            }
    
            this.sidebar_content__site.style.display = "none";
            this.sidebar_content__baustein.style.display = "";
            //this.sidebar_header_col__site.classList.remove("active");
            //this.sidebar_header_col__baustein.classList.add("active");
            //this.sidebar_header_col__baustein.classList.remove("disabled");
        }
    }
    

    close_baustein_attributes() {
        this.sidebar_content__site.style.display = "";
        this.sidebar_content__baustein.style.display = "none";
        //this.sidebar_header_col__site.classList.add("active");
        //this.sidebar_header_col__baustein.classList.remove("active");
        //this.sidebar_header_col__baustein.classList.add("disabled");
    }

    preview_render() {
        if (this.preview_content.style.display === "") {
            if (this.preview_iframe_url === null) {
                this.preview_content.innerHTML = this.export().html;
                // Make all a tags open in new tab
                const a_tags = this.preview_content.getElementsByTagName("a");
                for (let i = 0; i < a_tags.length; i++) {
                    a_tags[i].target = "_blank";
                }
    
                // Make all img tags undraggable
                const img_tags = this.preview_content.getElementsByTagName("img");
                for (let i = 0; i < img_tags.length; i++) {
                    img_tags[i].setAttribute("draggable", "false");
                }
            } else {
                // Create iframe
                let preview_iframe = this.preview_content.querySelector("iframe");
                if(preview_iframe === null) {
                    this.preview_content.innerHTML = "";
                    preview_iframe = this.preview_content.appendChild(this.createElement("iframe", "", "be_preview_iframe"));
                    preview_iframe.src = this.preview_iframe_url;
                    preview_iframe.onload = () => {
                        preview_iframe!.contentWindow!.postMessage(this.export().html, '*');
                    }
                } else {
                    preview_iframe!.contentWindow!.postMessage(this.export().html, '*');
                }

            }
        }
    }

    request(type: string, endpoint: string, params: string): Promise<XMLHttpRequest> {
        return new Promise((resolve: (value: XMLHttpRequest)=>void, reject: (value: XMLHttpRequest)=>void) => {
            this.ajax_loader.style.display = "";
            this.ajax_loader.style.width = "";
            this.ajax_loader.style.minWidth = "";

            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                this.ajax_loader.style.width = (4 / xhttp.readyState) * 80 + "%";

                if (xhttp.readyState == 4) {
                    if (xhttp.status == 200) {
                        resolve(xhttp);
                    } else {
                        reject(xhttp);
                    }

                    this.ajax_loader.style.width = "100%";
                    setTimeout(() => {
                        this.ajax_loader.style.display = "none";
                    }, 1000);
                }
            };

            if (type === "GET") {
                xhttp.open("GET", endpoint+params, true);
                xhttp.send();
            } else {
                xhttp.open("POST", endpoint, true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(params);
            }
        })
    }

    dialog_border(baustein: Baustein) {
        const border_modall = document.createElement("div");
        const tabcontainer = border_modall.appendChild( document.createElement("div") );
        const contentcontainer = border_modall.appendChild( document.createElement("div") );

        const tabs_name = ["style", "radius"];
        const tabs_dom: HTMLDivElement[] = [];
        const tabs_container_dom: HTMLDivElement[] = [];
        const inputs: (FormControl)[] = [];

        for (let i = 0; i < tabs_name.length; i++) {
            const index_const = i;

            tabs_dom[i] = tabcontainer.appendChild( document.createElement("div") );
            tabs_dom[i].className = "border_modall_tab";
            tabs_dom[i].innerHTML = tabs_name[i];

            tabs_container_dom[i] = contentcontainer.appendChild( document.createElement("div") );
            tabs_container_dom[i].className = "border_modall_tabcontent";
            tabs_container_dom[i].style.display = "none";

            tabs_dom[i].addEventListener("click", () => {
                for (let i = 0; i < tabs_dom.length; i++) {
                    tabs_dom[i].classList.remove("active");
                    tabs_container_dom[i].style.display = "none";
                }
                tabs_dom[index_const].classList.add("active");
                tabs_container_dom[index_const].style.display = "";
            });
        }

        tabs_dom[0].classList.add("active");
        tabs_container_dom[0].style.display = "";

        const sides = ["top", "right", "bottom", "left"];

        // style
        const style_index = 0;
        const style_options = [ 
            new Option("normal", "initial"), new Option("solid", "solid"), new Option("dashed", "dashed"), new Option("dotted", "dotted"), new Option("double", "double")
        ];
        for (let s = 0; s < sides.length; s++) {
            const tabs_container_style_dom = tabs_container_dom[style_index].appendChild(document.createElement("div"));
            tabs_container_style_dom.style.border = "1px solid #007cba";
            const side = sides[s];
            
            // side title
            const side_dom = tabs_container_style_dom.appendChild(document.createElement("div"));
            side_dom.innerHTML = side;
            side_dom.className = "border_modall_undersides";

            // border width
            const bw_name = "border-"+side+"-width";
            const bw_value = baustein.getStyleValue(bw_name, "");
            const bw_fc = this.formcontrol(bw_name, "number", bw_name, null, bw_value, { suffix: ["px"] });
            bw_fc.content.className = "border_modall_undersides be_formrow";
            tabs_container_style_dom.appendChild(bw_fc.content);
            inputs.push(bw_fc.input);

            // border style type
            const bs_name = "border-"+side+"-style";
            const bs_value = baustein.getStyleValue(bw_name, "");
            const bs_fc = this.formcontrol(bw_name, "select", bw_name, null, bw_value, { html_options: style_options });
            bw_fc.content.className = "border_modall_undersides be_formrow";
            tabs_container_style_dom.appendChild(bw_fc.content);
            inputs.push(bw_fc.input);
            
            // color
            const name = "border-"+side+"-color";
            const value = baustein.getStyleValue(bw_name, "");
            const fc = this.formcontrol(bw_name, "color", bw_name, null, bw_value, {});
            bw_fc.content.className = "border_modall_undersides be_formrow";
            tabs_container_style_dom.appendChild(bw_fc.content);
            inputs.push(bw_fc.input);
        }

        // radius
        const radius_index = 1;
        const radius_corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
        radius_corners.forEach((corner) => {
            const name = "border-"+corner+"-radius";
            const value = baustein.getStyleValue(name, "0px");
            const fc = this.formcontrol(name, "number", name, name, value, {
                number_min: 0, suffix: ["px", "%"]
            })
            tabs_container_dom[radius_index].appendChild(fc.content);
            inputs.push(fc.input);
        });

        this.dialog.start(LOCALES.get_item("border_settings"), border_modall, LOCALES.get_item("save"), null, LOCALES.get_item("cancel"), () => {
            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                baustein.setStyle(input.name, input.value);
            }
            this.open_baustein_attributes__baustein_id = -1;
            this.open_baustein_attributes(baustein.id);
            this.render();
            this.dialog.close();
        }, null, null);
    }

    dialog_rowcol(baustein: Baustein): Promise<void> {
        return new Promise((resolve: ()=>void, reject: ()=>void) => {
            const content = this.createElement("div", "", "");

            let columns_fcr = null;
            if (baustein.renderType === bausteinRenderType.table || baustein.renderType === bausteinRenderType.layout) {
                columns_fcr = this.formcontrol("dialog", "number", "columns", LOCALES.get_item("columns"), "", {
                    number_default: 1, number_min: 1, number_max: 40,
                });
                columns_fcr.content.style.display = "inline-block";
                columns_fcr.content.style.verticalAlign = "top";
                columns_fcr.content.style.width = "100px";
                columns_fcr.input.value = "1";
                content.appendChild(columns_fcr.content);
            }
            
            let rows_fcr = null;
            if(baustein.renderType === bausteinRenderType.table || baustein.renderType === bausteinRenderType.container) {
                rows_fcr = this.formcontrol("dialog", "number", "rows", LOCALES.get_item("rows"), "", {
                    number_default: 1, number_min: 1, number_max: 40,
                });
                rows_fcr.content.style.display = "inline-block";
                rows_fcr.content.style.verticalAlign = "top";
                rows_fcr.content.style.width = "100px";
                rows_fcr.input.value = "1";
                content.appendChild(rows_fcr.content);
            }

            const error_message = this.createElement("div", "", "error-message");
            error_message.style.color = "red";

            
            this.dialog.start(baustein.title+" " + LOCALES.get_item("create"), content, LOCALES.get_item("finish"), null, LOCALES.get_item("cancel"), () => {
                if (columns_fcr !== null) {
                    const columns_number = parseInt(columns_fcr.input.value);
                    if (columns_number < 1) {
                        error_message.innerHTML = '"Spalten Anzahl" muss größer als 0 sein';
                        return false;
                    } else {
                        baustein.columns = columns_number;
                    }
                }
                
                if (rows_fcr !== null) {
                    const rows_number = parseInt(rows_fcr.input.value);
                    if (rows_number < 1) {
                        error_message.innerHTML = '"Reihen Anzahl" muss größer als 0 sein';
                        return false;
                    } else {
                        baustein.rows = rows_number;
                    }
                }
                
                resolve();
                this.dialog.close();
            }, null, () => {
                this.dialog.close();
                reject();
            });
        });

    }

    dialog_media(renderType: number): Promise<string> {
        return new Promise((resolve: (image_url: string)=>void, reject: ()=>void) => {
            let search_endpoint: string, register_endpoint: string;
            if (renderType === bausteinRenderType.image) {
                search_endpoint = this.api_endpoints.image_search;
            } else {
                search_endpoint = "";
            }

            const content = this.createElement("div", "", "");
            const content_search = content.appendChild(this.createElement("div", "", "be-dialog-media-search"));
            content_search.style.paddingBottom = "20px";
            const content_search_input = <HTMLInputElement> content_search.appendChild(this.createElement("input", "", "be-dialog-media-search-input be-form-control"));
            content_search_input.type = "text";
            content_search_input.placeholder = LOCALES.get_item("search_placeholder");
            content_search_input.style.display = "inline-block"; content_search_input.style.verticalAlign = "middle";
            const content_search_submit = <HTMLButtonElement> content_search.appendChild(this.createElement("button", "", "be-dialog-media-search-submit __dialog-btn"));
            content_search_submit.type = "button";
            content_search_submit.innerHTML = LOCALES.get_item("search");
            content_search_submit.style.display = "inline-block"; content_search_submit.style.verticalAlign = "middle";
            content_search_submit.style.width = "66px";
            content_search_submit.style.padding = "6px";
            content_search_submit.style.marginLeft = "8px";
            content_search_submit.style.marginRight = "0";
            content_search_submit.style.marginBottom = "0";
            
            content_search_input.style.width = "calc(100% - "+content_search_submit.style.width+" - "+content_search_submit.style.marginLeft+")";

            const content_results = content.appendChild(this.createElement("div", "", "be-dialog-media-results"));
            content_results.style.overflowY = "auto";
            content_results.style.maxHeight = "90vh";

            

            // Pagination
            let current_page = 1;
            const pagination = content.appendChild(this.createElement("div", "", "be-dialog-media-pagination"));

            const pagination_prev = <HTMLButtonElement> pagination.appendChild(this.createElement("button", "", "__dialog-btn"));
            pagination_prev.type = "button";
            pagination_prev.innerText = LOCALES.get_item("back");
            pagination_prev.disabled = true;

            const pagination_current = pagination.appendChild(this.createElement("div", "", ""));
            pagination_current.innerText = "1";

            const pagination_next = <HTMLButtonElement> pagination.appendChild(this.createElement("button", "", "__dialog-btn"));
            pagination_next.type = "button";
            pagination_next.innerText = LOCALES.get_item("forward");


            // Events
            const start_search = (page: number) => {
                if(page < 1) return;

                pagination_prev.disabled = true;
                pagination_next.disabled = true;
                current_page = page;
                pagination_current.innerText = page.toString();

                this.request("GET", search_endpoint, "&q="+content_search_input.value + "&page="+current_page)
                .then((response) => {
                    const media_array = JSON.parse(response.responseText);
                    content_results.innerHTML = '';

                    for (let i = 0; i < media_array.length; i++) {
                        const image_data = media_array[i];
                        content_results.append(
                            this.create_dialog_media_item(image_data, resolve)
                        );
                    }

                    if(current_page > 1) pagination_prev.disabled = false;
                    pagination_next.disabled = false;
                });
            }
            content_search_input.addEventListener("change", () => start_search(1));
            content_search_submit.addEventListener("click", () => start_search(1));
            pagination_prev.addEventListener("click", () => start_search(current_page -1));
            pagination_next.addEventListener("click", () => start_search(current_page +1));
            
            this.dialog.start(LOCALES.get_item("load_image"), content, '<i class="fa-solid fa-sync"></i> ' + LOCALES.get_item("refresh_view"), null, LOCALES.get_item("cancel"), () => {
                start_search(current_page);
            }, null, () => {
                this.dialog.close();
                reject();
            });

            //content_results.style.height = "calc(500px - "+content_search.clientHeight+"px - "+content_search.style.paddingBottom+" - "+pagination.clientHeight+"px)";
            content_results.style.height = (500 - content_search.clientHeight - pagination.clientHeight)+"px";

            if (this.image_upload !== null) {
                const __dialog_footer = document.getElementById("__dialog_footer");
                const upload_button = <HTMLButtonElement> this.createElement("button", "", "__dialog-btn __dialog-btn-cyan");
                upload_button.innerHTML = '<i class="fa-solid fa-upload"></i> ' + LOCALES.get_item("upload_image");
                upload_button.addEventListener("click", () => { 
                    if(this.image_upload !== null) {
                        this.image_upload().then((image_data) => {
                            console.log("image_data: in BausteinEditor", image_data);
                            
                            content_results.prepend(
                                this.create_dialog_media_item(image_data, resolve)
                            );
                        })
                    }
                });
                __dialog_footer?.prepend(upload_button);
            }

            start_search(1);
        });
    }

	private create_dialog_media_item(image_data: MediaImageData, image_select_event: (image_url: string) => void) {
		const row = this.createElement("div", "", "row");
		row.style.display = "inline-block";
		row.style.verticalAlign = "top";
		row.style.width = "calc(50% - 18px)";
		row.style.maxWidth = "100%";
		row.style.border = "1px solid #ccc";
		row.style.borderRadius = "6px";
		row.style.margin = "4px";
		row.style.textAlign = "center";
		row.style.overflow = "hidden";

		const image_container = <HTMLImageElement>row.appendChild(this.createElement("div", "", "col"));
		image_container.style.position = "relative";
		image_container.style.width = "100%";
		image_container.style.height = "200px";
		image_container.style.cursor = "pointer";
		image_container.addEventListener("click", () => {
			this.fullscreen_image_modal_show(image_data.url);
		});

		const image = <HTMLImageElement>image_container.appendChild(this.createElement("img", "", ""));
		image.src = image_data.url;
		image.style.maxWidth = "100%";
		image.style.maxHeight = "100%";

		const image_plus = <HTMLImageElement>image_container.appendChild(this.createElement("div", "", ""));
		image_plus.style.position = "absolute";
		image_plus.style.top = "10px";
		image_plus.style.right = "10px";
		image_plus.style.fontSize = "1.2rem";
		image_plus.style.color = "#fff";
		image_plus.style.width = "30px";
		image_plus.style.height = "30px";
		image_plus.style.lineHeight = "1.5";
		image_plus.style.borderRadius = "180%";
		image_plus.style.background = "rgba(0,0,0,0.5)";
		image_plus.innerHTML = '<i class="fa-solid fa-search-plus"></i>';

		const title = row.appendChild(this.createElement("div", "", "col"));
		title.innerText = image_data.name;
		title.style.marginBottom = "8px";

		const button = <HTMLButtonElement>row.appendChild(this.createElement("button", "", "__dialog-btn __dialog-btn-green"));
		button.type = "button";
		button.innerText = LOCALES.get_item("select");;
		button.style.marginBottom = "8px";

		const image_id = image_data.file_id;
		button.addEventListener("click", () => {
            if(this.media_register) this.media_register(image_data);

            image_select_event(image_data.url);
            this.dialog.close();
		});

        return row;
	}

    fullscreen_image_modal_show(url: string) {
        let fullscreen_image_modal = document.getElementById("fullscreen_image_modal");
        if(fullscreen_image_modal === null) {
            fullscreen_image_modal = this.be.appendChild(this.createElement("div", "fullscreen_image_modal", "be-fullscreen-image-modal"))
            fullscreen_image_modal.addEventListener("click", () => { if(fullscreen_image_modal !== null) fullscreen_image_modal.style.display = "none"; });

            const fullscreen_close = fullscreen_image_modal.appendChild(this.createElement("div", "", "be-fullscreen-image-modal-close"));
            fullscreen_close.innerHTML = '<i class="fa-solid fa-times"></i>';
        } else {
            fullscreen_image_modal.style.display = "";
        }

        const fullscreen_image = <HTMLImageElement> document.getElementById("fullscreen_image_modal_image") 
            || fullscreen_image_modal.appendChild(this.createElement("img", "fullscreen_image_modal_image", "be-fullscreen-image-modal-image"));
        fullscreen_image.src = url;
    }

    /** Method to import data. You need to call render() after import() */
    import(data: BausteinEditorData) {
        this.data.bausteine = [];

        for (let i = 0; i < data.bausteine.length; i++) {
            const data_baustein = data.bausteine[i];

            // set baustein_id_counter from data
            if (data_baustein.id >= this.baustein_id_counter) {
                this.baustein_id_counter = data_baustein.id +1;
            }
            
            // recreate Baustein from data, but initiate with template
            const template_baustein = this.getBausteinType(data_baustein.type);

            const baustein = new Baustein(
                data_baustein.id, data_baustein.position, data_baustein.type, template_baustein.tag, template_baustein.renderType, data_baustein.toggleableClasses, data_baustein.attributes, data_baustein.style
            );
            baustein.content = data_baustein.content;
            baustein.columns = data_baustein.columns;
            baustein.rows = data_baustein.rows;
            baustein.attributes = data_baustein.attributes;
            if (data_baustein.class !== "") {
                if(baustein.class !== "") baustein.class += " ";
                baustein.class += data_baustein.class;
            }
            baustein.style = data_baustein.style;

            this.data.bausteine.push(baustein);
        }

    }

    /**
        @param baustein : Baustein          // Baustein to render to HTML
        @param tag_override : tag_override  // Tag Overide; used to override the tag of the baustein. Currently only used for the "text" baustein type
    */
    export_createBausteinElement(baustein: Baustein, tag_override: string | null = null) {
        console.log("export_createBausteinElement", baustein, tag_override);
        if (baustein.tag === "") {
            // IS text node
            const text_node = document.createTextNode(baustein.content);

            if (tag_override !== null) {
                const bausteinElement = document.createElement(tag_override);
                bausteinElement.appendChild(text_node);
                return bausteinElement;
            }
            return text_node;
        } else {
            // IS html node
            const is_image = baustein.renderType === bausteinRenderType.image;

            let id, tag;
            if (tag_override === null) {
                id = baustein.type;
                if (is_image) {
                    tag = "div";
                } else {
                    tag = baustein.tag;
                }
            } else {
                id = tag_override;
                tag = tag_override;
            }

            const bausteinElement = document.createElement(tag);

            if (!is_image) {
                for (let i = 0; i < baustein.attributes.length; i++) {
                    const attribute = baustein.attributes[i];
                    bausteinElement.setAttribute(attribute.name, attribute.value);
                }
            }

            bausteinElement.className = "baustein baustein--"+id;
            if(baustein.class !== "") bausteinElement.className += " "+baustein.class;

            // Styles
            for (let s = 0; s < baustein.style.length; s++) {
                const style = baustein.style[s];
                if (style.value !== "" && style.value !== "0" && style.value !== "auto" && style.value !== "initial" && style.value !== "normal" 
                    && (style.property.options.length === 0 || style.value !== style.property.options[0].value)
                ) {
                    // get this.types[].style[] and check if it is not default value
                    let ok = true, test_type_index = -1;
                    const test_type = this.getBausteinType(id);

                    // Test only for default value on renderType "richtext"
                    if (baustein.renderType === bausteinRenderType.richtext) {
                        for (let b = 0; b < test_type.style.length; b++) {
                            const test_style = test_type.style[b];
                            test_type_index = b;
    
                            if (test_style.property.name === style.property.name) {
                                if (test_style.value === style.value) {
                                    ok = false;
                                }
                                break;
                            }
                        }
                    }
    
                    if (ok) {
                        // IF index === -1, then the style is not in the style list of the type. this is intended and means that the style should be used directly
                        if (test_type_index !== -1 && test_type.style[test_type_index].property.useAsClass) {
                            bausteinElement.classList.add(style.value);
                        } else {
                            bausteinElement.style.setProperty(style.property.name, style.value);
                        }
                    }
                }
            }
            
            if (tag_override === null) {
                if (is_image) {
                    const bausteinElement_img: HTMLImageElement = bausteinElement.appendChild( document.createElement("img") );
                    for (let i = 0; i < baustein.attributes.length; i++) {
                        const attribute = baustein.attributes[i];
                        bausteinElement_img.setAttribute(attribute.name, attribute.value);
                    }
                    bausteinElement_img.style.maxWidth = "100%";
                    bausteinElement_img.style.maxHeight = "100%";
                    bausteinElement_img.src = baustein.content;
                } else {
                    bausteinElement.innerHTML = baustein.content;
                }
            }

            // Children
            const child_bausteine = this.getBausteineChildren(baustein.id);
            for (let r = 0; r < child_bausteine.length; r++) {
                const child = child_bausteine[r];
                let child_tag_override = null;
                if(baustein.renderType === bausteinRenderType.tableRow) child_tag_override = "td";

                // just append it OR create a column child and append it
                if (child_tag_override === null) {
                    bausteinElement.appendChild( this.export_createBausteinElement(child) );
                } else {
                    if (child.type === this.types.td.type || child.type === this.types.th.type) {
                        bausteinElement.appendChild( this.export_createBausteinElement(child) );
                    } else {
                        const bausteinElement_col = bausteinElement.appendChild( document.createElement(child_tag_override) );
                        bausteinElement_col.appendChild( this.export_createBausteinElement(child) );
                    }
                }

            }

            return bausteinElement;
        }
    }

    export() {
        const export_html_dom = this.createElement("div", "", "be-article");

        const bausteine = this.getBausteineChildren(null);
        for (let row = 0; row < bausteine.length; row++) {
            const baustein = bausteine[row];
            if (baustein.renderType !== bausteinRenderType.bausteinSelector) {
                export_html_dom.appendChild( 
                    this.export_createBausteinElement(baustein, null)
                );
            }
        }

        return {
            data: this.data,
            html: export_html_dom.outerHTML
        };
    }
}
