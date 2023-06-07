import Vue from 'vue'
import { PopupManager } from '@/plugins/element-ui/src/utils/popup'
import utils from './util'

const popup = {

  /**
     * zxh 修复zindex 不是最高的被遮住
     */
  getZIndex() {
    let zIndex = (Vue.prototype.$ELEMENT || {}).zIndex || 2000
    if (utils.isNotEmpty(document.all)) {
      const allEl = [...document.all]
      if (Array.isArray(allEl)) {
        allEl.forEach((el) => {
          const z = Number(window.getComputedStyle(el).zIndex) || 0
          if (z > zIndex) { zIndex = z }
        })
      }
    }
    const z = PopupManager.zIndex
    if (zIndex >= z) {
      for (let i = 0; i < (zIndex - z + 1); i++) {
        PopupManager.nextZIndex()
      }
      zIndex = PopupManager.zIndex
    } else {
      zIndex = z
    }
    return zIndex
  }
}

export default popup
