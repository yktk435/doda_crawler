let getData = function () {
    let a = Array.from(document.querySelectorAll("#job_description_table tr"))
    console.log(a)
    let tempInfo = {}
    let str = document.querySelector("#wrapper > div.head_detail > div > div > h1").innerText.replace(/\n.*/, "")
    str=str.replace(/\n/g, "")
    tempInfo.name=str
    a.forEach(i => {
        
        switch (i.children[0].innerText) {
            case '仕事内容':
                tempInfo.jobDescription=i.children[1].innerText
                break;
            case '対象となる方':
                tempInfo.targetPerson=i.children[1].innerText
                break;
            case '選考のポイント':
                tempInfo.selectionPoints=i.children[1].innerText
                break;
            case '勤務地':
                tempInfo.workLocation=i.children[1].innerText
                break;
            case '勤務時間':
                tempInfo.workingHours=i.children[1].innerText
                break;
            case '雇用形態':
                tempInfo.employmentStatus=i.children[1].innerText
                break;
            case '給与':
                tempInfo.salary=i.children[1].innerText
                break;
            case '待遇・福利厚生':
                tempInfo.welfare=i.children[1].innerText
                break;
            case '休日・休暇':
                tempInfo.holiday=i.children[1].innerText
                break;
            default:
                break;
        }
    })
    return tempInfo
}
const getCompanyProfile = function () {
    let a = Array.from(document.querySelectorAll("#company_profile_table tr"))
    console.log(a)
    let tempInfo = {}
    a.forEach(i => {
        
        switch (i.children[0].innerText) {
            case '事業概要':
                tempInfo.businessSummary=i.children[1].innerText
                break;
            case '所在地':
                tempInfo.address=i.children[1].innerText
                break;
            case '設立':
                tempInfo.established=i.children[1].innerText
                break;
            case '代表者':
                tempInfo.represenTative=i.children[1].innerText
                break;
            case '従業員数':
                tempInfo.numberOfEmployees=i.children[1].innerText
                break;
            case '資本金':
                tempInfo.capital=i.children[1].innerText
                break;
            case '平均年齢':
                tempInfo.aveAge=i.children[1].innerText
                break;
            case '企業url':
                tempInfo.companyUrl=i.children[1].innerText
                break;
            case '休日・休暇':
                tempInfo.holiday=i.children[1].innerText
                break;
            default:
                break;
        }
    })
    return tempInfo
    
}
const waitLoading=function(tab){
    while (windowChrome.activeTab.loading()) { 
        delay(0.5);
        console.log('wait')
        if (!tab.loading()) { 
            break;
        }
    }
}

function funcToObj(func) {
    let runFunctionStr = func.toString()
    // console.log(runFunctionStr)
    return ({
        javascript: "(" + runFunctionStr + ")();"
    })
}

function strToObj(str) {
    return ({
        javascript: "(" + str + ")();"
    })
}


// ブラウザ上で実行させる関数を定義
let runFunction = function () {
    let a = document.querySelector('img').src
    alert('カンザス');
    return a;
};

let loginCheck = function () {
    // ログインしていれば
    // PC_header_logout_cl
    let res = document.querySelector("#PC_header_logout_cl")
    return res ? 1 : 0
}
let gg = function () {
    // document.querySelector('.company.width688').click()
    let a = document.querySelectorAll('.company.width688')
    a = Array.from(a)
    let arr = a.map((num, index) => index)
    return arr;
}
let kyujinClick = function () {
    document.querySelector("#shStart > ul.switch_display.clrFix > li:nth-child(2) > a").click()
}
let companyClick = function () {
    document.querySelectorAll('.company.width688')[index].click()
}


// Google Chromeを定義
let app = Application("Google Chrome");
app.includeStandardAdditions = true;

let windowChrome = null,
    tab = null;


console.log(app.windows.length)
for (let i = 0; i < app.windows.length; i++) {
    if (app.windows[i].name() == '転職・求人情報- doda') {
        windowChrome = app.windows[i]
        break;
    }
}

console.log(windowChrome.tabs.length)
// 要素数取得(会社の数だけ)
companies = app.execute(windowChrome.tabs[0], funcToObj(gg));

console.log(companies.length)
let info = []
let r
for (let i = 0; i < 3; i++) {
    let tempInfo = {}
    let str = companyClick.toString().replace(/index/g, i)

    app.execute(windowChrome.tabs[0], strToObj(str));

    while (windowChrome.activeTab.loading()) {
        delay(0.5);
        if (!windowChrome.activeTab.loading()) {
            res = app.execute(windowChrome.activeTab, funcToObj(kyujinClick));
            waitLoading(windowChrome.activeTab)
            console.log('ここ')
            tempInfo = app.execute(windowChrome.activeTab, funcToObj(getData));
            Object.assign(tempInfo,app.execute(windowChrome.activeTab, funcToObj(getCompanyProfile)))
            tempInfo.url = windowChrome.activeTab.url()
            
            windowChrome.activeTab.close()
            break;
        }
    }
    info.push(tempInfo)    
}

let text
let app2 = Application.currentApplication(); // 現在実行しているアプリケーションを取得
app2.includeStandardAdditions = true;

for (let i = 0; i < info.length; i++) {
    let temp = '';
    temp+=info[i].name+','
    
}

info.forEach(function (i,index) {
    if (index == info.length - 1) text = app2.doShellScript("echo -n " + i.name + ",>> text.text"); // lsコマンド
    else text = app2.doShellScript("echo -n '"+i.name+",' >> text.text"); // lsコマンド
})

