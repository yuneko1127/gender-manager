document.addEventListener("DOMContentLoaded", function () {
    const dataOutput = document.getElementById("dataOutput");
    const dataCountElement = document.getElementById("dataCount");
    const clearButton = document.getElementById("clearData");

    // 保存されたデータを取得
    chrome.storage.local.get(["genderData"], function (result) {
        // 取得したデータをコンソールに出力
        if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
            dataOutput.innerHTML = "<tr><td colspan='3'>データの取得に失敗しました。</td></tr>";
        } else {
            let dataCount = 0;
            if (result.genderData && result.genderData.length > 0) {
                dataCount = result.genderData.length;
                // テーブルの行を動的に生成（innerHTMLを使わない）
                dataOutput.innerHTML = "";
                result.genderData.forEach((data, idx) => {
                    let selectedValue = data.selectedValue || "未選択";
                    let type = data.radios ? "ラジオボタン" :
                        data.dropdowns ? "ドロップダウン" :
                            data.textInputs ? "テキストインプット" : "不明";

                    const tr = document.createElement('tr');
                    const tdUrl = document.createElement('td');
                    tdUrl.textContent = data.url;
                    const tdType = document.createElement('td');
                    tdType.textContent = type;
                    const tdValue = document.createElement('td');
                    tdValue.textContent = selectedValue;
                    const tdOp = document.createElement('td');
                    const delBtn = document.createElement('button');
                    delBtn.textContent = '削除';
                    delBtn.className = 'deleteRow';
                    delBtn.setAttribute('data-idx', idx);
                    tdOp.appendChild(delBtn);

                    tr.appendChild(tdUrl);
                    tr.appendChild(tdType);
                    tr.appendChild(tdValue);
                    tr.appendChild(tdOp);
                    dataOutput.appendChild(tr);
                });
                // 削除ボタンのイベントリスナーを追加
                document.querySelectorAll('.deleteRow').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const idx = parseInt(this.getAttribute('data-idx'));
                        // データを取得して該当インデックスを削除
                        chrome.storage.local.get(["genderData"], function (res) {
                            let arr = res.genderData || [];
                            arr.splice(idx, 1);
                            chrome.storage.local.set({ genderData: arr }, function () {
                                // 再描画
                                location.reload();
                            });
                        });
                    });
                });
            } else {
                // データがない場合もinnerHTMLを最小限に
                dataOutput.innerHTML = "";
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 4;
                td.textContent = 'データがありません。';
                tr.appendChild(td);
                dataOutput.appendChild(tr);
            }
            dataCountElement.textContent = `出会った性別欄の数: ${dataCount}`;
        }
    });

    // データ削除ボタンのイベントリスナー
    clearButton.addEventListener("click", function () {
        chrome.storage.local.remove(["genderData"], function () {
            dataOutput.innerHTML = "<tr><td colspan='3'>データが削除されました。</td></tr>";
        });
    });
});
