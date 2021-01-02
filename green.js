let textName = "green.text"
/*************************************/
// 関数
/*************************************/
/************************/
// システム系
function writeText(text) {
    let write = Application.currentApplication();
    write.includeStandardAdditions = true;
    write.doShellScript("echo '" + text + "'>>" + textName);
}
function duplicateCheck(jobNumber) {
    let app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    app.includeStandardAdditions = true;
    try {
        app.doShellScript("ls " + textName);
    } catch (error) {
        app.doShellScript("touch " + textName);
    }
    try {
        let text = app.doShellScript("find " + textName + " -type f | xargs grep '" + jobNumber + "'"); // lsコマンド
        // console.log('すでにある')
        return 1;
    } catch (error) {
        // console.log('まだ追加してない')
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
    let text =
        "\"" + arr.companyName + "\"	" +//
        "\"\"	" +
        "\"" + arr.point + "\"	" +
        "\"" + arr.jobDescription + "\"	" +
        "\"" + arr.target + "\"	" +
        "\"" + arr.workingHours + "\"	" +
        "\"" + arr.workLocation + "\"	" +
        "\"" + arr.salary + "\"	" +
        "\"" + arr.established + "\"	" +
        "\"" + arr.employees + "\"	" +
        "\"" + arr.ave + "\"	" +
        "\"" + arr.jobOfferUrl + "\"	" +//
        "\"" + arr.judgement + "\"	" +//
        "\"" + arr.end + "\"	"
    writeText(text)
}
/************************/
// web系
function clickSource() {
    document.querySelector('.c-entryBtn.p-detail_entry_btn').click()
}
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
    return document.querySelectorAll('.mdl-card__title-text').length
}
function getOccupation() {
    let el = document.querySelectorAll('.mdl-card__title-text')[index]
    let companyName = document.querySelectorAll('.job-card__company-name')[index].innerText.replace(/open_in_new|["\s]/g, "")
    let judgement = el.innerText.replace(/open_in_new|["”*\[\]\s]/g, "")
    return ({
        companyName, judgement
    })

}
function clickDetail() {
    let el = document.querySelectorAll('.mdl-card__title-text')[index]
    el.click()
}
function getCompanyName() {
    let red = document.querySelectorAll('.p-result.p-result-var1.is-biggerlink p-result_company')[index]
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

function green() {
    let data = {
        point: document.querySelectorAll('.com_content__basic-info p')[0].innerText.replace(/["]/g, ""),
        jobDescription: document.querySelectorAll('.com_content__basic-info p')[1].innerText.replace(/["]/g, ""),
    }
    Array.from(document.querySelectorAll('tr')).forEach(i => {
        if (i.children[0].innerText == '応募資格') data.target = i.children[1].innerText.replace(/["]/g, "")
        if (i.children[0].innerText == '勤務時間') data.workingHours = i.children[1].innerText.replace(/["]/g, "")
        if (i.children[0].innerText == '勤務地') data.workLocation = i.children[1].innerText.replace(/["]/g, "")
        if (i.children[0].innerText == '想定年収（給与詳細）') data.salary = i.children[1].innerText.replace(/["]/g, "")
    })
    return data
}
function toBottom() {
    var element = document.documentElement;
    var bottom = element.scrollHeight - element.clientHeight;
    document.querySelector("#js-search-main").scroll(0, 10000000000000)
}
function jobLength() {
    return document.querySelectorAll('.number')[1].innerText
}
function clickComInfo() {
    document.querySelectorAll('.company-info-box__btn-area a')[1].click()
}
function getComInfo() {
    let data = {}
    Array.from(document.querySelectorAll('tr')).forEach(i => {
        if (i.children[0].innerText == '設立年月') data.established = (i.children[1].innerText)
        if (i.children[0].innerText == '従業員数') data.employees = (i.children[1].innerText)
        if (i.children[0].innerText == '平均年齢') data.ave = (i.children[1].innerText)
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
    if (app.windows[i].name().match(/求人検索/)) {
        windowChrome = app.windows[i]
        break;
    }
}
let rm = ['機械学習', 'AI', 'DBエンジニア', 'セールス', 'コンサル', '社内SE', 'マネージャ', 'リーダ', 'CTO','ネットワークエンジニア']
if (windowChrome !== null) {
    let count = 0;
    let allLength = exeJavascript(app, windowChrome.tabs[0], funcToObj(jobLength))
    do {
        // 一番下へ移動
        exeJavascript(app, windowChrome.tabs[0], funcToObj(toBottom))
        // delay(3)
        let jobLength = exeJavascript(app, windowChrome.tabs[0], funcToObj(gg))
        for (let i = 0; i < jobLength; i++) {
            if (i % 10 == 0) {
                // 一番下へ移動
                exeJavascript(app, windowChrome.tabs[0], funcToObj(toBottom))
            }

            jobLength = exeJavascript(app, windowChrome.tabs[0], funcToObj(gg))
            let data = {}
            // 検索一覧画面
            console.log(i + "/", jobLength + '  ' + count + '個追加')
            // 説明を読み込み
            let res = exeJavascript(app, windowChrome.tabs[0], strToObj(getOccupation.toString().replace(/index/g, i)))
            
            if (duplicateCheck(res.judgement) || rm.filter(i => res.judgement.includes(i)).length) {
                // console.log('スキップ')
                continue
            } else {
                // console.log('継続')
                // console.log(res.judgement)
            }
            try {
                // クリック
                exeJavascript(app, windowChrome.tabs[0], strToObj(clickDetail.toString().replace(/index/g, i)))
                //メイン処理
                data = exeJavascript(app, windowChrome.activeTab, funcToObj(green))
                // 企業詳細クリック
                exeJavascript(app, windowChrome.activeTab, funcToObj(clickComInfo))
                data = Object.assign(data, exeJavascript(app, windowChrome.activeTab, funcToObj(getComInfo)))
                //メイン処理終わり
                data.companyName = res.companyName
                data.judgement = res.judgement
                data.jobOfferUrl = windowChrome.activeTab.url()
                write2(data)
                windowChrome.activeTab.close();
                count++;
                // console.log("【" + count + "】個追加")
            } catch (error) {
                windowChrome.activeTab.close();
            }


        }
    } while (allLength > length)


} else {
    console.log('画面が見つからない')
}