import axios from '@/utils/request'
import type { MomoDiscordMsg } from '@/datas/note'

// 推送 ingamenews
export function ingamenewsPush(params: MomoDiscordMsg[]) {
    return axios.post('/momoro/ingamenews/push', params)
}

export function getMvpDeathNote() {
    return axios.get('/momoro/mvp/getCurrentStatus')
}

export function getRewardRank() {
    return axios.get('/momoro/getRewardRank')
}

export function searchNews(params: {
    current: number,
    pageSize: number,
    search: string,
    type: string
}) {
    return axios.get('/momoro/rewards/list', { params })
}