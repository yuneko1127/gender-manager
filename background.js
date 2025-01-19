chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // ページが完全に読み込まれた時に、すべてのURLで実行
    if (changeInfo.status === 'complete') {
        console.log("ページにアクセスしました:", tab.url);
        
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content_script.js"]
        }).catch(err => {
            console.error("スクリプト実行エラー:", err);
        });
    }
});
