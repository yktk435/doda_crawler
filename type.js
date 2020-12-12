let textName = "type.text"
/************************************************************/
// 関数
/************************************************************/

function writeFile(obj) {
    let text = '';
    let write = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    write.includeStandardAdditions = true;
    obj.forEach(i => text += '"' + i.val + '"	')
    try {
        write.doShellScript("echo '" + text + "'>>" + textName);
    } catch (error) {
        console.log('errorが起きた')
        console.log(error)
    }

}

function getJobDesc() {
    let res = '';
    let companyName = document.querySelectorAll('.company.size-14px span')[index].innerText
    let job = document.querySelectorAll(".mod-job-info-item h2 a")[index].innerText.replace(/[*"/[]]/g, "")

    return { companyName, job };
}

function duplicateCheck(search) {
    var app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    app.includeStandardAdditions = true;
    try {
        app.doShellScript("ls " + textName);
    } catch (error) {
        app.doShellScript("touch " + textName);
    }
    try {
        let text = app.doShellScript("find " + textName + " -type f | xargs grep '" + search + "'"); // lsコマンド
        // console.log('すでにある')
        return 1;
    } catch (error) {
        // console.log('まだ追加してない')
        return 0;
    }
}

function nextButton() {

    let nextButton = document.querySelector('.next.active a')
    if (nextButton) {
        nextButton.click()
        return 1;
    }
    else {
        return 0;
    }
}
function exeJavascript(app, tab, code) {
    let res = app.execute(tab, code);
    waitLoading(windowChrome.activeTab)
    return res
}
let getData = function () {

    let reg = /["'']/g;
    let res = {}
    let classData = [
        { name: '所管', cl: '#asdfgghjkl', },
        { name: 'ポイント', cl: '.m_txt.mt20', },
        { name: '募集背景', cl: '.box.clearfix.uq-detail-background ._box_main', },
        { name: '仕事内容', cl: '.box.clearfix.uq-detail-jobdescription ._box_main', },
        { name: 'キャリアパス', cl: '.box.clearfix.uq-detail-pass ._box_main', },
        { name: '応募資格', cl: '.box.clearfix.uq-detail-skill ._box_main', },
        { name: '給与', cl: '.box.clearfix.uq-detail-pay ._box_main', },
        { name: '勤務時間', cl: '.box.clearfix.uq-detail-hour ._box_main', },
        { name: '勤務地', cl: '.box.clearfix.uq-detail-area ._box_main', },
        { name: '休日', cl: '.box.clearfix.uq-detail-holiday ._box_main', },
        { name: '福利厚生', cl: '.box.clearfix.uq-detail-treat ._box_main', },
        { name: '事業内容', cl: '.clearfix.uq-detail-business_description dd', },
        { name: '設立', cl: '.uq-detail-establishment dd', },
        { name: '従業員数', cl: '.uq-detail-employee dd', },
        { name: '資本金', cl: '.uq-detail-capital dd', },
        { name: '売上高', cl: '.uq-detail-sold dd', },
        { name: '代表者', cl: '.uq-detail-amount_sold dd', },
        { name: '平均年齢', cl: '#company_profile_table tr', },
        { name: '掲載開始日', cl: '.ico_end', },
        { name: '締め切り', cl: '.ico_end', },
    ]
    res = classData.map(i => {
        if (document.querySelector(i.cl)) {
            if (i.name == '締め切り') {
                i.val = document.querySelector(i.cl).innerText.match(/\d+\.\d+\.\d+/g)[1]
            } else if (i.name == '掲載開始日') {
                i.val = document.querySelector(i.cl).innerText.match(/\d+\.\d+\.\d+/g)[0]
            } else {
                i.val = document.querySelector(i.cl).innerText.replace(reg, " ")
            }
            return i

        } else {
            return i.name
        }
    })
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


let gg = function () {
    return document.querySelectorAll('.mod-job-info-item h2 a').length
}
let kyujinClick = function () {
    let detail = document.querySelectorAll('.js-equal-heights a')
    if (detail) detail[0].click()
}
let companyClick = function () {
    let url = document.querySelectorAll('.mod-job-info-item h2 a')[index].href
    window.open(url)

}
// システム系
const getTab = function (app) {
    let window = null, searchTab = null, clickTab = null, tab = null
    for (let i = 0; i < app.windows.length; i++) {
        for (let j = 0; j < app.windows[i].tabs.length; j++) {
            if (app.windows[i].tabs[j].title().match(/type/)) {
                window = app.windows[i]
                searchTab = app.windows[i].tabs[j]
                if (app.windows[i].tabs.length != j + 1) clickTab = app.windows[i].tabs[j + 1]
                break;
            } else {
                clickTab = searchTab
            }
        }
    }
    return ({ window, searchTab, clickTab })
}

/************************************************************/
// メイン
/************************************************************/

// firstWrite()

let app = Application("Google Chrome");
app.includeStandardAdditions = true;

let windowChrome = null,
    tab = null;

for (let i = 0; i < app.windows.length; i++) {
    if (app.windows[i].name().match(/転職ならtype/)) {
        windowChrome = app.windows[i]
        break;
    }
}
if (windowChrome !== null) {
    let count = 0;

    do {
        // 要素数取得(会社の数だけ)

        let companies = app.execute(windowChrome.tabs[0], funcToObj(gg));
        let info = []
        for (let i = 0; i < companies; i++) {
            let tempInfo = []
            // console.log('')
            console.log(i + "番目")
            let str = getJobDesc.toString().replace(/index/g, i)
            let jobDesc = exeJavascript(app, windowChrome.tabs[0], strToObj(str));

            if (duplicateCheck(jobDesc.job)) {
                // console.log('スキップ')
                continue
            } else {
                // console.log('継続')
            }



            str = companyClick.toString().replace(/index/g, i)
            // i番目の会社をクリック
            let as = exeJavascript(app, windowChrome.tabs[0], strToObj(str));
            // str = getCompName.toString()



            // 求人詳詳細をクリック
            let res = exeJavascript(app, windowChrome.activeTab, funcToObj(kyujinClick));
            let data = exeJavascript(app, windowChrome.activeTab, funcToObj(getData))

            // let compData = exeJavascript(app, windowChrome.activeTab, funcToObj(getCompanyProfile))
            //     ? exeJavascript(app, windowChrome.activeTab, funcToObj(getCompanyProfile))
            //     : {}
            tempInfo = tempInfo.concat([{ name: '会社名', val: jobDesc.companyName }])
            tempInfo = tempInfo.concat(data)
            tempInfo = tempInfo.concat([{ name: '判定文字', val: jobDesc.job }])
            tempInfo = tempInfo.concat({ name: '求人URL', val: windowChrome.activeTab.url() })
            let undefinedCount = 0
            tempInfo.forEach(i => {
                if (i.val === undefined) undefinedCount++
            })
            if (undefinedCount < 7) writeFile(tempInfo)

            windowChrome.activeTab.close()
            // info.push(tempInfo)
            count++;
            console.log(count + "個追加")
        }

    } while (exeJavascript(app, windowChrome.tabs[0], funcToObj(nextButton)))

} else {
    console.log('画面が見当たらない')
}
