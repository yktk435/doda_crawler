function funcToObj(func) {
    let runFunctionStr = func.toString()
    // console.log(runFunctionStr)
    return ({
        javascript: "(" + runFunctionStr + ")();"
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
    
}


const url = "https://doda.jp/DodaFront/View/JobSearchList/j_pr__12%2C13/-oc__032102S/-op__17/-ne__2/-tp__1/-k__/%E6%9C%AA%E7%B5%8C%E9%A8%93/-niwc__1/-kwc__1/-ni__/%E7%A4%BE%E5%86%85SE/"
// Google Chromeを定義
let app = Application("Google Chrome");
app.includeStandardAdditions = true;

let windowChrome = null,
    tabFirst = null;

// if (app.windows.length === 0) {
app.Window().make();
// }

windowChrome = app.windows[0];
tabFirst = windowChrome.tabs[0];
tabFirst.url = url;


// Chromeをアクティブにする
app.activate();

// ページが完全に読み込まれるまで、delayを繰り返す
let res;
while (tabFirst.loading()) {
    delay(0.5);
    if (!tabFirst.loading()) {
        res = app.execute(tabFirst, funcToObj(loginCheck));
        if (!res) {
            console.log('ログインしていない')
            break;
        }
        console.log('ログインしている')
        res = app.execute(tabFirst, funcToObj(gg));
        console.log(res)

        // tabFirst.close()
        break;
    }
}
