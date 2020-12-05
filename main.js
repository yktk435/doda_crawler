let textName="new.text"
/************************************************************/
// 関数
/************************************************************/
function firstWrite() {
    let text = "会社名	" +
        "仕事内容	" +
        "対象となる方	" +
        "選考のポイント	" +
        "勤務地	" +
        "勤務時間	" +
        "雇用形態	" +
        "給与	" +
        "待遇・福利厚生	" +
        "休日・休暇	" +
        "事業概要	" +
        "住所	" +
        "設立	" +
        "代表者	" +
        "従業員数	" +
        "資本	" +
        "上場市場名	" +
        "平均年齢	" +
        "企業URL	" +
        "求人URL	" +
        "Job	" +
        "締切日	"
    let write = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    write.includeStandardAdditions = true;
    try {
        write.doShellScript("ls " + textName);    
    } catch (error) {
        write.doShellScript("touch " + textName);    
    }
    
    write.doShellScript("echo '" + text + "'>>"+textName);
}
function writeFile(obj) {
    let text = '' + obj.name +
        '	"' + obj.jobDescription +
        '"	"' + obj.targetPerson +
        '"	"' + obj.selectionPoints +
        '"	"' + obj.workLocation +
        '"	"' + obj.workingHours +
        '"	"' + obj.employmentStatus +
        '"	"' + obj.salary +
        '"	"' + obj.welfare +
        '"	"' + obj.holiday +
        '"	"' + obj.businessSummary +
        '"	"' + obj.address +
        '"	"' + obj.established +
        '"	"' + obj.represenTative +
        '"	"' + obj.numberOfEmployees +
        '"	"' + obj.capital +
        '"	"' + obj.listedMarketName +
        '"	"' + obj.aveAge +
        '"	"' + obj.companyUrl +
        '"	"' + obj.url +
        '"	"' + obj.job +
        '"	"' + obj.start +
        '"	' + obj.dedline +
        ''
    let write = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    write.includeStandardAdditions = true;
    try {
        write.doShellScript("echo '" + text + "'>>"+textName);    
    } catch (error) {
        console.log('errorが起きた')
        console.log(error)
    }
    
}
function getCompName() {
    let str = document.querySelector("#wrapper > div.head_detail > div > div > h1").innerText.replace(/\n.*/, "");
    str = str.replace(/\n/g, "");
    return str;
}

function getJobDesc() {
    let res = '';
    let a = document.querySelectorAll(".job.width688")[index].textContent
    return a;
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
        let text = app.doShellScript("find "+textName+" -type f | xargs grep '" + search + "'"); // lsコマンド
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
let getDeadline = function () {
    let day = document.querySelector(".meta_text").innerText.match(/(\d+\/\d+\/\d+.*)～(\d+\/\d+\/\d+.*)/)
    let start = day[1]
    let dedline=day[2]
    return ({start,dedline})
}
let getData = function () {
    let a = document.querySelectorAll("#job_description_table tr").length == 0
        ? Array.from(document.querySelectorAll(".tblDetail01.tblThDetail tr"))
        : Array.from(document.querySelectorAll("#job_description_table tr"))
        let reg=/["'']/g
    let tempInfo = {};
    let str = document.querySelector("#wrapper > div.head_detail > div > div > h1").innerText.replace(/\n.*/, "");
    str = str.replace(/\n/g, "");
    tempInfo.name = str;
    a.forEach(i => {
        switch (i.children[0].innerText) {
            case '仕事内容':
                tempInfo.jobDescription = i.children[1].innerText.replace(reg, " ")
                break;
            case '対象となる方':
                tempInfo.targetPerson = i.children[1].innerText.replace(reg, " ")
                break;
            case '選考のポイント':
                tempInfo.selectionPoints = i.children[1].innerText.replace(reg, " ")
                break;
            case '勤務地':
                tempInfo.workLocation = i.children[1].innerText.replace(reg, " ")
                break;
            case '勤務時間':
                tempInfo.workingHours = i.children[1].innerText.replace(reg, " ")
                break;
            case '雇用形態':
                tempInfo.employmentStatus = i.children[1].innerText.replace(reg, " ")
                break;
            case '給与':
                tempInfo.salary = i.children[1].innerText.replace(reg, " ")
                break;
            case '待遇・福利厚生':
                tempInfo.welfare = i.children[1].innerText.replace(reg, " ")
                break;
            case '休日・休暇':
                tempInfo.holiday = i.children[1].innerText.replace(reg, " ")
                break;
            default:
                break;
        }
    })
    return tempInfo
}
const getCompanyProfile = function () {
    let a = document.querySelectorAll("#company_profile_table tr").length == 0
        ? Array.from(document.querySelectorAll(".modDetail04 dl"))
        : Array.from(document.querySelectorAll("#company_profile_table tr"))
    let tempInfo = {}
    let reg=/["'/]/g
    a.forEach(i => {
        switch (i.children[0].innerText) {
            case '事業概要':
                tempInfo.businessSummary = i.children[1].innerText.replace(reg, " ")
                break;
            case '所在地':
                tempInfo.address = i.children[1].innerText.replace(reg, " ")
                break;
            case '設立':
                tempInfo.established = i.children[1].innerText.replace(reg, " ")
                break;
            case '代表者':
                tempInfo.represenTative = i.children[1].innerText.replace(reg, " ")
                break;
            case '従業員数':
                tempInfo.numberOfEmployees = i.children[1].innerText.replace(reg, " ")
                break;
            case '上場市場名':
                tempInfo.listedMarketName = i.children[1].innerText.replace(reg, " ")
                break;
            case '資本金':
                tempInfo.capital = i.children[1].innerText.replace(reg, " ")
                break;
            case '平均年齢':
                tempInfo.aveAge = i.children[1].innerText.replace(reg, " ")
                break;
            case '企業url':
                tempInfo.companyUrl = i.children[1].innerText.replace(reg, " ")
                break;
            default:
                break;
        }
    })
    return tempInfo

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
    let a = document.querySelectorAll('.company.width688')
    a = Array.from(a)
    let arr = a.map((num, index) => index)
    return arr;
}
let kyujinClick = function () {
    let detail = document.querySelector("#shStart > ul.switch_display.clrFix > li:nth-child(2) > a")
    if (detail) detail.click()
}
let companyClick = function () {
    document.querySelectorAll('.company.width688')[index].click()
}
// システム系
const getTab = function (app) {
    let window = null, searchTab = null, clickTab = null,tab=null
    for (let i = 0; i < app.windows.length; i++) {
        for (let j = 0; j < app.windows[i].tabs.length; j++) {
            if (app.windows[i].tabs[j].title().match(/転職・求人情報- doda/)) {
                window = app.windows[i]
                searchTab = app.windows[i].tabs[j]
                if (app.windows[i].tabs.length != j + 1) clickTab = app.windows[i].tabs[j + 1]
                break;
            }else {
                clickTab=searchTab
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
    if (app.windows[i].name().match(/(転職・求人情報- doda)|(doda\.jp)/)) {
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
        for (let i = 0; i < companies.length; i++) {
            let tempInfo = {}
            // console.log('')
            // console.log(i + "番目")
            let str = getJobDesc.toString().replace(/index/g, i)
            let jobDesc = exeJavascript(app, windowChrome.tabs[0], strToObj(str));
            if (duplicateCheck(jobDesc)) {
                // console.log('スキップ')
                continue
            } else {
                // console.log('継続')
            }
            tempInfo.job = jobDesc


            str = companyClick.toString().replace(/index/g, i)
            // i番目の会社をクリック
            let as = exeJavascript(app, windowChrome.tabs[0], strToObj(str));
            // str = getCompName.toString()


            // 求人詳詳細をクリック
            let res = exeJavascript(app, windowChrome.activeTab, funcToObj(kyujinClick));
            let data = exeJavascript(app, windowChrome.activeTab, funcToObj(getData))
                ? exeJavascript(app, windowChrome.activeTab, funcToObj(getData))
                : {}

            let compData = exeJavascript(app, windowChrome.activeTab, funcToObj(getCompanyProfile))
                ? exeJavascript(app, windowChrome.activeTab, funcToObj(getCompanyProfile))
                : {}

            Object.assign(tempInfo, data, compData)
            tempInfo.url = windowChrome.activeTab.url()
            let day=exeJavascript(app, windowChrome.activeTab, funcToObj(getDeadline))
            tempInfo.dedline = day.dedline
            tempInfo.start = day.start
            writeFile(tempInfo)
            windowChrome.activeTab.close()
            // info.push(tempInfo)
            count++;
            console.log(count + "個追加")
        }

    } while (exeJavascript(app, windowChrome.tabs[0], funcToObj(nextButton)))

} else {
    console.log('画面が見当たらない')
}
