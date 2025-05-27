

/** 处理链接 */

/** 触发更新 */
function emitUpdating() {

}

/** 处理链接 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'ragnaboards-port') return;

  // 连接断开时清理
  port.onDisconnect.addListener(() => {
    console.log('断开了');
  });

  console.log('链接了')
});