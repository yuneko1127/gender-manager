/* キーワードと規定入力を定義 */
if (typeof window.KEY_WORDS === 'undefined') {
    // 探してほしい入力欄のキーワードを追加
    window.KEY_WORDS = ["gender", "sex", "seibetsu", "seibetu"];
    console.log("KEY_WORDSを初期化しました:", KEY_WORDS);
}
if (typeof window.VALUE_TO_TEXT === 'undefined') {
    // テキストインプットのときに入力する値を定義
    window.VALUE_TO_TEXT = "無回答";
    console.log("VALUE_TO_TEXTを初期化しました:", VALUE_TO_TEXT);
}

/* 関数呼び出し */
randomRadio();
randomDropdown();
fillTextInput();

/* 関数の定義 */
// ラジオボタンをランダム入力する関数
function randomRadio(){
    const radioSelector = KEY_WORDS.map(name => `input[type="radio"][name*="${name}"]`).join(', ');
    const radios = document.querySelectorAll(radioSelector);

    // ラジオボタンが存在するか確認
    if (radios.length === 0) {
        console.log('性別のラジオボタンはありませんでした');
        return;
    }
    
    // 選択されているボタンを解除
    radios.forEach(radio => {
        if (radio.checked) {
            radio.checked = false;
        }
    });

    // ランダムに1つ選択
    const randomIndex = Math.floor(Math.random() * radios.length);
    console.log(randomIndex);
    radios[randomIndex].checked = true;
    console.log(`"${radios[randomIndex].value}" がランダムに選択されました。`);

    saveRadiosData(radios);

    return;
}

// 性別のデータを保存する
function saveRadiosData(radios) {
    let dataToSave = {
        radios: [],
        selectedValue: null
    }

    // ラジオボタンから情報を収集
    radios.forEach(radio => {
        dataToSave.radios.push({
            id: radio.id || null,
            value: radio.value || null,
            checked: radio.checked
        });
        if (radio.checked) {
            dataToSave.selectedValue = radio.value;
        }
    });

    // ストレージに保存
    chrome.storage.local.set({ genderData: dataToSave }, function() {
        console.log('Gender data has been saved:', dataToSave);
    });
}

// ドロップダウンをランダム入力する関数
function randomDropdown(){
    // dropdownを探す
    const dropdownSelector = KEY_WORDS.map(name => `select[name*="${name}"]`).join(', ');
    const dropdown = document.querySelector(dropdownSelector);

    // ドロップダウンメニューが存在するか確認
    if (!dropdown) {
        console.log('ドロップダウンメニューではありませんでした');
        return;
    }
    // ドロップダウンメニューのオプションリストを取得
    const options = dropdown.options;

    // ランダムに1つ選択
    const randomIndex = Math.floor(Math.random() * options.length);
    console.log(randomIndex);
    dropdown.selectedIndex = randomIndex;

    // 選択されたオプションのテキストを表示
    console.log(`"${options[randomIndex].text}" がランダムに選択されました。`);

    saveDropdownData(dropdown);

    return;
}

// 性別のデータを保存する
function saveDropdownData(dropdown) {
    let dataToSave = {
        dropdown: null,
        selectedValue: null
    }

    // ドロップダウンの情報を収集
    if (dropdown) {
        const options = Array.from(dropdown.options).map(option => ({
            value: option.value,
            text: option.innerText,
            selected: option.selected
        }));
        dataToSave.dropdown = options;
        if (dropdown.selectedIndex !== -1) {
            dataToSave.selectedValue = dropdown.options[dropdown.selectedIndex].value;
        }
    }

    // ストレージに保存
    chrome.storage.local.set({ genderData: dataToSave }, function() {
        console.log('Gender data has been saved:', dataToSave);
    });
}

// テキストインプットに規定入力を入力する関数
function fillTextInput(){
    // テキストインプット要素を取得
    const textInputSelector = KEY_WORDS.map(name => `input[type="text"][name*="${name}"]`).join(', ');
    const textInput = document.querySelector(textInputSelector);

    // テキストインプットが存在するか確認
    if (!textInput) {
        console.log('性別のテキストインプットが見つかりませんでした。');
        return;
    }
    // テキストインプットに指定された値を設定
    textInput.value = VALUE_TO_TEXT;

    // 確認のため、コンソールに設定された値を表示
    console.log(`"${textInput.value}" が入力されました。`);

    saveTextInputData(textInput);

    return;
}

// 性別のデータを保存する
function saveTextInputData(textInput) {
    let dataToSave = {
        textInput: null,
        selectedValue: null
    }

    // ドロップダウンの情報を収集
    if (textInput) {
        dataToSave.textInput = {
            value: textInput.value
        };
        if (textInput.value) {
            dataToSave.selectedValue = textInput.value;
        }
    }

    // ストレージに保存
    chrome.storage.local.set({ genderData: dataToSave }, function() {
        console.log('Gender data has been saved:', dataToSave);
    });
}