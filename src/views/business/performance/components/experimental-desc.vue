<template>
    <div class="info-container">
        <div class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验步骤</span>
                <el-tooltip effect="dark" :content="collapseStatus.step ? '收缩' : '展开'" placement="bottom">
                    <el-button
                        class="collapse-btn"
                        size="mini"
                        :icon="collapseStatus.step ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                        @click="toggleCollapse('step')"
                    />
                </el-tooltip>
            </div>
            <div v-show="collapseStatus.step" class="step" v-html="step" />
        </div>
        <div class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>判断标准</span>
                <el-tooltip effect="dark" :content="collapseStatus.criterion ? '收缩' : '展开'" placement="bottom">
                    <el-button
                        class="collapse-btn"
                        size="mini"
                        :icon="collapseStatus.criterion ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                        @click="toggleCollapse('criterion')"
                    />
                </el-tooltip>
            </div>
            <div v-show="collapseStatus.criterion" class="step" v-html="criterion" />
        </div>
        <div v-if="formulas.length" class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验公式</span>
                <el-tooltip effect="dark" :content="collapseStatus.formula ? '收缩' : '展开'" placement="bottom">
                    <el-button
                        class="collapse-btn"
                        size="mini"
                        :icon="collapseStatus.formula ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                        @click="toggleCollapse('formula')"
                    />
                </el-tooltip>
            </div>
            <div v-show="collapseStatus.formula" class="formula-box">
                <div v-for="item in formulas" :key="item.key" class="formula-item">
                    <div>{{ item.label }}</div>
                    <div>{{ item.value }}</div>
                </div>
            </div>
        </div>
        <div v-if="references" class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>参考资料</span>
                <el-tooltip effect="dark" :content="collapseStatus.references ? '收缩' : '展开'" placement="bottom">
                    <el-button
                        class="collapse-btn"
                        size="mini"
                        :icon="collapseStatus.references ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                        @click="toggleCollapse('references')"
                    />
                </el-tooltip>
            </div>
            <ibps-attachment
                v-show="collapseStatus.references"
                v-model="references"
                allow-download
                download
                multiple
                accept="*"
                store="id"
                readonly
            />
        </div>
        <!-- <template v-for="(item, index) in infoList">
            <div v-if="item.dependOn" :key="index" class="design info-item">
                <div class="title">
                    <i class="ibps-icon-star" />
                    <span>{{ item.title }}</span>
                    <el-tooltip effect="dark" :content="item.collapse ? '收缩' : '展开'" placement="bottom">
                        <el-button
                            class="collapse-btn"
                            size="mini"
                            :icon="item.collapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                            @click="toggleCollapse(item.key)"
                        />
                    </el-tooltip>
                </div>
                <template v-if="item.key === 'formula'">
                    <div v-show="collapseStatus.formula" class="formula-box">
                        <div v-for="f in formulas" :key="f.key" class="formula-item">
                            <div>{{ f.label }}</div>
                            <div>{{ f.value }}</div>
                        </div>
                    </div>
                </template>
                <template v-else-if="item.key === 'references'">
                    <ibps-attachment
                        v-model="references"
                        allow-download
                        download
                        multiple
                        accept="*"
                        store="id"
                        readonly
                    />
                </template>
                <template v-else>
                    <div v-show="item.collapse" class="step" v-html="item.value" />
                </template>
            </div>
        </template> -->
    </div>
</template>
<script>
import MathJax from '@/utils/MathJax'
export default {
    components: {
        IbpsAttachment: () => import('@/business/platform/file/attachment/selector')
    },
    props: {
        step: {
            type: String,
            default: ''
        },
        criterion: {
            type: String,
            default: ''
        },
        formulas: {
            type: Array,
            default: () => []
        },
        references: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            collapseStatus: {
                step: true,
                criterion: true,
                formula: false,
                references: true
            },
            infoList: [
                {
                    key: 'step',
                    title: '实验步骤',
                    collapse: true,
                    value: this.step,
                    dependOn: true
                },
                {
                    key: 'criterion',
                    title: '判定标准',
                    collapse: true,
                    value: this.criterion,
                    dependOn: true
                },
                {
                    key: 'formula',
                    title: '实验公式',
                    collapse: true,
                    value: this.formulas,
                    dependOn: this.formulas && this.formulas.length
                },
                {
                    key: 'references',
                    title: '参考资料',
                    collapse: true,
                    value: this.references,
                    dependOn: this.references
                }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.formatMath()
        })
    },
    methods: {
        formatMath () {
            setTimeout(() => {
                if (MathJax.isMathjaxConfig) {
                    MathJax.initMathjaxConfig()
                }
                MathJax.MathQueue('.formula-box')
            }, 500)
        },
        toggleCollapse (key) {
            // this.infoList.forEach(item => {
            //     if (item.key === key) {
            //         item.collapse = !item.collapse
            //     }
            // })
            // console.log(this.infoList)
            this.$set(this.collapseStatus, key, !this.collapseStatus[key])
        }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .design {
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
            .collapse-btn {
                float: right;
                position: relative;
                line-height: 1;
                cursor: pointer;
                background: #fff;
                // border: 1px solid #dcdfe6;
                border: none;
                color: #606266;
                text-align: center;
                font-weight: blod;
                font-size: 18px;
                padding: 1px 6px !important;
            }
            .step {
                white-space: pre-wrap;
                color: #606266;
                font-size: 14px;
                line-height: 1.5;
            }
            .formula-item {
                display: flex;
                justify-content: center;
                align-items: center;
                > div:nth-child(2) {
                    margin: 0 10px;
                }
            }
        }
    }
</style>
