import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { getAllMapRelateContainer, getMapTile } from "./uitls/contents/getMapTile"
import { renderMvpTarget } from "./uitls/contents/renderMvpTarget"
import injectCss from "data-text:~inject.style.css"
import { useEffect } from "~node_modules/@types/react"

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
  `
  document.head.appendChild(style)
}

export const config: PlasmoCSConfig = {
  matches: ["https://ragnaboards.net/*"],
  all_frames: true,
}

inject()

getAllMapRelateContainer()


renderMvpTarget()



const CustomButton = () => {
  return <button>Custom button</button>
}

export default CustomButton