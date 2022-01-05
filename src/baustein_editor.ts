/// <reference path="tinyeditor.ts"/>

const BausteinRenderType = {
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

class Baustein {
	public id: any;
	public title: any;
	public icon: any;
	public tag: any;
	public endtag: any;
	public renderType: any;
	public style: any;
	public content: any;
	public class: any;
	public position: any;

    constructor(id: string, title: string, icon: string, tag: string, hasEndtag: boolean, renderType: number, style: any) {
        this.id = id;
        this.title = title;
        this.icon = icon;
        this.tag = tag;
        this.endtag = hasEndtag;
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

class BausteinStyle {
	public property: any;
	public value: any;

    constructor(property: string, value: string) {
        this.property = property;
        this.value = value;
    }
}


class BausteinEditor {
	public dom_id: any;
	public dom: any;
	public styleProperties: any;
	public data: any;
	public types: any;
	public addBausteinSelectorItems: any;
	public be_bausteinSelector_isOpen: any;
	public selected_baustein: HTMLElement | null;
	public selected_baustein_position: Position | null;
	public open_baustein_attributes__position: Position;
	public open_baustein_attributes__formcontrols: HTMLInputElement[] | HTMLSelectElement[];

    createElement(type: string, id: string, _class: string): HTMLElement {
        var element = document.createElement(type);
        if(id !== "") element.id = id;
        if(_class !== "") element.className = _class;
        return element;
    }

    constructor(dom_id: string) {
        this.dom_id = dom_id;
        this.selected_baustein = null;
        this.selected_baustein_position = null;
        this.open_baustein_attributes__position = new Position(-1, -1, -1);
        this.open_baustein_attributes__formcontrols = [];
        
        this.styleProperties = {
            font_family: { name: "font-family", title: "Schriftart", type: "string", suffix: "" },
            font_size: { name: "font-size", title: "Schriftgröße", type: "number", suffix: "rem" },
            font_weight: { name: "font-weight", title: "Textdicke", type: "select", suffix: ""
                , options: [ new Option("Normal", "normal"), new Option("Fett", "bold"), new Option("Fetter", "bolder"), new Option("Leichter", "lighter") ] },
            text_decoration: { name: "text-decoration", title: "Textunterschreichung", type: "select", suffix: ""
                , options: [ new Option("Normal", "normal"), new Option("underline", "underline"), new Option("dotted", "dotted") ] },
            font_style: { name: "font-style", title: "Textkursion", type: "select", suffix: ""
                , options: [ new Option("Normal", "normal"), new Option("italic", "italic"), new Option("oblique", "oblique") ] },
            text_align: { name: "text-align", title: "Textausrichtung", type: "select", suffix: ""
                , options: [ new Option("Normal", "initial"), new Option("left", "left"), new Option("center", "center"), new Option("right", "right") ] },

            color: { name: "color", title: "Farbe", type: "color", suffix: "" },
            background_color: { name: "background-color", title: "Background Color", type: "color", suffix: "" },
            background_image: { name: "background-image", title: "Background Image", type: "string", suffix: "" },

            max_width: { name: "max-width", title: "Maximale Breite", type: "number", suffix: "px" },
            max_height: { name: "max-height", title: "Maximale Höhe", type: "number", suffix: "px" },

            margin_top: { name: "margin-top", title: "Außenabstand Oben", type: "number", suffix: "px" },
            margin_right: { name: "margin-right", title: "Außenabstand Rechts", type: "number", suffix: "px" },
            margin_bottom: { name: "margin-bottom", title: "Außenabstand Unten", type: "number", suffix: "px" },
            margin_left: { name: "margin-left", title: "Außenabstand Links", type: "number", suffix: "px" },

            padding_top: { name: "padding-top", title: "Innenabstand Oben", type: "number", suffix: "px" },
            padding_right: { name: "padding-right", title: "Innenabstand Rechts", type: "number", suffix: "px" },
            padding_bottom: { name: "padding-bottom", title: "Innenabstand Unten", type: "number", suffix: "px" },
            padding_left: { name: "padding-left", title: "Innenabstand Links", type: "number", suffix: "px" },
        };
        this.data = {
            page: {
                style: [
                    { property: this.styleProperties.font_family, value: "Verdana, Arial, Helvetica, sans-serif" },
                    { property: this.styleProperties.font_size, value: "1rem" },
                ]
            },
            bausteine: []
        };


        var layout_styles = [ 
            { property: this.styleProperties.max_width, value:"" }, 
            { property: this.styleProperties.max_height, value:"" }, 
            { property: this.styleProperties.margin_top, value:"" }, 
            { property: this.styleProperties.margin_right, value:"" }, 
            { property: this.styleProperties.margin_bottom, value:"" }, 
            { property: this.styleProperties.margin_left, value:"" }, 
            { property: this.styleProperties.padding_top, value:"" }, 
            { property: this.styleProperties.padding_right, value:"" }, 
            { property: this.styleProperties.padding_bottom, value:"" }, 
            { property: this.styleProperties.padding_left, value:"" }, 
            { property: this.styleProperties.color, value:"" },
            { property: this.styleProperties.background_color, value:"" }, 
            { property: this.styleProperties.background_image, value:"" }, 
        ];

        this.types = {
             h1: new Baustein("h1", "Überschrift 1", 'H1', "h1", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1.375rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                    { property: this.styleProperties.color, value:"" },
                ])
            ,h2: new Baustein("h2", "Überschrift 2", 'H2', "h2", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1.25rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                    { property: this.styleProperties.color, value:"" },
                ])
            ,h3: new Baustein("h3", "Überschrift 3", 'H3', "h3", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1.125rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                    { property: this.styleProperties.color, value:"" },
                ])
            ,h4: new Baustein("h4", "Überschrift 4", 'H4', "h4", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1.1rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                    { property: this.styleProperties.color, value:"" },
                ])
            ,h5: new Baustein("h5", "Überschrift 5", 'H5', "h5", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                    { property: this.styleProperties.color, value:"" },
                ])
            ,h6: new Baustein("h6", "Überschrift 6", 'H6', "h6", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"0.9rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                    { property: this.styleProperties.color, value:"" },
                ])
            ,text: new Baustein("text", "Paragraph (Text)", '<i class="fas fa-paragraph"></i>', "p", true, BausteinRenderType.richtext, [
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
            ,html: new Baustein("html", "HTML", '<i class="fab fa-html5"></i>', "div", true, BausteinRenderType.plaintext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                    { property: this.styleProperties.color, value:"" },
                ])
            ,script: new Baustein("script", "Script", '<i class="fas fa-code"></i>', "script", true, BausteinRenderType.plaintext, [])
            ,shortcode: new Baustein("shortcode", "Shortcode []", '<i class="fas fa-code"></i>', "span", true, BausteinRenderType.plaintext, [])
            ,picture: new Baustein("picture", "Bild", '<i class="fas fa-image"></i>', "img", false, BausteinRenderType.image, [])
            ,layout: new Baustein("layout", "Layout", '<i class="fas fa-layer-group" style="transform: rotate(90deg);"></i>', "div", true, BausteinRenderType.layout, layout_styles)
            ,table: new Baustein("table", "Tabelle", '<i class="fas fa-table"></i>', "table", true, BausteinRenderType.layout, layout_styles)
        };

        this.addBausteinSelectorItems = [
            { type: 1, title: "Überschriften", icon: '<i class="fas fa-heading"></i>', items: [ this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6 ] }
            ,{ type: 0, baustein: this.types.text }
            ,{ type: 0, baustein: this.types.picture }
            ,{ type: 0, baustein: this.types.layout }
            ,{ type: 0, baustein: this.types.table }
            ,{ type: 1, title: "Sonstiges", icon: '<i class="fas fa-cubes"></i>', items: [ this.types.html, this.types.script, this.types.shortcode ] }
        ];


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

        this.dom.sidebar_header = this.dom.sidebar.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_header", "be_sidebar_header")
        );
        this.dom.sidebar_content__site = this.dom.sidebar.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__site", "be_sidebar_content")
        );
        this.dom.sidebar_content__baustein = this.dom.sidebar.appendChild(
            this.createElement("div", this.dom_id+"_sidebar_content__baustein", "be_sidebar_content")
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
        

        // Events
        const self = this;
        
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
            if (showLayoutItems === false && itemset.type === 0 && itemset.baustein.renderType === BausteinRenderType.layout) {
                continue;
            }
            
            var be_bausteinSelector_layer_item: HTMLButtonElement = <HTMLButtonElement> be_bausteinSelector_layer_item_container1.appendChild(
                this.createElement("button", "", "be_bausteinSelector_layer_item")
            );
            be_bausteinSelector_layer_item.type = "button";
            be_bausteinSelector_layer_item.dataset.category = i.toString();
            if (itemset.type === 0) be_bausteinSelector_layer_item.dataset.type = itemset.baustein.id.toString();

            var title1 = be_bausteinSelector_layer_item.appendChild(
                this.createElement("div", "", "be_bausteinSelector_layer_item_title1")
            );

            var title2 = be_bausteinSelector_layer_item.appendChild(
                this.createElement("div", "", "be_bausteinSelector_layer_item_title2")
            );

            if (itemset.type === 0) {
                title1.innerHTML = itemset.baustein.icon;
                title2.innerHTML = itemset.baustein.title;
            } else {
                title1.innerHTML = itemset.icon;
                title2.innerHTML = itemset.title;
            }

            
            const category = i;
            be_bausteinSelector_layer_item.addEventListener("click", function() {
                if(self.addBausteinSelectorItems[category].type === 0) {
                    self.addBaustein(self.addBausteinSelectorItems[category].baustein.id, {row: row_const, depth: depth_const, item: item_const});
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
                            self.addBaustein(types_array[types_array_row].id, {row: row_const, depth: depth_const, item: item_const});
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
    

    addBaustein(type: string, position: Position) {
        console.log("addBaustein( type:", type, ", position:", position, " )");

        if (type !== "") {
            // Objects are reference types, we need to use clone here
            var baustein_entry = new Baustein(
                this.types[type].id, this.types[type].title, this.types[type].icon, this.types[type].tag, this.types[type].hasEndtag, this.types[type].renderType, this.types[type].style
            );

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
                const to = this.data.bausteine.length -1;
                for (var i = 0; i < to; i++) {
                    if (this.data.bausteine[i][0][0].position.row >= position.row) {
                        this.data.bausteine[i][0][0].position.row++;
                    }
                }

            }
            
            this.render();
            this.selectBaustein(position);
            console.log("addBaustein() this.data.bausteine", this.data.bausteine);
            return true;
        } else {
            return false;
        }
    }

    selectBaustein(position: Position) {
        this.dom.content.querySelectorAll(".be_baustein").forEach(function(be_baustein: HTMLElement) { be_baustein.classList.remove("selected"); });
        this.selected_baustein = document.getElementById(this.dom_id+'_be_baustein_item'+position.row+'_'+position.depth+'_'+position.item);
        this.selected_baustein?.classList.add("selected");
        this.selected_baustein_position = position;
        this.open_baustein_attributes(position);
    }

    deleteBaustein(position: Position) {
        console.log("deleteBaustein() position", position)
        var bausteine: any = [];

        for (var row = 0; row < this.data.bausteine.length; row++) {
            const new_row: number = bausteine.length;

            for (var depth = 0; depth < this.data.bausteine[row].length; depth++) {
                for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                    console.log("row", row, "depth", depth, "item", item)

                    if (row !== position.row || depth !== position.depth || item !== position.item) {
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

        //this.data.bausteine[position.row][position.depth][position.item].position.row = position_new.row;
        
        /*
        if (position_new.row > position.row) {
            console.info("BIGGER")
            // jeden Baustein row, der größer als position_new.row ist, row -1
            for (var i = position_new.row; i < this.data.bausteine.length; i++) {
                this.data.bausteine[i][0][0].position.row -= 1;
            }
        } else {
            console.info("SMALLER")
            // jeden Baustein row, der kleiner als position_new.row ist, row +1
            for (var i = position_new.row; i > 0; i--) {
                this.data.bausteine[i][0][0].position.row += 1;
            }
        }
        */
        
        console.info("position_new_const__row", position_new_const__row) 
        this.data.bausteine[position.row][position.depth][position.item].position.row = position_new_const__row;
        console.log("1 moveBaustein() this.data.bausteine[0][0][0].position", this.data.bausteine[0][0][0].position)
        console.log("1 moveBaustein() this.data.bausteine[1][0][0].position", this.data.bausteine[1][0][0].position)
        this.render();
        console.log("2 this.data.bausteine", this.data.bausteine)
        console.log("2 moveBaustein() this.data.bausteine[0][0][0].position", this.data.bausteine[0][0][0].position)
        console.log("2 moveBaustein() this.data.bausteine[1][0][0].position", this.data.bausteine[1][0][0].position)
    }
    
    
    getBausteine() {
        var bausteine: any = this.data.bausteine.sort(function(a: any, b: any) {
            return a[0][0].position.row > b[0][0].position.row;
        });
        
        return bausteine;
    }

    renderBaustein(baustein_entry: Baustein, position: Position): HTMLElement {
        //TODO: bausteinRenderType: image
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
                be_baustein.style[element.property.name] = element.value;
            }
        }

        
        // Baustein indicator
        var baustein_indicator: HTMLLabelElement = <HTMLLabelElement> be_baustein.appendChild(
            this.createElement("label", "", "baustein_indicator")
        );
        baustein_indicator.innerHTML = "<b>" + baustein_entry.icon + "</b> " + baustein_entry.title;
        baustein_indicator.addEventListener("click", function() {
            self.selectBaustein({row: row_const, depth: depth_const, item: item_const, });
        }, false);

        if (baustein_entry.renderType === BausteinRenderType.layout) {
        } else {
            var editor: any;
            switch (baustein_entry.renderType) {
                case BausteinRenderType.richtext:
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
                    editor.dataset.insertorderedlist = "0";
                    editor.dataset.insertunorderedlist = "0";
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
            
            
            if (baustein_entry.renderType === BausteinRenderType.layout) {
                // Baustein Layout start
                var be_baustein: HTMLElement = this.dom.content.appendChild( 
                    this.renderBaustein(baustein_entry, {row: row, depth: depth, item: item})
                );

                /*
                const baustein_id = this.dom_id+'_be_baustein_item'+row+'_'+depth+'_'+item;

                var be_baustein: HTMLElement = this.dom.content.appendChild( 
                    this.createElement("div", baustein_id, "be_baustein")
                );

                if (this.selected_baustein_position !== null 
                    && this.selected_baustein_position.row === row
                    && this.selected_baustein_position.depth === depth
                    && this.selected_baustein_position.item === item
                ) {
                    be_baustein.classList.add("selected")
                }

                be_baustein.dataset.type = baustein_entry.id;
                be_baustein.draggable = true;

                for (var a = 0; a < baustein_entry.style.length; a++) {
                    const element = baustein_entry.style[a];
                    if (element.value !== "") {
                        be_baustein.style[element.property.name] = element.value;
                    }
                }
                
                // Baustein indicator
                var baustein_indicator: HTMLLabelElement = <HTMLLabelElement> be_baustein.appendChild( 
                    this.createElement("label", "", "baustein_indicator")
                );
                baustein_indicator.htmlFor = baustein_id;
                baustein_indicator.innerHTML = "<b>" + baustein_entry.icon + "</b> " + baustein_entry.title;
                */


                //TODO: Baustein Layout: Table
                depth = 1;
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
            const formfield: HTMLFormElement = <HTMLFormElement> document.getElementById(this.dom_id+"_page_content_row_"+this.data.page.style[i].property.name);
            this.data.page.style[i].value = formfield.value;
            style_string += this.data.page.style[i].property.name + ':' + this.data.page.style[i].value + ';';
        }
        style_string += '}';
        this.dom.page_styles.innerHTML = style_string;

        // Apply Baustein Styles
        if (this.selected_baustein !== null && this.selected_baustein_position !== null) {
            var selected_baustein_editor: HTMLElement = <HTMLElement> this.selected_baustein.lastChild;
            
            for (var i = 0; i < this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item].style.length; i++) {
                const baustein = this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item];
                const formcontrol_item: HTMLInputElement = <HTMLInputElement> document.getElementById(this.dom_id+"_baustein_content_row_"+baustein.style[i].property.name);
                baustein.style[i].value = formcontrol_item?.value;
                
                if (baustein.renderType === BausteinRenderType.layout) {
                    this.selected_baustein.style[baustein.style[i].property.name] = baustein.style[i].value;
                } else {
                    selected_baustein_editor.style[baustein.style[i].property.name] = baustein.style[i].value;
                }
            }
        }
    }

    formcontrol(domArk: string, type: string, name: string, title: string, value: string, suffix: string, options: any) {
        const self = this;
        var fc_dom_id = (this.dom_id+'_'+domArk+'_content_row_'+name);

        var be_sidebar_content_row = this.createElement("div", "", "be_sidebar_content_row");

        var label: HTMLLabelElement = <HTMLLabelElement> be_sidebar_content_row.appendChild(
            this.createElement("label", "", "")
        );
        label.htmlFor = fc_dom_id;
        label.innerHTML = title;
        
        var form_control_container = be_sidebar_content_row.appendChild(
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
    
                form_control.addEventListener("change", function() { formcontrol_number(0); self.apply_styles(); });
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
        if (type !== "number") form_control.addEventListener("change", function() { self.apply_styles(); });
        
        if (type === "number") {
        } else {
            form_control.addEventListener("change", function() { self.apply_styles(); });
        }

        return be_sidebar_content_row;
    }

    open_baustein_attributes(position: Position) {
        if (this.open_baustein_attributes__position.row !== position.row
            || this.open_baustein_attributes__position.depth !== position.depth
            || this.open_baustein_attributes__position.item !== position.item
            ) {
            this.open_baustein_attributes__position = position;

            const position_const = { row: position.row, depth: position.depth, item: position.item };
            console.log("open_baustein_attributes position_const", position_const)
            this.dom.sidebar_content__baustein.innerHTML = "";
    
            for (var i = 0; i < this.data.bausteine[position_const.row][position_const.depth][position_const.item].style.length; i++) {
                const element = this.data.bausteine[position_const.row][position_const.depth][position_const.item].style[i];
                this.dom.sidebar_content__baustein.appendChild(
                    this.formcontrol("baustein", element.property.type, element.property.name, element.property.title
                        , element.value, element.property.suffix, element.property.options)
                );
            }
            
            var baustein_class_row = this.dom.sidebar_content__baustein.appendChild(
                this.formcontrol(
                    "baustein_class", "text", "class"
                    , 'CSS Klasse <div style="font-size: 11px; margin-bottom: 2px;">(für Fortgeschrittene Nutzer)</div>'
                    , this.data.bausteine[position_const.row][position_const.depth][position_const.item].class, "", []
                )
            );

            console.log("baustein_class_row", baustein_class_row)
            
            var baustein_delete_button: HTMLButtonElement = <HTMLButtonElement> this.dom.sidebar_content__baustein.appendChild(
                this.createElement("button", this.dom_id+'_deleteBaustein', "form-control bautstein-delete")
            )
            baustein_delete_button.innerHTML = "Baustein löschen";
            baustein_delete_button.type = "button";
    
            const self = this;
    
            const baustein_class_form_control: HTMLFormElement = <HTMLFormElement> baustein_class_row.getElementsByClassName('form-control')[0];
            baustein_class_form_control.addEventListener("change", function() {
                self.data.bausteine[position_const.row][position_const.depth][position_const.item].class = this.value;
            });
    
            baustein_delete_button.addEventListener("click", function() {
                self.close_baustein_attributes();
                console.log(self.data.bausteine);
                self.deleteBaustein(position_const);
                console.log(self.data.bausteine);
            });
    
            this.dom.sidebar_content__site.style.display = "none";
            this.dom.sidebar_header_col__site.classList.remove("active");
            this.dom.sidebar_content__baustein.style.display = "";
            this.dom.sidebar_header_col__baustein.classList.add("active");
            this.dom.sidebar_header_col__baustein.classList.remove("disabled");
        }
    }
    
    close_baustein_attributes() {
        this.dom.sidebar_content__site.style.display = "";
        this.dom.sidebar_header_col__site.classList.add("active");
        this.dom.sidebar_content__baustein.style.display = "none";
        this.dom.sidebar_header_col__baustein.classList.remove("active");
        this.dom.sidebar_header_col__baustein.classList.add("disabled");
    }

}

