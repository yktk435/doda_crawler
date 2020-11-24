/************************************************************/
// 関数
/************************************************************/
function getCompName() {
    let str = document.querySelector("#wrapper > div.head_detail > div > div > h1").innerText.replace(/\n.*/, "");
    str = str.replace(/\n/g, "");
    return str;
}
function compCheck(search) {
    var app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    app.includeStandardAdditions = true;

    try {
        let text = app.doShellScript("find text.text -type f | xargs grep " + search); // lsコマンド
        console.log(text);
        return 1;
    } catch (error) {
        console.log(search + 'はまた追加してない')
        return 0;
    }
}

function nextButton() {
    let nextButton = document.querySelector("#shStart > div:nth-child(11) > div > div.boxRight.clrFix > ul.btnTypeSelect02.parts.clrFix > li.btn_r.last").firstElementChild
    if (nextButton.href) {
        nextButton.click()
        return 1;
    }
    else {
        return 0;
    }
}
function getFields(input, field) {
    let output = [];
    for (let i = 0; i < input.length; ++i)
        output.push(input[i][field]);

    let write = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    write.includeStandardAdditions = true;
    switch (field) {
        case 'jobDescription':
            field = '仕事内容'
            break;
        case 'targetPerson':
            field = '対象となる方'
            break;
        case 'selectionPoints':
            field = '選考のポイント'
            break;
        case 'workLocation':
            field = '勤務地'
            break;
        case 'workingHours':
            field = '勤務時間'
            break;
        case 'employmentStatus':
            field = '雇用形態'
            break;
        case 'salary':
            field = '給与'
            break;
        case 'welfare':
            field = '待遇・福利厚生'
            break;
        case 'holiday':
            field = '休日・休暇'
            break;
        case 'businessSummary':
            field = '事業概要'
            break;
        case 'address':
            field = '住所'
            break;
        case 'established':
            field = '設立'
            break;
        case 'represenTative':
            field = '代表者'
            break;
        case 'numberOfEmployees':
            field = '従業員数'
            break;
        case 'capital':
            field = '資本'
            break;
        case 'listedMarketName':
            field = '上場市場名'
            break
        case 'aveAge':
            field = '平均年齢'
            break;
        case 'companyUrl':
            field = '企業URL'
            break;
        case 'url':
            field = '求人URL'
            break;
        default:
            break;
    }

    let text = write.doShellScript("echo '" + field + "	" + output.join('	') + "'>>text.text"); // lsコマンド
    return output;
}
function exeJavascript(app, tab, code) {
    let res = app.execute(tab, code);
    waitLoading(windowChrome.activeTab)
    return res
}

function noti(info) {
    let app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    app.includeStandardAdditions = true;
    app.displayDialog(info);
    // app.displayNotification('はろーわーるど', {
    //     withTitle: 'ほげほげ', 
    //     subtitle: 'ふがふが', 
    //     soundName: 'Glass'
    // });
}
let getData = function () {
    let a = document.querySelectorAll("#job_description_table tr").length == 0
        ? Array.from(document.querySelectorAll(".tblDetail01.tblThDetail tr"))
        : Array.from(document.querySelectorAll("#job_description_table tr"))


    let tempInfo = {};
    let str = document.querySelector("#wrapper > div.head_detail > div > div > h1").innerText.replace(/\n.*/, "");
    str = str.replace(/\n/g, "");
    tempInfo.name = str;
    a.forEach(i => {
        // alert(i.children[1].innerText.replace(/\n/g,""))
        switch (i.children[0].innerText) {
            case '仕事内容':
                tempInfo.jobDescription = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '対象となる方':
                tempInfo.targetPerson = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '選考のポイント':
                tempInfo.selectionPoints = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '勤務地':
                tempInfo.workLocation = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '勤務時間':
                tempInfo.workingHours = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '雇用形態':
                tempInfo.employmentStatus = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '給与':
                tempInfo.salary = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '待遇・福利厚生':
                tempInfo.welfare = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '休日・休暇':
                tempInfo.holiday = i.children[1].innerText.replace(/\n/g, "")
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
    a.forEach(i => {

        switch (i.children[0].innerText) {
            case '事業概要':
                tempInfo.businessSummary = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '所在地':
                tempInfo.address = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '設立':
                tempInfo.established = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '代表者':
                tempInfo.represenTative = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '従業員数':
                tempInfo.numberOfEmployees = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '上場市場名':
                tempInfo.listedMarketName = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '資本金':
                tempInfo.capital = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '平均年齢':
                tempInfo.aveAge = i.children[1].innerText.replace(/\n/g, "")
                break;
            case '企業url':
                tempInfo.companyUrl = i.children[1].innerText.replace(/\n/g, "")
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
    let detail = document.querySelector("#shStart > ul.switch_display.clrFix > li:nth-child(2) > a")
    if (detail) detail.click()
}
let companyClick = function () {
    document.querySelectorAll('.company.width688')[index].click()
}

/************************************************************/
// メイン
/************************************************************/


let app = Application("Google Chrome");
app.includeStandardAdditions = true;

let windowChrome = null,
    tab = null;

for (let i = 0; i < app.windows.length; i++) {
    if (app.windows[i].name().match(/転職・求人情報- doda/)) {
        windowChrome = app.windows[i]
        break;
    }
}
if (windowChrome !== null) {

    do {
        // 要素数取得(会社の数だけ)
        let companies = app.execute(windowChrome.tabs[0], funcToObj(gg));

        let info = []
        let r
        for (let i = 0; i < companies.length; i++) {
            let tempInfo = {}
            let str = companyClick.toString().replace(/index/g, i)
            // i番目の会社をクリック
            let as = exeJavascript(app, windowChrome.tabs[0], strToObj(str));
            str = getCompName.toString().replace(/index/g, i)
            let comname = exeJavascript(app, windowChrome.activeTab, strToObj(str));

            // 求人詳詳細をクリック
            let res = exeJavascript(app, windowChrome.activeTab, funcToObj(kyujinClick));
            let data = exeJavascript(app, windowChrome.activeTab, funcToObj(getData))
                ? exeJavascript(app, windowChrome.activeTab, funcToObj(getData))
                : {}
            console.log("data", data.holiday)
            let compData = exeJavascript(app, windowChrome.activeTab, funcToObj(getCompanyProfile))
                ? exeJavascript(app, windowChrome.activeTab, funcToObj(getCompanyProfile))
                : {}
            console.log("compData", compData.address)
            Object.assign(
                tempInfo,
                data,
                compData
            )
            tempInfo.url = windowChrome.activeTab.url()

            windowChrome.activeTab.close()
            info.push(tempInfo)
        }
        /*****************************/
        // infoの整形

        let companyName = getFields(info, 'name')
        let jobDescription = getFields(info, 'jobDescription')
        let targetPerson = getFields(info, 'targetPerson')
        let selectionPoints = getFields(info, 'selectionPoints')
        let workLocation = getFields(info, 'workLocation')
        let workingHours = getFields(info, 'workingHours')
        let employmentStatus = getFields(info, 'employmentStatus')
        let salary = getFields(info, 'salary')
        let welfare = getFields(info, 'welfare')
        let holiday = getFields(info, 'holiday')
        let businessSummary = getFields(info, 'businessSummary')
        let address = getFields(info, 'address')
        let established = getFields(info, 'established')
        let represenTative = getFields(info, 'represenTative')
        let numberOfEmployees = getFields(info, 'numberOfEmployees')
        let capital = getFields(info, 'capital')
        let aveAge = getFields(info, 'aveAge')
        let companyUrl = getFields(info, 'companyUrl')
        let kyujinUrl = getFields(info, 'url')
        // ファイルへ書き込み


    } while (exeJavascript(app, windowChrome.tabs[0], funcToObj(nextButton)))

} else {
    console.log('画面が見当たらない')
}
