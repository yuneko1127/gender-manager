/* キーワードと規定入力を定義 */
if (typeof window.KEY_WORDS === 'undefined') {
    // 探してほしい入力欄のキーワードを追加
    window.KEY_WORDS = ["gender", "sex", "seibetsu", "seibetu", "性別"];
}
if (typeof window.VALUE_TO_TEXT === 'undefined') {
    // テキストインプットのときに入力する値を定義
    window.VALUE_TO_TEXT = "無回答";
}

/* イベントリスナーの追加 */
document.addEventListener("DOMContentLoaded", () => {
    randomInputs();
});

document.addEventListener("submit", (event) => {
    if (event.target && event.target.tagName === "FORM") {
        saveFormData(event.target);
    }
}, true); 

/* 関数の定義 */
// ランダム入力を行う関数
function randomInputs() {
    randomRadio();
    randomDropdown();
    fillTextInput();
}

// ラジオボタンをランダム入力する関数
function randomRadio(){
    // ラジオボタンを探す
    const radioSelector = KEY_WORDS.map(name => `input[type="radio"][name*="${name}"]`).join(', ');
    const radios = document.querySelectorAll(radioSelector);

    // ラジオボタンが存在するか確認
    if (radios.length === 0) {
        return;
    }

    const requiredRadios = [];
    radios.forEach(radio => {
        if (radio.required || radio.dataset.require === "true") {
            requiredRadios.push(radio);
        }
    });

    // 選択されているボタンを解除
    requiredRadios.forEach(radio => {
        if (radio.checked) {
            radio.checked = false;
        }
    });

    // ランダムに1つ選択
    if(requiredRadios.length > 0) {
        const randomIndex = Math.floor(Math.random() * requiredRadios.length);
        requiredRadios[randomIndex].checked = true;
    }

    return;
}

// ドロップダウンをランダム入力する関数
function randomDropdown(){
    // dropdownを探す
    const dropdownSelector = KEY_WORDS.map(name => `select[name*="${name}"]`).join(', ');
    const dropdowns = document.querySelectorAll(dropdownSelector);

    // ドロップダウンメニューが存在するか確認
    if (dropdowns.length === 0) {
        return;
    }

    const requiredDropdowns = [];
    dropdowns.forEach(dropdown => {
        if (dropdown.required) {
            requiredDropdowns.push(dropdown);
        }
    });

    // ランダムに1つ選択
    requiredDropdowns.forEach(dropdown => {
        const options = dropdown.options;
        const randomIndex = Math.floor(Math.random() * options.length);
        dropdown.selectedIndex = randomIndex;
    });

    return;
}

// テキストインプットに規定入力を入力する関数
function fillTextInput(){
    // テキストインプットを探す
    const textInputSelector = KEY_WORDS.map(name => `input[type="text"][name*="${name}"]`).join(', ');
    const textInputs = document.querySelectorAll(textInputSelector);

    // テキストインプットが存在するか確認
    if (textInputs.length === 0) {
        return;
    }

    const requiredTextInputs = [];
    textInputs.forEach(textInput => {
        if (textInput.required) {
            requiredTextInputs.push(textInput); 
        }
    });

    // テキストインプットに指定された値を設定
    requiredTextInputs.forEach(textInput => {
        textInput.value = VALUE_TO_TEXT;
    });

    return;
}

// 保存するデータを探し、保存関数を呼び出す関数
function saveFormData(form) {
    let dataToSave = {
        url: window.location.href,
        radios: null,
        dropdowns: null,
        textInputs: null,
        selectedValue: null
    };

    // ラジオボタンを探す
    const radioSelector = KEY_WORDS.map(name => `input[type="radio"][name*="${name}"]`).join(', ');
    const radios = document.querySelectorAll(radioSelector);

    // ラジオボタンの情報を得る
    if (radios.length > 0) {
        radios.forEach(radio => {
            if (radio.checked) {
                dataToSave.selectedValue = radio.value;
            }
        });

        dataToSave.radios = Array.from(radios).map(radio => ({
            id: radio.id || null,
            value: radio.value,
            checked: radio.checked
        }));
    }

    // dropdownを探す
    const dropdownSelector = KEY_WORDS.map(name => `select[name*="${name}"]`).join(', ');
    const dropdowns = document.querySelectorAll(dropdownSelector);

    // ドロップダウンの情報を得る
    if (dropdowns.length > 0) {
        dropdowns.forEach(dropdown => {
            const options = dropdown.options;
            const selectedOption = options[dropdown.selectedIndex];
            dataToSave.selectedValue = selectedOption ? selectedOption.text : null;
        });

        dataToSave.dropdowns = Array.from(dropdowns).map(dropdown => ({
            options: Array.from(dropdown.options).map(option => ({
                value: option.value,
                text: option.innerText,
                selected: option.selected
            }))
        }));
    }

    // テキストインプットを探す
    const textInputSelector = KEY_WORDS.map(name => `input[type="text"][name*="${name}"]`).join(', ');
    const textInputs = document.querySelectorAll(textInputSelector);

    // テキストインプットの情報を得る
    if (textInputs.length > 0) {
        textInputs.forEach(textInput => {
            dataToSave.selectedValue = textInput.value;
        });

        dataToSave.textInputs = Array.from(textInputs).map(textInput => ({
            value: textInput.value
        }));
    }

    if(radios.length > 0 || dropdowns.length > 0 || textInputs.length > 0) {
        saveToStorage(dataToSave);
    }
}

// 実際にデータをストレージに保存する関数
function saveToStorage(dataToSave) {
    chrome.storage.local.get(['genderData'], function(result) {
        // 以前のデータを取得
        let genderData = result.genderData || [];

        // 新しいデータを追加
        genderData.push(dataToSave);

        // ストレージに保存
        chrome.storage.local.set({ genderData: genderData }, function() {
        });
    });
}