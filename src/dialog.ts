class Dialog {
    dom: {
        dialog: HTMLElement,
        dialog_wrapper: HTMLElement,
        dialog_content: HTMLElement,
        dialog_header: HTMLElement,
        dialog_title: HTMLElement,
        dialog_close: HTMLElement,
        dialog_body: HTMLElement,
        dialog_footer: HTMLElement
    };
    previous_action_close_function: EventListenerOrEventListenerObject | null = null;
    
    constructor() {
        var dialog = document.getElementById("__dialog");
        var dialog_wrapper = document.getElementById("__dialog_wrapper");
        var dialog_content = document.getElementById("__dialog_content");
        var dialog_header = document.getElementById("__dialog_header");
        var dialog_title = document.getElementById("__dialog_title");
        var dialog_close = document.getElementById("__dialog_close");
        var dialog_body = document.getElementById("__dialog_body");
        var dialog_footer = document.getElementById("__dialog_footer");
        
        if(dialog === null) dialog = document.body.appendChild(this.createElement("div", "__dialog", "__dialog"));
        if(dialog_wrapper === null) dialog_wrapper = dialog.appendChild(this.createElement("div", "__dialog_wrapper", "__dialog-wrapper"));
        if(dialog_content === null) dialog_content = dialog_wrapper.appendChild(this.createElement("div", "__dialog_content", "__dialog-content"));
        if(dialog_header === null) dialog_header = dialog_content.appendChild(this.createElement("div", "__dialog_header", "__dialog-header"));
        if(dialog_title === null) dialog_title = dialog_header.appendChild(this.createElement("div", "__dialog_title", "__dialog-title"));
        if(dialog_close === null) dialog_close = dialog_header.appendChild(this.createElement("div", "__dialog_close", "__dialog-close"));
        if(dialog_body === null) dialog_body = dialog_content.appendChild(this.createElement("div", "__dialog_body", "__dialog-body"));
        if(dialog_footer === null) dialog_footer = dialog_content.appendChild(this.createElement("div", "__dialog_footer", "__dialog-footer"));
        
        this.dom = {
            dialog: dialog,
            dialog_wrapper: dialog_wrapper,
            dialog_content: dialog_content,
            dialog_header: dialog_header,
            dialog_title: dialog_title,
            dialog_close: dialog_close,
            dialog_body: dialog_body,
            dialog_footer: dialog_footer,
        };

        this.dom.dialog.style.display = "none";
        this.dom.dialog_close.innerHTML = '&times;';
    }
    
    start(title: string, body_content: string | HTMLElement, action_ok_text: string | null, action_fail_text: string | null, action_close_text: string | null, action_ok: EventListenerOrEventListenerObject | null = null, action_fail: EventListenerOrEventListenerObject | null = null, action_close: EventListenerOrEventListenerObject | null = null) {
        this.dom.dialog_title.innerHTML = title;
        if(typeof body_content === "string") {
            this.dom.dialog_body.innerHTML = body_content;
        } else {
            this.dom.dialog_body.innerHTML = '';
            this.dom.dialog_body.appendChild(body_content);
        }
        
        if(this.previous_action_close_function !== null) this.dom.dialog_close.removeEventListener("click", this.previous_action_close_function);
        if (action_close === null) action_close = () => this.close();
        this.previous_action_close_function = action_close;
        this.dom.dialog_close.addEventListener("click", action_close);
        

        this.dom.dialog_footer.innerHTML = '';
        if (action_ok_text !== null) {
            var button: HTMLButtonElement = <HTMLButtonElement> this.dom.dialog_footer.appendChild(this.createElement("button", "", "__dialog-btn __dialog-btn-green"))
            button.type = "button";
            button.innerHTML = action_ok_text;
            if(action_ok !== null) button.addEventListener("click", action_ok);
        }

        if (action_fail_text !== null) {
            var button: HTMLButtonElement = <HTMLButtonElement> this.dom.dialog_footer.appendChild(this.createElement("button", "", "__dialog-btn __dialog-btn-red"))
            button.type = "button";
            button.innerHTML = action_fail_text;
            if(action_fail !== null) button.addEventListener("click", action_fail);
        }

        if (action_close_text !== null) {
            var button: HTMLButtonElement = <HTMLButtonElement> this.dom.dialog_footer.appendChild(this.createElement("button", "", "__dialog-btn __dialog-btn-gray"))
            button.type = "button";
            button.innerHTML = action_close_text;
            if(action_close !== null) button.addEventListener("click", action_close);
        }
        

        this.dom.dialog.style.display = "";
    }

    close() {
        this.dom.dialog.style.display = "none";
    }

    createElement(_type: string, _id: string, _class: string): HTMLElement {
        var element = document.createElement(_type);
        if(_id !== "") element.id = _id;
        if(_class !== "") element.className = _class;
        return element;
    }
}
