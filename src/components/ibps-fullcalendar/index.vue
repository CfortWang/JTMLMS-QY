<template>
    <full-calendar
        ref="fullCalendar"
        :options="fullCalendarOptions"
    />
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
// 依赖引入不生效，需要手动引入对应依赖的js文件
import interactionPlugin from './interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import lang from '@/locales/fullcalendar'
import I18n from '@/utils/i18n'

import '@fullcalendar/bootstrap/main.css'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'

export default {
    components: {
        FullCalendar
    },
    props: {
        options: {
            type: Object,
            default: () => ({})
        },
        // 新增配置项：是否隐藏其他月份日期
        hideOtherMonthDays: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                fixedWeekCount: false,
                views: {
                    dayGridMonth: {
                        showNonCurrentDates: !this.hideOtherMonthDays // 是否隐藏非当前月日期
                    }
                }
            }
        }
    },
    computed: {
        fullCalendarOptions () {
            const options = Object.assign({
                // locales: lang.locales,
                // locale: this.locale
            }, this.calendarOptions, this.options)
            return options
        },
        locale () {
            return lang.localeMap[I18n.getLanguage()]
        }
    },
    watch: {
        hideOtherMonthDays: {
            handler (newVal) {
                const calendarApi = this.$refs.fullCalendar?.getApi()
                if (calendarApi) {
                    calendarApi.setOption('views', {
                        dayGridMonth: {
                            showNonCurrentDates: !this.hideOtherMonthDays // 根据 prop 反转逻辑
                        }
                    })
                    calendarApi.render() // 强制重新渲染
                }
            },
            immediate: true
        }
    }
}
</script>
