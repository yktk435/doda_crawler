const TEXTNAME = "wantedly.text"
/************************************************************/
// 関数
/************************************************************/

function writeFile(obj) {
    let text = '';
    let write = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    write.includeStandardAdditions = true;
    obj.forEach(i => text += '"' + i.val + '"	')
    try {
        write.doShellScript("echo '" + text + "'>>" + TEXTNAME);
    } catch (error) {
        console.log('errorが起きた')
        console.log(error)
    }

}

function getJobDesc() {
    let res = '';
    let all = Array.from(document.querySelectorAll('article'))
    let chose = all.filter(i => {
        if (i.className.match(/projects/)) return i
    })
    let job = chose[index].querySelector('.project-title').innerText
    let companyName = chose[index].querySelector('.company-name a').innerText.replace(/[*"/[]]/g, "")
    return { companyName, job };
}

function duplicateCheck(search) {
    var app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    app.includeStandardAdditions = true;
    try {
        app.doShellScript("ls " + TEXTNAME);
    } catch (error) {
        app.doShellScript("touch " + TEXTNAME);
    }
    try {
        let text = app.doShellScript("find " + TEXTNAME + " -type f | xargs grep '" + search + "'"); // lsコマンド
        // console.log('すでにある')
        return 1;
    } catch (error) {
        // console.log('まだ追加してない')
        return 0;
    }
}

function nextButton() {

    let nextButton = document.querySelector(".next a")
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
    let a = document.querySelectorAll('.company-info-list .company-description')
    a = Array.from(a)
    let es,http,address,member
    try {
        es = a.find(i => i.innerText.match(/設立/)).innerText.replace(/に設立/,'')
        http = a.find(i => i.innerText.match(/http/)).innerText
        address = a.find(i => i.innerText.match(/都|道|府|県/)).innerText
        member = a.find(i => i.innerText.match(/メンバー/)).innerText.replace(/人のメンバー/,'')
    } catch (error) {

    }

    let reg = /["'*]/g;
    let classData = [
        { name: '所管', cl: '#asdfgghjkl', val: '' },
        { name: 'なにをやっているのか', val: document.querySelectorAll('.js-descriptions  .project-show-main-section.new-style')[0].innerText.replace(reg, "") },
        { name: 'なぜやるのか', val: document.querySelectorAll('.js-descriptions  .project-show-main-section.new-style')[1].innerText.replace(reg, "") },
        { name: 'どうやっているのか', val: document.querySelectorAll('.js-descriptions  .project-show-main-section.new-style')[2].innerText.replace(reg, "") },
        { name: 'こんなことやります', val: document.querySelectorAll('.js-descriptions  .project-show-main-section.new-style')[3].innerText.replace(reg, "") },
        { name: '企業ページ', val: http },
        { name: '設立', val: es },
        { name: 'メンバー', val: member },
        { name: '住所', val: address },
    ]
    return classData
}
try {

} catch (error) {

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
    let r = document.querySelectorAll('.projects-index-single').length
    return r
}
let kyujinClick = function () {

    let detail = document.querySelectorAll('#shStart > ul.switch_display.clrFix > li:nth-child(2) > a')

    if (detail) detail[0].click()
}
let companyClick = function () {
    let all = Array.from(document.querySelectorAll('article'))
    let chose = all.filter(i => {
        if (i.className.match(/projects/)) return i
    })
    let url = chose[index].querySelector('.project-title a').href
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
    if (app.windows[i].name().match(/Wantedly/)) {
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
            // let res = exeJavascript(app, windowChrome.activeTab, funcToObj(kyujinClick));
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
            if (undefinedCount < 7) { writeFile(tempInfo) }
            else {
                console.log(undefinedCount)
                console.log('書き込みなし')
            }

            windowChrome.activeTab.close()
            // info.push(tempInfo)
            count++;
            console.log(count + "個追加")
        }

    } while (exeJavascript(app, windowChrome.tabs[0], funcToObj(nextButton)))

} else {
    console.log('画面が見当たらない')
}
