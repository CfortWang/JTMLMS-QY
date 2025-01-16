<template>
    <div style="width: 98%;height: 98%;overflow: hidden;padding: 1%;">
        <div class="title" style="vertical-align: top; height: 10%;font-size: 24px;color: white;font-weight:600;">{{ title }}</div>
        <div v-show="showChart" style="width:100%;height: 87%;display: flex;justify-content: center;">
            <dv-scroll-board :key="scrollBoardKey" :config="configData" style="width:100%;height:100%;font-size: 12px" />
        </div>
        <div v-show="!showChart" :class="$style.nullShow">暂无数据</div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object
        },
        title: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            scrollBoardKey: 0,
            configData: {},
            showChart: false
        }
    },
    watch: {
        value: {
            handler (newVal, oldVal) {
                if (newVal.data.length > 0) {
                    this.configData = { ...newVal }
                    this.scrollBoardKey++
                    this.showChart = true
                } else {
                    this.shoshowChartw = false
                }
            },
            deep: true
            // immediate: true
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
    .nullShow{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        height: 85%;
    }
</style>
