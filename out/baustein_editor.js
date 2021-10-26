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
        ];
        this.types = {
            h1: new Baustein("h1", "Überschrift 1", 'H1', "h1", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.375rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
            ]),
            h2: new Baustein("h2", "Überschrift 2", 'H2', "h2", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.25rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
            ]),
            h3: new Baustein("h3", "Überschrift 3", 'H3', "h3", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.125rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
            ]),
            h4: new Baustein("h4", "Überschrift 4", 'H4', "h4", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1.1rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
            ]),
            h5: new Baustein("h5", "Überschrift 5", 'H5', "h5", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "1rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
            ]),
            h6: new Baustein("h6", "Überschrift 6", 'H6', "h6", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "0.9rem" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
            ]),
            text: new Baustein("text", "Paragraph (Text)", '<i class="fas fa-paragraph"></i>', "p", true, BausteinRenderType.richtext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
            ]),
            html: new Baustein("html", "HTML", '<i class="fab fa-html5"></i>', "div", true, BausteinRenderType.plaintext, [
                { property: this.styleProperties.font_family, value: "" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
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
            this.dom.sidebar_header_col__site.appendChild(this.formcontroll("page", element.property.type, element.property.name, element.property.title, element.value, element.property.suffix, element.property.options));
        }
        this.be_bausteinSelector_isOpen = false;
        this.apply_styles();
        var self = this;
        this.formcontroll_events();
        var be_sidebar_header_col_function = function (toSiteCol) {
            if (toSiteCol) {
                self.dom.sidebar_header_col__site.classList.add("active");
                self.dom.sidebar_header_col__baustein.classList.remove("active");
                self.dom.sidebar_content__site.style.display = "";
                self.dom.sidebar_content__baustein.style.display = "none";
            }
            else {
                if (self.dom.sidebar_header_col__baustein.classList.contains("disabled") === false) {
                    self.dom.sidebar_header_col__site.classList.remove("active");
                    self.dom.sidebar_header_col__baustein.classList.add("active");
                    self.dom.sidebar_content__site.style.display = "none";
                    self.dom.sidebar_content__baustein.style.display = "";
                }
            }
        };
        this.dom.sidebar_header_col__site.addEventListener("click", function () { be_sidebar_header_col_function(true); });
        this.dom.sidebar_header_col__baustein.addEventListener("click", function () { be_sidebar_header_col_function(false); });
        this.render();
    }
    BausteinEditor.prototype.createElement = function (type, id, _class) {
        var element = document.createElement(type);
        element.id = id;
        element.className = _class;
        return element;
    };
    BausteinEditor.prototype.addBausteinSelector = function (position, hide) {
        var row_const = position.row;
        var depth_const = position.depth;
        var item_const = position.item;
        var selector_dom_id = this.dom_id + "_" + row_const + "_" + depth_const + "_" + item_const;
        var clz = "be_bausteinSelector_container";
        if (hide) {
            clz += " hidden";
        }
        var content = '<div class="' + clz + '">'
            + '<button type="button" id="' + selector_dom_id + '_bausteinSelector" class="be_bausteinSelector"><i class="fas fa-plus-circle"></i></button>'
            + '<div id="' + selector_dom_id + '_bausteinSelector_layer" class="be_bausteinSelector_layer" style="display: none;">';
        content += '<div class="be_bausteinSelector_layer_title_container">';
        content += '<div class="be_bausteinSelector_layer_title">Neuen Baustein hinzufügen</div>';
        content += '<button type="button" id="' + selector_dom_id + 'bausteinSelector_layer_close" class="be_bausteinSelector_layer_close">&times;</button>';
        content += '</div>';
        content += '<div id="' + selector_dom_id + '_bausteinSelector_layer_item_container1" class="be_bausteinSelector_layer_item_container">';
        for (var i = 0; i < this.bausteinSelector.length; i++) {
            var element = this.bausteinSelector[i];
            if (element.type === 0) {
                content += '<button type="button" class="be_bausteinSelector_layer_item" data-category="' + i + '" data-type="' + element.baustein.id + '">';
                content += '<div class="be_bausteinSelector_layer_item_title1">' + element.baustein.icon + '</div>';
                content += '<div class="be_bausteinSelector_layer_item_title2">' + element.baustein.title + '</div>';
                content += '</button>';
            }
            else {
                content += '<button type="button" class="be_bausteinSelector_layer_item" data-category="' + i + '">';
                content += '<div class="be_bausteinSelector_layer_item_title1">' + element.icon + '</i></div>';
                content += '<div class="be_bausteinSelector_layer_item_title2">' + element.title + '</div>';
                content += '</button>';
            }
        }
        content += '</div>';
        content += '<div id="' + selector_dom_id + '_bausteinSelector_layer_item_container2" class="be_bausteinSelector_layer_item_container">';
        content += '</div>';
        content += '</div>';
        content += '</div>';
        return content;
    };
    BausteinEditor.prototype.addBausteinSelectorEvents = function (position) {
        var _a;
        var row_const = position.row;
        var depth_const = position.depth;
        var item_const = position.item;
        var selector_dom_id = this.dom_id + "_" + row_const + "_" + depth_const + "_" + item_const;
        var be_bausteinSelector = document.getElementById(selector_dom_id + "_bausteinSelector");
        var be_bausteinSelector_layer = document.getElementById(selector_dom_id + "_bausteinSelector_layer");
        var be_bausteinSelector_layer_items = document.querySelectorAll("#" + selector_dom_id + "_bausteinSelector_layer .be_bausteinSelector_layer_item");
        var be_bausteinSelector_layer_item_container1 = document.getElementById(selector_dom_id + "_bausteinSelector_layer_item_container1");
        var be_bausteinSelector_layer_item_container2 = document.getElementById(selector_dom_id + "_bausteinSelector_layer_item_container2");
        var self = this;
        be_bausteinSelector.addEventListener("click", function () { self.bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2); });
        this.dom.sidebar.addEventListener("click", function () { if (self.be_bausteinSelector_isOpen)
            self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer); });
        (_a = document.getElementById(selector_dom_id + "bausteinSelector_layer_close")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer); });
        var _loop_1 = function () {
            var element = be_bausteinSelector_layer_items[i];
            element.addEventListener("click", function () {
                var category = parseInt(element.dataset.category);
                if (self.bausteinSelector[category].type === 0) {
                    self.addBaustein(self.bausteinSelector[category].baustein.id, { row: row_const, depth: depth_const, item: item_const });
                    self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                }
                else {
                    var types_array_1 = self.bausteinSelector[category].items;
                    be_bausteinSelector_layer_item_container1.style.display = "none";
                    be_bausteinSelector_layer_item_container2.style.display = "";
                    var container2_content = '';
                    for (var b = 0; b < types_array_1.length; b++) {
                        container2_content += '<button type="button" class="be_bausteinSelector_layer_item" data-type="' + types_array_1[b].id + '">';
                        container2_content += '<div class="be_bausteinSelector_layer_item_title1">' + types_array_1[b].icon + '</div>';
                        container2_content += '<div class="be_bausteinSelector_layer_item_title2">' + types_array_1[b].title + '</div>';
                        container2_content += '</button>';
                    }
                    be_bausteinSelector_layer_item_container2.innerHTML = container2_content;
                    var container2_items = be_bausteinSelector_layer_item_container2.querySelectorAll(".be_bausteinSelector_layer_item");
                    var _loop_2 = function () {
                        var types_array_row = c;
                        container2_items[c].addEventListener("click", function () {
                            self.addBaustein(types_array_1[types_array_row].id, { row: row_const, depth: depth_const, item: item_const });
                            self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                        });
                    };
                    for (var c = 0; c < container2_items.length; c++) {
                        _loop_2();
                    }
                }
            });
        };
        for (var i = 0; i < be_bausteinSelector_layer_items.length; i++) {
            _loop_1();
        }
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
            this.open_baustein_attributes(position);
            console.log("addBaustein() this.data.bausteine", this.data.bausteine);
            return true;
        }
        else {
            return false;
        }
    };
    BausteinEditor.prototype.selectBaustein = function (position) {
        var _a, _b;
        (_a = document.getElementById(this.dom_id + '_be_baustein_item' + this.selected_baustein_position.row + '_' + this.selected_baustein_position.depth + '_' + this.selected_baustein_position.item)) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
        (_b = document.getElementById(this.dom_id + '_be_baustein_item' + position.row + '_' + position.depth + '_' + position.item)) === null || _b === void 0 ? void 0 : _b.classList.add("selected");
        this.selected_baustein_position = position;
        this.open_baustein_attributes(position);
    };
    BausteinEditor.prototype.deleteBaustein = function (position) {
        console.log("deleteBaustein() position", position);
        this.data.bausteine[position.row][0][0].position.row = -1;
        var bausteine = [];
        for (var row = 0; row < this.data.bausteine.length; row++) {
            var new_row = bausteine.length;
            if (row === position.row) {
                for (var depth = 0; depth < this.data.bausteine.length; depth++) {
                    if (row === position.row) {
                        for (var item = 0; item < this.data.bausteine.length; item++) {
                        }
                    }
                    else {
                        bausteine[new_row] = this.data.bausteine[row];
                    }
                }
            }
            else {
                bausteine[new_row] = this.data.bausteine[row];
            }
        }
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
        return this.data.bausteine.sort(function (a, b) { return (a[0][0].row < b[0][0].row); });
    };
    BausteinEditor.prototype.renderBaustein = function (baustein_entry, position) {
        var baustein_id = this.dom_id + '_be_baustein_item' + position.row + '_' + position.depth + '_' + position.item;
        var baustein_editor_id = baustein_id + '_editor';
        var baustein_entry_style = "";
        for (var a = 0; a < baustein_entry.style.length; a++) {
            var element = baustein_entry.style[a];
            if (element.value !== "") {
                baustein_entry_style += element.property.name + ":" + element.value + ";";
            }
        }
        var content = '<label id="' + baustein_id + '" class="be_baustein';
        if (this.selected_baustein_position.row === position.row) {
            content += ' selected';
        }
        content += '" data-type="' + baustein_entry.id + '" draggable="true" style="' + baustein_entry_style + '">';
        content += '<label for="' + baustein_id + '" class="baustein_indicator">' + baustein_entry.title + '</label>';
        switch (baustein_entry.renderType) {
            default:
                content += '<textarea id="' + baustein_editor_id + '" class="be_baustein_item" placeholder="' + baustein_entry.title + '">' + baustein_entry.content + '</textarea>';
                break;
            case BausteinRenderType.richtext:
                content += '<div id="' + baustein_editor_id + '" style="min-height: 100px;">' + baustein_entry.content + '</div>';
                break;
        }
        content += '</label>';
        return content;
    };
    BausteinEditor.prototype.renderBausteinEvents = function (baustein_entry, position) {
        var self = this;
        var const_row = position.row;
        var const_depth = position.depth;
        var const_item = position.item;
        var baustein_id = this.dom_id + '_be_baustein_item' + position.row + '_' + position.depth + '_' + position.item;
        var baustein_editor_id = baustein_id + '_editor';
        var baustein_item = document.getElementById(baustein_id);
        if (baustein_item === null) {
            console.error("renderBausteinEvents() Baustein expected, but not found. Well bad.");
            return false;
        }
        var editor = document.getElementById(baustein_editor_id);
        console.log("baustein_entry.renderType", baustein_entry.renderType);
        switch (baustein_entry.renderType) {
            default:
                editor.focus();
                baustein_item === null || baustein_item === void 0 ? void 0 : baustein_item.addEventListener("input", function () {
                    editor.style.height = '1px';
                    editor.style.height = editor.scrollHeight + 'px';
                    self.data.bausteine[const_row][const_depth][const_item].content = editor.value.split("<").join("&lt;").split(">").join("&gt;");
                });
                break;
            case BausteinRenderType.richtext:
                editor.dataset.formatblock = 0;
                editor.dataset.fontname = 0;
                editor.dataset.justifyleft = 0;
                editor.dataset.justifycenter = 0;
                editor.dataset.justifyright = 0;
                editor.dataset.insertorderedlist = 0;
                editor.dataset.insertunorderedlist = 0;
                editor.dataset.indent = 0;
                editor.dataset.outdent = 0;
                TinyEditor.transformToEditor(editor);
                baustein_item.addEventListener("input", function () {
                    baustein_item.style.height = '1px';
                    baustein_item.style.height = baustein_item.scrollHeight + 'px';
                    self.data.bausteine[const_row][const_depth][const_item].content = editor.innerHTML;
                });
                break;
        }
        baustein_item.addEventListener("focusin", function () {
            self.selectBaustein({ row: const_row, depth: const_depth, item: const_item, });
        });
        baustein_item.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        baustein_item.addEventListener("dragstart", function (e) {
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
        baustein_item.addEventListener("drop", function (e) {
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
    };
    BausteinEditor.prototype.render = function () {
        this.dom.content.innerHTML = "";
        this.data.bausteine = this.getBausteine();
        for (var row = 0; row < this.data.bausteine.length; row++) {
            var depth = 0, item = 0;
            var baustein_entry = this.data.bausteine[row][depth][item];
            this.dom.content.insertAdjacentHTML('beforeend', this.addBausteinSelector({ row: row, depth: depth, item: item }, true));
            this.addBausteinSelectorEvents({ row: row, depth: depth, item: item });
            if (baustein_entry.renderType === BausteinRenderType.layout) {
                var baustein_id = this.dom_id + '_be_baustein_item' + row + '_' + depth + '_' + item;
                var baustein_entry_style = "";
                for (var a = 0; a < baustein_entry.style.length; a++) {
                    var element = baustein_entry.style[a];
                    if (element.value !== "") {
                        baustein_entry_style += element.property.name + ":" + element.value + ";";
                    }
                }
                var content = '<div id="' + baustein_id + '" class="be_baustein';
                if (this.selected_baustein_position.row === row) {
                    content += ' selected';
                }
                content += '" data-type="' + baustein_entry.id + '" draggable="true" style="' + baustein_entry_style + '">';
                content += '<label for="' + baustein_id + '" class="baustein_indicator">' + baustein_entry.title + '</label>';
                depth = 1;
                if (this.data.bausteine[row].length > 1) {
                    for (var item = 0; item < this.data.bausteine[row][depth].length; item++) {
                        var baustein_item = this.data.bausteine[row][depth][item];
                        content += this.renderBaustein(baustein_item, { row: row, depth: depth, item: item });
                    }
                }
                content += this.addBausteinSelector({ row: row, depth: depth, item: item }, false);
                content += '</div>';
                this.dom.content.insertAdjacentHTML('beforeend', content);
                this.addBausteinSelectorEvents({ row: row, depth: depth, item: item });
            }
            else {
                var content = this.renderBaustein(baustein_entry, { row: row, depth: depth, item: item });
                this.dom.content.insertAdjacentHTML('beforeend', content);
                this.renderBausteinEvents(baustein_entry, { row: row, depth: depth, item: item });
            }
        }
        var row = this.data.bausteine.length;
        this.dom.content.insertAdjacentHTML('beforeend', this.addBausteinSelector({ row: row, depth: 0, item: 0 }, false));
        this.addBausteinSelectorEvents({ row: row, depth: 0, item: 0 });
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
        var _a;
        var style_string = ".be_baustein  {";
        for (var i = 0; i < this.data.page.style.length; i++) {
            var formfield = document.getElementById(this.dom_id + "_page_content_row_" + this.data.page.style[i].property.name);
            this.data.page.style[i].value = formfield.value;
            style_string += this.data.page.style[i].property.name + ':' + this.data.page.style[i].value + ';';
        }
        style_string += '}';
        this.dom.page_styles.innerHTML = style_string;
        if (typeof this.selected_baustein_position !== "undefined") {
            var selected_baustein = document.querySelector(this.dom_id + " .be_baustein.selected");
            for (var i = 0; i < this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item].style.length; i++) {
                var element = this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item].style[i];
                element.value = (_a = document.getElementById(this.dom_id + "_baustein_content_row_" + element.property.name)) === null || _a === void 0 ? void 0 : _a.innerHTML;
                selected_baustein.style[element.property.name] = element.value;
            }
        }
    };
    BausteinEditor.prototype.formcontroll = function (domArk, type, name, title, value, suffix, options) {
        var fc_dom_id = (this.dom_id + '_' + domArk + '_content_row_' + name);
        var be_sidebar_content_row = this.createElement("div", "", "be_sidebar_content_row");
        var content = '<div class="be_sidebar_content_row">';
        content += '<label for="' + fc_dom_id + '">' + title + '</label>';
        content += '<div class="form-controll-container';
        if (type === "number") {
            content += ' number';
        }
        content += '">';
        if (type === "select") {
            content += '<select id="' + fc_dom_id + '" class="form-controll" name="' + name + '">';
            for (var i = 0; i < options.length; i++) {
                content += '<option value="' + options[i].value + '"';
                if (options[i].value == value) {
                    content += " selected";
                }
                content += '>' + options[i].text + '</option>';
            }
            content += '</select>';
        }
        else {
            content += '<input type="text" id="' + fc_dom_id + '" class="form-controll" name="' + name + '" value="' + value + '"';
            if (type === "number") {
                content += ' data-suffix="' + suffix + '">';
                content += '<div class="form-controll-container_up">⮝</div>';
                content += '<div class="form-controll-container_down">⮟</div>';
            }
            else {
                content += '>';
            }
        }
        content += '</div>';
        content += '</div>';
        return be_sidebar_content_row;
    };
    BausteinEditor.prototype.formcontroll_events = function () {
        var self = this;
        var dom_objects = this.dom.sidebar.querySelectorAll(".form-controll-container:not(.event)");
        for (var i = 0; i < dom_objects.length; i++) {
            var container_element = dom_objects[i];
            container_element.classList.add("event");
            var input_element_array = container_element.querySelectorAll(".form-controll");
            var _loop_3 = function (i_1) {
                var input_element = input_element_array[i_1];
                if (container_element.classList.contains("number")) {
                    var arrow_up_element = container_element.querySelector(".form-controll-container_up");
                    var arrow_down_element = container_element.querySelector(".form-controll-container_down");
                    var suffix_1 = input_element.dataset.suffix;
                    var formcontroll_number_1 = function (add) {
                        var num = parseFloat(input_element.val().replace(suffix_1, ""));
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
                        input_element.val(num.toString() + suffix_1);
                    };
                    input_element.addEventListener("change", function () { formcontroll_number_1(0); self.apply_styles(); });
                    input_element.addEventListener("keydown", function (e) {
                        var steps = e.shiftKey ? 10 : (e.ctrlKey ? 0.1 : 1);
                        var keyCode = e.which | e.keyCode;
                        if (keyCode === 38) {
                            formcontroll_number_1(steps);
                            self.apply_styles();
                            return false;
                        }
                        else if (keyCode === 40) {
                            formcontroll_number_1(-steps);
                            self.apply_styles();
                            return false;
                        }
                    });
                    arrow_up_element.addEventListener("click", function () { formcontroll_number_1(+1); self.apply_styles(); });
                    arrow_down_element.addEventListener("click", function () { formcontroll_number_1(-1); self.apply_styles(); });
                }
                else {
                    input_element.addEventListener("change", function () { self.apply_styles(); });
                }
            };
            for (var i_1 = 0; i_1 < input_element_array.length; i_1++) {
                _loop_3(i_1);
            }
        }
    };
    BausteinEditor.prototype.open_baustein_attributes = function (position) {
        var _a;
        var position_const = { row: position.row, depth: position.depth, item: position.item };
        var sidebar_content = "";
        for (var i = 0; i < this.data.bausteine[position_const.row][position_const.depth][position_const.item].style.length; i++) {
            var element = this.data.bausteine[position_const.row][position_const.depth][position_const.item].style[i];
            sidebar_content += this.formcontroll("baustein", element.property.type, element.property.name, element.property.title, element.value, element.property.suffix, element.property.options);
        }
        sidebar_content += this.formcontroll("baustein_class", "text", "class", 'CSS Klasse <div style="font-size: 11px; margin-bottom: 2px;">(für Fortgeschrittene Nutzer)</div>', this.data.bausteine[position_const.row][position_const.depth][position_const.item].class, "", []);
        sidebar_content += '<button id="' + this.dom_id + '_deleteBaustein" class="form-controll bautstein-delete" type="button">Baustein löschen</button>';
        var self = this;
        this.dom.sidebar_content__baustein.innerHTML = sidebar_content;
        this.formcontroll_events();
        var baustein_class_content_row_class = document.getElementById(this.dom_id + '_baustein_class_content_row_class');
        baustein_class_content_row_class.addEventListener("change", function () {
            self.data.bausteine[position_const.row][position_const.depth][position_const.item].class = this.value;
        });
        (_a = document.getElementById(this.dom_id + '_deleteBaustein')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
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