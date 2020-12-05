let textName = "box.text"
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
    let text =
        "\"" + arr.companyName + "\"	" +
        "\"" + arr.point + "\"	" +
        "\"" + arr.jobDescription + "\"	" +
        "\"" + arr.target + "\"	" +
        "\"" + arr.workingHours + "\"	" +
        "\"" + arr.workLocation + "\"	" +
        "\"" + arr.salary + "\"	" +
        "\"" + arr.established + "\"	" +
        "\"" + arr.jobOfferUrl + "\"	" +
        "\"" + arr.judgement + "\"	" +
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
    return document.querySelectorAll('.p-result.p-result-var1.is-biggerlink').length
}
function getOccupation() {
    let el = document.querySelectorAll('.p-result_company')[index]
    let companyName = el.innerHTML
    let judgement = el.previousElementSibling.innerText
    return ({
        companyName, judgement
    })

}
function clickDetail() {
    let el = document.querySelectorAll('.p-result_company')[index]
    el.previousElementSibling.click()
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
function test() {
    alert('a')
}

// 求人ボックス
// type
function typeJp() {
    let reg = /["'']/g
    return ({
        point: document.querySelectorAll('.m_txt.mt20')[0].innerText.replace(reg, "") + "\n" + document.querySelector('.box.clearfix.uq-detail-background').innerText.replace(reg, ""),
        jobDescription: document.querySelector('.box.clearfix.uq-detail-jobdescription').innerText.replace(reg, ""),
        target: document.querySelector('.box.clearfix.uq-detail-skill').innerText.replace(reg, ""),
        workingHours: document.querySelector('.box.clearfix.uq-detail-hour').innerText.replace(reg, ""),
        workLocation: document.querySelector('.box.clearfix.uq-detail-area').innerText.replace(reg, ""),
        salary: document.querySelector('.box.clearfix.uq-detail-pay').innerText.replace(reg, ""),
        established: document.querySelector('.uq-detail-establishment').innerText.replace(reg, ""),
        end: document.querySelector('.ico_end').innerText.match(/(\d+\.\d+\.\d+)$/)[0].replace(reg, ""),
    })
}
// マイナビ
function mynavi() {
    let tr = Array.from(document.querySelectorAll('.jobOfferTable tr'))
    let workingHours = '', workLocation = '', salary = '', established = '', end = '';
    tr.forEach(i => {
        if (i.children[0].innerText == '勤務時間') workingHours = i.children[1].innerText.replace(reg, "")
        if (i.children[0].innerText == '勤務地') workLocation = i.children[1].innerText.replace(reg, "")
        if (i.children[0].innerText == '給与') salary = i.children[1].innerText.replace(reg, "")
        if (i.children[0].innerText == '設立') established = i.children[1].innerText.replace(reg, "")
    })
    let reg = /["'']/g

    return ({
        point: document.querySelector('div.jobPointArea__body-prItem').innerText.replace(reg, ""),
        jobDescription: document.querySelector('.jobPointArea__wrap-jobDescription').innerText.replace(reg, ""),
        target: document.querySelector('.jobPointArea__body--large').innerText.replace(reg, ""),
        workingHours, workLocation, salary, established,
        end: document.querySelectorAll('.dateInfo')[0].innerText.match(/掲載終了予定日：(\d+\/\d+\/\d+)/)[1],
    })
}
function mynaviAgentsearch() {
    let t = Array.from(document.querySelectorAll(".column-2-right dl"))
    let companyName = document.querySelector('.title li').innerText
    let jobDescription, target, salary, workingHours, workLocation, point, established, end = document.querySelector('.second').innerText.match(/(\d+\.\d+\.\d+)/)[0]
    t.forEach(i => {
        console.log(i.children[0].innerText)
        if (i.children[0].innerText == '仕事内容') jobDescription = i.children[1].innerText
        if (i.children[0].innerText == '求める人材') target = i.children[1].innerText
        if (i.children[0].innerText == '給与') salary = i.children[1].innerText
        if (i.children[0].innerText == '設立') established = i.children[1].innerText
        if (i.children[0].innerText == '募集背景') point = i.children[1].innerText
        if (i.children[0].innerText == '勤務時間') workingHours = i.children[1].innerText
        if (i.children[0].innerText == '勤務地') workLocation = i.children[1].innerText
    })
    let g = { companyName, jobDescription, target, salary, workingHours, workLocation, point, established, end }
    return g
}

/*************************************/
// メイン
/*************************************/

let app = Application("Google Chrome");
app.includeStandardAdditions = true;

let windowChrome = null,
    tab = null;

for (let i = 0; i < app.windows.length; i++) {
    if (app.windows[i].name().match(/求人ボックス/)) {
        windowChrome = app.windows[i]
        break;
    }
}

if (windowChrome !== null) {
    let count = 0;

    do {
        let jobLength = exeJavascript(app, windowChrome.tabs[0], funcToObj(gg))
        for (let i = 0; i < jobLength; i++) {
            let data = {}
            // 検索一覧画面
            console.log(i + "番目")
            // 説明を読み込み
            let res = exeJavascript(app, windowChrome.tabs[0], strToObj(getOccupation.toString().replace(/index/, i)))
            if (duplicateCheck(res.judgement)) {
                console.log('スキップ')
                continue
            } else {
                console.log('継続')
            }

            // クリック
            exeJavascript(app, windowChrome.tabs[0], strToObj(clickDetail.toString().replace(/index/, i)))
            //メイン処理
            let url = windowChrome.activeTab.url()

            if (url.includes('green')) {
                windowChrome.activeTab.close();
                continue
            }
            else if (url.includes('find-job')) {
                windowChrome.activeTab.close();
                continue
            }
            else if (url.includes('xn--pckua2a7gp15o89zb.com')) {
                // 掲載元をクリック
                exeJavascript(app, windowChrome.activeTab, funcToObj(clickSource))
                url = windowChrome.activeTab.url()
                if (url.match(/mynavi\.agentsearch\.jp/)) {
                    data = Object.assign(data, exeJavascript(app, windowChrome.activeTab, funcToObj(mynaviAgentsearch)))
                } else if (url.match(/mynavi\.agentsearch\.jp/)) { 
                    data = Object.assign(data, exeJavascript(app, windowChrome.activeTab, funcToObj(mynavi)))
                }

                continue
            } else if (url.includes('type.jp')) {
                data = Object.assign(data, exeJavascript(app, windowChrome.activeTab, funcToObj(typeJp)))
            } else {
                windowChrome.activeTab.close();
                continue
            }
            if (data.jobDescription !== undefined) {// 会社名を追加
                data.companyName = res.companyName
                // 求人のURLを追加
                data.jobOfferUrl = windowChrome.activeTab.url()
                // 判定を追加
                data.judgement = res.judgement

                write2(data)
            }
            //メイン処理終わり
            windowChrome.activeTab.close();
            count++;
            console.log("【" + count + "】個追加")
        }
    } while (exeJavascript(app, windowChrome.tabs[0], funcToObj(nextButton)))


} else {
    console.log('画面が見つからない')
}