"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/// <reference path="dialog.ts"/>
/// <reference path="tinyeditor.ts"/>
var dialog = new Dialog();
var bausteinRenderType = {
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
    isParentType: function (renderType) {
        return renderType === this.layout || renderType === this.table || renderType === this.tableRow || renderType === this.spoiler;
    }
};
var Position = /** @class */ (function () {
    function Position(parent, sort) {
        this.parent = parent;
        this.sort = sort;
    }
    return Position;
}());
var BausteinStyleProperty = /** @class */ (function () {
    function BausteinStyleProperty(name, title, type, suffix, options, useAsClass, showInBausteinAttributesSidebar) {
        this.name = name;
        this.title = title;
        this.type = type;
        this.suffix = suffix;
        this.options = options;
        this.useAsClass = useAsClass;
        this.showInBausteinAttributesSidebar = showInBausteinAttributesSidebar;
    }
    return BausteinStyleProperty;
}());
var BausteinStyle = /** @class */ (function () {
    function BausteinStyle(property, value) {
        this.property = property;
        this.value = value;
    }
    return BausteinStyle;
}());
var BausteinAttribute = /** @class */ (function () {
    function BausteinAttribute(name, value) {
        this.name = name;
        this.value = value;
    }
    return BausteinAttribute;
}());
var ToggleableClass = /** @class */ (function () {
    function ToggleableClass(name, active, toggleable) {
        this.name = name;
        this.active = active;
        this.toggleable = toggleable;
    }
    return ToggleableClass;
}());
var BausteinTemplate = /** @class */ (function () {
    function BausteinTemplate(type, title, icon, tag, renderType, toggleableClasses, attributes, style) {
        this.content = "";
        this.class = "";
        // columns, rows for table and layout
        this.columns = 0;
        this.rows = 0;
        this.type = type;
        this.title = title;
        this.icon = icon;
        this.tag = tag; // empty string for text node
        this.renderType = renderType;
        this.toggleableClasses = toggleableClasses;
        for (var i_1 = 0; i_1 < this.toggleableClasses.length; i_1++) {
            var toggableClass = this.toggleableClasses[i_1];
            if (toggableClass.active) {
                if (this.class !== "")
                    this.class += " ";
                this.class += toggableClass.name;
            }
        }
        this.attributes = [];
        // Objects are reference types, we need to use clone here
        for (var i = 0; i < attributes.length; i++) {
            this.attributes[i] = new BausteinAttribute(attributes[i].name, attributes[i].value);
        }
        this.style = [];
        // Objects are reference types, we need to use clone here
        for (var i = 0; i < style.length; i++) {
            this.style[i] = new BausteinStyle(style[i].property, style[i].value);
        }
    }
    BausteinTemplate.prototype.addClass = function (clazz) {
        var classList = this.class.trim().split(" ");
        if (classList.indexOf(clazz) === -1) {
            classList.push(clazz);
            this.class = classList.join(" ");
        }
    };
    BausteinTemplate.prototype.removeClass = function (clazz) {
        var classList = this.class.trim().split(" ");
        var index = classList.indexOf(clazz);
        if (index !== -1) {
            classList.splice(index, 1);
            this.class = classList.join(" ");
        }
    };
    BausteinTemplate.prototype.getAttribute = function (name) {
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].name === name) {
                return this.attributes[i].value;
            }
        }
        return null;
    };
    BausteinTemplate.prototype.setAttribute = function (name, value) {
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].name === name) {
                this.attributes[i].value = value;
                return;
            }
        }
        this.attributes.push(new BausteinAttribute(name, value));
    };
    BausteinTemplate.prototype.isParentType = function () {
        return bausteinRenderType.isParentType(this.renderType);
    };
    BausteinTemplate.prototype.getStyle = function (name) {
        for (var i = 0; i < this.style.length; i++) {
            if (this.style[i].property.name === name) {
                return this.style[i];
            }
        }
        return null;
    };
    BausteinTemplate.prototype.getStyleValue = function (name, def) {
        var style = this.getStyle(name);
        if (style) {
            return style.value;
        }
        return def;
    };
    BausteinTemplate.prototype.setStyle = function (name, value) {
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.style[i].property.name === name) {
                this.style[i].value = value;
                return;
            }
        }
        this.style.push(new BausteinStyle(new BausteinStyleProperty(name, name, "", [], [], false, false), value));
    };
    return BausteinTemplate;
}());
var Baustein = /** @class */ (function (_super) {
    __extends(Baustein, _super);
    function Baustein(id, position, type, title, tag, renderType, toggleableClasses, attributes, style) {
        var _this = this;
        var newToggleableClasses = [];
        for (var i = 0; i < toggleableClasses.length; i++) {
            toggleableClasses[i] = new ToggleableClass(toggleableClasses[i].name, toggleableClasses[i].active, toggleableClasses[i].toggleable);
        }
        _this = _super.call(this, type, title, null, tag, renderType, newToggleableClasses, attributes, style) || this;
        _this.id = id;
        _this.position = position;
        return _this;
    }
    return Baustein;
}(BausteinTemplate));
var BausteinEditor = /** @class */ (function () {
    function BausteinEditor(dom_id, options) {
        var _this = this;
        this.baustein_counter = 0;
        this.baustein_id_counter = 0;
        this.cursor_mode = 0;
        this.imageUpload = null;
        this.preview_iframe_url = null;
        this.styleProperties = {
            //font_family: { name: "font-family", title: "Schriftart", type: "string", suffix: [], options:  [new Option("Verdana, Arial, Helvetica, sans-serif")] },
            font_size: { name: "font-size", title: "Schriftgröße", type: "select", suffix: [],
                options: [new Option("Normal", ""), new Option("Kleiner (~10px)", "smaller"), new Option("Klein (~11px)", "small"),
                    new Option("Medium (~14px)", "medium"), new Option("Groß (~17px)", "large"), new Option("Größer (~20px)", "larger")],
                useAsClass: true, showInBausteinAttributesSidebar: true },
            font_weight: { name: "font-weight", title: "Textdicke", type: "select", suffix: [],
                options: [new Option("Normal", ""), new Option("Fett", "bold"), new Option("Fetter", "bolder"), new Option("Leichter", "lighter")], useAsClass: false, showInBausteinAttributesSidebar: true },
            text_decoration: { name: "text-decoration", title: "Textunterschreichung", type: "select", suffix: [],
                options: [new Option("Normal", ""), new Option("underline", "underline"), new Option("dotted", "dotted")], useAsClass: false, showInBausteinAttributesSidebar: true },
            font_style: { name: "font-style", title: "Textkursion", type: "select", suffix: [],
                options: [new Option("Normal", ""), new Option("italic", "italic"), new Option("oblique", "oblique")], useAsClass: false, showInBausteinAttributesSidebar: true },
            text_align: { name: "text-align", title: "Textausrichtung", type: "select", suffix: [],
                options: [new Option("Normal", ""), new Option("left", "left"), new Option("center", "center"), new Option("right", "right")], useAsClass: false, showInBausteinAttributesSidebar: true },
            color: { name: "color", title: "Farbe", type: "color", suffix: [], options: [], useAsClass: false, showInBausteinAttributesSidebar: true },
            background_color: { name: "background-color", title: "Background Color", type: "color", suffix: [], options: [], useAsClass: false, showInBausteinAttributesSidebar: true },
            background_image: { name: "background-image", title: "Background Image", type: "image", suffix: [], options: [], useAsClass: false, showInBausteinAttributesSidebar: true },
            width: { name: "width", title: "Breite", type: "number", suffix: ["px", "%"], options: [new Option("auto")], useAsClass: false, showInBausteinAttributesSidebar: false },
            height: { name: "height", title: "Höhe", type: "number", suffix: ["px", "%"], options: [new Option("auto")], useAsClass: false, showInBausteinAttributesSidebar: false },
            max_width: { name: "max-width", title: "Maximale Breite", type: "number", suffix: ["px", "%"], options: [new Option("auto")], useAsClass: false, showInBausteinAttributesSidebar: true },
            max_height: { name: "max-height", title: "Maximale Höhe", type: "number", suffix: ["px", "%"], options: [new Option("auto")], useAsClass: false, showInBausteinAttributesSidebar: true },
            margin_top: { name: "margin-top", title: "Außenabstand Oben", type: "number", suffix: ["px"], options: [new Option("auto")], useAsClass: false, showInBausteinAttributesSidebar: false },
            margin_right: { name: "margin-right", title: "Außenabstand Rechts", type: "number", suffix: ["px"], options: [new Option("auto")], useAsClass: false, showInBausteinAttributesSidebar: false },
            margin_bottom: { name: "margin-bottom", title: "Außenabstand Unten", type: "number", suffix: ["px"], options: [new Option("auto")], useAsClass: false, showInBausteinAttributesSidebar: false },
            margin_left: { name: "margin-left", title: "Außenabstand Links", type: "number", suffix: ["px"], options: [new Option("auto")], useAsClass: false, showInBausteinAttributesSidebar: false },
            padding_top: { name: "padding-top", title: "Innenabstand Oben", type: "number", suffix: ["px"], options: [], useAsClass: false, showInBausteinAttributesSidebar: false },
            padding_right: { name: "padding-right", title: "Innenabstand Rechts", type: "number", suffix: ["px"], options: [], useAsClass: false, showInBausteinAttributesSidebar: false },
            padding_bottom: { name: "padding-bottom", title: "Innenabstand Unten", type: "number", suffix: ["px"], options: [], useAsClass: false, showInBausteinAttributesSidebar: false },
            padding_left: { name: "padding-left", title: "Innenabstand Links", type: "number", suffix: ["px"], options: [], useAsClass: false, showInBausteinAttributesSidebar: false },
        };
        this.stylePropertiesArray = Object.values(this.styleProperties);
        this.data = {
            page: {
                style: [
                //{ property: this.styleProperties.font_family, value: this.styleProperties.font_family.options[0].value },
                ],
                //styleClasses: [
                //    { property: this.styleProperties.font_size, value: this.styleProperties.font_size.options[0].value },
                //]
            },
            bausteine: []
        };
        this.types = {
            bausteinSelector: new BausteinTemplate("bausteinSelector", "", '', "", bausteinRenderType.bausteinSelector, [], [], []),
            h1: new BausteinTemplate("h1", "Überschrift 1", '<b>H1</b>', "h1", bausteinRenderType.richtext, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h2: new BausteinTemplate("h2", "Überschrift 2", '<b>H2</b>', "h2", bausteinRenderType.richtext, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h3: new BausteinTemplate("h3", "Überschrift 3", '<b>H3</b>', "h3", bausteinRenderType.richtext, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h4: new BausteinTemplate("h4", "Überschrift 4", '<b>H4</b>', "h4", bausteinRenderType.richtext, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h5: new BausteinTemplate("h5", "Überschrift 5", '<b>H5</b>', "h5", bausteinRenderType.richtext, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            h6: new BausteinTemplate("h6", "Überschrift 6", '<b>H6</b>', "h6", bausteinRenderType.richtext, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "bold" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
            ]),
            text: new BausteinTemplate("text", "Text", '<i class="fas fa-paragraph"></i>', "div", bausteinRenderType.richtext, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            button_primary: new BausteinTemplate("button", "Primary Button", '<i class="fas fa-exclamation"></i>', "a", bausteinRenderType.button, [new ToggleableClass("btn", true, false), new ToggleableClass("btn-primary", true, false)], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            button_secondary: new BausteinTemplate("button", "Secondary Button", '<i class="fas fa-exclamation"></i>', "a", bausteinRenderType.button, [new ToggleableClass("btn", true, false), new ToggleableClass("btn-secondary", true, false)], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            button_cta: new BausteinTemplate("button", "Call-To-Action Button", '<i class="fas fa-exclamation"></i>', "a", bausteinRenderType.button, [new ToggleableClass("btn", true, false), new ToggleableClass("btn-cta", true, false)], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            html: new BausteinTemplate("html", "HTML", '<i class="fab fa-html5"></i>', "div", bausteinRenderType.plaintext, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
            ]),
            script: new BausteinTemplate("script", "Script", '<i class="fas fa-code"></i>', "script", bausteinRenderType.plaintext, [], [], []),
            iframe: new BausteinTemplate("iframe", "Webseite einbinden", '<i class="fas fa-code"></i>', "iframe", bausteinRenderType.iframe, [], [], []),
            shortcode: new BausteinTemplate("shortcode", "Shortcode", '<b>[..]</b>', "", bausteinRenderType.plaintext, [], [], []),
            image: new BausteinTemplate("image", "Bild", '<i class="fas fa-image"></i>', "img", bausteinRenderType.image, [], [], [
                { property: this.styleProperties.max_width, value: "100%" },
                { property: this.styleProperties.max_height, value: "" },
            ]),
            spoiler: new BausteinTemplate("spoiler", "Schaltklappe", '<i class="fas fa-box"></i>', "div", bausteinRenderType.spoiler, [], [], []),
            spoiler_toggler: new BausteinTemplate("spoiler", "Schaltklappe Schalter", '<i class="fas fa-box"></i>', "div", bausteinRenderType.spoiler_toggler, [], [], []),
            spoiler_content: new BausteinTemplate("spoiler", "Schaltklappe Inhalt", '<i class="fas fa-box"></i>', "div", bausteinRenderType.spoiler_content, [new ToggleableClass("collapse", true, false)], [], []),
            layout: new BausteinTemplate("layout", "Layout", '<i class="fas fa-layer-group" style="transform: rotate(90deg);"></i>', "div", bausteinRenderType.layout, [new ToggleableClass("row", true, false)], [], [
                { property: this.styleProperties.max_width, value: "" },
                { property: this.styleProperties.max_height, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            table: new BausteinTemplate("table", "Tabelle", '<i class="fas fa-table"></i>', "table", bausteinRenderType.table, [new ToggleableClass("rsp-table", true, false)], [], [
                { property: this.styleProperties.max_width, value: "" },
                { property: this.styleProperties.max_height, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            tableRow: new BausteinTemplate("tableRow", "Tabellenreihe", '<i class="fas fa-table"></i>', "tr", bausteinRenderType.tableRow, [], [], []),
            th: new BausteinTemplate("th", "Tabellentitelzeile", '<i class="fas fa-table"></i>', "th", bausteinRenderType.tableCell, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ]),
            td: new BausteinTemplate("td", "Tabellenzeile", '<i class="fas fa-table"></i>', "td", bausteinRenderType.tableCell, [], [], [
                //{ property: this.styleProperties.font_family, value:"" },
                { property: this.styleProperties.font_size, value: "" },
                { property: this.styleProperties.text_align, value: "" },
                { property: this.styleProperties.font_weight, value: "" },
                { property: this.styleProperties.text_decoration, value: "" },
                { property: this.styleProperties.font_style, value: "" },
                { property: this.styleProperties.color, value: "" },
                { property: this.styleProperties.background_color, value: "" },
                { property: this.styleProperties.background_image, value: "" },
            ])
        };
        this.typesArray = Object.values(this.types);
        this.addBausteinSelectorItems = [
            { type: 1, title: "Überschriften", icon: '<i class="fas fa-heading"></i>', items: [this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6] },
            { type: 0, title: this.types.text.title, icon: this.types.text.icon, items: [this.types.text] },
            { type: 0, title: this.types.image.title, icon: this.types.image.icon, items: [this.types.image] },
            { type: 0, title: this.types.layout.title, icon: this.types.layout.icon, items: [this.types.layout] },
            { type: 0, title: this.types.table.title, icon: this.types.table.icon, items: [this.types.table] },
            { type: 1, title: "Buttons", icon: '<i class="fas fa-exclamation"></i>', items: [this.types.button_primary, this.types.button_secondary, this.types.button_cta] },
            { type: 1, title: "Sonstiges", icon: '<i class="fas fa-cubes"></i>', items: [this.types.spoiler, this.types.script, this.types.shortcode, this.types.iframe] }
        ];
        this.selected_baustein = null;
        this.selected_baustein_id = null;
        this.open_baustein_attributes__baustein_id = null;
        this.assets = {
            baustein_image_placeholder: "/img/baustein-image-placeholder.png"
        };
        this.api_endpoints = {
            image_search: "",
            image_register: "",
        };
        this.dom_id = dom_id;
        // Options
        if (typeof options !== "undefined") {
            if (typeof options.assets !== "undefined")
                this.assets = options.assets;
            if (typeof options.api_endpoints !== "undefined")
                this.api_endpoints = options.api_endpoints;
            if (typeof options.imageUpload !== "undefined")
                this.imageUpload = options.imageUpload;
            if (typeof options.preview_iframe_url !== "undefined")
                this.preview_iframe_url = options.preview_iframe_url;
        }
        // DOM
        this.dom = {};
        this.dom.be = document.getElementById(this.dom_id);
        this.dom.underlay = this.dom.be.appendChild(this.createElement("div", this.dom_id + '_underlay', "__dialog"));
        this.dom.underlay.style.display = "none";
        this.dom.page_styles = this.dom.be.appendChild(this.createElement("style", this.dom_id + '_page_styles', ""));
        this.dom.main = this.dom.be.appendChild(this.createElement("div", this.dom_id + "_main", "be_main"));
        this.dom.sidebar = this.dom.be.appendChild(this.createElement("div", this.dom_id + "_sidebar", "be_sidebar"));
        this.dom.cursormodechanger = this.dom.main.appendChild(this.createElement("div", "", "be_cursormodechanger"));
        this.dom.cursormodechanger_default = this.dom.cursormodechanger.appendChild(this.createElement("div", "", "be_cursormodechanger_item active be_cursormodechanger_default"));
        this.dom.cursormodechanger_default.innerHTML = '<i class="fas fa-mouse-pointer"></i>';
        this.dom.cursormodechanger_drag = this.dom.cursormodechanger.appendChild(this.createElement("div", "", "be_cursormodechanger_item be_cursormodechanger_drag"));
        this.dom.cursormodechanger_drag.innerHTML = '<i class="fas fa-arrows-alt"></i>';
        this.dom.content = this.dom.main.appendChild(this.createElement("div", this.dom_id + "_content", "be_content"));
        this.dom.preview = this.dom.main.appendChild(this.createElement("div", this.dom_id + "_preview", "be_preview"));
        this.dom.preview_button_desktop = this.dom.preview.appendChild(this.createElement("button", this.dom_id + "_preview_button_desktop", "be_preview_button_desktop"));
        this.dom.preview_button_desktop.innerHTML = '<i class="fas fa-desktop"></i> Desktop';
        this.dom.preview_button_desktop.style.display = "none";
        this.dom.preview_button_desktop.type = "button";
        this.dom.preview_button_mobile = this.dom.preview.appendChild(this.createElement("button", this.dom_id + "_preview_button_mobile", "be_preview_button_mobile"));
        this.dom.preview_button_mobile.innerHTML = '<i class="fas fa-mobile-alt"></i> Mobile';
        this.dom.preview_button_mobile.style.display = "none";
        this.dom.preview_button_mobile.type = "button";
        this.dom.preview_button = this.dom.preview.appendChild(this.createElement("button", this.dom_id + "_preview_button", "be_preview_button"));
        this.dom.preview_button.innerHTML = '<i class="fas fa-eye"></i> Vorschau';
        this.dom.preview_button.type = "button";
        this.dom.preview_close_button = this.dom.preview.appendChild(this.createElement("button", this.dom_id + "_preview_close_button", "be_preview_close_button"));
        this.dom.preview_close_button.innerHTML = '<i class="fas fa-times"></i> Vorschau schließen';
        this.dom.preview_close_button.style.display = "none";
        this.dom.preview_close_button.type = "button";
        this.dom.preview_content = this.dom.preview.appendChild(this.createElement("div", this.dom_id + "_preview_content", "be_preview_content"));
        this.dom.preview_content.style.display = "none";
        this.dom.sidebar_header = this.dom.sidebar.appendChild(this.createElement("div", this.dom_id + "_sidebar_header", "be_sidebar_header"));
        this.dom.sidebar_content__site = this.dom.sidebar.appendChild(this.createElement("div", this.dom_id + "_sidebar_content__site", "be_sidebar_content"));
        this.dom.sidebar_content__baustein = this.dom.sidebar.appendChild(this.createElement("div", this.dom_id + "_sidebar_content__baustein", "be_sidebar_content"));
        this.dom.sidebar_content__baustein.style.display = "none";
        this.dom.sidebar_content__baustein_styles = this.dom.sidebar_content__baustein.appendChild(this.createElement("div", this.dom_id + "_sidebar_content__baustein_styles", ""));
        this.dom.sidebar_content__baustein_misc = this.dom.sidebar_content__baustein.appendChild(this.createElement("div", this.dom_id + "_sidebar_content__baustein_misc", ""));
        this.dom.sidebar_header_col__site = this.dom.sidebar_header.appendChild(this.createElement("div", this.dom_id + "_sidebar_header_col__site", "be_sidebar_header_col active"));
        this.dom.sidebar_header_col__site.innerHTML = "Artikel";
        this.dom.sidebar_header_col__baustein = this.dom.sidebar_header.appendChild(this.createElement("div", this.dom_id + "_sidebar_header_col__baustein", "be_sidebar_header_col disabled"));
        this.dom.sidebar_header_col__baustein.innerHTML = "Baustein";
        //for (var i = 0; i < this.data.page.styleClasses.length; i++) {
        //    const element = this.data.page.styleClasses[i];
        //    this.dom.sidebar_content__site.appendChild(
        //        this.formcontrol("page-sc", element.property.type, element.property.name, element.property.title, 
        //            element.value, element.property.suffix, element.property.options).content
        //    );
        //}
        for (var i = 0; i < this.data.page.style.length; i++) {
            var element = this.data.page.style[i];
            this.dom.sidebar_content__site.appendChild(this.formcontrol("page", element.property.type, element.property.name, element.property.title, element.value, {
                suffix: element.property.suffix, html_options: element.property.options, onchange: function () { return _this.apply_styles(); }
            }).content);
        }
        this.be_bausteinSelector_isOpen = false;
        this.apply_styles();
        // Construct ajax loader
        this.dom.ajax_loader = document.body.appendChild(this.createElement("div", this.dom_id + "-ajax-loader", "be-ajax-loader"));
        this.dom.ajax_loader.style.display = "none";
        // Events
        var self = this;
        this.dom.cursormodechanger_default.addEventListener("click", function () {
            self.cursor_mode = 0;
            self.dom.cursormodechanger_default.classList.add("active");
            self.dom.cursormodechanger_drag.classList.remove("active");
        });
        this.dom.cursormodechanger_drag.addEventListener("click", function () {
            self.cursor_mode = 1;
            self.dom.cursormodechanger_default.classList.remove("active");
            self.dom.cursormodechanger_drag.classList.add("active");
        });
        [this.dom.preview_button, this.dom.preview_close_button].forEach(function (element) {
            element.addEventListener("click", function () {
                if (self.dom.preview_content.style.display === "none") {
                    self.dom.preview_content.style.display = "";
                    self.preview_render();
                    self.dom.preview_content.style.height = "400px";
                    self.dom.content.style.height = "calc(100% - 50px - 46px - " + self.dom.preview_content.style.height + ")";
                    self.dom.preview_button_mobile.style.display = "";
                    self.dom.preview_content.style.width = "";
                    self.dom.preview_content.classList.remove("mobile");
                    self.dom.preview_button.style.display = "none";
                    self.dom.preview_close_button.style.display = "";
                }
                else {
                    self.dom.preview_content.style.display = "none";
                    self.dom.content.style.height = "";
                    self.dom.preview_button_desktop.style.display = "none";
                    self.dom.preview_button_mobile.style.display = "none";
                    self.dom.preview_button.style.display = "";
                    self.dom.preview_close_button.style.display = "none";
                }
            });
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
        return new BausteinStyleProperty(name, "", "", [], [], false, false);
    };
    BausteinEditor.prototype.getBausteinType = function (type) {
        for (var i = 0; i < this.typesArray.length; i++) {
            if (this.typesArray[i].type === type) {
                return this.typesArray[i];
            }
        }
        return this.typesArray[0];
    };
    BausteinEditor.prototype.createElement = function (_type, _id, _class) {
        var element = document.createElement(_type);
        if (_id !== "")
            element.id = _id;
        if (_class !== "")
            element.className = _class;
        return element;
    };
    BausteinEditor.prototype.renderBausteinSelector = function (position, hide, bausteinHasParent) {
        //console.log("renderBausteinSelector", position, hide, showLayoutItems);
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
        var be_bausteinSelector_outer = be_bausteinSelector_container.appendChild(this.createElement("div", selector_dom_id + '_bausteinSelector', "be_bausteinSelector_outer"));
        var be_bausteinSelector = be_bausteinSelector_outer.appendChild(this.createElement("div", selector_dom_id + '_bausteinSelector', "be_bausteinSelector"));
        be_bausteinSelector.appendChild(this.createElement("i", "", "fas fa-plus-square"));
        var be_bausteinSelector_layer = this.dom.be.appendChild(this.createElement("div", selector_dom_id + '_bausteinSelector_layer', "be_bausteinSelector_layer"));
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
            //if (showLayoutItems === false && itemset.type === 0 && (itemset.items[0].renderType === bausteinRenderType.layout || itemset.items[0].renderType === bausteinRenderType.table)) {
            //    continue;
            //}
            be_bausteinSelector_layer_item = be_bausteinSelector_layer_item_container1.appendChild(this_1.createElement("button", "", "be_bausteinSelector_layer_item"));
            be_bausteinSelector_layer_item.type = "button";
            be_bausteinSelector_layer_item.dataset.category = i.toString();
            if (itemset.type === 0)
                be_bausteinSelector_layer_item.dataset.type = itemset.items[0].type.toString();
            title1 = be_bausteinSelector_layer_item.appendChild(this_1.createElement("div", "", "be_bausteinSelector_layer_item_title1"));
            title2 = be_bausteinSelector_layer_item.appendChild(this_1.createElement("div", "", "be_bausteinSelector_layer_item_title2"));
            if (itemset.type === 0) {
                if (itemset.items[0].icon !== null)
                    title1.innerHTML = itemset.items[0].icon;
                title2.innerHTML = itemset.items[0].title;
            }
            else {
                if (itemset.icon !== null)
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
                        var be_bausteinSelector_layer_item_1 = be_bausteinSelector_layer_item_container2.appendChild(self.createElement("button", "", "be_bausteinSelector_layer_item"));
                        be_bausteinSelector_layer_item_1.type = "button";
                        be_bausteinSelector_layer_item_1.dataset.type = types_array_1[b].type;
                        be_bausteinSelector_layer_item_1.innerHTML =
                            '<div class="be_bausteinSelector_layer_item_title1">' + types_array_1[b].icon + '</div>'
                                + '<div class="be_bausteinSelector_layer_item_title2">' + types_array_1[b].title + '</div>';
                        if (types_array_1[b].renderType === bausteinRenderType.button) {
                            types_array_1[b].class.split(" ").forEach(function (className) {
                                be_bausteinSelector_layer_item_1.classList.add(className);
                            });
                        }
                        var types_array_row = b;
                        be_bausteinSelector_layer_item_1.addEventListener("click", function () {
                            self.addBaustein(types_array_1[types_array_row], new Position(position.parent, position.sort));
                            self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                        });
                    };
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
        return be_bausteinSelector_container;
    };
    // iterate through all bausteine and check if columns/rows are the same as presented in data.bausteine
    BausteinEditor.prototype.rowcol_amount_evaluate = function () {
        for (var i = 0; i < this.data.bausteine.length; i++) {
            var baustein = this.data.bausteine[i];
            if (baustein.renderType === bausteinRenderType.table || baustein.renderType === bausteinRenderType.tableRow || baustein.renderType === bausteinRenderType.layout) {
                var amount, new_baustein_type;
                if (baustein.renderType === bausteinRenderType.tableRow || baustein.renderType === bausteinRenderType.layout) {
                    // check columns amount
                    amount = baustein.columns;
                    new_baustein_type = this.types.bausteinSelector;
                }
                else { // if (baustein.renderType === bausteinRenderType.table)
                    // check rows amount
                    amount = baustein.rows;
                    new_baustein_type = this.types.tableRow;
                }
                var children = this.getBausteineChildren(baustein.id);
                if (children.length < amount) {
                    // add bausteine of type bausteinSelector
                    for (var j = children.length; j < amount; j++) {
                        this.addBaustein(new_baustein_type, new Position(baustein.id, this.getPositionSort(false)));
                    }
                }
                else if (children.length > amount) {
                    // remove bausteine; to do this first we add all bausteine who are have not the parent of this table, then we add the rest
                    var new_bausteine_array = [];
                    for (var j = 0; j < this.data.bausteine.length; j++) {
                        if (this.data.bausteine[j].position.parent !== baustein.id) {
                            new_bausteine_array.push(this.data.bausteine[j]);
                        }
                    }
                    for (var j = 0; j < baustein.columns; j++) {
                        new_bausteine_array.push(children[j]);
                    }
                    this.data.bausteine = new_bausteine_array;
                }
            }
        }
    };
    BausteinEditor.prototype.addBaustein = function (baustein_template, position) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var self, parent_baustein, baustein_class, _a, baustein_id, baustein, actual_addBaustein;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log("addBaustein( type:", baustein_template.type, ", position:", position, " )");
                                    self = this;
                                    parent_baustein = position.parent === null ? null : this.getBaustein(position.parent);
                                    baustein_class = baustein_template.class;
                                    if (!(parent_baustein !== null)) return [3 /*break*/, 3];
                                    if (!(parent_baustein.renderType === bausteinRenderType.layout)) return [3 /*break*/, 1];
                                    // Layout children should have class="col"
                                    if (baustein_class !== "")
                                        baustein_class += " ";
                                    baustein_class += "col";
                                    return [3 /*break*/, 3];
                                case 1:
                                    if (!(parent_baustein.renderType === bausteinRenderType.tableRow && baustein_template.type === self.types.text.type)) return [3 /*break*/, 3];
                                    // IF parent is tableRow AND child is type "text" then change it to td
                                    _a = resolve;
                                    return [4 /*yield*/, self.addBaustein(self.types.td, position)];
                                case 2:
                                    // IF parent is tableRow AND child is type "text" then change it to td
                                    _a.apply(void 0, [_b.sent()]);
                                    return [2 /*return*/];
                                case 3:
                                    baustein_id = this.baustein_id_counter;
                                    baustein = new Baustein(baustein_id, position, baustein_template.type, baustein_template.title, baustein_template.tag, baustein_template.renderType, baustein_template.toggleableClasses, baustein_template.attributes, baustein_template.style);
                                    baustein.class = baustein_class;
                                    actual_addBaustein = function () {
                                        self.baustein_id_counter += 1;
                                        // handle default style
                                        for (var i = 0; i < baustein.style.length; i++) {
                                            var style = baustein.style[i];
                                            if (style.value === "" && style.property.options.length > 0) {
                                                style.value = style.property.options[0].value;
                                            }
                                        }
                                        // test if on the same position is a Baustein typeof BausteinSelector
                                        var baustein_type_baustein_selector_index = null;
                                        if (baustein.renderType !== bausteinRenderType.bausteinSelector) {
                                            for (var r = 0; r < self.data.bausteine.length; r++) {
                                                if (self.data.bausteine[r].position.parent === position.parent && self.data.bausteine[r].position.sort === position.sort) {
                                                    if (self.data.bausteine[r].renderType === bausteinRenderType.bausteinSelector) {
                                                        baustein_type_baustein_selector_index = r;
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                        if (baustein_type_baustein_selector_index === null) {
                                            // any baustein with equel or greater then position.sort += 1
                                            for (var r = 0; r < self.data.bausteine.length; r++) {
                                                if (self.data.bausteine[r].position.sort >= position.sort) {
                                                    self.data.bausteine[r].position.sort++;
                                                }
                                            }
                                            self.data.bausteine.push(baustein);
                                        }
                                        else {
                                            self.data.bausteine.splice(baustein_type_baustein_selector_index, 1);
                                            self.data.bausteine.push(baustein);
                                        }
                                        if (baustein.renderType === bausteinRenderType.spoiler) {
                                            var spoiler_id_1 = new Date().getTime();
                                            self.addBaustein(self.types.spoiler_toggler, new Position(baustein_id, self.getPositionSort(false)))
                                                .then(function (that_baustein) {
                                                that_baustein.attributes = [
                                                    new BausteinAttribute("data-bs-toggle", "collapse"),
                                                    new BausteinAttribute("aria-expanded", "false"),
                                                    new BausteinAttribute("data-bs-target", "#be-bs-collapse-content" + spoiler_id_1),
                                                    new BausteinAttribute("aria-controls", "be-bs-collapse-content" + spoiler_id_1),
                                                ];
                                            });
                                            self.addBaustein(self.types.spoiler_content, new Position(baustein_id, self.getPositionSort(false)))
                                                .then(function (that_baustein) { that_baustein.attributes = [new BausteinAttribute("id", "be-bs-collapse-content" + spoiler_id_1)]; });
                                        }
                                        else {
                                            // IF is ParentType THEN add dummy Bausteine to the Baustein-Array
                                            if (baustein.isParentType()) {
                                                if (baustein.renderType === bausteinRenderType.table) {
                                                    for (var row = 0; row < baustein.rows; row++) {
                                                        self.addBaustein(self.types.tableRow, new Position(baustein_id, self.getPositionSort(false)));
                                                    }
                                                }
                                                else {
                                                    for (var column = 0; column < baustein.columns; column++) {
                                                        self.addBaustein(self.types.bausteinSelector, new Position(baustein_id, self.getPositionSort(false)));
                                                    }
                                                }
                                            }
                                        }
                                        self.render();
                                        if (baustein.renderType !== bausteinRenderType.bausteinSelector)
                                            self.selectBaustein(baustein_id);
                                        resolve(baustein);
                                    };
                                    if (baustein.renderType === bausteinRenderType.layout || baustein.renderType === bausteinRenderType.table) {
                                        this.dialog_rowcol(baustein)
                                            .then(function () { return actual_addBaustein(); })
                                            .catch(function () { return reject(); });
                                    }
                                    else if (baustein.renderType === bausteinRenderType.image) {
                                        this.dialog_media(baustein.renderType)
                                            .then(function (image_url) {
                                            baustein.content = image_url;
                                            actual_addBaustein();
                                        })
                                            .catch(function () { return reject(); });
                                    }
                                    else {
                                        if (baustein.renderType === bausteinRenderType.tableRow && parent_baustein !== null) {
                                            // TableRow inherit columns count from Table
                                            baustein.columns = parent_baustein.columns;
                                        }
                                        actual_addBaustein();
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
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
    BausteinEditor.prototype.getBausteinFromPosition = function (position) {
        for (var i = 0; i < this.data.bausteine.length; i++) {
            if (this.data.bausteine[i].position.parent === position.parent && this.data.bausteine[i].position.sort === position.sort) {
                return this.data.bausteine[i];
            }
        }
        return null;
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
    BausteinEditor.prototype.getBausteineChildren = function (parent) {
        var bausteine = [];
        for (var i = 0; i < this.data.bausteine.length; i++) {
            if (this.data.bausteine[i].position.parent === parent) {
                bausteine[bausteine.length] = this.data.bausteine[i];
            }
        }
        return bausteine.sort(function (a, b) {
            return a.position.sort > b.position.sort ? 1 : -1;
        });
    };
    BausteinEditor.prototype.deleteBaustein = function (baustein_id) {
        console.log("deleteBaustein() baustein_id", baustein_id);
        this.deleteBaustein_helper(baustein_id);
        this.selected_baustein_id = null;
        this.open_baustein_attributes__baustein_id = null;
        this.rowcol_amount_evaluate();
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
    BausteinEditor.prototype.deleteBaustein_helper = function (baustein_id) {
        // delete children
        var children = this.getBausteineChildren(baustein_id);
        for (var i = 0; i < children.length; i++) {
            this.deleteBaustein_helper(children[i].id);
        }
        // delete baustein
        for (var row = 0; row < this.data.bausteine.length; row++) {
            if (this.data.bausteine[row].id === baustein_id) {
                this.data.bausteine.splice(row, 1);
                break;
            }
        }
    };
    BausteinEditor.prototype.moveBaustein = function (baustein_id, position_new) {
        var baustein = this.getBaustein(baustein_id);
        console.log("moveBaustein old position.sort", baustein.position.sort, "new position.sort", position_new.sort);
        // Illegal moves: Table child must be TableRow, TableRow out of Table, TableCell out of TableRow
        if (position_new.parent !== null) {
            var new_baustein_parent = this.getBaustein(position_new.parent);
            if (baustein.renderType === bausteinRenderType.tableRow) {
                if (new_baustein_parent.renderType !== bausteinRenderType.table) {
                    console.info("[BausteinEditor] can not move tableRow out of table. target must be a table");
                    return false;
                }
            }
            else if (baustein.renderType === bausteinRenderType.tableCell) {
                if (new_baustein_parent.renderType !== bausteinRenderType.tableRow) {
                    console.info("[BausteinEditor] can not move tableCell out of tableRow, target must be a tableRow");
                    return false;
                }
            }
            if (new_baustein_parent.renderType === bausteinRenderType.table && baustein.renderType !== bausteinRenderType.tableRow) {
                console.info("[BausteinEditor] can not move Baustein of type '" + baustein.type + "' to table, Baustein must be a tableRow");
                return false;
            }
        }
        var test_position_new_parent = position_new.parent;
        var parentIsInChild = false;
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
        }
        else if (baustein.position.parent === position_new.parent && baustein.position.sort === position_new.sort) {
            console.info("moveBaustein() can not move Baustein into same position");
            return false;
        }
        else {
            // IF position is baustein of type bausteinSelector
            var test_baustein = this.getBausteinFromPosition(position_new);
            if (test_baustein !== null && test_baustein.renderType === bausteinRenderType.bausteinSelector) {
                var test_baustein_index = this.data.bausteine.indexOf(test_baustein);
                if (test_baustein_index === -1) {
                    console.info("[BausteinEditor] moveBaustein() can not find Baustein index with position: " + position_new.parent + ", " + position_new.sort);
                }
                else {
                    // Special cases
                    if (position_new.parent !== null) {
                        var new_baustein_parent = this.getBaustein(position_new.parent);
                        // move baustein to Layout
                        if (new_baustein_parent.renderType === bausteinRenderType.layout) {
                            baustein.addClass("col");
                        }
                        else {
                            baustein.removeClass("col");
                        }
                    }
                    else {
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
            for (var r = 0; r < this.data.bausteine.length; r++) {
                if (this.data.bausteine[r].id !== baustein_id && this.data.bausteine[r].position.sort >= baustein.position.sort) {
                    this.data.bausteine[r].position.sort++;
                }
            }
            this.rowcol_amount_evaluate();
            this.render();
        }
        return true;
    };
    BausteinEditor.prototype.printBausteinePosition = function () {
        console.log("printBausteinePosition()");
        for (var i = 0; i < this.data.bausteine.length; i++) {
            console.log(this.data.bausteine[i].id, this.data.bausteine[i].position);
        }
    };
    BausteinEditor.prototype.changeBaustein = function (baustein_id, type) {
        var baustein = this.getBaustein(baustein_id);
        var new_baustein = this.getBausteinType(type);
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
        var _this = this;
        var self = this;
        var baustein_id = baustein.id;
        var position_parent = position.parent;
        var position_sort = position.sort;
        var baustein_dom_id = this.dom_id + '_be_baustein_item' + baustein_id;
        var baustein_editor_id = baustein_dom_id + '_editor';
        var baustein_type_object = this.getBausteinType(baustein.type);
        var elements_drag_not_allowed = [];
        if (baustein.renderType === bausteinRenderType.bausteinSelector) {
            var baustein_dom = this.renderBausteinSelector(new Position(position_parent, position_sort), false, false);
        }
        else {
            var baustein_dom = this.createElement("div", baustein_dom_id, "be_baustein");
            baustein_dom.dataset.type = baustein.type;
            baustein_dom.dataset.position_parent = position_parent + "";
            baustein_dom.dataset.position_sort = position_sort + "";
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
            // Baustein indicator
            var baustein_indicator = baustein_dom.appendChild(this.createElement("label", baustein_dom_id + "_indicator", "baustein_indicator"));
            baustein_indicator.addEventListener("click", function () {
                self.selectBaustein(baustein_id);
            }, false);
            if (position_parent === null) {
                var baustein_indicator_position = baustein_indicator.appendChild(this.createElement("span", "", "baustein_indicator_position"));
                baustein_indicator_position.innerHTML = self.baustein_counter.toString();
                self.baustein_counter++;
            }
            var changeBausteinOptions = this.getChangeBausteinOptions(baustein.renderType, baustein.type);
            if (changeBausteinOptions.length === 0) {
                var baustein_indicator_title = baustein_indicator.appendChild(this.createElement("span", "", "baustein_indicator_title"));
                baustein_indicator_title.innerHTML = baustein_type_object.icon + " " + baustein.title;
            }
            else {
                // Icon
                if (baustein_type_object.icon !== null)
                    baustein_indicator.innerHTML = baustein_type_object.icon;
                // Baustein Indicator Changer
                var baustein_indicator_changer = baustein_indicator.appendChild(this.createElement("select", "", "baustein_indicator_changer"));
                baustein_indicator_changer.tabIndex = -1;
                baustein_indicator_changer.addEventListener("change", function () {
                    self.changeBaustein(baustein_id, this.value);
                });
                var baustein_indicator_option = baustein_indicator_changer.appendChild(this.createElement("option", "", ""));
                baustein_indicator_option.value = baustein.type;
                baustein_indicator_option.innerHTML = baustein.title;
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
                case bausteinRenderType.spoiler:
                    var bausteine_inner = this.getBausteineChildren(baustein.id);
                    for (var row = 0; row < bausteine_inner.length; row++) {
                        var baustein_inner = bausteine_inner[row];
                        baustein_dom.appendChild(this.renderBaustein(baustein_inner, new Position(baustein_id, baustein_inner.position.sort)));
                    }
                    break;
                case bausteinRenderType.spoiler_toggler:
                case bausteinRenderType.spoiler_content:
                    var bausteine_inner = this.getBausteineChildren(baustein.id);
                    if (bausteine_inner.length === 0) {
                        var show_layout_items = baustein.renderType === bausteinRenderType.spoiler_content;
                        baustein_dom.appendChild(this.renderBausteinSelector(new Position(baustein_id, this.getPositionSort(false)), false, show_layout_items));
                    }
                    else {
                        for (var row = 0; row < bausteine_inner.length; row++) {
                            var baustein_inner = bausteine_inner[row];
                            baustein_dom.appendChild(this.renderBaustein(baustein_inner, new Position(baustein_id, baustein_inner.position.sort)));
                        }
                    }
                    break;
                case bausteinRenderType.image:
                    var image = baustein_dom.appendChild(this.createElement("img", baustein_editor_id, "be_baustein_item"));
                    // WENN dataset.src empty ist, dann ist nur der Placeholder vorhanden
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
                    // remove ghost image
                    image.addEventListener("dragstart", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                    break;
                case bausteinRenderType.iframe:
                    var iframe = baustein_dom.appendChild(this.createElement("iframe", baustein_editor_id, "be_baustein_item"));
                    iframe.dataset.src = baustein.getAttribute("src") || "about:blank";
                    iframe.style.width = "100%";
                    iframe.style.height = "100%";
                    iframe.style.border = "0";
                    iframe.addEventListener("click", function () {
                        self.selectBaustein(baustein_id);
                    });
                    break;
                default:
                    var editor;
                    switch (baustein.renderType) {
                        case bausteinRenderType.button:
                            editor = baustein_dom.appendChild(this.createElement("a", baustein_editor_id, "be_baustein_item " + baustein.class));
                            editor.innerHTML = baustein.content;
                            editor.setAttribute("contenteditable", "true");
                            editor.addEventListener("input", function () {
                                baustein.content = editor.innerHTML;
                                self.preview_render();
                            });
                            break;
                        case bausteinRenderType.tableCell:
                        case bausteinRenderType.richtext:
                            editor = baustein_dom.appendChild(this.createElement("div", baustein_editor_id, "be_baustein_item"));
                            editor.style.minHeight = "100px";
                            /*
                                formatblock
                                fontname
                                bold
                                italic
                                underline
                                textcolor
                                textleft
                                textcenter
                                textright
                                insertorderedlist
                                insertunorderedlist
                                outdent
                                removeFormat
                            */
                            var tiny_editor_1 = new TinyEditor(editor, {
                                bold: true,
                                italic: true,
                                underline: true,
                                textcolor: true,
                                textleft: true,
                                textcenter: true,
                                textright: true,
                                insertorderedlist: true,
                                insertunorderedlist: true,
                                indent: true,
                                outdent: true,
                                image: true,
                                hyperlink: true,
                                removeFormat: true,
                                onchange: function () {
                                    baustein.content = tiny_editor_1.export();
                                    self.preview_render();
                                    editor.style.height = '1px';
                                    editor.style.height = editor.scrollHeight + 'px';
                                },
                                exec_command_create_image: function () {
                                    return new Promise(function (resolve, reject) {
                                        self.dialog_media(bausteinRenderType.image).then(function (image_url) {
                                            resolve(image_url);
                                        }).catch(function (error) {
                                            reject(error);
                                        });
                                    });
                                }
                            });
                            tiny_editor_1.import(baustein.content);
                            break;
                        default:
                            editor = baustein_dom.appendChild(this.createElement("textarea", baustein_editor_id, "be_baustein_item"));
                            editor.innerHTML = baustein.content;
                            editor.focus();
                            var editor_textarea_1 = editor;
                            editor_textarea_1.addEventListener("input", function () {
                                editor_textarea_1.style.height = '1px';
                                editor_textarea_1.style.height = editor_textarea_1.scrollHeight + 'px';
                                baustein.content = editor_textarea_1.value;
                            });
                            break;
                    }
                    editor.draggable = false;
                    editor.addEventListener("focusin", function () {
                        self.selectBaustein(baustein_id);
                    });
                    elements_drag_not_allowed.push(editor);
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
            // handle draggable condition
            if (baustein.renderType !== bausteinRenderType.tableRow) {
                var baustein_dom_const_1 = baustein_dom;
                new LuxDragDrop(baustein_dom_const_1, {
                    mousedown: function (event) {
                        var document_activeElement = document.activeElement;
                        if (document_activeElement === null) {
                            console.error("[BausteinEditor] document.activeElement is null");
                        }
                        else {
                            console.log("dragdrop baustein_dom_const", baustein_dom_const_1);
                            console.log("dragdrop event", event);
                            var allow_dragdrop;
                            if (_this.cursor_mode === 0) {
                                // prevent draggable from starting if the click is on the editor
                                allow_dragdrop = elements_drag_not_allowed.includes(document_activeElement) === false;
                                console.log("allow_dragdrop", allow_dragdrop);
                            }
                            else if (_this.cursor_mode === 1) {
                                allow_dragdrop = true;
                            }
                            else {
                                console.info("[BausteinEditor] draggable not implemented for cursor mode:", _this.cursor_mode);
                                return false;
                            }
                            if (allow_dragdrop) {
                                // Test if the draggable is baustein_dom
                                if (baustein_dom_const_1 === event.target) {
                                    return true;
                                }
                                // Test if the draggable is baustein_dom at least one of its children
                                for (var i_2 = 0; i_2 < baustein_dom_const_1.children.length; i_2++) {
                                    var child = baustein_dom_const_1.children[i_2];
                                    if (child === event.target) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }
                    },
                    mousemove: null,
                    mouseup: function (e, reciever_element) {
                        // Go up the DOM Tree until we find a parent with the dataset "position_parent"
                        for (var tries = 0; tries < 4; tries++) {
                            if (typeof reciever_element.dataset.position_parent === "string") {
                                break;
                            }
                            else {
                                if (reciever_element.parentElement === null) {
                                    console.error("[BausteinEditor]", "reciever_element.parentElement is null");
                                    break;
                                }
                                else {
                                    reciever_element = reciever_element.parentElement;
                                }
                            }
                        }
                        if (typeof reciever_element.dataset.position_parent !== "string") {
                            console.error("[BausteinEditor]", "reciever_element.dataset.position_parent is not a string");
                        }
                        else if (typeof reciever_element.dataset.position_sort !== "string") {
                            console.error("[BausteinEditor]", "reciever_element.dataset.position_sort is not a string");
                        }
                        else {
                            var old_baustein_id = baustein_id;
                            var new_position = {
                                parent: reciever_element.dataset.position_parent === "0" ? 0 : (parseInt(reciever_element.dataset.position_parent) || null),
                                sort: reciever_element.dataset.position_sort === "0" ? 0 : (parseInt(reciever_element.dataset.position_sort) || null)
                            };
                            console.log("drop on addBausteinSelector: old_baustein_id", old_baustein_id, "new position", new_position);
                            if (new_position.sort === null) {
                                console.error("[BausteinEditor] LuxClickHoldDrag.callback_mouseup: new_position.sort is null");
                            }
                            else {
                                self.moveBaustein(old_baustein_id, new Position(new_position.parent, new_position.sort));
                            }
                        }
                    }, maxsizes: true
                });
                baustein_dom.addEventListener("dragend", function () {
                    baustein_dom.draggable = false;
                });
            }
        }
        return baustein_dom;
    };
    BausteinEditor.prototype.render = function () {
        this.dom.content.innerHTML = "";
        this.baustein_counter = 0;
        /*  Bausteine Recursive Graph Array
            this.data.bausteine[row] :: .parent :: .position
        */
        var bausteine = this.getBausteineChildren(null);
        for (var row = 0; row < bausteine.length; row++) {
            var baustein = bausteine[row];
            this.dom.content.appendChild(this.renderBausteinSelector(new Position(null, baustein.position.sort), true, true));
            this.dom.content.appendChild(this.renderBaustein(baustein, new Position(null, baustein.position.sort)));
        }
        this.dom.content.appendChild(this.renderBausteinSelector(new Position(null, this.getPositionSort(false)), false, true));
        this.preview_render();
    };
    BausteinEditor.prototype.bausteinSelector_open = function (be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2) {
        var max_width = 446;
        var window_width = window.innerWidth;
        var window_height = window.innerHeight;
        this.dom.underlay.style.display = "";
        be_bausteinSelector_layer.style.display = "";
        be_bausteinSelector_layer_item_container1.style.display = "";
        be_bausteinSelector_layer_item_container2.style.display = "none";
        be_bausteinSelector_layer.style.maxWidth = max_width + "px";
        be_bausteinSelector_layer.style.top = (window_height / 2 - be_bausteinSelector_layer.clientHeight / 2) + "px";
        be_bausteinSelector_layer.style.left = (window_width / 2 - max_width / 2) + "px";
        console.log("be_bausteinSelector", be_bausteinSelector);
        this.be_bausteinSelector_isOpen = true;
    };
    BausteinEditor.prototype.bausteinSelector_close = function (be_bausteinSelector, be_bausteinSelector_layer) {
        this.dom.underlay.style.display = "none";
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
        // Apply Page Styles
        /*
        var style_string = ".be_baustein  {";

        for (var i = 0; i < this.data.page.style.length; i++) {
            const formfield: HTMLFormElement = <HTMLFormElement> document.getElementById(this.dom_id+"_page_fc_"+this.data.page.style[i].property.name);
            this.data.page.style[i].value = formfield.value;
            style_string += this.data.page.style[i].property.name + ':' + this.data.page.style[i].value + ';';
        }
        style_string += '}';
        this.dom.page_styles.innerHTML = style_string;
        */
        // Apply Baustein Styles
        if (this.selected_baustein !== null && this.selected_baustein_id !== null) {
            var baustein = this.getBaustein(this.selected_baustein_id);
            var selected_baustein_editor = this.selected_baustein.lastChild;
            var nodes = this.dom.sidebar_content__baustein_styles.querySelectorAll(".be_formrow .be-form-control");
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
    /// create a forminput. first options item is default value. Returns {content: HTMLElement, input: HTMLInputElement|HTMLSelectElement}
    BausteinEditor.prototype.formcontrol = function (domArk, type, name, title, value, options) {
        var _this = this;
        var fc_dom_id = (this.dom_id + '_' + domArk + '_fc_' + name);
        var useDataValue = false;
        var suffix_const = options.suffix || [];
        var suffix_default = suffix_const.length ? suffix_const[0] : "";
        var be_formrow = this.createElement("div", "", "be_formrow");
        var form_control;
        if (type === "image") {
            var image_source_text_1 = be_formrow.appendChild(document.createElement("div"));
            image_source_text_1.innerText = value;
            image_source_text_1.style.fontSize = "0.6rem";
            image_source_text_1.style.marginBottom = "2px";
            var form_control_1 = be_formrow.appendChild(this.createElement("button", fc_dom_id, "be-form-control"));
            form_control_1.type = "button";
            form_control_1.innerHTML = title + " setzen";
            form_control_1.name = name;
            form_control_1.value = value;
            form_control_1.addEventListener("click", function () {
                if (_this.selected_baustein_id !== null) {
                    _this.dialog_media(bausteinRenderType.image).then(function (image_url) {
                        image_source_text_1.innerText = image_url;
                        form_control_1.value = image_url;
                        if (options.onchange)
                            options.onchange(form_control_1);
                    });
                }
            });
        }
        else {
            if (type === "checkbox") {
                form_control = be_formrow.appendChild(this.createElement("input", fc_dom_id, "be-form-control"));
                form_control.type = "checkbox";
                form_control.name = name;
                form_control.value = value;
                if (title !== null) {
                    var label = be_formrow.appendChild(this.createElement("label", "", ""));
                    label.htmlFor = fc_dom_id;
                    label.innerHTML = title;
                }
            }
            else {
                if (title !== null) {
                    var label = be_formrow.appendChild(this.createElement("label", "", ""));
                    label.htmlFor = fc_dom_id;
                    label.innerHTML = title;
                }
                var form_control_container = be_formrow.appendChild(this.createElement("div", "", "be-form-control-container"));
                if (type === "number") {
                    form_control_container.classList.add("number");
                }
                if (type === "select") {
                    form_control = form_control_container.appendChild(this.createElement("select", fc_dom_id, "be-form-control"));
                    form_control.name = name;
                    if (options.html_options) {
                        for (var i = 0; i < options.html_options.length; i++) {
                            var option_element = form_control.appendChild(this.createElement("option", "", ""));
                            option_element.value = options.html_options[i].value;
                            option_element.innerHTML = options.html_options[i].text;
                            if (options.html_options[i].value == value) {
                                option_element.setAttribute("selected", "selected");
                            }
                        }
                    }
                }
                else {
                    form_control = form_control_container.appendChild(this.createElement("input", fc_dom_id, "be-form-control"));
                    form_control.name = name;
                    form_control.value = value;
                    if (type === "color") {
                        form_control.type = "color";
                        useDataValue = true;
                    }
                    else if (type === "number") {
                        form_control.type = "text";
                        form_control.dataset.suffix = suffix_const;
                        var form_control_container_up = form_control_container.appendChild(this.createElement("div", "", "be-form-control-container_up"));
                        form_control_container_up.innerHTML = '⮝';
                        var form_control_container_down = form_control_container.appendChild(this.createElement("div", "", "be-form-control-container_down"));
                        form_control_container_down.innerHTML = '⮟';
                        var number_default_1 = options.number_default ? options.number_default : 0;
                        var number_min_1 = options.number_min ? options.number_min : null;
                        var number_max_1 = options.number_max ? options.number_max : null;
                        var formcontrol_number_1 = function (add) {
                            var value = form_control.value.replace(" ", "");
                            // constants check onChange; if one matches, use it
                            if (add === 0 && options.html_options && options.html_options.length > 0) {
                                for (var i_3 = 0; i_3 < options.html_options.length; i_3++) {
                                    var option = options.html_options[i_3];
                                    if (option.value === value) {
                                        form_control.value = value;
                                        return;
                                    }
                                }
                            }
                            // number check
                            var num = parseFloat(value);
                            var thus_suffix = suffix_default;
                            if (isNaN(num)) {
                                num = number_default_1;
                            }
                            else {
                                var cmp_suffix = form_control.value.replace(num, "");
                                for (var i = 0; i < suffix_const.length; i++) {
                                    if (cmp_suffix === suffix_const[i]) {
                                        thus_suffix = suffix_const[i];
                                        break;
                                    }
                                }
                            }
                            var countDecimals = num % 1 ? num.toString().split(".")[1].length : 0;
                            if (countDecimals === 0) {
                                num = num + add;
                            }
                            else {
                                var mltp = Math.pow(10, countDecimals);
                                num = Math.floor((num * mltp) + (add * mltp)) / mltp;
                            }
                            if (number_min_1 !== null && num < number_min_1) {
                                num = number_min_1;
                            }
                            else if (number_max_1 !== null && num > number_max_1) {
                                num = number_max_1;
                            }
                            form_control.value = num.toString() + thus_suffix;
                        };
                        form_control.addEventListener("change", function () {
                            formcontrol_number_1(0);
                            if (options.onchange)
                                options.onchange(form_control);
                        });
                        form_control.addEventListener("keydown", function (e) {
                            var steps = e.shiftKey ? 10 : (e.ctrlKey ? 0.1 : 1);
                            var keyCode = e.which | e.keyCode;
                            if (keyCode === 38) {
                                formcontrol_number_1(steps);
                                if (options.onchange)
                                    options.onchange(form_control);
                                return false;
                            }
                            else if (keyCode === 40) {
                                formcontrol_number_1(-steps);
                                if (options.onchange)
                                    options.onchange(form_control);
                                return false;
                            }
                        });
                        form_control_container_up.addEventListener("click", function () { formcontrol_number_1(+1); if (options.onchange)
                            options.onchange(form_control); });
                        form_control_container_down.addEventListener("click", function () { formcontrol_number_1(-1); if (options.onchange)
                            options.onchange(form_control); });
                    }
                    else {
                        form_control.type = "text";
                    }
                }
            }
            // Events
            if (type !== "number") {
                var _useDataValue_1 = useDataValue;
                if (_useDataValue_1) {
                    form_control.dataset.value = value;
                }
                form_control.addEventListener("change", function () {
                    if (_useDataValue_1) {
                        form_control.dataset.value = form_control.value;
                    }
                    if (options.onchange)
                        options.onchange(form_control);
                });
            }
            form_control.autocomplete = "off";
        }
        return { content: be_formrow, input: form_control };
    };
    /// helper funktion for creating a forminput of layout devtool. Position values: null = do not set, empty = center, non-empty = normal 
    BausteinEditor.prototype.layout_fc = function (baustein, styleName, default_value, top, right, bottom, left) {
        var _this = this;
        var bausteinStyleProperty = this.getStylePropertyByName(styleName);
        var bausteinStyleValue = baustein.getStyleValue(styleName, default_value);
        var be_layout_fc = this.formcontrol("baustein", "number", bausteinStyleProperty.name, null, bausteinStyleValue, {
            suffix: bausteinStyleProperty.suffix, html_options: bausteinStyleProperty.options, onchange: function () { return _this.apply_styles(); }
        }).content;
        be_layout_fc.style.width = "34px";
        be_layout_fc.style.height = "30px";
        if (top !== null)
            be_layout_fc.style.top = top === "" ? "calc(50% - (" + be_layout_fc.style.height + " / 2))" : top;
        if (bottom !== null)
            be_layout_fc.style.bottom = bottom === "" ? "calc(50% - (" + be_layout_fc.style.height + " / 2))" : bottom;
        if (left !== null)
            be_layout_fc.style.left = left === "" ? "calc(50% - (" + be_layout_fc.style.width + " / 2))" : left;
        if (right !== null)
            be_layout_fc.style.right = right === "" ? "calc(50% - (" + be_layout_fc.style.width + " / 2))" : right;
        return be_layout_fc;
    };
    BausteinEditor.prototype.open_baustein_attributes = function (baustein_id) {
        if (this.open_baustein_attributes__baustein_id === null || this.open_baustein_attributes__baustein_id !== baustein_id) {
            var current_baustein_1 = this.getBaustein(baustein_id);
            this.open_baustein_attributes__baustein_id = baustein_id;
            var self_1 = this;
            this.dom.sidebar_content__baustein_styles.innerHTML = "";
            this.dom.sidebar_content__baustein_misc.innerHTML = "";
            // Layout view like Firefox DevTools
            var be_layout_view = this.dom.sidebar_content__baustein_styles.appendChild(this.createElement("div", "", "be_layout_view"));
            // margin
            var be_layout_view_margin = be_layout_view.appendChild(this.createElement("div", "", "be_layout_view_margin"));
            var be_layout_view_margin_indicator = be_layout_view_margin.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_margin_indicator.innerHTML = "margin";
            be_layout_view_margin.appendChild(this.layout_fc(current_baustein_1, "margin-top", "0", "-6px", null, null, ""));
            be_layout_view_margin.appendChild(this.layout_fc(current_baustein_1, "margin-bottom", "0", null, null, "-6px", ""));
            be_layout_view_margin.appendChild(this.layout_fc(current_baustein_1, "margin-left", "0", "", null, null, "-6px"));
            be_layout_view_margin.appendChild(this.layout_fc(current_baustein_1, "margin-right", "0", "", "-6px", null, null));
            // border
            var be_layout_view_border = be_layout_view_margin.appendChild(this.createElement("div", "", "be_layout_view_border"));
            var be_layout_view_border_indicator = be_layout_view_border.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_border_indicator.innerHTML = 'border <i class="fas fa-edit"></i>';
            be_layout_view_border_indicator.addEventListener("click", function () {
                self_1.dialog_border(current_baustein_1);
            });
            be_layout_view_border.appendChild(this.layout_fc(current_baustein_1, "border-top-width", "0", "-13px", null, null, ""));
            be_layout_view_border.appendChild(this.layout_fc(current_baustein_1, "border-bottom-width", "0", null, null, "-13px", ""));
            be_layout_view_border.appendChild(this.layout_fc(current_baustein_1, "border-left-width", "0", "", null, null, "-14px"));
            be_layout_view_border.appendChild(this.layout_fc(current_baustein_1, "border-right-width", "0", "", "-14px", null, null));
            // padding
            var be_layout_view_padding = be_layout_view_border.appendChild(this.createElement("div", "", "be_layout_view_padding"));
            var be_layout_view_padding_indicator = be_layout_view_padding.appendChild(this.createElement("div", "", "be_layout_view_indicator"));
            be_layout_view_padding_indicator.innerHTML = "padding";
            be_layout_view_padding.appendChild(this.layout_fc(current_baustein_1, "padding-top", "0", "0px", null, null, ""));
            be_layout_view_padding.appendChild(this.layout_fc(current_baustein_1, "padding-bottom", "0", null, null, "0px", ""));
            be_layout_view_padding.appendChild(this.layout_fc(current_baustein_1, "padding-left", "0", "", null, null, "8px"));
            be_layout_view_padding.appendChild(this.layout_fc(current_baustein_1, "padding-right", "0", "", "8px", null, null));
            // inner
            var be_layout_view_inner = be_layout_view_padding.appendChild(this.createElement("div", "", "be_layout_view_inner"));
            be_layout_view_inner.appendChild(this.layout_fc(current_baustein_1, "width", "auto", null, null, null, null));
            be_layout_view_inner.appendChild(this.createElement("span", "", "be_layout_wh_delimiter")).innerHTML = " &times; ";
            be_layout_view_inner.appendChild(this.layout_fc(current_baustein_1, "height", "auto", null, null, null, null));
            ///////////////////////////////////////////////////////
            if (current_baustein_1.renderType === bausteinRenderType.image) {
                var image_fcr = self_1.formcontrol("image_selector", "image", "", "Bild", current_baustein_1.content, {
                    onchange: function (form_control) {
                        current_baustein_1.content = form_control.value;
                        if (self_1.selected_baustein !== null) {
                            var img = self_1.selected_baustein.querySelector("img");
                            if (img !== null) {
                                img.src = form_control.value;
                            }
                        }
                    }
                });
                self_1.dom.sidebar_content__baustein_misc.appendChild(image_fcr.content);
                var alt_formcontroll_1 = this.formcontrol("baustein_alt", "text", "alt", 'Alternativtext (alt)', current_baustein_1.getAttribute("alt") || "", {
                    onchange: function () {
                        current_baustein_1.setAttribute("alt", alt_formcontroll_1.input.value);
                    }
                });
                this.dom.sidebar_content__baustein_styles.appendChild(alt_formcontroll_1.content);
                var title_formcontroll_1 = this.formcontrol("baustein_title", "text", "title", 'Titel', current_baustein_1.getAttribute("title") || "", {
                    onchange: function () {
                        current_baustein_1.setAttribute("title", title_formcontroll_1.input.value);
                    }
                });
                this.dom.sidebar_content__baustein_styles.appendChild(alt_formcontroll_1.content);
            }
            else if (current_baustein_1.renderType === bausteinRenderType.iframe) {
                var image_fcr = self_1.formcontrol("src_input", "text", "", "Webseiten URL", current_baustein_1.getAttribute("src") || "", {
                    onchange: function (form_control) {
                        current_baustein_1.setAttribute("src", form_control.value);
                        if (self_1.selected_baustein !== null) {
                            var iframe = self_1.selected_baustein.querySelector("iframe");
                            if (iframe !== null) {
                                iframe.src = form_control.value;
                            }
                        }
                    }
                });
                self_1.dom.sidebar_content__baustein_misc.appendChild(image_fcr.content);
            }
            else if (current_baustein_1.renderType === bausteinRenderType.layout || current_baustein_1.renderType === bausteinRenderType.table) {
                var rowcol_container = this.dom.sidebar_content__baustein_styles.appendChild(this.createElement("div", "", "be_rowcol_container"));
                var table_children_1 = current_baustein_1.renderType === bausteinRenderType.table ? this.getBausteineChildren(current_baustein_1.id) : [];
                var columns_fcr_1 = self_1.formcontrol("dialog", "number", "columns", "Spalten", current_baustein_1.columns.toString(), {
                    number_default: 1, number_min: 1, number_max: 40,
                    onchange: function () {
                        var parsed_value = parseInt(columns_fcr_1.input.value);
                        console.log("parsed_value", parsed_value);
                        if (isNaN(parsed_value) === false) {
                            console.log("current_baustein.columns", current_baustein_1.columns);
                            current_baustein_1.columns = parsed_value;
                            console.log("current_baustein.columns 2", current_baustein_1.columns);
                            table_children_1.forEach(function (child) { return child.columns = parsed_value; });
                            self_1.rowcol_amount_evaluate();
                            self_1.render();
                        }
                    }
                });
                columns_fcr_1.content.style.display = "inline-block";
                columns_fcr_1.content.style.verticalAlign = "top";
                columns_fcr_1.content.style.width = "100px";
                rowcol_container.appendChild(columns_fcr_1.content);
                if (current_baustein_1.renderType === bausteinRenderType.table) {
                    var rows_fcr = self_1.formcontrol("dialog", "number", "rows", "Reihen", current_baustein_1.rows.toString(), {
                        number_default: 1, number_min: 1, number_max: 40,
                        onchange: function () {
                            var parsed_value = parseInt(rows_fcr.input.value);
                            if (isNaN(parsed_value) === false) {
                                current_baustein_1.rows = parsed_value;
                                self_1.rowcol_amount_evaluate();
                                self_1.render();
                            }
                        }
                    });
                    rows_fcr.content.style.display = "inline-block";
                    rows_fcr.content.style.verticalAlign = "top";
                    rows_fcr.content.style.width = "100px";
                    rowcol_container.appendChild(rows_fcr.content);
                }
            }
            else if (current_baustein_1.tag === "a") {
                var href_formcontroll_1 = this.formcontrol("baustein_href", "text", "href", 'Link (href)', current_baustein_1.getAttribute("href") || "", {
                    onchange: function () {
                        current_baustein_1.setAttribute("href", href_formcontroll_1.input.value);
                    }
                });
                this.dom.sidebar_content__baustein_styles.appendChild(href_formcontroll_1.content);
                // new tab
                var target_formcontroll_1 = this.formcontrol("baustein_target", "checkbox", "target", 'in neuen Tab öffnen', current_baustein_1.getAttribute("target") || "", {
                    onchange: function () {
                        var target_formcontroll_input = target_formcontroll_1.input;
                        current_baustein_1.setAttribute("target", target_formcontroll_input.checked ? "_blank" : "");
                    }
                });
                this.dom.sidebar_content__baustein_styles.appendChild(target_formcontroll_1.content);
            }
            for (var i = 0; i < current_baustein_1.style.length; i++) {
                var element = current_baustein_1.style[i];
                if (element.property.showInBausteinAttributesSidebar) {
                    // styleProperty is necessery to fix the bug where a refernce points to an undefined object
                    var styleProperty = this.getStylePropertyByName(element.property.name);
                    this.dom.sidebar_content__baustein_styles.appendChild(this.formcontrol("baustein", styleProperty.type, styleProperty.name, styleProperty.title, element.value, {
                        suffix: styleProperty.suffix, html_options: styleProperty.options, onchange: function () {
                            self_1.apply_styles();
                        }
                    }).content);
                }
            }
            // toggleableClasses
            if (current_baustein_1.toggleableClasses.length > 0) {
                var toggleableClasses_container = this.dom.sidebar_content__baustein_styles.appendChild(this.createElement("div", "", "be_toggleable_classes_container"));
                var toggleableClasses_title = toggleableClasses_container.appendChild(this.createElement("div", "", "be_toggleable_classes_title"));
                toggleableClasses_title.innerHTML = "Togglebale Klassen";
                var toggleableClasses_content = toggleableClasses_container.appendChild(this.createElement("div", "", "be_toggleable_classes_content"));
                var _loop_3 = function () {
                    var toggleableClass = current_baustein_1.toggleableClasses[i];
                    if (toggleableClass.toggleable) {
                        var toggleableClass_container = toggleableClasses_content.appendChild(this_2.createElement("div", "", "be_toggleable_class_container"));
                        var toggleableClass_class_input_1 = toggleableClass_container.appendChild(this_2.createElement("input", "", "be_toggleable_class_class_input"));
                        toggleableClass_class_input_1.type = "checkbox";
                        toggleableClass_class_input_1.checked = toggleableClass.active;
                        toggleableClass_class_input_1.addEventListener("change", function () {
                            toggleableClass.active = toggleableClass_class_input_1.checked;
                            // IF is active, add class to class, otherwise remove class
                            if (toggleableClass.active) {
                                current_baustein_1.addClass(toggleableClass.name);
                            }
                            else {
                                current_baustein_1.removeClass(toggleableClass.name);
                            }
                        });
                        var toggleableClass_label = toggleableClass_container.appendChild(this_2.createElement("label", "", "be_toggleable_class_title"));
                        toggleableClass_label.innerHTML = toggleableClass.name;
                    }
                };
                var this_2 = this;
                for (var i = 0; i < current_baustein_1.toggleableClasses.length; i++) {
                    _loop_3();
                }
            }
            var class_formcontroll_1 = this.formcontrol("baustein_class", "text", "class", 'CSS Klassen <div style="font-size: 11px; margin-bottom: 2px;">(für Fortgeschrittene Nutzer)</div>', current_baustein_1.class, {
                onchange: function () {
                    current_baustein_1.class = class_formcontroll_1.input.value;
                }
            });
            this.dom.sidebar_content__baustein_misc.appendChild(class_formcontroll_1.content);
            if (current_baustein_1.renderType !== bausteinRenderType.spoiler_toggler && current_baustein_1.renderType !== bausteinRenderType.spoiler_content) {
                var baustein_delete_button = this.dom.sidebar_content__baustein_misc.appendChild(this.createElement("button", this.dom_id + '_deleteBaustein', "be-form-control bautstein-delete"));
                baustein_delete_button.innerHTML = "Baustein löschen";
                baustein_delete_button.type = "button";
                baustein_delete_button.addEventListener("click", function () {
                    dialog.start("Baustein löschen", "Sind Sie sich sicher, dass Sie diesen Baustein löschen wollen?", null, "Löschen", "Abbrechen", null, function () {
                        self_1.close_baustein_attributes();
                        self_1.deleteBaustein(baustein_id);
                        dialog.close();
                    });
                });
            }
            this.dom.sidebar_content__site.style.display = "none";
            this.dom.sidebar_header_col__site.classList.remove("active");
            this.dom.sidebar_content__baustein.style.display = "";
            this.dom.sidebar_header_col__baustein.classList.add("active");
            this.dom.sidebar_header_col__baustein.classList.remove("disabled");
        }
    };
    // returns the value of the pointed array item OR attribute def on fail
    BausteinEditor.prototype.getItemFromArray = function (array, index, def) {
        if (typeof array[index] === "undefined") {
            return def;
        }
        else {
            return array[index];
        }
    };
    BausteinEditor.prototype.close_baustein_attributes = function () {
        this.dom.sidebar_content__site.style.display = "";
        this.dom.sidebar_header_col__site.classList.add("active");
        this.dom.sidebar_content__baustein.style.display = "none";
        this.dom.sidebar_header_col__baustein.classList.remove("active");
        this.dom.sidebar_header_col__baustein.classList.add("disabled");
    };
    BausteinEditor.prototype.preview_render = function () {
        var _this = this;
        if (this.dom.preview_content.style.display === "") {
            if (this.preview_iframe_url === null) {
                this.dom.preview_content.innerHTML = this.export().html;
                // Make all a tags open in new tab
                var a_tags = this.dom.preview_content.getElementsByTagName("a");
                for (var i = 0; i < a_tags.length; i++) {
                    a_tags[i].target = "_blank";
                }
                // Make all img tags undraggable
                var img_tags = this.dom.preview_content.getElementsByTagName("img");
                for (var i = 0; i < img_tags.length; i++) {
                    img_tags[i].setAttribute("draggable", "false");
                }
            }
            else {
                // Create iframe
                var preview_iframe = this.dom.preview_content.querySelector("iframe");
                if (preview_iframe === null) {
                    this.dom.preview_content.innerHTML = "";
                    preview_iframe = this.dom.preview_content.appendChild(this.createElement("iframe", "", "be_preview_iframe"));
                    preview_iframe.src = this.preview_iframe_url;
                    preview_iframe.onload = function () {
                        preview_iframe.contentWindow.postMessage(_this.export().html, '*');
                    };
                }
                else {
                    preview_iframe.contentWindow.postMessage(this.export().html, '*');
                }
            }
        }
    };
    BausteinEditor.prototype.request = function (type, endpoint, params) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.dom.ajax_loader.style.display = "";
            self.dom.ajax_loader.style.width = "";
            self.dom.ajax_loader.style.minWidth = "";
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                self.dom.ajax_loader.style.width = (4 / this.readyState) * 80 + "%";
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        resolve(this);
                    }
                    else {
                        reject(this);
                    }
                    self.dom.ajax_loader.style.width = "100%";
                    setTimeout(function () {
                        self.dom.ajax_loader.style.display = "none";
                    }, 1000);
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
    BausteinEditor.prototype.dialog_border = function (baustein) {
        var _this = this;
        var border_modall = document.createElement("div");
        var tabcontainer = border_modall.appendChild(document.createElement("div"));
        var contentcontainer = border_modall.appendChild(document.createElement("div"));
        var tabs_name = ["style", "color", "radius"];
        var tabs_dom = [];
        var tabs_container_dom = [];
        var inputs = [];
        var _loop_4 = function () {
            var index_const = i;
            tabs_dom[i] = tabcontainer.appendChild(document.createElement("div"));
            tabs_dom[i].className = "border_modall_tab";
            tabs_dom[i].innerHTML = tabs_name[i];
            tabs_container_dom[i] = contentcontainer.appendChild(document.createElement("div"));
            tabs_container_dom[i].className = "border_modall_tabcontent";
            tabs_container_dom[i].style.display = "none";
            tabs_dom[i].addEventListener("click", function () {
                for (var i = 0; i < tabs_dom.length; i++) {
                    tabs_dom[i].classList.remove("active");
                    tabs_container_dom[i].style.display = "none";
                }
                tabs_dom[index_const].classList.add("active");
                tabs_container_dom[index_const].style.display = "";
            });
        };
        for (var i = 0; i < tabs_name.length; i++) {
            _loop_4();
        }
        tabs_dom[0].classList.add("active");
        tabs_container_dom[0].style.display = "";
        var sides = ["top", "right", "bottom", "left"];
        // style
        var style_index = 0;
        var style_options = [
            new Option("normal", "initial"), new Option("solid", "solid"), new Option("dashed", "dashed"), new Option("dotted", "dotted"), new Option("double", "double")
        ];
        for (var s = 0; s < sides.length; s++) {
            var side = sides[s];
            var name_1 = "border-" + side + "-style";
            var value = baustein.getStyleValue(name_1, "");
            var fc = this.formcontrol(name_1, "select", name_1, name_1, value, { html_options: style_options });
            tabs_container_dom[style_index].appendChild(fc.content);
            inputs.push(fc.input);
        }
        // color
        var color_index = 1;
        for (var s = 0; s < sides.length; s++) {
            var side = sides[s];
            var name_2 = "border-" + side + "-color";
            var value = baustein.getStyleValue(name_2, "");
            var fc = this.formcontrol(name_2, "color", name_2, name_2, value, {});
            tabs_container_dom[color_index].appendChild(fc.content);
            inputs.push(fc.input);
        }
        // radius
        var radius_index = 2;
        var radius_corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
        radius_corners.forEach(function (corner) {
            var name = "border-" + corner + "-radius";
            var value = baustein.getStyleValue(name, "0px");
            var fc = _this.formcontrol(name, "number", name, name, value, {
                number_min: 0, suffix: ["px", "%"]
            });
            tabs_container_dom[radius_index].appendChild(fc.content);
            inputs.push(fc.input);
        });
        dialog.start("Border Einstellungen", border_modall, "Speichern", null, "Abbrechen", function () {
            for (var i_4 = 0; i_4 < inputs.length; i_4++) {
                var input = inputs[i_4];
                baustein.setStyle(input.name, input.value);
            }
            _this.apply_styles();
            dialog.close();
        }, null, null);
    };
    BausteinEditor.prototype.dialog_rowcol = function (baustein) {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var content = self.createElement("div", "", "");
                        var columns_fcr = self.formcontrol("dialog", "number", "columns", "Spalten", "", {
                            number_default: 1, number_min: 1, number_max: 40,
                        });
                        columns_fcr.content.style.display = "inline-block";
                        columns_fcr.content.style.verticalAlign = "top";
                        columns_fcr.content.style.width = "100px";
                        columns_fcr.input.value = "1";
                        content.appendChild(columns_fcr.content);
                        if (baustein.renderType === bausteinRenderType.table) {
                            var rows_fcr = self.formcontrol("dialog", "number", "rows", "Reihen", "", {
                                number_default: 1, number_min: 1, number_max: 40,
                            });
                            rows_fcr.content.style.display = "inline-block";
                            rows_fcr.content.style.verticalAlign = "top";
                            rows_fcr.content.style.width = "100px";
                            rows_fcr.input.value = "1";
                            content.appendChild(rows_fcr.content);
                        }
                        var error_message = self.createElement("div", "", "error-message");
                        error_message.style.color = "red";
                        dialog.start(baustein.title + " erstellen", content, 'Fertigstellen', null, 'Abbrechen', function () {
                            var columns_number = parseInt(columns_fcr.input.value);
                            if (columns_number < 1) {
                                error_message.innerHTML = '"Spalten Anzahl" muss größer als 0 sein';
                                return false;
                            }
                            else {
                                baustein.columns = columns_number;
                            }
                            if (baustein.renderType === bausteinRenderType.table) {
                                var rows_number = parseInt(rows_fcr.input.value);
                                if (rows_number < 1) {
                                    error_message.innerHTML = '"Reihen Anzahl" muss größer als 0 sein';
                                    return false;
                                }
                                else {
                                    baustein.rows = rows_number;
                                }
                            }
                            resolve(null);
                            dialog.close();
                        }, null, function () {
                            dialog.close();
                            reject();
                        });
                    })];
            });
        });
    };
    BausteinEditor.prototype.dialog_media = function (renderType) {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
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
                        content_search.style.paddingBottom = "20px";
                        var content_search_input = content_search.appendChild(self.createElement("input", "", "be-dialog-media-search-input be-form-control"));
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
                        content_search_submit.style.marginBottom = "0";
                        content_search_input.style.width = "calc(100% - " + content_search_submit.style.width + " - " + content_search_submit.style.marginLeft + ")";
                        var content_results = content.appendChild(self.createElement("div", "", "be-dialog-media-results"));
                        content_results.style.overflowY = "auto";
                        content_results.style.maxHeight = "90vh";
                        // Pagination
                        var current_page = 1;
                        var pagination = content.appendChild(self.createElement("div", "", "be-dialog-media-pagination"));
                        var pagination_prev = pagination.appendChild(self.createElement("button", "", "__dialog-btn"));
                        pagination_prev.type = "button";
                        pagination_prev.innerText = "Zurück";
                        pagination_prev.disabled = true;
                        var pagination_current = pagination.appendChild(self.createElement("div", "", ""));
                        pagination_current.innerText = "1";
                        var pagination_next = pagination.appendChild(self.createElement("button", "", "__dialog-btn"));
                        pagination_next.type = "button";
                        pagination_next.innerText = "Vorwärts";
                        // Events
                        function start_search(page) {
                            if (page < 1)
                                return;
                            pagination_prev.disabled = true;
                            pagination_next.disabled = true;
                            current_page = page;
                            pagination_current.innerText = page.toString();
                            self.request("GET", search_endpoint, "&q=" + content_search_input.value + "&p=" + current_page)
                                .then(function (response) {
                                var json = JSON.parse(response.responseText);
                                var media_array = json.media;
                                content_results.innerHTML = '';
                                var _loop_5 = function (i) {
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
                                    image_container.style.position = "relative";
                                    image_container.style.width = "100%";
                                    image_container.style.height = "200px";
                                    image_container.style.cursor = "pointer";
                                    image_container.addEventListener("click", function () {
                                        self.fullscreen_image_modal_show(element.url);
                                    });
                                    image = image_container.appendChild(self.createElement("img", "", ""));
                                    image.src = element.url;
                                    image.style.maxWidth = "100%";
                                    image.style.maxHeight = "100%";
                                    image_plus = image_container.appendChild(self.createElement("div", "", ""));
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
                                    image_plus.innerHTML = '<i class="fas fa-search-plus"></i>';
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
                                            resolve(json.url);
                                            dialog.close();
                                        });
                                    });
                                };
                                var row, image_container, image, image_plus, title, button;
                                for (var i = 0; i < media_array.length; i++) {
                                    _loop_5(i);
                                }
                                if (current_page > 1)
                                    pagination_prev.disabled = false;
                                pagination_next.disabled = false;
                            });
                        }
                        content_search_input.addEventListener("change", function () { return start_search(1); });
                        content_search_submit.addEventListener("click", function () { return start_search(1); });
                        pagination_prev.addEventListener("click", function () { return start_search(current_page - 1); });
                        pagination_next.addEventListener("click", function () { return start_search(current_page + 1); });
                        dialog.start("Bild laden", content, '<i class="fas fa-sync"></i> Ansicht aktualisieren', null, 'Abbrechen', function () {
                            start_search(current_page);
                        }, null, function () {
                            dialog.close();
                            reject();
                        });
                        //content_results.style.height = "calc(500px - "+content_search.clientHeight+"px - "+content_search.style.paddingBottom+" - "+pagination.clientHeight+"px)";
                        content_results.style.height = (500 - content_search.clientHeight - pagination.clientHeight) + "px";
                        if (self.imageUpload !== null) {
                            var __dialog_footer = document.getElementById("__dialog_footer");
                            var upload_button = self.createElement("button", "", "__dialog-btn __dialog-btn-cyan");
                            upload_button.innerHTML = '<i class="fas fa-upload"></i> Bild hochladen';
                            upload_button.addEventListener("click", function () { if (self.imageUpload !== null)
                                self.imageUpload(); });
                            __dialog_footer === null || __dialog_footer === void 0 ? void 0 : __dialog_footer.prepend(upload_button);
                        }
                        start_search(1);
                    })];
            });
        });
    };
    BausteinEditor.prototype.fullscreen_image_modal_show = function (url) {
        var fullscreen_image_modal = document.getElementById("fullscreen_image_modal");
        if (fullscreen_image_modal === null) {
            fullscreen_image_modal = document.body.appendChild(this.createElement("div", "fullscreen_image_modal", "be-fullscreen-image-modal"));
            fullscreen_image_modal.addEventListener("click", function () { if (fullscreen_image_modal !== null)
                fullscreen_image_modal.style.display = "none"; });
            var fullscreen_close = fullscreen_image_modal.appendChild(this.createElement("div", "", "be-fullscreen-image-modal-close"));
            fullscreen_close.innerHTML = '<i class="fas fa-times"></i>';
        }
        else {
            fullscreen_image_modal.style.display = "";
        }
        var fullscreen_image = document.getElementById("fullscreen_image_modal_image")
            || fullscreen_image_modal.appendChild(this.createElement("img", "fullscreen_image_modal_image", "be-fullscreen-image-modal-image"));
        fullscreen_image.src = url;
    };
    BausteinEditor.prototype.import = function (data) {
        this.data.bausteine = [];
        for (var i = 0; i < data.bausteine.length; i++) {
            var data_baustein = data.bausteine[i];
            // set baustein_id_counter from data
            if (data_baustein.id >= this.baustein_id_counter) {
                this.baustein_id_counter = data_baustein.id + 1;
            }
            // recreate Baustein from data, but initiate with template
            var template_baustein = this.getBausteinType(data_baustein.type);
            var baustein = new Baustein(data_baustein.id, data_baustein.position, data_baustein.type, template_baustein.title, template_baustein.tag, template_baustein.renderType, data_baustein.toggleableClasses, data_baustein.attributes, data_baustein.style);
            baustein.content = data_baustein.content;
            baustein.columns = data_baustein.columns;
            baustein.rows = data_baustein.rows;
            baustein.attributes = data_baustein.attributes;
            if (data_baustein.class !== "") {
                if (baustein.class !== "")
                    baustein.class += " ";
                baustein.class += data_baustein.class;
            }
            baustein.style = data_baustein.style;
            this.data.bausteine.push(baustein);
        }
        this.render();
    };
    /*
        @param baustein : Baustein          // Baustein to render to HTML
        @param tag_override : tag_override  // Tag Overide; used to override the tag of the baustein. Currently only used for the "text" baustein type
    */
    BausteinEditor.prototype.export_createBausteinElement = function (baustein, tag_override) {
        if (tag_override === void 0) { tag_override = null; }
        console.log("export_createBausteinElement", baustein, tag_override);
        if (baustein.tag === "") {
            // IS text node
            var text_node = document.createTextNode(baustein.content);
            if (tag_override !== null) {
                var bausteinElement = document.createElement(tag_override);
                bausteinElement.appendChild(text_node);
                return bausteinElement;
            }
            return text_node;
        }
        else {
            // IS html node
            var tag, id;
            if (tag_override === null) {
                tag = baustein.tag;
                id = baustein.type;
            }
            else {
                tag = tag_override;
                id = tag_override;
            }
            var bausteinElement_1 = document.createElement(tag);
            for (var i = 0; i < baustein.attributes.length; i++) {
                var attribute = baustein.attributes[i];
                bausteinElement_1.setAttribute(attribute.name, attribute.value);
            }
            bausteinElement_1.className = "baustein baustein--" + id;
            if (baustein.class !== "")
                bausteinElement_1.className += " " + baustein.class;
            for (var s = 0; s < baustein.style.length; s++) {
                var style = baustein.style[s];
                if (style.value !== "" && style.value !== "0" && style.value !== "auto" && style.value !== "initial" && style.value !== "normal"
                    && (style.property.options.length === 0 || style.value !== style.property.options[0].value)) {
                    // get this.types[].style[] and check if it is not default value
                    var ok = true, test_type = this.getBausteinType(id), test_type_index = -1;
                    // Test only for default value on renderType "richtext"
                    if (baustein.renderType === bausteinRenderType.richtext) {
                        for (var b = 0; b < test_type.style.length; b++) {
                            var test_style = test_type.style[b];
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
                        console.log("test_type.style", test_type.style);
                        // IF index === -1, then the style is not in the style list of the type. this is intended and means that the style should be used directly
                        if (test_type_index !== -1 && test_type.style[test_type_index].property.useAsClass) {
                            bausteinElement_1.classList.add(style.value);
                        }
                        else {
                            bausteinElement_1.style.setProperty(style.property.name, style.value);
                        }
                    }
                }
            }
            if (tag_override === null) {
                if (baustein.renderType === bausteinRenderType.image) {
                    var bausteinElement_img = bausteinElement_1;
                    bausteinElement_img.src = baustein.content;
                }
                else {
                    bausteinElement_1.innerHTML = baustein.content;
                }
            }
            // Children
            var child_bausteine = this.getBausteineChildren(baustein.id);
            for (var r = 0; r < child_bausteine.length; r++) {
                var child = child_bausteine[r];
                var child_tag_override = null;
                if (baustein.renderType === bausteinRenderType.tableRow)
                    child_tag_override = "td";
                //else if(baustein.renderType === bausteinRenderType.layout) child_tag_override = "div";
                // just append it OR create a column child and append it
                if (child_tag_override === null) {
                    bausteinElement_1.appendChild(this.export_createBausteinElement(child));
                }
                else {
                    if (child.type === this.types.td.type || child.type === this.types.th.type) {
                        bausteinElement_1.appendChild(this.export_createBausteinElement(child));
                    }
                    else {
                        var bausteinElement_col = bausteinElement_1.appendChild(document.createElement(child_tag_override));
                        bausteinElement_col.appendChild(this.export_createBausteinElement(child));
                    }
                }
            }
            return bausteinElement_1;
        }
    };
    BausteinEditor.prototype.export = function () {
        var export_html_dom = this.createElement("div", "", "be-article");
        for (var s = 0; s < this.data.page.style.length; s++) {
            var style = this.data.page.style[s];
            if (style.value !== "" && style.value !== "0" && style.value !== "auto" && (style.property.options.length === 0 && style.value !== style.property.options[0])) {
                export_html_dom.style.setProperty(style.property.name, style.value);
            }
        }
        var bausteine = this.getBausteineChildren(null);
        for (var row = 0; row < bausteine.length; row++) {
            var baustein = bausteine[row];
            if (baustein.renderType !== bausteinRenderType.bausteinSelector) {
                export_html_dom.appendChild(this.export_createBausteinElement(baustein, null));
            }
        }
        return {
            data: this.data,
            html: export_html_dom.outerHTML
        };
    };
    return BausteinEditor;
}());
var LuxDragDrop = /** @class */ (function () {
    function LuxDragDrop(target, options) {
        var _this = this;
        this.isHeld = false;
        this.timeoutId = 0;
        this.drag_element = null;
        this.offset_x = 0;
        this.offset_y = 0;
        this.on_mousedown = function (e) {
            if (!_this.isHeld) {
                _this.timeoutId = setTimeout(function () {
                    if (_this.callback_mousedown !== null) {
                        var res = _this.callback_mousedown(e);
                        console.log("this.callback_mousedown", _this.callback_mousedown);
                        console.log("callback_mousedown res", res);
                        if (res === false) {
                            return false;
                        }
                        console.log("callback_mousedown 2222");
                    }
                    _this.isHeld = true;
                    _this.target.classList.add("disabled");
                    _this.clearSelection();
                    // create ghost element
                    var width = _this.target.offsetWidth, height = _this.target.offsetHeight;
                    if (_this.maxsizes) {
                        if (width > 100)
                            width = 100;
                        if (height > 100)
                            height = 100;
                    }
                    _this.drag_element = document.createElement(_this.target.tagName);
                    _this.drag_element.className = _this.target.className;
                    _this.drag_element.innerHTML = _this.target.innerHTML;
                    _this.drag_element.style.width = width + "px";
                    _this.drag_element.style.height = height + "px";
                    document.body.appendChild(_this.drag_element);
                    console.log("this.target", _this.target);
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
                    // start mouse movement tracking
                    ["mousemove", "touchmove"].forEach(function (type) {
                        document.body.addEventListener(type, _this.on_mousemove);
                    });
                    _this.offset_x = width / 2;
                    _this.offset_y = height / 2;
                }, 200);
            }
            // always start mouseup so we can stop tracking / kill the events
            ["mouseup", "touchend", "touchcancel"].forEach(function (type) {
                document.body.addEventListener(type, _this.on_mouseup);
            });
        };
        this.on_mousemove = function (e) {
            if (_this.drag_element !== null) {
                _this.drag_element.style.left = (e.clientX - _this.offset_x) + "px";
                _this.drag_element.style.top = (e.clientY - _this.offset_y) + "px";
                if (_this.callback_mousemove !== null)
                    _this.callback_mousemove(e);
            }
        };
        this.on_mouseup = function (e) {
            clearTimeout(_this.timeoutId);
            if (_this.isHeld) {
                _this.isHeld = false;
                _this.target.classList.remove("disabled");
                if (_this.drag_element !== null) {
                    _this.drag_element.remove();
                    _this.drag_element = null;
                }
                document.querySelectorAll(".ondrag").forEach(function (elem) { elem.remove(); });
                document.body.classList.remove("grabbing");
                // mouseup events on boards and items (drag reciever)
                var elementTarget = _this.elementFromPoint(e.clientX, e.clientY);
                if (elementTarget === null) {
                    console.error("[LuxClickHoldDrag] Oh well bad, elementTarget is null. Uff.");
                }
                else {
                    if (_this.callback_mouseup !== null)
                        _this.callback_mouseup(e, elementTarget);
                }
            }
            // kill mouse movement tracking
            ["mousemove", "touchmove"].forEach(function (type) {
                document.body.removeEventListener(type, _this.on_mousemove);
            });
            ["mouseup", "touchend", "touchcancel"].forEach(function (type) {
                document.body.removeEventListener(type, _this.on_mouseup);
            });
        };
        this.target = target;
        this.callback_mousedown = options.mousedown || null;
        this.callback_mousemove = options.mousemove || null;
        this.callback_mouseup = options.mouseup || null;
        this.maxsizes = options.maxsizes || true;
        ["mousedown", "mousestart"].forEach(function (type) {
            _this.target.addEventListener(type, _this.on_mousedown);
        });
    }
    LuxDragDrop.prototype.elementFromPoint = function (x, y) {
        var elem = document.elementFromPoint(x, y);
        return elem;
    };
    LuxDragDrop.prototype.clearSelection = function () {
        if (window !== null && window.getSelection) {
            var selection = window.getSelection();
            if (selection !== null)
                selection.removeAllRanges();
        }
    };
    return LuxDragDrop;
}());
