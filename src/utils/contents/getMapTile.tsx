export const tileEls: Record<string, HTMLDivElement> = {}

function getMapName(el: HTMLDivElement) {
    const title = el.querySelector('table .tt-title')
    const text = title.childNodes?.[1]

    if (text) {
        return text.textContent.match(/\((.+)\)/)?.[1]
    }
}

/**
 * 界面加载后调用
 * 
 * 获取所有带有 地图名称 的 地图块的 dom 对象引用
 * 存储到一个以地图名称为key 的object中
 */
export function getAllMapRelateContainer() {
    const tooltips = document.querySelectorAll<HTMLDivElement>('.tooltip')

    // 获取地图名称
    for (let i = 0; i < tooltips.length; i++) {
        const el = tooltips[i]
        const mapName = getMapName(el as any)

        if (mapName) {
            tileEls[mapName] = el
        }
    }

}

/**
 * 获取用于相对定位地图的 元素
 */
export function getMapTile(map_name: string) {
    return tileEls[map_name]
}