<template>
    <div class="template-container">
        <template-list
            v-if="templateId"
            :template-id="templateId"
            :dynamic-params="dynamicParams"
            :filter-params="filterParams"
            :type-name="typeName"
        />
    </div>
</template>

<script>
import TemplateList from '@/views/platform/data/dataTemplate/template-list.vue'
export default {
    components: {
        TemplateList
    },
    props: {
        templateData: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        const { templateid_, guo_lv_can_shu_, typeName } = this.templateData
        console.log(guo_lv_can_shu_)
        console.log(JSON.parse(guo_lv_can_shu_))
        return {
            typeName,
            templateId: templateid_,
            filterParams: guo_lv_can_shu_ ? JSON.parse(guo_lv_can_shu_) : [],
            dynamicParams: {}
        }
    },
    // methods: {
        
    // }
}
</script>

<style lang="scss" scoped>
    .template-container{
        ::v-deep .container-component{
            margin-left: 250px;
        }
    }
</style>

