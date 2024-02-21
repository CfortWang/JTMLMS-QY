import Vue from 'vue'
import { findHashRightsColumn } from '@/api/platform/desktop/column'
// CountTo 组件 === dashboard需要的
import CountTo from 'vue-count-to'
// 引入 ECharts 主模块
import 'echarts'
// echarts 组件
import VueECharts from 'vue-echarts'

// // 日历组件
import FullCalendar from '@/components/ibps-fullcalendar'
import IbpsMarquee from '@/components/ibps-marquee'

// 工具栏
import IbpsDesktopToolbar from './toolbar'
import '@/assets/styles/pages/dashboard.scss'

import { buildComponent } from './util'
Vue.component('count-to', CountTo)
Vue.component('v-chart', VueECharts)
Vue.component('v-full-calendar', FullCalendar)
Vue.component('ibps-desktop-toolbar', IbpsDesktopToolbar)
Vue.component('ibps-marquee', IbpsMarquee)

let init = false
const components = []

export function initColumn (systemAlias) {
    findHashRightsColumn({
        systemAlias: systemAlias
    }).then(response => {
        const dataResult = response.data
        // 构建组件
        dataResult.forEach(column => {
            const name = `ibps-desktop-${column.alias}`
            Vue.component(name, (resolve, reject) => {
                resolve(buildComponent(name, column))
            })
            components.push(name)
        })
        init = true
    }).catch((err) => {
        init = true
        console.error(err)
    })
}

/**
 * 是否初始化
 */
export function isInit () {
    return init
}

export function getComponents () {
    return components
}
