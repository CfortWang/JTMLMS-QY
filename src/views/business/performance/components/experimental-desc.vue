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
export default {
    components: {
        IbpsAttachment: () => import('@/business/platform/file/attachment/selector')
    },
    props: {
        step: {
            type: String,
            default: ''
        },
        references: {
            type: String,
            default: ''
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
        }
    }
</style>
