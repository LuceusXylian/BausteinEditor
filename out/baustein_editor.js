"use strict";
var BausteinRenderType = {
    layout: 0,
    plaintext: 1,
    richtext: 2,
    image: 3,
};
var Position = (function () {
    function Position(row, depth, item) {
        this.row = row;
        this.depth = depth;
        this.item = item;
    }
    return Position;
}());
var Baustein = (function () {
    function Baustein(id, title, icon, tag, hasEndtag, renderType, style) {
        this.id = id;
        this.title = title;
        this.icon = icon;
        this.tag = tag;
        this.endtag = hasEndtag;
        this.renderType = renderType;
        console.log("baustein constructor renderType", this.renderType);
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
var BausteinStyle = (function () {
    function BausteinStyle(property, value) {
        this.property = property;
        this.value = value;
    }
    return BausteinStyle;
}());
var BausteinEditor = (function () {
    function BausteinEditor(dom_id) {
        this.dom_id = dom_id;
        this.selected_baustein = null;
        this.selected_baustein_position = null;
        this.open_baustein_attributes__position = new Position(-1, -1, -1);
        this.open_baustein_attributes__formcontrols = [];
        this.styleProperties = {
            font_family: { name: "font-family", title: "Schriftart", type: "string", suffix: "" },
            font_size: { name: "font-size", title: "Schriftgröße", type: "number", suffix: "rem" },
            font_weight: { name: "font-weight", title: "Textdicke", type: "select", suffix: "",
                options: [new Option("Normal", "normal"), new Option("Fett", "bold"), new Option("Fetter", "bolder"), new Option("Leichter", "lighter")] },
            text_decoration: { name: "text-decoration", title: "Textunterschreichung", type: "select", suffix: "",
                options: [new Option("Normal", "normal"), new Option("underline", "underline"), new Option("dotted", "dotted")] },
            font_style: { name: "font-style", title: "Textkursion", type: "select", suffix: "",
                options: [new Option("Normal", "normal"), new Option("italic", "italic"), new Option("oblique", "oblique")] },
            text_align: { name: "text-align", title: "Textausrichtung", type: "select", suffix: "",
                options: [new Option("Normal", "initial"), new Option("left", "left"), new Option("center", "center"), new Option("right", "right")] },
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
            { property: this.styleProperties.max_width, value: "" },
            { property: this.styleProperties.max_height, value: "" },
            { property: this.styleProperties.margin_top, value: "" },
            { property: this.styleProperties.margin_right, value: "" },
            { property: this.styleProperties.margin_bottom, value: "" },
            { property: this.styleProperties.margin_left, value: "" },
            { property: this.styleProperties.padding_top, value: "" },
            { property: this.styleProperties.padding_right, value: "" },
            { property: this.styleProperties.padding_bottom, value: "" },
            { property: this.styleProperties.padding_left, value: "" },
            { property: this.styleProperties.color, value: "" },
            { property: this.styleProperties.background_color, value: "" },
            { property: this.styleProperties.background_image, value: "" },
        ];
        this.types = {
            h1: new Baustein("h1", "Überschrift 1", 'H1', "h1", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.375rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            h2: new Baustein("h2", "Überschrift 2", 'H2', "h2", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.25rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            h3: new Baustein("h3", "Überschrift 3", 'H3', "h3", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.125rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            h4: new Baustein("h4", "Überschrift 4", 'H4', "h4", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.1rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            h5: new Baustein("h5", "Überschrift 5", 'H5', "h5", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            h6: new Baustein("h6", "Überschrift 6", 'H6', "h6", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "0.9rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            text: new Baustein("text", "Paragraph (Text)", '<i class="fas fa-paragraph"></i>', "p", true, BausteinRenderType.richtext, [
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
            html: new Baustein("html", "HTML", '<i class="fab fa-html5"></i>', "div", true, BausteinRenderType.plaintext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            script: new Baustein("script", "Script", '<i class="fas fa-code"></i>', "script", true, BausteinRenderType.plaintext, []),
            shortcode: new Baustein("shortcode", "Shortcode []", '<i class="fas fa-code"></i>', "span", true, BausteinRenderType.plaintext, []),
            picture: new Baustein("picture", "Bild", '<i class="fas fa-image"></i>', "img", false, BausteinRenderType.image, []),
            layout: new Baustein("layout", "Layout", '<i class="fas fa-layer-group" style="transform: rotate(90deg);"></i>', "div", true, BausteinRenderType.layout, layout_styles),
            table: new Baustein("table", "Tabelle", '<i class="fas fa-table"></i>', "table", true, BausteinRenderType.layout, layout_styles)
        };
        this.bausteinSelector = [
            { type: 1, title: "Überschriften", icon: '<i class="fas fa-heading"></i>', items: [this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6] },
            { type: 0, baustein: this.types.text },
            { type: 0, baustein: this.types.picture },
            { type: 0, baustein: this.types.layout },
            { type: 0, baustein: this.types.table },
            { type: 1, title: "Sonstiges", icon: '<i class="fas fa-cubes"></i>', items: [this.types.html, this.types.script, this.types.shortcode] }
        ];
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
    }
    BausteinEditor.prototype.createElement = function (type, id, _class) {
        var element = document.createElement(type);
        if (id !== "")
            element.id = id;
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
            var itemset = this_1.bausteinSelector[i];
            if (showLayoutItems === false && itemset.type === 0 && itemset.baustein.renderType === BausteinRenderType.layout) {
                return "continue";
            }
            be_bausteinSelector_layer_item = be_bausteinSelector_layer_item_container1.appendChild(this_1.createElement("button", "", "be_bausteinSelector_layer_item"));
            be_bausteinSelector_layer_item.type = "button";
            be_bausteinSelector_layer_item.dataset.category = i.toString();
            if (itemset.type === 0)
                be_bausteinSelector_layer_item.dataset.type = itemset.baustein.id.toString();
            title1 = be_bausteinSelector_layer_item.appendChild(this_1.createElement("div", "", "be_bausteinSelector_layer_item_title1"));
            title2 = be_bausteinSelector_layer_item.appendChild(this_1.createElement("div", "", "be_bausteinSelector_layer_item_title2"));
            if (itemset.type === 0) {
                title1.innerHTML = itemset.baustein.icon;
                title2.innerHTML = itemset.baustein.title;
            }
            else {
                title1.innerHTML = itemset.icon;
                title2.innerHTML = itemset.title;
            }
            var category = i;
            be_bausteinSelector_layer_item.addEventListener("click", function () {
                if (self.bausteinSelector[category].type === 0) {
                    self.addBaustein(self.bausteinSelector[category].baustein.id, { row: row_const, depth: depth_const, item: item_const });
                    self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                }
                else {
                    var types_array_1 = self.bausteinSelector[category].items;
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
                            self.addBaustein(types_array_1[types_array_row].id, { row: row_const, depth: depth_const, item: item_const });
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
        for (var i = 0; i < this.bausteinSelector.length; i++) {
            _loop_1();
        }
        be_bausteinSelector.addEventListener("click", function () { self.bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2); });
        be_bausteinSelector_layer_close.addEventListener("click", function () { self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer); });
        return be_bausteinSelector_container;
    };
    BausteinEditor.prototype.addBaustein = function (type, position) {
        console.log("addBaustein() type", type);
        console.log("addBaustein() position", position);
        if (type !== "") {
            var baustein_entry = new Baustein(this.types[type].id, this.types[type].title, this.types[type].icon, this.types[type].tag, this.types[type].hasEndtag, this.types[type].renderType, this.types[type].style);
            if (position.depth === 0) {
                var row_max = this.data.bausteine.length;
                baustein_entry.position = position;
                this.data.bausteine[row_max] = [[baustein_entry]];
                this.selected_baustein_position = position;
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
                this.selected_baustein_position = position;
                console.log("addBaustein() this.data.bausteine", this.data.bausteine);
                var to = this.data.bausteine.length - 1;
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
        }
        else {
            return false;
        }
    };
    BausteinEditor.prototype.selectBaustein = function (position) {
        var _a, _b;
        (_a = this.selected_baustein) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
        this.selected_baustein = document.getElementById(this.dom_id + '_be_baustein_item' + position.row + '_' + position.depth + '_' + position.item);
        (_b = this.selected_baustein) === null || _b === void 0 ? void 0 : _b.classList.add("selected");
        this.selected_baustein_position = position;
        this.open_baustein_attributes(position);
    };
    BausteinEditor.prototype.deleteBaustein = function (position) {
        console.log("deleteBaustein() position", position);
        var bausteine = [];
        for (var row = 0; row < this.data.bausteine.length; row++) {
            var new_row = bausteine.length;
            for (var depth = 0; depth < this.data.bausteine[row].length; depth++) {
                for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                    console.log("row", row, "depth", depth, "item", item);
                    if (row !== position.row || depth !== position.depth || item !== position.item) {
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
            return a[0][0].position.row > b[0][0].position.row;
        });
        return bausteine;
    };
    BausteinEditor.prototype.renderBaustein = function (baustein_entry, position) {
        var self = this;
        var const_row = position.row;
        var const_depth = position.depth;
        var const_item = position.item;
        var baustein_id = this.dom_id + '_be_baustein_item' + position.row + '_' + position.depth + '_' + position.item;
        var baustein_editor_id = baustein_id + '_editor';
        var be_baustein = this.createElement("label", baustein_id, "be_baustein");
        be_baustein.dataset.type = baustein_entry.id;
        be_baustein.draggable = true;
        if (this.selected_baustein_position !== null && this.selected_baustein_position.row === position.row) {
            be_baustein.classList.add("selected");
        }
        for (var a = 0; a < baustein_entry.style.length; a++) {
            var element = baustein_entry.style[a];
            if (element.value !== "") {
                be_baustein.style[element.property.name] = element.value;
            }
        }
        var baustein_indicator = be_baustein.appendChild(this.createElement("label", "", "baustein_indicator"));
        baustein_indicator.htmlFor = baustein_id;
        baustein_indicator.innerHTML = "<b>" + baustein_entry.icon + "</b> " + baustein_entry.title;
        var editor;
        switch (baustein_entry.renderType) {
            default:
                editor = be_baustein.appendChild(this.createElement("textarea", baustein_editor_id, "be_baustein_item"));
                editor.innerHTML = baustein_entry.content;
                editor.focus();
                be_baustein.addEventListener("input", function () {
                    editor.style.height = '1px';
                    editor.style.height = editor.scrollHeight + 'px';
                    self.data.bausteine[const_row][const_depth][const_item].content = editor.value.split("<").join("&lt;").split(">").join("&gt;");
                });
                break;
            case BausteinRenderType.richtext:
                editor = be_baustein.appendChild(this.createElement("div", baustein_editor_id, "be_baustein_item"));
                editor.innerHTML = baustein_entry.content;
                editor.style.minHeight = "100px";
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
                editor.addEventListener("input", function () {
                    editor.style.height = '1px';
                    editor.style.height = editor.scrollHeight + 'px';
                    self.data.bausteine[const_row][const_depth][const_item].content = editor.innerHTML;
                });
                break;
        }
        editor.addEventListener("focusin", function () {
            self.selectBaustein({ row: const_row, depth: const_depth, item: const_item, });
        });
        editor.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        editor.addEventListener("dragstart", function (e) {
            if (e.dataTransfer === null) {
                console.error("baustein_item.addEventListener('dragstart'): e.dataTransfer is null");
            }
            else {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData("row", const_row.toString());
                e.dataTransfer.setData("depth", const_depth.toString());
                e.dataTransfer.setData("item", const_item.toString());
            }
        });
        editor.addEventListener("drop", function (e) {
            e.preventDefault();
            if (e.dataTransfer === null) {
                console.error("baustein_item.addEventListener('drop'): e.dataTransfer is null");
            }
            else {
                var old_position = {
                    row: parseInt(e.dataTransfer.getData("row")),
                    depth: parseInt(e.dataTransfer.getData("depth")),
                    item: parseInt(e.dataTransfer.getData("item")),
                };
                var new_position = self.data.bausteine[const_row][const_depth][const_item].position;
                console.log("old position", old_position);
                console.log("new position", new_position);
                if (old_position.row !== new_position.row) {
                    self.moveBaustein(old_position, new_position);
                }
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
            if (baustein_entry.renderType === BausteinRenderType.layout) {
                var baustein_id = this.dom_id + '_be_baustein_item' + row + '_' + depth + '_' + item;
                var be_baustein = this.dom.content.appendChild(this.createElement("div", baustein_id, "be_baustein"));
                if (this.selected_baustein_position !== null && this.selected_baustein_position.row === row) {
                    be_baustein.classList.add("selected");
                }
                be_baustein.dataset.type = baustein_entry.id;
                be_baustein.draggable = true;
                for (var a = 0; a < baustein_entry.style.length; a++) {
                    var element = baustein_entry.style[a];
                    if (element.value !== "") {
                        be_baustein.style[element.property.name] = element.value;
                    }
                }
                var baustein_indicator = be_baustein.appendChild(this.createElement("label", "", "baustein_indicator"));
                baustein_indicator.htmlFor = baustein_id;
                baustein_indicator.innerHTML = "<b>" + baustein_entry.icon + "</b> " + baustein_entry.title;
                depth = 1;
                if (this.data.bausteine[row].length > 1) {
                    for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                        be_baustein.appendChild(this.addBausteinSelector({ row: row, depth: depth, item: item }, false, false));
                        var baustein_item = this.data.bausteine[row][depth][item];
                        be_baustein.appendChild(this.renderBaustein(baustein_item, { row: row, depth: depth, item: item }));
                    }
                }
                be_baustein.appendChild(this.addBausteinSelector({ row: row, depth: depth, item: item }, false, false));
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
            var formfield = document.getElementById(this.dom_id + "_page_content_row_" + this.data.page.style[i].property.name);
            this.data.page.style[i].value = formfield.value;
            style_string += this.data.page.style[i].property.name + ':' + this.data.page.style[i].value + ';';
        }
        style_string += '}';
        this.dom.page_styles.innerHTML = style_string;
        if (this.selected_baustein !== null && this.selected_baustein_position !== null) {
            var selected_baustein_editor = this.selected_baustein.lastChild;
            for (var i = 0; i < this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item].style.length; i++) {
                var baustein = this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item];
                var formcontrol_item = document.getElementById(this.dom_id + "_baustein_content_row_" + baustein.style[i].property.name);
                baustein.style[i].value = formcontrol_item === null || formcontrol_item === void 0 ? void 0 : formcontrol_item.value;
                console.log('baustein.renderType', i, baustein.renderType);
                if (baustein.renderType === BausteinRenderType.layout) {
                    console.log('this.selected_baustein', i, this.selected_baustein);
                    console.log('element', i, baustein);
                    this.selected_baustein.style[baustein.style[i].property.name] = baustein.style[i].value;
                }
                else {
                    selected_baustein_editor.style[baustein.style[i].property.name] = baustein.style[i].value;
                }
            }
        }
    };
    BausteinEditor.prototype.formcontrol = function (domArk, type, name, title, value, suffix, options) {
        var self = this;
        var fc_dom_id = (this.dom_id + '_' + domArk + '_content_row_' + name);
        var be_sidebar_content_row = this.createElement("div", "", "be_sidebar_content_row");
        var label = be_sidebar_content_row.appendChild(this.createElement("label", "", ""));
        label.htmlFor = fc_dom_id;
        label.innerHTML = title;
        var form_control_container = be_sidebar_content_row.appendChild(this.createElement("div", "", "form-control-container"));
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
                form_control.addEventListener("change", function () { formcontrol_number_1(0); self.apply_styles(); });
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
        if (type !== "number")
            form_control.addEventListener("change", function () { self.apply_styles(); });
        if (type === "number") {
        }
        else {
            form_control.addEventListener("change", function () { self.apply_styles(); });
        }
        return be_sidebar_content_row;
    };
    BausteinEditor.prototype.open_baustein_attributes = function (position) {
        if (this.open_baustein_attributes__position.row !== position.row
            || this.open_baustein_attributes__position.depth !== position.depth
            || this.open_baustein_attributes__position.item !== position.item) {
            this.open_baustein_attributes__position = position;
            var position_const_1 = { row: position.row, depth: position.depth, item: position.item };
            console.log("open_baustein_attributes position_const", position_const_1);
            this.dom.sidebar_content__baustein.innerHTML = "";
            for (var i = 0; i < this.data.bausteine[position_const_1.row][position_const_1.depth][position_const_1.item].style.length; i++) {
                var element = this.data.bausteine[position_const_1.row][position_const_1.depth][position_const_1.item].style[i];
                this.dom.sidebar_content__baustein.appendChild(this.formcontrol("baustein", element.property.type, element.property.name, element.property.title, element.value, element.property.suffix, element.property.options));
            }
            var baustein_class_row = this.dom.sidebar_content__baustein.appendChild(this.formcontrol("baustein_class", "text", "class", 'CSS Klasse <div style="font-size: 11px; margin-bottom: 2px;">(für Fortgeschrittene Nutzer)</div>', this.data.bausteine[position_const_1.row][position_const_1.depth][position_const_1.item].class, "", []));
            console.log("baustein_class_row", baustein_class_row);
            var baustein_delete_button = this.dom.sidebar_content__baustein.appendChild(this.createElement("button", this.dom_id + '_deleteBaustein', "form-control bautstein-delete"));
            baustein_delete_button.innerHTML = "Baustein löschen";
            baustein_delete_button.type = "button";
            var self_1 = this;
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
    BausteinEditor.prototype.close_baustein_attributes = function () {
        this.dom.sidebar_content__site.style.display = "";
        this.dom.sidebar_header_col__site.classList.add("active");
        this.dom.sidebar_content__baustein.style.display = "none";
        this.dom.sidebar_header_col__baustein.classList.remove("active");
        this.dom.sidebar_header_col__baustein.classList.add("disabled");
    };
    return BausteinEditor;
}());
//# sourceMappingURL=baustein_editor.js.map