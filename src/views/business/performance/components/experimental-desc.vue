<template>
    <div class="info-container">
        <div class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验步骤</span>
            </div>
            <div class="step">{{ stepDesc }}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        stepDesc: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .design {
            .step {
                white-space: pre-wrap;
            }
        }
    }
</style>
