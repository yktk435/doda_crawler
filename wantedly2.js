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
    let all = Array.from(document.querySelectorAll('article'))
    let chose = all.filter(i => {
        if (i.className.match(/projects/)) return i
    })
    let jobs = chose.map(i => {
        console.log(i.querySelector('.project-title').innerText)
        return i.querySelector('.project-title').innerText
    })
    let companyNames = chose.map(i => {
        console.log(i.querySelector('.company-name a').innerText)
        return i.querySelector('.company-name a').innerText.replace(/[*"/[]]/g, "")
    })
    let hrefs = chose.map(i => {
        console.log(i.querySelector('.project-title a').href)
        return i.querySelector('.project-title a').href
    })
    return { companyNames, jobs, hrefs };
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
function getCurrentCount(){
return document.querySelector('.current').innerText
}
function exeJavascript(app, tab, code) {
    let res = app.execute(tab, code);
    waitLoading(windowChrome.activeTab)
    return res
}
let getData = function () {
    let reg = /["'*]/g;
    let a = document.querySelectorAll('.company-info-list .company-description')
    a = Array.from(a)
    let es, http, address, member
    try {
        es = a.find(i => i.innerText.match(/設立/)).innerText.replace(/に設立/, '')
        http = a.find(i => i.innerText.match(/http/)).innerText
        address = a.find(i => i.innerText.match(/都|道|府|県/)).innerText
        member = a.find(i => i.innerText.match(/メンバー/)).innerText.replace(/人のメンバー/, '')
    } catch (error) {

    }
    let what, why, how, exam
    a = Array.from(document.querySelectorAll('.js-descriptions  .project-show-main-section.new-style'))
    what = a.filter(i => i.innerText.match(/^なにをやっているのか/)).length ? a.filter(i => i.innerText.match(/^なにをやっているのか/))[0].innerText.replace(reg, '') : undefined
    why = a.filter(i => i.innerText.match(/^なぜやるのか/)).length ? a.filter(i => i.innerText.match(/^なぜやるのか/))[0].innerText.replace(reg, '') : undefined
    how = a.filter(i => i.innerText.match(/^どうやっているのか/)).length ? a.filter(i => i.innerText.match(/^どうやっているのか/))[0].innerText.replace(reg, '') : undefined
    exam = a.filter(i => i.innerText.match(/^こんなことやります/)).length ? a.filter(i => i.innerText.match(/^こんなことやります/))[0].innerText.replace(reg, '') : undefined


    let classData = [
        { name: '所管', cl: '#asdfgghjkl', val: '' },
        { name: 'なにをやっているのか', val: what },
        { name: 'なぜやるのか', val: why },
        { name: 'どうやっているのか', val: how },
        { name: 'こんなことやります', val: exam },
        { name: '企業ページ', val: http },
        { name: '設立', val: es },
        { name: 'メンバー', val: member },
        { name: '住所', val: address },
    ]
    console.log(classData)
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
        let info = exeJavascript(app, windowChrome.tabs[0], funcToObj(getJobDesc))
        console.log('a')
        let addArr = info.jobs.map((i, index) => {
            if (duplicateCheck(i)) {
                console.log('スキップ')
            } else {
                console.log('継続')

                return index
            }
        })
        let tabCount=3
        addArr.forEach((i, index) => {
            //五つ以上タブを開いているなら
            if (windowChrome.tabs().length >= tabCount) {
                while (windowChrome.tabs().length <= tabCount) {
                    for (let j = 0; j<tabCount; j++) {
                        
                        if (windowChrome.tabs().length < j+1) j = 1
                        if (!windowChrome.tabs[j].loading()) {
                            console.log('読み込み完了')
                            windowChrome.tabs[j].close()
                            break;
                        }    
                    }
                    
                }
            } else {
                //タブを開く
                let str = companyClick.toString().replace(/index/g, i)
                app.execute(windowChrome.tabs[0], strToObj(str))
            }
        })
        


    } while (exeJavascript(app, windowChrome.tabs[0], funcToObj(nextButton)))

} else {
    console.log('画面が見当たらない')
}
