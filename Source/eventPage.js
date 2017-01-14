chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.tts.speak(request.textToSpeach);
});
