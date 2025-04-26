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
    // 事件容器样式
    .fc-event {
      padding: 8px;
      border-radius: 4px;
      background-color: #ffffff !important;
      border-color: #e4e7ed !important;
      margin: 5px 10px 5px 10px;
      .event-header {
        //font-weight: bold;
        color: #606266;
        font-size: 14px;
        margin-bottom: 4px;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        width: 100%;
            > div {
                vertical-align: middle;
            }
      }
      .event-content{
        color: #606266;
        font-size: 14px;
        margin-bottom: 4px;
        line-height: 24px;
      }
      .event-button {
       text-align: right;
        margin-bottom: 4px;
      }
    }

    // 打卡按钮
    .clock-btn {
      border: none;
      color: white;
      background-color: #409EFF;
      border-radius: 4px;
      padding: 2px 8px;
      cursor: pointer;
      transition: opacity 0.3s;
      &:hover {
        opacity: 0.8;
      }
    }

    // 异常标识
    .abnormal-tag {
      color: #F5222D;
    }
    .normal-tag {
      color: #606266;
    }
  }
}
</style>
