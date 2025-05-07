<template>
    <el-dialog
        :visible.sync="visible"
        title="选择打卡班次"
        width="400px"
        @close="handleClose">
        <div class="schedule-dialog">
            <el-radio-group v-model="selectedValue">
                <el-radio
                    v-for="schedule in schedules"
                    :key="schedule"
                    :label="schedule"
                    style="display: block; margin: 10px 0;">
                    {{ schedule }}
                </el-radio>
            </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        schedules: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            selectedValue: ''
        }
    },
    watch: {
        schedules (newVal) {
            if (newVal) {
                this.selectedValue = newVal
            }
        }
    },
    methods: {
        handleConfirm () {
            if (!this.selectedValue) {
                this.$message.warning('请选择一个班次')
                return
            }
            this.$emit('confirm', this.selectedValue)
            this.visible = false
        },
        handleClose () {
            this.$emit('close')
        }
    }
}
</script>
<style scoped>
  .schedule-dialog {
    padding: 0 10px;
  }
</style>