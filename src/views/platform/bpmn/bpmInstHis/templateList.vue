<template>
    <div class="template-container">
        <template-list
            :template-id="templateId"
            :dynamic-params="dynamicParams"
            :filter-params="filterParams"
            :type-name="typeName"
            :type-id="typeId"
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
        const { templateid_, guo_lv_can_shu_, typeName, typeId } = this.templateData
        return {
            typeName,
            templateId: templateid_,
            typeId,
            filterParams: guo_lv_can_shu_ ? JSON.parse(guo_lv_can_shu_) : [],
            dynamicParams: {}
        }
    },
    watch: {
        templateData (v) {
            const { templateid_, guo_lv_can_shu_, typeName, typeId } = v
            this.typeName = typeName
            this.templateId = templateid_
            this.typeId = typeId
            this.filterParams = guo_lv_can_shu_ ? JSON.parse(guo_lv_can_shu_) : []
        }
    }
    // methods: {

    // }
}
</script>

<style lang="scss" scoped>
    .template-container{
        ::v-deep .container-component{
            margin-left: 358px;
        }
    }
</style>

