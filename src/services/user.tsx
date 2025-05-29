import request from '~src/utils/request'
import type { MomoDiscordMsg } from '~src/datas/note'

export function igamenewsPush(params:MomoDiscordMsg[]) {
    return request('/momoro/ingamenews/push', { data: params })
}