/*************************************/
// 関数
/*************************************/
/************************/
// システム系
function writeText(text) {
    let write = Application.currentApplication();
    write.includeStandardAdditions = true;
    write.doShellScript("echo '" + text + "'>>hello.text");
}
function duplicateCheck(jobNumber) {
    var app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    app.includeStandardAdditions = true;
    try {
        let text = app.doShellScript("find hello.text -type f | xargs grep '" + jobNumber + "'"); // lsコマンド
        console.log('すでにある')
        return 1;
    } catch (error) {
        console.log('まだ追加してない')
        return 0;
    }
}
function funcToObj(func) {
    return ({
        javascript: "(" + func.toString() + ")();"
    })
}

function strToObj(str) {
    return ({
        javascript: "(" + str + ")();"
    })
}
function exeJavascript(app, tab, code) {
    let res = app.execute(tab, code);
    waitLoading(windowChrome.activeTab)
    return res
}
const waitLoading = function (tab) {
    while (windowChrome.activeTab.loading()) {
        delay(0.5);
        if (!tab.loading()) {
            break;
        }
    }
}
function write2(arr) {
    const item = [
        '求人番号',
        '受付年月日',
        '紹介期限日',
        '受理安定所',
        '求人区分',
        'トライアル雇用併用の希望',
        '事業所番号',
        '事業所名',
        '所在地',
        'ホームページ',
        '職種',
        '仕事内容',
        '雇用形態',
        '派遣・請負等',
        '雇用期間',
        '就業場所',
        'マイカー通勤',
        '転勤の可能性',
        '年齢',
        '学歴',
        '必要な経験等',
        '必要な免許・資格',
        '試用期間',
        'ａ ＋ ｂ（固定残業代がある場合はａ ＋ ｂ ＋ ｃ）',
        '基本給（ａ）',
        '定額的に支払われる手当（ｂ）',
        '固定残業代（ｃ）',
        'その他の手当等付記事項（ｄ）',
        '月平均労働日数',
        '賃金形態等',
        '通勤手当',
        '賃金締切日',
        '賃金支払日',
        '昇給',
        '賞与',
        '就業時間',
        '時間外労働時間',
        '休憩時間',
        '年間休日数',
        '休日等',
        '加入保険等',
        '退職金共済',
        '退職金制度',
        '定年制',
        '再雇用制度',
        '勤務延長',
        '入居可能住宅',
        '利用可能託児施設',
        '従業員数',
        '設立年',
        '資本金',
        '労働組合',
        '事業内容',
        '会社の特長',
        '役職／代表者名',
        '法人番号',
        '就業規則',
        '育児休業取得実績',
        '介護休業取得実績',
        '看護休暇取得実績',
        '外国人雇用実績',
        '採用人数',
        '選考方法',
        '選考結果通知',
        '求職者への通知方法',
        '選考日時等',
        '選考場所',
        '応募書類等',
        '応募書類の返戻',
        '選考に関する特記事項',
        '担当者',
        '求人に関する特記事項',
        '事業所からのメッセージ',
        '主要取引先',
        '職務給制度',
        '復職制度',
        '福利厚生の内容',
        '研修制度',
        'エレベーター',
        '階段の手すり',
        'バリアフリー対応トイレ',
        '建物内の車いす移動',
    ]
    let text = ""
    let label=0;
    for (let i = 0; i < item.length; i++) {
        
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].th == item[i]) {
                text += "\"" + arr[j].td + "\"	"
                label=1
                break;
            }
        }
        if (label == 0) text += "\"記載なし\"	"
        label=0
    }
    writeText(text)

}
/************************/
// web系
function nextButton() {
    let nextButton = document.querySelector("input[value='次へ＞']")
    if (!nextButton.disabled) {
        nextButton.click()
        return 1;
    }
    else {
        return 0;
    }
}

let gg = function () {
    return document.querySelectorAll("#ID_dispDetailBtn").length;
}
function getOccupation() {
    return document.querySelectorAll(".m13.fs1 div")[index].innerText
}
function clickDetail() {
    document.querySelectorAll("#ID_dispDetailBtn")[index].click()
}

function getLen() {
    return document.querySelectorAll("th").length
}
function getThTd() {

    let a = document.querySelectorAll("th")
    let th = a[index].innerText.replace(/\n/g, "")
    let td = a[index].parentNode.children[1].innerText.replace(/"/g, "")
    td = '"' + td + '"'
    return ({ th, td })
}
function getAllData() {
    let a = document.querySelectorAll("th")
    a = Array.from(a)
    let data = a.map(i => {
        return ({
            th: i.innerText.replace(/\n/g, ""),
            td: i.parentNode.children[1].innerText.replace(/"/g, " ")
        })
    })
    return data

}
/*************************************/
// メイン
/*************************************/

let app = Application("Google Chrome");
app.includeStandardAdditions = true;

let windowChrome = null,
    tab = null;

for (let i = 0; i < app.windows.length; i++) {
    if (app.windows[i].name().match(/求人情報検索・一覧/)) {
        windowChrome = app.windows[i]
        break;
    }
}

if (windowChrome !== null) {
    do {
        let jobLength = exeJavascript(app, windowChrome.tabs[0], funcToObj(gg))
        for (let i = 0; i < jobLength; i++) {
            // 検索一覧画面
            console.log(i + "番目")
            let occuPation = exeJavascript(app, windowChrome.tabs[0], strToObj(getOccupation.toString().replace(/index/, i)))
            if (duplicateCheck(occuPation)) {
                console.log('スキップ')
                continue
            } else {
                console.log('継続')
            }
            // 詳細をクリック
            exeJavascript(app, windowChrome.tabs[0], strToObj(clickDetail.toString().replace(/index/, i)))
            // 詳細画面
            // let length = exeJavascript(app, windowChrome.activeTab, funcToObj(getLen))
            let allData = exeJavascript(app, windowChrome.activeTab, funcToObj(getAllData))
            write2(allData)
            // let text = ''
            // // let lll =''
            // for (let j = 0; j < length; j++) {

            //     let res = exeJavascript(app, windowChrome.activeTab, strToObj(getThTd.toString().replace(/index/g, j)))
            //     if (res.th.match(/ＰＲロゴマーク/)) {
            //         console.log(console.log(res.th))
            //         continue;
            //     }

            //     text += res.td + "	"
            //     // lll+=res.th+"	"
            // }
            // writeText(text)
            // writeText(lll)
            windowChrome.activeTab.close();
        }
    } while (exeJavascript(app, windowChrome.tabs[0], funcToObj(nextButton)))


} else {
    console.log('画面が見つからない')
}