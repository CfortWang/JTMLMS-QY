<template>
    <div class="training-statistics">
        <div ref="echart" />
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {

        }
    },
    watch: {
        config: {
            handler (val) {
                this.$nextTick(() => {
                    const echart = echarts.init(this.$refs.echart)
                    echart.setOption(val)
                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
                    echart.resize({ height: viewportHeight * 0.4 })
                })
            },
            immediate: true,
            deep: true
        }
    },
    mounted () {
    },
    methods: {

    }
}
</script>
