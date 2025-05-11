var BausteinEditorBundle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/baustein_editor.ts
  var baustein_editor_exports = {};
  __export(baustein_editor_exports, {
    BausteinEditor: () => BausteinEditor,
    Position: () => Position
  });

  // src/dialog.ts
  var Dialog = class {
    dialog;
    dialog_wrapper;
    dialog_content;
    dialog_header;
    dialog_title;
    dialog_close;
    dialog_body;
    dialog_footer;
    previous_action_close_function = null;
    constructor(parent) {
      this.dialog = this.create_element_if_not_exists(parent, "div", "__dialog", { class: "__dialog", style: "display: none;" });
      this.dialog_wrapper = this.create_element_if_not_exists(this.dialog, "div", "__dialog_wrapper", { class: "__dialog-wrapper" });
      this.dialog_content = this.create_element_if_not_exists(this.dialog_wrapper, "div", "__dialog_content", { class: "__dialog-content" });
      this.dialog_header = this.create_element_if_not_exists(this.dialog_content, "div", "__dialog_header", { class: "__dialog-header" });
      this.dialog_title = this.create_element_if_not_exists(this.dialog_header, "div", "__dialog_title", { class: "__dialog-title" });
      this.dialog_close = this.create_element_if_not_exists(this.dialog_header, "div", "__dialog_close", { class: "__dialog-close" });
      this.dialog_body = this.create_element_if_not_exists(this.dialog_content, "div", "__dialog_body", { class: "__dialog-body" });
      this.dialog_footer = this.create_element_if_not_exists(this.dialog_content, "div", "__dialog_footer", { class: "__dialog-footer" });
      this.dialog_close.innerHTML = "&times;";
    }
    start(title, body_content, action_ok_text, action_fail_text, action_close_text, action_ok = null, action_fail = null, action_close = null) {
      this.dialog_title.innerHTML = title;
      if (typeof body_content === "string") {
        this.dialog_body.innerHTML = body_content;
      } else {
        this.dialog_body.innerHTML = "";
        this.dialog_body.appendChild(body_content);
      }
      if (this.previous_action_close_function !== null) this.dialog_close.removeEventListener("click", this.previous_action_close_function);
      if (action_close === null) action_close = () => this.close();
      this.previous_action_close_function = action_close;
      this.dialog_close.addEventListener("click", action_close);
      this.dialog_footer.innerHTML = "";
      if (action_ok_text !== null) {
        const button = this.create_element(this.dialog_footer, "button", { class: "__dialog-btn __dialog-btn-green" });
        button.type = "button";
        button.innerHTML = action_ok_text;
        if (action_ok !== null) button.addEventListener("click", action_ok);
      }
      if (action_fail_text !== null) {
        const button = this.create_element(this.dialog_footer, "button", { class: "__dialog-btn __dialog-btn-red" });
        button.type = "button";
        button.innerHTML = action_fail_text;
        if (action_fail !== null) button.addEventListener("click", action_fail);
      }
      if (action_close_text !== null) {
        const button = this.create_element(this.dialog_footer, "button", { class: "__dialog-btn __dialog-btn-gray" });
        button.type = "button";
        button.innerHTML = action_close_text;
        if (action_close !== null) button.addEventListener("click", action_close);
      }
      this.dialog.style.display = "";
    }
    close() {
      this.dialog.style.display = "none";
    }
    create_element(parent, tag, attributes) {
      const element = document.createElement(tag);
      if (attributes) {
        for (const key in attributes) {
          element.setAttribute(key, attributes[key]);
        }
      }
      parent.append(element);
      return element;
    }
    create_element_if_not_exists(parent, tag, _id, attributes) {
      const find_element = document.getElementById(_id);
      if (find_element === null) {
        const element = this.create_element(parent, tag, attributes);
        element.id = _id;
        return element;
      } else {
        return find_element;
      }
    }
  };

  // src/locales.ts
  var LOCALES = {
    __locales: {
      "en": {
        "add_new_block": "Add new block",
        "delete_block": "Delete block",
        "confirm_delete": "Are you sure you want to delete this block?",
        "delete": "Delete",
        "cancel": "Cancel",
        "finish": "Finish",
        "create": "Create",
        "save": "Save",
        "search": "Search",
        "search_placeholder": "Search terms...",
        "back": "Back",
        "forward": "Forward",
        "preview": "Preview",
        "close_preview": "Close preview",
        "select": "Select",
        "load_image": "Load Image",
        "refresh_view": "Refresh view",
        "upload_image": "Upload image",
        "set_image": "Set image",
        "custom_other": "Custom / Other",
        "toggleable_classes": "Toggleable classes",
        "css_classes": "CSS Classes",
        "css_classes_advanced": "(for advanced users)",
        "columns": "Columns",
        "rows": "Rows",
        "border_settings": "Border Settings",
        "font-size": "Font Size",
        "font-weight": "Text Weight",
        "text-decoration": "Text Underline",
        "font-style": "Text Italic",
        "text-align": "Text Alignment",
        "color": "Text Color",
        "background-color": "Background Color",
        "background-image": "Background Image",
        "width": "Width",
        "height": "Height",
        "max-width": "Maximum Width",
        "max-height": "Maximum Height",
        "margin-top": "Top Margin",
        "margin-right": "Right Margin",
        "margin-bottom": "Bottom Margin",
        "margin-left": "Left Margin",
        "border-top-width": "Top Border Width",
        "border-right-width": "Right Border Width",
        "border-bottom-width": "Bottom Border Width",
        "border-left-width": "Border Width Left",
        "padding-top": "Padding Top",
        "padding-right": "Padding Right",
        "padding-bottom": "Padding Bottom",
        "padding-left": "Padding Left",
        "normal": "Normal",
        "smaller": "Smaller (~10px)",
        "small": "Small (~11px)",
        "medium": "Medium (~14px)",
        "large": "Large (~17px)",
        "larger": "Larger (~20px)",
        "bold": "Bold",
        "bolder": "Bolder",
        "lighter": "Lighter",
        "underline": "Underlined",
        "dotted": "Dotted underline",
        "italic": "Italic",
        "oblique": "Oblique",
        "left": "Left",
        "center": "Centered",
        "right": "Right",
        "h1": "Heading 1",
        "h2": "Heading 2",
        "h3": "Heading 3",
        "h4": "Heading 4",
        "h5": "Heading 5",
        "h6": "Heading 6",
        "text": "Text",
        "btn_primary": "Primary Button",
        "btn_seccond": "Primary Button",
        "btn_cta": "Call-To-Action Button",
        "iframe": "Insert iframe",
        "shortcode": "Shortcode",
        "image": "Image",
        "spoiler": "Toggle",
        "spoiler_toggler": "Toggle visible content",
        "spoiler_content": "Toggle hidden content",
        "layout": "Layout",
        "container": "Container",
        "table": "Table",
        "tableRow": "Table Row",
        "th": "Table title row",
        "td": "Table row",
        "buttons": "Buttons",
        "titles": "Headings",
        "misc": "Miscellaneous",
        "shortcode_select": "Select Shortcode",
        "page_content": "Your page content will appear here. Move this block to where you want the page content appear.",
        "new_tab": "open in new tab"
      },
      "de": {
        "add_new_block": "Neuen Baustein hinzuf\xFCgen",
        "delete_block": "Baustein l\xF6schen",
        "confirm_delete": "Sind Sie sich sicher, dass Sie diesen Baustein l\xF6schen wollen?",
        "delete": "L\xF6schen",
        "cancel": "Abbrechen",
        "finish": "Fertigstellen",
        "create": "Erstellen",
        "save": "Speichern",
        "search": "Suchen",
        "search_placeholder": "Suchbegriffe..",
        "back": "Zur\xFCck",
        "forward": "Vorw\xE4rts",
        "preview": "Vorschau",
        "close_preview": "Vorschau schlie\xDFen",
        "select": "Ausw\xE4hlen",
        "load_image": "Bild laden",
        "refresh_view": "Ansicht aktualisieren",
        "upload_image": "Bild hochladen",
        "set_image": "Bild setzen",
        "custom_other": "Benutzerdefiniert / Sonstige",
        "toggleable_classes": "Togglebale Klassen",
        "css_classes": "CSS Klassen",
        "css_classes_advanced": "(f\xFCr Fortgeschrittene Nutzer)",
        "columns": "Spalten",
        "rows": "Reihen",
        "border_settings": "Border Einstellungen",
        "font-size": "Schriftgr\xF6\xDFe",
        "font-weight": "Textdicke",
        "text-decoration": "Textunterschreichung",
        "font-style": "Textkursion",
        "text-align": "Textausrichtung",
        "color": "Textfarbe",
        "background-color": "Hintergrundfarbe",
        "background-image": "Hintergrundbild",
        "width": "Breite",
        "height": "H\xF6he",
        "max-width": "Maximale Breite",
        "max-height": "Maximale H\xF6he",
        "margin-top": "Au\xDFenabstand Oben",
        "margin-right": "Au\xDFenabstand Rechts",
        "margin-bottom": "Au\xDFenabstand Unten",
        "margin-left": "Au\xDFenabstand Links",
        "border-top-width": "Border Breite Oben",
        "border-right-width": "Border Breite Rechts",
        "border-bottom-width": "Border Breite Unten",
        "border-left-width": "Border Breite Links",
        "padding-top": "Innenabstand Oben",
        "padding-right": "Innenabstand Rechts",
        "padding-bottom": "Innenabstand Unten",
        "padding-left": "Innenabstand Links",
        "normal": "Normal",
        "smaller": "Kleiner (~10px)",
        "small": "Klein (~11px)",
        "medium": "Medium (~14px)",
        "large": "Gro\xDF (~17px)",
        "larger": "Gr\xF6\xDFer (~20px)",
        "bold": "Fett",
        "bolder": "Fetter",
        "lighter": "Leichter",
        "underline": "Unterstrichen",
        "dotted": "Unterstrichen gepunktet",
        "italic": "Kursiv",
        "oblique": "Schr\xE4g",
        "left": "Links",
        "center": "Zentriert",
        "right": "Rechts",
        "h1": "\xDCberschrift 1",
        "h2": "\xDCberschrift 2",
        "h3": "\xDCberschrift 3",
        "h4": "\xDCberschrift 4",
        "h5": "\xDCberschrift 5",
        "h6": "\xDCberschrift 6",
        "text": "Text",
        "btn_primary": "Primary Button",
        "btn_seccond": "Primary Button",
        "btn_cta": "Call-To-Action Button",
        "iframe": "iframe einbinden",
        "shortcode": "Shortcode",
        "image": "Bild",
        "spoiler": "Auf-Zu-Klappfunktion",
        "spoiler_toggler": "Auf-Zu-Klappfunktion sichtbarer Inhalt",
        "spoiler_content": "Auf-Zu-Klappfunktion versteckter Inhalt",
        "layout": "Layout",
        "container": "Kontainer",
        "table": "Tabelle",
        "tableRow": "Tabellenreihe",
        "th": "Tabellentitelzeile",
        "td": "Tabellenzeile",
        "buttons": "Buttons",
        "titles": "\xDCberschriften",
        "misc": "Sonstiges",
        "shortcode_select": "Shortcode ausw\xE4hlen",
        "page_content": "Hier wird Ihr Seiteninhalt angezeigt. Verschieben Sie diesen Block an die gew\xFCnschte Stelle.",
        "new_tab": "in neuen Tab \xF6ffnen"
      }
    },
    selected_locale: "en",
    select_locale: function(locale) {
      if (this.__locales[locale] === void 0) {
        console.error("[BausteinEditor] LOCALES locale '" + locale + "' does not exist");
        return false;
      } else {
        this.selected_locale = locale;
        return true;
      }
    },
    get_item: function(key) {
      if (key === "auto") return "auto";
      if (key === "html") return "HTML";
      if (key === "script") return "JavaScript";
      if (key === "bausteinSelector") return "";
      if (this.__locales[this.selected_locale][key] === void 0) {
        console.error("[BausteinEditor] missing LOCALES key '" + key + "'");
        return key;
      } else {
        return this.__locales[this.selected_locale][key];
      }
    }
  };

  // src/lux_drag_drop.ts
  var LuxDragDrop = class {
    boundary;
    target;
    isHeld = false;
    timeoutId = 0;
    drag_element = null;
    offset_x = 0;
    offset_y = 0;
    callback_mousedown;
    callback_mousemove;
    callback_mouseup;
    maxsizes;
    constructor(boundary, target, options) {
      this.boundary = boundary;
      this.target = target;
      this.callback_mousedown = options.mousedown || null;
      this.callback_mousemove = options.mousemove || null;
      this.callback_mouseup = options.mouseup || null;
      this.maxsizes = options.maxsizes || true;
      ["mousedown", "mousestart"].forEach((type) => {
        this.target.addEventListener(type, (e) => this.on_mousedown(e));
      });
    }
    on_mousedown = (e) => {
      if (!this.isHeld) {
        this.timeoutId = setTimeout(() => {
          if (this.callback_mousedown !== null) {
            const res = this.callback_mousedown(e);
            if (res === false) {
              return;
            }
          }
          this.isHeld = true;
          this.target.classList.add("disabled");
          this.clearSelection();
          let width = this.target.offsetWidth, height = this.target.offsetHeight;
          if (this.maxsizes) {
            if (width > 100) width = 100;
            if (height > 100) height = 100;
          }
          this.drag_element = document.createElement(this.target.tagName);
          this.drag_element.className = this.target.className;
          this.drag_element.innerHTML = this.target.innerHTML;
          this.drag_element.style.width = width + "px";
          this.drag_element.style.height = height + "px";
          this.boundary.appendChild(this.drag_element);
          this.boundary.classList.add("grabbing");
          if (this.drag_element === null) {
            console.error("[LuxDragDrop] drag_element is null. Well bad.");
          } else {
            this.drag_element.classList.add("ondrag");
            this.drag_element.style.position = "fixed";
            this.drag_element.style.display = "none";
            setTimeout(() => {
              if (this.drag_element !== null) {
                this.drag_element.style.display = "block";
              }
            }, 100);
            ["mouseup", "touchend", "touchcancel"].forEach((type) => {
              this.drag_element.addEventListener(type, this.on_mouseup);
            });
          }
          ["mousemove", "touchmove"].forEach((type) => {
            this.boundary.addEventListener(type, this.on_mousemove);
          });
          this.offset_x = width / 2;
          this.offset_y = height / 2;
        }, 200);
      }
      ["mouseup", "touchend", "touchcancel"].forEach((type) => {
        this.target.addEventListener(type, this.on_mouseup);
      });
    };
    // deno-lint-ignore no-explicit-any
    on_mousemove = (e) => {
      if (this.drag_element !== null) {
        this.drag_element.style.left = e.clientX - this.offset_x + "px";
        this.drag_element.style.top = e.clientY - this.offset_y + "px";
        if (this.callback_mousemove !== null) this.callback_mousemove(e);
      }
    };
    // deno-lint-ignore no-explicit-any
    on_mouseup = (e) => {
      clearTimeout(this.timeoutId);
      console.log("on_mouseup");
      if (this.isHeld) {
        this.isHeld = false;
        this.target.classList.remove("disabled");
        if (this.drag_element !== null) {
          this.drag_element.remove();
          this.drag_element = null;
        }
        document.querySelectorAll(".ondrag").forEach((elem) => {
          elem.remove();
        });
        this.boundary.classList.remove("grabbing");
        const elementTarget = this.elementFromPoint(e.clientX, e.clientY);
        if (elementTarget === null) {
          console.error("[LuxDragDrop] Oh well bad, elementTarget is null. Uff.");
        } else {
          if (this.callback_mouseup !== null) this.callback_mouseup(e, elementTarget);
        }
      }
      ["mousemove", "touchmove"].forEach((type) => {
        this.boundary.removeEventListener(type, this.on_mousemove);
      });
      ["mouseup", "touchend", "touchcancel"].forEach((type) => {
        this.target.removeEventListener(type, this.on_mouseup);
      });
    };
    elementFromPoint(x, y) {
      return document.elementFromPoint(x, y);
    }
    clearSelection() {
      if (window !== null && window.getSelection) {
        const selection = window.getSelection();
        if (selection !== null) selection.removeAllRanges();
      }
    }
  };

  // src/fontawsome_data.ts
  var FONTAWSOME_DATA = { name: "Font Awesome Free 6.7.2", icons: [
    "fa-solid fa-0",
    "fa-solid fa-1",
    "fa-solid fa-2",
    "fa-solid fa-3",
    "fa-solid fa-4",
    "fa-solid fa-5",
    "fa-solid fa-6",
    "fa-solid fa-7",
    "fa-solid fa-8",
    "fa-solid fa-9",
    "fa-solid fa-fill-drip",
    "fa-solid fa-arrows-to-circle",
    "fa-solid fa-circle-chevron-right",
    "fa-solid fa-chevron-circle-right",
    "fa-solid fa-at",
    "fa-solid fa-trash-can",
    "fa-solid fa-trash-alt",
    "fa-solid fa-text-height",
    "fa-solid fa-user-xmark",
    "fa-solid fa-user-times",
    "fa-solid fa-stethoscope",
    "fa-solid fa-message",
    "fa-solid fa-comment-alt",
    "fa-solid fa-info",
    "fa-solid fa-down-left-and-up-right-to-center",
    "fa-solid fa-compress-alt",
    "fa-solid fa-explosion",
    "fa-solid fa-file-lines",
    "fa-solid fa-file-alt",
    "fa-solid fa-file-text",
    "fa-solid fa-wave-square",
    "fa-solid fa-ring",
    "fa-solid fa-building-un",
    "fa-solid fa-dice-three",
    "fa-solid fa-calendar-days",
    "fa-solid fa-calendar-alt",
    "fa-solid fa-anchor-circle-check",
    "fa-solid fa-building-circle-arrow-right",
    "fa-solid fa-volleyball",
    "fa-solid fa-volleyball-ball",
    "fa-solid fa-arrows-up-to-line",
    "fa-solid fa-sort-down",
    "fa-solid fa-sort-desc",
    "fa-solid fa-circle-minus",
    "fa-solid fa-minus-circle",
    "fa-solid fa-door-open",
    "fa-solid fa-right-from-bracket",
    "fa-solid fa-sign-out-alt",
    "fa-solid fa-atom",
    "fa-solid fa-soap",
    "fa-solid fa-icons",
    "fa-solid fa-heart-music-camera-bolt",
    "fa-solid fa-microphone-lines-slash",
    "fa-solid fa-microphone-alt-slash",
    "fa-solid fa-bridge-circle-check",
    "fa-solid fa-pump-medical",
    "fa-solid fa-fingerprint",
    "fa-solid fa-hand-point-right",
    "fa-solid fa-magnifying-glass-location",
    "fa-solid fa-search-location",
    "fa-solid fa-forward-step",
    "fa-solid fa-step-forward",
    "fa-solid fa-face-smile-beam",
    "fa-solid fa-smile-beam",
    "fa-solid fa-flag-checkered",
    "fa-solid fa-football",
    "fa-solid fa-football-ball",
    "fa-solid fa-school-circle-exclamation",
    "fa-solid fa-crop",
    "fa-solid fa-angles-down",
    "fa-solid fa-angle-double-down",
    "fa-solid fa-users-rectangle",
    "fa-solid fa-people-roof",
    "fa-solid fa-people-line",
    "fa-solid fa-beer-mug-empty",
    "fa-solid fa-beer",
    "fa-solid fa-diagram-predecessor",
    "fa-solid fa-arrow-up-long",
    "fa-solid fa-long-arrow-up",
    "fa-solid fa-fire-flame-simple",
    "fa-solid fa-burn",
    "fa-solid fa-person",
    "fa-solid fa-male",
    "fa-solid fa-laptop",
    "fa-solid fa-file-csv",
    "fa-solid fa-menorah",
    "fa-solid fa-truck-plane",
    "fa-solid fa-record-vinyl",
    "fa-solid fa-face-grin-stars",
    "fa-solid fa-grin-stars",
    "fa-solid fa-bong",
    "fa-solid fa-spaghetti-monster-flying",
    "fa-solid fa-pastafarianism",
    "fa-solid fa-arrow-down-up-across-line",
    "fa-solid fa-spoon",
    "fa-solid fa-utensil-spoon",
    "fa-solid fa-jar-wheat",
    "fa-solid fa-envelopes-bulk",
    "fa-solid fa-mail-bulk",
    "fa-solid fa-file-circle-exclamation",
    "fa-solid fa-circle-h",
    "fa-solid fa-hospital-symbol",
    "fa-solid fa-pager",
    "fa-solid fa-address-book",
    "fa-solid fa-contact-book",
    "fa-solid fa-strikethrough",
    "fa-solid fa-k",
    "fa-solid fa-landmark-flag",
    "fa-solid fa-pencil",
    "fa-solid fa-pencil-alt",
    "fa-solid fa-backward",
    "fa-solid fa-caret-right",
    "fa-solid fa-comments",
    "fa-solid fa-paste",
    "fa-solid fa-file-clipboard",
    "fa-solid fa-code-pull-request",
    "fa-solid fa-clipboard-list",
    "fa-solid fa-truck-ramp-box",
    "fa-solid fa-truck-loading",
    "fa-solid fa-user-check",
    "fa-solid fa-vial-virus",
    "fa-solid fa-sheet-plastic",
    "fa-solid fa-blog",
    "fa-solid fa-user-ninja",
    "fa-solid fa-person-arrow-up-from-line",
    "fa-solid fa-scroll-torah",
    "fa-solid fa-torah",
    "fa-solid fa-broom-ball",
    "fa-solid fa-quidditch",
    "fa-solid fa-quidditch-broom-ball",
    "fa-solid fa-toggle-off",
    "fa-solid fa-box-archive",
    "fa-solid fa-archive",
    "fa-solid fa-person-drowning",
    "fa-solid fa-arrow-down-9-1",
    "fa-solid fa-sort-numeric-desc",
    "fa-solid fa-sort-numeric-down-alt",
    "fa-solid fa-face-grin-tongue-squint",
    "fa-solid fa-grin-tongue-squint",
    "fa-solid fa-spray-can",
    "fa-solid fa-truck-monster",
    "fa-solid fa-w",
    "fa-solid fa-earth-africa",
    "fa-solid fa-globe-africa",
    "fa-solid fa-rainbow",
    "fa-solid fa-circle-notch",
    "fa-solid fa-tablet-screen-button",
    "fa-solid fa-tablet-alt",
    "fa-solid fa-paw",
    "fa-solid fa-cloud",
    "fa-solid fa-trowel-bricks",
    "fa-solid fa-face-flushed",
    "fa-solid fa-flushed",
    "fa-solid fa-hospital-user",
    "fa-solid fa-tent-arrow-left-right",
    "fa-solid fa-gavel",
    "fa-solid fa-legal",
    "fa-solid fa-binoculars",
    "fa-solid fa-microphone-slash",
    "fa-solid fa-box-tissue",
    "fa-solid fa-motorcycle",
    "fa-solid fa-bell-concierge",
    "fa-solid fa-concierge-bell",
    "fa-solid fa-pen-ruler",
    "fa-solid fa-pencil-ruler",
    "fa-solid fa-people-arrows",
    "fa-solid fa-people-arrows-left-right",
    "fa-solid fa-mars-and-venus-burst",
    "fa-solid fa-square-caret-right",
    "fa-solid fa-caret-square-right",
    "fa-solid fa-scissors",
    "fa-solid fa-cut",
    "fa-solid fa-sun-plant-wilt",
    "fa-solid fa-toilets-portable",
    "fa-solid fa-hockey-puck",
    "fa-solid fa-table",
    "fa-solid fa-magnifying-glass-arrow-right",
    "fa-solid fa-tachograph-digital",
    "fa-solid fa-digital-tachograph",
    "fa-solid fa-users-slash",
    "fa-solid fa-clover",
    "fa-solid fa-reply",
    "fa-solid fa-mail-reply",
    "fa-solid fa-star-and-crescent",
    "fa-solid fa-house-fire",
    "fa-solid fa-square-minus",
    "fa-solid fa-minus-square",
    "fa-solid fa-helicopter",
    "fa-solid fa-compass",
    "fa-solid fa-square-caret-down",
    "fa-solid fa-caret-square-down",
    "fa-solid fa-file-circle-question",
    "fa-solid fa-laptop-code",
    "fa-solid fa-swatchbook",
    "fa-solid fa-prescription-bottle",
    "fa-solid fa-bars",
    "fa-solid fa-navicon",
    "fa-solid fa-people-group",
    "fa-solid fa-hourglass-end",
    "fa-solid fa-hourglass-3",
    "fa-solid fa-heart-crack",
    "fa-solid fa-heart-broken",
    "fa-solid fa-square-up-right",
    "fa-solid fa-external-link-square-alt",
    "fa-solid fa-face-kiss-beam",
    "fa-solid fa-kiss-beam",
    "fa-solid fa-film",
    "fa-solid fa-ruler-horizontal",
    "fa-solid fa-people-robbery",
    "fa-solid fa-lightbulb",
    "fa-solid fa-caret-left",
    "fa-solid fa-circle-exclamation",
    "fa-solid fa-exclamation-circle",
    "fa-solid fa-school-circle-xmark",
    "fa-solid fa-arrow-right-from-bracket",
    "fa-solid fa-sign-out",
    "fa-solid fa-circle-chevron-down",
    "fa-solid fa-chevron-circle-down",
    "fa-solid fa-unlock-keyhole",
    "fa-solid fa-unlock-alt",
    "fa-solid fa-cloud-showers-heavy",
    "fa-solid fa-headphones-simple",
    "fa-solid fa-headphones-alt",
    "fa-solid fa-sitemap",
    "fa-solid fa-circle-dollar-to-slot",
    "fa-solid fa-donate",
    "fa-solid fa-memory",
    "fa-solid fa-road-spikes",
    "fa-solid fa-fire-burner",
    "fa-solid fa-flag",
    "fa-solid fa-hanukiah",
    "fa-solid fa-feather",
    "fa-solid fa-volume-low",
    "fa-solid fa-volume-down",
    "fa-solid fa-comment-slash",
    "fa-solid fa-cloud-sun-rain",
    "fa-solid fa-compress",
    "fa-solid fa-wheat-awn",
    "fa-solid fa-wheat-alt",
    "fa-solid fa-ankh",
    "fa-solid fa-hands-holding-child",
    "fa-solid fa-asterisk",
    "fa-solid fa-square-check",
    "fa-solid fa-check-square",
    "fa-solid fa-peseta-sign",
    "fa-solid fa-heading",
    "fa-solid fa-header",
    "fa-solid fa-ghost",
    "fa-solid fa-list",
    "fa-solid fa-list-squares",
    "fa-solid fa-square-phone-flip",
    "fa-solid fa-phone-square-alt",
    "fa-solid fa-cart-plus",
    "fa-solid fa-gamepad",
    "fa-solid fa-circle-dot",
    "fa-solid fa-dot-circle",
    "fa-solid fa-face-dizzy",
    "fa-solid fa-dizzy",
    "fa-solid fa-egg",
    "fa-solid fa-house-medical-circle-xmark",
    "fa-solid fa-campground",
    "fa-solid fa-folder-plus",
    "fa-solid fa-futbol",
    "fa-solid fa-futbol-ball",
    "fa-solid fa-soccer-ball",
    "fa-solid fa-paintbrush",
    "fa-solid fa-paint-brush",
    "fa-solid fa-lock",
    "fa-solid fa-gas-pump",
    "fa-solid fa-hot-tub-person",
    "fa-solid fa-hot-tub",
    "fa-solid fa-map-location",
    "fa-solid fa-map-marked",
    "fa-solid fa-house-flood-water",
    "fa-solid fa-tree",
    "fa-solid fa-bridge-lock",
    "fa-solid fa-sack-dollar",
    "fa-solid fa-pen-to-square",
    "fa-solid fa-edit",
    "fa-solid fa-car-side",
    "fa-solid fa-share-nodes",
    "fa-solid fa-share-alt",
    "fa-solid fa-heart-circle-minus",
    "fa-solid fa-hourglass-half",
    "fa-solid fa-hourglass-2",
    "fa-solid fa-microscope",
    "fa-solid fa-sink",
    "fa-solid fa-bag-shopping",
    "fa-solid fa-shopping-bag",
    "fa-solid fa-arrow-down-z-a",
    "fa-solid fa-sort-alpha-desc",
    "fa-solid fa-sort-alpha-down-alt",
    "fa-solid fa-mitten",
    "fa-solid fa-person-rays",
    "fa-solid fa-users",
    "fa-solid fa-eye-slash",
    "fa-solid fa-flask-vial",
    "fa-solid fa-hand",
    "fa-solid fa-hand-paper",
    "fa-solid fa-om",
    "fa-solid fa-worm",
    "fa-solid fa-house-circle-xmark",
    "fa-solid fa-plug",
    "fa-solid fa-chevron-up",
    "fa-solid fa-hand-spock",
    "fa-solid fa-stopwatch",
    "fa-solid fa-face-kiss",
    "fa-solid fa-kiss",
    "fa-solid fa-bridge-circle-xmark",
    "fa-solid fa-face-grin-tongue",
    "fa-solid fa-grin-tongue",
    "fa-solid fa-chess-bishop",
    "fa-solid fa-face-grin-wink",
    "fa-solid fa-grin-wink",
    "fa-solid fa-ear-deaf",
    "fa-solid fa-deaf",
    "fa-solid fa-deafness",
    "fa-solid fa-hard-of-hearing",
    "fa-solid fa-road-circle-check",
    "fa-solid fa-dice-five",
    "fa-solid fa-square-rss",
    "fa-solid fa-rss-square",
    "fa-solid fa-land-mine-on",
    "fa-solid fa-i-cursor",
    "fa-solid fa-stamp",
    "fa-solid fa-stairs",
    "fa-solid fa-i",
    "fa-solid fa-hryvnia-sign",
    "fa-solid fa-hryvnia",
    "fa-solid fa-pills",
    "fa-solid fa-face-grin-wide",
    "fa-solid fa-grin-alt",
    "fa-solid fa-tooth",
    "fa-solid fa-v",
    "fa-solid fa-bangladeshi-taka-sign",
    "fa-solid fa-bicycle",
    "fa-solid fa-staff-snake",
    "fa-solid fa-rod-asclepius",
    "fa-solid fa-rod-snake",
    "fa-solid fa-staff-aesculapius",
    "fa-solid fa-head-side-cough-slash",
    "fa-solid fa-truck-medical",
    "fa-solid fa-ambulance",
    "fa-solid fa-wheat-awn-circle-exclamation",
    "fa-solid fa-snowman",
    "fa-solid fa-mortar-pestle",
    "fa-solid fa-road-barrier",
    "fa-solid fa-school",
    "fa-solid fa-igloo",
    "fa-solid fa-joint",
    "fa-solid fa-angle-right",
    "fa-solid fa-horse",
    "fa-solid fa-q",
    "fa-solid fa-g",
    "fa-solid fa-notes-medical",
    "fa-solid fa-temperature-half",
    "fa-solid fa-temperature-2",
    "fa-solid fa-thermometer-2",
    "fa-solid fa-thermometer-half",
    "fa-solid fa-dong-sign",
    "fa-solid fa-capsules",
    "fa-solid fa-poo-storm",
    "fa-solid fa-poo-bolt",
    "fa-solid fa-face-frown-open",
    "fa-solid fa-frown-open",
    "fa-solid fa-hand-point-up",
    "fa-solid fa-money-bill",
    "fa-solid fa-bookmark",
    "fa-solid fa-align-justify",
    "fa-solid fa-umbrella-beach",
    "fa-solid fa-helmet-un",
    "fa-solid fa-bullseye",
    "fa-solid fa-bacon",
    "fa-solid fa-hand-point-down",
    "fa-solid fa-arrow-up-from-bracket",
    "fa-solid fa-folder",
    "fa-solid fa-folder-blank",
    "fa-solid fa-file-waveform",
    "fa-solid fa-file-medical-alt",
    "fa-solid fa-radiation",
    "fa-solid fa-chart-simple",
    "fa-solid fa-mars-stroke",
    "fa-solid fa-vial",
    "fa-solid fa-gauge",
    "fa-solid fa-dashboard",
    "fa-solid fa-gauge-med",
    "fa-solid fa-tachometer-alt-average",
    "fa-solid fa-wand-magic-sparkles",
    "fa-solid fa-magic-wand-sparkles",
    "fa-solid fa-e",
    "fa-solid fa-pen-clip",
    "fa-solid fa-pen-alt",
    "fa-solid fa-bridge-circle-exclamation",
    "fa-solid fa-user",
    "fa-solid fa-school-circle-check",
    "fa-solid fa-dumpster",
    "fa-solid fa-van-shuttle",
    "fa-solid fa-shuttle-van",
    "fa-solid fa-building-user",
    "fa-solid fa-square-caret-left",
    "fa-solid fa-caret-square-left",
    "fa-solid fa-highlighter",
    "fa-solid fa-key",
    "fa-solid fa-bullhorn",
    "fa-solid fa-globe",
    "fa-solid fa-synagogue",
    "fa-solid fa-person-half-dress",
    "fa-solid fa-road-bridge",
    "fa-solid fa-location-arrow",
    "fa-solid fa-c",
    "fa-solid fa-tablet-button",
    "fa-solid fa-building-lock",
    "fa-solid fa-pizza-slice",
    "fa-solid fa-money-bill-wave",
    "fa-solid fa-chart-area",
    "fa-solid fa-area-chart",
    "fa-solid fa-house-flag",
    "fa-solid fa-person-circle-minus",
    "fa-solid fa-ban",
    "fa-solid fa-cancel",
    "fa-solid fa-camera-rotate",
    "fa-solid fa-spray-can-sparkles",
    "fa-solid fa-air-freshener",
    "fa-solid fa-star",
    "fa-solid fa-repeat",
    "fa-solid fa-cross",
    "fa-solid fa-box",
    "fa-solid fa-venus-mars",
    "fa-solid fa-arrow-pointer",
    "fa-solid fa-mouse-pointer",
    "fa-solid fa-maximize",
    "fa-solid fa-expand-arrows-alt",
    "fa-solid fa-charging-station",
    "fa-solid fa-shapes",
    "fa-solid fa-triangle-circle-square",
    "fa-solid fa-shuffle",
    "fa-solid fa-random",
    "fa-solid fa-person-running",
    "fa-solid fa-running",
    "fa-solid fa-mobile-retro",
    "fa-solid fa-grip-lines-vertical",
    "fa-solid fa-spider",
    "fa-solid fa-hands-bound",
    "fa-solid fa-file-invoice-dollar",
    "fa-solid fa-plane-circle-exclamation",
    "fa-solid fa-x-ray",
    "fa-solid fa-spell-check",
    "fa-solid fa-slash",
    "fa-solid fa-computer-mouse",
    "fa-solid fa-mouse",
    "fa-solid fa-arrow-right-to-bracket",
    "fa-solid fa-sign-in",
    "fa-solid fa-shop-slash",
    "fa-solid fa-store-alt-slash",
    "fa-solid fa-server",
    "fa-solid fa-virus-covid-slash",
    "fa-solid fa-shop-lock",
    "fa-solid fa-hourglass-start",
    "fa-solid fa-hourglass-1",
    "fa-solid fa-blender-phone",
    "fa-solid fa-building-wheat",
    "fa-solid fa-person-breastfeeding",
    "fa-solid fa-right-to-bracket",
    "fa-solid fa-sign-in-alt",
    "fa-solid fa-venus",
    "fa-solid fa-passport",
    "fa-solid fa-thumbtack-slash",
    "fa-solid fa-thumb-tack-slash",
    "fa-solid fa-heart-pulse",
    "fa-solid fa-heartbeat",
    "fa-solid fa-people-carry-box",
    "fa-solid fa-people-carry",
    "fa-solid fa-temperature-high",
    "fa-solid fa-microchip",
    "fa-solid fa-crown",
    "fa-solid fa-weight-hanging",
    "fa-solid fa-xmarks-lines",
    "fa-solid fa-file-prescription",
    "fa-solid fa-weight-scale",
    "fa-solid fa-weight",
    "fa-solid fa-user-group",
    "fa-solid fa-user-friends",
    "fa-solid fa-arrow-up-a-z",
    "fa-solid fa-sort-alpha-up",
    "fa-solid fa-chess-knight",
    "fa-solid fa-face-laugh-squint",
    "fa-solid fa-laugh-squint",
    "fa-solid fa-wheelchair",
    "fa-solid fa-circle-arrow-up",
    "fa-solid fa-arrow-circle-up",
    "fa-solid fa-toggle-on",
    "fa-solid fa-person-walking",
    "fa-solid fa-walking",
    "fa-solid fa-l",
    "fa-solid fa-fire",
    "fa-solid fa-bed-pulse",
    "fa-solid fa-procedures",
    "fa-solid fa-shuttle-space",
    "fa-solid fa-space-shuttle",
    "fa-solid fa-face-laugh",
    "fa-solid fa-laugh",
    "fa-solid fa-folder-open",
    "fa-solid fa-heart-circle-plus",
    "fa-solid fa-code-fork",
    "fa-solid fa-city",
    "fa-solid fa-microphone-lines",
    "fa-solid fa-microphone-alt",
    "fa-solid fa-pepper-hot",
    "fa-solid fa-unlock",
    "fa-solid fa-colon-sign",
    "fa-solid fa-headset",
    "fa-solid fa-store-slash",
    "fa-solid fa-road-circle-xmark",
    "fa-solid fa-user-minus",
    "fa-solid fa-mars-stroke-up",
    "fa-solid fa-mars-stroke-v",
    "fa-solid fa-champagne-glasses",
    "fa-solid fa-glass-cheers",
    "fa-solid fa-clipboard",
    "fa-solid fa-house-circle-exclamation",
    "fa-solid fa-file-arrow-up",
    "fa-solid fa-file-upload",
    "fa-solid fa-wifi",
    "fa-solid fa-wifi-3",
    "fa-solid fa-wifi-strong",
    "fa-solid fa-bath",
    "fa-solid fa-bathtub",
    "fa-solid fa-underline",
    "fa-solid fa-user-pen",
    "fa-solid fa-user-edit",
    "fa-solid fa-signature",
    "fa-solid fa-stroopwafel",
    "fa-solid fa-bold",
    "fa-solid fa-anchor-lock",
    "fa-solid fa-building-ngo",
    "fa-solid fa-manat-sign",
    "fa-solid fa-not-equal",
    "fa-solid fa-border-top-left",
    "fa-solid fa-border-style",
    "fa-solid fa-map-location-dot",
    "fa-solid fa-map-marked-alt",
    "fa-solid fa-jedi",
    "fa-solid fa-square-poll-vertical",
    "fa-solid fa-poll",
    "fa-solid fa-mug-hot",
    "fa-solid fa-car-battery",
    "fa-solid fa-battery-car",
    "fa-solid fa-gift",
    "fa-solid fa-dice-two",
    "fa-solid fa-chess-queen",
    "fa-solid fa-glasses",
    "fa-solid fa-chess-board",
    "fa-solid fa-building-circle-check",
    "fa-solid fa-person-chalkboard",
    "fa-solid fa-mars-stroke-right",
    "fa-solid fa-mars-stroke-h",
    "fa-solid fa-hand-back-fist",
    "fa-solid fa-hand-rock",
    "fa-solid fa-square-caret-up",
    "fa-solid fa-caret-square-up",
    "fa-solid fa-cloud-showers-water",
    "fa-solid fa-chart-bar",
    "fa-solid fa-bar-chart",
    "fa-solid fa-hands-bubbles",
    "fa-solid fa-hands-wash",
    "fa-solid fa-less-than-equal",
    "fa-solid fa-train",
    "fa-solid fa-eye-low-vision",
    "fa-solid fa-low-vision",
    "fa-solid fa-crow",
    "fa-solid fa-sailboat",
    "fa-solid fa-window-restore",
    "fa-solid fa-square-plus",
    "fa-solid fa-plus-square",
    "fa-solid fa-torii-gate",
    "fa-solid fa-frog",
    "fa-solid fa-bucket",
    "fa-solid fa-image",
    "fa-solid fa-microphone",
    "fa-solid fa-cow",
    "fa-solid fa-caret-up",
    "fa-solid fa-screwdriver",
    "fa-solid fa-folder-closed",
    "fa-solid fa-house-tsunami",
    "fa-solid fa-square-nfi",
    "fa-solid fa-arrow-up-from-ground-water",
    "fa-solid fa-martini-glass",
    "fa-solid fa-glass-martini-alt",
    "fa-solid fa-square-binary",
    "fa-solid fa-rotate-left",
    "fa-solid fa-rotate-back",
    "fa-solid fa-rotate-backward",
    "fa-solid fa-undo-alt",
    "fa-solid fa-table-columns",
    "fa-solid fa-columns",
    "fa-solid fa-lemon",
    "fa-solid fa-head-side-mask",
    "fa-solid fa-handshake",
    "fa-solid fa-gem",
    "fa-solid fa-dolly",
    "fa-solid fa-dolly-box",
    "fa-solid fa-smoking",
    "fa-solid fa-minimize",
    "fa-solid fa-compress-arrows-alt",
    "fa-solid fa-monument",
    "fa-solid fa-snowplow",
    "fa-solid fa-angles-right",
    "fa-solid fa-angle-double-right",
    "fa-solid fa-cannabis",
    "fa-solid fa-circle-play",
    "fa-solid fa-play-circle",
    "fa-solid fa-tablets",
    "fa-solid fa-ethernet",
    "fa-solid fa-euro-sign",
    "fa-solid fa-eur",
    "fa-solid fa-euro",
    "fa-solid fa-chair",
    "fa-solid fa-circle-check",
    "fa-solid fa-check-circle",
    "fa-solid fa-circle-stop",
    "fa-solid fa-stop-circle",
    "fa-solid fa-compass-drafting",
    "fa-solid fa-drafting-compass",
    "fa-solid fa-plate-wheat",
    "fa-solid fa-icicles",
    "fa-solid fa-person-shelter",
    "fa-solid fa-neuter",
    "fa-solid fa-id-badge",
    "fa-solid fa-marker",
    "fa-solid fa-face-laugh-beam",
    "fa-solid fa-laugh-beam",
    "fa-solid fa-helicopter-symbol",
    "fa-solid fa-universal-access",
    "fa-solid fa-circle-chevron-up",
    "fa-solid fa-chevron-circle-up",
    "fa-solid fa-lari-sign",
    "fa-solid fa-volcano",
    "fa-solid fa-person-walking-dashed-line-arrow-right",
    "fa-solid fa-sterling-sign",
    "fa-solid fa-gbp",
    "fa-solid fa-pound-sign",
    "fa-solid fa-viruses",
    "fa-solid fa-square-person-confined",
    "fa-solid fa-user-tie",
    "fa-solid fa-arrow-down-long",
    "fa-solid fa-long-arrow-down",
    "fa-solid fa-tent-arrow-down-to-line",
    "fa-solid fa-certificate",
    "fa-solid fa-reply-all",
    "fa-solid fa-mail-reply-all",
    "fa-solid fa-suitcase",
    "fa-solid fa-person-skating",
    "fa-solid fa-skating",
    "fa-solid fa-filter-circle-dollar",
    "fa-solid fa-funnel-dollar",
    "fa-solid fa-camera-retro",
    "fa-solid fa-circle-arrow-down",
    "fa-solid fa-arrow-circle-down",
    "fa-solid fa-file-import",
    "fa-solid fa-arrow-right-to-file",
    "fa-solid fa-square-arrow-up-right",
    "fa-solid fa-external-link-square",
    "fa-solid fa-box-open",
    "fa-solid fa-scroll",
    "fa-solid fa-spa",
    "fa-solid fa-location-pin-lock",
    "fa-solid fa-pause",
    "fa-solid fa-hill-avalanche",
    "fa-solid fa-temperature-empty",
    "fa-solid fa-temperature-0",
    "fa-solid fa-thermometer-0",
    "fa-solid fa-thermometer-empty",
    "fa-solid fa-bomb",
    "fa-solid fa-registered",
    "fa-solid fa-address-card",
    "fa-solid fa-contact-card",
    "fa-solid fa-vcard",
    "fa-solid fa-scale-unbalanced-flip",
    "fa-solid fa-balance-scale-right",
    "fa-solid fa-subscript",
    "fa-solid fa-diamond-turn-right",
    "fa-solid fa-directions",
    "fa-solid fa-burst",
    "fa-solid fa-house-laptop",
    "fa-solid fa-laptop-house",
    "fa-solid fa-face-tired",
    "fa-solid fa-tired",
    "fa-solid fa-money-bills",
    "fa-solid fa-smog",
    "fa-solid fa-crutch",
    "fa-solid fa-cloud-arrow-up",
    "fa-solid fa-cloud-upload",
    "fa-solid fa-cloud-upload-alt",
    "fa-solid fa-palette",
    "fa-solid fa-arrows-turn-right",
    "fa-solid fa-vest",
    "fa-solid fa-ferry",
    "fa-solid fa-arrows-down-to-people",
    "fa-solid fa-seedling",
    "fa-solid fa-sprout",
    "fa-solid fa-left-right",
    "fa-solid fa-arrows-alt-h",
    "fa-solid fa-boxes-packing",
    "fa-solid fa-circle-arrow-left",
    "fa-solid fa-arrow-circle-left",
    "fa-solid fa-group-arrows-rotate",
    "fa-solid fa-bowl-food",
    "fa-solid fa-candy-cane",
    "fa-solid fa-arrow-down-wide-short",
    "fa-solid fa-sort-amount-asc",
    "fa-solid fa-sort-amount-down",
    "fa-solid fa-cloud-bolt",
    "fa-solid fa-thunderstorm",
    "fa-solid fa-text-slash",
    "fa-solid fa-remove-format",
    "fa-solid fa-face-smile-wink",
    "fa-solid fa-smile-wink",
    "fa-solid fa-file-word",
    "fa-solid fa-file-powerpoint",
    "fa-solid fa-arrows-left-right",
    "fa-solid fa-arrows-h",
    "fa-solid fa-house-lock",
    "fa-solid fa-cloud-arrow-down",
    "fa-solid fa-cloud-download",
    "fa-solid fa-cloud-download-alt",
    "fa-solid fa-children",
    "fa-solid fa-chalkboard",
    "fa-solid fa-blackboard",
    "fa-solid fa-user-large-slash",
    "fa-solid fa-user-alt-slash",
    "fa-solid fa-envelope-open",
    "fa-solid fa-handshake-simple-slash",
    "fa-solid fa-handshake-alt-slash",
    "fa-solid fa-mattress-pillow",
    "fa-solid fa-guarani-sign",
    "fa-solid fa-arrows-rotate",
    "fa-solid fa-refresh",
    "fa-solid fa-sync",
    "fa-solid fa-fire-extinguisher",
    "fa-solid fa-cruzeiro-sign",
    "fa-solid fa-greater-than-equal",
    "fa-solid fa-shield-halved",
    "fa-solid fa-shield-alt",
    "fa-solid fa-book-atlas",
    "fa-solid fa-atlas",
    "fa-solid fa-virus",
    "fa-solid fa-envelope-circle-check",
    "fa-solid fa-layer-group",
    "fa-solid fa-arrows-to-dot",
    "fa-solid fa-archway",
    "fa-solid fa-heart-circle-check",
    "fa-solid fa-house-chimney-crack",
    "fa-solid fa-house-damage",
    "fa-solid fa-file-zipper",
    "fa-solid fa-file-archive",
    "fa-solid fa-square",
    "fa-solid fa-martini-glass-empty",
    "fa-solid fa-glass-martini",
    "fa-solid fa-couch",
    "fa-solid fa-cedi-sign",
    "fa-solid fa-italic",
    "fa-solid fa-table-cells-column-lock",
    "fa-solid fa-church",
    "fa-solid fa-comments-dollar",
    "fa-solid fa-democrat",
    "fa-solid fa-z",
    "fa-solid fa-person-skiing",
    "fa-solid fa-skiing",
    "fa-solid fa-road-lock",
    "fa-solid fa-a",
    "fa-solid fa-temperature-arrow-down",
    "fa-solid fa-temperature-down",
    "fa-solid fa-feather-pointed",
    "fa-solid fa-feather-alt",
    "fa-solid fa-p",
    "fa-solid fa-snowflake",
    "fa-solid fa-newspaper",
    "fa-solid fa-rectangle-ad",
    "fa-solid fa-ad",
    "fa-solid fa-circle-arrow-right",
    "fa-solid fa-arrow-circle-right",
    "fa-solid fa-filter-circle-xmark",
    "fa-solid fa-locust",
    "fa-solid fa-sort",
    "fa-solid fa-unsorted",
    "fa-solid fa-list-ol",
    "fa-solid fa-list-1-2",
    "fa-solid fa-list-numeric",
    "fa-solid fa-person-dress-burst",
    "fa-solid fa-money-check-dollar",
    "fa-solid fa-money-check-alt",
    "fa-solid fa-vector-square",
    "fa-solid fa-bread-slice",
    "fa-solid fa-language",
    "fa-solid fa-face-kiss-wink-heart",
    "fa-solid fa-kiss-wink-heart",
    "fa-solid fa-filter",
    "fa-solid fa-question",
    "fa-solid fa-file-signature",
    "fa-solid fa-up-down-left-right",
    "fa-solid fa-arrows-alt",
    "fa-solid fa-house-chimney-user",
    "fa-solid fa-hand-holding-heart",
    "fa-solid fa-puzzle-piece",
    "fa-solid fa-money-check",
    "fa-solid fa-star-half-stroke",
    "fa-solid fa-star-half-alt",
    "fa-solid fa-code",
    "fa-solid fa-whiskey-glass",
    "fa-solid fa-glass-whiskey",
    "fa-solid fa-building-circle-exclamation",
    "fa-solid fa-magnifying-glass-chart",
    "fa-solid fa-arrow-up-right-from-square",
    "fa-solid fa-external-link",
    "fa-solid fa-cubes-stacked",
    "fa-solid fa-won-sign",
    "fa-solid fa-krw",
    "fa-solid fa-won",
    "fa-solid fa-virus-covid",
    "fa-solid fa-austral-sign",
    "fa-solid fa-f",
    "fa-solid fa-leaf",
    "fa-solid fa-road",
    "fa-solid fa-taxi",
    "fa-solid fa-cab",
    "fa-solid fa-person-circle-plus",
    "fa-solid fa-chart-pie",
    "fa-solid fa-pie-chart",
    "fa-solid fa-bolt-lightning",
    "fa-solid fa-sack-xmark",
    "fa-solid fa-file-excel",
    "fa-solid fa-file-contract",
    "fa-solid fa-fish-fins",
    "fa-solid fa-building-flag",
    "fa-solid fa-face-grin-beam",
    "fa-solid fa-grin-beam",
    "fa-solid fa-object-ungroup",
    "fa-solid fa-poop",
    "fa-solid fa-location-pin",
    "fa-solid fa-map-marker",
    "fa-solid fa-kaaba",
    "fa-solid fa-toilet-paper",
    "fa-solid fa-helmet-safety",
    "fa-solid fa-hard-hat",
    "fa-solid fa-hat-hard",
    "fa-solid fa-eject",
    "fa-solid fa-circle-right",
    "fa-solid fa-arrow-alt-circle-right",
    "fa-solid fa-plane-circle-check",
    "fa-solid fa-face-rolling-eyes",
    "fa-solid fa-meh-rolling-eyes",
    "fa-solid fa-object-group",
    "fa-solid fa-chart-line",
    "fa-solid fa-line-chart",
    "fa-solid fa-mask-ventilator",
    "fa-solid fa-arrow-right",
    "fa-solid fa-signs-post",
    "fa-solid fa-map-signs",
    "fa-solid fa-cash-register",
    "fa-solid fa-person-circle-question",
    "fa-solid fa-h",
    "fa-solid fa-tarp",
    "fa-solid fa-screwdriver-wrench",
    "fa-solid fa-tools",
    "fa-solid fa-arrows-to-eye",
    "fa-solid fa-plug-circle-bolt",
    "fa-solid fa-heart",
    "fa-solid fa-mars-and-venus",
    "fa-solid fa-house-user",
    "fa-solid fa-home-user",
    "fa-solid fa-dumpster-fire",
    "fa-solid fa-house-crack",
    "fa-solid fa-martini-glass-citrus",
    "fa-solid fa-cocktail",
    "fa-solid fa-face-surprise",
    "fa-solid fa-surprise",
    "fa-solid fa-bottle-water",
    "fa-solid fa-circle-pause",
    "fa-solid fa-pause-circle",
    "fa-solid fa-toilet-paper-slash",
    "fa-solid fa-apple-whole",
    "fa-solid fa-apple-alt",
    "fa-solid fa-kitchen-set",
    "fa-solid fa-r",
    "fa-solid fa-temperature-quarter",
    "fa-solid fa-temperature-1",
    "fa-solid fa-thermometer-1",
    "fa-solid fa-thermometer-quarter",
    "fa-solid fa-cube",
    "fa-solid fa-bitcoin-sign",
    "fa-solid fa-shield-dog",
    "fa-solid fa-solar-panel",
    "fa-solid fa-lock-open",
    "fa-solid fa-elevator",
    "fa-solid fa-money-bill-transfer",
    "fa-solid fa-money-bill-trend-up",
    "fa-solid fa-house-flood-water-circle-arrow-right",
    "fa-solid fa-square-poll-horizontal",
    "fa-solid fa-poll-h",
    "fa-solid fa-circle",
    "fa-solid fa-backward-fast",
    "fa-solid fa-fast-backward",
    "fa-solid fa-recycle",
    "fa-solid fa-user-astronaut",
    "fa-solid fa-plane-slash",
    "fa-solid fa-trademark",
    "fa-solid fa-basketball",
    "fa-solid fa-basketball-ball",
    "fa-solid fa-satellite-dish",
    "fa-solid fa-circle-up",
    "fa-solid fa-arrow-alt-circle-up",
    "fa-solid fa-mobile-screen-button",
    "fa-solid fa-mobile-alt",
    "fa-solid fa-volume-high",
    "fa-solid fa-volume-up",
    "fa-solid fa-users-rays",
    "fa-solid fa-wallet",
    "fa-solid fa-clipboard-check",
    "fa-solid fa-file-audio",
    "fa-solid fa-burger",
    "fa-solid fa-hamburger",
    "fa-solid fa-wrench",
    "fa-solid fa-bugs",
    "fa-solid fa-rupee-sign",
    "fa-solid fa-rupee",
    "fa-solid fa-file-image",
    "fa-solid fa-circle-question",
    "fa-solid fa-question-circle",
    "fa-solid fa-plane-departure",
    "fa-solid fa-handshake-slash",
    "fa-solid fa-book-bookmark",
    "fa-solid fa-code-branch",
    "fa-solid fa-hat-cowboy",
    "fa-solid fa-bridge",
    "fa-solid fa-phone-flip",
    "fa-solid fa-phone-alt",
    "fa-solid fa-truck-front",
    "fa-solid fa-cat",
    "fa-solid fa-anchor-circle-exclamation",
    "fa-solid fa-truck-field",
    "fa-solid fa-route",
    "fa-solid fa-clipboard-question",
    "fa-solid fa-panorama",
    "fa-solid fa-comment-medical",
    "fa-solid fa-teeth-open",
    "fa-solid fa-file-circle-minus",
    "fa-solid fa-tags",
    "fa-solid fa-wine-glass",
    "fa-solid fa-forward-fast",
    "fa-solid fa-fast-forward",
    "fa-solid fa-face-meh-blank",
    "fa-solid fa-meh-blank",
    "fa-solid fa-square-parking",
    "fa-solid fa-parking",
    "fa-solid fa-house-signal",
    "fa-solid fa-bars-progress",
    "fa-solid fa-tasks-alt",
    "fa-solid fa-faucet-drip",
    "fa-solid fa-cart-flatbed",
    "fa-solid fa-dolly-flatbed",
    "fa-solid fa-ban-smoking",
    "fa-solid fa-smoking-ban",
    "fa-solid fa-terminal",
    "fa-solid fa-mobile-button",
    "fa-solid fa-house-medical-flag",
    "fa-solid fa-basket-shopping",
    "fa-solid fa-shopping-basket",
    "fa-solid fa-tape",
    "fa-solid fa-bus-simple",
    "fa-solid fa-bus-alt",
    "fa-solid fa-eye",
    "fa-solid fa-face-sad-cry",
    "fa-solid fa-sad-cry",
    "fa-solid fa-audio-description",
    "fa-solid fa-person-military-to-person",
    "fa-solid fa-file-shield",
    "fa-solid fa-user-slash",
    "fa-solid fa-pen",
    "fa-solid fa-tower-observation",
    "fa-solid fa-file-code",
    "fa-solid fa-signal",
    "fa-solid fa-signal-5",
    "fa-solid fa-signal-perfect",
    "fa-solid fa-bus",
    "fa-solid fa-heart-circle-xmark",
    "fa-solid fa-house-chimney",
    "fa-solid fa-home-lg",
    "fa-solid fa-window-maximize",
    "fa-solid fa-face-frown",
    "fa-solid fa-frown",
    "fa-solid fa-prescription",
    "fa-solid fa-shop",
    "fa-solid fa-store-alt",
    "fa-solid fa-floppy-disk",
    "fa-solid fa-save",
    "fa-solid fa-vihara",
    "fa-solid fa-scale-unbalanced",
    "fa-solid fa-balance-scale-left",
    "fa-solid fa-sort-up",
    "fa-solid fa-sort-asc",
    "fa-solid fa-comment-dots",
    "fa-solid fa-commenting",
    "fa-solid fa-plant-wilt",
    "fa-solid fa-diamond",
    "fa-solid fa-face-grin-squint",
    "fa-solid fa-grin-squint",
    "fa-solid fa-hand-holding-dollar",
    "fa-solid fa-hand-holding-usd",
    "fa-solid fa-chart-diagram",
    "fa-solid fa-bacterium",
    "fa-solid fa-hand-pointer",
    "fa-solid fa-drum-steelpan",
    "fa-solid fa-hand-scissors",
    "fa-solid fa-hands-praying",
    "fa-solid fa-praying-hands",
    "fa-solid fa-arrow-rotate-right",
    "fa-solid fa-arrow-right-rotate",
    "fa-solid fa-arrow-rotate-forward",
    "fa-solid fa-redo",
    "fa-solid fa-biohazard",
    "fa-solid fa-location-crosshairs",
    "fa-solid fa-location",
    "fa-solid fa-mars-double",
    "fa-solid fa-child-dress",
    "fa-solid fa-users-between-lines",
    "fa-solid fa-lungs-virus",
    "fa-solid fa-face-grin-tears",
    "fa-solid fa-grin-tears",
    "fa-solid fa-phone",
    "fa-solid fa-calendar-xmark",
    "fa-solid fa-calendar-times",
    "fa-solid fa-child-reaching",
    "fa-solid fa-head-side-virus",
    "fa-solid fa-user-gear",
    "fa-solid fa-user-cog",
    "fa-solid fa-arrow-up-1-9",
    "fa-solid fa-sort-numeric-up",
    "fa-solid fa-door-closed",
    "fa-solid fa-shield-virus",
    "fa-solid fa-dice-six",
    "fa-solid fa-mosquito-net",
    "fa-solid fa-file-fragment",
    "fa-solid fa-bridge-water",
    "fa-solid fa-person-booth",
    "fa-solid fa-text-width",
    "fa-solid fa-hat-wizard",
    "fa-solid fa-pen-fancy",
    "fa-solid fa-person-digging",
    "fa-solid fa-digging",
    "fa-solid fa-trash",
    "fa-solid fa-gauge-simple",
    "fa-solid fa-gauge-simple-med",
    "fa-solid fa-tachometer-average",
    "fa-solid fa-book-medical",
    "fa-solid fa-poo",
    "fa-solid fa-quote-right",
    "fa-solid fa-quote-right-alt",
    "fa-solid fa-shirt",
    "fa-solid fa-t-shirt",
    "fa-solid fa-tshirt",
    "fa-solid fa-cubes",
    "fa-solid fa-divide",
    "fa-solid fa-tenge-sign",
    "fa-solid fa-tenge",
    "fa-solid fa-headphones",
    "fa-solid fa-hands-holding",
    "fa-solid fa-hands-clapping",
    "fa-solid fa-republican",
    "fa-solid fa-arrow-left",
    "fa-solid fa-person-circle-xmark",
    "fa-solid fa-ruler",
    "fa-solid fa-align-left",
    "fa-solid fa-dice-d6",
    "fa-solid fa-restroom",
    "fa-solid fa-j",
    "fa-solid fa-users-viewfinder",
    "fa-solid fa-file-video",
    "fa-solid fa-up-right-from-square",
    "fa-solid fa-external-link-alt",
    "fa-solid fa-table-cells",
    "fa-solid fa-th",
    "fa-solid fa-file-pdf",
    "fa-solid fa-book-bible",
    "fa-solid fa-bible",
    "fa-solid fa-o",
    "fa-solid fa-suitcase-medical",
    "fa-solid fa-medkit",
    "fa-solid fa-user-secret",
    "fa-solid fa-otter",
    "fa-solid fa-person-dress",
    "fa-solid fa-female",
    "fa-solid fa-comment-dollar",
    "fa-solid fa-business-time",
    "fa-solid fa-briefcase-clock",
    "fa-solid fa-table-cells-large",
    "fa-solid fa-th-large",
    "fa-solid fa-book-tanakh",
    "fa-solid fa-tanakh",
    "fa-solid fa-phone-volume",
    "fa-solid fa-volume-control-phone",
    "fa-solid fa-hat-cowboy-side",
    "fa-solid fa-clipboard-user",
    "fa-solid fa-child",
    "fa-solid fa-lira-sign",
    "fa-solid fa-satellite",
    "fa-solid fa-plane-lock",
    "fa-solid fa-tag",
    "fa-solid fa-comment",
    "fa-solid fa-cake-candles",
    "fa-solid fa-birthday-cake",
    "fa-solid fa-cake",
    "fa-solid fa-envelope",
    "fa-solid fa-angles-up",
    "fa-solid fa-angle-double-up",
    "fa-solid fa-paperclip",
    "fa-solid fa-arrow-right-to-city",
    "fa-solid fa-ribbon",
    "fa-solid fa-lungs",
    "fa-solid fa-arrow-up-9-1",
    "fa-solid fa-sort-numeric-up-alt",
    "fa-solid fa-litecoin-sign",
    "fa-solid fa-border-none",
    "fa-solid fa-circle-nodes",
    "fa-solid fa-parachute-box",
    "fa-solid fa-indent",
    "fa-solid fa-truck-field-un",
    "fa-solid fa-hourglass",
    "fa-solid fa-hourglass-empty",
    "fa-solid fa-mountain",
    "fa-solid fa-user-doctor",
    "fa-solid fa-user-md",
    "fa-solid fa-circle-info",
    "fa-solid fa-info-circle",
    "fa-solid fa-cloud-meatball",
    "fa-solid fa-camera",
    "fa-solid fa-camera-alt",
    "fa-solid fa-square-virus",
    "fa-solid fa-meteor",
    "fa-solid fa-car-on",
    "fa-solid fa-sleigh",
    "fa-solid fa-arrow-down-1-9",
    "fa-solid fa-sort-numeric-asc",
    "fa-solid fa-sort-numeric-down",
    "fa-solid fa-hand-holding-droplet",
    "fa-solid fa-hand-holding-water",
    "fa-solid fa-water",
    "fa-solid fa-calendar-check",
    "fa-solid fa-braille",
    "fa-solid fa-prescription-bottle-medical",
    "fa-solid fa-prescription-bottle-alt",
    "fa-solid fa-landmark",
    "fa-solid fa-truck",
    "fa-solid fa-crosshairs",
    "fa-solid fa-person-cane",
    "fa-solid fa-tent",
    "fa-solid fa-vest-patches",
    "fa-solid fa-check-double",
    "fa-solid fa-arrow-down-a-z",
    "fa-solid fa-sort-alpha-asc",
    "fa-solid fa-sort-alpha-down",
    "fa-solid fa-money-bill-wheat",
    "fa-solid fa-cookie",
    "fa-solid fa-arrow-rotate-left",
    "fa-solid fa-arrow-left-rotate",
    "fa-solid fa-arrow-rotate-back",
    "fa-solid fa-arrow-rotate-backward",
    "fa-solid fa-undo",
    "fa-solid fa-hard-drive",
    "fa-solid fa-hdd",
    "fa-solid fa-face-grin-squint-tears",
    "fa-solid fa-grin-squint-tears",
    "fa-solid fa-dumbbell",
    "fa-solid fa-rectangle-list",
    "fa-solid fa-list-alt",
    "fa-solid fa-tarp-droplet",
    "fa-solid fa-house-medical-circle-check",
    "fa-solid fa-person-skiing-nordic",
    "fa-solid fa-skiing-nordic",
    "fa-solid fa-calendar-plus",
    "fa-solid fa-plane-arrival",
    "fa-solid fa-circle-left",
    "fa-solid fa-arrow-alt-circle-left",
    "fa-solid fa-train-subway",
    "fa-solid fa-subway",
    "fa-solid fa-chart-gantt",
    "fa-solid fa-indian-rupee-sign",
    "fa-solid fa-indian-rupee",
    "fa-solid fa-inr",
    "fa-solid fa-crop-simple",
    "fa-solid fa-crop-alt",
    "fa-solid fa-money-bill-1",
    "fa-solid fa-money-bill-alt",
    "fa-solid fa-left-long",
    "fa-solid fa-long-arrow-alt-left",
    "fa-solid fa-dna",
    "fa-solid fa-virus-slash",
    "fa-solid fa-minus",
    "fa-solid fa-subtract",
    "fa-solid fa-chess",
    "fa-solid fa-arrow-left-long",
    "fa-solid fa-long-arrow-left",
    "fa-solid fa-plug-circle-check",
    "fa-solid fa-street-view",
    "fa-solid fa-franc-sign",
    "fa-solid fa-volume-off",
    "fa-solid fa-hands-asl-interpreting",
    "fa-solid fa-american-sign-language-interpreting",
    "fa-solid fa-asl-interpreting",
    "fa-solid fa-hands-american-sign-language-interpreting",
    "fa-solid fa-gear",
    "fa-solid fa-cog",
    "fa-solid fa-droplet-slash",
    "fa-solid fa-tint-slash",
    "fa-solid fa-mosque",
    "fa-solid fa-mosquito",
    "fa-solid fa-star-of-david",
    "fa-solid fa-person-military-rifle",
    "fa-solid fa-cart-shopping",
    "fa-solid fa-shopping-cart",
    "fa-solid fa-vials",
    "fa-solid fa-plug-circle-plus",
    "fa-solid fa-place-of-worship",
    "fa-solid fa-grip-vertical",
    "fa-solid fa-hexagon-nodes",
    "fa-solid fa-arrow-turn-up",
    "fa-solid fa-level-up",
    "fa-solid fa-u",
    "fa-solid fa-square-root-variable",
    "fa-solid fa-square-root-alt",
    "fa-solid fa-clock",
    "fa-solid fa-clock-four",
    "fa-solid fa-backward-step",
    "fa-solid fa-step-backward",
    "fa-solid fa-pallet",
    "fa-solid fa-faucet",
    "fa-solid fa-baseball-bat-ball",
    "fa-solid fa-s",
    "fa-solid fa-timeline",
    "fa-solid fa-keyboard",
    "fa-solid fa-caret-down",
    "fa-solid fa-house-chimney-medical",
    "fa-solid fa-clinic-medical",
    "fa-solid fa-temperature-three-quarters",
    "fa-solid fa-temperature-3",
    "fa-solid fa-thermometer-3",
    "fa-solid fa-thermometer-three-quarters",
    "fa-solid fa-mobile-screen",
    "fa-solid fa-mobile-android-alt",
    "fa-solid fa-plane-up",
    "fa-solid fa-piggy-bank",
    "fa-solid fa-battery-half",
    "fa-solid fa-battery-3",
    "fa-solid fa-mountain-city",
    "fa-solid fa-coins",
    "fa-solid fa-khanda",
    "fa-solid fa-sliders",
    "fa-solid fa-sliders-h",
    "fa-solid fa-folder-tree",
    "fa-solid fa-network-wired",
    "fa-solid fa-map-pin",
    "fa-solid fa-hamsa",
    "fa-solid fa-cent-sign",
    "fa-solid fa-flask",
    "fa-solid fa-person-pregnant",
    "fa-solid fa-wand-sparkles",
    "fa-solid fa-ellipsis-vertical",
    "fa-solid fa-ellipsis-v",
    "fa-solid fa-ticket",
    "fa-solid fa-power-off",
    "fa-solid fa-right-long",
    "fa-solid fa-long-arrow-alt-right",
    "fa-solid fa-flag-usa",
    "fa-solid fa-laptop-file",
    "fa-solid fa-tty",
    "fa-solid fa-teletype",
    "fa-solid fa-diagram-next",
    "fa-solid fa-person-rifle",
    "fa-solid fa-house-medical-circle-exclamation",
    "fa-solid fa-closed-captioning",
    "fa-solid fa-person-hiking",
    "fa-solid fa-hiking",
    "fa-solid fa-venus-double",
    "fa-solid fa-images",
    "fa-solid fa-calculator",
    "fa-solid fa-people-pulling",
    "fa-solid fa-n",
    "fa-solid fa-cable-car",
    "fa-solid fa-tram",
    "fa-solid fa-cloud-rain",
    "fa-solid fa-building-circle-xmark",
    "fa-solid fa-ship",
    "fa-solid fa-arrows-down-to-line",
    "fa-solid fa-download",
    "fa-solid fa-face-grin",
    "fa-solid fa-grin",
    "fa-solid fa-delete-left",
    "fa-solid fa-backspace",
    "fa-solid fa-eye-dropper",
    "fa-solid fa-eye-dropper-empty",
    "fa-solid fa-eyedropper",
    "fa-solid fa-file-circle-check",
    "fa-solid fa-forward",
    "fa-solid fa-mobile",
    "fa-solid fa-mobile-android",
    "fa-solid fa-mobile-phone",
    "fa-solid fa-face-meh",
    "fa-solid fa-meh",
    "fa-solid fa-align-center",
    "fa-solid fa-book-skull",
    "fa-solid fa-book-dead",
    "fa-solid fa-id-card",
    "fa-solid fa-drivers-license",
    "fa-solid fa-outdent",
    "fa-solid fa-dedent",
    "fa-solid fa-heart-circle-exclamation",
    "fa-solid fa-house",
    "fa-solid fa-home",
    "fa-solid fa-home-alt",
    "fa-solid fa-home-lg-alt",
    "fa-solid fa-calendar-week",
    "fa-solid fa-laptop-medical",
    "fa-solid fa-b",
    "fa-solid fa-file-medical",
    "fa-solid fa-dice-one",
    "fa-solid fa-kiwi-bird",
    "fa-solid fa-arrow-right-arrow-left",
    "fa-solid fa-exchange",
    "fa-solid fa-rotate-right",
    "fa-solid fa-redo-alt",
    "fa-solid fa-rotate-forward",
    "fa-solid fa-utensils",
    "fa-solid fa-cutlery",
    "fa-solid fa-arrow-up-wide-short",
    "fa-solid fa-sort-amount-up",
    "fa-solid fa-mill-sign",
    "fa-solid fa-bowl-rice",
    "fa-solid fa-skull",
    "fa-solid fa-tower-broadcast",
    "fa-solid fa-broadcast-tower",
    "fa-solid fa-truck-pickup",
    "fa-solid fa-up-long",
    "fa-solid fa-long-arrow-alt-up",
    "fa-solid fa-stop",
    "fa-solid fa-code-merge",
    "fa-solid fa-upload",
    "fa-solid fa-hurricane",
    "fa-solid fa-mound",
    "fa-solid fa-toilet-portable",
    "fa-solid fa-compact-disc",
    "fa-solid fa-file-arrow-down",
    "fa-solid fa-file-download",
    "fa-solid fa-caravan",
    "fa-solid fa-shield-cat",
    "fa-solid fa-bolt",
    "fa-solid fa-zap",
    "fa-solid fa-glass-water",
    "fa-solid fa-oil-well",
    "fa-solid fa-vault",
    "fa-solid fa-mars",
    "fa-solid fa-toilet",
    "fa-solid fa-plane-circle-xmark",
    "fa-solid fa-yen-sign",
    "fa-solid fa-cny",
    "fa-solid fa-jpy",
    "fa-solid fa-rmb",
    "fa-solid fa-yen",
    "fa-solid fa-ruble-sign",
    "fa-solid fa-rouble",
    "fa-solid fa-rub",
    "fa-solid fa-ruble",
    "fa-solid fa-sun",
    "fa-solid fa-guitar",
    "fa-solid fa-face-laugh-wink",
    "fa-solid fa-laugh-wink",
    "fa-solid fa-horse-head",
    "fa-solid fa-bore-hole",
    "fa-solid fa-industry",
    "fa-solid fa-circle-down",
    "fa-solid fa-arrow-alt-circle-down",
    "fa-solid fa-arrows-turn-to-dots",
    "fa-solid fa-florin-sign",
    "fa-solid fa-arrow-down-short-wide",
    "fa-solid fa-sort-amount-desc",
    "fa-solid fa-sort-amount-down-alt",
    "fa-solid fa-less-than",
    "fa-solid fa-angle-down",
    "fa-solid fa-car-tunnel",
    "fa-solid fa-head-side-cough",
    "fa-solid fa-grip-lines",
    "fa-solid fa-thumbs-down",
    "fa-solid fa-user-lock",
    "fa-solid fa-arrow-right-long",
    "fa-solid fa-long-arrow-right",
    "fa-solid fa-anchor-circle-xmark",
    "fa-solid fa-ellipsis",
    "fa-solid fa-ellipsis-h",
    "fa-solid fa-chess-pawn",
    "fa-solid fa-kit-medical",
    "fa-solid fa-first-aid",
    "fa-solid fa-person-through-window",
    "fa-solid fa-toolbox",
    "fa-solid fa-hands-holding-circle",
    "fa-solid fa-bug",
    "fa-solid fa-credit-card",
    "fa-solid fa-credit-card-alt",
    "fa-solid fa-car",
    "fa-solid fa-automobile",
    "fa-solid fa-hand-holding-hand",
    "fa-solid fa-book-open-reader",
    "fa-solid fa-book-reader",
    "fa-solid fa-mountain-sun",
    "fa-solid fa-arrows-left-right-to-line",
    "fa-solid fa-dice-d20",
    "fa-solid fa-truck-droplet",
    "fa-solid fa-file-circle-xmark",
    "fa-solid fa-temperature-arrow-up",
    "fa-solid fa-temperature-up",
    "fa-solid fa-medal",
    "fa-solid fa-bed",
    "fa-solid fa-square-h",
    "fa-solid fa-h-square",
    "fa-solid fa-podcast",
    "fa-solid fa-temperature-full",
    "fa-solid fa-temperature-4",
    "fa-solid fa-thermometer-4",
    "fa-solid fa-thermometer-full",
    "fa-solid fa-bell",
    "fa-solid fa-superscript",
    "fa-solid fa-plug-circle-xmark",
    "fa-solid fa-star-of-life",
    "fa-solid fa-phone-slash",
    "fa-solid fa-paint-roller",
    "fa-solid fa-handshake-angle",
    "fa-solid fa-hands-helping",
    "fa-solid fa-location-dot",
    "fa-solid fa-map-marker-alt",
    "fa-solid fa-file",
    "fa-solid fa-greater-than",
    "fa-solid fa-person-swimming",
    "fa-solid fa-swimmer",
    "fa-solid fa-arrow-down",
    "fa-solid fa-droplet",
    "fa-solid fa-tint",
    "fa-solid fa-eraser",
    "fa-solid fa-earth-americas",
    "fa-solid fa-earth",
    "fa-solid fa-earth-america",
    "fa-solid fa-globe-americas",
    "fa-solid fa-person-burst",
    "fa-solid fa-dove",
    "fa-solid fa-battery-empty",
    "fa-solid fa-battery-0",
    "fa-solid fa-socks",
    "fa-solid fa-inbox",
    "fa-solid fa-section",
    "fa-solid fa-gauge-high",
    "fa-solid fa-tachometer-alt",
    "fa-solid fa-tachometer-alt-fast",
    "fa-solid fa-envelope-open-text",
    "fa-solid fa-hospital",
    "fa-solid fa-hospital-alt",
    "fa-solid fa-hospital-wide",
    "fa-solid fa-wine-bottle",
    "fa-solid fa-chess-rook",
    "fa-solid fa-bars-staggered",
    "fa-solid fa-reorder",
    "fa-solid fa-stream",
    "fa-solid fa-dharmachakra",
    "fa-solid fa-hotdog",
    "fa-solid fa-person-walking-with-cane",
    "fa-solid fa-blind",
    "fa-solid fa-drum",
    "fa-solid fa-ice-cream",
    "fa-solid fa-heart-circle-bolt",
    "fa-solid fa-fax",
    "fa-solid fa-paragraph",
    "fa-solid fa-check-to-slot",
    "fa-solid fa-vote-yea",
    "fa-solid fa-star-half",
    "fa-solid fa-boxes-stacked",
    "fa-solid fa-boxes",
    "fa-solid fa-boxes-alt",
    "fa-solid fa-link",
    "fa-solid fa-chain",
    "fa-solid fa-ear-listen",
    "fa-solid fa-assistive-listening-systems",
    "fa-solid fa-tree-city",
    "fa-solid fa-play",
    "fa-solid fa-font",
    "fa-solid fa-table-cells-row-lock",
    "fa-solid fa-rupiah-sign",
    "fa-solid fa-magnifying-glass",
    "fa-solid fa-search",
    "fa-solid fa-table-tennis-paddle-ball",
    "fa-solid fa-ping-pong-paddle-ball",
    "fa-solid fa-table-tennis",
    "fa-solid fa-person-dots-from-line",
    "fa-solid fa-diagnoses",
    "fa-solid fa-trash-can-arrow-up",
    "fa-solid fa-trash-restore-alt",
    "fa-solid fa-naira-sign",
    "fa-solid fa-cart-arrow-down",
    "fa-solid fa-walkie-talkie",
    "fa-solid fa-file-pen",
    "fa-solid fa-file-edit",
    "fa-solid fa-receipt",
    "fa-solid fa-square-pen",
    "fa-solid fa-pen-square",
    "fa-solid fa-pencil-square",
    "fa-solid fa-suitcase-rolling",
    "fa-solid fa-person-circle-exclamation",
    "fa-solid fa-chevron-down",
    "fa-solid fa-battery-full",
    "fa-solid fa-battery",
    "fa-solid fa-battery-5",
    "fa-solid fa-skull-crossbones",
    "fa-solid fa-code-compare",
    "fa-solid fa-list-ul",
    "fa-solid fa-list-dots",
    "fa-solid fa-school-lock",
    "fa-solid fa-tower-cell",
    "fa-solid fa-down-long",
    "fa-solid fa-long-arrow-alt-down",
    "fa-solid fa-ranking-star",
    "fa-solid fa-chess-king",
    "fa-solid fa-person-harassing",
    "fa-solid fa-brazilian-real-sign",
    "fa-solid fa-landmark-dome",
    "fa-solid fa-landmark-alt",
    "fa-solid fa-arrow-up",
    "fa-solid fa-tv",
    "fa-solid fa-television",
    "fa-solid fa-tv-alt",
    "fa-solid fa-shrimp",
    "fa-solid fa-list-check",
    "fa-solid fa-tasks",
    "fa-solid fa-jug-detergent",
    "fa-solid fa-circle-user",
    "fa-solid fa-user-circle",
    "fa-solid fa-user-shield",
    "fa-solid fa-wind",
    "fa-solid fa-car-burst",
    "fa-solid fa-car-crash",
    "fa-solid fa-y",
    "fa-solid fa-person-snowboarding",
    "fa-solid fa-snowboarding",
    "fa-solid fa-truck-fast",
    "fa-solid fa-shipping-fast",
    "fa-solid fa-fish",
    "fa-solid fa-user-graduate",
    "fa-solid fa-circle-half-stroke",
    "fa-solid fa-adjust",
    "fa-solid fa-clapperboard",
    "fa-solid fa-circle-radiation",
    "fa-solid fa-radiation-alt",
    "fa-solid fa-baseball",
    "fa-solid fa-baseball-ball",
    "fa-solid fa-jet-fighter-up",
    "fa-solid fa-diagram-project",
    "fa-solid fa-project-diagram",
    "fa-solid fa-copy",
    "fa-solid fa-volume-xmark",
    "fa-solid fa-volume-mute",
    "fa-solid fa-volume-times",
    "fa-solid fa-hand-sparkles",
    "fa-solid fa-grip",
    "fa-solid fa-grip-horizontal",
    "fa-solid fa-share-from-square",
    "fa-solid fa-share-square",
    "fa-solid fa-child-combatant",
    "fa-solid fa-child-rifle",
    "fa-solid fa-gun",
    "fa-solid fa-square-phone",
    "fa-solid fa-phone-square",
    "fa-solid fa-plus",
    "fa-solid fa-add",
    "fa-solid fa-expand",
    "fa-solid fa-computer",
    "fa-solid fa-xmark",
    "fa-solid fa-close",
    "fa-solid fa-multiply",
    "fa-solid fa-remove",
    "fa-solid fa-times",
    "fa-solid fa-arrows-up-down-left-right",
    "fa-solid fa-arrows",
    "fa-solid fa-chalkboard-user",
    "fa-solid fa-chalkboard-teacher",
    "fa-solid fa-peso-sign",
    "fa-solid fa-building-shield",
    "fa-solid fa-baby",
    "fa-solid fa-users-line",
    "fa-solid fa-quote-left",
    "fa-solid fa-quote-left-alt",
    "fa-solid fa-tractor",
    "fa-solid fa-trash-arrow-up",
    "fa-solid fa-trash-restore",
    "fa-solid fa-arrow-down-up-lock",
    "fa-solid fa-lines-leaning",
    "fa-solid fa-ruler-combined",
    "fa-solid fa-copyright",
    "fa-solid fa-equals",
    "fa-solid fa-blender",
    "fa-solid fa-teeth",
    "fa-solid fa-shekel-sign",
    "fa-solid fa-ils",
    "fa-solid fa-shekel",
    "fa-solid fa-sheqel",
    "fa-solid fa-sheqel-sign",
    "fa-solid fa-map",
    "fa-solid fa-rocket",
    "fa-solid fa-photo-film",
    "fa-solid fa-photo-video",
    "fa-solid fa-folder-minus",
    "fa-solid fa-hexagon-nodes-bolt",
    "fa-solid fa-store",
    "fa-solid fa-arrow-trend-up",
    "fa-solid fa-plug-circle-minus",
    "fa-solid fa-sign-hanging",
    "fa-solid fa-sign",
    "fa-solid fa-bezier-curve",
    "fa-solid fa-bell-slash",
    "fa-solid fa-tablet",
    "fa-solid fa-tablet-android",
    "fa-solid fa-school-flag",
    "fa-solid fa-fill",
    "fa-solid fa-angle-up",
    "fa-solid fa-drumstick-bite",
    "fa-solid fa-holly-berry",
    "fa-solid fa-chevron-left",
    "fa-solid fa-bacteria",
    "fa-solid fa-hand-lizard",
    "fa-solid fa-notdef",
    "fa-solid fa-disease",
    "fa-solid fa-briefcase-medical",
    "fa-solid fa-genderless",
    "fa-solid fa-chevron-right",
    "fa-solid fa-retweet",
    "fa-solid fa-car-rear",
    "fa-solid fa-car-alt",
    "fa-solid fa-pump-soap",
    "fa-solid fa-video-slash",
    "fa-solid fa-battery-quarter",
    "fa-solid fa-battery-2",
    "fa-solid fa-radio",
    "fa-solid fa-baby-carriage",
    "fa-solid fa-carriage-baby",
    "fa-solid fa-traffic-light",
    "fa-solid fa-thermometer",
    "fa-solid fa-vr-cardboard",
    "fa-solid fa-hand-middle-finger",
    "fa-solid fa-percent",
    "fa-solid fa-percentage",
    "fa-solid fa-truck-moving",
    "fa-solid fa-glass-water-droplet",
    "fa-solid fa-display",
    "fa-solid fa-face-smile",
    "fa-solid fa-smile",
    "fa-solid fa-thumbtack",
    "fa-solid fa-thumb-tack",
    "fa-solid fa-trophy",
    "fa-solid fa-person-praying",
    "fa-solid fa-pray",
    "fa-solid fa-hammer",
    "fa-solid fa-hand-peace",
    "fa-solid fa-rotate",
    "fa-solid fa-sync-alt",
    "fa-solid fa-spinner",
    "fa-solid fa-robot",
    "fa-solid fa-peace",
    "fa-solid fa-gears",
    "fa-solid fa-cogs",
    "fa-solid fa-warehouse",
    "fa-solid fa-arrow-up-right-dots",
    "fa-solid fa-splotch",
    "fa-solid fa-face-grin-hearts",
    "fa-solid fa-grin-hearts",
    "fa-solid fa-dice-four",
    "fa-solid fa-sim-card",
    "fa-solid fa-transgender",
    "fa-solid fa-transgender-alt",
    "fa-solid fa-mercury",
    "fa-solid fa-arrow-turn-down",
    "fa-solid fa-level-down",
    "fa-solid fa-person-falling-burst",
    "fa-solid fa-award",
    "fa-solid fa-ticket-simple",
    "fa-solid fa-ticket-alt",
    "fa-solid fa-building",
    "fa-solid fa-angles-left",
    "fa-solid fa-angle-double-left",
    "fa-solid fa-qrcode",
    "fa-solid fa-clock-rotate-left",
    "fa-solid fa-history",
    "fa-solid fa-face-grin-beam-sweat",
    "fa-solid fa-grin-beam-sweat",
    "fa-solid fa-file-export",
    "fa-solid fa-arrow-right-from-file",
    "fa-solid fa-shield",
    "fa-solid fa-shield-blank",
    "fa-solid fa-arrow-up-short-wide",
    "fa-solid fa-sort-amount-up-alt",
    "fa-solid fa-comment-nodes",
    "fa-solid fa-house-medical",
    "fa-solid fa-golf-ball-tee",
    "fa-solid fa-golf-ball",
    "fa-solid fa-circle-chevron-left",
    "fa-solid fa-chevron-circle-left",
    "fa-solid fa-house-chimney-window",
    "fa-solid fa-pen-nib",
    "fa-solid fa-tent-arrow-turn-left",
    "fa-solid fa-tents",
    "fa-solid fa-wand-magic",
    "fa-solid fa-magic",
    "fa-solid fa-dog",
    "fa-solid fa-carrot",
    "fa-solid fa-moon",
    "fa-solid fa-wine-glass-empty",
    "fa-solid fa-wine-glass-alt",
    "fa-solid fa-cheese",
    "fa-solid fa-yin-yang",
    "fa-solid fa-music",
    "fa-solid fa-code-commit",
    "fa-solid fa-temperature-low",
    "fa-solid fa-person-biking",
    "fa-solid fa-biking",
    "fa-solid fa-broom",
    "fa-solid fa-shield-heart",
    "fa-solid fa-gopuram",
    "fa-solid fa-earth-oceania",
    "fa-solid fa-globe-oceania",
    "fa-solid fa-square-xmark",
    "fa-solid fa-times-square",
    "fa-solid fa-xmark-square",
    "fa-solid fa-hashtag",
    "fa-solid fa-up-right-and-down-left-from-center",
    "fa-solid fa-expand-alt",
    "fa-solid fa-oil-can",
    "fa-solid fa-t",
    "fa-solid fa-hippo",
    "fa-solid fa-chart-column",
    "fa-solid fa-infinity",
    "fa-solid fa-vial-circle-check",
    "fa-solid fa-person-arrow-down-to-line",
    "fa-solid fa-voicemail",
    "fa-solid fa-fan",
    "fa-solid fa-person-walking-luggage",
    "fa-solid fa-up-down",
    "fa-solid fa-arrows-alt-v",
    "fa-solid fa-cloud-moon-rain",
    "fa-solid fa-calendar",
    "fa-solid fa-trailer",
    "fa-solid fa-bahai",
    "fa-solid fa-haykal",
    "fa-solid fa-sd-card",
    "fa-solid fa-dragon",
    "fa-solid fa-shoe-prints",
    "fa-solid fa-circle-plus",
    "fa-solid fa-plus-circle",
    "fa-solid fa-face-grin-tongue-wink",
    "fa-solid fa-grin-tongue-wink",
    "fa-solid fa-hand-holding",
    "fa-solid fa-plug-circle-exclamation",
    "fa-solid fa-link-slash",
    "fa-solid fa-chain-broken",
    "fa-solid fa-chain-slash",
    "fa-solid fa-unlink",
    "fa-solid fa-clone",
    "fa-solid fa-person-walking-arrow-loop-left",
    "fa-solid fa-arrow-up-z-a",
    "fa-solid fa-sort-alpha-up-alt",
    "fa-solid fa-fire-flame-curved",
    "fa-solid fa-fire-alt",
    "fa-solid fa-tornado",
    "fa-solid fa-file-circle-plus",
    "fa-solid fa-book-quran",
    "fa-solid fa-quran",
    "fa-solid fa-anchor",
    "fa-solid fa-border-all",
    "fa-solid fa-face-angry",
    "fa-solid fa-angry",
    "fa-solid fa-cookie-bite",
    "fa-solid fa-arrow-trend-down",
    "fa-solid fa-rss",
    "fa-solid fa-feed",
    "fa-solid fa-draw-polygon",
    "fa-solid fa-scale-balanced",
    "fa-solid fa-balance-scale",
    "fa-solid fa-gauge-simple-high",
    "fa-solid fa-tachometer",
    "fa-solid fa-tachometer-fast",
    "fa-solid fa-shower",
    "fa-solid fa-desktop",
    "fa-solid fa-desktop-alt",
    "fa-solid fa-m",
    "fa-solid fa-table-list",
    "fa-solid fa-th-list",
    "fa-solid fa-comment-sms",
    "fa-solid fa-sms",
    "fa-solid fa-book",
    "fa-solid fa-user-plus",
    "fa-solid fa-check",
    "fa-solid fa-battery-three-quarters",
    "fa-solid fa-battery-4",
    "fa-solid fa-house-circle-check",
    "fa-solid fa-angle-left",
    "fa-solid fa-diagram-successor",
    "fa-solid fa-truck-arrow-right",
    "fa-solid fa-arrows-split-up-and-left",
    "fa-solid fa-hand-fist",
    "fa-solid fa-fist-raised",
    "fa-solid fa-cloud-moon",
    "fa-solid fa-briefcase",
    "fa-solid fa-person-falling",
    "fa-solid fa-image-portrait",
    "fa-solid fa-portrait",
    "fa-solid fa-user-tag",
    "fa-solid fa-rug",
    "fa-solid fa-earth-europe",
    "fa-solid fa-globe-europe",
    "fa-solid fa-cart-flatbed-suitcase",
    "fa-solid fa-luggage-cart",
    "fa-solid fa-rectangle-xmark",
    "fa-solid fa-rectangle-times",
    "fa-solid fa-times-rectangle",
    "fa-solid fa-window-close",
    "fa-solid fa-baht-sign",
    "fa-solid fa-book-open",
    "fa-solid fa-book-journal-whills",
    "fa-solid fa-journal-whills",
    "fa-solid fa-handcuffs",
    "fa-solid fa-triangle-exclamation",
    "fa-solid fa-exclamation-triangle",
    "fa-solid fa-warning",
    "fa-solid fa-database",
    "fa-solid fa-share",
    "fa-solid fa-mail-forward",
    "fa-solid fa-bottle-droplet",
    "fa-solid fa-mask-face",
    "fa-solid fa-hill-rockslide",
    "fa-solid fa-right-left",
    "fa-solid fa-exchange-alt",
    "fa-solid fa-paper-plane",
    "fa-solid fa-road-circle-exclamation",
    "fa-solid fa-dungeon",
    "fa-solid fa-align-right",
    "fa-solid fa-money-bill-1-wave",
    "fa-solid fa-money-bill-wave-alt",
    "fa-solid fa-life-ring",
    "fa-solid fa-hands",
    "fa-solid fa-sign-language",
    "fa-solid fa-signing",
    "fa-solid fa-calendar-day",
    "fa-solid fa-water-ladder",
    "fa-solid fa-ladder-water",
    "fa-solid fa-swimming-pool",
    "fa-solid fa-arrows-up-down",
    "fa-solid fa-arrows-v",
    "fa-solid fa-face-grimace",
    "fa-solid fa-grimace",
    "fa-solid fa-wheelchair-move",
    "fa-solid fa-wheelchair-alt",
    "fa-solid fa-turn-down",
    "fa-solid fa-level-down-alt",
    "fa-solid fa-person-walking-arrow-right",
    "fa-solid fa-square-envelope",
    "fa-solid fa-envelope-square",
    "fa-solid fa-dice",
    "fa-solid fa-bowling-ball",
    "fa-solid fa-brain",
    "fa-solid fa-bandage",
    "fa-solid fa-band-aid",
    "fa-solid fa-calendar-minus",
    "fa-solid fa-circle-xmark",
    "fa-solid fa-times-circle",
    "fa-solid fa-xmark-circle",
    "fa-solid fa-gifts",
    "fa-solid fa-hotel",
    "fa-solid fa-earth-asia",
    "fa-solid fa-globe-asia",
    "fa-solid fa-id-card-clip",
    "fa-solid fa-id-card-alt",
    "fa-solid fa-magnifying-glass-plus",
    "fa-solid fa-search-plus",
    "fa-solid fa-thumbs-up",
    "fa-solid fa-user-clock",
    "fa-solid fa-hand-dots",
    "fa-solid fa-allergies",
    "fa-solid fa-file-invoice",
    "fa-solid fa-window-minimize",
    "fa-solid fa-mug-saucer",
    "fa-solid fa-coffee",
    "fa-solid fa-brush",
    "fa-solid fa-file-half-dashed",
    "fa-solid fa-mask",
    "fa-solid fa-magnifying-glass-minus",
    "fa-solid fa-search-minus",
    "fa-solid fa-ruler-vertical",
    "fa-solid fa-user-large",
    "fa-solid fa-user-alt",
    "fa-solid fa-train-tram",
    "fa-solid fa-user-nurse",
    "fa-solid fa-syringe",
    "fa-solid fa-cloud-sun",
    "fa-solid fa-stopwatch-20",
    "fa-solid fa-square-full",
    "fa-solid fa-magnet",
    "fa-solid fa-jar",
    "fa-solid fa-note-sticky",
    "fa-solid fa-sticky-note",
    "fa-solid fa-bug-slash",
    "fa-solid fa-arrow-up-from-water-pump",
    "fa-solid fa-bone",
    "fa-solid fa-table-cells-row-unlock",
    "fa-solid fa-user-injured",
    "fa-solid fa-face-sad-tear",
    "fa-solid fa-sad-tear",
    "fa-solid fa-plane",
    "fa-solid fa-tent-arrows-down",
    "fa-solid fa-exclamation",
    "fa-solid fa-arrows-spin",
    "fa-solid fa-print",
    "fa-solid fa-turkish-lira-sign",
    "fa-solid fa-try",
    "fa-solid fa-turkish-lira",
    "fa-solid fa-dollar-sign",
    "fa-solid fa-dollar",
    "fa-solid fa-usd",
    "fa-solid fa-x",
    "fa-solid fa-magnifying-glass-dollar",
    "fa-solid fa-search-dollar",
    "fa-solid fa-users-gear",
    "fa-solid fa-users-cog",
    "fa-solid fa-person-military-pointing",
    "fa-solid fa-building-columns",
    "fa-solid fa-bank",
    "fa-solid fa-institution",
    "fa-solid fa-museum",
    "fa-solid fa-university",
    "fa-solid fa-umbrella",
    "fa-solid fa-trowel",
    "fa-solid fa-d",
    "fa-solid fa-stapler",
    "fa-solid fa-masks-theater",
    "fa-solid fa-theater-masks",
    "fa-solid fa-kip-sign",
    "fa-solid fa-hand-point-left",
    "fa-solid fa-handshake-simple",
    "fa-solid fa-handshake-alt",
    "fa-solid fa-jet-fighter",
    "fa-solid fa-fighter-jet",
    "fa-solid fa-square-share-nodes",
    "fa-solid fa-share-alt-square",
    "fa-solid fa-barcode",
    "fa-solid fa-plus-minus",
    "fa-solid fa-video",
    "fa-solid fa-video-camera",
    "fa-solid fa-graduation-cap",
    "fa-solid fa-mortar-board",
    "fa-solid fa-hand-holding-medical",
    "fa-solid fa-person-circle-check",
    "fa-solid fa-turn-up",
    "fa-solid fa-level-up-alt"
  ] };

  // src/tinyeditor.ts
  var TinyEditorToolbar = class {
    TOOLBAR_ITEM = "__toolbar-item";
    toolbar_dom;
    toolbar_dom_items = [];
    selected_editor = null;
    icon_selector_modal_is_shown = false;
    icon_selector_modal_dom;
    icon_selector_modal_dom_close;
    icon_selector_modal_dom_search;
    icon_selector_modal_dom_content;
    icon_selector_modal_dom_resolve = null;
    icon_selector_modal_close() {
      this.icon_selector_modal_is_shown = false;
      this.icon_selector_modal_dom.style.display = "none";
      this.icon_selector_modal_dom_resolve = null;
    }
    icon_selector_modal_render() {
      this.icon_selector_modal_dom_content.innerHTML = "";
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
    icon_selector_modal() {
      return new Promise((resolve) => {
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
    constructor(targetElement, options) {
      this.toolbar_dom = targetElement;
      this.toolbar_dom.classList.add("__toolbar");
      this.icon_selector_modal_dom = this.toolbar_dom.appendChild(document.createElement("div"));
      this.icon_selector_modal_dom.id = targetElement.id + "__icon-selector";
      this.icon_selector_modal_dom.className = "__icon-selector";
      this.icon_selector_modal_dom.style.display = "none";
      this.icon_selector_modal_dom_search = this.icon_selector_modal_dom.appendChild(document.createElement("input"));
      this.icon_selector_modal_dom_search.placeholder = "Icon..";
      this.icon_selector_modal_dom_search.className = "__icon-selector-search be-form-control";
      this.icon_selector_modal_dom_search.addEventListener("input", () => {
        this.icon_selector_modal_render();
      });
      this.icon_selector_modal_dom_close = this.icon_selector_modal_dom.appendChild(document.createElement("div"));
      this.icon_selector_modal_dom_close.className = "__icon-selector-close";
      this.icon_selector_modal_dom_close.innerHTML = '<i class="fa-solid fa-times" title="fa-solid fa-times"></i>';
      this.icon_selector_modal_dom_close.addEventListener("click", () => this.icon_selector_modal_close());
      this.icon_selector_modal_dom_content = this.icon_selector_modal_dom.appendChild(document.createElement("div"));
      this.icon_selector_modal_dom_content.className = "__icon-selector-content";
      if (options.formatblock === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createSelect(
            "formatblock",
            "Styles",
            [
              { value: "h1", text: "Title 1" },
              { value: "h2", text: "Title 2" },
              { value: "h3", text: "Title 3" },
              { value: "h4", text: "Title 4" },
              { value: "h5", text: "Title 5" },
              { value: "h6", text: "Title 6" },
              { value: "p", text: "Paragraph", selected: true },
              { value: "pre", text: "Preformatted" }
            ]
          )
        );
      }
      if (options.fontname === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createSelect(
            "fontname",
            "Font",
            [
              { value: "serif", text: "Serif", selected: true },
              { value: "sans-serif", text: "Sans Serif" },
              { value: "monospace", text: "Monospace" },
              { value: "cursive", text: "Cursive" },
              { value: "fantasy", text: "Fantasy" }
            ]
          )
        );
      }
      if (options.bold === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("bold", "Bold", this.createIcon("fa-solid fa-bold"))
        );
      }
      if (options.italic === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("italic", "Italic", this.createIcon("fa-solid fa-italic"))
        );
      }
      if (options.underline === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("underline", "Underline", this.createIcon("fa-solid fa-underline"))
        );
      }
      if (options.textcolor === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createInput("forecolor", "Text color", "color")
        );
      }
      if (options.textleft === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("justifyleft", "Left align", this.createIcon("fa-solid fa-align-left"))
        );
      }
      if (options.textcenter === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("justifycenter", "Center align", this.createIcon("fa-solid fa-align-center"))
        );
      }
      if (options.textright === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("justifyright", "Right align", this.createIcon("fa-solid fa-align-right"))
        );
      }
      if (options.insertorderedlist === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("insertorderedlist", "Numbered list", this.createIcon("fa-solid fa-list-ol"))
        );
      }
      if (options.insertunorderedlist === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("insertunorderedlist", "Bulleted list", this.createIcon("fa-solid fa-list-ul"))
        );
      }
      if (options.outdent === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("outdent", "Decrease indent", this.createIcon("fa-solid fa-indent fa-flip-horizontal"))
        );
      }
      if (options.indent === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("indent", "Increase indent", this.createIcon("fa-solid fa-indent"))
        );
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(this.createSeparator());
      }
      if (options.removeFormat === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("removeFormat", "Clear formatting", this.createIcon("fa-solid fa-eraser"))
        );
      }
      if (options.image === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton(
            "createImage",
            "Create Image",
            this.createIcon("fa-solid fa-image")
          )
        );
      }
      if (options.image === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton(
            "createIcon",
            "Create Icon",
            this.createIcon("fa-solid fa-flag")
          )
        );
      }
      if (options.hyperlink === true) {
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("createLink", "Create Hyperlink", this.createIcon("fa-solid fa-link"))
        );
        this.toolbar_dom_items[this.toolbar_dom_items.length] = this.toolbar_dom.appendChild(
          this.createButton("removeLink", "remove Hyperlink", this.createIcon("fa-solid fa-unlink"))
        );
      }
      this.toolbar_dom.addEventListener("click", () => this.updateActiveState());
    }
    updateActiveState() {
      const toolbarSelects = this.toolbar_dom.querySelectorAll("select[data-command-id]");
      for (let i = 0; i < toolbarSelects.length; i++) {
        const select = toolbarSelects[i];
        const value = document.queryCommandValue(select.dataset.commandId);
        const option = Array.from(select.options).find(
          (_option) => {
            const option2 = _option;
            return option2.value === value;
          }
        );
        select.selectedIndex = option ? option.index : -1;
      }
      const toolbarButtons = this.toolbar_dom.querySelectorAll("button[data-command-id]");
      for (let i = 0; i < toolbarButtons.length; i++) {
        const button = toolbarButtons[i];
        const active = document.queryCommandState(button.dataset.commandId);
        button.classList.toggle("active", active);
      }
      const inputButtons = this.toolbar_dom.querySelectorAll("input[data-command-id]");
      for (let i = 0; i < inputButtons.length; i++) {
        const input = inputButtons[i];
        const value = document.queryCommandValue(input.dataset.commandId);
        const converted_value = this.rgbToHex(value);
        if (converted_value) input.value = converted_value;
      }
    }
    rgbToHex(color) {
      const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
      if (digits !== null && digits.length > 5) {
        const red = parseInt(digits[2]);
        const green = parseInt(digits[3]);
        const blue = parseInt(digits[4]);
        const rgb = blue | green << 8 | red << 16;
        let color_hex = rgb.toString(16);
        const to = 6 - color_hex.length;
        for (let i = 0; i < to; i++) {
          color_hex = "0" + color_hex;
        }
        return digits[1] + "#" + color_hex;
      }
      return null;
    }
    createButton(commandId, title, child) {
      const button = document.createElement("button");
      button.dataset.commandId = commandId;
      button.className = this.TOOLBAR_ITEM;
      button.title = title;
      button.type = "button";
      button.appendChild(child);
      button.addEventListener("click", () => {
        if (this.selected_editor !== null) this.selected_editor.execCommand(commandId, "");
      });
      return button;
    }
    createOption(value, text, selected) {
      const option = document.createElement("option");
      option.innerText = text;
      if (value) option.setAttribute("value", value);
      if (selected) option.selected = true;
      return option;
    }
    createSelect(commandId, title, options) {
      const select = document.createElement("select");
      select.dataset.commandId = commandId;
      select.className = this.TOOLBAR_ITEM;
      select.title = title;
      select.addEventListener("change", (e) => {
        if (e.target === null) {
          return;
        } else {
          const target = e.target;
          if (this.selected_editor !== null) return this.selected_editor.execCommand(commandId, target.options[target.selectedIndex].value);
        }
      });
      for (const option of options) {
        select.appendChild(
          this.createOption(option.value, option.text, option.selected === true)
        );
      }
      return select;
    }
    createIcon(className) {
      const icon = document.createElement("i");
      icon.className = className;
      return icon;
    }
    createInput(commandId, title, type) {
      const input = document.createElement("input");
      input.dataset.commandId = commandId;
      input.className = this.TOOLBAR_ITEM;
      input.title = title;
      input.type = type;
      input.addEventListener("change", () => {
        if (this.selected_editor !== null) return this.selected_editor.execCommand(commandId, input.value);
      });
      return input;
    }
    createSeparator() {
      const separator = document.createElement("span");
      separator.className = "__toolbar-separator";
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
    showTheseItems(commandIds) {
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
  };
  var TinyEditor = class {
    editor;
    toolbar;
    callback_onchange = null;
    callback_exec_command_create_image;
    dialog = new Dialog(document.body);
    createElement(_type, _id, _class) {
      const element = document.createElement(_type);
      if (_id !== "") element.id = _id;
      if (_class !== "") element.className = _class;
      return element;
    }
    constructor(editor, options) {
      this.editor = editor;
      editor.classList.add("__editor");
      editor.setAttribute("contentEditable", "true");
      if (typeof options.onchange === "function") this.callback_onchange = options.onchange;
      this.callback_exec_command_create_image = options.exec_command_create_image;
      if (options.toolbar === null) {
        const toolbar_dom = this.editor.appendChild(document.createElement("div"));
        this.toolbar = new TinyEditorToolbar(toolbar_dom, options.tinyeditor_toolbar_options);
        this.toolbar.selected_editor = this;
      } else {
        this.toolbar = options.toolbar;
      }
      this.callback_onchange = options.onchange;
      editor.addEventListener("focusin", () => {
        this.toolbar.selected_editor = this;
      });
      editor.addEventListener("keydown", () => this.toolbar.updateActiveState());
      editor.addEventListener("keyup", () => this.toolbar.updateActiveState());
      editor.addEventListener("click", () => this.toolbar.updateActiveState());
      document.addEventListener("selectionchange", () => {
        const selection = window.getSelection();
        if (selection !== null && selection.anchorNode !== null && !editor.contains(selection.anchorNode.parentNode)) return false;
      });
      editor.addEventListener("paste", (e) => {
        e.preventDefault();
        console.log("[TinyEditor] Paste event", e.clipboardData);
        if (e.clipboardData !== null) {
          let text = e.clipboardData.getData("text/plain");
          text = text.replace(/<html[^>]*>/gi, "");
          text = text.replace(/<\/html>/gi, "");
          text = text.replace(/<head[^>]*>/gi, "");
          text = text.replace(/<\/head>/gi, "");
          text = text.replace(/<body[^>]*>/gi, "");
          text = text.replace(/<\/body>/gi, "");
          text = text.replace(/<img[^>]*>/gi, "");
          document.execCommand("insertHTML", false, text);
          if (this.callback_onchange !== null) this.callback_onchange();
        }
      });
      editor.addEventListener("keypress", (e) => {
        if ((e.keyCode || e.which) === 13) {
          const selection = window.getSelection();
          if (selection !== null) {
            const selection_element = selection.anchorNode.parentNode;
            if (selection_element.tagName === "LI") return;
          }
          document.execCommand("formatBlock", false, "p");
        }
      });
      if (this.callback_onchange !== null) {
        editor.addEventListener("keyup", () => {
          if (this.callback_onchange !== null) this.callback_onchange();
        });
      }
    }
    execCommand(commandId, value) {
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
          if (this.callback_onchange !== null) this.callback_onchange();
          break;
      }
      this.editor.focus();
    }
    execCommand_createImage() {
      let selection_ranges = this.saveSelection();
      if (selection_ranges.length === 0) {
        console.log("[TinyEditor] User tried to create a image without selecting text");
      } else {
        if (!this.editor.contains(selection_ranges[0].startContainer.parentNode) && selection_ranges[0].startContainer.parentNode === null || this.editor !== selection_ranges[0].startContainer.parentNode) {
          console.log("[TinyEditor] User tried to create a image without selecting text");
          this.editor.focus();
          selection_ranges = this.saveSelection();
        }
        const selected_element = this.getElementFromSelection(selection_ranges[0]);
        this.callback_exec_command_create_image().then((image_url) => {
          if (selected_element === null) {
            if (selection_ranges !== null) this.restoreSelection(selection_ranges);
            const newSelection = window.getSelection();
            if (newSelection !== null) {
              const new_element = this.render_image_div(image_url, "200px", "200px");
              newSelection.getRangeAt(0).insertNode(new_element);
              setTimeout(() => new_element.focus(), 100);
            }
          } else {
            selected_element.style.backgroundImage = "url('" + image_url + "')";
          }
          if (this.callback_onchange !== null) this.callback_onchange();
        });
      }
    }
    execCommand_createIcon() {
      let selection_ranges = this.saveSelection();
      if (selection_ranges.length === 0) {
        console.info("[TinyEditor] User tried to create a icon without selecting text");
      } else {
        if (!this.editor.contains(selection_ranges[0].startContainer.parentNode) && selection_ranges[0].startContainer.parentNode === null || this.editor !== selection_ranges[0].startContainer.parentNode) {
          console.info("[TinyEditor] User tried to create a icon without selecting text");
          this.editor.focus();
          selection_ranges = this.saveSelection();
        }
        this.toolbar.icon_selector_modal().then((className) => {
          if (selection_ranges !== null) this.restoreSelection(selection_ranges);
          const newSelection = window.getSelection();
          if (newSelection !== null) {
            const new_element = document.createElement("i");
            new_element.className = className;
            newSelection.getRangeAt(0).insertNode(new_element);
            setTimeout(() => new_element.focus(), 100);
          }
          if (this.callback_onchange !== null) this.callback_onchange();
        });
      }
    }
    render_image_div(image_url, width, height) {
      console.log("[TinyEditor] render_image_div");
      const new_element = document.createElement("div");
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
              new_element.style.height = new_element.clientWidth * ratio + "px";
            }, 1);
          };
          new_element.onmouseup = () => {
            if (this.callback_onchange !== null) this.callback_onchange();
          };
        }
      };
      const lux_context_menu = new LuxContextMenu(new_element);
      const context_menu_items = [];
      const item1 = document.createElement("div");
      item1.innerHTML = "Kein Textumlauf";
      item1.addEventListener("click", () => {
        new_element.style.float = "";
        lux_context_menu.close();
        if (this.callback_onchange !== null) this.callback_onchange();
      });
      context_menu_items.push(item1);
      const item2 = document.createElement("div");
      item2.innerHTML = "Textumlauf, Bild links";
      item2.addEventListener("click", () => {
        new_element.style.float = "left";
        lux_context_menu.close();
        if (this.callback_onchange !== null) this.callback_onchange();
      });
      context_menu_items.push(item2);
      const item3 = document.createElement("div");
      item3.innerHTML = "Textumlauf, Bild rechts";
      item3.addEventListener("click", () => {
        new_element.style.float = "right";
        lux_context_menu.close();
        if (this.callback_onchange !== null) this.callback_onchange();
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
        const row4 = dialog_content.appendChild(document.createElement("div"));
        const class_input = row4.appendChild(document.createElement("input"));
        class_input.id = "class_input";
        class_input.type = "text";
        class_input.className = "be-form-control";
        class_input.placeholder = "Class eingeben.. z.B.: link-marker";
        const selected_element = this.getElementFromSelection(selection_ranges[0]);
        if (selected_element !== null) {
          link_input.value = selected_element.href;
          link_new_tab_input.checked = selected_element.target === "_blank";
          link_marker_input.checked = selected_element.className.includes("link-marker");
          class_input.value = selected_element.className;
        }
        link_marker_input.addEventListener("change", () => {
          const class_value_split = class_input.value.split(" ");
          if (link_marker_input.checked) {
            if (!class_value_split.includes("link-marker")) class_value_split.push("link-marker");
          } else {
            class_value_split.splice(class_value_split.indexOf("link-marker"), 1);
          }
          class_input.value = class_value_split.join(" ");
        });
        class_input.addEventListener("change", () => {
          const class_value_split = class_input.value.split(" ");
          link_marker_input.checked = class_value_split.includes("link-marker");
        });
        this.dialog.start("Link eingeben", dialog_content, "Link setzen", null, null, () => {
          const linkValue = link_input.value;
          const newTab = link_new_tab_input.checked;
          if (selection_ranges !== null) this.restoreSelection(selection_ranges);
          const newSelection = window.getSelection();
          if (newSelection !== null && newSelection.toString()) {
            const new_a_element = document.createElement("a");
            new_a_element.href = linkValue;
            new_a_element.className = class_input.value;
            if (newTab) new_a_element.target = "_blank";
            newSelection.getRangeAt(0).surroundContents(new_a_element);
          }
          this.dialog.close();
          if (this.callback_onchange !== null) this.callback_onchange();
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
        const selected_element = this.getElementFromSelection(selection_ranges[0]);
        if (selected_element === null) {
          console.log("[TinyEditor] User tried to remove a link without selecting text");
        } else if (selected_element.tagName !== "A") {
          console.log("[TinyEditor] User tried to remove a link without selecting an anchor element");
        } else {
          selected_element.outerHTML = selected_element.innerHTML;
        }
      }
    }
    saveSelection() {
      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection !== null && selection.getRangeAt && selection.rangeCount) {
          const ranges = [];
          for (let i = 0, len = selection.rangeCount; i < len; ++i) {
            ranges.push(selection.getRangeAt(i));
          }
          return ranges;
        }
      }
      throw new Error("window.getSelection() is not supported, by this browser.");
    }
    restoreSelection(ranges) {
      if (ranges) {
        if (window.getSelection) {
          const current_selection = window.getSelection();
          if (current_selection !== null) {
            current_selection.removeAllRanges();
            for (let i = 0, len = ranges.length; i < len; ++i) {
              current_selection.addRange(ranges[i]);
            }
            return true;
          }
        }
      }
      return false;
    }
    getElementFromSelection(selection_range) {
      const selected_element = selection_range.startContainer;
      console.log("selection_range", selection_range);
      console.log("selected_element", selected_element);
      if (selected_element.parentElement !== null && selected_element.parentElement.tagName === "A") {
        return selected_element.parentElement;
      } else if (selected_element.nodeName !== "#text") {
        if (selected_element.classList.contains("__editor")) {
          const link_elements = selected_element.querySelectorAll("a");
          if (link_elements.length === 1) {
            return link_elements[0];
          }
        }
      }
      return null;
    }
    import(content) {
      this.editor.innerHTML = content;
      const images = this.editor.getElementsByTagName("img");
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const image_url = image.src;
        image.replaceWith(this.render_image_div(image_url, image.style.width, image.style.height));
      }
    }
    export() {
      let content = "";
      this.editor.childNodes.forEach((node) => {
        if (node.nodeName === "#text") {
          content += node.textContent;
        } else {
          const html_element = node;
          if (html_element.className === "image") {
            const image_url = html_element.style.backgroundImage.replace("url(", "").replace(")", "").replace('"', "").replace('"', "");
            let style = "max-width: 100%; height: auto; width: " + html_element.clientWidth + "px;";
            if (html_element.style.float) style += " float: " + html_element.style.float + ";";
            content += '<img src="' + image_url + '" class="image" style="' + style + '">';
          } else if (html_element.tagName === "A") {
            content += html_element.outerHTML;
            console.log("html_element.outerHTML", html_element.outerHTML);
          } else {
            content += html_element.outerHTML;
          }
        }
      });
      return content;
    }
  };
  var LuxContextMenu = class {
    target;
    context_menu;
    context_menu_items = [];
    constructor(target) {
      this.target = target;
      let context_menu = document.getElementById("lux-context-menu");
      if (context_menu === null) {
        context_menu = document.body.appendChild(document.createElement("div"));
        context_menu.id = "lux-context-menu";
        context_menu.className = "__context_menu";
        context_menu.style.display = "none";
        document.addEventListener("click", (e) => {
          if (e.target !== this.context_menu) {
            this.context_menu.style.display = "none";
          }
        });
      }
      this.context_menu = context_menu;
      this.target.oncontextmenu = (e) => {
        e.preventDefault();
        this.context_menu.innerHTML = "";
        for (let i = 0; i < this.context_menu_items.length; i++) {
          this.context_menu.appendChild(this.context_menu_items[i]);
        }
        this.context_menu.style.top = e.clientY + "px";
        this.context_menu.style.left = e.clientX + "px";
        this.context_menu.style.display = "block";
      };
    }
    set_items(items) {
      this.context_menu_items = items;
      for (let i = 0; i < this.context_menu_items.length; i++) {
        this.context_menu_items[i].className = "__context_menu_item";
      }
      return this;
    }
    close() {
      this.context_menu.style.display = "none";
    }
  };

  // src/baustein_editor.ts
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
    container: 12,
    shortcode: 13,
    static_undeletable: 14,
    isParentType: function(renderType) {
      return renderType === this.container || renderType === this.layout || renderType === this.table || renderType === this.tableRow || renderType === this.spoiler;
    }
  };
  var Position = class {
    parent;
    sort;
    constructor(parent, sort) {
      this.parent = parent;
      this.sort = sort;
    }
  };
  var BausteinStyleProperty = class {
    name;
    type;
    suffix;
    options;
    useAsClass;
    showInBausteinAttributesSidebar;
    constructor(name, type, suffix, options, useAsClass, showInBausteinAttributesSidebar) {
      this.name = name;
      this.type = type;
      this.suffix = suffix;
      this.options = options;
      this.useAsClass = useAsClass;
      this.showInBausteinAttributesSidebar = showInBausteinAttributesSidebar;
    }
    get_html_options() {
      const html_options = [];
      for (let b = 0; b < this.options.length; b++) {
        html_options[b] = document.createElement("option");
        html_options[b].innerHTML = LOCALES.get_item(this.options[b].locale_key);
        html_options[b].value = this.options[b].value;
      }
      return html_options;
    }
  };
  var BausteinStyle = class {
    property;
    value;
    constructor(property, value) {
      this.property = property;
      this.value = value;
    }
  };
  var BausteinAttribute = class {
    name;
    value;
    constructor(name, value) {
      this.name = name;
      this.value = value;
    }
  };
  var ToggleableClass = class {
    name;
    active;
    toggleable;
    constructor(name, active, toggleable) {
      this.name = name;
      this.active = active;
      this.toggleable = toggleable;
    }
  };
  var BausteinTemplate = class {
    type;
    tag;
    renderType;
    style;
    content = "";
    class = "";
    toggleableClasses;
    icon;
    attributes;
    // aditional attributes, will be set before the other attributes like class and style
    // columns, rows for table and layout
    columns = 0;
    rows = 0;
    constructor(type, icon, tag, renderType, toggleableClasses, attributes, style) {
      this.type = type;
      this.icon = icon;
      this.tag = tag;
      this.renderType = renderType;
      this.toggleableClasses = toggleableClasses;
      for (let i = 0; i < this.toggleableClasses.length; i++) {
        const toggableClass = this.toggleableClasses[i];
        if (toggableClass.active) {
          if (this.class !== "") this.class += " ";
          this.class += toggableClass.name;
        }
      }
      this.attributes = [];
      for (let i = 0; i < attributes.length; i++) {
        this.attributes[i] = new BausteinAttribute(attributes[i].name, attributes[i].value);
      }
      this.style = [];
      for (let i = 0; i < style.length; i++) {
        this.style[i] = new BausteinStyle(style[i].property, style[i].value);
      }
    }
    addClass(clazz) {
      const classList = this.class.trim().split(" ");
      if (classList.indexOf(clazz) === -1) {
        classList.push(clazz);
        this.class = classList.join(" ");
      }
    }
    removeClass(clazz) {
      const classList = this.class.trim().split(" ");
      const index = classList.indexOf(clazz);
      if (index !== -1) {
        classList.splice(index, 1);
        this.class = classList.join(" ");
      }
    }
    getAttribute(name) {
      for (let i = 0; i < this.attributes.length; i++) {
        if (this.attributes[i].name === name) {
          return this.attributes[i].value;
        }
      }
      return null;
    }
    setAttribute(name, value) {
      for (let i = 0; i < this.attributes.length; i++) {
        if (this.attributes[i].name === name) {
          this.attributes[i].value = value;
          return;
        }
      }
      this.attributes.push(new BausteinAttribute(name, value));
    }
    isParentType() {
      return bausteinRenderType.isParentType(this.renderType);
    }
    getStyle(name) {
      for (let i = 0; i < this.style.length; i++) {
        if (this.style[i].property.name === name) {
          return this.style[i];
        }
      }
      return null;
    }
    getStyleValue(name, def) {
      const style = this.getStyle(name);
      if (style) {
        return style.value;
      }
      return def;
    }
    setStyle(name, value) {
      for (let i = 0; i < this.style.length; i++) {
        if (this.style[i].property.name === name) {
          this.style[i].value = value;
          return;
        }
      }
      this.addStyle(name, value);
    }
    addStyle(name, value) {
      this.style.push(new BausteinStyle(new BausteinStyleProperty(name, name, [], [], false, false), value));
    }
  };
  var Baustein = class extends BausteinTemplate {
    id;
    title;
    position;
    constructor(id, position, type, tag, renderType, toggleableClasses, attributes, style) {
      const newToggleableClasses = [];
      for (let i = 0; i < toggleableClasses.length; i++) {
        toggleableClasses[i] = new ToggleableClass(toggleableClasses[i].name, toggleableClasses[i].active, toggleableClasses[i].toggleable);
      }
      super(type, null, tag, renderType, newToggleableClasses, attributes, style);
      this.id = id;
      this.title = LOCALES.get_item(type);
      this.position = position;
    }
  };
  var BausteinEditor = class {
    dom_id;
    baustein_counter = 0;
    baustein_id_counter = 0;
    cursor_mode = 0;
    image_upload = null;
    media_register = null;
    preview_iframe_url = null;
    dialog;
    tinyeditor_toolbar_options = {
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
      hyperlink: true
    };
    tinyeditor_toolbar;
    /**
     * A collection of style properties used in the Baustein Editor.
     * Each property is represented as an instance of `BausteinStyleProperty`,
     * which defines the CSS property name, input type, available units, 
     * selectable options, and additional configuration flags.
     *
     * Properties:
     * - `font_size`: Controls the font size with predefined options like "small", "medium", "large", etc.
     * - `font_weight`: Controls the font weight with options like "normal", "bold", "bolder", etc.
     * - `text_decoration`: Controls the text decoration with options like "underline" and "dotted".
     * - `font_style`: Controls the font style with options like "italic" and "oblique".
     * - `text_align`: Controls the text alignment with options like "left", "center", and "right".
     * - `color`: Sets the text color using a color picker.
     * - `background_color`: Sets the background color using a color picker.
     * - `background_image`: Sets the background image using an image selector.
     * - `width`: Sets the width with units like "px" or "%", and an option for "auto".
     * - `height`: Sets the height with units like "px" or "%", and an option for "auto".
     * - `max_width`: Sets the maximum width with units like "px" or "%", and an option for "auto".
     * - `max_height`: Sets the maximum height with units like "px" or "%", and an option for "auto".
     * - `margin_top`, `margin_right`, `margin_bottom`, `margin_left`: Controls the margin for each side with "px" units and an option for "auto".
     * - `border_width_top`, `border_width_right`, `border_width_bottom`, `border_width_left`: Controls the border width for each side with "px" units.
     * - `padding_top`, `padding_right`, `padding_bottom`, `padding_left`: Controls the padding for each side with "px" units.
     *
     * Each property includes:
     * - `name`: The CSS property name.
     * - `type`: The input type (e.g., "select", "color", "number").
     * - `units`: An array of valid units (e.g., "px", "%").
     * - `options`: An array of selectable options with `locale_key` and `value`.
     * - `is_inherited`: A boolean indicating if the property can inherit values.
     * - `is_editable`: A boolean indicating if the property is editable.
     */
    styleProperties = {
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
      padding_left: new BausteinStyleProperty("padding-left", "number", ["px"], [], false, false)
    };
    stylePropertiesArray = Object.values(this.styleProperties);
    be;
    underlay;
    main;
    sidebar;
    toolbar;
    cursormodechanger;
    cursormodechanger_default;
    cursormodechanger_drag;
    toolbar_baustein;
    content;
    preview;
    preview_button_desktop;
    preview_button_mobile;
    preview_button;
    preview_close_button;
    preview_content;
    sidebar_content__site;
    sidebar_content__baustein;
    sidebar_content__baustein_styles;
    ajax_loader;
    bausteine = [];
    addBausteinSelectorItems;
    getStylePropertyByName(name) {
      for (let i = 0; i < this.stylePropertiesArray.length; i++) {
        if (this.stylePropertiesArray[i].name === name) {
          return this.stylePropertiesArray[i];
        }
      }
      return new BausteinStyleProperty(name, "", [], [], false, false);
    }
    data = {
      bausteine: []
    };
    types = {
      bausteinSelector: new BausteinTemplate("bausteinSelector", "", "", bausteinRenderType.bausteinSelector, [], [], []),
      page_content: new BausteinTemplate("page_content", "", "", bausteinRenderType.static_undeletable, [], [], []),
      h1: new BausteinTemplate("h1", "<b>H1</b>", "h1", bausteinRenderType.richtext, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "bold" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" }
      ]),
      h2: new BausteinTemplate("h2", "<b>H2</b>", "h2", bausteinRenderType.richtext, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "bold" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" }
      ]),
      h3: new BausteinTemplate("h3", "<b>H3</b>", "h3", bausteinRenderType.richtext, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "bold" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" }
      ]),
      h4: new BausteinTemplate("h4", "<b>H4</b>", "h4", bausteinRenderType.richtext, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "bold" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" }
      ]),
      h5: new BausteinTemplate("h5", "<b>H5</b>", "h5", bausteinRenderType.richtext, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "bold" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" }
      ]),
      h6: new BausteinTemplate("h6", "<b>H6</b>", "h6", bausteinRenderType.richtext, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "bold" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" }
      ]),
      text: new BausteinTemplate("text", '<i class="fa-solid fa-paragraph"></i>', "div", bausteinRenderType.richtext, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ]),
      btn_primary: new BausteinTemplate("btn_primary", '<i class="fa-solid fa-exclamation"></i>', "a", bausteinRenderType.button, [new ToggleableClass("btn", true, false), new ToggleableClass("btn-primary", true, false)], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ]),
      btn_seccond: new BausteinTemplate("btn_seccond", '<i class="fa-solid fa-exclamation"></i>', "a", bausteinRenderType.button, [new ToggleableClass("btn", true, false), new ToggleableClass("btn-secondary", true, false)], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ]),
      btn_cta: new BausteinTemplate("btn_cta", '<i class="fa-solid fa-exclamation"></i>', "a", bausteinRenderType.button, [new ToggleableClass("btn", true, false), new ToggleableClass("btn-cta", true, false)], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ]),
      html: new BausteinTemplate("html", '<i class="fa-solid fa-html5"></i>', "div", bausteinRenderType.plaintext, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" }
      ]),
      script: new BausteinTemplate("script", '<i class="fa-solid fa-code"></i>', "script", bausteinRenderType.plaintext, [], [], []),
      iframe: new BausteinTemplate("iframe", '<i class="fa-solid fa-code"></i>', "iframe", bausteinRenderType.iframe, [new ToggleableClass("d-block", true, false)], [
        new BausteinAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"),
        new BausteinAttribute("allowfullscreen", "allowfullscreen")
      ], [
        { property: this.styleProperties.width, value: "100%" },
        { property: this.styleProperties.height, value: "300px" }
      ]),
      shortcode: new BausteinTemplate("shortcode", "<b>[..]</b>", "", bausteinRenderType.shortcode, [], [], []),
      image: new BausteinTemplate("image", '<i class="fa-solid fa-image"></i>', "img", bausteinRenderType.image, [], [], [
        { property: this.styleProperties.max_width, value: "100%" },
        { property: this.styleProperties.max_height, value: "" }
      ]),
      spoiler: new BausteinTemplate("spoiler", '<i class="fa-solid fa-box"></i>', "div", bausteinRenderType.spoiler, [], [], []),
      spoiler_toggler: new BausteinTemplate("spoiler_toggler", '<i class="fa-solid fa-box"></i>', "div", bausteinRenderType.spoiler_toggler, [], [], []),
      spoiler_content: new BausteinTemplate("spoiler_content", '<i class="fa-solid fa-box"></i>', "div", bausteinRenderType.spoiler_content, [new ToggleableClass("collapse", true, false)], [], []),
      layout: new BausteinTemplate("layout", '<i class="fa-solid fa-layer-group" style="transform: rotate(90deg);"></i>', "div", bausteinRenderType.layout, [new ToggleableClass("row", true, false)], [], [
        { property: this.styleProperties.max_width, value: "" },
        { property: this.styleProperties.max_height, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ]),
      container: new BausteinTemplate("container", '<i class="fa-solid fa-layer-group"></i>', "div", bausteinRenderType.container, [], [], [
        { property: this.styleProperties.max_width, value: "" },
        { property: this.styleProperties.max_height, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ]),
      table: new BausteinTemplate("table", '<i class="fa-solid fa-table"></i>', "table", bausteinRenderType.table, [new ToggleableClass("rsp-table", true, false)], [], [
        { property: this.styleProperties.max_width, value: "" },
        { property: this.styleProperties.max_height, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ]),
      tableRow: new BausteinTemplate("tableRow", '<i class="fa-solid fa-table"></i>', "tr", bausteinRenderType.tableRow, [], [], []),
      th: new BausteinTemplate("th", '<i class="fa-solid fa-table"></i>', "th", bausteinRenderType.tableCell, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ]),
      td: new BausteinTemplate("td", '<i class="fa-solid fa-table"></i>', "td", bausteinRenderType.tableCell, [], [], [
        { property: this.styleProperties.font_size, value: "" },
        { property: this.styleProperties.text_align, value: "" },
        { property: this.styleProperties.font_weight, value: "" },
        { property: this.styleProperties.text_decoration, value: "" },
        { property: this.styleProperties.font_style, value: "" },
        { property: this.styleProperties.color, value: "" },
        { property: this.styleProperties.background_color, value: "" },
        { property: this.styleProperties.background_image, value: "" }
      ])
    };
    /** types_array gets updated after render() gets called */
    types_array = [];
    getBausteinType(type) {
      for (let i = 0; i < this.types_array.length; i++) {
        if (this.types_array[i].type === type) {
          return this.types_array[i];
        }
      }
      return this.types_array[0];
    }
    be_bausteinSelector_isOpen = false;
    selected_baustein = null;
    selected_baustein_id = null;
    open_baustein_attributes__baustein_id = null;
    open_baustein_attributes__formcontrols = [];
    assets = {
      baustein_image_placeholder: "/img/baustein-image-placeholder.png"
    };
    api_endpoints = {
      image_search: ""
    };
    shortcodes = [];
    createElement(tag, _id, _class) {
      const element = document.createElement(tag);
      if (_id !== "") element.id = _id;
      if (_class !== "") element.className = _class;
      return element;
    }
    constructor(parent, options) {
      this.dom_id = parent.id;
      if (typeof options !== "undefined") {
        if (typeof options.locale !== "undefined") LOCALES.select_locale(options.locale);
        if (typeof options.assets !== "undefined") this.assets = options.assets;
        if (typeof options.api_endpoints !== "undefined") this.api_endpoints = options.api_endpoints;
        if (typeof options.image_upload !== "undefined") this.image_upload = options.image_upload;
        if (typeof options.media_register !== "undefined") this.media_register = options.media_register;
        if (typeof options.preview_iframe_url !== "undefined") this.preview_iframe_url = options.preview_iframe_url;
      }
      this.addBausteinSelectorItems = [
        { title: LOCALES.get_item("titles"), icon: '<i class="fa-solid fa-heading"></i>', items: [this.types.h1, this.types.h2, this.types.h3, this.types.h4, this.types.h5, this.types.h6] },
        { title: LOCALES.get_item(this.types.text.type), icon: this.types.text.icon, items: [this.types.text] },
        { title: LOCALES.get_item(this.types.image.type), icon: this.types.image.icon, items: [this.types.image] },
        { title: LOCALES.get_item(this.types.container.type), icon: this.types.container.icon, items: [this.types.container] },
        { title: LOCALES.get_item(this.types.layout.type), icon: this.types.layout.icon, items: [this.types.layout] },
        { title: LOCALES.get_item(this.types.table.type), icon: this.types.table.icon, items: [this.types.table] },
        { title: LOCALES.get_item("buttons"), icon: '<i class="fa-solid fa-exclamation"></i>', items: [this.types.btn_primary, this.types.btn_seccond, this.types.btn_cta] },
        { title: LOCALES.get_item("misc"), icon: '<i class="fa-solid fa-cubes"></i>', items: [this.types.spoiler, this.types.script, this.types.shortcode, this.types.iframe] }
      ];
      this.be = parent;
      this.be.classList.add("be");
      this.dialog = new Dialog(this.be);
      this.underlay = this.be.appendChild(
        this.createElement("div", this.dom_id + "_underlay", "__dialog")
      );
      this.underlay.style.display = "none";
      this.main = this.be.appendChild(
        this.createElement("div", this.dom_id + "_main", "be_main")
      );
      this.sidebar = this.be.appendChild(
        this.createElement("div", this.dom_id + "_sidebar", "be_sidebar")
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
        this.createElement("div", this.dom_id + "_content", "be_content")
      );
      this.preview = this.main.appendChild(
        this.createElement("div", this.dom_id + "_preview", "be_preview")
      );
      this.preview_button_desktop = this.preview.appendChild(
        this.createElement("button", this.dom_id + "_preview_button_desktop", "be_preview_button_desktop")
      );
      this.preview_button_desktop.innerHTML = '<i class="fa-solid fa-desktop"></i> Desktop';
      this.preview_button_desktop.style.display = "none";
      this.preview_button_desktop.type = "button";
      this.preview_button_mobile = this.preview.appendChild(
        this.createElement("button", this.dom_id + "_preview_button_mobile", "be_preview_button_mobile")
      );
      this.preview_button_mobile.innerHTML = '<i class="fa-solid fa-mobile-alt"></i> Mobile';
      this.preview_button_mobile.style.display = "none";
      this.preview_button_mobile.type = "button";
      this.preview_button = this.preview.appendChild(
        this.createElement("button", this.dom_id + "_preview_button", "be_preview_button")
      );
      this.preview_button.innerHTML = '<i class="fa-solid fa-eye"></i> ' + LOCALES.get_item("preview");
      this.preview_button.type = "button";
      this.preview_close_button = this.preview.appendChild(
        this.createElement("button", this.dom_id + "_preview_close_button", "be_preview_close_button")
      );
      this.preview_close_button.innerHTML = '<i class="fa-solid fa-times"></i> ' + LOCALES.get_item("close_preview");
      this.preview_close_button.style.display = "none";
      this.preview_close_button.type = "button";
      this.preview_content = this.preview.appendChild(
        this.createElement("div", this.dom_id + "_preview_content", "be_preview_content")
      );
      this.preview_content.style.display = "none";
      this.sidebar_content__site = this.sidebar.appendChild(
        this.createElement("div", this.dom_id + "_sidebar_content__site", "be_sidebar_content")
      );
      this.sidebar_content__baustein = this.sidebar.appendChild(
        this.createElement("div", this.dom_id + "_sidebar_content__baustein", "be_sidebar_content")
      );
      this.sidebar_content__baustein.style.display = "none";
      this.sidebar_content__baustein_styles = this.sidebar_content__baustein.appendChild(
        this.createElement("div", this.dom_id + "_sidebar_content__baustein_styles", "")
      );
      this.tinyeditor_toolbar = new TinyEditorToolbar(this.toolbar, this.tinyeditor_toolbar_options);
      this.tinyeditor_toolbar.hideAllItems();
      this.ajax_loader = this.be.appendChild(this.createElement("div", this.dom_id + "-ajax-loader", "be-ajax-loader"));
      this.ajax_loader.style.display = "none";
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
            this.content.style.height = "calc(100% - 50px - 46px - " + this.preview_content.style.height + ")";
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
    add_static_undeletable(baustein_type, check_exists) {
      if (check_exists) {
        for (let i = 0; i < this.data.bausteine.length; i++) {
          if (this.data.bausteine[i].type === baustein_type.type) return;
        }
      }
      this.addBaustein(baustein_type, new Position(null, this.getPositionSort(false)), false);
    }
    renderBausteinSelector(position, hide, bausteinHasParent) {
      const selector_dom_id = this.dom_id + "_" + position.parent + "_" + position.sort;
      const position_parent = position.parent;
      const position_sort = position.sort;
      let clz = "be_bausteinSelector_container";
      if (hide) {
        clz += " hidden";
      }
      const be_bausteinSelector_container = this.createElement("div", "", clz);
      be_bausteinSelector_container.dataset.position_parent = position_parent + "";
      be_bausteinSelector_container.dataset.position_sort = position_sort + "";
      const be_bausteinSelector_outer = be_bausteinSelector_container.appendChild(
        this.createElement("div", selector_dom_id + "_bausteinSelector", "be_bausteinSelector_outer")
      );
      const be_bausteinSelector = be_bausteinSelector_outer.appendChild(
        this.createElement("div", selector_dom_id + "_bausteinSelector", "be_bausteinSelector")
      );
      be_bausteinSelector.appendChild(
        this.createElement("i", "", "fa-solid fa-plus-square")
      );
      const be_bausteinSelector_layer = this.be.appendChild(
        this.createElement("div", selector_dom_id + "_bausteinSelector_layer", "be_bausteinSelector_layer")
      );
      be_bausteinSelector_layer.style.display = "none";
      const be_bausteinSelector_layer_title_container = be_bausteinSelector_layer.appendChild(
        this.createElement("div", "", "be_bausteinSelector_layer_title_container")
      );
      const be_bausteinSelector_layer_title = be_bausteinSelector_layer_title_container.appendChild(
        this.createElement("div", "", "be_bausteinSelector_layer_title")
      );
      be_bausteinSelector_layer_title.innerHTML = LOCALES.get_item("add_new_block");
      const be_bausteinSelector_layer_close = be_bausteinSelector_layer_title_container.appendChild(
        this.createElement("button", selector_dom_id + "bausteinSelector_layer_close", "be_bausteinSelector_layer_close")
      );
      be_bausteinSelector_layer_close.type = "button";
      be_bausteinSelector_layer_close.innerHTML = "&times;";
      const be_bausteinSelector_layer_item_container1 = be_bausteinSelector_layer.appendChild(
        this.createElement("div", selector_dom_id + "_bausteinSelector_layer_item_container1", "be_bausteinSelector_layer_item_container")
      );
      const be_bausteinSelector_layer_item_container2 = be_bausteinSelector_layer.appendChild(
        this.createElement("div", selector_dom_id + "_bausteinSelector_layer_item_container2", "be_bausteinSelector_layer_item_container")
      );
      for (let i = 0; i < this.addBausteinSelectorItems.length; i++) {
        const itemset = this.addBausteinSelectorItems[i];
        const itemset_single = itemset.items.length === 1;
        const be_bausteinSelector_layer_item = be_bausteinSelector_layer_item_container1.appendChild(
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
          if (itemset.items[0].icon !== null) title1.innerHTML = itemset.items[0].icon;
          title2.innerHTML = LOCALES.get_item(itemset.items[0].type);
        } else {
          if (itemset.icon !== null) title1.innerHTML = itemset.icon;
          title2.innerHTML = itemset.title;
        }
        be_bausteinSelector_layer_item.addEventListener("click", () => {
          if (itemset_single) {
            this.addBaustein(itemset.items[0], new Position(position.parent, position.sort), true);
            this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
          } else {
            const types_array = itemset.items;
            be_bausteinSelector_layer_item_container2.innerHTML = "";
            for (let b = 0; b < types_array.length; b++) {
              const be_bausteinSelector_layer_item2 = be_bausteinSelector_layer_item_container2.appendChild(
                this.createElement("button", "", "be_bausteinSelector_layer_item")
              );
              be_bausteinSelector_layer_item2.type = "button";
              be_bausteinSelector_layer_item2.dataset.type = types_array[b].type;
              be_bausteinSelector_layer_item2.innerHTML = '<div class="be_bausteinSelector_layer_item_title1">' + types_array[b].icon + '</div><div class="be_bausteinSelector_layer_item_title2">' + LOCALES.get_item(types_array[b].type) + "</div>";
              if (types_array[b].renderType === bausteinRenderType.button) {
                types_array[b].class.split(" ").forEach((className) => {
                  be_bausteinSelector_layer_item2.classList.add(className);
                });
              }
              const types_array_row = b;
              be_bausteinSelector_layer_item2.addEventListener("click", () => {
                this.addBaustein(types_array[types_array_row], new Position(position.parent, position.sort), true);
                this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
              });
            }
            be_bausteinSelector_layer_item_container1.style.display = "none";
            be_bausteinSelector_layer_item_container2.style.display = "";
          }
        });
      }
      be_bausteinSelector.addEventListener("click", () => {
        this.bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2);
      });
      be_bausteinSelector_layer_close.addEventListener("click", () => {
        this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
      });
      return be_bausteinSelector_container;
    }
    // iterate through all bausteine and check if columns/rows are the same as presented in data.bausteine
    rowcol_amount_evaluate() {
      for (let i = 0; i < this.data.bausteine.length; i++) {
        const baustein = this.data.bausteine[i];
        if (baustein.renderType === bausteinRenderType.table || baustein.renderType === bausteinRenderType.tableRow || baustein.renderType === bausteinRenderType.layout || baustein.renderType === bausteinRenderType.container) {
          let amount, new_baustein_type;
          if (baustein.renderType === bausteinRenderType.tableRow || baustein.renderType === bausteinRenderType.layout) {
            amount = baustein.columns;
            new_baustein_type = this.types.bausteinSelector;
          } else if (baustein.renderType === bausteinRenderType.container) {
            amount = baustein.rows;
            new_baustein_type = this.types.bausteinSelector;
          } else {
            amount = baustein.rows;
            new_baustein_type = this.types.tableRow;
          }
          const children = this.getBausteineChildren(baustein.id);
          if (children.length < amount) {
            for (let j = children.length; j < amount; j++) {
              this.addBaustein(new_baustein_type, new Position(baustein.id, this.getPositionSort(false)), false);
            }
          } else if (children.length > amount) {
            const new_bausteine_array = [];
            for (let j = 0; j < this.data.bausteine.length; j++) {
              if (this.data.bausteine[j].position.parent !== baustein.id) {
                new_bausteine_array.push(this.data.bausteine[j]);
              }
            }
            for (let j = 0; j < amount; j++) {
              new_bausteine_array.push(children[j]);
            }
            this.data.bausteine = new_bausteine_array;
          }
        }
      }
    }
    addBaustein(baustein_template, position, do_render) {
      return new Promise((resolve, reject) => {
        const parent_baustein = position.parent === null ? null : this.getBaustein(position.parent);
        let baustein_class = baustein_template.class;
        if (parent_baustein !== null) {
          if (parent_baustein.renderType === bausteinRenderType.layout) {
            if (baustein_class !== "") baustein_class += " ";
            baustein_class += "col";
          } else if (parent_baustein.renderType === bausteinRenderType.tableRow && baustein_template.type === this.types.text.type) {
            baustein_template = this.types.td;
            baustein_class = baustein_template.class;
          }
        }
        console.log("addBaustein( type:", baustein_template.type, ", position:", position, " )");
        const baustein_id = this.baustein_id_counter;
        const baustein = new Baustein(
          baustein_id,
          position,
          baustein_template.type,
          baustein_template.tag,
          baustein_template.renderType,
          baustein_template.toggleableClasses,
          baustein_template.attributes,
          baustein_template.style
        );
        baustein.class = baustein_class;
        const actual_addBaustein = () => {
          this.baustein_id_counter += 1;
          for (let i = 0; i < baustein.style.length; i++) {
            const style = baustein.style[i];
            if (style.value === "" && style.property.options.length > 0) {
              style.value = style.property.options[0].value;
            }
          }
          if (baustein.getStyle("margin-top") === null) baustein.setStyle("margin-top", "8px");
          if (baustein.getStyle("margin-bottom") === null) baustein.setStyle("margin-bottom", "8px");
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
            const spoiler_id = (/* @__PURE__ */ new Date()).getTime();
            this.addBaustein(this.types.spoiler_toggler, new Position(baustein_id, this.getPositionSort(false)), false).then((that_baustein) => {
              that_baustein.attributes = [
                new BausteinAttribute("data-bs-toggle", "collapse"),
                new BausteinAttribute("aria-expanded", "false"),
                new BausteinAttribute("data-bs-target", "#be-bs-collapse-content" + spoiler_id),
                new BausteinAttribute("aria-controls", "be-bs-collapse-content" + spoiler_id)
              ];
            });
            this.addBaustein(this.types.spoiler_content, new Position(baustein_id, this.getPositionSort(false)), false).then((that_baustein) => {
              that_baustein.attributes = [new BausteinAttribute("id", "be-bs-collapse-content" + spoiler_id)];
            });
          } else {
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
          if (do_render) {
            this.render();
            if (baustein.renderType !== bausteinRenderType.bausteinSelector) this.selectBaustein(baustein_id);
          }
          resolve(baustein);
        };
        if (baustein.renderType === bausteinRenderType.layout || baustein.renderType === bausteinRenderType.container || baustein.renderType === bausteinRenderType.table) {
          this.dialog_rowcol(baustein).then(() => actual_addBaustein()).catch(() => reject());
        } else if (baustein.renderType === bausteinRenderType.image) {
          this.dialog_media(baustein.renderType).then((image_url) => {
            baustein.content = image_url;
            actual_addBaustein();
          }).catch(() => reject());
        } else {
          if (baustein.renderType === bausteinRenderType.tableRow && parent_baustein !== null) {
            baustein.columns = parent_baustein.columns;
          }
          actual_addBaustein();
        }
      });
    }
    selectBaustein(baustein_id) {
      this.bausteine.forEach((be_baustein) => {
        be_baustein.classList.remove("selected");
      });
      this.selected_baustein = document.getElementById(this.dom_id + "_be_baustein_item" + baustein_id);
      this.selected_baustein?.classList.add("selected");
      this.selected_baustein_id = baustein_id;
      this.open_baustein_attributes(baustein_id);
      const baustein = this.getBaustein(baustein_id);
      switch (baustein.renderType) {
        case bausteinRenderType.richtext:
        case bausteinRenderType.tableCell:
          this.tinyeditor_toolbar.showAllItems();
          break;
        case bausteinRenderType.button:
          this.tinyeditor_toolbar.showTheseItems([
            "bold",
            "italic",
            "underline",
            "forecolor",
            "removeFormat",
            "createImage",
            "createIcon"
          ]);
          break;
        default:
          this.tinyeditor_toolbar.hideAllItems();
          break;
      }
    }
    getBaustein(baustein_id) {
      for (let i = 0; i < this.data.bausteine.length; i++) {
        if (this.data.bausteine[i].id === baustein_id) {
          return this.data.bausteine[i];
        }
      }
      throw new Error("getBaustein() can not get Baustein with id: " + baustein_id);
    }
    getBausteinFromPosition(position) {
      for (let i = 0; i < this.data.bausteine.length; i++) {
        if (this.data.bausteine[i].position.parent === position.parent && this.data.bausteine[i].position.sort === position.sort) {
          return this.data.bausteine[i];
        }
      }
      return null;
    }
    getPositionSort(getFirst) {
      let positionSort = 1;
      if (getFirst) {
        for (let i = 0; i < this.data.bausteine.length; i++) {
          if (this.data.bausteine[i].position.sort < positionSort) {
            positionSort = this.data.bausteine[i].position.sort;
          }
        }
        return positionSort - 1;
      } else {
        for (let i = 0; i < this.data.bausteine.length; i++) {
          if (this.data.bausteine[i].position.sort > positionSort) {
            positionSort = this.data.bausteine[i].position.sort;
          }
        }
        return positionSort + 1;
      }
    }
    getBausteineChildren(parent) {
      const bausteine = [];
      for (let i = 0; i < this.data.bausteine.length; i++) {
        if (this.data.bausteine[i].position.parent === parent) {
          bausteine[bausteine.length] = this.data.bausteine[i];
        }
      }
      return bausteine.sort((a, b) => {
        return a.position.sort > b.position.sort ? 1 : -1;
      });
    }
    deleteBaustein(baustein_id) {
      console.log("deleteBaustein() baustein_id", baustein_id);
      this.deleteBaustein_helper(baustein_id);
      this.selected_baustein_id = null;
      this.open_baustein_attributes__baustein_id = null;
      this.rowcol_amount_evaluate();
      this.render();
      window.focus();
      if (document.activeElement === null) {
        console.error("document.activeElement is null");
      } else {
        const activeElement = document.activeElement;
        activeElement.blur();
      }
    }
    deleteBaustein_helper(baustein_id) {
      const children = this.getBausteineChildren(baustein_id);
      for (let i = 0; i < children.length; i++) {
        this.deleteBaustein_helper(children[i].id);
      }
      for (let row = 0; row < this.data.bausteine.length; row++) {
        if (this.data.bausteine[row].id === baustein_id) {
          this.data.bausteine.splice(row, 1);
          break;
        }
      }
    }
    moveBaustein(baustein_id, position_new) {
      const baustein = this.getBaustein(baustein_id);
      console.log("moveBaustein old position.sort", baustein.position.sort, "new position.sort", position_new.sort);
      if (position_new.parent !== null) {
        const new_baustein_parent = this.getBaustein(position_new.parent);
        if (baustein.renderType === bausteinRenderType.tableRow) {
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
          console.info("[BausteinEditor] can not move Baustein of type '" + baustein.type + "' to table, Baustein must be a tableRow");
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
      } else if (baustein.position.parent === position_new.parent && baustein.position.sort === position_new.sort) {
        console.info("moveBaustein() can not move Baustein into same position");
        return false;
      } else {
        const test_baustein = this.getBausteinFromPosition(position_new);
        if (test_baustein !== null && test_baustein.renderType === bausteinRenderType.bausteinSelector) {
          const test_baustein_index = this.data.bausteine.indexOf(test_baustein);
          if (test_baustein_index === -1) {
            console.info("[BausteinEditor] moveBaustein() can not find Baustein index with position: " + position_new.parent + ", " + position_new.sort);
          } else {
            if (position_new.parent !== null) {
              const new_baustein_parent = this.getBaustein(position_new.parent);
              if (new_baustein_parent.renderType === bausteinRenderType.layout) {
                baustein.addClass("col");
              } else {
                baustein.removeClass("col");
              }
            } else {
              baustein.removeClass("col");
            }
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
    changeBaustein(baustein_id, type) {
      const baustein = this.getBaustein(baustein_id);
      const new_baustein = this.getBausteinType(type);
      baustein.renderType = new_baustein.renderType;
      baustein.tag = new_baustein.tag;
      baustein.type = new_baustein.type;
      baustein.title = LOCALES.get_item(new_baustein.type);
      this.render();
    }
    getChangeBausteinOptions(current_renderType, current_type) {
      const options = [];
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
    renderBaustein(baustein, position) {
      const baustein_id = baustein.id;
      const position_parent = position.parent;
      const position_sort = position.sort;
      const baustein_dom_id = this.dom_id + "_be_baustein_item" + baustein_id;
      const baustein_editor_id = baustein_dom_id + "_editor";
      const baustein_type_object = this.getBausteinType(baustein.type);
      const elements_drag_not_allowed = [];
      let baustein_dom;
      if (baustein.renderType === bausteinRenderType.bausteinSelector) {
        baustein_dom = this.renderBausteinSelector(new Position(position_parent, position_sort), false, false);
      } else {
        baustein_dom = this.createElement("div", baustein_dom_id, "be_baustein");
        baustein_dom.dataset.type = baustein.type;
        baustein_dom.dataset.position_parent = position_parent + "";
        baustein_dom.dataset.position_sort = position_sort + "";
        const is_selected_baustein = this.selected_baustein_id !== null && this.selected_baustein_id === baustein_id;
        if (is_selected_baustein) {
          baustein_dom.classList.add("selected");
        }
        if (baustein.renderType !== bausteinRenderType.static_undeletable) {
          const baustein_indicator = baustein_dom.appendChild(
            this.createElement("label", baustein_dom_id + "_indicator", "baustein_indicator")
          );
          baustein_indicator.addEventListener("click", () => {
            this.selectBaustein(baustein_id);
          }, false);
          if (position_parent === null) {
            const baustein_indicator_position = baustein_indicator.appendChild(
              this.createElement("span", "", "baustein_indicator_position")
            );
            baustein_indicator_position.innerHTML = this.baustein_counter.toString();
            this.baustein_counter++;
          }
          const changeBausteinOptions = this.getChangeBausteinOptions(baustein.renderType, baustein.type);
          if (changeBausteinOptions.length === 0) {
            const baustein_indicator_title = baustein_indicator.appendChild(
              this.createElement("span", "", "baustein_indicator_title")
            );
            baustein_indicator_title.innerHTML = baustein_type_object.icon + " " + baustein.title;
          } else {
            if (baustein_type_object.icon !== null) baustein_indicator.innerHTML = baustein_type_object.icon;
            const baustein_indicator_changer = baustein_indicator.appendChild(
              this.createElement("select", "", "baustein_indicator_changer")
            );
            baustein_indicator_changer.tabIndex = -1;
            baustein_indicator_changer.addEventListener("change", () => {
              this.changeBaustein(baustein_id, baustein_indicator_changer.value);
            });
            const baustein_indicator_option = baustein_indicator_changer.appendChild(
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
        let baustein_item = null;
        switch (baustein.renderType) {
          case bausteinRenderType.static_undeletable:
            {
              baustein.content = "[" + baustein.type + "]";
              baustein_dom.addEventListener("click", () => {
                this.selectBaustein(baustein_id);
              });
              const text = baustein_dom.appendChild(this.createElement("div", baustein_editor_id, "be_baustein_item"));
              text.style.overflow = "hidden";
              text.style.userSelect = "none";
              text.style.padding = "4px";
              text.innerHTML = LOCALES.get_item(baustein.type);
            }
            break;
          case bausteinRenderType.container:
          case bausteinRenderType.layout:
          case bausteinRenderType.table:
          case bausteinRenderType.tableRow:
          case bausteinRenderType.spoiler:
            {
              const bausteine_inner = this.getBausteineChildren(baustein.id);
              for (let row = 0; row < bausteine_inner.length; row++) {
                const baustein_inner = bausteine_inner[row];
                baustein_dom.appendChild(this.renderBaustein(baustein_inner, new Position(baustein_id, baustein_inner.position.sort)));
              }
            }
            break;
          case bausteinRenderType.spoiler_toggler:
          case bausteinRenderType.spoiler_content:
            {
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
            }
            break;
          case bausteinRenderType.shortcode:
            {
              const shortcode_trimmed = baustein.content.replace("[", "").replace("]", "").trim();
              let disable_editor_input = shortcode_trimmed === "";
              const editor_select = baustein_dom.appendChild(this.createElement("select", "", "form-control"));
              editor_select.autocomplete = "off";
              editor_select.style.border = "0";
              const option_placeholder_dom = editor_select.appendChild(document.createElement("option"));
              option_placeholder_dom.value = "";
              option_placeholder_dom.innerHTML = LOCALES.get_item("shortcode_select");
              option_placeholder_dom.style.display = "none";
              for (let i = 0; i < this.shortcodes.length; i++) {
                const shortcode = this.shortcodes[i];
                const shortcode_dom = editor_select.appendChild(document.createElement("option"));
                shortcode_dom.value = shortcode;
                shortcode_dom.innerHTML = shortcode;
                if (shortcode === shortcode_trimmed) {
                  disable_editor_input = true;
                  shortcode_dom.selected = true;
                }
              }
              const option_other_dom = editor_select.appendChild(document.createElement("option"));
              option_other_dom.value = "-1";
              option_other_dom.innerHTML = LOCALES.get_item("custom_other");
              const editor_input = baustein_dom.appendChild(this.createElement("input", "", "form-control"));
              editor_input.type = "text";
              editor_input.value = baustein.content;
              editor_input.style.border = "0";
              if (disable_editor_input) {
                editor_input.style.display = "none";
              } else {
                editor_select.style.display = "none";
              }
              [editor_select, editor_input].forEach((editor) => {
                ["click", "focusin"].forEach((event_type) => {
                  editor.addEventListener(event_type, () => {
                    this.selectBaustein(baustein_id);
                  });
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
            }
            break;
          case bausteinRenderType.image:
            {
              const image = baustein_dom.appendChild(
                this.createElement("img", baustein_editor_id, "be_baustein_item")
              );
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
              image.addEventListener("dragstart", (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
            }
            break;
          case bausteinRenderType.iframe:
            {
              const be_baustein_item_overlay = baustein_dom.appendChild(
                this.createElement("div", "", "be_baustein_item_overlay")
              );
              be_baustein_item_overlay.addEventListener("click", () => {
                this.selectBaustein(baustein_id);
              });
              const iframe = baustein_dom.appendChild(
                this.createElement("iframe", baustein_editor_id, "be_baustein_item")
              );
              iframe.src = baustein.getAttribute("src") || "about:blank";
              iframe.style.width = "100%";
              iframe.style.height = "100%";
              iframe.style.border = "0";
              iframe.addEventListener("click", () => {
                this.selectBaustein(baustein_id);
              });
            }
            break;
          default:
            {
              let editor;
              switch (baustein.renderType) {
                case bausteinRenderType.button:
                case bausteinRenderType.tableCell:
                case bausteinRenderType.richtext:
                  {
                    if (baustein.renderType === bausteinRenderType.button) {
                      const placeholder_text = "Buttontext eingeben";
                      editor = baustein_dom.appendChild(
                        this.createElement("a", baustein_editor_id, "be_baustein_item " + baustein.class)
                      );
                      editor.style.userSelect = "text";
                      if (baustein.content === "") editor.innerHTML = placeholder_text;
                      else editor.innerHTML = baustein.content;
                      editor.setAttribute("contenteditable", "true");
                      editor.addEventListener("input", () => {
                        baustein.content = editor.innerHTML;
                        this.preview_render();
                      });
                      editor.addEventListener("focusin", () => {
                        if (baustein.content === "") {
                          editor.innerHTML = "";
                        }
                      });
                      editor.addEventListener("focusout", () => {
                        if (baustein.content === "") {
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
                          editor.style.height = "1px";
                          editor.style.height = editor.scrollHeight + "px";
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
                    if (is_selected_baustein) this.tinyeditor_toolbar.selected_editor = tiny_editor;
                    tiny_editor.import(baustein.content);
                    editor.addEventListener("focusin", () => {
                      this.tinyeditor_toolbar.selected_editor = tiny_editor;
                    });
                  }
                  break;
                default:
                  {
                    editor = baustein_dom.appendChild(
                      this.createElement("textarea", baustein_editor_id, "be_baustein_item")
                    );
                    editor.innerHTML = baustein.content;
                    editor.focus();
                    const editor_textarea = editor;
                    editor_textarea.addEventListener("input", () => {
                      editor_textarea.style.height = "1px";
                      editor_textarea.style.height = editor_textarea.scrollHeight + "px";
                      baustein.content = editor_textarea.value;
                    });
                  }
                  break;
              }
              baustein_item = editor;
              editor.draggable = false;
              editor.addEventListener("focusin", () => {
                this.selectBaustein(baustein_id);
              });
              elements_drag_not_allowed.push(editor);
            }
            break;
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
        baustein_dom.addEventListener("click", (e) => {
          if (e.target) {
            const target = e.target;
            if (target.id === baustein_dom_id) {
              this.selectBaustein(baustein_id);
            }
          }
          return false;
        }, false);
        if (baustein.renderType !== bausteinRenderType.tableRow) {
          const baustein_dom_const = baustein_dom;
          new LuxDragDrop(this.main, baustein_dom_const, {
            mousedown: (event) => {
              const document_activeElement = document.activeElement;
              if (document_activeElement === null) {
                console.error("[BausteinEditor] document.activeElement is null");
              } else {
                console.log("dragdrop baustein_dom_const", baustein_dom_const);
                console.log("dragdrop event", event);
                let allow_dragdrop;
                if (this.cursor_mode === 0) {
                  allow_dragdrop = elements_drag_not_allowed.includes(document_activeElement) === false;
                  console.log("allow_dragdrop", allow_dragdrop);
                } else if (this.cursor_mode === 1) {
                  allow_dragdrop = true;
                } else {
                  console.info("[BausteinEditor] draggable not implemented for cursor mode:", this.cursor_mode);
                  return false;
                }
                if (allow_dragdrop) {
                  if (baustein_dom_const === event.target) {
                    return true;
                  }
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
            mouseup: (e, reciever_element) => {
              for (let tries = 0; tries < 4; tries++) {
                if (typeof reciever_element.dataset.position_parent === "string") {
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
                  parent: reciever_element.dataset.position_parent === "0" ? 0 : parseInt(reciever_element.dataset.position_parent) || null,
                  sort: reciever_element.dataset.position_sort === "0" ? 0 : parseInt(reciever_element.dataset.position_sort) || null
                };
                console.log("drop on addBausteinSelector: old_baustein_id", old_baustein_id, "new position", new_position);
                if (new_position.sort === null) {
                  console.error("[BausteinEditor] LuxClickHoldDrag.callback_mouseup: new_position.sort is null");
                } else {
                  this.moveBaustein(old_baustein_id, new Position(new_position.parent, new_position.sort));
                }
              }
            },
            maxsizes: true
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
    bausteinSelector_open(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2) {
      const max_width = 446;
      const window_width = window.innerWidth;
      const window_height = window.innerHeight;
      this.underlay.style.display = "";
      be_bausteinSelector_layer.style.display = "";
      be_bausteinSelector_layer_item_container1.style.display = "";
      be_bausteinSelector_layer_item_container2.style.display = "none";
      be_bausteinSelector_layer.style.maxWidth = max_width + "px";
      be_bausteinSelector_layer.style.top = window_height / 2 - be_bausteinSelector_layer.clientHeight / 2 + "px";
      be_bausteinSelector_layer.style.left = window_width / 2 - max_width / 2 + "px";
      console.log("be_bausteinSelector", be_bausteinSelector);
      this.be_bausteinSelector_isOpen = true;
    }
    bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer) {
      this.underlay.style.display = "none";
      be_bausteinSelector_layer.style.display = "none";
      this.be_bausteinSelector_isOpen = false;
    }
    bausteinSelector_toggle(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2) {
      if (this.be_bausteinSelector_isOpen) {
        this.bausteinSelector_close(be_bausteinSelector, be_bausteinSelector_layer);
      } else {
        this.bausteinSelector_open(be_bausteinSelector, be_bausteinSelector_layer, be_bausteinSelector_layer_item_container1, be_bausteinSelector_layer_item_container2);
      }
    }
    apply_styles() {
      if (this.selected_baustein !== null && this.selected_baustein_id !== null) {
        const baustein = this.getBaustein(this.selected_baustein_id);
        const selected_baustein_editor = this.selected_baustein.lastChild;
        for (let i = 0; i < this.open_baustein_attributes__formcontrols.length; i++) {
          const formcontrol = this.open_baustein_attributes__formcontrols[i];
          const property_name = formcontrol.name;
          const value = typeof formcontrol.dataset.value === "undefined" ? formcontrol.value : formcontrol.dataset.value;
          let baustein_style_index = baustein.style.length;
          for (let b = 0; b < baustein.style.length; b++) {
            if (baustein.style[b].property.name === property_name) {
              baustein_style_index = b;
              break;
            }
          }
          if (baustein_style_index === baustein.style.length) {
            if (value === "" || value === "0" || value === "auto") continue;
            const new_style = new BausteinStyle(this.getStylePropertyByName(property_name), "");
            if (new_style.property.options.length > 0 && new_style.property.options[0].value === value) continue;
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
              if (target.classList.contains(class_value)) target.classList.remove(baustein.style[baustein_style_index].property.options[h].value);
            }
            if (baustein.style[baustein_style_index].value !== "") target.classList.add(baustein.style[baustein_style_index].value);
          } else {
            target.style.setProperty(baustein.style[baustein_style_index].property.name, baustein.style[baustein_style_index].value);
          }
        }
      }
      this.preview_render();
    }
    /// create a forminput. first options item is default value. Returns {content: HTMLElement, input: HTMLInputElement|HTMLSelectElement}
    formcontrol(domArk, type, name, title, value, options) {
      const fc_dom_id = this.dom_id + "_" + domArk + "_fc_" + name;
      let useDataValue = false;
      const suffix_const = options.suffix || [];
      let suffix_default = suffix_const.length ? suffix_const[0] : "";
      const be_formrow = this.createElement("div", "", "be_formrow");
      let form_control;
      if (type === "image") {
        const image_source_text = be_formrow.appendChild(document.createElement("div"));
        image_source_text.innerText = value;
        image_source_text.style.fontSize = "0.6rem";
        image_source_text.style.marginBottom = "2px";
        form_control = be_formrow.appendChild(
          this.createElement("button", fc_dom_id, "be-form-control")
        );
        form_control.type = "button";
        form_control.innerHTML = title.toString();
        form_control.name = name;
        form_control.value = value;
        form_control.addEventListener("click", () => {
          if (this.selected_baustein_id !== null) {
            this.dialog_media(bausteinRenderType.image).then((image_url) => {
              image_source_text.innerText = image_url;
              form_control.value = image_url;
              if (options.onchange) options.onchange(form_control);
            });
          }
        });
      } else {
        if (type === "checkbox") {
          form_control = be_formrow.appendChild(
            this.createElement("input", fc_dom_id, "be-form-control")
          );
          form_control.type = "checkbox";
          form_control.name = name;
          form_control.checked = value !== "";
          form_control.style.marginRight = "4px";
          if (title !== null) {
            const label = be_formrow.appendChild(
              this.createElement("label", "", "")
            );
            label.htmlFor = fc_dom_id;
            label.innerHTML = title;
          }
        } else {
          if (title !== null) {
            const label = be_formrow.appendChild(
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
            form_control = form_control_container.appendChild(
              this.createElement("select", fc_dom_id, "be-form-control")
            );
            form_control.name = name;
            if (options.html_options) {
              for (let i = 0; i < options.html_options.length; i++) {
                const option_element = form_control.appendChild(
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
            form_control = form_control_container.appendChild(
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
              const form_control_container_up = form_control_container.appendChild(
                this.createElement("div", "", "be-form-control-container_up")
              );
              form_control_container_up.innerHTML = "\u2B9D";
              const form_control_container_down = form_control_container.appendChild(
                this.createElement("div", "", "be-form-control-container_down")
              );
              form_control_container_down.innerHTML = "\u2B9F";
              const number_default = options.number_default ? options.number_default : 0;
              const number_min = options.number_min ? options.number_min : null;
              const number_max = options.number_max ? options.number_max : null;
              const formcontrol_number = (add) => {
                const value2 = form_control.value.replace(" ", "");
                if (add === 0 && options.html_options && options.html_options.length > 0) {
                  for (let i = 0; i < options.html_options.length; i++) {
                    const option = options.html_options[i];
                    if (option.value === value2) {
                      form_control.value = value2;
                      return;
                    }
                  }
                }
                let num = parseFloat(value2);
                if (isNaN(num)) {
                  num = number_default;
                } else {
                  const cmp_suffix = form_control.value.replace(num.toString(), "");
                  for (let i = 0; i < suffix_const.length; i++) {
                    if (cmp_suffix === suffix_const[i]) {
                      suffix_default = suffix_const[i];
                      break;
                    }
                  }
                }
                const countDecimals = num % 1 ? num.toString().split(".")[1].length : 0;
                if (countDecimals === 0) {
                  num = num + add;
                } else {
                  const mltp = Math.pow(10, countDecimals);
                  num = Math.floor(num * mltp + add * mltp) / mltp;
                }
                if (number_min !== null && num < number_min) {
                  num = number_min;
                } else if (number_max !== null && num > number_max) {
                  num = number_max;
                }
                form_control.value = num.toString() + suffix_default;
              };
              form_control.addEventListener("change", () => {
                formcontrol_number(0);
                if (options.onchange) options.onchange(form_control);
              });
              form_control.addEventListener("keydown", (e) => {
                const steps = e.shiftKey ? 10 : e.ctrlKey ? 0.1 : 1;
                const keyCode = e.which | e.keyCode;
                if (keyCode === 38) {
                  formcontrol_number(steps);
                  if (options.onchange) options.onchange(form_control);
                  return false;
                } else if (keyCode === 40) {
                  formcontrol_number(-steps);
                  if (options.onchange) options.onchange(form_control);
                  return false;
                }
              });
              form_control_container_up.addEventListener("click", () => {
                formcontrol_number(1);
                if (options.onchange) options.onchange(form_control);
              });
              form_control_container_down.addEventListener("click", () => {
                formcontrol_number(-1);
                if (options.onchange) options.onchange(form_control);
              });
            } else {
              form_control.type = "text";
            }
          }
        }
        if (type !== "number") {
          const _useDataValue = useDataValue;
          if (_useDataValue) {
            form_control.dataset.value = value;
          }
          form_control.addEventListener("change", () => {
            if (_useDataValue) {
              form_control.dataset.value = form_control.value;
            }
            if (options.onchange) options.onchange(form_control);
          });
        }
        form_control.autocomplete = "off";
      }
      return { content: be_formrow, input: form_control };
    }
    /// helper funktion for creating a forminput of layout devtool. Position values: null = do not set, empty = center, non-empty = normal 
    layout_fc(baustein, styleName, default_value, top, right, bottom, left) {
      const bausteinStyleProperty = this.getStylePropertyByName(styleName);
      const bausteinStyleValue = baustein.getStyleValue(styleName, default_value);
      const formcontrol = this.formcontrol("baustein", "number", bausteinStyleProperty.name, null, bausteinStyleValue, {
        suffix: bausteinStyleProperty.suffix,
        html_options: bausteinStyleProperty.get_html_options(),
        onchange: () => this.apply_styles()
      });
      const be_layout_fc = formcontrol.content;
      be_layout_fc.style.width = "34px";
      be_layout_fc.style.height = "30px";
      if (top !== null) be_layout_fc.style.top = top === "" ? "calc(50% - (" + be_layout_fc.style.height + " / 2))" : top;
      if (bottom !== null) be_layout_fc.style.bottom = bottom === "" ? "calc(50% - (" + be_layout_fc.style.height + " / 2))" : bottom;
      if (left !== null) be_layout_fc.style.left = left === "" ? "calc(50% - (" + be_layout_fc.style.width + " / 2))" : left;
      if (right !== null) be_layout_fc.style.right = right === "" ? "calc(50% - (" + be_layout_fc.style.width + " / 2))" : right;
      this.open_baustein_attributes__formcontrols.push(formcontrol.input);
      return be_layout_fc;
    }
    open_baustein_attributes(baustein_id) {
      if (this.open_baustein_attributes__baustein_id === null || this.open_baustein_attributes__baustein_id !== baustein_id) {
        const current_baustein = this.getBaustein(baustein_id);
        this.open_baustein_attributes__baustein_id = baustein_id;
        this.open_baustein_attributes__formcontrols = [];
        this.sidebar_content__baustein_styles.innerHTML = "";
        if (current_baustein.renderType === bausteinRenderType.static_undeletable) return;
        const be_layout_view = this.sidebar_content__baustein_styles.appendChild(
          this.createElement("div", "", "be_layout_view")
        );
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
        const be_layout_view_inner = be_layout_view_padding.appendChild(
          this.createElement("div", "", "be_layout_view_inner")
        );
        be_layout_view_inner.appendChild(this.layout_fc(current_baustein, "width", "auto", null, null, null, null));
        be_layout_view_inner.appendChild(this.createElement("span", "", "be_layout_wh_delimiter")).innerHTML = " &times; ";
        be_layout_view_inner.appendChild(this.layout_fc(current_baustein, "height", "auto", null, null, null, null));
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
          const alt_formcontroll = this.formcontrol("baustein_alt", "text", "alt", "Alternativtext (alt)", current_baustein.getAttribute("alt") || "", {
            onchange: () => {
              current_baustein.setAttribute("alt", alt_formcontroll.input.value);
            }
          });
          this.sidebar_content__baustein_styles.appendChild(alt_formcontroll.content);
          const title_formcontroll = this.formcontrol("baustein_title", "text", "title", "Titel", current_baustein.getAttribute("title") || "", {
            onchange: () => {
              current_baustein.setAttribute("title", title_formcontroll.input.value);
            }
          });
          this.sidebar_content__baustein_styles.appendChild(title_formcontroll.content);
        } else if (current_baustein.renderType === bausteinRenderType.iframe) {
          const iframe_fcr = this.formcontrol("src_input", "text", "", "Webseiten URL", current_baustein.getAttribute("src") || "", {
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
          const table_children = current_baustein.renderType === bausteinRenderType.table ? this.getBausteineChildren(current_baustein.id) : [];
          if (current_baustein.renderType === bausteinRenderType.table || current_baustein.renderType === bausteinRenderType.layout) {
            const columns_fcr = this.formcontrol("dialog", "number", "columns", LOCALES.get_item("columns"), current_baustein.columns.toString(), {
              number_default: 1,
              number_min: 1,
              number_max: 40,
              onchange: () => {
                const parsed_value = parseInt(columns_fcr.input.value);
                console.log("parsed_value", parsed_value);
                if (isNaN(parsed_value) === false) {
                  console.log("current_baustein.columns", current_baustein.columns);
                  current_baustein.columns = parsed_value;
                  console.log("current_baustein.columns 2", current_baustein.columns);
                  table_children.forEach((child) => child.columns = parsed_value);
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
          if (current_baustein.renderType === bausteinRenderType.table || current_baustein.renderType === bausteinRenderType.container) {
            const rows_fcr = this.formcontrol("dialog", "number", "rows", LOCALES.get_item("rows"), current_baustein.rows.toString(), {
              number_default: 1,
              number_min: 1,
              number_max: 40,
              onchange: () => {
                const parsed_value = parseInt(rows_fcr.input.value);
                if (isNaN(parsed_value) === false) {
                  current_baustein.rows = parsed_value;
                  console.log("current_baustein.rows BEFORE", current_baustein.rows);
                  console.log("this.data.bausteine BEFORE", this.data.bausteine);
                  this.rowcol_amount_evaluate();
                  console.log("current_baustein.rows AFTER", current_baustein.rows);
                  console.log("this.data.bausteine AFTER", this.data.bausteine);
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
          const href_formcontroll = this.formcontrol("baustein_href", "text", "href", "Link (href)", current_baustein.getAttribute("href") || "", {
            onchange: () => {
              current_baustein.setAttribute("href", href_formcontroll.input.value);
            }
          });
          this.sidebar_content__baustein_styles.appendChild(href_formcontroll.content);
          const target_formcontroll = this.formcontrol("baustein_target", "checkbox", "target", LOCALES.get_item("new_tab"), current_baustein.getAttribute("target") || "", {
            onchange: () => {
              const target_formcontroll_input = target_formcontroll.input;
              console.log("target_formcontroll_input.checked", target_formcontroll_input.checked);
              current_baustein.setAttribute("target", target_formcontroll_input.checked ? "_blank" : "");
            }
          });
          this.sidebar_content__baustein_styles.appendChild(target_formcontroll.content);
          const title_formcontroll = this.formcontrol("baustein_title", "text", "title", "Title", current_baustein.getAttribute("title") || "", {
            onchange: () => {
              current_baustein.setAttribute("title", title_formcontroll.input.value);
            }
          });
          this.sidebar_content__baustein_styles.appendChild(title_formcontroll.content);
        }
        for (let i = 0; i < current_baustein.style.length; i++) {
          const element = current_baustein.style[i];
          if (element.property.showInBausteinAttributesSidebar) {
            const styleProperty = this.getStylePropertyByName(element.property.name);
            const formcontrol = this.formcontrol("baustein", styleProperty.type, styleProperty.name, LOCALES.get_item(styleProperty.name), element.value, {
              suffix: styleProperty.suffix,
              html_options: styleProperty.get_html_options(),
              onchange: () => {
                this.apply_styles();
              }
            });
            this.sidebar_content__baustein_styles.appendChild(formcontrol.content);
            this.open_baustein_attributes__formcontrols.push(formcontrol.input);
          }
        }
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
        const class_formcontroll = this.formcontrol(
          "baustein_class",
          "text",
          "class",
          LOCALES.get_item("css_classes") + ' <div style="font-size: 11px; margin-bottom: 2px;">' + LOCALES.get_item("css_classes_advanced") + "</div>",
          current_baustein.class,
          {
            onchange: () => {
              current_baustein.class = class_formcontroll.input.value;
            }
          }
        );
        this.sidebar_content__baustein_styles.appendChild(class_formcontroll.content);
        if (current_baustein.renderType !== bausteinRenderType.spoiler_toggler && current_baustein.renderType !== bausteinRenderType.spoiler_content && current_baustein.renderType != bausteinRenderType.static_undeletable) {
          const baustein_delete_button = this.sidebar_content__baustein_styles.appendChild(
            this.createElement("button", this.dom_id + "_deleteBaustein", "be-form-control bautstein-delete")
          );
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
      }
    }
    close_baustein_attributes() {
      this.sidebar_content__site.style.display = "";
      this.sidebar_content__baustein.style.display = "none";
    }
    preview_render() {
      if (this.preview_content.style.display === "") {
        if (this.preview_iframe_url === null) {
          this.preview_content.innerHTML = this.export().html;
          const a_tags = this.preview_content.getElementsByTagName("a");
          for (let i = 0; i < a_tags.length; i++) {
            a_tags[i].target = "_blank";
          }
          const img_tags = this.preview_content.getElementsByTagName("img");
          for (let i = 0; i < img_tags.length; i++) {
            img_tags[i].setAttribute("draggable", "false");
          }
        } else {
          let preview_iframe = this.preview_content.querySelector("iframe");
          if (preview_iframe === null) {
            this.preview_content.innerHTML = "";
            preview_iframe = this.preview_content.appendChild(this.createElement("iframe", "", "be_preview_iframe"));
            preview_iframe.src = this.preview_iframe_url;
            preview_iframe.onload = () => {
              preview_iframe.contentWindow.postMessage(this.export().html, "*");
            };
          } else {
            preview_iframe.contentWindow.postMessage(this.export().html, "*");
          }
        }
      }
    }
    request(type, endpoint, params) {
      return new Promise((resolve, reject) => {
        this.ajax_loader.style.display = "";
        this.ajax_loader.style.width = "";
        this.ajax_loader.style.minWidth = "";
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
          this.ajax_loader.style.width = 4 / xhttp.readyState * 80 + "%";
          if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
              resolve(xhttp);
            } else {
              reject(xhttp);
            }
            this.ajax_loader.style.width = "100%";
            setTimeout(() => {
              this.ajax_loader.style.display = "none";
            }, 1e3);
          }
        };
        if (type === "GET") {
          xhttp.open("GET", endpoint + params, true);
          xhttp.send();
        } else {
          xhttp.open("POST", endpoint, true);
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send(params);
        }
      });
    }
    dialog_border(baustein) {
      const border_modall = document.createElement("div");
      const tabcontainer = border_modall.appendChild(document.createElement("div"));
      const contentcontainer = border_modall.appendChild(document.createElement("div"));
      const tabs_name = ["style", "radius"];
      const tabs_dom = [];
      const tabs_container_dom = [];
      const inputs = [];
      for (let i = 0; i < tabs_name.length; i++) {
        const index_const = i;
        tabs_dom[i] = tabcontainer.appendChild(document.createElement("div"));
        tabs_dom[i].className = "border_modall_tab";
        tabs_dom[i].innerHTML = tabs_name[i];
        tabs_container_dom[i] = contentcontainer.appendChild(document.createElement("div"));
        tabs_container_dom[i].className = "border_modall_tabcontent";
        tabs_container_dom[i].style.display = "none";
        tabs_dom[i].addEventListener("click", () => {
          for (let i2 = 0; i2 < tabs_dom.length; i2++) {
            tabs_dom[i2].classList.remove("active");
            tabs_container_dom[i2].style.display = "none";
          }
          tabs_dom[index_const].classList.add("active");
          tabs_container_dom[index_const].style.display = "";
        });
      }
      tabs_dom[0].classList.add("active");
      tabs_container_dom[0].style.display = "";
      const sides = ["top", "right", "bottom", "left"];
      const style_index = 0;
      const style_options = [
        new Option("normal", "initial"),
        new Option("solid", "solid"),
        new Option("dashed", "dashed"),
        new Option("dotted", "dotted"),
        new Option("double", "double")
      ];
      for (let s = 0; s < sides.length; s++) {
        const tabs_container_style_dom = tabs_container_dom[style_index].appendChild(document.createElement("div"));
        tabs_container_style_dom.style.border = "1px solid #007cba";
        const side = sides[s];
        const side_dom = tabs_container_style_dom.appendChild(document.createElement("div"));
        side_dom.innerHTML = side;
        side_dom.className = "border_modall_undersides";
        const bw_name = "border-" + side + "-width";
        const bw_value = baustein.getStyleValue(bw_name, "");
        const bw_fc = this.formcontrol(bw_name, "number", bw_name, null, bw_value, { suffix: ["px"] });
        bw_fc.content.className = "border_modall_undersides be_formrow";
        tabs_container_style_dom.appendChild(bw_fc.content);
        inputs.push(bw_fc.input);
        const bs_name = "border-" + side + "-style";
        const bs_value = baustein.getStyleValue(bw_name, "");
        const bs_fc = this.formcontrol(bw_name, "select", bw_name, null, bw_value, { html_options: style_options });
        bw_fc.content.className = "border_modall_undersides be_formrow";
        tabs_container_style_dom.appendChild(bw_fc.content);
        inputs.push(bw_fc.input);
        const name = "border-" + side + "-color";
        const value = baustein.getStyleValue(bw_name, "");
        const fc = this.formcontrol(bw_name, "color", bw_name, null, bw_value, {});
        bw_fc.content.className = "border_modall_undersides be_formrow";
        tabs_container_style_dom.appendChild(bw_fc.content);
        inputs.push(bw_fc.input);
      }
      const radius_index = 1;
      const radius_corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
      radius_corners.forEach((corner) => {
        const name = "border-" + corner + "-radius";
        const value = baustein.getStyleValue(name, "0px");
        const fc = this.formcontrol(name, "number", name, name, value, {
          number_min: 0,
          suffix: ["px", "%"]
        });
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
    dialog_rowcol(baustein) {
      return new Promise((resolve, reject) => {
        const content = this.createElement("div", "", "");
        let columns_fcr = null;
        if (baustein.renderType === bausteinRenderType.table || baustein.renderType === bausteinRenderType.layout) {
          columns_fcr = this.formcontrol("dialog", "number", "columns", LOCALES.get_item("columns"), "", {
            number_default: 1,
            number_min: 1,
            number_max: 40
          });
          columns_fcr.content.style.display = "inline-block";
          columns_fcr.content.style.verticalAlign = "top";
          columns_fcr.content.style.width = "100px";
          columns_fcr.input.value = "1";
          content.appendChild(columns_fcr.content);
        }
        let rows_fcr = null;
        if (baustein.renderType === bausteinRenderType.table || baustein.renderType === bausteinRenderType.container) {
          rows_fcr = this.formcontrol("dialog", "number", "rows", LOCALES.get_item("rows"), "", {
            number_default: 1,
            number_min: 1,
            number_max: 40
          });
          rows_fcr.content.style.display = "inline-block";
          rows_fcr.content.style.verticalAlign = "top";
          rows_fcr.content.style.width = "100px";
          rows_fcr.input.value = "1";
          content.appendChild(rows_fcr.content);
        }
        const error_message = this.createElement("div", "", "error-message");
        error_message.style.color = "red";
        this.dialog.start(baustein.title + " " + LOCALES.get_item("create"), content, LOCALES.get_item("finish"), null, LOCALES.get_item("cancel"), () => {
          if (columns_fcr !== null) {
            const columns_number = parseInt(columns_fcr.input.value);
            if (columns_number < 1) {
              error_message.innerHTML = '"Spalten Anzahl" muss gr\xF6\xDFer als 0 sein';
              return false;
            } else {
              baustein.columns = columns_number;
            }
          }
          if (rows_fcr !== null) {
            const rows_number = parseInt(rows_fcr.input.value);
            if (rows_number < 1) {
              error_message.innerHTML = '"Reihen Anzahl" muss gr\xF6\xDFer als 0 sein';
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
    dialog_media(renderType) {
      return new Promise((resolve, reject) => {
        let search_endpoint, register_endpoint;
        if (renderType === bausteinRenderType.image) {
          search_endpoint = this.api_endpoints.image_search;
        } else {
          search_endpoint = "";
        }
        const content = this.createElement("div", "", "");
        const content_search = content.appendChild(this.createElement("div", "", "be-dialog-media-search"));
        content_search.style.paddingBottom = "20px";
        const content_search_input = content_search.appendChild(this.createElement("input", "", "be-dialog-media-search-input be-form-control"));
        content_search_input.type = "text";
        content_search_input.placeholder = LOCALES.get_item("search_placeholder");
        content_search_input.style.display = "inline-block";
        content_search_input.style.verticalAlign = "middle";
        const content_search_submit = content_search.appendChild(this.createElement("button", "", "be-dialog-media-search-submit __dialog-btn"));
        content_search_submit.type = "button";
        content_search_submit.innerHTML = LOCALES.get_item("search");
        content_search_submit.style.display = "inline-block";
        content_search_submit.style.verticalAlign = "middle";
        content_search_submit.style.width = "66px";
        content_search_submit.style.padding = "6px";
        content_search_submit.style.marginLeft = "8px";
        content_search_submit.style.marginRight = "0";
        content_search_submit.style.marginBottom = "0";
        content_search_input.style.width = "calc(100% - " + content_search_submit.style.width + " - " + content_search_submit.style.marginLeft + ")";
        const content_results = content.appendChild(this.createElement("div", "", "be-dialog-media-results"));
        content_results.style.overflowY = "auto";
        content_results.style.maxHeight = "90vh";
        let current_page = 1;
        const pagination = content.appendChild(this.createElement("div", "", "be-dialog-media-pagination"));
        const pagination_prev = pagination.appendChild(this.createElement("button", "", "__dialog-btn"));
        pagination_prev.type = "button";
        pagination_prev.innerText = LOCALES.get_item("back");
        pagination_prev.disabled = true;
        const pagination_current = pagination.appendChild(this.createElement("div", "", ""));
        pagination_current.innerText = "1";
        const pagination_next = pagination.appendChild(this.createElement("button", "", "__dialog-btn"));
        pagination_next.type = "button";
        pagination_next.innerText = LOCALES.get_item("forward");
        const start_search = (page) => {
          if (page < 1) return;
          pagination_prev.disabled = true;
          pagination_next.disabled = true;
          current_page = page;
          pagination_current.innerText = page.toString();
          this.request("GET", search_endpoint, "&q=" + content_search_input.value + "&page=" + current_page).then((response) => {
            const media_array = JSON.parse(response.responseText);
            content_results.innerHTML = "";
            for (let i = 0; i < media_array.length; i++) {
              const image_data = media_array[i];
              content_results.append(
                this.create_dialog_media_item(image_data, resolve)
              );
            }
            if (current_page > 1) pagination_prev.disabled = false;
            pagination_next.disabled = false;
          });
        };
        content_search_input.addEventListener("change", () => start_search(1));
        content_search_submit.addEventListener("click", () => start_search(1));
        pagination_prev.addEventListener("click", () => start_search(current_page - 1));
        pagination_next.addEventListener("click", () => start_search(current_page + 1));
        this.dialog.start(LOCALES.get_item("load_image"), content, '<i class="fa-solid fa-sync"></i> ' + LOCALES.get_item("refresh_view"), null, LOCALES.get_item("cancel"), () => {
          start_search(current_page);
        }, null, () => {
          this.dialog.close();
          reject();
        });
        content_results.style.height = 500 - content_search.clientHeight - pagination.clientHeight + "px";
        if (this.image_upload !== null) {
          const __dialog_footer = document.getElementById("__dialog_footer");
          const upload_button = this.createElement("button", "", "__dialog-btn __dialog-btn-cyan");
          upload_button.innerHTML = '<i class="fa-solid fa-upload"></i> ' + LOCALES.get_item("upload_image");
          upload_button.addEventListener("click", () => {
            if (this.image_upload !== null) {
              this.image_upload().then((image_data) => {
                console.log("image_data: in BausteinEditor", image_data);
                content_results.prepend(
                  this.create_dialog_media_item(image_data, resolve)
                );
              });
            }
          });
          __dialog_footer?.prepend(upload_button);
        }
        start_search(1);
      });
    }
    create_dialog_media_item(image_data, image_select_event) {
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
      const image_container = row.appendChild(this.createElement("div", "", "col"));
      image_container.style.position = "relative";
      image_container.style.width = "100%";
      image_container.style.height = "200px";
      image_container.style.cursor = "pointer";
      image_container.addEventListener("click", () => {
        this.fullscreen_image_modal_show(image_data.url);
      });
      const image = image_container.appendChild(this.createElement("img", "", ""));
      image.src = image_data.url;
      image.style.maxWidth = "100%";
      image.style.maxHeight = "100%";
      const image_plus = image_container.appendChild(this.createElement("div", "", ""));
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
      const button = row.appendChild(this.createElement("button", "", "__dialog-btn __dialog-btn-green"));
      button.type = "button";
      button.innerText = LOCALES.get_item("select");
      ;
      button.style.marginBottom = "8px";
      const image_id = image_data.file_id;
      button.addEventListener("click", () => {
        if (this.media_register) this.media_register(image_data);
        image_select_event(image_data.url);
        this.dialog.close();
      });
      return row;
    }
    fullscreen_image_modal_show(url) {
      let fullscreen_image_modal = document.getElementById("fullscreen_image_modal");
      if (fullscreen_image_modal === null) {
        fullscreen_image_modal = this.be.appendChild(this.createElement("div", "fullscreen_image_modal", "be-fullscreen-image-modal"));
        fullscreen_image_modal.addEventListener("click", () => {
          if (fullscreen_image_modal !== null) fullscreen_image_modal.style.display = "none";
        });
        const fullscreen_close = fullscreen_image_modal.appendChild(this.createElement("div", "", "be-fullscreen-image-modal-close"));
        fullscreen_close.innerHTML = '<i class="fa-solid fa-times"></i>';
      } else {
        fullscreen_image_modal.style.display = "";
      }
      const fullscreen_image = document.getElementById("fullscreen_image_modal_image") || fullscreen_image_modal.appendChild(this.createElement("img", "fullscreen_image_modal_image", "be-fullscreen-image-modal-image"));
      fullscreen_image.src = url;
    }
    /** Method to import data. You need to call render() after import() */
    import(data) {
      this.data.bausteine = [];
      for (let i = 0; i < data.bausteine.length; i++) {
        const data_baustein = data.bausteine[i];
        if (data_baustein.id >= this.baustein_id_counter) {
          this.baustein_id_counter = data_baustein.id + 1;
        }
        const template_baustein = this.getBausteinType(data_baustein.type);
        const baustein = new Baustein(
          data_baustein.id,
          data_baustein.position,
          data_baustein.type,
          template_baustein.tag,
          template_baustein.renderType,
          data_baustein.toggleableClasses,
          data_baustein.attributes,
          data_baustein.style
        );
        baustein.content = data_baustein.content;
        baustein.columns = data_baustein.columns;
        baustein.rows = data_baustein.rows;
        baustein.attributes = data_baustein.attributes;
        if (data_baustein.class !== "") {
          if (baustein.class !== "") baustein.class += " ";
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
    export_createBausteinElement(baustein, tag_override = null) {
      console.log("export_createBausteinElement", baustein, tag_override);
      if (baustein.tag === "") {
        const text_node = document.createTextNode(baustein.content);
        if (tag_override !== null) {
          const bausteinElement = document.createElement(tag_override);
          bausteinElement.appendChild(text_node);
          return bausteinElement;
        }
        return text_node;
      } else {
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
        bausteinElement.className = "baustein baustein--" + id;
        if (baustein.class !== "") bausteinElement.className += " " + baustein.class;
        for (let s = 0; s < baustein.style.length; s++) {
          const style = baustein.style[s];
          if (style.value !== "" && style.value !== "0" && style.value !== "auto" && style.value !== "initial" && style.value !== "normal" && (style.property.options.length === 0 || style.value !== style.property.options[0].value)) {
            let ok = true, test_type_index = -1;
            const test_type = this.getBausteinType(id);
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
            const bausteinElement_img = bausteinElement.appendChild(document.createElement("img"));
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
        const child_bausteine = this.getBausteineChildren(baustein.id);
        for (let r = 0; r < child_bausteine.length; r++) {
          const child = child_bausteine[r];
          let child_tag_override = null;
          if (baustein.renderType === bausteinRenderType.tableRow) child_tag_override = "td";
          if (child_tag_override === null) {
            bausteinElement.appendChild(this.export_createBausteinElement(child));
          } else {
            if (child.type === this.types.td.type || child.type === this.types.th.type) {
              bausteinElement.appendChild(this.export_createBausteinElement(child));
            } else {
              const bausteinElement_col = bausteinElement.appendChild(document.createElement(child_tag_override));
              bausteinElement_col.appendChild(this.export_createBausteinElement(child));
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
  };
  return __toCommonJS(baustein_editor_exports);
})();
//# sourceMappingURL=baustein_editor.js.map
