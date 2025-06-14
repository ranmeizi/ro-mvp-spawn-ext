import type { PlasmoCSConfig } from "plasmo"
import { EnumMsgType, type MomoDiscordMsg } from "@/datas/note";
import { ingamenewsPush } from '@/services/momoro'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Control from '@/components/Control'
import dayjs from "dayjs";
import ToolBar from "@/components/ToolBar";
import InjectRoot from "@/components/InjectRoot";
import '@/utils/CommandMsgHandler'

dayjs.extend(utc);
dayjs.extend(timezone);


export const config: PlasmoCSConfig = {
    matches: ["https://discord.com/*"],
    all_frames: true,
}

// 注入 xhook
function inject() {
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL('assets/xhook.min.js');
    document.head.appendChild(script)
}

inject()

// 提取消息关键字的正则
const checkReg = /<.+> .+ (got|executed|stole)/

const killReg = /<.+> (.+) executed \[(.+)\]\(.+mob_id=(\d+)&.+\) at (.+)/

const dropReg = /<.+> (.+) got \[(.+)\]\(.+item_id=(\d+)&.+\)/

const stoleReg = /<.+> (.+) stole \[(.+)\]\(.+item_id=(\d+)&.+\)/

const TYPES = {
    executed: EnumMsgType.MVP击杀信息,
    got: EnumMsgType.掉落信息,
    stole: EnumMsgType.偷窃信息
}


window.addEventListener('ExtensionMessage', function (e) {

    try {
        // 简单处理一下，把消息分解，拿到时间戳，创建唯一id
        const msgs: MomoDiscordMsg[] = e.detail.responseBodyJson.map(item => {
            const typeMatch = item.content.match(checkReg)?.[1]

            const ts = dayjs.utc(item.timestamp).tz('Asia/Shanghai').valueOf()
            console.log('ss', item.content, dayjs.utc(item.timestamp).tz('Asia/Shanghai'))
            const type = TYPES[typeMatch]

            if (type === EnumMsgType.MVP击杀信息) {
                // 提取关键信息
                const res = item.content.match(killReg) || []
                const [_, subject, object, objectId, map] = res

                const note: MomoDiscordMsg = {
                    ts,
                    type: EnumMsgType.MVP击杀信息,
                    key: `${ts}_${subject}_${objectId}`,
                    subject,
                    object,
                    objectId,
                    map,
                    origin: item.content
                }

                return {
                    ...item,
                    note
                }
            } else if (type === EnumMsgType.掉落信息) {

                // 提取关键信息
                const res = item.content.match(dropReg) || []
                const [_, subject, object, objectId] = res

                const note: MomoDiscordMsg = {
                    ts,
                    type: EnumMsgType.掉落信息,
                    key: `${ts}_${subject}_${objectId}`,
                    subject,
                    object,
                    objectId,
                    origin: item.content
                }

                return {
                    ...item,
                    note
                }
            } else if (type === EnumMsgType.偷窃信息) {
                // 提取关键信息
                const res = item.content.match(stoleReg) || []
                const [_, subject, object, objectId] = res

                const note: MomoDiscordMsg = {
                    ts,
                    type: EnumMsgType.偷窃信息,
                    key: `${ts}_${subject}_${objectId}`,
                    subject,
                    object,
                    objectId,
                    origin: item.content
                }

                return {
                    ...item,
                    note
                }
            }
            return item

        })

        ingamenewsPush(msgs.filter(item => item.note).map(item => item.note)).then(res=>{
            if(res?.data?.code==='000000'){
                // 立刻刷新查一下
                chrome.runtime.sendMessage({ type: "mvp_refresh" })
            }
        })

        // 发送给Background存db
    } catch (e) {
        console.log('e', e)
    }
})

export default function () {
    return <InjectRoot>
        <ToolBar type='momocord'></ToolBar>
    </InjectRoot>
}