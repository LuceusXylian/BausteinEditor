// deno-lint-ignore-file



export class LuxDragDrop {
	boundary: HTMLElement;
    target: HTMLElement;
    isHeld: boolean = false;
    timeoutId: number = 0;

    drag_element: HTMLElement|null = null;
    offset_x: number = 0;
    offset_y: number = 0;

    callback_mousedown: ((event: MouseEvent)=>boolean)|null;
    callback_mousemove: ((event: MouseEvent)=>void)|null;
    callback_mouseup: ((event: MouseEvent, reciever_element: HTMLElement)=>void)|null;

    maxsizes: boolean;


    constructor(boundary: HTMLElement, target: HTMLElement, options: {
        mousedown: ((event: MouseEvent)=>boolean)|null,
        mousemove: ((event: MouseEvent)=>void)|null,
        mouseup: ((event: MouseEvent, reciever_element: HTMLElement)=>void)|null,
        maxsizes: boolean,
    }) {
        this.boundary = boundary;
        this.target = target;
        this.callback_mousedown = options.mousedown || null;
        this.callback_mousemove = options.mousemove || null;
        this.callback_mouseup = options.mouseup || null;
        this.maxsizes = options.maxsizes || true;

        ["mousedown", "mousestart"].forEach(type => {
             this.target.addEventListener(type, (e) => this.on_mousedown(<MouseEvent> e));
        });
    }


    on_mousedown = (e: MouseEvent) => {
        if (!this.isHeld) {
            this.timeoutId = setTimeout(() => {
                if(this.callback_mousedown !== null) {
                    const res = this.callback_mousedown(e);
                    if(res === false) {return false;}
                }

                this.isHeld = true;
                this.target.classList.add("disabled");
                this.clearSelection();
                
                // create ghost element
                let width = this.target.offsetWidth, height = this.target.offsetHeight;
                if(this.maxsizes) {
                    if (width > 100) width = 100;
                    if (height > 100) height = 100;
                }

                this.drag_element = document.createElement(this.target.tagName);
                this.drag_element.className = this.target.className;
                this.drag_element.innerHTML = this.target.innerHTML;
                this.drag_element.style.width = width+"px";
                this.drag_element.style.height = height+"px";
                this.boundary.appendChild(this.drag_element)
                

                this.boundary.classList.add("grabbing");
                if(this.drag_element === null) {
                    console.error("[LuxDragDrop] drag_element is null. Well bad.");
                } else {
                    this.drag_element.classList.add("ondrag");
                    this.drag_element.style.position = "fixed";
                    this.drag_element.style.display = "none";
                    setTimeout(() => {
                        if(this.drag_element !== null) {
                            this.drag_element.style.display = "block";
                        }
                    }, 100);

                    ["mouseup", "touchend", "touchcancel"].forEach(type => {
                        this.drag_element!.addEventListener(type, this.on_mouseup);
                    });
                }
    
                // start mouse movement tracking
                ["mousemove", "touchmove"].forEach(type => {
                    this.boundary.addEventListener(type, this.on_mousemove);
                });
                this.offset_x = width / 2;
                this.offset_y = height / 2;
            }, 200);
        }
        
        // always start mouseup so we can stop tracking / kill the events
        ["mouseup", "touchend", "touchcancel"].forEach(type => {
            this.target.addEventListener(type, this.on_mouseup);
        });
    };


    // deno-lint-ignore no-explicit-any
    on_mousemove = (e: any) => {
        if (this.drag_element !== null) {
            this.drag_element.style.left = (e.clientX - this.offset_x)+"px";
            this.drag_element.style.top = (e.clientY - this.offset_y)+"px";
            
            if(this.callback_mousemove !== null) this.callback_mousemove(e);
        }
    };
    
    // deno-lint-ignore no-explicit-any
    on_mouseup = (e: any) => {
        clearTimeout(this.timeoutId);
        console.log("on_mouseup");
        
        
        if (this.isHeld) {
            this.isHeld = false;
            this.target.classList.remove("disabled");
            if(this.drag_element !== null) {
                this.drag_element.remove();
                this.drag_element = null;
            }
            document.querySelectorAll(".ondrag").forEach((elem) => { elem.remove() });
            this.boundary.classList.remove("grabbing");

            // mouseup events on boards and items (drag reciever)
            const elementTarget: HTMLElement | null = this.elementFromPoint(e.clientX, e.clientY);
            if (elementTarget === null) {
                console.error("[LuxDragDrop] Oh well bad, elementTarget is null. Uff.");
            } else {
                if(this.callback_mouseup !== null) this.callback_mouseup(e, elementTarget);
            }
        }

        // kill mouse movement tracking
        ["mousemove", "touchmove"].forEach(type => {
            this.boundary.removeEventListener(type, this.on_mousemove);
        });
        ["mouseup", "touchend", "touchcancel"].forEach(type => {
            this.target.removeEventListener(type, this.on_mouseup);
        });
    };


    elementFromPoint(x: number, y: number): HTMLElement | null {
        return <HTMLElement | null> document.elementFromPoint(x, y);
    }

    clearSelection() {
        if (window !== null && window.getSelection) { 
            const selection = window.getSelection(); 
            if(selection !== null) selection.removeAllRanges();
        }
    }
}