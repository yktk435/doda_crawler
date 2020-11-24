function compCheck(search) {
    var app = Application.currentApplication(); // 現在実行しているアプリケーションを取得
    app.includeStandardAdditions = true;
    
    try {
        let text = app.doShellScript("find text.text -type f -print | xargs grep "+search); // lsコマンド    
        return 1;
    } catch (error) {
        return 0;
    }    
}
compCheck('株あ')