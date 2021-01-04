/************************************************************/
// 関数
/************************************************************/
const stdin = function () {
    ObjC.import('readline');
    let argvStr = $.readline('入力： ');
    // console.log(`入力されたのは ${argvStr} です`);
    return Number(argvStr);
}
/************************************************************/
// クラス
/************************************************************/
// 親クラス
class Base {
    constructor(siteNumber) {

        this.siteNumber = siteNumber
        this.replace = /[／*"/\[\]]/g
        this.fileName = "new2.text"
        this.app = Application("Google Chrome");
        this.app.includeStandardAdditions = true

        this.removeWords = ['機械学習', 'AI', 'DBエンジニア', 'セールス', 'コンサル', '社内SE', 'マネージャ', 'リーダ', 'CTO', 'インフラエンジニア', 'EC']

        // let g=this.app.displayDialog('名前は', {
        //     defaultAnswer: '',
        //     buttons: ['キャンセル','OK'],
        //     defaultButton: 'OK',
        //     cancelButton: 'キャンセル',
        // })
        // console.log(g.textReturned)
    }
    findWindow() {
        for (let i = 0; i < this.app.windows.length; i++) {
            if (this.app.windows[i].name().match(this.reForFindWindow)) {
                this.windowChrome = this.app.windows[i]
                break;
            }
        }
        if (this.windowChrome === undefined) throw new Error('ウィンドウが見つからない')
    }
    funcToObj(func) {
        return ({
            javascript: `(${func.toString()})();`
        })
    }
    funcToObjwithIndexToI(func, i) {
        let str = func.toString().replace(/index/g, i)
        return ({
            javascript: "(" + str + ")();"
        })
    }
    exeJs(tab, code, i) {
        let obj = this.funcToObj(code)
        if (i != null) obj = this.funcToObjwithIndexToI(code, i)

        let res = this.app.execute(tab, obj);
        // 読み込み完了を待つ
        while (this.windowChrome.activeTab.loading()) {
            delay(0.5);
            if (!this.windowChrome.activeTab.loading()) {
                break;
            }
        }
        return res
    }
    duplicateCheck(words) {
        let app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
        app.includeStandardAdditions = true
        try {
            app.doShellScript("ls " + this.fileName);
        } catch (error) {
            app.doShellScript("touch " + this.fileName);
        }
        try {
            if (this.removeWords.filter(i => words.includes(i)).length) {
                console.log(`                         【除外ワード】: ${words} `)
                return 1
            }
            let text = app.doShellScript("find " + this.fileName + " -type f | xargs grep '" + words + "'"); // lsコマンド

            // console.log('すでにある')
            return 1;
        } catch (error) {
            // console.log(error)
            // console.log('まだ追加してない')
            return 0;
        }
    }
    write(data, jobDesc) {
        let formatedData = this.formatTheData(data, jobDesc)
        let text = '';
        let app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
        app.includeStandardAdditions = true;
        formatedData.forEach(i => text += '"' + i.val + '"	')
        try {
            app.doShellScript("echo '" + text + "'>>" + this.fileName);
        } catch (error) {
            console.log(`errorが起きた ${error}`)
        }
    }
    formatTheData(data, jobDesc) {
        let tempInfo = []
        tempInfo = tempInfo.concat([{ name: '会社名', val: jobDesc.companyName }])
        tempInfo = tempInfo.concat(data)
        tempInfo = tempInfo.concat([{ name: '判定文字', val: jobDesc.job }])
        tempInfo = tempInfo.concat({ name: '求人URL', val: this.windowChrome.activeTab.url() })
        return tempInfo
    }


}
// 小クラス
class Doda extends Base {
    init() {
        this.reForFindWindow = /^(?=.*転職)(?=.*doda)|https:\/\/doda\.jp.*$/;
    }

    nextButton() {
        let nextButton = document.querySelector(".btn_r.last").firstElementChild
        if (nextButton.href) {
            nextButton.click()
            return 1;
        }
        else {
            return 0;
        }
    }
    getNumberOfCompany() {
        return document.querySelectorAll('.company.width688').length
    }
    getCounter() {
        let number = document.querySelector('.number').innerText.replace(/,/, '')
        let counter = document.querySelector('.counter').innerText.match(/件中\s(\d+)/)[1]
        return ({ number, counter })
    }
    getJobDesc() {
        let res = '';
        let companyName = document.querySelectorAll('.company.width688')[index].innerText.replace(/NEW/, '')
        let job = document.querySelectorAll(".job.width688")[index].innerText.replace(this.replace, '')
        return { companyName, job };
    }
    companyClick() {
        let url = document.querySelectorAll('.company.width688')[index]
        if (url) url.click()
    }
    kyujinClick() {
        let detail = document.querySelectorAll('#shStart > ul.switch_display.clrFix > li:nth-child(2) > a')
        if (detail) detail[0].click()
    }
    getData() {
        let reg = /["'']/g;
        let res = {}
        let classData = [
            { name: '所管', cl: '#asdfgghjkl', val: '' },
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
        res = classData.map(i => {
            let a = Array.from(document.querySelectorAll(i.cl))
            a.find(j => {
                if (i.name == '締め切り') {
                    i.val = document.querySelector(i.cl).innerText.match(/\d+\/\d+\/\d+/g)[1]
                } else if (i.name == '掲載開始日') {
                    i.val = document.querySelector(i.cl).innerText.match(/\d+\/\d+\/\d+/g)[0]
                } else if (i.name == j.children[0].innerText) {
                    i.val = j.children[1].innerText.replace(reg, "")
                }
            })
            return i

        })
        return res
    }
}
// Type
class Type extends Base {
    init() {
        this.reForFindWindow = /type/
    }
    nextButton() {
        let nextButton = document.querySelector('.next.active a')
        if (nextButton) {
            nextButton.click()
            return 1;
        }
        else {
            return 0;
        }
    }
    getCounter() {

        return ({
            counter: document.querySelector('.segment-num span.num').innerText.match(/(\d+)/)[0],
            number: document.querySelector('.whole-num span.num').innerText.match(/(\d+)/)[0]
        })
    }
    getNumberOfCompany() {
        return document.querySelectorAll('.mod-job-info-item h2 a').length
    }
    getJobDesc() {
        let res = '';
        let companyName = document.querySelectorAll('.company.size-14px span')[index].innerText
        let job = document.querySelectorAll(".mod-job-info-item h2 a")[index].innerText.replace(this.replace, "")
        return { companyName, job };
    }
    companyClick() {
        let url = document.querySelectorAll('.mod-job-info-item h2 a')[index].href
        window.open(url)
    }
    kyujinClick() {
        let detail = document.querySelectorAll('.js-equal-heights a')
        if (detail) detail[0].click()
    }
    getData() {
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
}
/************************************************************/
// メイン
/************************************************************/


console.log(`
=====================
doda:1
type:2
green:3
wantedly:4
=====================
`)

const siteNumber = stdin()
let main = null;
try {
    switch (siteNumber) {
        case 1:
            main = new Doda(siteNumber)
            break;
        case 2:
            main = new Type(siteNumber)
            break;

        default:
            throw new Error('正しい入力でない');
            break;
    }

    main.init()
    main.findWindow()

    let count = 0
    do {
        let companies = main.exeJs(main.windowChrome.tabs[0], main.getNumberOfCompany)

        for (let i = 0; i < companies; i++, count++) {
            let counter = main.exeJs(main.windowChrome.tabs[0], main.getCounter);
            console.log(Number(counter.counter) + i + "/" + counter.number + '  ' + count + '個追加')
            let jobDesc = main.exeJs(main.windowChrome.tabs[0], main.getJobDesc, i);
            // 情報重複チェック
            if (main.duplicateCheck(jobDesc.job)) continue
            // i番目の会社をクリック
            main.exeJs(main.windowChrome.tabs[0], main.companyClick, i)
            // 詳細をクリック
            main.exeJs(main.windowChrome.activeTab, main.kyujinClick)
            // データ取得
            let data = main.exeJs(main.windowChrome.activeTab, main.getData)
            // データを整形して書き込み
            main.write(data, jobDesc)
            // タブを閉じる
            main.windowChrome.activeTab.close()
            delay(1000)
        }
    } while (main.exeJs(main.windowChrome.tabs[0], main.nextButton))
} catch (error) {
    console.log(error)
}
