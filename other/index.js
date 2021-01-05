let textName = "webエンジニア.text"
let write = Application.currentApplication(); // 現在実行しているアプリケーションを取得
write.includeStandardAdditions = true;
try {
    write.doShellScript("ls " + textName);    
} catch (error) {
    write.doShellScript("mkdir " + textName);    
}

console.log(res)
