"use strict";
var editor = document.getElementsByClassName('wp-webdeasy-comment-editor')[0];
var toolbar = editor.getElementsByClassName('toolbar')[0];
var buttons = toolbar.querySelectorAll('.editor-btn:not(.has-submenu)');
var contentArea = editor.getElementsByClassName('content-area')[0];
var visuellView = contentArea.getElementsByClassName('visuell-view')[0];
var htmlView = contentArea.getElementsByClassName('html-view')[0];
var modal = document.getElementsByClassName('modal')[0];
document.addEventListener('selectionchange', selectionChange);
visuellView.addEventListener('paste', pasteEvent);
contentArea.addEventListener('keypress', addParagraphTag);
for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener('click', function (e) {
        var action = this.dataset.action;
        switch (action) {
            case 'toggle-view':
                execCodeAction(this, editor);
                break;
            case 'createLink':
                execLinkAction();
                break;
            default:
                execDefaultAction(action);
        }
    });
}
function execCodeAction(button, editor) {
    if (button.classList.contains('active')) {
        visuellView.innerHTML = htmlView.value;
        htmlView.style.display = 'none';
        visuellView.style.display = 'block';
        button.classList.remove('active');
    }
    else {
        htmlView.innerText = visuellView.innerHTML;
        visuellView.style.display = 'none';
        htmlView.style.display = 'block';
        button.classList.add('active');
    }
}
function execLinkAction() {
    modal.style.display = 'block';
    var selection = saveSelection();
    var submit = modal.querySelectorAll('button.done')[0];
    var close = modal.querySelectorAll('.close')[0];
    submit.addEventListener('click', function (e) {
        e.preventDefault();
        var newTabCheckbox = modal.querySelectorAll('#new-tab')[0];
        var linkInput = modal.querySelectorAll('#linkValue')[0];
        var linkValue = linkInput.value;
        var newTab = newTabCheckbox.checked;
        restoreSelection(selection);
        if (window.getSelection().toString()) {
            var a = document.createElement('a');
            a.href = linkValue;
            if (newTab)
                a.target = '_blank';
            window.getSelection().getRangeAt(0).surroundContents(a);
        }
        modal.style.display = 'none';
        linkInput.value = '';
        submit.removeEventListener('click', arguments.callee);
        close.removeEventListener('click', arguments.callee);
    });
    close.addEventListener('click', function (e) {
        e.preventDefault();
        var linkInput = modal.querySelectorAll('#linkValue')[0];
        modal.style.display = 'none';
        linkInput.value = '';
        submit.removeEventListener('click', arguments.callee);
        close.removeEventListener('click', arguments.callee);
    });
}
function execDefaultAction(action) {
    document.execCommand(action, false);
}
function saveSelection() {
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            var ranges = [];
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
    }
    else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}
function restoreSelection(savedSel) {
    if (savedSel) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            for (var i = 0, len = savedSel.length; i < len; ++i) {
                sel.addRange(savedSel[i]);
            }
        }
        else if (document.selection && savedSel.select) {
            savedSel.select();
        }
    }
}
function selectionChange(e) {
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        if (button.dataset.action === 'toggle-view')
            continue;
        button.classList.remove('active');
    }
    if (!childOf(window.getSelection().anchorNode.parentNode, editor))
        return false;
    parentTagActive(window.getSelection().anchorNode.parentNode);
}
function childOf(child, parent) {
    return parent.contains(child);
}
function parentTagActive(elem) {
    if (!elem || !elem.classList || elem.classList.contains('visuell-view'))
        return false;
    var toolbarButton;
    var tagName = elem.tagName.toLowerCase();
    toolbarButton = document.querySelectorAll(".toolbar .editor-btn[data-tag-name=\"" + tagName + "\"]")[0];
    if (toolbarButton) {
        toolbarButton.classList.add('active');
    }
    var textAlign = elem.style.textAlign;
    toolbarButton = document.querySelectorAll(".toolbar .editor-btn[data-style=\"textAlign:" + textAlign + "\"]")[0];
    if (toolbarButton) {
        toolbarButton.classList.add('active');
    }
    return parentTagActive(elem.parentNode);
}
function pasteEvent(e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
}
function addParagraphTag(evt) {
    if (evt.keyCode == '13') {
        if (window.getSelection().anchorNode.parentNode.tagName === 'LI')
            return;
        document.execCommand('formatBlock', false, 'p');
    }
}
//# sourceMappingURL=editor_example.js.map