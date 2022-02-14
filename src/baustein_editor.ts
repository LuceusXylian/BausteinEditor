/// <reference path="tinyeditor.ts"/>

const bausteinRenderType = {
    layout: 0,
    table: 1,
    plaintext: 2,
    richtext: 3,
    image: 4,
};

class Position {
    public row: number;
    public depth: number;
    public item: number;

    constructor(row: number, depth: number, item: number) {
        this.row = row;
        this.depth = depth;
        this.item = item;
    }
}


class BausteinStyleProperty {
	public name: string;
	public title: string;
	public type: string;
	public suffix: string;
	public options: HTMLOptionElement[];

    constructor(name: string, title: string, type: string, suffix: string, options: HTMLOptionElement[]) {
        this.name = name;
        this.title = title;
        this.type = type;
        this.suffix = suffix;
        this.options = options;
    }
}

class BausteinStyle {
	public property: BausteinStyleProperty;
	public value: any;

    constructor(property: BausteinStyleProperty, value: string) {
        this.property = property;
        this.value = value;
    }
}

class Baustein {
	public id: string;
	public title: string;
	public icon: string;
	public tag: string;
	public renderType: any;
	public style: BausteinStyle[];
	public content: string;
	public class: string;
	public position: Position;

    constructor(id: string, title: string, icon: string, tag: string, renderType: number, style: any) {
        this.id = id;
        this.title = title;
        this.icon = icon;
        this.tag = tag;
        this.renderType = renderType;
        this.style = [];
        // Objects are reference types, we need to use clone here
        for (var i = 0; i < style.length; i++) {
            this.style[i] = new BausteinStyle(style[i].property, style[i].value);
        }
        this.content = "";
        this.class = "";
        this.position = {
            row: -1,
            depth: -1,
            item: -1,
        };
    }
}

class BausteinEditor {
	public dom_id: any;
	public dom: any;
    
	public styleProperties = {
        font_family: { name: "font-family", title: "Schriftart", type: "string", suffix: "", options:  [new Option("Verdana, Arial, Helvetica, sans-serif")] },
        font_size: { name: "font-size", title: "Schriftgröße", type: "number", suffix: "rem", options: [new Option("1rem")] },
        font_weight: { name: "font-weight", title: "Textdicke", type: "select", suffix: ""
            , options: [ new Option("Normal", ""), new Option("Fett", "bold"), new Option("Fetter", "bolder"), new Option("Leichter", "lighter") ] },
        text_decoration: { name: "text-decoration", title: "Textunterschreichung", type: "select", suffix: ""
            , options: [ new Option("Normal", ""), new Option("underline", "underline"), new Option("dotted", "dotted") ] },
        font_style: { name: "font-style", title: "Textkursion", type: "select", suffix: ""
            , options: [ new Option("Normal", ""), new Option("italic", "italic"), new Option("oblique", "oblique") ] },
        text_align: { name: "text-align", title: "Textausrichtung", type: "select", suffix: ""
            , options: [ new Option("Normal", ""), new Option("left", "left"), new Option("center", "center"), new Option("right", "right") ] },

        color: { name: "color", title: "Farbe", type: "color", suffix: "", options: [] },
        background_color: { name: "background-color", title: "Background Color", type: "color", suffix: "", options: [] },
        background_image: { name: "background-image", title: "Background Image", type: "string", suffix: "", options: [] },

        width: { name: "width", title: "Breite", type: "number", suffix: "px", options: [] },
        height: { name: "height", title: "Höhe", type: "number", suffix: "px", options: [] },
        max_width: { name: "max-width", title: "Maximale Breite", type: "number", suffix: "px", options: [] },
        max_height: { name: "max-height", title: "Maximale Höhe", type: "number", suffix: "px", options: [] },

        margin_top: { name: "margin-top", title: "Außenabstand Oben", type: "number", suffix: "px", options: [] },
        margin_right: { name: "margin-right", title: "Außenabstand Rechts", type: "number", suffix: "px", options: [] },
        margin_bottom: { name: "margin-bottom", title: "Außenabstand Unten", type: "number", suffix: "px", options: [] },
        margin_left: { name: "margin-left", title: "Außenabstand Links", type: "number", suffix: "px", options: [] },

        padding_top: { name: "padding-top", title: "Innenabstand Oben", type: "number", suffix: "px", options: [] },
        padding_right: { name: "padding-right", title: "Innenabstand Rechts", type: "number", suffix: "px", options: [] },
        padding_bottom: { name: "padding-bottom", title: "Innenabstand Unten", type: "number", suffix: "px", options: [] },
        padding_left: { name: "padding-left", title: "Innenabstand Links", type: "number", suffix: "px", options: [] },
    };
    private stylePropertiesArray = Object.values(this.styleProperties);
    getStylePropertyByName(name: string): BausteinStyleProperty {
        for (var i = 0; i < this.stylePropertiesArray.length; i++) {
            if (this.stylePropertiesArray[i].name === name) {
                return <BausteinStyleProperty> this.stylePropertiesArray[i];
            }            
        }
        return new BausteinStyleProperty(name, "", "", "", []);
    }

	public data: {page: {style: BausteinStyle[]}, bausteine: Baustein[][][]} = {
        page: {
            style: [
                { property: this.styleProperties.font_family, value: this.styleProperties.font_family.options[0].value },
                { property: this.styleProperties.font_size, value: this.styleProperties.font_size.options[0].value },
            ]
        },
        bausteine: []
    };

	public types = {
        h1: new Baustein("h1", "Überschrift 1", '<b>H1</b>', "h1", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value:"1.375rem" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h2: new Baustein("h2", "Überschrift 2", '<b>H2</b>', "h2", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value:"1.25rem" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h3: new Baustein("h3", "Überschrift 3", '<b>H3</b>', "h3", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value:"1.125rem" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h4: new Baustein("h4", "Überschrift 4", '<b>H4</b>', "h4", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value:"1.1rem" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h5: new Baustein("h5", "Überschrift 5", '<b>H5</b>', "h5", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value:"1rem" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,h6: new Baustein("h6", "Überschrift 6", '<b>H6</b>', "h6", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value:"0.9rem" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"bold" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
            ])
        ,text: new Baustein("text", "Paragraph (Text)", '<i class="fas fa-paragraph"></i>', "p", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.font_weight, value:"" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
                { property: this.styleProperties.background_color, value:"" }, 
                { property: this.styleProperties.background_image, value:"" }, 
            ])
        ,html: new Baustein("html", "HTML", '<i class="fab fa-html5"></i>', "div", bausteinRenderType.plaintext, [
                { property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value:"" },
                { property: this.styleProperties.text_align, value:"" },
                { property: this.styleProperties.text_decoration, value:"" },
                { property: this.styleProperties.font_style, value:"" },
                { property: this.styleProperties.color, value:"" },
            ])
        ,script: new Baustein("script", "Script", '<i class="fas fa-code"></i>', "script", bausteinRenderType.plaintext, [])
        ,shortcode: new Baustein("shortcode", "Shortcode []", '<i class="fas fa-code"></i>', "span", bausteinRenderType.plaintext, [])
        ,image: new Baustein("image", "Bild", '<i class="fas fa-image"></i>', "img", bausteinRenderType.image, [])
        ,layout: new Baustein("layout", "Layout", '<i class="fas fa-layer-group" style="transform: rotate(90deg);"></i>', "div", bausteinRenderType.layout, [ 
            { property: this.styleProperties.max_width, value:"" }, 
            { property: this.styleProperties.max_height, value:"" }, 
            { property: this.styleProperties.color, value:"" },
            { property: this.styleProperties.background_color, value:"" }, 
            { property: this.styleProperties.background_image, value:"" }, 
        ])
        ,table: new Baustein("table", "Tabelle", '<i class="fas fa-table"></i>', "table", bausteinRenderType.table, [ 
            { property: this.styleProperties.max_width, value:"" }, 
            { property: this.styleProperties.max_height, value:"" }, 
            { property: this.styleProperties.color, value:"" },
            { property: this.styleProperties.background_color, value:"" }, 
            { property: this.styleProperties.background_image, value:"" }, 
        ])
    };
    private typesArray = Object.values(this.types);
    getTypeById(id: string): Baustein {
        for (var i = 0; i < this.typesArray.length; i++) {
            if (this.typesArray[i].id === id) {
                return <Baustein> this.typesArray[i];
            }            
        }
        return new Baustein(id, "", "", "", -1, []);
    }

	public addBausteinSelectorItems = [
        { type: 1, title: "Überschriften", icon: '<i class="fas fa-heading"></i>', items: [ this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6 ] }
        ,{ type: 0, title: this.types.text.title, icon: this.types.text.icon, items: [this.types.text] }
        ,{ type: 0, title: this.types.image.title, icon: this.types.image.icon, items: [this.types.image] }
        ,{ type: 0, title: this.types.layout.title, icon: this.types.layout.icon, items: [this.types.layout] }
        ,{ type: 0, title: this.types.table.title, icon: this.types.table.icon, items: [this.types.table] }
        ,{ type: 1, title: "Sonstiges", icon: '<i class="fas fa-cubes"></i>', items: [ this.types.html, this.types.script, this.types.shortcode ] }
    ];

	public be_bausteinSelector_isOpen: any;
	public selected_baustein: HTMLElement | null;
	public selected_baustein_position: Position | null;
	public open_baustein_attributes__position: Position | null;
	public dialog_close_function: Function | null = null;
    public assets = {
        baustein_image_placeholder_url: "/img/baustein-image-placeholder.png"
    };

    createElement(_type: string, _id: string, _class: string): HTMLElement {
        var element = document.createElement(_type);
        if(_id !== "") element.id = _id;
        if(_class !== "") element.className = _class;
        return element;
    }

    constructor(dom_id: string) {
        this.dom_id = dom_id;
        this.selected_baustein = null;
        this.selected_baustein_position = null;
        this.open_baustein_attributes__position = null;


        // DOM
        this.dom = {};
        this.dom.be = document.getElementById(this.dom_id);

        this.dom.page_styles = this.dom.be.appendChild(
            this.createElement("style", this.dom_id+'_page_styles', "")
        );
        this.dom.main = this.dom.be.appendChild(
            this.createElement("div", this.dom_id+"_main", "be_main")
        );
        this.dom.sidebar = this.dom.be.appendChild(
            this.createElement("div", this.dom_id+"_sidebar", "be_sidebar")
        );

        this.dom.underlay = this.dom.main.appendChild(
            this.createElement("div", this.dom_id+"_underlay", "be_underlay")
        );
        this.dom.content = this.dom.main.appendChild(
            this.createElement("div", this.dom_id+"_content", "be_content")
        );
        this.dom.preview = this.dom.main.appendChild(
            this.createElement("div", this.dom_id+"_preview", "be_preview")
        );
        
        this.dom.preview_button_desktop = this.dom.preview.appendChild(
            this.createElement("button", this.dom_id+"_preview_button_desktop", "be_preview_button_desktop")
        );
        this.dom.preview_button_desktop.innerHTML = '<i class="fas fa-desktop"></i> Desktop';
        this.dom.preview_button_desktop.style.display = "none";
        
        this.dom.preview_button_mobile = this.dom.preview.appendChild(
            this.createElement("button", this.dom_id+"_preview_button_mobile", "be_preview_button_mobile")
        );
        this.dom.preview_button_mobile.innerHTML = '<i class="fas fa-mobile-alt"></i> Mobile';
        this.dom.preview_button_mobile.style.display = "none";

        this.dom.preview_button = this.dom.preview.appendChild(
            this.createElement("button", this.dom_id+"_preview_button", "be_preview_button")
        );
        this.dom.preview_button.innerHTML = '<i class="fas fa-eye"></i> Vorschau';
        this.dom.preview_content = this.dom.preview.appendChild(
            this.createElement("div", this.dom_id+"_preview_content", "be_preview_content")
        );
        this.dom.preview_content.style.display = "none";

        this.dom.sidebar_header = this.dom.sidebar.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_header", "be_sidebar_header")
        );
        this.dom.sidebar_content__site = this.dom.sidebar.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__site", "be_sidebar_content")
        );
        this.dom.sidebar_content__baustein = this.dom.sidebar.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__baustein", "be_sidebar_content")
        );
        this.dom.sidebar_content__baustein_styles = this.dom.sidebar_content__baustein.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__baustein_styles", "")
        );
        this.dom.sidebar_content__baustein_misc = this.dom.sidebar_content__baustein.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__baustein_misc", "")
        );
        
        this.dom.sidebar_header_col__site = this.dom.sidebar_header.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_header_col__site", "be_sidebar_header_col active")
        );
        this.dom.sidebar_header_col__site.innerHTML = "Artikel";
        this.dom.sidebar_header_col__baustein = this.dom.sidebar_header.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_header_col__baustein", "be_sidebar_header_col disabled")
        );
        this.dom.sidebar_header_col__baustein.innerHTML = "Baustein";

        for (var i = 0; i < this.data.page.style.length; i++) {
            const element = this.data.page.style[i];
            this.dom.sidebar_content__site.appendChild(
                this.formcontrol("page", element.property.type, element.property.name, element.property.title, 
                    element.value, element.property.suffix, element.property.options)
            );
        }

        this.be_bausteinSelector_isOpen = false;
        this.apply_styles();
        

        // Dialog
        this.dom.dialog = this.dom.be.appendChild(this.createElement("div", this.dom_id+"_dialog", "__dialog"));
        this.dom.dialog.style.display = "none";
        this.dom.dialog_wrapper = this.dom.dialog.appendChild(this.createElement("div", this.dom_id+"_dialog_wrapper", "__dialog-wrapper"));
        this.dom.dialog_content = this.dom.dialog_wrapper.appendChild(this.createElement("div", this.dom_id+"_dialog_content", "__dialog-content"));
        this.dom.dialog_header = this.dom.dialog_content.appendChild(this.createElement("div", this.dom_id+"_dialog_header", "__dialog-header"));
        this.dom.dialog_title = this.dom.dialog_header.appendChild(this.createElement("div", this.dom_id+"_dialog_title", "__dialog-title"));
        this.dom.dialog_close = this.dom.dialog_header.appendChild(this.createElement("div", this.dom_id+"_dialog_close", "__dialog-close"));
        this.dom.dialog_close.innerHTML = '&times;';
        this.dom.dialog_body = this.dom.dialog_content.appendChild(this.createElement("div", this.dom_id+"_dialog_body", "__dialog-body"));
        this.dom.dialog_footer = this.dom.dialog_content.appendChild(this.createElement("div", this.dom_id+"_dialog_footer", "__dialog-footer"));
        
        
        // Events
        const self = this;

        this.dom.preview_button.addEventListener("click", function() {
            if (self.dom.preview_content.style.display === "none") {
                self.dom.preview_content.style.display = "";
                self.preview_render();
                console.log('self.dom.preview_content', self.dom.preview_content);

                self.dom.preview_content.style.height = "400px";
                self.dom.content.style.height = "calc(100% - 50px - "+self.dom.preview_content.style.height+")";
                self.dom.preview_button_mobile.style.display = "";
                self.dom.preview_content.style.width = "";
                self.dom.preview_content.classList.remove("mobile");
            } else {
                self.dom.preview_content.style.display = "none";
                self.dom.content.style.height = "";
                self.dom.preview_button_desktop.style.display = "none";
                self.dom.preview_button_mobile.style.display = "none";
            }
        });

        this.dom.preview_button_desktop.addEventListener("click", function() {
            self.dom.preview_button_desktop.style.display = "none";
            self.dom.preview_button_mobile.style.display = "";
            self.dom.preview_content.style.width = "";
            self.dom.preview_content.classList.remove("mobile");
        });

        this.dom.preview_button_mobile.addEventListener("click", function() {
            self.dom.preview_button_desktop.style.display = "";
            self.dom.preview_button_mobile.style.display = "none";
            self.dom.preview_content.style.width = "320px";
            self.dom.preview_content.classList.add("mobile");
        });
        
        this.dom.sidebar_header_col__site.addEventListener("click", function() {
            self.dom.sidebar_header_col__site.classList.add("active")
            self.dom.sidebar_header_col__baustein.classList.remove("active")
            self.dom.sidebar_content__site.style.display = "";
            self.dom.sidebar_content__baustein.style.display = "none";
        });
        this.dom.sidebar_header_col__baustein.addEventListener("click", function() {
            if (self.dom.sidebar_header_col__baustein.classList.contains("disabled") === false) {
                self.dom.sidebar_header_col__site.classList.remove("active")
                self.dom.sidebar_header_col__baustein.classList.add("active")
                self.dom.sidebar_content__site.style.display = "none";
                self.dom.sidebar_content__baustein.style.display = "";
            }
        });

        this.render();

        /* test construction */
        this.addBaustein(this.types.h1, new Position(0,0,0));
        this.addBaustein(this.types.h2, new Position(1,0,0));
        this.addBaustein(this.types.table, new Position(2,0,0));
        this.addBaustein(this.types.h1, new Position(2,1,0));
        this.addBaustein(this.types.h2, new Position(2,1,1));
        this.addBaustein(this.types.h1, new Position(2,2,0));
        this.addBaustein(this.types.h2, new Position(2,2,1));
    }
    
    addBausteinSelector(position: Position, hide: boolean, showLayoutItems: boolean) {
        const self = this;
        const row_const = position.row;
        const depth_const = position.depth;
        const item_const = position.item;
        const selector_dom_id = this.dom_id + "_" + row_const + "_" + depth_const + "_" + item_const;

        var clz = "be_bausteinSelector_container";
        if (hide) {
            clz += " hidden";
        }

        var be_bausteinSelector_container = this.createElement("div", "", clz);
        var be_bausteinSelector = be_bausteinSelector_container.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector', "be_bausteinSelector")
        );
        be_bausteinSelector.appendChild(
            this.createElement("i", "", "fas fa-plus-circle")
        );
        var be_bausteinSelector_layer = be_bausteinSelector_container.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector_layer', "be_bausteinSelector_layer")
        );
        be_bausteinSelector_layer.style.display = "none";

        var be_bausteinSelector_layer_title_container = be_bausteinSelector_layer.appendChild(
            this.createElement("div", "", "be_bausteinSelector_layer_title_container")
        );
        var be_bausteinSelector_layer_title = be_bausteinSelector_layer_title_container.appendChild(
            this.createElement("div", "", "be_bausteinSelector_layer_title")
        );
        be_bausteinSelector_layer_title.innerHTML = "Neuen Baustein hinzufügen";
        var be_bausteinSelector_layer_close: HTMLButtonElement = <HTMLButtonElement> be_bausteinSelector_layer_title_container.appendChild(
            this.createElement("button", selector_dom_id+'bausteinSelector_layer_close', "be_bausteinSelector_layer_close")
        );
        be_bausteinSelector_layer_close.type = "button"
        be_bausteinSelector_layer_close.innerHTML = "&times;";

        var be_bausteinSelector_layer_item_container1 = be_bausteinSelector_layer.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector_layer_item_container1', "be_bausteinSelector_layer_item_container")
        );

        var be_bausteinSelector_layer_item_container2 = be_bausteinSelector_layer.appendChild(
            this.createElement("div", selector_dom_id+'_bausteinSelector_layer_item_container2', "be_bausteinSelector_layer_item_container")
        );


        for (var i = 0; i < this.addBausteinSelectorItems.length; i++) {
            const itemset = this.addBausteinSelectorItems[i];
            if (showLayoutItems === false && itemset.type === 0 && (itemset.items[0].renderType === bausteinRenderType.layout || itemset.items[0].renderType === bausteinRenderType.table)) {
                continue;
            }
            
            var be_bausteinSelector_layer_item: HTMLButtonElement = <HTMLButtonElement> be_bausteinSelector_layer_item_container1.appendChild(
                this.createElement("button", "", "be_bausteinSelector_layer_item")
            );
            be_bausteinSelector_layer_item.type = "button";
            be_bausteinSelector_layer_item.dataset.category = i.toString();
            if (itemset.type === 0) be_bausteinSelector_layer_item.dataset.type = itemset.items[0].id.toString();

            var title1 = be_bausteinSelector_layer_item.appendChild(
                this.createElement("div", "", "be_bausteinSelector_layer_item_title1")
            );

            var title2 = be_bausteinSelector_layer_item.appendChild(
                this.createElement("div", "", "be_bausteinSelector_layer_item_title2")
            );

            if (itemset.type === 0) {
                title1.innerHTML = itemset.items[0].icon;
                title2.innerHTML = itemset.items[0].title;
            } else {
                title1.innerHTML = itemset.icon;
                title2.innerHTML = itemset.title;
            }

            
            const category = i;
            be_bausteinSelector_layer_item.addEventListener("click", function() {
                if(self.addBausteinSelectorItems[category].type === 0) {
                    self.addBaustein(self.addBausteinSelectorItems[category].items[0], {row: row_const, depth: depth_const, item: item_const});
                    self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                } else {
                    const types_array = self.addBausteinSelectorItems[category].items;
                    be_bausteinSelector_layer_item_container2.innerHTML = "";
                    
                    for (var b = 0; b < types_array.length; b++) {
                        var be_bausteinSelector_layer_item: HTMLButtonElement = <HTMLButtonElement> be_bausteinSelector_layer_item_container2.appendChild(
                            self.createElement("button", "", "be_bausteinSelector_layer_item")
                        );
                        be_bausteinSelector_layer_item.type  = "button";
                        be_bausteinSelector_layer_item.dataset.type  = types_array[b].id;
                        be_bausteinSelector_layer_item.innerHTML = 
                              '<div class="be_bausteinSelector_layer_item_title1">'+types_array[b].icon+'</div>'
                            + '<div class="be_bausteinSelector_layer_item_title2">'+types_array[b].title+'</div>';

                        const types_array_row = b;
                        be_bausteinSelector_layer_item.addEventListener("click", function() {
                            self.addBaustein(types_array[types_array_row], {row: row_const, depth: depth_const, item: item_const});
                            self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                        });
                    }

                    be_bausteinSelector_layer_item_container1.style.display = "none";
                    be_bausteinSelector_layer_item_container2.style.display = "";
                }
            });
        }


        be_bausteinSelector.addEventListener("click", function() { self.bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2); });
        be_bausteinSelector_layer_close.addEventListener("click", function() { self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer); });

        be_bausteinSelector.addEventListener("dragover", function(e: any) {
            e.preventDefault();
        });

        // target
        be_bausteinSelector.addEventListener("drop", function(e: any) {
            e.preventDefault();
            if (e.dataTransfer === null) {
                console.error("be_bausteinSelector.addEventListener('drop'): e.dataTransfer is null");
            } else {
                var old_position: Position = {
                    row: parseInt(e.dataTransfer.getData("row")), 
                    depth: parseInt(e.dataTransfer.getData("depth")), 
                    item: parseInt(e.dataTransfer.getData("item")), 
                };

                var new_position = { row: row_const, depth: depth_const, item: item_const };
                console.log("drop on addBausteinSelector: old position", old_position);
                console.log("drop on addBausteinSelector: new position", new_position);
                if (old_position.row !== new_position.row || old_position.depth !== new_position.depth || old_position.item !== new_position.item) {
                    self.moveBaustein(old_position, new_position);
                }
            }
        });
            
        return be_bausteinSelector_container;
    }
    

    addBaustein(type: Baustein, position: Position) {
        console.log("addBaustein( type:", type, ", position:", position, " )");

        // Objects are reference types, we need to use clone here
        var baustein_entry = new Baustein(
            type.id, type.title, type.icon, type.tag, type.renderType, type.style
        );

        for (let i = 0; i < baustein_entry.style.length; i++) {
            const style = baustein_entry.style[i];
            if (style.value === "" && style.property.options.length > 0) {
                style.value = style.property.options[0].value;
            }
        }

        if (position.depth === 0) {
            const row_max = this.data.bausteine.length;
            baustein_entry.position = position;
            this.data.bausteine[row_max] = [[ baustein_entry ]];

            console.log("addBaustein() this.data.bausteine", this.data.bausteine);
            
            // any baustein with equel or greater then position.row will be changed to +1, but not the newest
            const to = this.data.bausteine.length -1;
            for (var i = 0; i < to; i++) {
                if (this.data.bausteine[i][0][0].position.row >= position.row) {
                    this.data.bausteine[i][0][0].position.row++;
                }
            }
        } else {
            if (this.data.bausteine[position.row].length -1 < position.depth) {
                this.data.bausteine[position.row][position.depth] = [];
            }
            const item_max = this.data.bausteine[position.row][position.depth].length;
            baustein_entry.position = position;
            this.data.bausteine[position.row][position.depth][item_max] = baustein_entry;

            console.log("addBaustein() this.data.bausteine", this.data.bausteine);
            
            
            // any baustein with equel or greater then position.row will be changed to +1, but not the newest
            /*
            const to = this.data.bausteine.length -1;
            for (var r = 0; r < to; r++) {
                if (this.data.bausteine[r][0][0].position.row >= position.row) {
                    this.data.bausteine[r][0][0].position.row++;
                }
                const to2 = this.data.bausteine.length -1;
                for (var d = 0; d < to2; d++) {
                    if (this.data.bausteine[r][d][0].position.depth >= position.depth) {
                        this.data.bausteine[r][d][0].position.depth++;
                    }
                }
            }
            */
        }

        
        this.render();
        this.selectBaustein(position);
        console.log("addBaustein() this.data.bausteine", this.data.bausteine);
    }

    selectBaustein(position: Position) {
        this.dom.content.querySelectorAll(".be_baustein").forEach(function(be_baustein: HTMLElement) { be_baustein.classList.remove("selected"); });
        this.selected_baustein = document.getElementById(this.dom_id+'_be_baustein_item'+position.row+'_'+position.depth+'_'+position.item);
        this.selected_baustein?.classList.add("selected");
        this.selected_baustein_position = position;
        this.open_baustein_attributes(position, this.data.bausteine[position.row][position.depth][position.item].renderType);
    }

    deleteBaustein(position: Position) {
        console.log("deleteBaustein() position", position)
        var bausteine: any = [];

        for (var row = 0; row < this.data.bausteine.length; row++) {
            const new_row: number = bausteine.length;

            for (var depth = 0; depth < this.data.bausteine[row].length; depth++) {
                for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                    
                    if (position.row === row && ((position.depth === depth && position.item === item) || position.depth === 0)) {
                        console.log("deleteBaustein", "row", row, "depth", depth, "item", item)
                    } else {
                        var new_depth: number;
                        if (new_row === 0 || typeof bausteine[new_row] === "undefined") {
                            bausteine[new_row] = [[]];
                            new_depth = 0;
                        } else {
                            new_depth = bausteine[new_row].length;
                        }

                        var new_item: number;
                        if (new_depth === 0 || typeof bausteine[new_row][new_depth] === "undefined") {
                            bausteine[new_row][new_depth] = [];
                            new_item = 0;
                        } else {
                            new_item = bausteine[new_row][new_depth].length;
                        }

                        console.log("this.data.bausteine[row]", this.data.bausteine[row])
                        
                        bausteine[new_row][new_depth][new_item] = this.data.bausteine[row][depth][item];
                    }
                }
            }
        }
        
        this.data.bausteine = bausteine;
        this.selected_baustein_position = null;
        this.open_baustein_attributes__position = null;
        this.render();
        window.focus();
        if (document.activeElement === null) {
            console.error("document.activeElement is null");
        } else {
            const activeElement: any = document.activeElement;
            activeElement.blur();
        }
    }

    //TODO: FIX moveBaustein
    moveBaustein(position: Position, position_new: Position) {
        const position_new_const__row = position_new.row; // need to clone because magic
        console.log("moveBaustein()", "\nposition", position, "\nposition_new", position_new);
        console.log("0 moveBaustein() this.data.bausteine[0][0][0].position", this.data.bausteine[0][0][0].position)
        console.log("0 moveBaustein() this.data.bausteine[1][0][0].position", this.data.bausteine[1][0][0].position)

        if (position.row > position_new.row) {
            // jeden Baustein row, der größer als position_new.row ist, row +1
            for (var r = position_new.row; r < this.data.bausteine.length; r++) {
                for (var d = 0; d < this.data.bausteine[r].length; d++) {
                    for (var i = 0; i < this.data.bausteine[r][d].length; i++) {
                        this.data.bausteine[r][d][i].position.row += 1;
                    }
                }
            }
        }
        
        console.info("position_new_const__row", position_new_const__row) 
        this.data.bausteine[position.row][position.depth][position.item].position.row = position_new_const__row;
        console.log("1 moveBaustein() this.data.bausteine[0][0][0].position", this.data.bausteine[0][0][0].position)
        console.log("1 moveBaustein() this.data.bausteine[1][0][0].position", this.data.bausteine[1][0][0].position)
        this.render();
        console.log("2 this.data.bausteine", this.data.bausteine)
        console.log("2 moveBaustein() this.data.bausteine[0][0][0].position", this.data.bausteine[0][0][0].position)
        console.log("2 moveBaustein() this.data.bausteine[1][0][0].position", this.data.bausteine[1][0][0].position)
    }
    
    /// nachdem es sortiert wurde, überschreibt es die Position, entsprechend dem Index
    getBausteine() {
        // Row
        var bausteine: any = this.data.bausteine.sort(function(a: any, b: any) {
            return a[0][0].position.row > b[0][0].position.row? 1 : 0;
        });

        console.log("getBausteine bausteine", bausteine);
        // Row POST & Depth
        for (var r = 0; r < bausteine.length; r++) {
            // Row POST
            for (var d = 0; d < bausteine[r].length; d++) {
                for (var i = 0; i < bausteine[r][d].length; i++) {
                    bausteine[r][d][i].position.row = r;
                }
            }

            // Depth
            bausteine[r] = bausteine[r].sort(function(a: any, b: any) {
                return a[0].position.depth > b[0].position.depth? 1 : 0;
            });
        }

        // Depth POST & Item
        for (var r = 0; r < bausteine.length; r++) {
            for (var d = 0; d < bausteine[r].length; d++) {
                // Depth POST
                for (var i = 0; i < bausteine[r][d].length; i++) {
                    bausteine[r][d][i].position.depth = d;
                }

                // Item
                console.log("bausteine["+r+"]["+d+"]", bausteine[r][d])
                bausteine[r][d] = bausteine[r][d].sort(function(a: any, b: any) {
                    return a.position.row > b.position.row? 1 : 0;
                });
            }
        }

        // Item POST
        for (var r = 0; r < bausteine.length; r++) {
            for (var d = 0; d < bausteine[r].length; d++) {
                for (var i = 0; i < bausteine[r][d].length; i++) {
                    bausteine[r][d][i].position.item = i;
                }
            }
        }
        
        return bausteine;
    }

    renderBaustein(baustein_entry: Baustein, position: Position): HTMLElement {
        const self = this;
        const row_const = position.row;
        const depth_const = position.depth;
        const item_const = position.item;
        const baustein_id = this.dom_id+'_be_baustein_item'+position.row+'_'+position.depth+'_'+position.item;
        const baustein_editor_id = baustein_id+'_editor';

        var be_baustein = this.createElement("div", baustein_id, "be_baustein");
        be_baustein.dataset.type = baustein_entry.id;
        be_baustein.draggable = true;

        console.log("this.selected_baustein_position", this.selected_baustein_position);
        console.log("position", position);
        
        if (this.selected_baustein_position !== null 
            && this.selected_baustein_position.row === position.row
            && this.selected_baustein_position.depth === position.depth
            && this.selected_baustein_position.item === position.item
        ) {
            be_baustein.classList.add("selected")
        }

        for (var a = 0; a < baustein_entry.style.length; a++) {
            const element = baustein_entry.style[a];
            if (element.value !== "") {
                var property_name: any = element.property.name;
                be_baustein.style[property_name] = element.value;
            }
        }

        
        // Baustein indicator
        var baustein_indicator: HTMLLabelElement = <HTMLLabelElement> be_baustein.appendChild(
            this.createElement("label", "", "baustein_indicator")
        );
        baustein_indicator.innerHTML = baustein_entry.icon + " " + baustein_entry.title;
        baustein_indicator.addEventListener("click", function() {
            self.selectBaustein({row: row_const, depth: depth_const, item: item_const, });
        }, false);

        switch (baustein_entry.renderType) {
            case bausteinRenderType.layout: break;
            case bausteinRenderType.table: break;
                
            case bausteinRenderType.image:
                var image: HTMLImageElement = <HTMLImageElement> be_baustein.appendChild(
                    this.createElement("img", baustein_editor_id, "be_baustein_item")
                );
                // WENN dataset.src empty ist, dann ist nur der Placeholder vorhanden
                image.dataset.src = baustein_entry.content;
                if (baustein_entry.content === "") {
                    image.src = this.assets.baustein_image_placeholder_url;
                } else {
                    image.src = baustein_entry.content;
                }

                image.style.maxWidth = "100%";

                image.addEventListener("click", function() {
                    self.selectBaustein({row: row_const, depth: depth_const, item: item_const, });
                });
                break;

            default:
                var editor: any;
                switch (baustein_entry.renderType) {
                    case bausteinRenderType.richtext:
                        editor = be_baustein.appendChild(
                            this.createElement("div", baustein_editor_id, "be_baustein_item")
                        );
                        editor.innerHTML = baustein_entry.content;
                        editor.style.minHeight = "100px";
        
                        /*
                            formatblock
                            fontname
                            bold
                            italic
                            underline
                            forecolor
                            justifyleft
                            justifycenter
                            justifyright
                            insertorderedlist
                            insertunorderedlist
                            outdent
                            removeFormat
                        */
                        editor.dataset.formatblock = "0";
                        editor.dataset.fontname = "0";
                        editor.dataset.justifyleft = "0";
                        editor.dataset.justifycenter = "0";
                        editor.dataset.justifyright = "0";
                        editor.dataset.insertorderedlist = "1";
                        editor.dataset.insertunorderedlist = "1";
                        editor.dataset.indent = "0";
                        editor.dataset.outdent = "0";
        
                        TinyEditor.transformToEditor(editor);
                        editor.addEventListener("input", function() {
                            editor.style.height = '1px';
                            editor.style.height = editor.scrollHeight + 'px';
                            self.data.bausteine[row_const][depth_const][item_const].content = editor.innerHTML;
                        });
                        break;
                    
                    default:
                        editor = be_baustein.appendChild(
                            this.createElement("textarea", baustein_editor_id, "be_baustein_item")
                        );
                        editor.innerHTML = baustein_entry.content;
                        editor.focus();
                        
                        be_baustein.addEventListener("input", function() {
                            editor.style.height = '1px';
                            editor.style.height = editor.scrollHeight + 'px';
                            self.data.bausteine[row_const][depth_const][item_const].content = editor.value.split("<").join("&lt;").split(">").join("&gt;");
                        });
                        break;
                }
                
                editor.addEventListener("focusin", function() {
                    self.selectBaustein({row: row_const, depth: depth_const, item: item_const, });
                });
                break;
        }

        be_baustein.addEventListener("click", function(e: any) {
            if (e.target.id === baustein_id) {
                self.selectBaustein({row: row_const, depth: depth_const, item: item_const, });
            } else {
                return false;
            }
        }, false);


        // source
        be_baustein.addEventListener("dragstart", function(e: any) {
            if (e.dataTransfer === null) {
                console.error("baustein_item.addEventListener('dragstart'): e.dataTransfer is null");
            } else {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData("row", row_const.toString());
                e.dataTransfer.setData("depth", depth_const.toString());
                e.dataTransfer.setData("item", item_const.toString());
            }
        });

        // target
        /*
        be_baustein.addEventListener("dragover", function(e: any) {
            e.preventDefault();
        });
        
        be_baustein.addEventListener("drop", function(e: any) {
            e.preventDefault();
            if (e.dataTransfer === null) {
                console.error("baustein_item.addEventListener('drop'): e.dataTransfer is null");
            } else {
                var old_position: Position = {
                    row: parseInt(e.dataTransfer.getData("row")), 
                    depth: parseInt(e.dataTransfer.getData("depth")), 
                    item: parseInt(e.dataTransfer.getData("item")), 
                };

                var new_position = self.data.bausteine[row_const][depth_const][item_const].position;
                console.log("old position", old_position);
                console.log("new position", new_position);
                if (old_position.row !== new_position.row) {
                    self.moveBaustein(old_position, new_position);
                }
            }
        });
        */

        return be_baustein;
    }
    
    
    render() {
        this.dom.content.innerHTML = "";
        this.data.bausteine = this.getBausteine();

        /*  Bausteine 3D Graph Array
            this.data.bausteine[row][depth][item]
        */
        for (var row = 0; row < this.data.bausteine.length; row++) {
            var depth = 0, item = 0;
            const baustein_entry = this.data.bausteine[row][depth][item];
            this.dom.content.appendChild( 
                this.addBausteinSelector({row: row, depth: depth, item: item}, true, true)
            );
                
                
            if (baustein_entry.renderType === bausteinRenderType.layout || baustein_entry.renderType === bausteinRenderType.table) {
                // Baustein Layout start
                var be_baustein: HTMLElement = this.dom.content.appendChild( 
                    this.renderBaustein(baustein_entry, {row: row, depth: depth, item: item})
                );
                
                depth = 1;
                console.log("baustein_entry.renderType", baustein_entry.renderType)
                if (baustein_entry.renderType === bausteinRenderType.table) {
                    // Baustein Layout: Table
                    if (this.data.bausteine[row].length > 1) {
                        var be_baustein_table = be_baustein.appendChild(this.createElement("table", "", ""));
                        for (var depth = 1; depth < this.data.bausteine[row].length; depth++) {
                            var be_baustein_row = be_baustein_table.appendChild(this.createElement("tr", "", ""));
                            for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {

                                var be_baustein_td1 = be_baustein_row.appendChild(this.createElement("td", "", ""));
                                be_baustein_td1.appendChild(
                                    this.addBausteinSelector({row: row, depth: depth, item: item}, false, false)
                                );
                                
                                var be_baustein_td2 = be_baustein_row.appendChild(this.createElement("td", "", ""));
                                const baustein_item = this.data.bausteine[row][depth][item];
                                be_baustein_td2.appendChild(
                                    this.renderBaustein(baustein_item, {row: row, depth: depth, item: item})
                                );
                            }

                            var be_baustein_td3 = be_baustein_row.appendChild(this.createElement("td", "", ""));
                            be_baustein_td3.appendChild(
                                this.addBausteinSelector({row: row, depth: depth, item: item}, false, false)
                            );
                        }
                    }

                    be_baustein.appendChild(
                        this.addBausteinSelector({row: row, depth: depth, item: 0}, false, false)
                    );
                } else {
                    // Baustein Layout: Layout
                    if (this.data.bausteine[row].length > 1) {
                        for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                            be_baustein.appendChild(
                                this.addBausteinSelector({row: row, depth: depth, item: item}, false, false)
                            );

                            const baustein_item = this.data.bausteine[row][depth][item];
                            be_baustein.appendChild(
                                this.renderBaustein(baustein_item, {row: row, depth: depth, item: item})
                            );
                        }
                    }
                    be_baustein.appendChild(
                        this.addBausteinSelector({row: row, depth: depth, item: item}, false, false)
                    );
                }
            } else {
                this.dom.content.appendChild(
                    this.renderBaustein(baustein_entry, {row: row, depth: depth, item: item})
                );
            }
        }

        var row: number = this.data.bausteine.length;
        this.dom.content.appendChild(
            this.addBausteinSelector({row: row, depth: 0, item: 0}, false, true)
        );

        this.preview_render();
    }
    
    bausteinSelector_open(be_bausteinSelector: HTMLElement, be_bausteinSelector_layer: HTMLElement, be_bausteinSelector_layer_item_container1: HTMLElement, be_bausteinSelector_layer_item_container2: HTMLElement) { 
        be_bausteinSelector.style.display = "none"; 
        be_bausteinSelector_layer_item_container1.style.display = ""; 
        be_bausteinSelector_layer_item_container2.style.display = "none";
        be_bausteinSelector_layer.style.display = ""; 
        this.be_bausteinSelector_isOpen = true; 
    }
    bausteinSelector_close(be_bausteinSelector: HTMLElement, be_bausteinSelector_layer: HTMLElement) { 
        be_bausteinSelector.style.display = ""; 
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
        // Apply Page Styles
        var style_string = ".be_baustein  {";

        for (var i = 0; i < this.data.page.style.length; i++) {
            const formfield: HTMLFormElement = <HTMLFormElement> document.getElementById(this.dom_id+"_page_fc_"+this.data.page.style[i].property.name);
            this.data.page.style[i].value = formfield.value;
            style_string += this.data.page.style[i].property.name + ':' + this.data.page.style[i].value + ';';
        }
        style_string += '}';
        this.dom.page_styles.innerHTML = style_string;

        // Apply Baustein Styles
        if (this.selected_baustein !== null && this.selected_baustein_position !== null) {
            const baustein = this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item];
            var selected_baustein_editor: HTMLElement = <HTMLElement> this.selected_baustein.lastChild;
            
            var nodes = this.dom.sidebar_content__baustein_styles.querySelectorAll(".be_formrow .form-control");
            for (var i = 0; i < nodes.length; i++) {
                const property_name: string = nodes[i].name;
                const value = typeof nodes[i].dataset.value === "undefined"? nodes[i].value : nodes[i].dataset.value;

                var baustein_style_index: number = baustein.style.length;
                for (var b = 0; b < baustein.style.length; b++) {
                    if (baustein.style[b].property.name === property_name) {
                        baustein_style_index = b;
                        break;
                    }
                }

                if(baustein_style_index === baustein.style.length) {
                    if(value === "" || value === "0" || value === "auto") continue;
                    var new_style = new BausteinStyle(this.getStylePropertyByName(property_name), "");
                    if(new_style.property.options.length > 0 && new_style.property.options[0] === value) continue;
                    baustein.style[baustein_style_index] = new_style;
                }

                baustein.style[baustein_style_index].value = value;
                
                if (baustein.renderType === bausteinRenderType.layout) {
                    this.selected_baustein.style.setProperty(baustein.style[baustein_style_index].property.name, baustein.style[baustein_style_index].value);
                } else {
                    selected_baustein_editor.style.setProperty(baustein.style[baustein_style_index].property.name, baustein.style[baustein_style_index].value);
                }
            }
        }

        this.preview_render();
    }

    /// create a forminput. first options item is default value
    formcontrol(domArk: string, type: string, name: string, title: string | null, value: string, suffix: string, options: any) {
        const self = this;
        var fc_dom_id = (this.dom_id+'_'+domArk+'_fc_'+name);
        var useDataValue = false;

        var be_formrow = this.createElement("div", "", "be_formrow");

        if (title !== null) {
            var label: HTMLLabelElement = <HTMLLabelElement> be_formrow.appendChild(
                this.createElement("label", "", "")
            );
            label.htmlFor = fc_dom_id;
            label.innerHTML = title;
        }
        
        var form_control_container = be_formrow.appendChild(
            this.createElement("div", "", "form-control-container")
        );
        if (type === "number") {
            form_control_container.classList.add("number");
        }

        var form_control: any;
        if (type === "select") {
            form_control = <HTMLSelectElement> form_control_container.appendChild(
                this.createElement("select", fc_dom_id, "form-control")
            );
            form_control.name = name;
            
            for (var i = 0; i < options.length; i++) {
                var option_element: HTMLOptionElement = <HTMLOptionElement> form_control.appendChild(
                    this.createElement("option", "", "")
                );
                option_element.value = options[i].value;
                option_element.innerHTML = options[i].text;
    
                if (options[i].value == value) {
                    option_element.classList.add("selected");
                }
            }
        } else {
            form_control = <HTMLInputElement> form_control_container.appendChild(
                this.createElement("input", fc_dom_id, "form-control")
            );
            form_control.name = name;
            form_control.value = value;

            if (type === "color") {
                form_control.type = "color";
                useDataValue = true;
            } else if (type === "number") {
                form_control.type = "text";
                form_control.dataset.suffix = suffix;

                var form_control_container_up: HTMLInputElement = <HTMLInputElement> form_control_container.appendChild(
                    this.createElement("div", "", "form-control-container_up")
                );
                form_control_container_up.innerHTML = '⮝';

                var form_control_container_down: HTMLInputElement = <HTMLInputElement> form_control_container.appendChild(
                    this.createElement("div", "", "form-control-container_down")
                );
                form_control_container_down.innerHTML = '⮟';

                const suffix_const = suffix;
                
                const formcontrol_number = function (add: number) {
                    var num = parseFloat( form_control.value.replace(suffix_const, "") );
                    if (!num) {
                        num = 0;
                    }
                    
                    var countDecimals = num % 1? num.toString().split(".")[1].length : 0;
                    if (countDecimals === 0) {
                        num = num + add;
                    } else {
                        var mltp = Math.pow(10, countDecimals);
                        num = Math.floor((num*mltp) + (add*mltp))/mltp;
                    }
                    
                    form_control.value = num.toString() + suffix_const;
                }
    
                form_control.addEventListener("change", function() { 
                    formcontrol_number(0);
                    self.apply_styles(); 
                });
                form_control.addEventListener("keydown", function(e: any) { 
                    var steps = e.shiftKey? 10 : (e.ctrlKey? 0.1 : 1)
    
                    const keyCode = e.which | e.keyCode;
                    if (keyCode === 38) {
                        formcontrol_number(steps);
                        self.apply_styles();
                        return false;
                    } else if(keyCode === 40) {
                        formcontrol_number(-steps);
                        self.apply_styles();
                        return false;
                    }
                });
                form_control_container_up.addEventListener("click", function() { formcontrol_number(+1); self.apply_styles(); });
                form_control_container_down.addEventListener("click", function() { formcontrol_number(-1); self.apply_styles(); });
            } else {
                form_control.type = "text";
            }
        }

        // Events
        if (type !== "number") {
            const _useDataValue = useDataValue;
            if (_useDataValue) {
                form_control.dataset.value = value;
            }

            form_control.addEventListener("change", function() { 
                if (_useDataValue) {
                    form_control.dataset.value = form_control.value;
                }
                self.apply_styles();
            });
        }

        return be_formrow;
    }

    /// helper funktion for creating a forminput of layout devtool. Position values: null = do not set, empty = center, non-empty = normal 
    layout_fc(name: string, value: string, top: string | null, right: string | null, bottom: string | null, left: string | null) {
        var be_layout_fc__margin_top: HTMLInputElement = <HTMLInputElement>
            this.formcontrol(
                "baustein", "number", name
                , null
                , value, "px", ["0", "auto"]
            )
        ;
        be_layout_fc__margin_top.style.width = "34px";
        be_layout_fc__margin_top.style.height = "30px";

        if(top !== null) be_layout_fc__margin_top.style.top = top === ""? "calc(50% - ("+be_layout_fc__margin_top.style.height+" / 2))" : top;
        if(bottom !== null) be_layout_fc__margin_top.style.bottom = bottom === ""? "calc(50% - ("+be_layout_fc__margin_top.style.height+" / 2))" : bottom;
        if(left !== null) be_layout_fc__margin_top.style.left = left === ""? "calc(50% - ("+be_layout_fc__margin_top.style.width+" / 2))" : left;
        if(right !== null) be_layout_fc__margin_top.style.right = right === ""? "calc(50% - ("+be_layout_fc__margin_top.style.width+" / 2))" : right;

        return be_layout_fc__margin_top;
    }

    open_baustein_attributes(position: Position, renderType: number) {
        if (this.open_baustein_attributes__position === null 
                || (this.open_baustein_attributes__position.row !== position.row
                    || this.open_baustein_attributes__position.depth !== position.depth
                    || this.open_baustein_attributes__position.item !== position.item
            )) {
            const position_const = { row: position.row, depth: position.depth, item: position.item };
            this.open_baustein_attributes__position = position_const;
            const self = this;
            const current_baustein = this.data.bausteine[position_const.row][position_const.depth][position_const.item];

            console.log("open_baustein_attributes position_const", position_const)
            this.dom.sidebar_content__baustein_styles.innerHTML = "";
            this.dom.sidebar_content__baustein_misc.innerHTML = "";


            // Layout view like Firefox DevTools
            var be_layout_view = this.dom.sidebar_content__baustein_styles.appendChild(
                this.createElement("div", "", "be_layout_view")
            );

            // margin
            var be_layout_view_margin = be_layout_view.appendChild(
                this.createElement("div", "", "be_layout_view_margin")
            );
            var be_layout_view_margin_indicator = be_layout_view_margin.appendChild(
                this.createElement("div", "", "be_layout_view_indicator")
            );
            be_layout_view_margin_indicator.innerHTML = "margin";

            be_layout_view_margin.appendChild(this.layout_fc("margin-top", this.getItemFromArray(current_baustein.style, "margin-top", "0"), "-6px", null, null, ""));
            be_layout_view_margin.appendChild(this.layout_fc("margin-bottom", this.getItemFromArray(current_baustein.style, "margin-bottom", "0"), null, null, "-6px", ""));
            be_layout_view_margin.appendChild(this.layout_fc("margin-left", this.getItemFromArray(current_baustein.style, "margin-left", "0"), "", null, null, "-6px"));
            be_layout_view_margin.appendChild(this.layout_fc("margin-right", this.getItemFromArray(current_baustein.style, "margin-right", "0"), "", "-6px", null, null));

            // border
            var be_layout_view_border = be_layout_view_margin.appendChild(
                this.createElement("div", "", "be_layout_view_border")
            );
            var be_layout_view_border_indicator = be_layout_view_border.appendChild(
                this.createElement("div", "", "be_layout_view_indicator")
            );
            be_layout_view_border_indicator.innerHTML = "border";

            be_layout_view_border.appendChild(this.layout_fc("border-top", this.getItemFromArray(current_baustein.style, "border-top", "0"), "-13px", null, null, ""));
            be_layout_view_border.appendChild(this.layout_fc("border-bottom", this.getItemFromArray(current_baustein.style, "border-bottom", "0"), null, null, "-13px", ""));
            be_layout_view_border.appendChild(this.layout_fc("border-left", this.getItemFromArray(current_baustein.style, "border-left", "0"), "", null, null, "-14px"));
            be_layout_view_border.appendChild(this.layout_fc("border-right", this.getItemFromArray(current_baustein.style, "border-right", "0"), "", "-14px", null, null));

            // padding
            var be_layout_view_padding = be_layout_view_border.appendChild(
                this.createElement("div", "", "be_layout_view_padding")
            );
            var be_layout_view_padding_indicator = be_layout_view_padding.appendChild(
                this.createElement("div", "", "be_layout_view_indicator")
            );
            be_layout_view_padding_indicator.innerHTML = "padding";

            be_layout_view_padding.appendChild(this.layout_fc("padding-top", this.getItemFromArray(current_baustein.style, "padding-top", "0"), "0px", null, null, ""));
            be_layout_view_padding.appendChild(this.layout_fc("padding-bottom", this.getItemFromArray(current_baustein.style, "padding-bottom", "0"), null, null, "0px", ""));
            be_layout_view_padding.appendChild(this.layout_fc("padding-left", this.getItemFromArray(current_baustein.style, "padding-left", "0"), "", null, null, "8px"));
            be_layout_view_padding.appendChild(this.layout_fc("padding-right", this.getItemFromArray(current_baustein.style, "padding-right", "0"), "", "8px", null, null));

            // inner
            var be_layout_view_inner = be_layout_view_padding.appendChild(
                this.createElement("div", "", "be_layout_view_inner")
            );
            be_layout_view_inner.appendChild(this.layout_fc("max-width", this.getItemFromArray(current_baustein.style, "max-width", "auto"), null, null, null, null));
            be_layout_view_inner.appendChild(this.createElement("span", "", "be_layout_wh_delimiter")).innerHTML = " &times; ";
            be_layout_view_inner.appendChild(this.layout_fc("max-height", this.getItemFromArray(current_baustein.style, "max-height", "auto"), null, null, null, null));
            ///////////////////////////////////////////////////////


            if (renderType === bausteinRenderType.image) {
                var baustein_image_row = this.dom.sidebar_content__baustein_styles.appendChild(
                    this.formcontrol(
                        "baustein_image", "text", "image"
                        , 'Bildquelle (URL)'
                        , current_baustein.content, "", []
                    )
                );

                const baustein_image_form_control: HTMLFormElement = <HTMLFormElement> baustein_image_row.getElementsByClassName('form-control')[0];
                baustein_image_form_control.addEventListener("change", function() {
                    self.data.bausteine[position_const.row][position_const.depth][position_const.item].content = this.value;
                    if(self.selected_baustein !== null) {
                        const selected_baustein_item = <HTMLImageElement> self.selected_baustein.querySelector(".be_baustein_item");
                        selected_baustein_item.src  = this.value;
                    }
                });
            }
    
            for (var i = 0; i < current_baustein.style.length; i++) {
                const element = current_baustein.style[i];
                this.dom.sidebar_content__baustein_styles.appendChild(
                    this.formcontrol("baustein", element.property.type, element.property.name, element.property.title
                        , element.value, element.property.suffix, element.property.options)
                );
            }
            
            var baustein_class_row = this.dom.sidebar_content__baustein_misc.appendChild(
                this.formcontrol(
                    "baustein_class", "text", "class"
                    , 'CSS Klasse <div style="font-size: 11px; margin-bottom: 2px;">(für Fortgeschrittene Nutzer)</div>'
                    , current_baustein.class, "", []
                )
            );

            console.log("baustein_class_row", baustein_class_row)
            
            var baustein_delete_button: HTMLButtonElement = <HTMLButtonElement> this.dom.sidebar_content__baustein_misc.appendChild(
                this.createElement("button", this.dom_id+'_deleteBaustein', "form-control bautstein-delete")
            )
            baustein_delete_button.innerHTML = "Baustein löschen";
            baustein_delete_button.type = "button";
    
            const baustein_class_form_control: HTMLFormElement = <HTMLFormElement> baustein_class_row.getElementsByClassName('form-control')[0];
            baustein_class_form_control.addEventListener("change", function() {
                self.data.bausteine[position_const.row][position_const.depth][position_const.item].class = this.value;
            });
    
            baustein_delete_button.addEventListener("click", function() {
                self.dialog("Baustein löschen", "Sind Sie sich sicher, dass Sie diesen Baustein löschen wollen?", null, "Löschen", "Abbrechen", null, function() {
                    self.close_baustein_attributes();
                    console.log(self.data.bausteine);
                    self.deleteBaustein(position_const);
                    console.log(self.data.bausteine);
                    if (self.dialog_close_function === null) {
                        console.error("baustein_delete_button tried to close dialog, but self.dialog_close_function is null");
                    } else {
                        self.dialog_close_function();
                    }
                });
            });
    
            this.dom.sidebar_content__site.style.display = "none";
            this.dom.sidebar_header_col__site.classList.remove("active");
            this.dom.sidebar_content__baustein.style.display = "";
            this.dom.sidebar_header_col__baustein.classList.add("active");
            this.dom.sidebar_header_col__baustein.classList.remove("disabled");
        }
    }

    // returns the value of the pointed array item OR attribute def on fail
    getItemFromArray(array: any, index: any, def: any) {
        if (typeof array[index] === "undefined") {
            return def;
        } else {
            return array[index];
        }
    }

    // returns the index of the pointed array on condition OR null on fail
    getIndexFromItem(array: any, item: any): number | null {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return null;
    }

    // returns the index of the pointed array on condition OR null on fail
    getValueFromItem(array: any, item: any): any {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return null;
    }
    
    close_baustein_attributes() {
        this.dom.sidebar_content__site.style.display = "";
        this.dom.sidebar_header_col__site.classList.add("active");
        this.dom.sidebar_content__baustein.style.display = "none";
        this.dom.sidebar_header_col__baustein.classList.remove("active");
        this.dom.sidebar_header_col__baustein.classList.add("disabled");
    }

    preview_render() {
        if (this.dom.preview_content.style.display === "") {
            this.dom.preview_content.innerHTML = this.export().html;
        }
    }

    dialog(title: string, body_text: string, action_ok_text: string | null, action_fail_text: string | null, action_close_text: string | null, action_ok: Function | null = null, action_fail: Function | null = null, action_close: Function | null = null) {
        const self = this;
        self.dom.dialog_title.innerHTML = title;
        self.dom.dialog_body.innerHTML = body_text;
        if(self.dialog_close_function !== null) self.dom.dialog_close.removeEventListener("click", self.dialog_close_function);
        if (action_close === null) {
            self.dialog_close_function = function() { self.dom.dialog.style.display = "none"; };
        } else {
            self.dialog_close_function = action_close;
        }
        self.dom.dialog_close.addEventListener("click", self.dialog_close_function);

        self.dom.dialog_footer.innerHTML = '';
        if (action_ok_text !== null) {
            var ok_button = self.dom.dialog_footer.appendChild(self.createElement("button", "", "__dialog-btn __dialog-btn-green"))
            ok_button.innerHTML = action_ok_text;
            ok_button.addEventListener("click", action_ok);
        }

        if (action_fail_text !== null) {
            var ok_button = self.dom.dialog_footer.appendChild(self.createElement("button", "", "__dialog-btn __dialog-btn-red"))
            ok_button.innerHTML = action_fail_text;
            ok_button.addEventListener("click", action_fail);
        }

        if (action_close_text !== null) {
            var ok_button = self.dom.dialog_footer.appendChild(self.createElement("button", "", "__dialog-btn __dialog-btn-gray"))
            ok_button.innerHTML = action_close_text;
            ok_button.addEventListener("click", self.dialog_close_function);
        }
        

        self.dom.dialog.style.display = "";
    }


    import(data: any) {
        this.data = data;
        this.render();
    }

    export_createBausteinElement(baustein: Baustein, tag_override: string | null = null) {
        var tag, id;
        if (tag_override === null) {
            tag = baustein.tag;
            id = baustein.id;
        } else {
            tag = tag_override;
            id = tag_override;
        }

        var bausteinElement = document.createElement(tag);
        bausteinElement.className = "baustein baustein--"+id;
        if(baustein.class !== "") bausteinElement.className += " "+baustein.class;
        for (var s = 0; s < baustein.style.length; s++) {
            const style = baustein.style[s];
            if (style.value !== "" && style.value !== "0" && style.value !== "auto" && style.value !== "initial" && style.value !== "normal" 
                && (style.property.options.length === 0 || style.value !== style.property.options[0].value)
            ) {
                // get this.types[].style[] and check if it is not default value
                var ok = true, test_type = this.getTypeById(id);
                if (test_type !== null) {
                    for (var b = 0; b < test_type.style.length; b++) {
                        const test_style = test_type.style[b];
                        if (test_style.property.name === style.property.name) {
                            console.log(test_style.property.name, test_style.value, "|", style.property.name, style.value)
                            if (test_style.value === style.value) {
                                ok = false;
                            }
                            break;
                        }
                    }
                }

                if (ok) {
                    //console.log("setProperty()", style.property.name, style.value, "style.property.options", style.property.options)
                    bausteinElement.style.setProperty(style.property.name, style.value);
                }
            }
        }
        
        if (tag_override === null) {
            console.log('baustein.content', baustein.content)
            if (baustein.renderType === bausteinRenderType.image) {
                const bausteinElement_img: HTMLImageElement = <HTMLImageElement> bausteinElement;
                bausteinElement_img.src = baustein.content;
            } else {
                bausteinElement.innerHTML = baustein.content;
            }
        }
        return bausteinElement;
    }

    export() {
        var export_html_dom = this.createElement("div", "", "be-article");
        for (var s = 0; s < this.data.page.style.length; s++) {
            const style = this.data.page.style[s];
            if (style.value !== "" && style.value !== "0" && style.value !== "auto" && (style.property.options.length === 0 && style.value !== style.property.options[0])) {
                export_html_dom.style.setProperty(style.property.name, style.value);
            }
        }

        for (var r = 0; r < this.data.bausteine.length; r++) {
            const baustein_row = this.data.bausteine[r][0][0];

            if (baustein_row.renderType === bausteinRenderType.table) {
                var dom_baustein_row = export_html_dom.appendChild(this.export_createBausteinElement(baustein_row, "table"));
    
                for (var d = 1; d < this.data.bausteine[r].length; d++) {
                    const baustein_depth = this.data.bausteine[r][d][0];
                    var dom_baustein_depth = dom_baustein_row.appendChild(this.export_createBausteinElement(baustein_depth, "tr"));
                    for (var i = 0; i < this.data.bausteine[r][d].length; i++) {
                        const baustein_item = this.data.bausteine[r][d][i];
                        var dom_baustein_item = dom_baustein_depth.appendChild(this.export_createBausteinElement(baustein_item, "td"));
                        var dom_baustein_item2 = dom_baustein_item.appendChild(this.export_createBausteinElement(baustein_item));
                    }
                }
            } else {
                var dom_baustein_row = export_html_dom.appendChild(this.export_createBausteinElement(baustein_row));
    
                for (var d = 1; d < this.data.bausteine[r].length; d++) {
                    const baustein_depth = this.data.bausteine[r][d][0];
                    if (baustein_row.renderType === bausteinRenderType.layout) {
                        for (var i = 0; i < this.data.bausteine[r][d].length; i++) {
                            const baustein_item = this.data.bausteine[r][d][i];
                            var dom_baustein_item = dom_baustein_row.appendChild(this.export_createBausteinElement(baustein_item));
                            dom_baustein_item.style.display = "inline-block";
                            dom_baustein_item.style.verticalAlign = "top";
                        }
                    } else {
                        var dom_baustein_depth = dom_baustein_row.appendChild(this.export_createBausteinElement(baustein_depth));
                        for (var i = 1; i < this.data.bausteine[r][d].length; i++) {
                            const baustein_item = this.data.bausteine[r][d][i];
                            var dom_baustein_item = dom_baustein_depth.appendChild(this.export_createBausteinElement(baustein_item));
                        }
                    }
                }
            }
        }
        
        return {
            data: this.data,
            html: export_html_dom.outerHTML
        };
    }
}

