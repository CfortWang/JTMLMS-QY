<template>
    <div class="info-container">
        <div class="conclusion info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验结论</span>
            </div>
            <div v-if="$utils.isNotEmpty(expResult)" class="form-container">
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="结论" prop="shiYanJieLun" :show-message="false">
                            <div v-if="pdf === 'pdf'" v-html="expResult" />
                            <ibps-ueditor v-else v-model="expResult" :config="ueditorConfig" :readonly="readonly" />

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="实验附件" prop="fuJian" :show-message="false">
                            <ibps-attachment
                                v-model="expFiles"
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
            <el-empty v-else description="导入实验数据后查看" />
        </div>
    </div>
</template>
<script>
export default {
    components: {
        IbpsAttachment: () => import('@/business/platform/file/attachment/selector'),
        IbpsUeditor: () => import('@/components/ibps-ueditor')
    },
    props: {
        result: {
            type: String,
            default: ''
        },
        files: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        },
        pdf: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userList = [] } = this.$store.getters || {}
        return {
            userList,
            expResult: this.result,
            expFiles: this.files,
            pageInfo: null,
            ueditorConfig: {
                autoHeightEnabled: true,
                initialFrameHeight: 240,
                initialFrameWidth: '100%',
                initialStyle: 'body { font-size: 14px; }'
            }
        }
    },
    // computed: {
    //     expResult () {
    //         return this.result
    //     }
    // },
    watch: {
        result (val) {
            this.expResult = val
        },
        expFiles: {
            handler (val, oldVal) {
                this.$emit('updateData', { fuJian: val })
            }
        }
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
    }
</style>
