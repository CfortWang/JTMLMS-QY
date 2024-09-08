<template>
    <el-dialog
        ref="dialog"
        :title="title"
        :visible.sync="scheduleDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :fullscreen="fullscreen"
        class="my-schedule"
        top="10vh"
        width="60%"
        @open="openDialog"
        @close="closeDialog"
    >
        <v-full-calendar
            ref="calendar"
            :options="scheduleConfig"
            :style="{height: '100%', width: '100%'}"
        />
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        scheduleConfig: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            title: '我的排班',
            fullscreen: true,
            scheduleDialogVisible: this.visible
        }
    },
    methods: {
        openDialog () {
            this.scheduleDialogVisible = true
        },
        closeDialog () {
            this.scheduleDialogVisible = false
        },
        getScheduleData () {

        }
    }
}
</script>

<style lang="scss" scoped>
    .my-schedule {
        ::v-deep {
            .el-dialog__body {
                padding: 20px 0 !important;
                height: calc(100vh - 100px);
            }
        }
    }
</style>
