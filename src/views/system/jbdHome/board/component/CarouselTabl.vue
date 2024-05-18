<template>
    <div style="width: 100%;height: 100%;background-color: rgba(6,30,93,.5);overflow: hidden;">
        <div class="title" style="vertical-align: top; height: 10%;font-size: 16px;color: white;">{{ title }}</div>
        <div v-show="showChart" style="width:100%;height: 90%;display: inline-block;background-color: #06163f;">
            <dv-scroll-board :config="configData" style="width:100%;height:100%" />
        </div>
        <div v-if="!showChart" style="background: #061237;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
            <div style="color: #c7c7c7">目前无数据</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {
                return {}
            }
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
        info: {
            handler (newVal, oldVal) {
                this.configData = { ...newVal }
            },
            deep: true,
            immediate: true
        }
    },
    mounted () {
        const this_ = this
        if (this_.info.data[0] == 999) {
            this.showChart = false
            return
        }
    }

}
</script>
<style lang="scss" module>
</style>
