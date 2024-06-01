<template>
    <div class="info-container">
        <div class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验步骤</span>
            </div>
            <!-- <div class="step">{{ step }}</div> -->
            <div class="step" v-html="step" />
        </div>
        <div class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>判断标准</span>
            </div>
            <div class="step" v-html="criterion" />
        </div>
        <div v-if="formulas.length" class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验公式</span>
            </div>
            <div class="formula-box">
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
            </div>
            <ibps-attachment
                v-model="references"
                allow-download
                download
                multiple
                accept="*"
                store="id"
                readonly
            />
        </div>
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
    mounted () {
        this.formatMath()
    },
    methods: {
        formatMath () {
            setTimeout(() => {
                this.$nextTick(() => {
                    if (MathJax.isMathjaxConfig) {
                        MathJax.initMathjaxConfig()
                    }
                    MathJax.MathQueue('.formula-box')
                })
            }, 500)
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
