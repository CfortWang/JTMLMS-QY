<template>
    <div style="width: 98%;height: 98%;overflow: hidden;padding: 1%;">
        <div class="title" style="vertical-align: top; height: 10%;font-size: 24px;color: white;font-weight:600;">{{ title }}</div>
        <div v-show="showChart" style="width:100%;height: 88%;display: flex;justify-content: center;">
            <dv-scroll-board :config="configData" style="width:100%;height:100%" />
        </div>
        <div v-if="!showChart" style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
            <div style="color: #c7c7c7">目前无数据</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
        },
        title: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            configData: {},
            showChart: true
        }
    },
    watch: {
        value: {
            handler (newVal, oldVal) {
                this.configData = { ...newVal }
            },
            deep: true,
            immediate: true
        }
    },
    mounted () {
        const this_ = this
        if (this_.value[0] == 999) {
            this.showChart = false
            return
        }
    }

}
</script>
<style lang="scss" module>
</style>
