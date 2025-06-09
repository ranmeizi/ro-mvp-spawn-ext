import MvpConfig, { EnumMvpIndex, type MvpDeathNote } from '@/datas/mvp'
import { getMvpDeathNote } from "@/services/momoro"
import { getMvpState, getSubscribes } from './utils/contents/renderMvpTarget'

const INTERVAL = 1000 * 60 * 10

let timer = null
const portsMap = new Map<chrome.runtime.Port, chrome.runtime.Port>() // 活动port

/** 处理链接 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'ragnaboards-port') return;

  portsMap.set(port, port)

  // 有有效连接，去请求接口
  pullData()

  // 连接断开时清理
  port.onDisconnect.addListener(() => {
    console.log('断开了');
    portsMap.delete(port)
  });


  port.onMessage.addListener((msg) => {
    console.log(msg)
  })

  console.log('链接了')
});

let lastNote = undefined

// 轮询请求接口
async function pullData() {

  if (portsMap.size === 0) {
    return
  }

  const res = await getMvpDeathNote()

  const note = res.data

  // 对比 config 和 last note 看一下是否满足提醒消息的条件
  await checkIfAlarm(lastNote || [], note || [])

  // 发送给各个port
  for (const p of portsMap.keys()) {
    p.postMessage({
      type: 'mvp_status',
      data: note
    })
  }

  lastNote = note

  timer = setTimeout(pullData, INTERVAL);
}

// background.js 或 background.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "open_side_panel") {
    const tabId = sender.tab?.id

    chrome.sidePanel.setOptions({
      path: `sidepanel.html?type=${message.data.type}`,
    });
    chrome.sidePanel.open({ tabId })
  } else if (message.type === 'mvp_refresh') {
    // 立刻查一下
    mvpRefresh()
  }
})

function mvpRefresh() {
  // 立刻查一下
  clearTimeout(timer)
  timer = null
  pullData()
}

async function checkIfAlarm(last: MvpDeathNote[], curr: MvpDeathNote[]) {
  const subscribes = await getSubscribes()

  for (let key of subscribes) {
    const [map, id] = key.split('-')

    const mapConf = MvpConfig[id].respawn_map[map]

    const { time_lower, time_upper } = mapConf

    last.sort((a, b) => b.death_time - a.death_time)
    curr.sort((a, b) => b.death_time - a.death_time)

    const lastNote = last.find(item => item.id === id && item.map === map)
    const currNote = curr.find(item => item.id === id && item.map === map)

    const lastState = lastNote ? getMvpState(time_lower, time_upper, lastNote.death_time) : null
    const currState = currNote ? getMvpState(time_lower, time_upper, currNote.death_time) : null

    console.log('检查检查呢', lastState, currState)

    if (lastState !== currState && currState === 'maybe') {
      const notificationId = 'demo_notification_' + Date.now();
      // 要弹窗啦
      chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: MvpConfig[id].imgUrl,
        title: `您订阅的 ${map} 的 ${MvpConfig[id].name_CN} + '可能复活了`,
        message: '可能在 0~60min 范围内 刷新',
        buttons: [
          { title: '好的' },
          { title: '关闭' }
        ],
        priority: 2 // 0-2，2表示高优先级
      }, (notificationId) => {
        console.log('通知已显示，ID:', notificationId);
      });
    } else if (lastState !== currState && currState === 'alive') {
      const notificationId = 'demo_notification_' + Date.now();
      // 要弹窗啦
      chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: MvpConfig[id].imgUrl,
        title: `您订阅的 ${map} 的 ${MvpConfig[id].name_CN} + '复活了`,
        message: '肯定活着，快去',
        buttons: [
          { title: '好的' },
          { title: '关闭' }
        ],
        priority: 2 // 0-2，2表示高优先级
      }, (notificationId) => {
        console.log('通知已显示，ID:', notificationId);
      });
    }
  }
}

