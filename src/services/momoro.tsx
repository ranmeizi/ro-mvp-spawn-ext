import axios from '~src/utils/request'
import type { MomoDiscordMsg } from '~src/datas/note'

// 推送 ingamenews
export function ingamenewsPush(params:MomoDiscordMsg[]) {
    return axios.post('/momoro/ingamenews/push', params)
}

export function getMvpDeathNote(){
    return axios.get('/momoro/mvp/getCurrentStatus')
}