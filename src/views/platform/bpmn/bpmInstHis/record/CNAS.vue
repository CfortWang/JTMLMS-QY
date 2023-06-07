<template>
    <testing-record :info="info"/>
</template>
<script>
    export default {
        components: {
            TestingRecord: () => import('./component/testingRecord')
        },
        data () {
            return {
                info: {
                    title: 'CNAS检测档案',
                    reportPath: '43罗湖/LHXBJY 检测报告',
                    type: 'CNAS'
                }
            }
        }
    }
</script>