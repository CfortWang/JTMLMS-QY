<!--
 * @Descripttion: 文件修订选择文件归档路径
 * @version: 1.0
 * @Author: Liu_jiaYin
 * @Date: 2024-04-01 15:45:19
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-04-13 09:48:53
-->
<template>
    <el-cascader ref="cascader" v-model="cascaderData" :disabled="readonly" :options="options" :props="props" @change="handleChange">
        <template slot-scope="{ node, data }">
            <span>{{ data.name_ }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
    </el-cascader>
</template>
<script>
import TreeUtils from '@/utils/tree'

export default {
    props: {
        value: { // value
            type: [String, Number, Object, Array],
            default () {
                return this.multiple ? [] : {}
            }
        },
        // 所有字段数据,(包含主主子表)
        formData: [Object, Array],
        field: {
            type: Object,
            required: true
        },
        readonly: {
            type: Boolean,
            default: false
        },
        readonlyStyle: {
            type: String,
            default: 'text'
        }
    },
    data () {
        const { first, second } = this.$store.getters.level
        const levelInfos = second || first
        return {
            props: {
                value: 'ID_', label: 'name_', children: 'children'
            },
            levelInfos,
            cascaderData: [],
            options: []
        }
    },
    watch: {
        value: {
            handler (val, oldVal) {
                if (val) {
                    if (typeof val === 'string') {
                        this.cascaderData = val.split(',')
                    } else {
                        this.cascaderData = val
                    }
                } else {
                    this.cascaderData = []
                }
            },
            immediate: true
        }
        // readonly: {
        //     handler: function (val, oldVal) {
        //         // console.log('65 formData', this.formData)
        //         // console.log('65 readonly', val)
        //         console.log('65 readonlyStyle', this.readonlyStyle)
        //     },
        //     immediate: true
        // }
    },
    async created () {
        await this.getCascaderOptions()
    },
    methods: {
        handleChange (v) {
            const nodesInfo = this.$refs['cascader'].getCheckedNodes()[0]
            const xilei = []
            const authorityBuMen = []
            const authority = JSON.parse(nodesInfo.data.AUTHORITY_NAME)
            const wenJianXiLeiArrs = nodesInfo.pathNodes.map((item) => item.label)
            // 组件本身字段的回填值
            this.$emit('update:value', nodesInfo.path.join(','))
            this.$emit(
                'change-data',
                'guiDangLuJingXinX',
                JSON.stringify({
                    wenJianXiLei: wenJianXiLeiArrs.join(' / '),
                    xiLeiId: nodesInfo.value,
                    quanXianLeiXing: authority.chaYue })
            )
            this.$emit('change-data', 'wenJianXiLei', wenJianXiLeiArrs.join(' / '))
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
        },
        // 获取文件分类信息
        async getCascaderOptions () {
            // const sql = `select *FROM ibps_cat_type WHERE  authority_name like concat('%', ${this.levelInfos},'%') and CATEGORY_KEY_='FILE_TYPE' ORDER BY sn_ ASC`
            this.$common.request('query', {
                key: 'getFileType',
                params: [this.levelInfos]
            }).then((res) => {
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

<style lang="scss" scoped></style>
