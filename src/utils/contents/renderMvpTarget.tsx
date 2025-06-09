/**
 * config 不变
 * el 结构 不变
 * 可变的是 实时拉取的 mvp death note
 */

import type { MvpDeathNote } from "@/datas/mvp";
import MvpConfig, { EnumMvpIndex } from '@/datas/mvp'
import { tileEls } from "./getMapTile";
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";


dayjs.extend(duration)
dayjs.extend(utc);

// 测试数据
const test_note: MvpDeathNote[] = []
// [
//     { id: EnumMvpIndex.Eddga, death_time: dayjs().subtract(23, 'minute').valueOf(), killer: 'GM01' },
//     { id: EnumMvpIndex.Baphomet, death_time: dayjs().subtract(130, 'minute').valueOf(), killer: 'GM01' }
// ]

export function getMvpState(time_lower: number, time_upper: number, death_time: number): 'alive' | 'dead' | 'maybe' {
    // 如果 没有 death_time 或者 death_time + time_upper < now 那就一定活着
    console.log('compare', dayjs(death_time), dayjs().valueOf(), time_lower, time_upper)
    if (!death_time || death_time + time_upper < Date.now()) {
        return 'alive'
    }

    // 如果 death_time + time_lower> now 那就一定死了
    if (death_time + time_lower > Date.now()) {
        return 'dead'
    }

    return 'maybe'
}

export async function renderMvpTarget(death_note: MvpDeathNote[] = test_note) {
    death_note.sort((a, b) => b.death_time - a.death_time)

    // 循环 MvpConfig 把 mvp 
    for (let [id, conf] of Object.entries(MvpConfig)) {
        const maps = conf.respawn_map
        const name = conf.name_map
        const url = conf.imgUrl

        for (let [map, mapConf] of Object.entries(maps)) {
            const container = tileEls[map]
            const { time_lower, time_upper } = mapConf

            const { death_time, killer } = death_note.find(item => item.id === id && item.map === map) || {}

            // A. 处理浮动图标

            // 用 time_lower, time_upper 和 death_time 值计算一下 mvp 是否存活
            const state = getMvpState(time_lower, time_upper, death_time)

            const wrapEl = container.querySelector('.mvp-icon')
            if (wrapEl) {
                container.removeChild(wrapEl)
            }

            const newEl = document.createElement('div')
            newEl.className = `mvp-icon ${state}`

            const img = document.createElement('img')
            img.src = url

            newEl.appendChild(img)

            container.appendChild(newEl)

            // 处理订阅状态

            const subscribes = await getSubscribes()

            const isSubscribe = subscribes.includes(`${map}-${id}`)

            const alarmEl = container.querySelector('.mvp-alarm')

            if (alarmEl) {
                container.removeChild(alarmEl)
            }

            const newAlarm = document.createElement('div')
            newAlarm.className = `mvp-alarm ${isSubscribe ? 'active' : ''}`

            container.appendChild(newAlarm)

            container.oncontextmenu = async function () {
                const subscribes = await getSubscribes()

                const isSubscribe = subscribes.includes(`${map}-${id}`)

                if (!isSubscribe) {
                    if (window.confirm(`要订阅 ${map} 地图的 ${name} 复活消息?`)) {
                        await chrome.storage.local.set({ mvp_subscribes: [...subscribes, `${map}-${id}`] })
                        container.querySelector('.mvp-alarm').classList.add('active')
                    }
                } else {
                    if (window.confirm(`取消订阅 ${map} 地图的 ${name} 复活消息?`)) {
                        await chrome.storage.local.set({ mvp_subscribes: subscribes.filter(item => item !== `${map}-${id}`) })
                        container.querySelector('.mvp-alarm').classList.remove('active')
                    }
                }

            }

            // B. 处理表格 td
            const tds = container.querySelectorAll('table .tt-row .mob-name')

            let hasMvp = false // 没有MVP 如果没有，给他table加一行

            for (let i = 0; i < tds.length; i++) {
                const td = tds[i]
                const origin = (td.childNodes[0].textContent)

                if (origin !== name) {
                    continue;
                }

                hasMvp = true

                const tag = td.childNodes?.[1]
                const btn = td.childNodes?.[2]

                if (tag) {
                    td.removeChild(tag)
                }

                if (btn) {
                    td.removeChild(btn)
                }

                switch (state) {
                    case "alive":
                        {
                            // 标alive
                            const t = document.createElement('i')
                            t.innerText = `(${chrome.i18n.getMessage('Alive')})`
                            t.style.color = 'green'
                            td.appendChild(t)

                        } break;
                    case "dead":
                        {
                            // 标 dead
                            const t = document.createElement('i')

                            t.innerText = `(${chrome.i18n.getMessage('killTemplate')
                                .replace('{0}', killer)
                                .replace('{1}', dayjs(death_time).format('YYYY-MM-DD HH:mm:ss'))})`
                            t.style.color = 'red'
                            td.appendChild(t)

                        } break;

                    case "maybe":
                        {
                            // 标 maybe
                            const t = document.createElement('i')
                            t.innerText = `(${chrome.i18n.getMessage('maybeTemplate')
                                .replace('{0}', killer)
                                .replace('{1}', dayjs(death_time).format('YYYY-MM-DD HH:mm:ss'))
                                .replace('{2}', dayjs(death_time + time_lower).format('YYYY-MM-DD HH:mm:ss'))
                                .replace('{3}', dayjs(death_time + time_upper).format('YYYY-MM-DD HH:mm:ss'))
                                })`
                            t.style.color = 'orange'
                            td.appendChild(t)

                        } break;

                }

            }

            if (!hasMvp) {
                // 加一行 刷新慢一点而已 下次调用给加上 mvp信息
                const tbody = container.querySelector('table>tbody')
                const row = document.createElement('tr')

                const len = tbody.querySelectorAll('.tt-row').length
                row.className = `tt-row ${len % 2 === 0 ? '' : 'even'}`

                const nameTd = document.createElement('td')
                nameTd.className = 'mob-name'
                nameTd.innerText = name

                const numTd = document.createElement('td')
                numTd.innerText = '1'

                const timingTd = document.createElement('td')

                timingTd.innerText = `${dayjs.duration(time_lower).asMinutes()}min ~ ${dayjs.duration(time_upper).asMinutes()}min`

                row.appendChild(nameTd)
                row.appendChild(numTd)
                row.appendChild(timingTd)

                tbody.appendChild(row)
            }
        }
    }

}

export async function getSubscribes() {
    const subscribes = (await chrome.storage.local.get(['mvp_subscribes']))?.mvp_subscribes || []
    return subscribes
}
