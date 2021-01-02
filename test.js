/************************************************************/
// 定数
/************************************************************/
const TEXTNAME = "new2.text"
const deleteWord = ['機械学習', 'AI', 'DBエンジニア', 'セールス', 'コンサル', '社内SE', 'マネージャ', 'リーダ', 'CTO', 'インフラエンジニア', 'EC']
/************************************************************/
// 関数
/************************************************************/

const stdin = function () {
    ObjC.import('readline');
    let argvStr = $.readline('入力： ');
    // console.log(`入力されたのは ${argvStr} です`);
    return argvStr;
}

const write = function (arr) {
    let text = '';
    let app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    app.includeStandardAdditions = true;
    // arr.forEach(i => text += '"' + i.val + '"	')
    text = `"${arr.join('"	"')}"`
    try {
        app.doShellScript("echo '" + text + "'>>" + TEXTNAME);
    } catch (error) {
        console.log(`errorが起きた ${error}`)
    }
}
/************************************************************/
// システム系
/************************************************************/

const funcToObj = function (func) {
    return ({
        javascript: "(" + func.toString() + ")();"
    })
}
const exeJavascript = function (app, windowChrome, tab, code) {
    let res = app.execute(tab, code);
    waitLoading(windowChrome)
    return res
}
const waitLoading = function (windowChrome) {
    while (windowChrome.activeTab.loading()) {
        delay(0.5);
        if (!windowChrome.activeTab.loading()) {
            break;
        }
    }
}

/************************************************************/
// サイト別
/************************************************************/
let getNumberOfCompany = function () {
    let r = document.querySelectorAll(shouldBeReplaced).length
    return r
}
let getCounter = function () {
    let number = document.querySelector('.number').innerText.replace(/,/, '')
    let counter = document.querySelector('.counter').innerText.match(/件中\s(\d+)/)[1]
    return ({ number, counter })
}
const getJobDesc = function () {
    let res = '';
    let companyName = document.querySelectorAll(shouldBeReplaced1)[index].innerText.replace(/NEW/, '')
    let job = document.querySelectorAll(shouldBeReplaced2)[index].innerText.replace(/[/／.*]/g, '')
    return { companyName, job };
}


class Main {
    constructor(siteNumber) {
        this.app = Application("Google Chrome");
        this.windowChrome = null
        this.tab = null;
        this.items = [{
            matchTabName: /^(?=.*転職)(?=.*doda)|https:\/\/doda\.jp.*$/,
            numberOfCompanySelector: '.company.width688',
            numberOfCompanyInCorrentTabSelector: '.number',
            counterSelector:'.counter',
            companyNameSelector: '.company.width688',
            jobSelector:'.job.width688'
        },]
        this.siteNumber = Number(siteNumber) - 1
        this.item = this.items[this.siteNumber]
    }
    findWindowAndTab() {
        for (let i = 0; i < this.app.windows.length; i++) {
            if (this.app.windows[i].name().match(this.item.matchTabName)) {
                this.windowChrome = this.app.windows[i]
                break;
            }
        }
        if (this.windowChrome == null) { console.log('画面が見当たらない') }
    }
    main() {
        let count = 0
        let strFunc = getNumberOfCompany.toString().replace(/shouldBeReplaced/, `'${this.item.numberOfCompanySelector}'`)
        let companies = this.app.execute(this.windowChrome.tabs[0], funcToObj(strFunc));
        for (let i = 0; i < companies; i++) {
            let counter = exeJavascript(this.app, this.windowChrome, this.windowChrome.tabs[0], funcToObj(getCounter.toString().replace(/shouldBeReplaced/, `'${this.item.numberOfCompanySelector}'`)));
            console.log(Number(counter.counter) + i + "/" + counter.number + '  ' + count + '個追加')
            let str = getJobDesc.toString().replace(/index/g, i)
            let jobDesc = exeJavascript(app, windowChrome.tabs[0], strToObj(str));
        }
    }


}

// メイン

console.log(`
=====================
doda:1
type:2
green:3
wantedly:4
=====================
`)

const main = new Main(stdin())
main.findWindowAndTab();
main.main()