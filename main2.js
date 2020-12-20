const TEXTNAME = "new2.text"
// const TEXTNAME = "remove.text"
//検索画面に表示されている会社名を取得するセレクタ
const COMPANY_NAME_SELECTOR = '.company.width688'
const COMPANY_COUNT_SELECTOR = '.company.width688'
// 少子をクリックするセレクタ
const DETAIL_SELECTOR = '#shStart > ul.switch_display.clrFix > li:nth-child(2) > a'
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
    let companyName = document.querySelectorAll('.company.width688')[index].innerText.replace(/NEW/,'')
    let job = document.querySelectorAll(".job.width688")[index].innerText.replace(/[/／.*]/g, '')
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

    let nextButton = document.querySelector(".btn_r.last").firstElementChild
    if (nextButton.href) {
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
        { name: 'ポイント', cl: '#job_description_table tr', },
        { name: '募集背景', cl: '#job_description_table tr', },
        { name: '仕事内容', cl: '#job_description_table tr', },
        { name: 'キャリアパス', cl: '#job_description_table tr', },
        { name: '対象となる方', cl: '#job_description_table tr', },
        { name: '給与', cl: '#job_description_table tr', },
        { name: '勤務時間', cl: '#job_description_table tr', },
        { name: '勤務地', cl: '#job_description_table tr', },
        { name: '休日・休暇', cl: '#job_description_table tr', },
        { name: '待遇・福利厚生', cl: '#job_description_table tr', },
        { name: '事業概要', cl: '#company_profile_table tr', },
        { name: '設立', cl: '#company_profile_table tr', },
        { name: '従業員数', cl: '#company_profile_table tr', },
        { name: '資本金', cl: '#company_profile_table tr', },
        { name: '売上高', cl: '#company_profile_table tr', },
        { name: '代表者', cl: '#company_profile_table tr', },
        { name: '平均年齢', cl: '#company_profile_table tr', },
        { name: '掲載開始日', cl: '.meta_text', },
        { name: '締め切り', cl: '.meta_text', },
    ]
    let a = document.querySelectorAll("#job_description_table tr")
    a = Array.from(a)
    // res = a.map(i => {
    //     return classData.find(j => j.name == i.children[0].innerText)
    // })
    res = classData.map(i => {
        let a = Array.from(document.querySelectorAll(i.cl))
        a.find(j => {
            if (i.name == '締め切り') {
                i.val = document.querySelector(i.cl).innerText.match(/\d+\/\d+\/\d+/g)[1]
            } else if (i.name == '掲載開始日') {
                i.val = document.querySelector(i.cl).innerText.match(/\d+\/\d+\/\d+/g)[0]
            }else if (i.name == j.children[0].innerText) {
                i.val = j.children[1].innerText.replace(reg, "")
            }
        })
        return i

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

let getCounter = function () {
    let number = document.querySelector('.number').innerText.replace(/,/, '')
    let counter=document.querySelector('.counter').innerText.match(/件中\s(\d+)/)[1]
    return ({number,counter})
}
let gg = function () {
    let r = document.querySelectorAll('.company.width688').length
    return r 
}
let kyujinClick = function () {
    
    let detail = document.querySelectorAll('#shStart > ul.switch_display.clrFix > li:nth-child(2) > a')
    
    if (detail) detail[0].click()
}
let companyClick = function () {
    let url = document.querySelectorAll('.company.width688')[index]
    if(url)url.click()
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
    // console.log(app.windows[i].name())
    if (app.windows[i].name().match(/^(?=.*転職)(?=.*doda)|https:\/\/doda\.jp.*$/)) {
        windowChrome = app.windows[i]
        break;
    }
}
let rm = ['機械学習', 'AI', 'DBエンジニア', 'セールス', 'コンサル', '社内SE', 'マネージャ', 'リーダ', 'CTO','インフラエンジニア','EC']
if (windowChrome !== null) {
    let count = 0;

    do {
        // 要素数取得(会社の数だけ)
        
        let companies = app.execute(windowChrome.tabs[0], funcToObj(gg));
        // console.log(companies)
        let info = []
        for (let i = 0; i < companies; i++) {
            let counter=exeJavascript(app, windowChrome.tabs[0], funcToObj(getCounter));
            let tempInfo = []
            // console.log('')
            console.log(Number(counter.counter)+i + "/"+counter.number+'  '+count+'個追加')
            let str = getJobDesc.toString().replace(/index/g, i)
            let jobDesc = exeJavascript(app, windowChrome.tabs[0], strToObj(str));

            if (duplicateCheck(jobDesc.job) || rm.filter(i => jobDesc.job.includes(i)).length) {
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
            // else console.log(tempInfo[0].val)

            windowChrome.activeTab.close()
            // info.push(tempInfo)
            count++;
            // console.log(count + "個追加")
        }

    } while (exeJavascript(app, windowChrome.tabs[0], funcToObj(nextButton)))

} else {
    console.log('画面が見当たらない')
}
