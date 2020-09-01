var virtualBody, mappingElement;

$(function() {
    $('#convert button[type="submit"]').click(function(e) {
        e.preventDefault();
        tinyMCE.activeEditor.setProgressState(true)
        const data = {
            'origin': getContent(),
            'punctuation': $('#punctuation').val(),
            'format': 'html'
        };
        fetch("/json", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }).then(res => {
                tinyMCE.activeEditor.setProgressState(false);
                return res.json();
            })
            .catch(err => { alert("轉換失敗"); })
            .then(resp => { setContent(resp); })
    });

    tinymce.init({
        selector: '#origin',
        branding: false,
        language: "zh_TW",
        language_url: '/public/javascripts/zh_TW.js'
    });
});

function getContent() {
    const origin = tinyMCE.activeEditor.getContent({ format: 'raw' })
    const parsed = parseHTML(origin);
    console.log(origin);
    console.log(parsed);
    return parsed;
}

function setContent(msg) {
    console.log(msg);
    replaceText(msg.converted);
    tinyMCE.activeEditor.setContent(virtualBody.innerHTML, { format: 'html' });
};

function parseHTML(htmlContent) {
    virtualBody = document.createElement('body');
    mappingElement = [];
    virtualBody.innerHTML = htmlContent;
    treeWalker = document.createTreeWalker(virtualBody, 1 | 4, null, false);
    stringArr = [];
    while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode;
        switch (node.nodeName.toLowerCase()) {
            case '#text':
                stringArr.push(node.textContent);
                mappingElement.push(node);
                break;
            case 'option':
                stringArr.push(node.text);
                mappingElement.push(node);
                break;
        }
    }
    return stringArr;
}

function replaceText(converted) {
    treeWalker = document.createTreeWalker(virtualBody, 1 | 4, null, false);
    while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode;
        switch (node.nodeName.toLowerCase()) {
            case '#text':
                node.textContent = converted[0];
                converted.shift();
                break;
            case 'option':
                node.text = converted[0];
                converted.shift();
                break;
        }
    }
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}