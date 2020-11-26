const getSearchWindow = function (app) {
    let window = null, searchTab = null, clickTab = { title() {return null }}
    for (let i = 0; i < app.windows.length; i++) {
        for (let j = 0; j < app.windows[i].tabs.length; j++) {
            if (app.windows[i].tabs[j].title().match(/転職・求人情報- doda/)) {
                window = app.windows[i]
                searchTab = app.windows[i].tabs[j]
                if (app.windows[i].tabs.length != j + 1) clickTab = app.windows[i].tabs[j + 1]
                break;
            } else {
                clickTab=app.windows[i].tabs[j]
            }
        }
    }
    return ({ window, searchTab, clickTab })
}
let app = Application("Google Chrome");
app.includeStandardAdditions = true;
console.log(getSearchWindow(app).searchTab.title())
