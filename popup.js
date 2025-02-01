document.addEventListener("DOMContentLoaded", function() {
    const dataOutput = document.getElementById("dataOutput");
    const clearButton = document.getElementById("clearData");

    // 保存されたデータを取得
    chrome.storage.local.get(["genderData"], function(result) {
        if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
            dataOutput.innerHTML = "<tr><td colspan='3'>データの取得に失敗しました。</td></tr>";
        } else {
            if (result.genderData && result.genderData.length > 0) {
                // テーブルの行を動的に作成
                let rows = "";
                result.genderData.forEach(data => {
                    let selectedValue = data.selectedValue || "未選択";
                    let type = data.radios ? "ラジオボタン" :
                               data.dropdowns ? "ドロップダウン" :
                               data.textInputs ? "テキストインプット" : "不明";

                    rows += `
                        <tr>
                            <td>${data.url}</td>
                            <td>${type}</td>
                            <td>${selectedValue}</td>
                        </tr>
                    `;
                });
                dataOutput.innerHTML = rows;
            } else {
                dataOutput.innerHTML = "<tr><td colspan='3'>データがありません。</td></tr>";
            }
        }
    });

    // データ削除ボタンのイベントリスナー
    clearButton.addEventListener("click", function() {
        chrome.storage.local.remove(["genderData"], function() {
            dataOutput.innerHTML = "<tr><td colspan='3'>データが削除されました。</td></tr>";
            console.log("Gender data has been removed.");
        });
    });
});
