<template>
    <div class="info-container">
        <div class="design info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验设计</span>
            </div>
            <div class="desc">
                最好选择2-3个代表研究项目医学决定水平浓度的低值和高值实验样本，分别做批间和日间重复测定。批内评价，将样品随机插入到病人样品中检测，连续做20次，计算批内精密度；在批内精密度符合要求的情况下，进行日间精密度实验，日间是每天做一次评价样品，连续做20次，确定日间精密度是否可以接受。
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
        }
    },
    data () {
        return {
            pageInfo: this.info
        }
    },
    computed: {

    },
    created () {
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .info-item {
            
        }
    }
</style>
