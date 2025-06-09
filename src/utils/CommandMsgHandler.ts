type Key = '刷新' | 'Discord' | '地图' | '查看数据' | '查看排行'

window.addEventListener('CommandMessage', function (e) {
    const key: Key = e.detail.key

    switch (key) {
        case '刷新':
            chrome.runtime.sendMessage({ type: "mvp_refresh" })
            break;
        case "Discord":
            window.open('https://discord.com/channels/1188424174012731432/1353165010582638713')
            break;
        case "地图":
            window.open('https://ragnaboards.net/worldmap/')
            break;
        case "查看数据":
            // 发送 open side panel 消息到background
            chrome.runtime.sendMessage({ type: "open_side_panel", data: { type: "search" } })
            break;
        case "查看排行":
            chrome.runtime.sendMessage({ type: "open_side_panel", data: { type: "ranking" } })
            break;
    }

})