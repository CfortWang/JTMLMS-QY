<template>
    <div class="calendar-alert">
        <el-dialog
            title="近期日程提醒"
            :visible.sync="dialogFormVisible"
            width="30%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <div style="height: 50vh; overflow-y: auto;">
                <div
                    v-for="(value, key) in calendarAlertData"
                    :key="key"
                    class="item-container"
                >
                    <div
                        class="start-time"
                        :class="{ alertcolor: new Date() > new Date(key) }"
                    >
                        {{ key }}:
                    </div>
                    <div v-for="(item, index) in value" :key="item.id" class="message">
                        {{ index + 1 }}.{{ item.emergencyState | emergencyFilter }}{{ item.title }}
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-checkbox v-model="checked">今日不再提醒</el-checkbox>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    filters: {
        emergencyFilter (value) {
            if (value === '1') {
                return '【急】'
            } else if (value === '2') {
                return '【重】'
            } else if (value === '3') {
                return '【轻】'
            } else {
                return '【缓】'
            }
        }
    },
    props: {
        calendarAlertData: {
            default: () => {},
            type: Object
        }
    },
    data () {
        return {
            dialogFormVisible: false,
            checked: false
        }
    },
    methods: {
        open () {
            this.dialogFormVisible = true
        },
        close () {
            this.dialogFormVisible = false
        },
        confirm () {
            this.dialogFormVisible = false
            this.$emit('onCalendarAlert', this.checked)
        }
    }
}
</script>

<style lang="scss" scoped>
.calendar-alert {
    .item-container {
        margin: 6px 6px 12px 6px;
    }
    .start-time {
        font-weight: bold;
        color: #333;
        margin-left: 10px;
        font-size: 18px;
        margin-bottom: 4px;
    }
    .message {
        color: #666;
        margin-left: 16px;
        font-size: 15px;
        margin-bottom: 4px;
    }
    .dialog-footer {
        display: flex;
        justify-content: space-between;
    }
    .alertcolor {
        color: red;
    }
}
</style>
