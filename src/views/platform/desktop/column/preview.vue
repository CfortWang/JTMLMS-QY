<template>
    <el-dialog
        ref="dialog"
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :fullscreen="fullscreen"
        class="desktop-preview-dialog"
        :class="fullscreen?'fullscreen':null"
        top="10vh"
        width="60%"
        @open="getFormData"
        @close="closeDialog"
    >
        <div
            v-if="init"
            v-loading="dialogLoading"
            :element-loading-text="$t('common.loading')"
            class="ibps-desktop-page"
        >
            <component
                :is="getComponentAlias(desktopColumn.alias)"
                :id="desktopColumn.id"
                :ref="desktopColumn.alias"
                :alias="desktopColumn.alias"
                :visible="componentVisible"
                :full-screen="fullscreen"
                @open="handleOpen"
                @close="handleClose"
                @action-event="actionEvent"
            />

        </div>
        <div v-if="!screen" slot="footer" class="el-dialog--center">
            <el-button icon="el-icon-circle-close" @click="closeDialog()">关闭</el-button>
        </div>
        <schedule-add :visible="calendarDialogVisible" :form="calendarDialogForm" @close="handleClose" @saveData="handleSaveData" @delData="handleDelData" />
    </el-dialog>
</template>
<script>
import Vue from 'vue'
import { get } from '@/api/platform/desktop/column'
import { buildComponent } from '@/views/system/dashboard/components/util'
import ScheduleAdd from '@/views/system/dashboard/templates/scheduleAdd'
export default {
    components: {
        ScheduleAdd
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        id: String,
        title: String,
        screen: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            dialogVisible: false,
            Visible: false,
            componentVisible: false,
            dialogLoading: false,
            fullscreen: false,
            init: false,
            desktopColumn: {},
            calendarToolbar: this.fullScreen ? [{ key: 'refresh' }] : [{ key: 'refresh' }, { key: 'fullscreen' }, { key: 'collapse' }],
            calendarDialogVisible: false,
            calendarDialogForm: {}
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        }
    },
    methods: {
        actionEvent (command) {
            if (this.screen) {
                this.closeDialog()
                return
            }
            if (command === 'fullscreen') {
                this.fullscreen = !this.fullscreen
            }
        },
        isScreen (refs) {
            this.$nextTick(() => {
                if (this.screen) {
                    refs['dialog'].$el.childNodes[0].childNodes[1].style.height = 100 + '%'
                }
            })
        },
        // 关闭当前窗口
        closeDialog () {
            this.init = false
            this.$emit('close', false)
        },
        getComponentAlias (alias) {
            return `ibps-desktop-preview-${alias}`
        },
        /**
         * 获取表单数据
         */
        getFormData () {
            this.dialogLoading = true
            this.fullscreen = !!this.screen
            this.isScreen(this.$refs)
            this.componentVisible = true
            get({
                desktopColumnId: this.id
            }).then(response => {
                const column = this.desktopColumn = response.data
                const name = this.getComponentAlias(column.alias)
                Vue.component(name, (resolve, reject) => {
                    resolve(buildComponent(name, column, true))
                })
                this.init = true
                this.dialogLoading = false
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        /**
         * 关于预览日历日程组件的方法及属性，在homePage也有相同的逻辑
         */
        // 关闭指定弹框
        handleClose (state) {
            switch (state) {
                case 'calendar':
                    this.calendarDialogVisible = false
                    break
                default:
                    break
            }
        },
        // 打开指定弹框
        handleOpen (state, dateArr, events,clickId) {
            const status = ['急', '重', '轻', '缓']
            const eventTrees = []
            switch (state) {
                case 'calendar':
                    this.calendarDialogVisible = true
                    for (const i of events) {
                        // 根据指定日期A获取A在时间区间内的数据
                        if (!((this.compareDates(i.start, dateArr[1]) > 0) || (this.compareDates(i.jieShuShiJian, dateArr[0]) < 0))) {
                            i.label = i.zhuangTai ? `【${status[Number(i.zhuangTai) - 1] ? status[Number(i.zhuangTai) - 1] : ''}】` + i.title : i.title
                            eventTrees.push(i)
                        }
                    }
                    if (eventTrees.length) {
                        this.calendarDialogForm = {
                            eventTrees
                        }
                    } else {
                        this.calendarDialogForm = {
                            eventTrees: []
                        }
                    }
                    this.calendarDialogForm.clickedDate = dateArr[0]
                    this.calendarDialogForm.clickId = clickId
                    break
                default:
                    break
            }
        },
        /**
         * date1(2024-01-01) 大于 date2(2023-01-01) 返回 1
         * date1 小于 date2 返回 -1
         * date1 等于 date2 返回 0
         */
        compareDates (date1, date2) {
            var time1 = new Date(date1).getTime()
            var time2 = new Date(date2).getTime()
            return Math.sign(time1 - time2) // 使用Math.sign()函数返回值为 -1, 0, 1
        },
        // 日历弹框组件保存时候的回调
        handleSaveData (param) {
            if (param.state === 'calendar') {
                this.$refs.myCalendar.setCalendarEvents(param)
            }
        },
        // 日历弹框组件删除日程时候的回调
        handleDelData (param) {
            if (param.state === 'calendar') {
                this.$refs.myCalendar.hanldeCalendardel(param)
            }
        }
    }
}
</script>
<style lang="scss">
    .desktop-preview-dialog{
        .el-dialog__body{
            height:  calc(65vh - 80px);
            .el-card{
                height: 100%;
                .el-card__body{
                    height: 85%;
                }
            }
        }
    }
    .fullscreen{
        .el-dialog__body{
            height:  calc(90vh - 80px);
            .el-card{
                height: 100%;
                .el-card__body{
                    height: 90%;
                }
            }
        }
    }
</style>
