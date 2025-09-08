document.addEventListener("DOMContentLoaded", function() {
    const dataCountElement = document.getElementById("dataCount");
    // 性別欄の数のみ取得
    chrome.storage.local.get(["genderData"], function(result) {
        let dataCount = 0;
        if (result.genderData && result.genderData.length > 0) {
            dataCount = result.genderData.length;
        }
        dataCountElement.textContent = `出会った性別欄の数: ${dataCount}`;
    });
    // 新しいタブで表示ボタンのイベントリスナー
    const openTabButton = document.getElementById("openTab");
    if (openTabButton) {
        openTabButton.addEventListener("click", function() {
            chrome.tabs.create({ url: chrome.runtime.getURL("tab.html") });
        });
    }
});
