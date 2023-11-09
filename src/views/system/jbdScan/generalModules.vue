<template>
    <div>
        <component :is="currentType" :show.sync="show" :general-list="generalList" @generalClose="generalClose" />
    </div>
</template>

<script>
/* 共同调用类， 与脚本统一调用。*/
import satisfaction from './satisfaction/satisfaction.vue'
import approve from './approve/approve.vue'
import orderOpen from './goods/orderOpen.vue'

export default {
    components: {
        satisfaction,
        approve,
        orderOpen
    },
    props: {
        currentType: {
            type: String,
            default: 'satisfaction'
        },
        generalShow: {
            type: Boolean,
            default: false
        },
        generalList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            show: this.generalShow

        }
    },
    methods: {
        generalClose (val) {
            this.show = val
            this.$emit('generalClose', val)
        }
    }
}
</script>
