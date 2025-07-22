import { t } from "@/locales";

type Key = '刷新' | 'Discord' | '地图' | '查看数据' | '查看排行'

window.addEventListener('CommandMessage', function (e) {
    const key: Key = e.detail.key

    switch (key) {
        case t(window.lang,'refresh'):
            chrome.runtime.sendMessage({ type: "mvp_refresh" })
            break;
        case "Discord":
            window.open('https://discord.com/channels/1188424174012731432/1353165010582638713')
            break;
        case t(window.lang,'map'):
            window.open('https://ragnaboards.net/worldmap/')
            break;
        case t(window.lang,'navToDataQuery'):
            // 发送 open side panel 消息到background
            chrome.runtime.sendMessage({ type: "open_side_panel", data: { type: "search" } })
            break;
        case t(window.lang,'navToRanking'):
            chrome.runtime.sendMessage({ type: "open_side_panel", data: { type: "ranking" } })
            break;
    }

})