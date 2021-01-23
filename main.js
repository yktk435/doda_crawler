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
        this.re = /[／*"/\[\]]/g
        this.siteNumber = siteNumber
        this.fileName = "res.text"
        this.app = Application("Google Chrome");
        this.app.includeStandardAdditions = true
        // let g=this.app.displayDialog('名前は', {
        //     defaultAnswer: '',
        //     buttons: ['キャンセル','OK'],
        //     defaultButton: 'OK',
        //     cancelButton: 'キャンセル',
        // })
        // console.log(g.textReturned)
    }
    mainClick(i) {
        this.exeJs(this.windowChrome.tabs[0], this.companyClick, i)
    }
    mainDetailClick() {
        this.exeJs(this.windowChrome.activeTab, this.kyujinClick)
    }
    mainGetData() {
        return main.exeJs(main.windowChrome.activeTab, main.getData)
    }
    findWindow() {
        for (let i = 0; i < this.app.windows.length; i++) {
            if (this.app.windows[i].name().match(this.reForFindWindow)) {
                this.windowChrome = this.app.windows[i]
                break;
            }
        }

        if (this.windowChrome === undefined) throw new Error('ウィンドウが見つからない')
        // this.test()
    }
    test() {
        this.mainTabId = this.windowChrome.tabs[0].id();

        for (let i = 0; i < this.windowChrome.tabs.length; i++) {
            this.tabIds.push(this.windowChrome.tabs[i].id())
        }
        this.tabIds.forEach(i => console.log(i))
        this.app.displayDialog('s')
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
        this.removeWords = ['RPA', 'Oracle', '社内情報システム', '医療', 'Unity', '機械学習', 'AI', 'DBエンジニア', 'セールス', 'コンサル', '社内SE', 'マネージャ', 'リーダ', 'CTO', 'インフラエンジニア', 'EC', 'ネットワークエンジニア']
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
    condition() {
        return this.exeJs(this.windowChrome.tabs[0], this.nextButton)
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
        let job = document.querySelectorAll(".job.width688")[index].innerText
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
        let job = document.querySelectorAll(".mod-job-info-item h2 a")[index].innerText
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
                    i.val = document.querySelector(i.cl).innerText.match(/\d+\.\d+\.\d+/g)[1].replace(/\./g, '/')
                } else if (i.name == '掲載開始日') {
                    i.val = document.querySelector(i.cl).innerText.match(/\d+\.\d+\.\d+/g)[0].replace(/\./g, '/')
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
class Green extends Base {
    init() {
        this.removeWords = /求人検索/
    }
    moveToBottom() {
        let element = document.documentElement;
        let bottom = element.scrollHeight - element.clientHeight;
        document.querySelector("#js-search-main").scroll(0, 10000000000000)
    }
    getCounter() {
        let number = document.querySelectorAll('.number')[0].innerText
        return ({ counter: 0, number })
    }
    getNumberOfCompany() {
        return document.querySelectorAll('.mdl-card__title-text').length
    }
    getJobDesc() {
        let el = document.querySelectorAll('.mdl-card__title-text')[index]
        let companyName = document.querySelectorAll('.job-card__company-name')[index].innerText.replace(/open_in_new|["\s]/g, "")
        let job = el.innerText.replace(/open_in_new|["”*\[\]\s]/g, "")
        return ({
            companyName, job
        })
    }
    companyClick() {
        let el = document.querySelectorAll('.mdl-card__title-text')[index]
        el.click()
    }
    getData() {
        let reg = /["'']/g;
        let res = {}
        let classData = [
            { name: '所管', cl: '', val: '' },
            { name: 'ポイント', cl: '', },
            { name: '募集背景', cl: '', },
            { name: '仕事内容', cl: '.com_content__basic-info', },
            { name: 'キャリアパス', cl: '', },
            { name: '応募資格', cl: '', },
            { name: '想定年収（給与詳細）', cl: '', },
            { name: '勤務時間', cl: '', },
            { name: '勤務地', cl: '', },
            { name: '休日/休暇', cl: '', },
            { name: '待遇・福利厚生', cl: '', },
            { name: '事業内容', cl: '', },
            { name: '設立年月', cl: '', },
            { name: '従業員数', cl: '', },
            { name: '資本金', cl: '', },
            { name: '売上高', cl: '', },
            { name: '代表者', cl: '', },
            { name: '平均年齢', cl: '', },
            { name: '掲載開始日', cl: '', },
            { name: '締め切り', cl: '', },
        ]
        let a = document.querySelectorAll(".com_content__main_contents tr")
        a = Array.from(a)
        res = classData.map(i => {
            if (i.cl != '' && document.querySelector(i.cl)) {
                i.val = document.querySelector(i.cl).innerText.replace(reg, '')
            } else {
                a.find(j => {
                    if (i.name == j.children[0].innerText) {
                        i.val = j.children[1].innerText.replace(reg, '')
                    }
                })
            }

            return i
        })
        return res
    }
    getData2() {
        let reg = /["'']/g;
        let res = {}
        let classData = [
            { name: '所管', cl: '', },
            { name: 'ポイント', cl: '', },
            { name: '募集背景', cl: '', },
            { name: '仕事内容', cl: '.com_content__basic-info', },
            { name: 'キャリアパス', cl: '', },
            { name: '応募資格', cl: '', },
            { name: '想定年収（給与詳細）', cl: '', },
            { name: '勤務時間', cl: '', },
            { name: '勤務地', cl: '', },
            { name: '休日/休暇', cl: '', },
            { name: '福利厚生', cl: '', },
            { name: '事業内容', cl: '', },
            { name: '設立年月', cl: '', },
            { name: '従業員数', cl: '', },
            { name: '資本金', cl: '', },
            { name: '売上高', cl: '', },
            { name: '代表者', cl: '', },
            { name: '平均年齢', cl: '', },
            { name: '掲載開始日', cl: '', },
            { name: '締め切り', cl: '', },
        ]
        let a = document.querySelectorAll(".detail-content-table.js-impression tr")
        a = Array.from(a)
        res = classData.map(i => {
            a.find(j => {
                console.log(j.children.length)
                if (j.children.length && i.name == j.children[0].innerText) {
                    i.val = j.children[1].innerText.replace(reg, '')
                }




            })
            return i
        })
        return res
    }
    getCompInfo(classData) {
        this.exeJs(this.windowChrome.activeTab, this.clickCompInfo)
        this.app.displayDialog('a')

    }
    clickCompInfo() {
        document.querySelectorAll('.company-info-box__btn-area a')[1].click()
    }
    mainGetData() {
        return this.greenData
    }
    mainDetailClick() {

    }
    mainClick(i) {
        this.exeJs(this.windowChrome.tabs[0], this.companyClick, i)
        let data1 = this.exeJs(this.windowChrome.activeTab, this.getData)
        // console.log(this.greenData[3].name, this.greenData[3].val)
        this.exeJs(this.windowChrome.activeTab, this.clickCompInfo)
        let data2 = this.exeJs(this.windowChrome.activeTab, this.getData2)
        for (let i = 0; i < data1.length; i++) {
            if (data2[i].val) data1[i].val = data2[i].val
        }
        this.greenData = data1
    }
    condition(i) {
        let counter = this.exeJs(this.windowChrome.tabs[0], this.getCounter);
        return i <= counter.number - 1
    }
}
/************************************************************/
// メイン
/************************************************************/


console.log(`
=====================
1 : doda
2 : type
3 : green
4 : wantedly
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
        case 3:
            main = new Green(siteNumber)
            break;

        default:
            throw new Error('正しい入力でない');
            break;
    }

    main.init()
    main.findWindow()
    let count = 0
    let j = 0
    // Green用のカウンタ
    let greenCount = 0;
    do {

        let companies = main.exeJs(main.windowChrome.tabs[0], main.getNumberOfCompany)
        // console.log('i', i)
        console.log('companies', companies)
        for (let i=0; i < companies; i++,j++) {

            // Greenのみ
            if (siteNumber == 3 && i%5==0) main.exeJs(main.windowChrome.tabs[0], main.moveToBottom)

            let counter = main.exeJs(main.windowChrome.tabs[0], main.getCounter);
            console.log(Number(counter.counter) + i + "/" + counter.number + '  ' + count + '個追加')
            let jobDesc = main.exeJs(main.windowChrome.tabs[0], main.getJobDesc, i);
            jobDesc.job = jobDesc.job.replace(main.re, '')
            // 情報重複チェック
            if (main.duplicateCheck(jobDesc.job)) continue
            // i番目の会社をクリック
            main.mainClick(i)
            // 詳細をクリック
            main.mainDetailClick()
            // データ取得
            let data = main.mainGetData()
            // データを整形して書き込み
            main.write(data, jobDesc)
            // タブを閉じる
            main.windowChrome.activeTab.close()
            count++
        }
        // 「次へ」のボタンがあるなら押して次のループへ
        // Greenの場合は次の会社情報がるなら
    } while (main.condition(j))
} catch (error) {
    console.log(error)
}
