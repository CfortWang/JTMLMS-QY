<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="500px"
        class="dialog1 test-dialog"
        @close="closeDialog"
    >
        <el-form ref="ruleForm" :model="formList" label-width="80px">
            <el-form-item
                label="签出时间"
                prop="dataTime"
                :rules="[
                    { required: true, message: '签出时间不能为空!' },
                    { validator: validateDataTime, trigger: 'change' }
                ]"
            >
                <el-date-picker
                    v-model="formList.dataTime"
                    type="datetime"
                    placeholder="选择签出时间"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    :picker-options="endPickerOptions"
                    style="width: 96%"
                />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataList: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        const that = this
        return {
            title: '签出',
            dialogVisible: this.visible,
            formList: {
                dataTime: this.formatDate(new Date())
            },
            toolbars: [{ key: 'confirm' }, { key: 'cancel' }],
            endPickerOptions: {
                disabledDate (time) {
                    const t = new Date(time)
                    const { jin_ru_shi_jian_: startTime } = that.dataList
                    // 禁用当前时间之后和来访时间之前的时间
                    if (startTime) {
                        const start = new Date(startTime)
                        return t.getTime() < start.getTime() || t.getTime() > Date.now()
                    }
                    return t.getTime() > Date.now()
                }
            }
        }
    },
    watch: {
        visible (val) {
            this.dialogVisible = val
        }
    },
    methods: {
        validateDataTime (rule, value, callback) {
            if (value === '') {
                callback(new Error('签出时间不能为空！'))
            } else {
                const joinTime = new Date(
                    this.dataList.jin_ru_shi_jian_.replace(' ', 'T')
                )
                const selectedTime = new Date(value.replace(' ', 'T'))
                const currentTime = new Date()

                // 检查日期是否有效
                if (
                    isNaN(joinTime.getTime()) ||
                    isNaN(selectedTime.getTime())
                ) {
                    callback(new Error('进入或签出时间有误！'))
                    return
                }

                // 签出时间 > 进入时间
                if (joinTime >= selectedTime) {
                    callback(new Error('签出时间不能早于进入时间！'))
                    return
                }

                // 签出时间 < 当前时间
                if (selectedTime >= currentTime) {
                    callback(new Error('签出时间不能晚于当前时间！'))
                    return
                }
                callback()
            }
        },
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const params = { li_kai_shi_jian_: this.formList.dataTime }
                    const updateParamsRecord = {
                        tableName: 't_wlrydjb', // 数据库名
                        updList: [
                            {
                                where: {
                                    id_: this.dataList.id_ // 修改数据的id
                                },
                                param: params // 要修改的数据
                            }
                        ]
                    }
                    this.$common
                        .request('update', updateParamsRecord)
                        .then((res) => {
                            this.$message.success('签出成功！')
                            this.closeDialog()
                        })
                        .catch(() => {
                            this.$message.error('签出失败！')
                            this.closeDialog()
                        })
                } else {
                    console.log('校验失败')
                    return false
                }
            })
        },
        closeDialog () {
            this.$emit('close', false)
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'confirm':
                    this.submitForm('ruleForm')
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        formatDate (date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}`
        }
    }
}
</script>

<style lang="scss">
.dialog1 {
    .el-form {
        margin: 30px 0;
    }
    .el-dialog__footer {
        text-align: center !important;
    }
    .el-form-item__error {
        top: 120% !important;
    }
}
</style>
