const BausteinRenderType = {
    layout: 0,
    plaintext: 1,
    richtext: 2,
    image: 3,
};

class Baustein {
    constructor(id, title, icon, tag, hasEndtag, renderType, style) {
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
        this.childCount = 0;
    }
}

class BausteinStyle {
    constructor(property, value) {
        this.property = property;
        this.value = value;
    }
}


class BausteinEditor {
    constructor(dom_id) {
        this.dom_id = dom_id;
        this.dom = {};
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
        ];

        this.types = {
             h1: new Baustein("h1", "Überschrift 1", 'H1', "h1", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1.375rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                ])
            ,h2: new Baustein("h2", "Überschrift 2", 'H2', "h2", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1.25rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                ])
            ,h3: new Baustein("h3", "Überschrift 3", 'H3', "h3", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1.125rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                ])
            ,h4: new Baustein("h4", "Überschrift 4", 'H4', "h4", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1.1rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                ])
            ,h5: new Baustein("h5", "Überschrift 5", 'H5', "h5", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"1rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                ])
            ,h6: new Baustein("h6", "Überschrift 6", 'H6', "h6", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"0.9rem" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"bold" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                ])
            ,text: new Baustein("text", "Paragraph (Text)", '<i class="fas fa-paragraph"></i>', "p", true, BausteinRenderType.richtext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.font_weight, value:"" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                ])
            ,html: new Baustein("html", "HTML", '<i class="fab fa-html5"></i>', "div", true, BausteinRenderType.plaintext, [
                    { property: this.styleProperties.font_family, value:"" },
                    { property: this.styleProperties.font_size, value:"" },
                    { property: this.styleProperties.text_align, value:"" },
                    { property: this.styleProperties.text_decoration, value:"" },
                    { property: this.styleProperties.font_style, value:"" },
                ])
            ,script: new Baustein("script", "Script", '<i class="fas fa-code"></i>', "script", true, BausteinRenderType.plaintext, [])
            ,shortcode: new Baustein("shortcode", "Shortcode []", '<i class="fas fa-code"></i>', "span", true, BausteinRenderType.plaintext, [])
            ,picture: new Baustein("picture", "Bild", '<i class="fas fa-image"></i>', "img", false, BausteinRenderType.image, [])
            ,layout: new Baustein("layout", "Layout", '<i class="fas fa-layer-group" style="transform: rotate(90deg);"></i>', "div", true, BausteinRenderType.layout, layout_styles)
            ,table: new Baustein("table", "Tabelle", '<i class="fas fa-table"></i>', "table", true, BausteinRenderType.layout, layout_styles)
        };

        this.bausteinSelector = [
            { type: 1, title: "Überschriften", icon: '<i class="fas fa-heading"></i>', items: [ this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6 ] }
            ,{ type: 0, baustein: this.types.text }
            ,{ type: 0, baustein: this.types.picture }
            ,{ type: 0, baustein: this.types.layout }
            ,{ type: 0, baustein: this.types.table }
            ,{ type: 1, title: "Sonstiges", icon: '<i class="fas fa-cubes"></i>', items: [ this.types.html, this.types.script, this.types.shortcode ] }
        ];


        // Main Content
        var content = '<style id="'+dom_id+'_page_styles"></style>'
            +'<div id="'+dom_id+'_main" class="be_main"> <div id="'+dom_id+'_underlay" class="be_underlay"></div> <div id="'+dom_id+'_content" class="be_content"></div> </div>';
        
        // Sidebar Content
        content += '<div id="'+dom_id+'_sidebar" class="be_sidebar">';
        
        content += '<div id="'+dom_id+'_sidebar_header" class="be_sidebar_header">';
        content += '<div id="'+dom_id+'_sidebar_header_col__site" class="be_sidebar_header_col active">Seite</div>';
        content += '<div id="'+dom_id+'_sidebar_header_col__baustein" class="be_sidebar_header_col disabled">Baustein</div>';
        content += '</div>';

        content += '<div id="'+dom_id+'_sidebar_content__site" class="be_sidebar_content">';

        for (var i = 0; i < this.data.page.style.length; i++) {
            const element = this.data.page.style[i];
            content += this.formcontroll("page", element.property.type, element.property.name, element.property.title, element.value, element.property.suffix, element.property.options);
        }

        content += '</div>';

        content += '<div id="'+dom_id+'_sidebar_content__baustein" class="be_sidebar_content" style="display: none;"></div>';
        
        content += '</div>';


        // DOM
        this.dom.be = jQuery("#"+dom_id);
        this.dom.be.html(content);
        this.dom.be_content = jQuery("#"+dom_id+"_content");
        this.dom.sidebar = jQuery('#'+this.dom_id+'_sidebar');
        this.dom.sidebar_content__site = jQuery('#'+this.dom_id+'_sidebar_content__site');
        this.dom.sidebar_content__baustein = jQuery('#'+this.dom_id+'_sidebar_content__baustein');
        this.dom.be_sidebar_header_col = jQuery('#'+dom_id+'_sidebar_header .be_sidebar_header_col');
        this.dom.sidebar_header_col__site = jQuery('#'+dom_id+'_sidebar_header_col__site');
        this.dom.sidebar_header_col__baustein = jQuery('#'+this.dom_id+'_sidebar_header_col__baustein');
        this.be_bausteinSelector_isOpen = false;
        this.apply_styles();
        
        // Events
        const self = this;
        this.formcontroll_events();
        
        const be_sidebar_header_col_function = function(col) {
            if (jQuery('#'+dom_id+'_sidebar_header_col__'+col).hasClass("disabled") === false) {
                self.dom.be_sidebar_header_col.removeClass("active");
                jQuery('#'+dom_id+'_sidebar_header_col__'+col).addClass("active");
                jQuery('#'+dom_id+'_sidebar .be_sidebar_content').hide();
                jQuery('#'+dom_id+'_sidebar_content__'+col).show();
            }
        }
        this.dom.sidebar_header_col__site.on("click", function() { be_sidebar_header_col_function('site'); });
        this.dom.sidebar_header_col__baustein.on("click", function() { be_sidebar_header_col_function('baustein'); });

        this.render();
    }
    
    addBausteinSelector(position, hide) {
        const row_const = position.row;
        const depth_const = position.depth;
        const item_const = position.item;
        const selector_dom_id = this.dom_id + "_" + row_const + "_" + depth_const + "_" + item_const;

        var clz = "be_bausteinSelector_container";
        if (hide) {
            clz += " hidden";
        }

        var content = '<div class="'+clz+'">'
            +'<button type="button" id="'+selector_dom_id+'_bausteinSelector" class="be_bausteinSelector"><i class="fas fa-plus-circle"></i></button>'
            //+'<button type="button" id="'+selector_dom_id+'_bausteinSelector" class="be_bausteinSelector"><div><span>+</span></div></button>'
            +'<div id="'+selector_dom_id+'_bausteinSelector_layer" class="be_bausteinSelector_layer" style="display: none;">';
            
        content += '<div class="be_bausteinSelector_layer_title_container">';
        content += '<div class="be_bausteinSelector_layer_title">Neuen Baustein hinzufügen</div>';
        content += '<button type="button" id="'+selector_dom_id+'bausteinSelector_layer_close" class="be_bausteinSelector_layer_close">&times;</button>';
        content += '</div>';
        
        content += '<div id="'+selector_dom_id+'_bausteinSelector_layer_item_container1" class="be_bausteinSelector_layer_item_container">';
        
        for (var i = 0; i < this.bausteinSelector.length; i++) {
            const element = this.bausteinSelector[i];
            
            if (element.type === 0) {
                content += '<button type="button" class="be_bausteinSelector_layer_item" data-category="'+i+'" data-type="'+element.baustein.id+'">';
                content += '<div class="be_bausteinSelector_layer_item_title1">'+element.baustein.icon+'</div>';
                content += '<div class="be_bausteinSelector_layer_item_title2">'+element.baustein.title+'</div>';
                content += '</button>';
            } else {
                content += '<button type="button" class="be_bausteinSelector_layer_item" data-category="'+i+'">';
                content += '<div class="be_bausteinSelector_layer_item_title1">'+element.icon+'</i></div>';
                content += '<div class="be_bausteinSelector_layer_item_title2">'+element.title+'</div>';
                content += '</button>';
                
            }
            
        }
        
        content += '</div>';
        
        content += '<div id="'+selector_dom_id+'_bausteinSelector_layer_item_container2" class="be_bausteinSelector_layer_item_container">';
        content += '</div>';

        content += '</div>';
        content += '</div>';
        return content;
    }
    
    addBausteinSelectorEvents(position) {
        const row_const = position.row;
        const depth_const = position.depth;
        const item_const = position.item;
        const selector_dom_id = this.dom_id + "_" + row_const + "_" + depth_const + "_" + item_const;

        const be_bausteinSelector = jQuery("#"+selector_dom_id+"_bausteinSelector");
        const be_bausteinSelector_layer = jQuery("#"+selector_dom_id+"_bausteinSelector_layer");
        const be_bausteinSelector_layer_items = jQuery("#"+selector_dom_id+"_bausteinSelector_layer .be_bausteinSelector_layer_item");
        const be_bausteinSelector_layer_item_container1 = jQuery("#"+selector_dom_id+"_bausteinSelector_layer_item_container1");
        const be_bausteinSelector_layer_item_container2 = jQuery("#"+selector_dom_id+"_bausteinSelector_layer_item_container2");
        
        const self = this;
        be_bausteinSelector.on("click", function() { self.bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2); });
        this.dom.sidebar.on("click", function() { if(self.be_bausteinSelector_isOpen) self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer); } );
        jQuery(".be_bausteinSelector_layer_close", be_bausteinSelector_layer).on("click", function() { self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer); });

        for (var i = 0; i < be_bausteinSelector_layer_items.length; i++) {
            const element = jQuery(be_bausteinSelector_layer_items[i]);
            
            element.on("click", function() {
                const category = parseInt(element.attr("data-category"));
                
                if(self.bausteinSelector[category].type === 0) {
                    self.addBaustein(self.bausteinSelector[category].baustein.id, {row: row_const, depth: depth_const, item: item_const});
                    self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                } else {
                    const types_array = self.bausteinSelector[category].items;
                    be_bausteinSelector_layer_item_container1.hide();
                    be_bausteinSelector_layer_item_container2.show();
                    
                    var container2_content = '';
                    for (var b = 0; b < types_array.length; b++) {
                        container2_content += '<button type="button" class="be_bausteinSelector_layer_item" data-type="'+types_array[b].id+'">';
                        container2_content += '<div class="be_bausteinSelector_layer_item_title1">'+types_array[b].icon+'</div>';
                        container2_content += '<div class="be_bausteinSelector_layer_item_title2">'+types_array[b].title+'</div>';
                        container2_content += '</button>';
                    }
                    be_bausteinSelector_layer_item_container2.html(container2_content);
                    
                    var container2_items = jQuery(".be_bausteinSelector_layer_item", be_bausteinSelector_layer_item_container2);
                    for (var c = 0; c < container2_items.length; c++) {
                        const container2_elem = jQuery(container2_items[c]);
                        const types_array_row = c;
                        
                        container2_elem.on("click", function() {
                            self.addBaustein(types_array[types_array_row].id, {row: row_const, depth: depth_const, item: item_const});
                            self.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
                        });
                    }
                }
            });
        }
    }


    addBaustein(type, position) {
        console.log("addBaustein() type", type);
        console.log("addBaustein() position", position);

        if (typeof type === "string" && type !== "") {
            // Objects are reference types, we need to use clone here
            var baustein_entry = new Baustein(
                this.types[type].id, this.types[type].title, this.types[type].icon, this.types[type].tag, this.types[type].hasEndtag, this.types[type].renderType, this.types[type].style
            );

            const row_max = this.data.bausteine.length;
            baustein_entry.position = position;
            this.data.bausteine[row_max] = [];
            this.data.bausteine[row_max][0] = [];
            this.data.bausteine[row_max][0][0] = baustein_entry;
            this.selected_baustein_position = position;

            console.log("addBaustein() this.data.bausteine", this.data.bausteine);
            
            // any baustein with equel or greater then position.row will be changed to +1, but not the newest
            const to = this.data.bausteine.length -1;
            for (var i = 0; i < to; i++) {
                if (this.data.bausteine[i][0][0].position.row >= position.row) {
                    this.data.bausteine[i][0][0].position.row++;
                }
            }
            
            this.render();
            this.selectBaustein(position);
            this.open_baustein_attributes(position);
            console.log("addBaustein() this.data.bausteine", this.data.bausteine);
            return true;
        } else {
            return false;
        }
    }

    selectBaustein(position) {
        jQuery('#'+this.dom_id+" .be_baustein").removeClass("selected");
        jQuery('#'+this.dom_id+'_be_baustein_item'+position.row+'_'+position.depth+'_'+position.item).addClass("selected");
        this.selected_baustein_position = position;
        this.open_baustein_attributes(position);
    }

    deleteBaustein(position) {
        console.log("deleteBaustein() position", position)
        this.data.bausteine[position.row][0][0].position.row = -1;
        var bausteine = [];
        for (var row = 0; row < this.data.bausteine.length; row++) {
            var new_row = bausteine.length;

            if (row === position.row) {
                for (var depth = 0; depth < this.data.bausteine.length; depth++) {
                    if (row === position.row) {
                        for (var item = 0; item < this.data.bausteine.length; item++) {
                        }
                    } else {
                        bausteine[new_row] = this.data.bausteine[row];
                    }
                }
            } else {
                bausteine[new_row] = this.data.bausteine[row];
            }
        }

        this.render();
        window.focus();
        document.activeElement.blur();
    }
    
    moveBaustein(position, position_new) {
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
        /*
        var bausteine = [];
        for (var row1 = 0; row1 < this.data.bausteine.length; row1++) {
            for (var row2 = 0; row2 < this.data.bausteine.length; row2++) {
                if (row1 === this.data.bausteine[row2][0][0].position.row) {
                    var new_row = bausteine.length;
                    bausteine[new_row] = [
                        [
                            this.data.bausteine[row2][0][0]
                        ]
                    ];
                    bausteine[new_row][0][0].position.row = new_row;
                    break;
                }
            }
        }
        */
        
        return this.data.bausteine.sort( (a, b) => (a[0][0].row < b[0][0].row) );
    }

    
    renderBaustein(baustein_entry, position) {
        // Baustein start
        const baustein_id = this.dom_id+'_be_baustein_item'+position.row+'_'+position.depth+'_'+position.item;
        const baustein_editor_id = baustein_id+'_editor';

        var baustein_entry_style = "";
        for (var a = 0; a < baustein_entry.style.length; a++) {
            const element = baustein_entry.style[a];
            if (element.value !== "") {
                baustein_entry_style += element.property.name + ":" + element.value + ";"
            }
        }

        var content = '<label id="'+baustein_id+'" class="be_baustein';
        if (this.selected_baustein_position.row === position.row) {
            content += ' selected';
        }
        content += '" data-type="'+baustein_entry.id+'" draggable="true" style="'+baustein_entry_style+'">';
        
        // Baustein indicator
        content += '<label for="'+baustein_id+'" class="baustein_indicator">'+baustein_entry.title+'</label>';
                        
        switch (baustein_entry.renderType) {
            default:
                content += '<textarea id="'+baustein_editor_id+'" class="be_baustein_item" placeholder="'+baustein_entry.title+'">'+baustein_entry.content+'</textarea>';
                break;
                
            case BausteinRenderType.richtext:
                content += '<div id="'+baustein_editor_id+'" style="min-height: 100px;">'+baustein_entry.content+'</div>';
                break;
        }
        content += '</label>';

        return content;
    }
    
    renderBausteinEvents(baustein_entry, position) {
        const self = this;

        const const_row = position.row;
        const const_depth = position.depth;
        const const_item = position.item;

        const baustein_id = this.dom_id+'_be_baustein_item'+position.row+'_'+position.depth+'_'+position.item;
        const baustein_editor_id = baustein_id+'_editor';
        
        const baustein_item = document.getElementById(baustein_id);
        const editor = document.getElementById(baustein_editor_id);

        console.log("baustein_entry.renderType", baustein_entry.renderType);
        switch (baustein_entry.renderType) {
            default:
                editor.focus();
                
                baustein_item.addEventListener("input", function() {
                    editor.style.height = '1px';
                    editor.style.height = editor.scrollHeight + 'px';
                    self.data.bausteine[const_row][const_depth][const_item].content = editor.value.split("<").join("&lt;").split(">").join("&gt;");
                });
                break;
                
            case BausteinRenderType.richtext:
                //const editor = document.getElementById(baustein_dom_id);
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
                
                baustein_item.addEventListener("input", function() {
                    baustein_item.style.height = '1px';
                    baustein_item.style.height = baustein_item.scrollHeight + 'px';
                    self.data.bausteine[const_row][const_depth][const_item].content = editor.innerHTML;
                });
                break;
        }

        baustein_item.addEventListener("focusin", function() {
            self.selectBaustein({row: const_row, depth: const_depth, item: const_item, });
        });

        baustein_item.addEventListener("dragover", function(e) {
            e.preventDefault();
        });

        // source
        baustein_item.addEventListener("dragstart", function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData("row", const_row);
            e.dataTransfer.setData("depth", const_depth);
            e.dataTransfer.setData("item", const_item);
        });

        // target
        baustein_item.addEventListener("drop", function(e) {
            e.preventDefault();
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
        });
    }
    
    render() {
        this.dom.be_content.html("");
        this.data.bausteine = this.getBausteine();

        /*  Bausteine 3D Graph Array
            this.data.bausteine[row][depth][item]
        */
        var depth = 0, item = 0;
        for (var row = 0; row < this.data.bausteine.length; row++) {
            const const_row = row;
            const const_depth = depth;
            const const_item = item;
            const baustein_entry = this.data.bausteine[const_row][const_depth][const_item];
            this.dom.be_content.append(
                this.addBausteinSelector({row: row, depth: depth, item: item}, true)
            );
            this.addBausteinSelectorEvents({row: row, depth: depth, item: item});
            
            
            if (baustein_entry.renderType === BausteinRenderType.layout) {
                // Baustein Layout start
                const baustein_id = this.dom_id+'_be_baustein_item'+row+'_'+depth+'_'+item;
        
                var baustein_entry_style = "";
                for (var a = 0; a < baustein_entry.style.length; a++) {
                    const element = baustein_entry.style[a];
                    if (element.value !== "") {
                        baustein_entry_style += element.property.name + ":" + element.value + ";"
                    }
                }

                var content = '<div id="'+baustein_id+'" class="be_baustein';
                if (this.selected_baustein_position.row === row) {
                    content += ' selected';
                }
                content += '" data-type="'+baustein_entry.id+'" draggable="true" style="'+baustein_entry_style+'">';
                
                // Baustein indicator
                content += '<label for="'+baustein_id+'" class="baustein_indicator">'+baustein_entry.title+'</label>';


                //TODO Baustein Layout
                depth += 1;
                content += this.addBausteinSelector({row: row, depth: depth, item: item}, false)
                content += '</div>';
                this.dom.be_content.append(content);
                this.addBausteinSelectorEvents({row: row, depth: depth, item: item});
            } else {
                var content = this.renderBaustein(baustein_entry, {row: row, depth: depth, item: item});
                this.dom.be_content.append(content);
                this.renderBausteinEvents(baustein_entry, {row: row, depth: depth, item: item});
            }
        }

        var row = this.data.bausteine.length;
        this.dom.be_content.append(
            this.addBausteinSelector({row: row, depth: depth, item: item}, false)
        );
        this.addBausteinSelectorEvents({row: row, depth: depth, item: item});
    }
    
    bausteinSelector_open(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2) { 
        be_bausteinSelector.hide(); 
        be_bausteinSelector_layer_item_container1.show();
        be_bausteinSelector_layer_item_container2.hide();
        be_bausteinSelector_layer.show(); 
        this.be_bausteinSelector_isOpen = true; 
    }
    bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer) { 
        be_bausteinSelector.show(); 
        be_bausteinSelector_layer.hide(); 
        this.be_bausteinSelector_isOpen = false; 
    }
    
    bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2) { 
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
            this.data.page.style[i].value = jQuery("#"+this.dom_id+"_page_content_row_"+this.data.page.style[i].property.name).val();
            style_string += this.data.page.style[i].property.name + ':' + this.data.page.style[i].value + ';';
        }
        style_string += '}';
        jQuery('#'+this.dom_id+'_page_styles').html(style_string);

        // Apply Baustein Styles
        if (typeof this.selected_baustein_position !== "undefined") {
            var selected_baustein = jQuery("#"+this.dom_id+" .be_baustein.selected");
            for (var i = 0; i < this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item].style.length; i++) {
                const element = this.data.bausteine[this.selected_baustein_position.row][this.selected_baustein_position.depth][this.selected_baustein_position.item].style[i];
                element.value = jQuery("#"+this.dom_id+"_baustein_content_row_"+element.property.name).val();
                selected_baustein.css(element.property.name, element.value);
            }
        }        
    }

    formcontroll(domArk, type, name, title, value, suffix, options) {
        var fc_dom_id = (this.dom_id+'_'+domArk+'_content_row_'+name);
        var content = '<div class="be_sidebar_content_row">';
        content += '<label for="'+fc_dom_id+'">'+title+'</label>';
        
        content += '<div class="form-controll-container';
        if (type === "number") {
            content += ' number';
        }
        content += '">';

        if (type === "select") {
            content += '<select id="'+fc_dom_id+'" class="form-controll" name="'+name+'">';
            for (var i = 0; i < options.length; i++) {
                content += '<option value="'+options[i].value+'"';
                if (options[i].value == value) {
                    content += " selected";
                }
                content += '>'+options[i].text+'</option>';
            }
            content += '</select>';
        } else {
            content += '<input type="text" id="'+fc_dom_id+'" class="form-controll" name="'+name+'" value="'+value+'"';
            if (type === "number") {
                content += ' data-suffix="'+suffix+'">';
                
                content += '<div class="form-controll-container_up">⮝</div>';
                content += '<div class="form-controll-container_down">⮟</div>';
                
            } else {
                content += '>';
            }
        }

        
        content += '</div>';
        content += '</div>';
        return content;
    }

    formcontroll_events() {
        const self = this;
        var dom_objects = jQuery(".form-controll-container:not(.event)", this.dom.sidebar);
        for (var i = 0; i < dom_objects.length; i++) {
            const container_element = jQuery(dom_objects[i]);
            container_element.addClass("event");
            const input_element = jQuery(".form-controll", container_element);

            if (container_element.hasClass("number")) {
                const arrow_up_element = jQuery(".form-controll-container_up", container_element);
                const arrow_down_element = jQuery(".form-controll-container_down", container_element);
                const suffix = input_element.attr("data-suffix");
                
                const formcontroll_number = function (add) {
                    var num = parseFloat( input_element.val().replace(suffix, "") );
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
                    
                    input_element.val(num.toString() + suffix);
                }
    
                input_element.on("change", function() { formcontroll_number(0); self.apply_styles(); });
                input_element.on("keydown", function(e) { 
                    var steps = e.shiftKey? 10 : (e.ctrlKey? 0.1 : 1)

                    const keyCode = e.which | e.keyCode;
                    if (keyCode === 38) {
                        formcontroll_number(steps);
                        self.apply_styles();
                        return false;
                    } else if(keyCode === 40) {
                        formcontroll_number(-steps);
                        self.apply_styles();
                        return false;
                    }
                });
                arrow_up_element.on("click", function() { formcontroll_number(+1); self.apply_styles(); });
                arrow_down_element.on("click", function() { formcontroll_number(-1); self.apply_styles(); });
            } else {
                input_element.on("change", function() { self.apply_styles(); });
            }
        }
    }
    
    open_baustein_attributes(position) {
        const position_const = { row: position.row, depth: position.depth, item: position.item };
        var sidebar_content = "";
        //console.log("open_baustein_attributes position_const", position_const)

        for (var i = 0; i < this.data.bausteine[position_const.row][position_const.depth][position_const.item].style.length; i++) {
            const element = this.data.bausteine[position_const.row][position_const.depth][position_const.item].style[i];
            sidebar_content += this.formcontroll("baustein", element.property.type, element.property.name, element.property.title, element.value, element.property.suffix, element.property.options);
        }
        
        sidebar_content += this.formcontroll(
            "baustein_class", "text", "class"
            , 'CSS Klasse <div style="font-size: 11px; margin-bottom: 2px;">(für Fortgeschrittene Nutzer)</div>'
            , this.data.bausteine[position_const.row][position_const.depth][position_const.item].class, "", []
        );
        
        sidebar_content += '<button id="'+this.dom_id+'_deleteBaustein" class="form-controll bautstein-delete" type="button">Baustein löschen</button>';

        const self = this;
        this.dom.sidebar_content__baustein.html(sidebar_content);
        this.formcontroll_events();

        jQuery('#'+this.dom_id+'_baustein_class_content_row_class').on("change", function() {
            self.data.bausteine[position_const.row][position_const.depth][position_const.item].class = jQuery(this).val();
        });

        jQuery('#'+this.dom_id+'_deleteBaustein').on("click", function() {
            self.close_baustein_attributes();
            console.log(self.data.bausteine);
            self.deleteBaustein(position_const);
            console.log(self.data.bausteine);
        });

        this.dom.sidebar_content__site.hide();
        this.dom.sidebar_header_col__site.removeClass("active");
        this.dom.sidebar_content__baustein.show();
        this.dom.sidebar_header_col__baustein.addClass("active").removeClass("disabled");
    }
    
    close_baustein_attributes() {
        this.dom.sidebar_content__site.show();
        this.dom.sidebar_header_col__site.addClass("active");
        this.dom.sidebar_content__baustein.hide();
        this.dom.sidebar_header_col__baustein.removeClass("active").addClass("disabled");
    }

}

