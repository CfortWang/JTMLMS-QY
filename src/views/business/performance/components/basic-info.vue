<template>
    <div class="info-container">
        <div class="info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验基础信息</span>
            </div>
            <div class="form-container">
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="部门" prop="bianZhiBuMen" :show-message="false">
                            <el-select
                                v-model="pageInfo.bianZhiBuMen"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择部门"
                            >
                                <el-option
                                    v-for="item in deptList"
                                    :key="item.positionId"
                                    :label="item.positionName"
                                    :value="item.positionId"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="实验项目" prop="shiYanXiangMu" :show-message="false">
                            <el-input
                                v-model="pageInfo.shiYanXiangMu"
                                type="text"
                                clearable
                                show-word-limit
                                :maxlength="64"
                                :disabled="readonly"
                                placeholder="请输入实验项目"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="实验方法" prop="shiYanFangFa" :show-message="false">
                            <el-input
                                v-model="pageInfo.shiYanFangFa"
                                type="text"
                                clearable
                                show-word-limit
                                :maxlength="64"
                                :disabled="readonly"
                                placeholder="请输入实验方法"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="样本类型" prop="yangBenLeiXing" :show-message="false">
                            <el-input
                                v-model="pageInfo.yangBenLeiXing"
                                type="text"
                                clearable
                                show-word-limit
                                :maxlength="64"
                                :disabled="readonly"
                                placeholder="请输入样本类型"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="实验仪器" prop="shiYanYiQi" :show-message="false">
                            <el-input
                                v-model="pageInfo.shiYanYiQi"
                                type="text"
                                clearable
                                show-word-limit
                                :maxlength="64"
                                :disabled="readonly"
                                placeholder="请输入实验仪器"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="仪器编号" prop="yiQiBianHao" :show-message="false">
                            <el-input
                                v-model="pageInfo.yiQiBianHao"
                                type="text"
                                clearable
                                show-word-limit
                                :maxlength="64"
                                :disabled="readonly"
                                placeholder="请输入仪器编号"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="开始时间" prop="kaiShiShiJian" :show-message="false">
                            <el-date-picker
                                v-model="pageInfo.kaiShiShiJian"
                                type="datetime"
                                clearable
                                align="right"
                                value-format="yyyy-MM-dd HH:mm"
                                format="yyyy-MM-dd HH:mm"
                                class="date-picker"
                                :picker-options="startPickerOptions"
                                :disabled="readonly"
                                placeholder="请选择实验开始时间"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间" prop="jieShuShiJian" :show-message="false">
                            <el-date-picker
                                v-model="pageInfo.jieShuShiJian"
                                type="datetime"
                                clearable
                                align="right"
                                value-format="yyyy-MM-dd HH:mm"
                                format="yyyy-MM-dd HH:mm"
                                class="date-picker"
                                :picker-options="endPickerOptions"
                                :disabled="readonly"
                                placeholder="请选择实验结束时间"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="实验操作者" prop="bianZhiRen" :show-message="false">
                            <el-select
                                v-model="pageInfo.bianZhiRen"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择实验操作者"
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
                        <el-form-item label="评价创建者" prop="createBy" :show-message="false">
                            <el-select
                                v-model="pageInfo.createBy"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择评价创建者"
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
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="结果单位" prop="jieGuoDanWei" :show-message="false">
                            <el-input
                                v-model="pageInfo.jieGuoDanWei"
                                type="text"
                                clearable
                                show-word-limit
                                :maxlength="16"
                                :disabled="readonly"
                                placeholder="请输入结果单位"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="保留小数位" prop="baoLiuXiaoShu" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.baoLiuXiaoShu"
                                type="number"
                                :min="1"
                                :max="4"
                                :precision="0"
                                :disabled="readonly"
                                placeholder="请选择保留小数位"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="beiZhu" :show-message="false">
                            <el-input
                                v-model="pageInfo.beiZhu"
                                type="textarea"
                                clearable
                                show-word-limit
                                :maxlength="512"
                                :rows="1"
                                :autosize="readonly"
                                :disabled="readonly"
                                placeholder="请输入其他备注信息"
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
        const that = this
        const { userList = [], deptList = [], userId } = this.$store.getters || {}
        return {
            userList,
            deptList: deptList.filter(i => i.depth === 4),
            pageInfo: this.info,
            startPickerOptions: {
                disabledDate (time) {
                    const t = new Date(time)
                    // 禁用结束日期之后日期
                    if (that.info.jieShuShiJian) {
                        const end = new Date(that.info.jieShuShiJian)
                        return t.getTime() > end.getTime()
                    }
                    return t.getTime() >= Date.now()
                }
            },
            endPickerOptions: {
                disabledDate (time) {
                    const t = new Date(time)
                    // 禁用当前日期之后和开始日期之前的日期
                    if (that.info.kaiShiShiJian) {
                        const start = new Date(that.info.kaiShiShiJian)
                        return t.getTime() < start.getTime() || t.getTime() >= Date.now()
                    }
                    return t.getTime() >= Date.now()
                }
            }
        }
    },
    watch: {
        info: {
            handler (val) {
                // 浅拷贝，数据父子组件间双向传递
                this.pageInfo = val || {}
            },
            immediate: true,
            deep: true
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
                    ::v-deep {
                        .el-form-item {
                            margin-bottom: 0 !important;
                            .el-form-item__label {
                                font-size: 14px !important;
                                color: #606266;
                            }
                            .el-form-item__content {
                                .el-input, .el-select, .el-input-number {
                                    width: 100%;
                                }
                                .el-textarea .el-input__count {
                                    padding: 0 5px;
                                    line-height: initial;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
