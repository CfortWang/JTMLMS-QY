<template>
    <el-cascader ref="cascader" :props="props" @change="handleChange" />
</template>

<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
export default {
    data () {
        const { first, second } = this.$store.getters.level
        const levelInfos = second || first
        return {
            props: {
                lazy: true,
                lazyLoad (node, resolve) {
                    const { level, value } = node
                    let sqlString1 = ''
                    if (level === 0) {
                        // 286814138233389367 是文件分类标识的id，在ibps_cat_category
                        sqlString1 = `select *FROM ibps_cat_type WHERE parent_id_='286814138233389367' and authority_name like '%${levelInfos}%' ORDER BY sn_ ASC`
                    } else {
                        sqlString1 = `select *FROM ibps_cat_type WHERE parent_id_ in (select id_ from ibps_cat_type where ID_= '${value}'  AND category_key_ ='FILE_TYPE') ORDER BY sn_ ASC`
                    }
                    curdPost('sql', sqlString1).then((res1) => {
                        const datas1 = res1.variables.data
                        setTimeout(() => {
                            const nodes = datas1.map((item) => ({
                                value: item.ID_,
                                label: item.name_,
                                authority: item.AUTHORITY_NAME
                            }))
                            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                            resolve(nodes)
                        }, 100)
                    })
                }
            },
            levelInfos
        }
    },
    watch: {},
    mounted () {},
    methods: {
        handleChange (v) {
            const nodesInfo = this.$refs['cascader'].getCheckedNodes()[0]
            const xilei = []
            const authorityBuMen = []
            const authority = JSON.parse(nodesInfo.data.authority)
            for (var i of nodesInfo.pathNodes) {
                xilei.push(i.label)
            }
            // this.$emit(
            //     'change-data',
            //     'wenJianLeiXing',
            //     nodesInfo.pathNodes[0].label
            // )
            this.$emit('change-data', 'wenJianXiLei', xilei.join(' / '))
            this.$emit('change-data', 'xiLeiId', nodesInfo.value)
            this.$emit('change-data', 'quanXianLeiXing', authority.chaYue)
            // eslint-disable-next-line no-redeclare
            for (var i of authority.buMen) {
                if (i[0] === this.levelInfos || i[1] === this.levelInfos) {
                    authorityBuMen.push(i[i.length - 1])
                }
            }
            this.$emit(
                'change-data',
                'quanXianXinXi',
                authorityBuMen.join(',')
            )
            this.$emit('change-data', 'zhuanYeBuMen', authorityBuMen.join(','))
            this.$emit('change-data', 'guiShu', authorityBuMen.join(','))
        }
    }
}
</script>

<style lang="scss" scoped></style>
