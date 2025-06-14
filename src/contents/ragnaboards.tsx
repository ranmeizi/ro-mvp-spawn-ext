import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { getAllMapRelateContainer, getMapTile } from "../utils/contents/getMapTile"
import { renderMvpTarget } from "../utils/contents/renderMvpTarget"
import { getMvpDeathNote } from "@/services/momoro"
import InjectRoot from "@/components/InjectRoot"
import Control from "@/components/Control"
import ToolBar from "@/components/ToolBar"
import '@/utils/CommandMsgHandler'
import ContextMenu from "@/components/ContextMenu"

// 定义要注入的 CSS
function inject() {
  const style = document.createElement("style")
  style.textContent = `
  .mvp-icon {
    position: absolute;
    height  : 64px;
    width   : 64px;

    left       : 50%;
    top        : 50%;
    margin-left: -32px;
    margin-top : -32px;

    opacity   : 0.7;
    transition: 0.15s;
}

.mvp-icon:hover {
    opacity: 1;
    filter:br
}

.tooltip>span{
  width:400px
}

.tooltip td{
  max-width:150px
}

.mvp-icon.dead>img{
  filter: brightness(0);
}

.mvp-icon.maybe>img{
  filter: brightness(0.5);
}

.mvp-icon.dead:hover:after {
    position: absolute;
    left    : 0;
    top     : 0;
    height  : 100%;
    width   : 100%;
    content : "";
    

    background-image: url("${chrome.runtime.getURL("assets/dead.png")}");
    background-repeat: no-repeat;
    background-origin: 50%, 50%;
    background-color: rgba(0,0,0,.3);
}

.mvp-icon.maybe:hover:after {
    position: absolute;
    left    : 0;
    top     : 0;
    height  : 100%;
    width   : 100%;
    content : "";

    background-image: url("${chrome.runtime.getURL("assets/question.png")}");
    background-repeat: no-repeat;
    background-origin: 50%, 50%;
    background-color: rgba(0,0,0,.3);
}

.mvp-icon img {
    object-fit: contain;
    height    : 100%;
    width     : 100%;
    filter: brightness(1);
}

.mvp-alarm {
    position:absolute;
    left:0;
    top:0;
    height:24px;
    width:24px;
}
    .mvp-alarm.active{
     background-image: url("${chrome.runtime.getURL("assets/fill-alarm.png")}");
    background-size:100% 100%;
      transform:rotateZ(-25deg)
    }
  `
  document.head.appendChild(style)
}

export const config: PlasmoCSConfig = {
  matches: ["https://ragnaboards.net/*"],
  all_frames: true,
}

// 注入css
inject()

// 初始化 dom 引用
getAllMapRelateContainer()

// 首次渲染
renderMvpTarget()

// 与 background 建立消息通道
const port = chrome.runtime.connect({ name: 'ragnaboards-port' });

// 监听来自 background 的消息
port.onMessage.addListener((msg) => {
  console.log('Received from bg:', msg);
  if (msg.type === 'mvp_status') {
    renderMvpTarget(msg.data)
  }
});

// 断开连接时清理（可选）
window.addEventListener('beforeunload', () => {
  port.disconnect();
});

export default function (props) {
  return <InjectRoot>
    <ToolBar type='ragnaboard'></ToolBar>
  </InjectRoot>
}