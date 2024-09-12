<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="60%"
        append-to-body
        class="dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
        <div class="contain">
            <div class="form">
                <el-form ref="formRef" :model="form" label-width="120" :rules="rules">
                    <el-row class="item">
                        <el-col>
                            <el-form-item label="监测周期：" prop="period">
                                <el-select v-model="form.period" placeholder="请选择" size="mini" :clearable="true" style="width:100%" @change="periodChange()">
                                    <el-option
                                        v-for="item in periodList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.period" class="item">
                        <el-col>
                            <el-form-item label="监测频率：" prop="date">
                                <el-select
                                    v-if="form.period==='day' || form.period==='week'"
                                    v-model="form.date"
                                    :multiple="form.period==='day'"
                                    placeholder="请选择"
                                    size="mini"
                                    style="width:100%"
                                >
                                    <el-option
                                        v-for="item in weekDays"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                                <el-select v-if="form.period==='month'" v-model="form.date" placeholder="请选择" size="mini" style="width:100%">
                                    <el-option
                                        v-for="item in 28"
                                        :key="item"
                                        :label="`第${item}天`"
                                        :value="item"
                                    />
                                </el-select>
                                <div v-if="form.period==='repeat'" style="display:flex;align-items: center;width:100%">
                                    <el-select v-model="form.date" placeholder="请选择" size="mini" style="width:100%">
                                        <el-option
                                            v-for="item in 30"
                                            :key="item"
                                            :label="`每隔${item}天`"
                                            :value="item"
                                        />
                                    </el-select>
                                </div>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.period==='repeat'" class="item">
                        <el-col>
                            <el-form-item label="开始时间：" prop="startTime">
                                <el-date-picker
                                    v-model="form.startTime"
                                    :clearable="false"
                                    type="date"
                                    placeholder="选择监测开始时间"
                                    :picker-options="pickerOptions"
                                    value-format="yyyy-MM-dd"
                                    size="mini"
                                    style="width:100%"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" icon="ibps-icon-save" @click="handleConfirm">确 定</el-button>
            <el-button size="mini" icon="ibps-icon-close" @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import dayjs from 'dayjs'

export default {
    props: {
        params: {
            type: Object,
            default: () => {}
        },
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            title: '',
            rules: {
                period: [
                    { required: true, message: '请选择监测周期', trigger: 'blur' }
                ],
                date: [
                    { required: true, message: '请选择查询的日期', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '请选择开始时间', trigger: 'blur' }
                ]
            },
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() < (Date.now() - (24 * 60 * 1000 * 60))
                }
            },
            form: {
                period: '',
                date: '',
                startTime: dayjs().format('YYYY-MM-DD')
            },
            periodList: [{ label: '日监测', value: 'day' }, { label: '周监测', value: 'week' }, { label: '月监测', value: 'month' }, { label: '按时间间隔监测', value: 'repeat' }],
            weekDays: [{ label: '周一', value: 1 }, { label: '周二', value: 2 }, { label: '周三', value: 3 }, { label: '周四', value: 4 }, { label: '周五', value: 5 }, { label: '周六', value: 6 }, { label: '周日', value: 7 }]
        }
    },
    mounted () {
        this.form = this.params
        if (!this.params.rate) {
            this.title = '新增'
        } else {
            this.form = this.params
            this.title = '修改'
        }
        // this.form = this.params
    },
    methods: {
        handleClose () {
            this.$emit('update:dialogVisible', false)
        },
        async handleConfirm () {
            try {
                await this.$refs.formRef.validate()
                let rate = '每天'
                switch (this.form.period) {
                    case 'day':
                        if (this.form.date.length !== 7) {
                            this.form.date.sort((a, b) => a - b)
                            rate = '每周' + this.form.date.join(',')
                        }
                        break
                    case 'week':
                        rate = '每周' + this.form.date
                        break
                    case 'month':
                        rate = '每个月第' + this.form.date + '天'
                        break
                    case 'repeat':
                        rate = this.form.startTime + '起每隔' + this.form.date + '天'
                        break
                    default:
                        break
                }
                this.form.rate = rate
                this.$emit('submit', this.form, this.params.$index)
                this.handleClose()
            } catch (error) {
                console.log(error)
            }
        },
        periodChange () {
            if (this.form.period === 'day') {
                this.form.date = []
            } else {
                this.form.date = ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.contain{
    padding: 20px;
    .form{
        .item{
            width: 600px;
        }
    }
}

::v-deep{
    .el-form-item__content{
        display: flex;
    }
}
</style>
