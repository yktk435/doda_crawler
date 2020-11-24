function getWinTab(app) {

    let windowChrome = null
    let tab=null

    for (let i = 0; i < app.windows.length; i++) {
        for (let j = 0; j < app.windows[i].tabs.length; j++) {
            if (app.windows[i].tabs[j].title().match(/(転職・求人情報- doda)/)) {
                windowChrome = app.windows[i]
                tab=app.windows[i].tabs[j]
                break;
            }
        }
    }
    return windowChrome === null
        ? 0
        : ({
            window: windowChrome,
            tab:tab,
        })
        
}

let app = Application("Google Chrome");
app.includeStandardAdditions = true;

let windowChrome = null
    

for (let i = 0; i < app.windows.length; i++) {
    for (let j = 0; j < app.windows[i].tabs.length; j++) {
        if (app.windows[i].tabs[j].title().match(/転職・求人情報- doda/)) {
            windowChrome = app.windows[i].tabs[j]
            break;
        }    
    }
}
// console.log(windowChrome.title())
let t=getWinTab(app)
console.log(t.tabs[0].title())