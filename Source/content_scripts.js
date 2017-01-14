function checkDOM() {
    let conversationList = null;
    let observer = new MutationObserver(function(mutations) {
        if (conversationList) {
            observer.disconnect();
            detectConversationList(conversationList);
        } else {
            for (var ul of document.getElementsByTagName("ul")) {
                if (ul.getAttribute("role") === "grid") {
                    conversationList = ul;
                    break;
                }
            }
        }
    }
    );
    observer.observe(document, {
        childList: true,
        subtree: true
    });
}
function detectConversationList(conversationList) {
    let observer = new MutationObserver(function(mutations) {
        for (var mutation of mutations) {
            if (mutation.target.nodeName === "LI") {
                let conversation = mutation.target;
                let friend = conversation.getElementsByClassName("_1ht6")[0].textContent;
                let chatContent = conversation.getElementsByClassName("_1htf")[0];
                let message = null;
                
                //讚/顏文字
                if (chatContent.getElementsByClassName("_1ift _2560 img")[0]) {
                    if (chatContent.getElementsByClassName("_1ift _2560 img")[0].getAttribute("alt")) {
                        let emoji = chatContent.getElementsByClassName("_1ift _2560 img")[0].getAttribute("alt");
                        if (emoji.charCodeAt(0) === 56192 && emoji.charCodeAt(1) === 56320) {
                            message = friend + chrome.i18n.getMessage("like");
                        } else {
                            message = friend + chrome.i18n.getMessage("emoji");
                        }
                    }
                }
                //貼圖                
                else if (chatContent.getElementsByClassName("_4qba")[0]) {
                    message = chatContent.getElementsByClassName("_4qba")[0].textContent;
                }
                //檔案
                else if (chatContent.getElementsByClassName("img sp_RG_RUf0e9Ev_1_5x sx_3a5dc1")[0]) {
                    message = friend + chrome.i18n.getMessage("file");
                }
                //Messenger邀請/影片/相片
                else if (chatContent.getElementsByClassName("_3l6h")[0]) {
                    message = chatContent.textContent;
                }
                //文字訊息
                else if (chatContent.textContent !== "") {
                    message = friend + chrome.i18n.getMessage("say") + chatContent.textContent;
                }
                
                chrome.runtime.sendMessage({
                    textToSpeach: message
                }, function(response) {});
            }
        }
    }
    );
    observer.observe(conversationList, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });
}

checkDOM();