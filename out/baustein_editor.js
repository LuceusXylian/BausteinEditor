"use strict";
var BausteinRenderType = {
    layout: 0,
    table: 1,
    plaintext: 2,
    richtext: 3,
    image: 4,
};
var Position = (function () {
    function Position(row, depth, item) {
        this.row = row;
        this.depth = depth;
        this.item = item;
    }
    return Position;
}());
var BausteinStyleProperty = (function () {
    function BausteinStyleProperty(name, title, type, suffix, options) {
        this.name = name;
        this.title = title;
        this.type = type;
        this.suffix = suffix;
        this.options = options;
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
    function Baustein(id, title, icon, tag, renderType, style) {
        this.id = id;
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
        this.position = {
            row: -1,
            depth: -1,
            item: -1,
        };
    }
    return Baustein;
}());
var BausteinEditor = (function () {
    function BausteinEditor(dom_id) {
        this.styleProperties = {
            font_family: { name: "font-family", title: "Schriftart", type: "string", suffix: "", options: [] },
            font_size: { name: "font-size", title: "Schriftgröße", type: "number", suffix: "rem", options: [] },
            font_weight: { name: "font-weight", title: "Textdicke", type: "select", suffix: "",
                options: [new Option("Normal", "normal"), new Option("Fett", "bold"), new Option("Fetter", "bolder"), new Option("Leichter", "lighter")] },
            text_decoration: { name: "text-decoration", title: "Textunterschreichung", type: "select", suffix: "",
                options: [new Option("Normal", "normal"), new Option("underline", "underline"), new Option("dotted", "dotted")] },
            font_style: { name: "font-style", title: "Textkursion", type: "select", suffix: "",
                options: [new Option("Normal", "normal"), new Option("italic", "italic"), new Option("oblique", "oblique")] },
            text_align: { name: "text-align", title: "Textausrichtung", type: "select", suffix: "",
                options: [new Option("Normal", "initial"), new Option("left", "left"), new Option("center", "center"), new Option("right", "right")] },
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
        this.stylePropertiesArray = Object.values(this.styleProperties);
        this.data = {
            page: {
                style: [
                    { property: this.styleProperties.font_family, value: "Verdana, Arial, Helvetica, sans-serif" },
                    { property: this.styleProperties.font_size, value: "1rem" },
                ]
            },
            bausteine: []
        };
        this.types = {
            h1: new Baustein("h1", "Überschrift 1", '<b>H1</b>', "h1", BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.375rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h2: new Baustein("h2", "Überschrift 2", '<b>H2</b>', "h2", BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.25rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h3: new Baustein("h3", "Überschrift 3", '<b>H3</b>', "h3", BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.125rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h4: new Baustein("h4", "Überschrift 4", '<b>H4</b>', "h4", BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.1rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h5: new Baustein("h5", "Überschrift 5", '<b>H5</b>', "h5", BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h6: new Baustein("h6", "Überschrift 6", '<b>H6</b>', "h6", BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "0.9rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            text: new Baustein("text", "Paragraph (Text)", '<i class="fas fa-paragraph"></i>', "p", BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            html: new Baustein("html", "HTML", '<i class="fab fa-html5"></i>', "div", BausteinRenderType.plaintext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            script: new Baustein("script", "Script", '<i class="fas fa-code"></i>', "script", BausteinRenderType.plaintext, []),
            shortcode: new Baustein("shortcode", "Shortcode []", '<i class="fas fa-code"></i>', "span", BausteinRenderType.plaintext, []),
            image: new Baustein("image", "Bild", '<i class="fas fa-image"></i>', "img", BausteinRenderType.image, []),
            layout: new Baustein("layout", "Layout", '<i class="fas fa-layer-group" style="transform: rotate(90deg);"></i>', "div", BausteinRenderType.layout, [
                { property: this.styleProperties.max_width, value: "" },
                { property: this.styleProperties.max_height, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            table: new Baustein("table", "Tabelle", '<i class="fas fa-table"></i>', "table", BausteinRenderType.table, [
                { property: this.styleProperties.max_width, value: "" },
                { property: this.styleProperties.max_height, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ])
        };
        this.addBausteinSelectorItems = [
            { type: 1, title: "Überschriften", icon: '<i class="fas fa-heading"></i>', items: [this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6] },
            { type: 0, title: this.types.text.title, icon: this.types.text.icon, items: [this.types.text] },
            { type: 0, title: this.types.image.title, icon: this.types.image.icon, items: [this.types.image] },
            { type: 0, title: this.types.layout.title, icon: this.types.layout.icon, items: [this.types.layout] },
            { type: 0, title: this.types.table.title, icon: this.types.table.icon, items: [this.types.table] },
            { type: 1, title: "Sonstiges", icon: '<i class="fas fa-cubes"></i>', items: [this.types.html, this.types.script, this.types.shortcode] }
        ];
        this.assets = {
            baustein_image_placeholder_url: "/img/baustein-image-placeholder.png"
        };
        this.dom_id = dom_id;
        this.selected_baustein = null;
        this.selected_baustein_position = null;
        this.open_baustein_attributes__position = null;
        this.dom = {};
        this.dom.be = document.getElementById(this.dom_id);
        this.dom.page_styles = this.dom.be.appendChild(this.createElement("style", this.dom_id + '_page_styles', ""));
        this.dom.main = this.dom.be.appendChild(this.createElement("div", this.dom_id + "_main", "be_main"));
        this.dom.sidebar = this.dom.be.appendChild(this.createElement("div", this.dom_id + "_sidebar", "be_sidebar"));
        this.dom.underlay = this.dom.main.appendChild(this.createElement("div", this.dom_id + "_underlay", "be_underlay"));
        this.dom.content = this.dom.main.appendChild(this.createElement("div", this.dom_id + "_content", "be_content"));
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
        var self = this;
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
        this.addBaustein(this.types.h1, new Position(0, 0, 0));
        this.addBaustein(this.types.h2, new Position(1, 0, 0));
        this.addBaustein(this.types.layout, new Position(2, 0, 0));
        this.addBaustein(this.types.h1, new Position(2, 1, 0));
        this.addBaustein(this.types.h2, new Position(2, 1, 1));
    }
    BausteinEditor.prototype.getStylePropertyByName = function (name) {
        for (var i = 0; i < this.stylePropertiesArray.length; i++) {
            if (this.stylePropertiesArray[i].name === name) {
                return this.stylePropertiesArray[i];
            }
        }
        return new BausteinStyleProperty(name, "", "", "", []);
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
        var row_const = position.row;
        var depth_const = position.depth;
        var item_const = position.item;
        var selector_dom_id = this.dom_id + "_" + row_const + "_" + depth_const + "_" + item_const;
        var clz = "be_bausteinSelector_container";
        if (hide) {
            clz += " hidden";
        }
        var be_bausteinSelector_container = this.createElement("div", "", clz);
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
            if (showLayoutItems === false && itemset.type === 0 && (itemset.items[0].renderType === BausteinRenderType.layout || itemset.items[0].renderType === BausteinRenderType.table)) {
                return "continue";
            }
            be_bausteinSelector_layer_item = be_bausteinSelector_layer_item_container1.appendChild(this_1.createElement("button", "", "be_bausteinSelector_layer_item"));
            be_bausteinSelector_layer_item.type = "button";
            be_bausteinSelector_layer_item.dataset.category = i.toString();
            if (itemset.type === 0)
                be_bausteinSelector_layer_item.dataset.type = itemset.items[0].id.toString();
            title1 = be_bausteinSelector_layer_item.appendChild(this_1.createElement("div", "", "be_bausteinSelector_layer_item_title1"));
            title2 = be_bausteinSelector_layer_item.appendChild(this_1.createElement("div", "", "be_bausteinSelector_layer_item_title2"));
            if (itemset.type === 0) {
                title1.innerHTML = itemset.items[0].icon;
                title2.innerHTML = itemset.items[0].title;
            }
            else {
                title1.innerHTML = itemset.icon;
                title2.innerHTML = itemset.title;
            }
            var category = i;
            be_bausteinSelector_layer_item.addEventListener("click", function () {
                if (self.addBausteinSelectorItems[category].type === 0) {
                    self.addBaustein(self.addBausteinSelectorItems[category].items[0], { row: row_const, depth: depth_const, item: item_const });
                    self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                }
                else {
                    var types_array_1 = self.addBausteinSelectorItems[category].items;
                    be_bausteinSelector_layer_item_container2.innerHTML = "";
                    var _loop_2 = function () {
                        be_bausteinSelector_layer_item = be_bausteinSelector_layer_item_container2.appendChild(self.createElement("button", "", "be_bausteinSelector_layer_item"));
                        be_bausteinSelector_layer_item.type = "button";
                        be_bausteinSelector_layer_item.dataset.type = types_array_1[b].id;
                        be_bausteinSelector_layer_item.innerHTML =
                            '<div class="be_bausteinSelector_layer_item_title1">' + types_array_1[b].icon + '</div>'
                                + '<div class="be_bausteinSelector_layer_item_title2">' + types_array_1[b].title + '</div>';
                        var types_array_row = b;
                        be_bausteinSelector_layer_item.addEventListener("click", function () {
                            self.addBaustein(types_array_1[types_array_row], { row: row_const, depth: depth_const, item: item_const });
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
                var old_position = {
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
    };
    BausteinEditor.prototype.addBaustein = function (type, position) {
        console.log("addBaustein( type:", type, ", position:", position, " )");
        var baustein_entry = new Baustein(type.id, type.title, type.icon, type.tag, type.renderType, type.style);
        if (position.depth === 0) {
            var row_max = this.data.bausteine.length;
            baustein_entry.position = position;
            this.data.bausteine[row_max] = [[baustein_entry]];
            console.log("addBaustein() this.data.bausteine", this.data.bausteine);
            var to = this.data.bausteine.length - 1;
            for (var i = 0; i < to; i++) {
                if (this.data.bausteine[i][0][0].position.row >= position.row) {
                    this.data.bausteine[i][0][0].position.row++;
                }
            }
        }
        else {
            if (this.data.bausteine[position.row].length - 1 < position.depth) {
                this.data.bausteine[position.row][position.depth] = [];
            }
            var item_max = this.data.bausteine[position.row][position.depth].length;
            baustein_entry.position = position;
            this.data.bausteine[position.row][position.depth][item_max] = baustein_entry;
            console.log("addBaustein() this.data.bausteine", this.data.bausteine);
        }
        this.render();
        this.selectBaustein(position);
        console.log("addBaustein() this.data.bausteine", this.data.bausteine);
    };
    BausteinEditor.prototype.selectBaustein = function (position) {
        var _a;
        this.dom.content.querySelectorAll(".be_baustein").forEach(function (be_baustein) { be_baustein.classList.remove("selected"); });
        this.selected_baustein = document.getElementById(this.dom_id + '_be_baustein_item' + position.row + '_' + position.depth + '_' + position.item);
        (_a = this.selected_baustein) === null || _a === void 0 ? void 0 : _a.classList.add("selected");
        this.selected_baustein_position = position;
        this.open_baustein_attributes(position, this.data.bausteine[position.row][position.depth][position.item].renderType);
    };
    BausteinEditor.prototype.deleteBaustein = function (position) {
        console.log("deleteBaustein() position", position);
        var bausteine = [];
        for (var row = 0; row < this.data.bausteine.length; row++) {
            var new_row = bausteine.length;
            for (var depth = 0; depth < this.data.bausteine[row].length; depth++) {
                for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                    if (position.row === row && ((position.depth === depth && position.item === item) || position.depth === 0)) {
                        console.log("deleteBaustein", "row", row, "depth", depth, "item", item);
                    }
                    else {
                        var new_depth;
                        if (new_row === 0 || typeof bausteine[new_row] === "undefined") {
                            bausteine[new_row] = [[]];
                            new_depth = 0;
                        }
                        else {
                            new_depth = bausteine[new_row].length;
                        }
                        var new_item;
                        if (new_depth === 0 || typeof bausteine[new_row][new_depth] === "undefined") {
                            bausteine[new_row][new_depth] = [];
                            new_item = 0;
                        }
                        else {
                            new_item = bausteine[new_row][new_depth].length;
                        }
                        console.log("this.data.bausteine[row]", this.data.bausteine[row]);
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
        }
        else {
            var activeElement = document.activeElement;
            activeElement.blur();
        }
    };
    BausteinEditor.prototype.moveBaustein = function (position, position_new) {
        var position_new_const__row = position_new.row;
        console.log("moveBaustein()", "\nposition", position, "\nposition_new", position_new);
        console.log("0 moveBaustein() this.data.bausteine[0][0][0].position", this.data.bausteine[0][0][0].position);
        console.log("0 moveBaustein() this.data.bausteine[1][0][0].position", this.data.bausteine[1][0][0].position);
        if (position.row > position_new.row) {
            for (var r = position_new.row; r < this.data.bausteine.length; r++) {
                for (var d = 0; d < this.data.bausteine[r].length; d++) {
                    for (var i = 0; i < this.data.bausteine[r][d].length; i++) {
                        this.data.bausteine[r][d][i].position.row += 1;
                    }
                }
            }
        }
        console.info("position_new_const__row", position_new_const__row);
        this.data.bausteine[position.row][position.depth][position.item].position.row = position_new_const__row;
        console.log("1 moveBaustein() this.data.bausteine[0][0][0].position", this.data.bausteine[0][0][0].position);
        console.log("1 moveBaustein() this.data.bausteine[1][0][0].position", this.data.bausteine[1][0][0].position);
        this.render();
        console.log("2 this.data.bausteine", this.data.bausteine);
        console.log("2 moveBaustein() this.data.bausteine[0][0][0].position", this.data.bausteine[0][0][0].position);
        console.log("2 moveBaustein() this.data.bausteine[1][0][0].position", this.data.bausteine[1][0][0].position);
    };
    BausteinEditor.prototype.getBausteine = function () {
        var bausteine = this.data.bausteine.sort(function (a, b) {
            return a[0][0].position.row > b[0][0].position.row ? 1 : 0;
        });
        console.log("getBausteine bausteine", bausteine);
        for (var r = 0; r < bausteine.length; r++) {
            for (var d = 0; d < bausteine[r].length; d++) {
                for (var i = 0; i < bausteine[r][d].length; i++) {
                    bausteine[r][d][i].position.row = r;
                }
            }
            bausteine[r] = bausteine[r].sort(function (a, b) {
                return a[0].position.depth > b[0].position.depth ? 1 : 0;
            });
        }
        for (var r = 0; r < bausteine.length; r++) {
            for (var d = 0; d < bausteine[r].length; d++) {
                for (var i = 0; i < bausteine[r][d].length; i++) {
                    bausteine[r][d][i].position.depth = d;
                }
                console.log("bausteine[" + r + "][" + d + "]", bausteine[r][d]);
                bausteine[r][d] = bausteine[r][d].sort(function (a, b) {
                    return a.position.row > b.position.row ? 1 : 0;
                });
            }
        }
        for (var r = 0; r < bausteine.length; r++) {
            for (var d = 0; d < bausteine[r].length; d++) {
                for (var i = 0; i < bausteine[r][d].length; i++) {
                    bausteine[r][d][i].position.item = i;
                }
            }
        }
        return bausteine;
    };
    BausteinEditor.prototype.renderBaustein = function (baustein_entry, position) {
        var self = this;
        var row_const = position.row;
        var depth_const = position.depth;
        var item_const = position.item;
        var baustein_id = this.dom_id + '_be_baustein_item' + position.row + '_' + position.depth + '_' + position.item;
        var baustein_editor_id = baustein_id + '_editor';
        var be_baustein = this.createElement("div", baustein_id, "be_baustein");
        be_baustein.dataset.type = baustein_entry.id;
        be_baustein.draggable = true;
        console.log("this.selected_baustein_position", this.selected_baustein_position);
        console.log("position", position);
        if (this.selected_baustein_position !== null
            && this.selected_baustein_position.row === position.row
            && this.selected_baustein_position.depth === position.depth
            && this.selected_baustein_position.item === position.item) {
            be_baustein.classList.add("selected");
        }
        for (var a = 0; a < baustein_entry.style.length; a++) {
            var element = baustein_entry.style[a];
            if (element.value !== "") {
                var property_name = element.property.name;
                be_baustein.style[property_name] = element.value;
            }
        }
        var baustein_indicator = be_baustein.appendChild(this.createElement("label", "", "baustein_indicator"));
        baustein_indicator.innerHTML = baustein_entry.icon + " " + baustein_entry.title;
        baustein_indicator.addEventListener("click", function () {
            self.selectBaustein({ row: row_const, depth: depth_const, item: item_const, });
        }, false);
        switch (baustein_entry.renderType) {
            case BausteinRenderType.layout: break;
            case BausteinRenderType.table: break;
            case BausteinRenderType.image:
                var image = be_baustein.appendChild(this.createElement("img", baustein_editor_id, "be_baustein_item"));
                image.dataset.src = baustein_entry.content;
                if (baustein_entry.content === "") {
                    image.src = this.assets.baustein_image_placeholder_url;
                }
                else {
                    image.src = baustein_entry.content;
                }
                image.style.maxWidth = "100%";
                image.addEventListener("click", function () {
                    self.selectBaustein({ row: row_const, depth: depth_const, item: item_const, });
                });
                break;
            default:
                var editor;
                switch (baustein_entry.renderType) {
                    case BausteinRenderType.richtext:
                        editor = be_baustein.appendChild(this.createElement("div", baustein_editor_id, "be_baustein_item"));
                        editor.innerHTML = baustein_entry.content;
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
                            self.data.bausteine[row_const][depth_const][item_const].content = editor.innerHTML;
                        });
                        break;
                    default:
                        editor = be_baustein.appendChild(this.createElement("textarea", baustein_editor_id, "be_baustein_item"));
                        editor.innerHTML = baustein_entry.content;
                        editor.focus();
                        be_baustein.addEventListener("input", function () {
                            editor.style.height = '1px';
                            editor.style.height = editor.scrollHeight + 'px';
                            self.data.bausteine[row_const][depth_const][item_const].content = editor.value.split("<").join("&lt;").split(">").join("&gt;");
                        });
                        break;
                }
                editor.addEventListener("focusin", function () {
                    self.selectBaustein({ row: row_const, depth: depth_const, item: item_const, });
                });
                break;
        }
        be_baustein.addEventListener("click", function (e) {
            if (e.target.id === baustein_id) {
                self.selectBaustein({ row: row_const, depth: depth_const, item: item_const, });
            }
            else {
                return false;
            }
        }, false);
        be_baustein.addEventListener("dragstart", function (e) {
            if (e.dataTransfer === null) {
                console.error("baustein_item.addEventListener('dragstart'): e.dataTransfer is null");
            }
            else {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData("row", row_const.toString());
                e.dataTransfer.setData("depth", depth_const.toString());
                e.dataTransfer.setData("item", item_const.toString());
            }
        });
        return be_baustein;
    };
    BausteinEditor.prototype.render = function () {
        this.dom.content.innerHTML = "";
        this.data.bausteine = this.getBausteine();
        for (var row = 0; row < this.data.bausteine.length; row++) {
            var depth = 0, item = 0;
            var baustein_entry = this.data.bausteine[row][depth][item];
            this.dom.content.appendChild(this.addBausteinSelector({ row: row, depth: depth, item: item }, true, true));
            if (baustein_entry.renderType === BausteinRenderType.layout || baustein_entry.renderType === BausteinRenderType.table) {
                var be_baustein = this.dom.content.appendChild(this.renderBaustein(baustein_entry, { row: row, depth: depth, item: item }));
                depth = 1;
                console.log("baustein_entry.renderType", baustein_entry.renderType);
                if (baustein_entry.renderType === BausteinRenderType.table) {
                    if (this.data.bausteine[row].length > 1) {
                        var be_baustein_table = be_baustein.appendChild(this.createElement("table", "", ""));
                        for (var depth = 1; depth < this.data.bausteine[row].length; depth++) {
                            var be_baustein_row = be_baustein_table.appendChild(this.createElement("tr", "", ""));
                            for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                                var be_baustein_td1 = be_baustein_row.appendChild(this.createElement("td", "", ""));
                                be_baustein_td1.appendChild(this.addBausteinSelector({ row: row, depth: depth, item: item }, false, false));
                                var be_baustein_td2 = be_baustein_row.appendChild(this.createElement("td", "", ""));
                                var baustein_item = this.data.bausteine[row][depth][item];
                                be_baustein_td2.appendChild(this.renderBaustein(baustein_item, { row: row, depth: depth, item: item }));
                            }
                            var be_baustein_td3 = be_baustein_row.appendChild(this.createElement("td", "", ""));
                            be_baustein_td3.appendChild(this.addBausteinSelector({ row: row, depth: depth, item: item }, false, false));
                        }
                    }
                    be_baustein.appendChild(this.addBausteinSelector({ row: row, depth: depth, item: 0 }, false, false));
                }
                else {
                    if (this.data.bausteine[row].length > 1) {
                        for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                            be_baustein.appendChild(this.addBausteinSelector({ row: row, depth: depth, item: item }, false, false));
                            var baustein_item = this.data.bausteine[row][depth][item];
                            be_baustein.appendChild(this.renderBaustein(baustein_item, { row: row, depth: depth, item: item }));
                        }
                    }
                    be_baustein.appendChild(this.addBausteinSelector({ row: row, depth: depth, item: item }, false, false));
                }
            }
            else {
                this.dom.content.appendChild(this.renderBaustein(baustein_entry, { row: row, depth: depth, item: item }));
            }
        }
        var row = this.data.bausteine.length;
        this.dom.content.appendChild(this.addBausteinSelector({ row: row, depth: 0, item: 0 }, false, true));
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
        var style_string = ".be_baustein  {";
        for (var i = 0; i < this.data.page.style.length; i++) {
            var formfield = document.getElementById(this.dom_id + "_page_fc_" + this.data.page.style[i].property.name);
            this.data.page.style[i].value = formfield.value;
            style_string += this.data.page.style[i].property.name + ':' + this.data.page.style[i].value + ';';
        }
        style_string += '}';
        this.dom.page_styles.innerHTML = style_string;
        if (this.selected_baustein !== null && this.selected_baustein_position !== null) {
            var baustein = this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item];
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
                if (baustein.renderType === BausteinRenderType.layout) {
                    this.selected_baustein.style[nodes[i].name] = baustein.style[baustein_style_index].value;
                }
                else {
                    selected_baustein_editor.style[nodes[i].name] = baustein.style[baustein_style_index].value;
                }
            }
        }
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
    BausteinEditor.prototype.open_baustein_attributes = function (position, renderType) {
        if (this.open_baustein_attributes__position === null
            || (this.open_baustein_attributes__position.row !== position.row
                || this.open_baustein_attributes__position.depth !== position.depth
                || this.open_baustein_attributes__position.item !== position.item)) {
            var position_const_1 = { row: position.row, depth: position.depth, item: position.item };
            this.open_baustein_attributes__position = position_const_1;
            var self_1 = this;
            var current_baustein = this.data.bausteine[position_const_1.row][position_const_1.depth][position_const_1.item];
            console.log("open_baustein_attributes position_const", position_const_1);
            this.dom.sidebar_content__baustein_styles.innerHTML = "";
            this.dom.sidebar_content__baustein_misc.innerHTML = "";
            var be_layout_view = this.dom.sidebar_content__baustein_styles.appendChild(this.createElement("div", "", "be_layout_view"));
            var be_layout_view_margin = be_layout_view.appendChild(this.createElement("div", "", "be_layout_view_margin"));
            var be_layout_view_margin_indicator = be_layout_view_margin.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_margin_indicator.innerHTML = "margin";
            be_layout_view_margin.appendChild(this.layout_fc("margin-top", this.getItemFromArray(current_baustein.style, "margin-top", "0"), "-6px", null, null, ""));
            be_layout_view_margin.appendChild(this.layout_fc("margin-bottom", this.getItemFromArray(current_baustein.style, "margin-bottom", "0"), null, null, "-6px", ""));
            be_layout_view_margin.appendChild(this.layout_fc("margin-left", this.getItemFromArray(current_baustein.style, "margin-left", "0"), "", null, null, "-6px"));
            be_layout_view_margin.appendChild(this.layout_fc("margin-right", this.getItemFromArray(current_baustein.style, "margin-right", "0"), "", "-6px", null, null));
            var be_layout_view_border = be_layout_view_margin.appendChild(this.createElement("div", "", "be_layout_view_border"));
            var be_layout_view_border_indicator = be_layout_view_border.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_border_indicator.innerHTML = "border";
            be_layout_view_border.appendChild(this.layout_fc("border-top", this.getItemFromArray(current_baustein.style, "border-top", "0"), "-13px", null, null, ""));
            be_layout_view_border.appendChild(this.layout_fc("border-bottom", this.getItemFromArray(current_baustein.style, "border-bottom", "0"), null, null, "-13px", ""));
            be_layout_view_border.appendChild(this.layout_fc("border-left", this.getItemFromArray(current_baustein.style, "border-left", "0"), "", null, null, "-14px"));
            be_layout_view_border.appendChild(this.layout_fc("border-right", this.getItemFromArray(current_baustein.style, "border-right", "0"), "", "-14px", null, null));
            var be_layout_view_padding = be_layout_view_border.appendChild(this.createElement("div", "", "be_layout_view_padding"));
            var be_layout_view_padding_indicator = be_layout_view_padding.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_padding_indicator.innerHTML = "padding";
            be_layout_view_padding.appendChild(this.layout_fc("padding-top", this.getItemFromArray(current_baustein.style, "padding-top", "0"), "0px", null, null, ""));
            be_layout_view_padding.appendChild(this.layout_fc("padding-bottom", this.getItemFromArray(current_baustein.style, "padding-bottom", "0"), null, null, "0px", ""));
            be_layout_view_padding.appendChild(this.layout_fc("padding-left", this.getItemFromArray(current_baustein.style, "padding-left", "0"), "", null, null, "8px"));
            be_layout_view_padding.appendChild(this.layout_fc("padding-right", this.getItemFromArray(current_baustein.style, "padding-right", "0"), "", "8px", null, null));
            var be_layout_view_inner = be_layout_view_padding.appendChild(this.createElement("div", "", "be_layout_view_inner"));
            be_layout_view_inner.appendChild(this.layout_fc("max-width", this.getItemFromArray(current_baustein.style, "max-width", "auto"), null, null, null, null));
            be_layout_view_inner.appendChild(this.createElement("span", "", "be_layout_wh_delimiter")).innerHTML = " &times; ";
            be_layout_view_inner.appendChild(this.layout_fc("max-height", this.getItemFromArray(current_baustein.style, "max-height", "auto"), null, null, null, null));
            if (renderType === BausteinRenderType.image) {
                var baustein_image_row = this.dom.sidebar_content__baustein_styles.appendChild(this.formcontrol("baustein_image", "text", "image", 'Bildquelle (URL)', current_baustein.content, "", []));
                var baustein_image_form_control = baustein_image_row.getElementsByClassName('form-control')[0];
                baustein_image_form_control.addEventListener("change", function () {
                    self_1.data.bausteine[position_const_1.row][position_const_1.depth][position_const_1.item].content = this.value;
                    if (self_1.selected_baustein !== null) {
                        var selected_baustein_item = self_1.selected_baustein.querySelector(".be_baustein_item");
                        selected_baustein_item.src = this.value;
                    }
                });
            }
            for (var i = 0; i < current_baustein.style.length; i++) {
                var element = current_baustein.style[i];
                this.dom.sidebar_content__baustein_styles.appendChild(this.formcontrol("baustein", element.property.type, element.property.name, element.property.title, element.value, element.property.suffix, element.property.options));
            }
            var baustein_class_row = this.dom.sidebar_content__baustein_misc.appendChild(this.formcontrol("baustein_class", "text", "class", 'CSS Klasse <div style="font-size: 11px; margin-bottom: 2px;">(für Fortgeschrittene Nutzer)</div>', current_baustein.class, "", []));
            console.log("baustein_class_row", baustein_class_row);
            var baustein_delete_button = this.dom.sidebar_content__baustein_misc.appendChild(this.createElement("button", this.dom_id + '_deleteBaustein', "form-control bautstein-delete"));
            baustein_delete_button.innerHTML = "Baustein löschen";
            baustein_delete_button.type = "button";
            var baustein_class_form_control = baustein_class_row.getElementsByClassName('form-control')[0];
            baustein_class_form_control.addEventListener("change", function () {
                self_1.data.bausteine[position_const_1.row][position_const_1.depth][position_const_1.item].class = this.value;
            });
            baustein_delete_button.addEventListener("click", function () {
                self_1.close_baustein_attributes();
                console.log(self_1.data.bausteine);
                self_1.deleteBaustein(position_const_1);
                console.log(self_1.data.bausteine);
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
    BausteinEditor.prototype.close_baustein_attributes = function () {
        this.dom.sidebar_content__site.style.display = "";
        this.dom.sidebar_header_col__site.classList.add("active");
        this.dom.sidebar_content__baustein.style.display = "none";
        this.dom.sidebar_header_col__baustein.classList.remove("active");
        this.dom.sidebar_header_col__baustein.classList.add("disabled");
    };
    BausteinEditor.prototype.import = function (data) {
        this.data = data;
        this.render();
    };
    BausteinEditor.prototype.export = function () {
        var html = '<div class="be-article"></div>';
        return {
            data: this.data,
            html: html
        };
    };
    return BausteinEditor;
}());
//# sourceMappingURL=baustein_editor.js.map