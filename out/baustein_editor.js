"use strict";
var bausteinRenderType = {
    layout: 0,
    table: 1,
    tableRow: 2,
    plaintext: 3,
    richtext: 4,
    image: 5,
};
var Position = (function () {
    function Position(parent, sort) {
        this.parent = parent;
        this.sort = sort;
    }
    return Position;
}());
var BausteinStyleProperty = (function () {
    function BausteinStyleProperty(name, title, type, suffix, options, useAsClass) {
        this.name = name;
        this.title = title;
        this.type = type;
        this.suffix = suffix;
        this.options = options;
        this.useAsClass = useAsClass;
    }
    return BausteinStyleProperty;
}());
var BausteinStyle = (function () {
    function BausteinStyle(property, value) {
        this.property = property;
        this.value = value;
    }
    return BausteinStyle;
}());
var Baustein = (function () {
    function Baustein(id, position, type, title, icon, tag, renderType, style) {
        this.id = id;
        this.position = position;
        this.type = type;
        this.title = title;
        this.icon = icon;
        this.tag = tag;
        this.renderType = renderType;
        this.style = [];
        for (var i = 0; i < style.length; i++) {
            this.style[i] = new BausteinStyle(style[i].property, style[i].value);
        }
        this.content = "";
        this.class = "";
    }
    return Baustein;
}());
var BausteinEditor = (function () {
    function BausteinEditor(dom_id) {
        this.baustein_counter = 0;
        this.baustein_id_counter = 0;
        this.styleProperties = {
            font_size: { name: "font-size", title: "Schriftgröße", type: "select", suffix: "", options: [new Option("Normal", ""), new Option("Kleiner (~10px)", "smaller"), new Option("Klein (~11px)", "small"), new Option("Medium (~14px)", "medium"), new Option("Groß (~17px)", "large"), new Option("Größer (~20px)", "larger")], useAsClass: true },
            font_weight: { name: "font-weight", title: "Textdicke", type: "select", suffix: "",
                options: [new Option("Normal", ""), new Option("Fett", "bold"), new Option("Fetter", "bolder"), new Option("Leichter", "lighter")], useAsClass: false },
            text_decoration: { name: "text-decoration", title: "Textunterschreichung", type: "select", suffix: "",
                options: [new Option("Normal", ""), new Option("underline", "underline"), new Option("dotted", "dotted")], useAsClass: false },
            font_style: { name: "font-style", title: "Textkursion", type: "select", suffix: "",
                options: [new Option("Normal", ""), new Option("italic", "italic"), new Option("oblique", "oblique")], useAsClass: false },
            text_align: { name: "text-align", title: "Textausrichtung", type: "select", suffix: "",
                options: [new Option("Normal", ""), new Option("left", "left"), new Option("center", "center"), new Option("right", "right")], useAsClass: false },
            color: { name: "color", title: "Farbe", type: "color", suffix: "", options: [], useAsClass: false },
            background_color: { name: "background-color", title: "Background Color", type: "color", suffix: "", options: [], useAsClass: false },
            background_image: { name: "background-image", title: "Background Image", type: "string", suffix: "", options: [], useAsClass: false },
            width: { name: "width", title: "Breite", type: "number", suffix: "px", options: [], useAsClass: false },
            height: { name: "height", title: "Höhe", type: "number", suffix: "px", options: [], useAsClass: false },
            max_width: { name: "max-width", title: "Maximale Breite", type: "number", suffix: "px", options: [], useAsClass: false },
            max_height: { name: "max-height", title: "Maximale Höhe", type: "number", suffix: "px", options: [], useAsClass: false },
            margin_top: { name: "margin-top", title: "Außenabstand Oben", type: "number", suffix: "px", options: [], useAsClass: false },
            margin_right: { name: "margin-right", title: "Außenabstand Rechts", type: "number", suffix: "px", options: [], useAsClass: false },
            margin_bottom: { name: "margin-bottom", title: "Außenabstand Unten", type: "number", suffix: "px", options: [], useAsClass: false },
            margin_left: { name: "margin-left", title: "Außenabstand Links", type: "number", suffix: "px", options: [], useAsClass: false },
            padding_top: { name: "padding-top", title: "Innenabstand Oben", type: "number", suffix: "px", options: [], useAsClass: false },
            padding_right: { name: "padding-right", title: "Innenabstand Rechts", type: "number", suffix: "px", options: [], useAsClass: false },
            padding_bottom: { name: "padding-bottom", title: "Innenabstand Unten", type: "number", suffix: "px", options: [], useAsClass: false },
            padding_left: { name: "padding-left", title: "Innenabstand Links", type: "number", suffix: "px", options: [], useAsClass: false },
        };
        this.stylePropertiesArray = Object.values(this.styleProperties);
        this.data = {
            page: {
                style: [],
            },
            bausteine: []
        };
        this.types = {
            h1: new Baustein(-1, new Position(null, -1), "h1", "Überschrift 1", '<b>H1</b>', "h1", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h2: new Baustein(-1, new Position(null, -1), "h2", "Überschrift 2", '<b>H2</b>', "h2", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h3: new Baustein(-1, new Position(null, -1), "h3", "Überschrift 3", '<b>H3</b>', "h3", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h4: new Baustein(-1, new Position(null, -1), "h4", "Überschrift 4", '<b>H4</b>', "h4", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h5: new Baustein(-1, new Position(null, -1), "h5", "Überschrift 5", '<b>H5</b>', "h5", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h6: new Baustein(-1, new Position(null, -1), "h6", "Überschrift 6", '<b>H6</b>', "h6", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            text: new Baustein(-1, new Position(null, -1), "text", "Paragraph (Text)", '<i class="fas fa-paragraph"></i>', "p", bausteinRenderType.richtext, [
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            html: new Baustein(-1, new Position(null, -1), "html", "HTML", '<i class="fab fa-html5"></i>', "div", bausteinRenderType.plaintext, [
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            script: new Baustein(-1, new Position(null, -1), "script", "Script", '<i class="fas fa-code"></i>', "script", bausteinRenderType.plaintext, []),
            shortcode: new Baustein(-1, new Position(null, -1), "shortcode", "Shortcode []", '<i class="fas fa-code"></i>', "span", bausteinRenderType.plaintext, []),
            image: new Baustein(-1, new Position(null, -1), "image", "Bild", '<i class="fas fa-image"></i>', "img", bausteinRenderType.image, []),
            layout: new Baustein(-1, new Position(null, -1), "layout", "Layout", '<i class="fas fa-layer-group" style="transform: rotate(90deg);"></i>', "div", bausteinRenderType.layout, [
                { property: this.styleProperties.max_width, value: "" },
                { property: this.styleProperties.max_height, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            table: new Baustein(-1, new Position(null, -1), "table", "Tabelle", '<i class="fas fa-table"></i>', "table", bausteinRenderType.table, [
                { property: this.styleProperties.max_width, value: "" },
                { property: this.styleProperties.max_height, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            tableRow: new Baustein(-1, new Position(null, -1), "tableRow", "Tabellenzeile", '<i class="fas fa-table"></i>', "tr", bausteinRenderType.tableRow, [])
        };
        this.typesArray = Object.values(this.types);
        this.addBausteinSelectorItems = [
            { type: 1, title: "Überschriften", icon: '<i class="fas fa-heading"></i>', items: [this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6] },
            { type: 0, title: this.types.text.title, icon: this.types.text.icon, items: [this.types.text] },
            { type: 0, title: this.types.image.title, icon: this.types.image.icon, items: [this.types.image] },
            { type: 0, title: this.types.layout.title, icon: this.types.layout.icon, items: [this.types.layout] },
            { type: 0, title: this.types.table.title, icon: this.types.table.icon, items: [this.types.table] },
            { type: 1, title: "Sonstiges", icon: '<i class="fas fa-cubes"></i>', items: [this.types.html, this.types.script, this.types.shortcode] }
        ];
        this.dialog_close_function = null;
        this.assets = {
            baustein_image_placeholder: "/img/baustein-image-placeholder.png"
        };
        this.api_endpoints = {
            image_search: "",
            image_register: "",
        };
        this.dom_id = dom_id;
        this.selected_baustein = null;
        this.selected_baustein_id = null;
        this.open_baustein_attributes__baustein_id = null;
        this.dom = {};
        this.dom.be = document.getElementById(this.dom_id);
        this.dom.page_styles = this.dom.be.appendChild(this.createElement("style", this.dom_id + '_page_styles', ""));
        this.dom.main = this.dom.be.appendChild(this.createElement("div", this.dom_id + "_main", "be_main"));
        this.dom.sidebar = this.dom.be.appendChild(this.createElement("div", this.dom_id + "_sidebar", "be_sidebar"));
        this.dom.underlay = this.dom.main.appendChild(this.createElement("div", this.dom_id + "_underlay", "be_underlay"));
        this.dom.content = this.dom.main.appendChild(this.createElement("div", this.dom_id + "_content", "be_content"));
        this.dom.preview = this.dom.main.appendChild(this.createElement("div", this.dom_id + "_preview", "be_preview"));
        this.dom.preview_button_desktop = this.dom.preview.appendChild(this.createElement("button", this.dom_id + "_preview_button_desktop", "be_preview_button_desktop"));
        this.dom.preview_button_desktop.innerHTML = '<i class="fas fa-desktop"></i> Desktop';
        this.dom.preview_button_desktop.style.display = "none";
        this.dom.preview_button_desktop.type = "button";
        this.dom.preview_button_mobile = this.dom.preview.appendChild(this.createElement("button", this.dom_id + "_preview_button_mobile", "be_preview_button_mobile"));
        this.dom.preview_button_mobile.innerHTML = '<i class="fas fa-mobile-alt"></i> Mobile';
        this.dom.preview_button_mobile.style.display = "none";
        this.dom.preview_button_desktop.type = "button";
        this.dom.preview_button = this.dom.preview.appendChild(this.createElement("button", this.dom_id + "_preview_button", "be_preview_button"));
        this.dom.preview_button.innerHTML = '<i class="fas fa-eye"></i> Vorschau';
        this.dom.preview_content = this.dom.preview.appendChild(this.createElement("div", this.dom_id + "_preview_content", "be_preview_content"));
        this.dom.preview_content.style.display = "none";
        this.dom.preview_button_desktop.type = "button";
        this.dom.sidebar_header = this.dom.sidebar.appendChild(this.createElement("div", this.dom_id + "_sidebar_header", "be_sidebar_header"));
        this.dom.sidebar_content__site = this.dom.sidebar.appendChild(this.createElement("div", this.dom_id + "_sidebar_content__site", "be_sidebar_content"));
        this.dom.sidebar_content__baustein = this.dom.sidebar.appendChild(this.createElement("div", this.dom_id + "_sidebar_content__baustein", "be_sidebar_content"));
        this.dom.sidebar_content__baustein_styles = this.dom.sidebar_content__baustein.appendChild(this.createElement("div", this.dom_id + "_sidebar_content__baustein_styles", ""));
        this.dom.sidebar_content__baustein_misc = this.dom.sidebar_content__baustein.appendChild(this.createElement("div", this.dom_id + "_sidebar_content__baustein_misc", ""));
        this.dom.sidebar_header_col__site = this.dom.sidebar_header.appendChild(this.createElement("div", this.dom_id + "_sidebar_header_col__site", "be_sidebar_header_col active"));
        this.dom.sidebar_header_col__site.innerHTML = "Artikel";
        this.dom.sidebar_header_col__baustein = this.dom.sidebar_header.appendChild(this.createElement("div", this.dom_id + "_sidebar_header_col__baustein", "be_sidebar_header_col disabled"));
        this.dom.sidebar_header_col__baustein.innerHTML = "Baustein";
        for (var i = 0; i < this.data.page.style.length; i++) {
            var element = this.data.page.style[i];
            this.dom.sidebar_content__site.appendChild(this.formcontrol("page", element.property.type, element.property.name, element.property.title, element.value, element.property.suffix, element.property.options));
        }
        this.be_bausteinSelector_isOpen = false;
        this.apply_styles();
        this.dom.dialog = this.dom.be.appendChild(this.createElement("div", this.dom_id + "_dialog", "__dialog"));
        this.dom.dialog.style.display = "none";
        this.dom.dialog_wrapper = this.dom.dialog.appendChild(this.createElement("div", this.dom_id + "_dialog_wrapper", "__dialog-wrapper"));
        this.dom.dialog_content = this.dom.dialog_wrapper.appendChild(this.createElement("div", this.dom_id + "_dialog_content", "__dialog-content"));
        this.dom.dialog_header = this.dom.dialog_content.appendChild(this.createElement("div", this.dom_id + "_dialog_header", "__dialog-header"));
        this.dom.dialog_title = this.dom.dialog_header.appendChild(this.createElement("div", this.dom_id + "_dialog_title", "__dialog-title"));
        this.dom.dialog_close = this.dom.dialog_header.appendChild(this.createElement("div", this.dom_id + "_dialog_close", "__dialog-close"));
        this.dom.dialog_close.innerHTML = '&times;';
        this.dom.dialog_body = this.dom.dialog_content.appendChild(this.createElement("div", this.dom_id + "_dialog_body", "__dialog-body"));
        this.dom.dialog_footer = this.dom.dialog_content.appendChild(this.createElement("div", this.dom_id + "_dialog_footer", "__dialog-footer"));
        var self = this;
        this.dom.preview_button.addEventListener("click", function () {
            if (self.dom.preview_content.style.display === "none") {
                self.dom.preview_content.style.display = "";
                self.preview_render();
                self.dom.preview_content.style.height = "400px";
                self.dom.content.style.height = "calc(100% - 50px - " + self.dom.preview_content.style.height + ")";
                self.dom.preview_button_mobile.style.display = "";
                self.dom.preview_content.style.width = "";
                self.dom.preview_content.classList.remove("mobile");
            }
            else {
                self.dom.preview_content.style.display = "none";
                self.dom.content.style.height = "";
                self.dom.preview_button_desktop.style.display = "none";
                self.dom.preview_button_mobile.style.display = "none";
            }
        });
        this.dom.preview_button_desktop.addEventListener("click", function () {
            self.dom.preview_button_desktop.style.display = "none";
            self.dom.preview_button_mobile.style.display = "";
            self.dom.preview_content.style.width = "";
            self.dom.preview_content.classList.remove("mobile");
        });
        this.dom.preview_button_mobile.addEventListener("click", function () {
            self.dom.preview_button_desktop.style.display = "";
            self.dom.preview_button_mobile.style.display = "none";
            self.dom.preview_content.style.width = "320px";
            self.dom.preview_content.classList.add("mobile");
        });
        this.dom.sidebar_header_col__site.addEventListener("click", function () {
            self.dom.sidebar_header_col__site.classList.add("active");
            self.dom.sidebar_header_col__baustein.classList.remove("active");
            self.dom.sidebar_content__site.style.display = "";
            self.dom.sidebar_content__baustein.style.display = "none";
        });
        this.dom.sidebar_header_col__baustein.addEventListener("click", function () {
            if (self.dom.sidebar_header_col__baustein.classList.contains("disabled") === false) {
                self.dom.sidebar_header_col__site.classList.remove("active");
                self.dom.sidebar_header_col__baustein.classList.add("active");
                self.dom.sidebar_content__site.style.display = "none";
                self.dom.sidebar_content__baustein.style.display = "";
            }
        });
        this.render();
    }
    BausteinEditor.prototype.getStylePropertyByName = function (name) {
        for (var i = 0; i < this.stylePropertiesArray.length; i++) {
            if (this.stylePropertiesArray[i].name === name) {
                return this.stylePropertiesArray[i];
            }
        }
        return new BausteinStyleProperty(name, "", "", "", [], false);
    };
    BausteinEditor.prototype.getBausteinType = function (type) {
        for (var i = 0; i < this.typesArray.length; i++) {
            if (this.typesArray[i].type === type) {
                return this.typesArray[i];
            }
        }
        return new Baustein(-1, new Position(null, -1), type, "", "", "", -1, []);
    };
    BausteinEditor.prototype.createElement = function (_type, _id, _class) {
        var element = document.createElement(_type);
        if (_id !== "")
            element.id = _id;
        if (_class !== "")
            element.className = _class;
        return element;
    };
    BausteinEditor.prototype.addBausteinSelector = function (position, hide, showLayoutItems) {
        var self = this;
        var selector_dom_id = this.dom_id + "_" + position.parent + "_" + position.sort;
        var position_parent = position.parent;
        var position_sort = position.sort;
        var clz = "be_bausteinSelector_container";
        if (hide) {
            clz += " hidden";
        }
        var be_bausteinSelector_container = this.createElement("div", "", clz);
        be_bausteinSelector_container.dataset.position_parent = position_parent + "";
        be_bausteinSelector_container.dataset.position_sort = position_sort + "";
        var be_bausteinSelector = be_bausteinSelector_container.appendChild(this.createElement("div", selector_dom_id + '_bausteinSelector', "be_bausteinSelector"));
        be_bausteinSelector.appendChild(this.createElement("i", "", "fas fa-plus-circle"));
        var be_bausteinSelector_layer = be_bausteinSelector_container.appendChild(this.createElement("div", selector_dom_id + '_bausteinSelector_layer', "be_bausteinSelector_layer"));
        be_bausteinSelector_layer.style.display = "none";
        var be_bausteinSelector_layer_title_container = be_bausteinSelector_layer.appendChild(this.createElement("div", "", "be_bausteinSelector_layer_title_container"));
        var be_bausteinSelector_layer_title = be_bausteinSelector_layer_title_container.appendChild(this.createElement("div", "", "be_bausteinSelector_layer_title"));
        be_bausteinSelector_layer_title.innerHTML = "Neuen Baustein hinzufügen";
        var be_bausteinSelector_layer_close = be_bausteinSelector_layer_title_container.appendChild(this.createElement("button", selector_dom_id + 'bausteinSelector_layer_close', "be_bausteinSelector_layer_close"));
        be_bausteinSelector_layer_close.type = "button";
        be_bausteinSelector_layer_close.innerHTML = "&times;";
        var be_bausteinSelector_layer_item_container1 = be_bausteinSelector_layer.appendChild(this.createElement("div", selector_dom_id + '_bausteinSelector_layer_item_container1', "be_bausteinSelector_layer_item_container"));
        var be_bausteinSelector_layer_item_container2 = be_bausteinSelector_layer.appendChild(this.createElement("div", selector_dom_id + '_bausteinSelector_layer_item_container2', "be_bausteinSelector_layer_item_container"));
        var _loop_1 = function () {
            var itemset = this_1.addBausteinSelectorItems[i];
            if (showLayoutItems === false && itemset.type === 0 && (itemset.items[0].renderType === bausteinRenderType.layout || itemset.items[0].renderType === bausteinRenderType.table)) {
                return "continue";
            }
            be_bausteinSelector_layer_item = be_bausteinSelector_layer_item_container1.appendChild(this_1.createElement("button", "", "be_bausteinSelector_layer_item"));
            be_bausteinSelector_layer_item.type = "button";
            be_bausteinSelector_layer_item.dataset.category = i.toString();
            if (itemset.type === 0)
                be_bausteinSelector_layer_item.dataset.type = itemset.items[0].type.toString();
            title1 = be_bausteinSelector_layer_item.appendChild(this_1.createElement("div", "", "be_bausteinSelector_layer_item_title1"));
            title2 = be_bausteinSelector_layer_item.appendChild(this_1.createElement("div", "", "be_bausteinSelector_layer_item_title2"));
            if (itemset.type === 0) {
                if (itemset.items[0].icon !== undefined)
                    title1.innerHTML = itemset.items[0].icon;
                title2.innerHTML = itemset.items[0].title;
            }
            else {
                if (itemset.icon !== undefined)
                    title1.innerHTML = itemset.icon;
                title2.innerHTML = itemset.title;
            }
            var category = i;
            be_bausteinSelector_layer_item.addEventListener("click", function () {
                if (self.addBausteinSelectorItems[category].type === 0) {
                    self.addBaustein(self.addBausteinSelectorItems[category].items[0], new Position(position.parent, position.sort));
                    self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                }
                else {
                    var types_array_1 = self.addBausteinSelectorItems[category].items;
                    be_bausteinSelector_layer_item_container2.innerHTML = "";
                    var _loop_2 = function () {
                        be_bausteinSelector_layer_item = be_bausteinSelector_layer_item_container2.appendChild(self.createElement("button", "", "be_bausteinSelector_layer_item"));
                        be_bausteinSelector_layer_item.type = "button";
                        be_bausteinSelector_layer_item.dataset.type = types_array_1[b].type;
                        be_bausteinSelector_layer_item.innerHTML =
                            '<div class="be_bausteinSelector_layer_item_title1">' + types_array_1[b].icon + '</div>'
                                + '<div class="be_bausteinSelector_layer_item_title2">' + types_array_1[b].title + '</div>';
                        var types_array_row = b;
                        be_bausteinSelector_layer_item.addEventListener("click", function () {
                            self.addBaustein(types_array_1[types_array_row], new Position(position.parent, position.sort));
                            self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                        });
                    };
                    var be_bausteinSelector_layer_item;
                    for (var b = 0; b < types_array_1.length; b++) {
                        _loop_2();
                    }
                    be_bausteinSelector_layer_item_container1.style.display = "none";
                    be_bausteinSelector_layer_item_container2.style.display = "";
                }
            });
        };
        var this_1 = this, be_bausteinSelector_layer_item, title1, title2;
        for (var i = 0; i < this.addBausteinSelectorItems.length; i++) {
            _loop_1();
        }
        be_bausteinSelector.addEventListener("click", function () { self.bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2); });
        be_bausteinSelector_layer_close.addEventListener("click", function () { self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer); });
        be_bausteinSelector.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        be_bausteinSelector.addEventListener("drop", function (e) {
            e.preventDefault();
            if (e.dataTransfer === null) {
                console.error("be_bausteinSelector.addEventListener('drop'): e.dataTransfer is null");
            }
            else {
                var old_baustein_id = parseInt(e.dataTransfer.getData("baustein_id"));
                var new_position = { parent: position_parent, sort: position_sort };
                console.log("drop on addBausteinSelector: old_baustein_id", old_baustein_id);
                console.log("drop on addBausteinSelector: new position", new_position);
                self.moveBaustein(old_baustein_id, new_position);
            }
        });
        return be_bausteinSelector_container;
    };
    BausteinEditor.prototype.addBaustein = function (baustein_type, position) {
        console.log("addBaustein( type:", baustein_type.type, ", position:", position, " )");
        var baustein_id = this.baustein_id_counter;
        var baustein = new Baustein(baustein_id, position, baustein_type.type, baustein_type.title, baustein_type.icon, baustein_type.tag, baustein_type.renderType, baustein_type.style);
        this.baustein_id_counter += 1;
        for (var i = 0; i < baustein.style.length; i++) {
            var style = baustein.style[i];
            if (style.value === "" && style.property.options.length > 0) {
                style.value = style.property.options[0].value;
            }
        }
        for (var r = 0; r < this.data.bausteine.length; r++) {
            if (this.data.bausteine[r].position.sort >= position.sort) {
                this.data.bausteine[r].position.sort++;
            }
        }
        this.data.bausteine[this.data.bausteine.length] = baustein;
        this.render();
        this.selectBaustein(baustein_id);
        if (baustein.renderType === bausteinRenderType.table) {
            this.addBaustein(this.types.tableRow, new Position(baustein_id, this.getPositionSort(false)));
        }
        console.log("addBaustein() this.data.bausteine", this.data.bausteine);
    };
    BausteinEditor.prototype.selectBaustein = function (baustein_id) {
        var _a;
        this.dom.content.querySelectorAll(".be_baustein").forEach(function (be_baustein) { be_baustein.classList.remove("selected"); });
        this.selected_baustein = document.getElementById(this.dom_id + '_be_baustein_item' + baustein_id);
        (_a = this.selected_baustein) === null || _a === void 0 ? void 0 : _a.classList.add("selected");
        this.selected_baustein_id = baustein_id;
        this.open_baustein_attributes(baustein_id);
    };
    BausteinEditor.prototype.getBaustein = function (baustein_id) {
        for (var i = 0; i < this.data.bausteine.length; i++) {
            if (this.data.bausteine[i].id === baustein_id) {
                return this.data.bausteine[i];
            }
        }
        throw new Error("getBaustein() can not get Baustein with id: " + baustein_id);
    };
    BausteinEditor.prototype.getPositionSort = function (getFirst) {
        var positionSort = 1;
        if (getFirst) {
            for (var i = 0; i < this.data.bausteine.length; i++) {
                if (this.data.bausteine[i].position.sort < positionSort) {
                    positionSort = this.data.bausteine[i].position.sort;
                }
            }
            return positionSort - 1;
        }
        else {
            for (var i = 0; i < this.data.bausteine.length; i++) {
                if (this.data.bausteine[i].position.sort > positionSort) {
                    positionSort = this.data.bausteine[i].position.sort;
                }
            }
            return positionSort + 1;
        }
    };
    BausteinEditor.prototype.getBausteineArray = function (parent) {
        var bausteine = [];
        for (var i = 0; i < this.data.bausteine.length; i++) {
            if (this.data.bausteine[i].position.parent === parent) {
                bausteine[bausteine.length] = this.data.bausteine[i];
            }
        }
        return bausteine.sort(function (a, b) {
            return a.position.sort > b.position.sort ? 1 : 0;
        });
    };
    BausteinEditor.prototype.deleteBaustein = function (baustein_id) {
        console.log("deleteBaustein() baustein_id", baustein_id);
        var bausteine = [];
        for (var row = 0; row < this.data.bausteine.length; row++) {
            if (this.data.bausteine[row].id !== baustein_id) {
                bausteine[bausteine.length] = this.data.bausteine[row];
            }
        }
        console.log("this.data.bausteine", this.data.bausteine);
        this.data.bausteine = bausteine;
        this.selected_baustein_id = null;
        this.open_baustein_attributes__baustein_id = null;
        this.render();
        window.focus();
        if (document.activeElement === null) {
            console.error("document.activeElement is null");
        }
        else {
            var activeElement = document.activeElement;
            activeElement.blur();
        }
    };
    BausteinEditor.prototype.moveBaustein = function (baustein_id, position_new) {
        var baustein = this.getBaustein(baustein_id);
        baustein.position.parent = position_new.parent;
        baustein.position.sort = position_new.sort;
        for (var r = 0; r < this.data.bausteine.length; r++) {
            if (this.data.bausteine[r].id !== baustein_id && this.data.bausteine[r].position.sort >= baustein.position.sort) {
                this.data.bausteine[r].position.sort++;
            }
        }
        this.render();
    };
    BausteinEditor.prototype.changeBaustein = function (baustein_id, type) {
        var baustein = this.getBaustein(baustein_id);
        var new_baustein = this.getBausteinType(type);
        baustein.icon = new_baustein.icon;
        baustein.renderType = new_baustein.renderType;
        baustein.tag = new_baustein.tag;
        baustein.title = new_baustein.title;
        baustein.type = new_baustein.type;
        this.render();
    };
    BausteinEditor.prototype.getChangeBausteinOptions = function (current_renderType, current_type) {
        var options = [];
        for (var i = 0; i < this.typesArray.length; i++) {
            var element = this.typesArray[i];
            if (element.renderType === current_renderType && element.type !== current_type) {
                var b = options.length;
                options[b] = this.createElement("option", "", "");
                options[b].value = element.type;
                options[b].innerHTML = element.icon + " " + element.title;
            }
        }
        return options;
    };
    BausteinEditor.prototype.renderBaustein = function (baustein, position) {
        var self = this;
        var baustein_id = baustein.id;
        var position_parent = position.parent;
        var position_sort = position.sort;
        var baustein_dom_id = this.dom_id + '_be_baustein_item' + baustein_id;
        var baustein_editor_id = baustein_dom_id + '_editor';
        var baustein_dom = this.createElement("div", baustein_dom_id, "be_baustein");
        baustein_dom.dataset.type = baustein.type;
        baustein_dom.dataset.position_parent = position_parent + "";
        baustein_dom.dataset.position_sort = position_sort + "";
        var dragstart_elements = [baustein_dom];
        if (this.selected_baustein_id !== null && this.selected_baustein_id === baustein_id) {
            baustein_dom.classList.add("selected");
        }
        for (var a = 0; a < baustein.style.length; a++) {
            var element = baustein.style[a];
            if (element.value !== "") {
                var property_name = element.property.name;
                baustein_dom.style[property_name] = element.value;
            }
        }
        var baustein_indicator = baustein_dom.appendChild(this.createElement("label", baustein_dom_id + "_indicator", "baustein_indicator"));
        baustein_indicator.addEventListener("click", function () {
            self.selectBaustein(baustein_id);
        }, false);
        dragstart_elements[dragstart_elements.length] = baustein_indicator;
        if (position_parent === null) {
            var baustein_indicator_position = baustein_indicator.appendChild(this.createElement("span", "", "baustein_indicator_position"));
            baustein_indicator_position.innerHTML = self.baustein_counter.toString();
            self.baustein_counter++;
        }
        var changeBausteinOptions = this.getChangeBausteinOptions(baustein.renderType, baustein.type);
        if (changeBausteinOptions.length === 0) {
            var baustein_indicator_title = baustein_indicator.appendChild(this.createElement("span", "", "baustein_indicator_title"));
            baustein_indicator_title.innerHTML = baustein.icon + " " + baustein.title;
        }
        else {
            var baustein_indicator_changer = baustein_indicator.appendChild(this.createElement("select", "", "baustein_indicator_changer"));
            baustein_indicator_changer.tabIndex = -1;
            baustein_indicator_changer.addEventListener("change", function () {
                self.changeBaustein(baustein_id, this.value);
            });
            var baustein_indicator_option = baustein_indicator_changer.appendChild(this.createElement("option", "", ""));
            baustein_indicator_option.value = baustein.type;
            baustein_indicator_option.innerHTML = baustein.icon + " " + baustein.title;
            baustein_indicator_option.selected = true;
            baustein_indicator_option.style.display = "none";
            for (var i = 0; i < changeBausteinOptions.length; i++) {
                baustein_indicator_changer.appendChild(changeBausteinOptions[i]);
            }
        }
        switch (baustein.renderType) {
            case bausteinRenderType.layout:
            case bausteinRenderType.table:
            case bausteinRenderType.tableRow:
                var bausteine_inner = this.getBausteineArray(baustein.id);
                for (var row = 0; row < bausteine_inner.length; row++) {
                    var baustein_inner = bausteine_inner[row];
                    baustein_dom.appendChild(this.addBausteinSelector(new Position(baustein_id, baustein_inner.position.sort), false, true));
                    baustein_dom.appendChild(this.renderBaustein(baustein_inner, new Position(baustein_id, baustein_inner.position.sort)));
                }
                baustein_dom.appendChild(this.addBausteinSelector(new Position(baustein_id, this.getPositionSort(false)), false, true));
                break;
            case bausteinRenderType.image:
                var image = baustein_dom.appendChild(this.createElement("img", baustein_editor_id, "be_baustein_item"));
                image.dataset.src = baustein.content;
                if (baustein.content === "") {
                    image.src = this.assets.baustein_image_placeholder;
                }
                else {
                    image.src = baustein.content;
                }
                image.style.maxWidth = "100%";
                image.addEventListener("click", function () {
                    self.selectBaustein(baustein_id);
                });
                dragstart_elements[dragstart_elements.length] = image;
                break;
            default:
                var editor;
                switch (baustein.renderType) {
                    case bausteinRenderType.richtext:
                        editor = baustein_dom.appendChild(this.createElement("div", baustein_editor_id, "be_baustein_item"));
                        editor.innerHTML = baustein.content;
                        editor.style.minHeight = "100px";
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
                        editor.addEventListener("input", function () {
                            editor.style.height = '1px';
                            editor.style.height = editor.scrollHeight + 'px';
                            baustein.content = editor.innerHTML;
                        });
                        dragstart_elements[dragstart_elements.length] = baustein_dom.getElementsByClassName("__toolbar")[0];
                        break;
                    default:
                        editor = baustein_dom.appendChild(this.createElement("textarea", baustein_editor_id, "be_baustein_item"));
                        editor.innerHTML = baustein.content;
                        editor.focus();
                        baustein_dom.addEventListener("input", function () {
                            editor.style.height = '1px';
                            editor.style.height = editor.scrollHeight + 'px';
                            baustein.content = editor.value.split("<").join("&lt;").split(">").join("&gt;");
                        });
                        break;
                }
                editor.draggable = false;
                editor.addEventListener("focusin", function () {
                    self.selectBaustein(baustein_id);
                });
                break;
        }
        baustein_dom.addEventListener("click", function (e) {
            if (e.target.id === baustein_dom_id) {
                self.selectBaustein(baustein_id);
            }
            else {
                return false;
            }
        }, false);
        new LuxClickHoldDrag(baustein_dom, {
            mousedown: null,
            mousemove: null,
            mouseup: function (e, reciever_element) {
                console.log("reciever_element", reciever_element);
                for (var tries = 0; tries < 4; tries++) {
                    if (typeof reciever_element.dataset.position_parent === "string") {
                        break;
                    }
                    else {
                        if (reciever_element.parentElement === null) {
                            console.error("[BausteinEditor] reciever_element.parentElement is null");
                            break;
                        }
                        else {
                            reciever_element = reciever_element.parentElement;
                        }
                    }
                }
                if (typeof reciever_element.dataset.position_parent !== "string") {
                    console.error("BausteinEditor: reciever_element.dataset.position_parent is not a string");
                }
                else if (typeof reciever_element.dataset.position_sort !== "string") {
                    console.error("BausteinEditor: reciever_element.dataset.position_sort is not a string");
                }
                else {
                    var old_baustein_id = baustein_id;
                    var new_position = {
                        parent: reciever_element.dataset.position_parent === "0" ? 0 : (parseInt(reciever_element.dataset.position_parent) || null),
                        sort: reciever_element.dataset.position_sort === "0" ? 0 : (parseInt(reciever_element.dataset.position_sort) || null)
                    };
                    console.log("drop on addBausteinSelector: old_baustein_id", old_baustein_id);
                    console.log("drop on addBausteinSelector: new position", new_position);
                    if (new_position.sort === null) {
                        console.error("[BausteinEditor] LuxClickHoldDrag.callback_mouseup: new_position.sort is null");
                    }
                    else {
                        self.moveBaustein(old_baustein_id, new Position(new_position.parent, new_position.sort));
                    }
                }
            }
        });
        baustein_dom.addEventListener("dragend", function () {
            baustein_dom.draggable = false;
        });
        return baustein_dom;
    };
    BausteinEditor.prototype.render = function () {
        this.dom.content.innerHTML = "";
        this.baustein_counter = 0;
        var bausteine = this.getBausteineArray(null);
        for (var row = 0; row < bausteine.length; row++) {
            var baustein = bausteine[row];
            this.dom.content.appendChild(this.addBausteinSelector(new Position(null, baustein.position.sort), true, true));
            this.dom.content.appendChild(this.renderBaustein(baustein, new Position(null, baustein.position.sort)));
        }
        this.dom.content.appendChild(this.addBausteinSelector(new Position(null, (bausteine.length === 0 ? 0 : bausteine[bausteine.length - 1].position.sort + 1)), false, true));
        this.preview_render();
    };
    BausteinEditor.prototype.bausteinSelector_open = function (be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2) {
        be_bausteinSelector.style.display = "none";
        be_bausteinSelector_layer_item_container1.style.display = "";
        be_bausteinSelector_layer_item_container2.style.display = "none";
        be_bausteinSelector_layer.style.display = "";
        this.be_bausteinSelector_isOpen = true;
    };
    BausteinEditor.prototype.bausteinSelector_close = function (be_bausteinSelector, be_bausteinSelector_layer) {
        be_bausteinSelector.style.display = "";
        be_bausteinSelector_layer.style.display = "none";
        this.be_bausteinSelector_isOpen = false;
    };
    BausteinEditor.prototype.bausteinSelector_toggle = function (be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2) {
        if (this.be_bausteinSelector_isOpen) {
            this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
        }
        else {
            this.bausteinSelector_open(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2);
        }
    };
    BausteinEditor.prototype.apply_styles = function () {
        if (this.selected_baustein !== null && this.selected_baustein_id !== null) {
            var baustein = this.getBaustein(this.selected_baustein_id);
            var selected_baustein_editor = this.selected_baustein.lastChild;
            var nodes = this.dom.sidebar_content__baustein_styles.querySelectorAll(".be_formrow .form-control");
            for (var i = 0; i < nodes.length; i++) {
                var property_name = nodes[i].name;
                var value = typeof nodes[i].dataset.value === "undefined" ? nodes[i].value : nodes[i].dataset.value;
                var baustein_style_index = baustein.style.length;
                for (var b = 0; b < baustein.style.length; b++) {
                    if (baustein.style[b].property.name === property_name) {
                        baustein_style_index = b;
                        break;
                    }
                }
                if (baustein_style_index === baustein.style.length) {
                    if (value === "" || value === "0" || value === "auto")
                        continue;
                    var new_style = new BausteinStyle(this.getStylePropertyByName(property_name), "");
                    if (new_style.property.options.length > 0 && new_style.property.options[0] === value)
                        continue;
                    baustein.style[baustein_style_index] = new_style;
                }
                baustein.style[baustein_style_index].value = value;
                var target;
                if (baustein.renderType === bausteinRenderType.layout) {
                    target = this.selected_baustein;
                }
                else {
                    target = selected_baustein_editor;
                }
                if (baustein.style[baustein_style_index].property.useAsClass) {
                    for (var h = 0; h < baustein.style[baustein_style_index].property.options.length; h++) {
                        var class_value = baustein.style[baustein_style_index].property.options[h].value;
                        if (target.classList.contains(class_value))
                            target.classList.remove(baustein.style[baustein_style_index].property.options[h].value);
                    }
                    if (baustein.style[baustein_style_index].value !== "")
                        target.classList.add(baustein.style[baustein_style_index].value);
                }
                else {
                    target.style.setProperty(baustein.style[baustein_style_index].property.name, baustein.style[baustein_style_index].value);
                }
            }
        }
        this.preview_render();
    };
    BausteinEditor.prototype.formcontrol = function (domArk, type, name, title, value, suffix, options) {
        var self = this;
        var fc_dom_id = (this.dom_id + '_' + domArk + '_fc_' + name);
        var useDataValue = false;
        var be_formrow = this.createElement("div", "", "be_formrow");
        if (title !== null) {
            var label = be_formrow.appendChild(this.createElement("label", "", ""));
            label.htmlFor = fc_dom_id;
            label.innerHTML = title;
        }
        var form_control_container = be_formrow.appendChild(this.createElement("div", "", "form-control-container"));
        if (type === "number") {
            form_control_container.classList.add("number");
        }
        var form_control;
        if (type === "select") {
            form_control = form_control_container.appendChild(this.createElement("select", fc_dom_id, "form-control"));
            form_control.name = name;
            for (var i = 0; i < options.length; i++) {
                var option_element = form_control.appendChild(this.createElement("option", "", ""));
                option_element.value = options[i].value;
                option_element.innerHTML = options[i].text;
                if (options[i].value == value) {
                    option_element.classList.add("selected");
                }
            }
        }
        else {
            form_control = form_control_container.appendChild(this.createElement("input", fc_dom_id, "form-control"));
            form_control.name = name;
            form_control.value = value;
            if (type === "color") {
                form_control.type = "color";
                useDataValue = true;
            }
            else if (type === "number") {
                form_control.type = "text";
                form_control.dataset.suffix = suffix;
                var form_control_container_up = form_control_container.appendChild(this.createElement("div", "", "form-control-container_up"));
                form_control_container_up.innerHTML = '⮝';
                var form_control_container_down = form_control_container.appendChild(this.createElement("div", "", "form-control-container_down"));
                form_control_container_down.innerHTML = '⮟';
                var suffix_const_1 = suffix;
                var formcontrol_number_1 = function (add) {
                    var num = parseFloat(form_control.value.replace(suffix_const_1, ""));
                    if (!num) {
                        num = 0;
                    }
                    var countDecimals = num % 1 ? num.toString().split(".")[1].length : 0;
                    if (countDecimals === 0) {
                        num = num + add;
                    }
                    else {
                        var mltp = Math.pow(10, countDecimals);
                        num = Math.floor((num * mltp) + (add * mltp)) / mltp;
                    }
                    form_control.value = num.toString() + suffix_const_1;
                };
                form_control.addEventListener("change", function () {
                    formcontrol_number_1(0);
                    self.apply_styles();
                });
                form_control.addEventListener("keydown", function (e) {
                    var steps = e.shiftKey ? 10 : (e.ctrlKey ? 0.1 : 1);
                    var keyCode = e.which | e.keyCode;
                    if (keyCode === 38) {
                        formcontrol_number_1(steps);
                        self.apply_styles();
                        return false;
                    }
                    else if (keyCode === 40) {
                        formcontrol_number_1(-steps);
                        self.apply_styles();
                        return false;
                    }
                });
                form_control_container_up.addEventListener("click", function () { formcontrol_number_1(+1); self.apply_styles(); });
                form_control_container_down.addEventListener("click", function () { formcontrol_number_1(-1); self.apply_styles(); });
            }
            else {
                form_control.type = "text";
            }
        }
        if (type !== "number") {
            var _useDataValue_1 = useDataValue;
            if (_useDataValue_1) {
                form_control.dataset.value = value;
            }
            form_control.addEventListener("change", function () {
                if (_useDataValue_1) {
                    form_control.dataset.value = form_control.value;
                }
                self.apply_styles();
            });
        }
        return be_formrow;
    };
    BausteinEditor.prototype.layout_fc = function (name, value, top, right, bottom, left) {
        var be_layout_fc__margin_top = this.formcontrol("baustein", "number", name, null, value, "px", ["0", "auto"]);
        be_layout_fc__margin_top.style.width = "34px";
        be_layout_fc__margin_top.style.height = "30px";
        if (top !== null)
            be_layout_fc__margin_top.style.top = top === "" ? "calc(50% - (" + be_layout_fc__margin_top.style.height + " / 2))" : top;
        if (bottom !== null)
            be_layout_fc__margin_top.style.bottom = bottom === "" ? "calc(50% - (" + be_layout_fc__margin_top.style.height + " / 2))" : bottom;
        if (left !== null)
            be_layout_fc__margin_top.style.left = left === "" ? "calc(50% - (" + be_layout_fc__margin_top.style.width + " / 2))" : left;
        if (right !== null)
            be_layout_fc__margin_top.style.right = right === "" ? "calc(50% - (" + be_layout_fc__margin_top.style.width + " / 2))" : right;
        return be_layout_fc__margin_top;
    };
    BausteinEditor.prototype.open_baustein_attributes = function (baustein_id) {
        if (this.open_baustein_attributes__baustein_id === null || this.open_baustein_attributes__baustein_id !== baustein_id) {
            var current_baustein_1 = this.getBaustein(baustein_id);
            this.open_baustein_attributes__baustein_id = baustein_id;
            var self_1 = this;
            console.log("open_baustein_attributes baustein_id", baustein_id);
            this.dom.sidebar_content__baustein_styles.innerHTML = "";
            this.dom.sidebar_content__baustein_misc.innerHTML = "";
            var be_layout_view = this.dom.sidebar_content__baustein_styles.appendChild(this.createElement("div", "", "be_layout_view"));
            var be_layout_view_margin = be_layout_view.appendChild(this.createElement("div", "", "be_layout_view_margin"));
            var be_layout_view_margin_indicator = be_layout_view_margin.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_margin_indicator.innerHTML = "margin";
            be_layout_view_margin.appendChild(this.layout_fc("margin-top", this.getItemFromArray(current_baustein_1.style, "margin-top", "0"), "-6px", null, null, ""));
            be_layout_view_margin.appendChild(this.layout_fc("margin-bottom", this.getItemFromArray(current_baustein_1.style, "margin-bottom", "0"), null, null, "-6px", ""));
            be_layout_view_margin.appendChild(this.layout_fc("margin-left", this.getItemFromArray(current_baustein_1.style, "margin-left", "0"), "", null, null, "-6px"));
            be_layout_view_margin.appendChild(this.layout_fc("margin-right", this.getItemFromArray(current_baustein_1.style, "margin-right", "0"), "", "-6px", null, null));
            var be_layout_view_border = be_layout_view_margin.appendChild(this.createElement("div", "", "be_layout_view_border"));
            var be_layout_view_border_indicator = be_layout_view_border.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_border_indicator.innerHTML = "border";
            be_layout_view_border.appendChild(this.layout_fc("border-top", this.getItemFromArray(current_baustein_1.style, "border-top", "0"), "-13px", null, null, ""));
            be_layout_view_border.appendChild(this.layout_fc("border-bottom", this.getItemFromArray(current_baustein_1.style, "border-bottom", "0"), null, null, "-13px", ""));
            be_layout_view_border.appendChild(this.layout_fc("border-left", this.getItemFromArray(current_baustein_1.style, "border-left", "0"), "", null, null, "-14px"));
            be_layout_view_border.appendChild(this.layout_fc("border-right", this.getItemFromArray(current_baustein_1.style, "border-right", "0"), "", "-14px", null, null));
            var be_layout_view_padding = be_layout_view_border.appendChild(this.createElement("div", "", "be_layout_view_padding"));
            var be_layout_view_padding_indicator = be_layout_view_padding.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_padding_indicator.innerHTML = "padding";
            be_layout_view_padding.appendChild(this.layout_fc("padding-top", this.getItemFromArray(current_baustein_1.style, "padding-top", "0"), "0px", null, null, ""));
            be_layout_view_padding.appendChild(this.layout_fc("padding-bottom", this.getItemFromArray(current_baustein_1.style, "padding-bottom", "0"), null, null, "0px", ""));
            be_layout_view_padding.appendChild(this.layout_fc("padding-left", this.getItemFromArray(current_baustein_1.style, "padding-left", "0"), "", null, null, "8px"));
            be_layout_view_padding.appendChild(this.layout_fc("padding-right", this.getItemFromArray(current_baustein_1.style, "padding-right", "0"), "", "8px", null, null));
            var be_layout_view_inner = be_layout_view_padding.appendChild(this.createElement("div", "", "be_layout_view_inner"));
            be_layout_view_inner.appendChild(this.layout_fc("max-width", this.getItemFromArray(current_baustein_1.style, "max-width", "auto"), null, null, null, null));
            be_layout_view_inner.appendChild(this.createElement("span", "", "be_layout_wh_delimiter")).innerHTML = " &times; ";
            be_layout_view_inner.appendChild(this.layout_fc("max-height", this.getItemFromArray(current_baustein_1.style, "max-height", "auto"), null, null, null, null));
            if (current_baustein_1.renderType === bausteinRenderType.image) {
                var baustein_image_row = this.dom.sidebar_content__baustein_styles.appendChild(this.formcontrol("baustein_image", "text", "image", 'Bildquelle', current_baustein_1.content, "", []));
                var start_image_selector = baustein_image_row.getElementsByClassName('form-control-container')[0].appendChild(self_1.createElement("button", "start_image_selector", "form-control"));
                start_image_selector.type = "button";
                start_image_selector.innerHTML = "[>]";
                start_image_selector.style.width = "34px";
                start_image_selector.style.marginLeft = "4px";
                var baustein_image_form_control = baustein_image_row.getElementsByClassName('form-control')[0];
                baustein_image_form_control.addEventListener("change", function () {
                    current_baustein_1.content = this.value;
                    if (self_1.selected_baustein !== null) {
                        var selected_baustein_item = self_1.selected_baustein.querySelector(".be_baustein_item");
                        selected_baustein_item.src = this.value;
                    }
                });
                baustein_image_form_control.style.width = 'calc(100% - ' + start_image_selector.style.width + ' - ' + start_image_selector.style.marginLeft + ')';
                start_image_selector.addEventListener("click", function () {
                    self_1.dialog_media(bausteinRenderType.image, baustein_id);
                });
            }
            for (var i = 0; i < current_baustein_1.style.length; i++) {
                var element = current_baustein_1.style[i];
                this.dom.sidebar_content__baustein_styles.appendChild(this.formcontrol("baustein", element.property.type, element.property.name, element.property.title, element.value, element.property.suffix, element.property.options));
            }
            var baustein_class_row = this.dom.sidebar_content__baustein_misc.appendChild(this.formcontrol("baustein_class", "text", "class", 'CSS Klasse <div style="font-size: 11px; margin-bottom: 2px;">(für Fortgeschrittene Nutzer)</div>', current_baustein_1.class, "", []));
            var baustein_delete_button = this.dom.sidebar_content__baustein_misc.appendChild(this.createElement("button", this.dom_id + '_deleteBaustein', "form-control bautstein-delete"));
            baustein_delete_button.innerHTML = "Baustein löschen";
            baustein_delete_button.type = "button";
            var baustein_class_form_control = baustein_class_row.getElementsByClassName('form-control')[0];
            baustein_class_form_control.addEventListener("change", function () {
                current_baustein_1.class = this.value;
            });
            baustein_delete_button.addEventListener("click", function () {
                self_1.dialog("Baustein löschen", "Sind Sie sich sicher, dass Sie diesen Baustein löschen wollen?", null, "Löschen", "Abbrechen", null, function () {
                    self_1.close_baustein_attributes();
                    console.log(self_1.data.bausteine);
                    self_1.deleteBaustein(baustein_id);
                    console.log(self_1.data.bausteine);
                    if (self_1.dialog_close_function === null) {
                        console.error("baustein_delete_button tried to close dialog, but self.dialog_close_function is null");
                    }
                    else {
                        self_1.dialog_close_function();
                    }
                });
            });
            this.dom.sidebar_content__site.style.display = "none";
            this.dom.sidebar_header_col__site.classList.remove("active");
            this.dom.sidebar_content__baustein.style.display = "";
            this.dom.sidebar_header_col__baustein.classList.add("active");
            this.dom.sidebar_header_col__baustein.classList.remove("disabled");
        }
    };
    BausteinEditor.prototype.getItemFromArray = function (array, index, def) {
        if (typeof array[index] === "undefined") {
            return def;
        }
        else {
            return array[index];
        }
    };
    BausteinEditor.prototype.getIndexFromItem = function (array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return null;
    };
    BausteinEditor.prototype.getValueFromItem = function (array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return null;
    };
    BausteinEditor.prototype.close_baustein_attributes = function () {
        this.dom.sidebar_content__site.style.display = "";
        this.dom.sidebar_header_col__site.classList.add("active");
        this.dom.sidebar_content__baustein.style.display = "none";
        this.dom.sidebar_header_col__baustein.classList.remove("active");
        this.dom.sidebar_header_col__baustein.classList.add("disabled");
    };
    BausteinEditor.prototype.preview_render = function () {
        if (this.dom.preview_content.style.display === "") {
            this.dom.preview_content.innerHTML = this.export().html;
        }
    };
    BausteinEditor.prototype.request = function (type, endpoint, params) {
        return new Promise(function (resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        resolve(this);
                    }
                    else {
                        reject(this);
                    }
                }
            };
            if (type === "GET") {
                xhttp.open("GET", endpoint + params, true);
                xhttp.send();
            }
            else {
                xhttp.open("POST", endpoint, true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(params);
            }
        });
    };
    BausteinEditor.prototype.dialog = function (title, body_content, action_ok_text, action_fail_text, action_close_text, action_ok, action_fail, action_close) {
        if (action_ok === void 0) { action_ok = null; }
        if (action_fail === void 0) { action_fail = null; }
        if (action_close === void 0) { action_close = null; }
        var self = this;
        self.dom.dialog_title.innerHTML = title;
        if (typeof body_content === "string") {
            self.dom.dialog_body.innerHTML = body_content;
        }
        else {
            self.dom.dialog_body.innerHTML = '';
            self.dom.dialog_body.appendChild(body_content);
        }
        if (self.dialog_close_function !== null)
            self.dom.dialog_close.removeEventListener("click", self.dialog_close_function);
        if (action_close === null) {
            self.dialog_close_function = function () { self.dom.dialog.style.display = "none"; };
        }
        else {
            self.dialog_close_function = action_close;
        }
        self.dom.dialog_close.addEventListener("click", self.dialog_close_function);
        self.dom.dialog_footer.innerHTML = '';
        if (action_ok_text !== null) {
            var button = self.dom.dialog_footer.appendChild(self.createElement("button", "", "__dialog-btn __dialog-btn-green"));
            button.type = "button";
            button.innerHTML = action_ok_text;
            button.addEventListener("click", action_ok);
        }
        if (action_fail_text !== null) {
            var button = self.dom.dialog_footer.appendChild(self.createElement("button", "", "__dialog-btn __dialog-btn-red"));
            button.type = "button";
            button.innerHTML = action_fail_text;
            button.addEventListener("click", action_fail);
        }
        if (action_close_text !== null) {
            var button = self.dom.dialog_footer.appendChild(self.createElement("button", "", "__dialog-btn __dialog-btn-gray"));
            button.type = "button";
            button.innerHTML = action_close_text;
            button.addEventListener("click", self.dialog_close_function);
        }
        self.dom.dialog.style.display = "";
    };
    BausteinEditor.prototype.dialog_media = function (renderType, baustein_id) {
        var self = this;
        var baustein = this.getBaustein(baustein_id);
        var search_endpoint, register_endpoint;
        if (renderType === bausteinRenderType.image) {
            search_endpoint = self.api_endpoints.image_search;
            register_endpoint = self.api_endpoints.image_register;
        }
        else {
            search_endpoint = "";
            register_endpoint = "";
        }
        var content = self.createElement("div", "", "");
        var content_search = content.appendChild(self.createElement("div", "", "be-dialog-media-search"));
        content_search.style.marginBottom = "20px";
        var content_search_input = content_search.appendChild(self.createElement("input", "", "be-dialog-media-search-input form-control"));
        content_search_input.type = "text";
        content_search_input.placeholder = "Suchbegriffe..";
        content_search_input.style.display = "inline-block";
        content_search_input.style.verticalAlign = "middle";
        var content_search_submit = content_search.appendChild(self.createElement("button", "", "be-dialog-media-search-submit __dialog-btn"));
        content_search_submit.type = "button";
        content_search_submit.innerHTML = "Suchen";
        content_search_submit.style.display = "inline-block";
        content_search_submit.style.verticalAlign = "middle";
        content_search_submit.style.width = "66px";
        content_search_submit.style.padding = "6px";
        content_search_submit.style.marginLeft = "8px";
        content_search_submit.style.marginRight = "0";
        content_search_input.style.width = "calc(100% - " + content_search_submit.style.width + " - " + content_search_submit.style.marginLeft + ")";
        var content_results = content.appendChild(self.createElement("div", "", "be-dialog-media-results"));
        content_results.style.overflowY = "auto";
        content_results.style.height = "500px";
        content_results.style.maxHeight = "90vh";
        function start_search() {
            self.request("GET", search_endpoint, "&q=" + content_search_input.value)
                .then(function (response) {
                var json = JSON.parse(response.responseText);
                var media_array = json.media;
                console.log("response json", json);
                content_results.innerHTML = '';
                var _loop_3 = function (i) {
                    var element = media_array[i];
                    row = content_results.appendChild(self.createElement("div", "", "row"));
                    row.style.display = "inline-block";
                    row.style.verticalAlign = "top";
                    row.style.width = (content_results.clientWidth / 2 - 18) + "px";
                    row.style.maxWidth = "100%";
                    row.style.border = "1px solid #ccc";
                    row.style.borderRadius = "6px";
                    row.style.margin = "4px";
                    row.style.textAlign = "center";
                    row.style.overflow = "hidden";
                    image_container = row.appendChild(self.createElement("div", "", "col"));
                    image_container.style.width = "100%";
                    image_container.style.height = "200px";
                    image = image_container.appendChild(self.createElement("img", "", ""));
                    image.src = element.url;
                    image.style.maxWidth = "100%";
                    image.style.maxHeight = "100%";
                    title = row.appendChild(self.createElement("div", "", "col"));
                    title.innerText = element.name;
                    title.style.marginBottom = "8px";
                    button = row.appendChild(self.createElement("button", "", "__dialog-btn __dialog-btn-green"));
                    button.type = "button";
                    button.innerText = "Auswählen";
                    button.style.marginBottom = "8px";
                    var bild_id = element.id;
                    button.addEventListener("click", function () {
                        self.request("POST", register_endpoint, "&id=" + bild_id)
                            .then(function (response) {
                            var json = JSON.parse(response.responseText);
                            var bild_url = json.url;
                            baustein.content = bild_url;
                            if (self.selected_baustein !== null) {
                                var img = self.selected_baustein.querySelector("img");
                                if (img !== null) {
                                    img.src = bild_url;
                                }
                            }
                            if (self.dialog_close_function !== null)
                                self.dialog_close_function();
                        });
                    });
                };
                var row, image_container, image, title, button;
                for (var i = 0; i < media_array.length; i++) {
                    _loop_3(i);
                }
            });
        }
        content_search_input.addEventListener("change", start_search);
        content_search_submit.addEventListener("click", start_search);
        self.dialog("Bild laden", content, null, null, null);
        start_search();
    };
    BausteinEditor.prototype.import = function (data) {
        for (var i = 0; i < data.bausteine.length; i++) {
            if (data.bausteine[i].id >= this.baustein_id_counter) {
                this.baustein_id_counter = data.bausteine[i].id + 1;
            }
            var baustein_type = this.getBausteinType(data.bausteine[i].type);
            data.bausteine[i].icon = baustein_type.icon;
        }
        this.data = data;
        this.render();
    };
    BausteinEditor.prototype.export_createBausteinElement = function (baustein, position, tag_override) {
        if (tag_override === void 0) { tag_override = null; }
        var tag, id;
        if (tag_override === null) {
            tag = baustein.tag;
            id = baustein.type;
        }
        else {
            tag = tag_override;
            id = tag_override;
        }
        var bausteinElement = document.createElement(tag);
        bausteinElement.className = "baustein baustein--" + id;
        if (baustein.class !== "")
            bausteinElement.className += " " + baustein.class;
        for (var s = 0; s < baustein.style.length; s++) {
            var style = baustein.style[s];
            if (style.value !== "" && style.value !== "0" && style.value !== "auto" && style.value !== "initial" && style.value !== "normal"
                && (style.property.options.length === 0 || style.value !== style.property.options[0].value)) {
                var ok = true, test_type = this.getBausteinType(id), test_type_index = -1;
                if (test_type !== null) {
                    for (var b = 0; b < test_type.style.length; b++) {
                        var test_style = test_type.style[b];
                        test_type_index = b;
                        if (test_style.property.name === style.property.name) {
                            console.log(test_style.property.name, test_style.value, "|", style.property.name, style.value);
                            if (test_style.value === style.value) {
                                ok = false;
                            }
                            break;
                        }
                    }
                }
                if (ok) {
                    if (test_type.style[test_type_index].property.useAsClass) {
                        bausteinElement.classList.add(style.value);
                    }
                    else {
                        bausteinElement.style.setProperty(style.property.name, style.value);
                    }
                }
            }
        }
        if (tag_override === null) {
            console.log('baustein.content', baustein.content);
            if (baustein.renderType === bausteinRenderType.image) {
                var bausteinElement_img = bausteinElement;
                bausteinElement_img.src = baustein.content;
            }
            else {
                bausteinElement.innerHTML = baustein.content;
            }
        }
        return bausteinElement;
    };
    BausteinEditor.prototype.export = function () {
        var export_html_dom = this.createElement("div", "", "be-article");
        for (var s = 0; s < this.data.page.style.length; s++) {
            var style = this.data.page.style[s];
            if (style.value !== "" && style.value !== "0" && style.value !== "auto" && (style.property.options.length === 0 && style.value !== style.property.options[0])) {
                export_html_dom.style.setProperty(style.property.name, style.value);
            }
        }
        var bausteine = this.getBausteineArray(null);
        for (var row = 0; row < bausteine.length; row++) {
            var baustein = bausteine[row];
            export_html_dom.appendChild(this.export_createBausteinElement(baustein, new Position(null, baustein.position.sort)));
        }
        for (var i = 0; i < this.data.bausteine.length; i++) {
            delete this.data.bausteine[i].icon;
        }
        return {
            data: this.data,
            html: export_html_dom.outerHTML
        };
    };
    return BausteinEditor;
}());
var LuxClickHoldDrag = (function () {
    function LuxClickHoldDrag(target, options) {
        var _this = this;
        this.isHeld = false;
        this.timeoutId = 0;
        this.drag_element = null;
        this.offset_x = 0;
        this.offset_y = 0;
        this.callback_mousedown = null;
        this.callback_mousemove = null;
        this.callback_mouseup = null;
        this.mousedown = function (e) {
            if (!_this.isHeld) {
                _this.timeoutId = setTimeout(function () {
                    _this.isHeld = true;
                    _this.target.classList.add("disabled");
                    _this.drag_element = document.createElement(_this.target.tagName);
                    _this.drag_element.className = _this.target.className;
                    _this.drag_element.innerHTML = _this.target.innerHTML;
                    _this.drag_element.style.width = _this.target.clientWidth + "px";
                    _this.drag_element.style.height = _this.target.offsetHeight + "px";
                    document.body.appendChild(_this.drag_element);
                    if (_this.callback_mousedown !== null)
                        _this.callback_mousedown(e);
                    document.body.classList.add("grabbing");
                    if (_this.drag_element === null) {
                        console.error("[LuxClickHoldDrag] drag_element is null. Well bad.");
                    }
                    else {
                        _this.drag_element.classList.add("ondrag");
                        _this.drag_element.style.position = "fixed";
                        _this.drag_element.style.display = "none";
                        setTimeout(function () {
                            if (_this.drag_element !== null) {
                                _this.drag_element.style.display = "block";
                            }
                        }, 100);
                    }
                    ["mousemove", "touchmove"].forEach(function (type) {
                        document.body.addEventListener(type, _this.mousemove);
                    });
                    _this.offset_x = _this.target.offsetWidth / 2;
                    _this.offset_y = _this.target.offsetHeight / 2;
                }, 200);
            }
            ["mouseup", "touchend", "touchcancel"].forEach(function (type) {
                document.body.addEventListener(type, _this.mouseup);
            });
        };
        this.mousemove = function (e) {
            if (_this.drag_element !== null) {
                _this.drag_element.style.left = (e.clientX - _this.offset_x) + "px";
                _this.drag_element.style.top = (e.clientY - _this.offset_y) + "px";
                if (_this.callback_mousemove !== null)
                    _this.callback_mousemove(e);
            }
        };
        this.mouseup = function (e) {
            clearTimeout(_this.timeoutId);
            console.log("LuxClickHoldDrag mouseup 1 -- this.isHeld", _this.isHeld);
            if (_this.isHeld) {
                console.log("LuxClickHoldDrag mouseup 2");
                _this.isHeld = false;
                console.log("mouseup");
                _this.target.classList.remove("disabled");
                if (_this.drag_element !== null)
                    _this.drag_element.remove();
                document.querySelectorAll(".ondrag").forEach(function (elem) { elem.remove(); });
                document.body.classList.remove("grabbing");
                var elementTarget = _this.elementFromPoint(e.clientX, e.clientY);
                if (elementTarget === null) {
                    console.error("[LuxClickHoldDrag] Oh well bad, elementTarget is null. Uff.");
                }
                else {
                    if (_this.callback_mouseup !== null)
                        _this.callback_mouseup(e, elementTarget);
                }
            }
            ["mousemove", "touchmove"].forEach(function (type) {
                document.body.removeEventListener(type, _this.mousemove);
            });
            ["mouseup", "touchend", "touchcancel"].forEach(function (type) {
                document.body.removeEventListener(type, _this.mouseup);
            });
        };
        this.target = target;
        this.callback_mousedown = options.mousedown || null;
        this.callback_mousemove = options.mousemove || null;
        this.callback_mouseup = options.mouseup || null;
        ["mousedown", "mousestart"].forEach(function (type) {
            _this.target.addEventListener(type, _this.mousedown);
        });
    }
    LuxClickHoldDrag.prototype.elementFromPoint = function (x, y) {
        var elem = document.elementFromPoint(x, y);
        return elem;
    };
    return LuxClickHoldDrag;
}());
//# sourceMappingURL=baustein_editor.js.map