chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // ページが完全に読み込まれた時に、すべてのURLで実行
    if (changeInfo.status === 'complete') {
        
        // ページ読み込み時にランダム入力を実行
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: function() {
                randomInputs();
            }
        }).catch(err => {
            console.error("スクリプト実行エラー:", err);
        });

        // フォーム送信時にデータを保存する処理もスクリプト内で行う
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: function() {
                addSubmitListener();
            }
        }).catch(err => {
            console.error("フォーム送信イベント設定エラー:", err);
        });
    }
});
