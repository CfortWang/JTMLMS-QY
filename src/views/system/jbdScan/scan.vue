<template>
    <div>
        {{ currentScan }}
        <component :is="currentScan" :scan-visible="scanVisible" :obj="obj" @scanOff="scanOff" />
    </div>
</template>

<script>
/* 共同调用类， 与脚本统一调用。*/
import deviceTag from './goods/deviceTag.vue'
import deviceVerificationTag from './goods/deviceVerificationTag.vue'
import deviceFailureTag from './goods/deviceFailureTag.vue'
import neishenzhuangtai from './goods/neishenzhuangtai'
import fengxiangkongzhi from './goods/fengxiangkongzhi'
import guanshenzhuangtai from './goods/guanshenzhuangtai'

export default {
    components: {
        deviceTag,
        deviceVerificationTag,
        deviceFailureTag,
        neishenzhuangtai,
        fengxiangkongzhi,
        guanshenzhuangtai
    },
    props: {
        currentScan: String,
        scanVisible: Boolean,
        obj: Array
    },

    methods: {
        scanOff (val) {
            console.log(val);
            this.$emit('scanOff', val)
        }
    }
}
</script>
