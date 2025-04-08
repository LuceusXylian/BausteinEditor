

export class Dialog {
    dialog: HTMLElement;
    dialog_wrapper: HTMLElement;
    dialog_content: HTMLElement;
    dialog_header: HTMLElement;
    dialog_title: HTMLElement;
    dialog_close: HTMLElement;
    dialog_body: HTMLElement;
    dialog_footer: HTMLElement
    previous_action_close_function: EventListenerOrEventListenerObject | null = null;
    
    constructor(parent: HTMLElement) {
        this.dialog = this.create_element_if_not_exists(parent, "div", "__dialog", {class: "__dialog", style: "display: none;"});
        this.dialog_wrapper = this.create_element_if_not_exists(this.dialog, "div", "__dialog_wrapper", {class: "__dialog-wrapper"});
        this.dialog_content = this.create_element_if_not_exists(this.dialog_wrapper, "div", "__dialog_content", {class: "__dialog-content"});
        this.dialog_header = this.create_element_if_not_exists(this.dialog_content, "div", "__dialog_header", {class: "__dialog-header"});
        this.dialog_title = this.create_element_if_not_exists(this.dialog_header, "div", "__dialog_title", {class: "__dialog-title"});
        this.dialog_close = this.create_element_if_not_exists(this.dialog_header, "div", "__dialog_close", {class: "__dialog-close"});
        this.dialog_body = this.create_element_if_not_exists(this.dialog_content, "div", "__dialog_body", {class: "__dialog-body"});
        this.dialog_footer = this.create_element_if_not_exists(this.dialog_content, "div", "__dialog_footer", {class: "__dialog-footer"});
        
        this.dialog_close.innerHTML = "&times;";
    }
    
    start(title: string, body_content: string | HTMLElement, action_ok_text: string | null, action_fail_text: string | null, action_close_text: string | null, action_ok: EventListenerOrEventListenerObject | null = null, action_fail: EventListenerOrEventListenerObject | null = null, action_close: EventListenerOrEventListenerObject | null = null) {
        this.dialog_title.innerHTML = title;
        if(typeof body_content === "string") {
            this.dialog_body.innerHTML = body_content;
        } else {
            this.dialog_body.innerHTML = '';
            this.dialog_body.appendChild(body_content);
        }
        
        if(this.previous_action_close_function !== null) this.dialog_close.removeEventListener("click", this.previous_action_close_function);
        if (action_close === null) action_close = () => this.close();
        this.previous_action_close_function = action_close;
        this.dialog_close.addEventListener("click", action_close);
        

        this.dialog_footer.innerHTML = '';
        if (action_ok_text !== null) {
            const button: HTMLButtonElement = this.create_element(this.dialog_footer, "button", {class: "__dialog-btn __dialog-btn-green"})
            button.type = "button";
            button.innerHTML = action_ok_text;
            if(action_ok !== null) button.addEventListener("click", action_ok);
        }

        if (action_fail_text !== null) {
            const button: HTMLButtonElement = this.create_element(this.dialog_footer, "button", {class: "__dialog-btn __dialog-btn-red"})
            button.type = "button";
            button.innerHTML = action_fail_text;
            if(action_fail !== null) button.addEventListener("click", action_fail);
        }

        if (action_close_text !== null) {
            const button: HTMLButtonElement = this.create_element(this.dialog_footer, "button", {class: "__dialog-btn __dialog-btn-gray"})
            button.type = "button";
            button.innerHTML = action_close_text;
            if(action_close !== null) button.addEventListener("click", action_close);
        }
        

        this.dialog.style.display = "";
    }

    close() {
        this.dialog.style.display = "none";
    }

    create_element<K extends keyof HTMLElementTagNameMap>(parent: HTMLElement, tag: K, attributes?: { [key: string]: string }): HTMLElementTagNameMap[K] {
        const element = document.createElement(tag);
        if (attributes) {
            for (const key in attributes) {
                element.setAttribute(key, attributes[key]);
            }
        }
        parent.append(element);
        return element;
    }

    create_element_if_not_exists<K extends keyof HTMLElementTagNameMap>(parent: HTMLElement, tag: K, _id: string, attributes?: { [key: string]: string }): HTMLElementTagNameMap[K] {
        const find_element = <HTMLElementTagNameMap[K]> document.getElementById(_id);
        if (find_element === null) {
            const element = this.create_element(parent, tag, attributes);
            element.id = _id;
            return element;
        } else {
            return find_element;
        }
    }
}
