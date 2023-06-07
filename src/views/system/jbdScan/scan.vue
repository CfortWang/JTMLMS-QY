<template>
  <div>
    {{ currentScan }}
    <component :is="currentScan" :scanVisible="scanVisible" :obj="obj" @scanOff="scanOff" />
  </div>
</template>

<script>
/* 共同调用类， 与脚本统一调用。*/
import facility from './goods/facility'
import material from './goods/material'
import sample from './goods/sample'
import sampleConfirmation from './goods/sampleConfirmation'
import manualConfirmation from './goods/manualConfirmation'
import tag from './goods/tag'
import deviceTag from './goods/deviceTag.vue'
import deviceVerificationTag from './goods/deviceVerificationTag.vue'
import deviceFailureTag from './goods/deviceFailureTag.vue'
import neishenzhuangtai from './goods/neishenzhuangtai'
import bwTag from './goods/bwTag.vue'
import fzrkTag from './goods/fzrkTag.vue'
import kucuntag from './goods/kucuntag.vue'
import orderOpen from './goods/orderOpen.vue'
import manualConfirmationSupplementary from './goods/manualConfirmationSupplementary.vue'

export default {
  components: {
    facility, material, sample, sampleConfirmation, manualConfirmation, tag,
    deviceTag, deviceVerificationTag, deviceFailureTag,
    neishenzhuangtai, bwTag, fzrkTag, kucuntag,orderOpen,manualConfirmationSupplementary
  },
  props: {
    currentScan: String,
    scanVisible: Boolean,
    obj: Array,
  },

  methods: {
    scanOff(val) {
      this.$emit('scanOff', val)
    }
  },
}
</script>
