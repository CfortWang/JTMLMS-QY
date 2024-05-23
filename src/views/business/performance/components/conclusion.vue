<template>
    <div class="info-container">
        <div class="conclusion info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验结论</span>
            </div>
            <div v-if="pageInfo" class="form-container">
                <!-- <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="审核人" prop="shenHeRen" :show-message="false">
                            <el-select
                                v-model="pageInfo.shenHeRen"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in userList"
                                    :key="item.userId"
                                    :label="item.userName"
                                    :value="item.userId"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报告时间" prop="baoGaoShiJian" :show-message="false">
                            <el-date-picker
                                v-model="pageInfo.baoGaoShiJian"
                                type="datetime"
                                clearable
                                align="right"
                                :default-value="new Date()"
                                value-format="yyyy-MM-dd HH:mm"
                                format="yyyy-MM-dd HH:mm"
                                class="date-picker"
                                disabled
                            />
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="结论" prop="shiYanJieLun" :show-message="false">
                            <el-input
                                v-model="pageInfo.shiYanJieLun"
                                type="textarea"
                                :rows="4"
                                :autosize="readonly ? { minRows: 2, maxRows: 6 } : false"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="实验附件" prop="fuJian" :show-message="false">
                            <ibps-attachment
                                v-model="pageInfo.fuJian"
                                allow-download
                                download
                                multiple
                                accept="*"
                                store="id"
                                :readonly="readonly"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {
        IbpsAttachment: () => import('@/business/platform/file/attachment/selector')
    },
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userList = [] } = this.$store.getters || {}
        return {
            userList,
            pageInfo: null
        }
    },
    watch: {
        pageInfo: {
            handler (val, oldVal) {
                this.$emit('updateData', val)
            },
            deep: true
        }
    },
    mounted () {
        const { shenHeRen, baoGaoShiJian, shiYanJieLun, fuJian } = this.info || {}
        this.pageInfo = { shenHeRen, baoGaoShiJian, shiYanJieLun, fuJian }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .info-item {
            .form-container {
                padding: 10px;
                background: #f5f5f5;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                overflow: hidden;
                .form-row {
                    padding: 5px 0;
                    border-top: 1px solid #e6e6e6;
                    &:first-child {
                        border-top: none;
                        padding-top: 0;
                    }
                    &:last-child {
                        padding-bottom: 0;
                    }
                }
            }
        }
        .conclusion .form-container {
            max-height: 300px;
            overflow-y: auto;
        }
    }
</style>
