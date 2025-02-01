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
// データを保存する関数
function saveToStrage(dataToSave) {
    chrome.storage.local.get(['genderData'], function(result) {
        let genderData = result.genderData || [];  // もしデータがなければ空配列

        // 新しいデータを追加
        genderData.push(dataToSave);

        // ストレージに保存
        chrome.storage.local.set({ genderData: genderData }, function() {
            console.log('Gender data has been saved:', dataToSave);
        });
    });
}

// ラジオボタンをランダム入力する関数
function randomRadio(){
    let dataToSave = {
        url: window.location.href,
        radios: null,
        dropdowns: null,
        textInputs: null,
        selectedValue: null
    };

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

    // ラジオボタンのデータを収集
    dataToSave.radios = Array.from(radios).map(radio => ({
        id: radio.id || null,
        value: radio.value,
        checked: radio.checked
    }));

    dataToSave.selectedValue = radios[randomIndex].value;

    saveToStrage(dataToSave);

    return;
}

// ドロップダウンをランダム入力する関数
function randomDropdown(){
    let dataToSave = {
        url: window.location.href,
        radios: null,
        dropdowns: null,
        textInputs: null,
        selectedValue: null
    };

    // dropdownを探す
    const dropdownSelector = KEY_WORDS.map(name => `select[name*="${name}"]`).join(', ');
    const dropdowns = document.querySelectorAll(dropdownSelector);

    // ドロップダウンメニューが存在するか確認
    if (dropdowns.length === 0) {
        console.log('ドロップダウンメニューはありませんでした');
        return;
    }

    // ランダムに1つ選択
    dropdowns.forEach(dropdown => {
        const options = dropdown.options;
        const randomIndex = Math.floor(Math.random() * options.length);
        dropdown.selectedIndex = randomIndex;
        dataToSave.selectedValue = options[randomIndex].text
        console.log(`"${options[randomIndex].text}" がランダムに選択されました。`);
    });

    // ドロップダウンのデータを収集
    dataToSave.dropdowns = Array.from(dropdowns).map(dropdown => ({
        options: Array.from(dropdown.options).map(option => ({
            value: option.value,
            text: option.innerText,
            selected: option.selected
        }))
    }));

    saveToStrage(dataToSave);

    return;
}

// テキストインプットに規定入力を入力する関数
function fillTextInput(){
    let dataToSave = {
        url: window.location.href,
        radios: null,
        dropdowns: null,
        textInputs: null,
        selectedValue: null
    };

    // テキストインプット要素を取得
    const textInputSelector = KEY_WORDS.map(name => `input[type="text"][name*="${name}"]`).join(', ');
    const textInputs = document.querySelectorAll(textInputSelector);

    // テキストインプットが存在するか確認
    if (textInputs.length === 0) {
        console.log('性別のテキストインプットが見つかりませんでした。');
        return;
    }

    // テキストインプットに指定された値を設定
    textInputs.forEach(textInput => {
        textInput.value = VALUE_TO_TEXT;
        console.log(`"${textInput.value}" が入力されました。`);
        dataToSave.selectedValue = textInput.value
    });

    // テキストインプットのデータを収集
    dataToSave.textInputs = Array.from(textInputs).map(textInput => ({
        value: textInput.value
    }));

    saveToStrage(dataToSave);

    return;
}