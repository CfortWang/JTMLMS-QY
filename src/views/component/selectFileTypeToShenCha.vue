<template>
    <el-cascader
        ref="cascader"
        v-model="selectDatas"
        :options="options"
        :props="props"
    />
</template>

<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import TreeUtils from '@/utils/tree'

export default {
    data () {
        const { level, userId, userInfo } = this.$store.getters
        return {
            level,
            userId,
            userInfo,
            props: {
                children: 'children',
                label: 'name_',
                value: 'ID_',
                multiple: true,
                expandTrigger: 'hover'
            },
            sqlDatas: [],
            options: [],
            selectDatas: [],
            iniselectDatas: []
        }
    },
    watch: {
        selectDatas (v) {
            const typeId = []
            const typeNames = []
            if (v.length !== 0) {
                for (var i of v) {
                    const typeName = []
                    for (let index = 0; index < i.length; index++) {
                        typeName.push(this.sqlDatas.find(item => item.ID_ === i[index]).name_)
                    }
                    typeId.push(i[i.length - 1])
                    typeNames.push(typeName.join(' / '))
                }
                this.$emit('change-data', 'xiLeiId', typeId.join(','))
                this.$emit('change-data', 'xiLeiXuanZe', typeNames.join('，'))
            }
        }
    },
    mounted () {
        this.getPositionList()
    },
    methods: {
    // 获取本账户所在的部门
        getPositionList () {
            const sql = `select *FROM ibps_cat_type where category_key_ ='FILE_TYPE' 
      and AUTHORITY_NAME LIKE '%${this.level.second ? this.level.second : this.level.first}%'
      and AUTHORITY_NAME LIKE '%"需要"%' order by sn_ asc`
            curdPost('sql', sql).then((res) => {
                if (res.state === 200) {
                    const datas = res.variables.data
                    this.sqlDatas = datas
                    if (datas.length > 0) {
                        this.options = this.toTree(datas)
                    }
                }
            })
        },
        toTree (data) {
            return TreeUtils.transformToTreeFormat(data, {
                idKey: 'ID_',
                pIdKey: 'PARENT_ID_',
                childrenKey: 'children'
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>
