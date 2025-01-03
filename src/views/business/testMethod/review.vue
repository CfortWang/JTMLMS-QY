<template>
    <div class="main" :inert="isInert">
        <div class="hand-btn">
            <el-button v-if="btnShsow" type="primary" icon="el-icon-plus" @click="addData">添加</el-button>
            <el-button v-if="btnShsow" type="danger" icon="el-icon-close" @click="goRemove">删除</el-button>
            <!-- <el-button type="primary" icon="el-icon-delete">导出</el-button>
            <el-button type="primary" icon="el-icon-delete">导入</el-button> -->
        </div>
        <el-table
            ref="reviewTable"
            :key="tableKey"
            :data="statData"
            border
            stripe
            highlight-current-row
            style="width: 100%"
            class="review-table blue-header"
            :max-height="maxHeight"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
            />
            <el-table-column
                type="index"
                label="序号"
                width="55"
                prop="date"
            />
            <el-table-column
                label="检验方法"
                width="300"
            >
                <template v-slot="{ row }">
                    <span style="margin-left: 10px">{{ getJianYanFangFaName(row.jianYanFangFa) }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                label="项目与方法"
                width="140"
            >
                <template v-slot="{ row }">
                    <span style="margin-left: 10px">{{ getProjectAndMethod(row.xiangMuFangFa) }}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                prop="xiangMuMingCheng"
                label="检测项目"
                width="300"
            />
            <!-- 12.30 -->
            <!-- <el-table-column
                prop="sheBeiMingCheng"
                label="设备名称"
                width="220"
            />
            <el-table-column
                prop="sheBeiBianHao"
                label="设备编号"
                width="140"
            />
            <el-table-column
                prop="faXianWenTi"
                label="发现的问题"
                width="220"
            /> -->
            <el-table-column label="操作">
                <template v-slot="{ row,$index }">
                    <span v-if="btnShsow" class="spanto" @click="handleEdit(row,$index)"><i class="el-icon-edit-outline" />编辑</span>
                    <span v-if="btnShsow" class="spant">|</span>
                    <span class="spanto" @click="handleSelect(row)"><i class="el-icon-view" />查阅</span>
                    <!-- <el-button
                        v-if="btnShsow"
                        size="mini"
                        type="primary"
                        icon="el-icon-edit-outline"
                        @click="handleEdit(row,$index)"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        icon="el-icon-view"
                        type="primary"
                        @click="handleSelect(row)"
                    >查阅</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <reviewDialog
            v-if="dialogFormVisibles"
            :visidial="dialogFormVisibles"
            :select-edit-data="selectEditData"
            :select-editchange="selectEditchange"
            :config-list="configList"
            @getData="getData"
            @getcolse="getcolse"
        />

        <!-- :select_edit-change="selectEditchange"-->
    </div>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
import reviewDialog from './reviewDialog.vue'

export default {
    components: {
        ibpsUserSelector,
        reviewDialog,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        params: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { first, second } = this.$store.getters.level || {}
        return {
            dynamicParams: {},
            dialogFormVisibles: false,
            isInert: false,
            btnShsow: false,
            isFirst: true,
            selectEditchange: false,
            statData: [],
            first,
            second,
            maxHeight: '600px',
            jianYanFangFaNameCache: {},
            projectAndMethodNameCache: {},
            tableKey: 0,
            multipleSelection: [],
            selectEditData: '',
            configList: []
        }
    },
    computed: {
        getJianYanFangFaName () {
            return (jianYanFangFa) => {
                if (!this.jianYanFangFaNameCache[jianYanFangFa]) {
                    this.loadJianYanFangFaName(jianYanFangFa)
                }
                return this.jianYanFangFaNameCache[jianYanFangFa] || ''
            }
        },
        getProjectAndMethod () {
            return (xiangMuFangFa) => {
                if (!this.projectAndMethodNameCache[xiangMuFangFa]) {
                    this.loadProjectAndMethodName(xiangMuFangFa)
                }
                return this.projectAndMethodNameCache[xiangMuFangFa] || ''
            }
        }
    },
    watch: {
        formData: {
            handler (val) {
                if (val.lieBiaoShuJu) {
                    if (this.isFirst) {
                        this.statData = JSON.parse(val.lieBiaoShuJu)
                        this.isFirst = false
                    }
                }
            },
            immediate: true,
            deep: true
        },
        params: {
            handler (val) {
                if (val.nodeId && val.nodeId === 'Activity_0ruri1g') {
                    this.btnShsow = true
                } else {
                    this.btnShsow = false
                }
            },
            immediate: true,
            deep: true
        },
        statData: {
            handler (val) {
                console.log('点击子表确定val', val)
                const t = val.map(item => ({
                    'id': '',
                    'parentId': '',
                    'jianYanXiangMu': item.jianYanXiangMu,
                    'fangFaMingCheng': '',
                    'jianYanFangFa': item.jianYanFangFa,
                    'xiangMuYuFangFa': item.xiangMuFangFa,
                    'xiangMuMingCheng': item.xiangMuMingCheng,
                    'sheBeiMingCheng': item.sheBeiMingCheng,
                    'sheBeiBianHao': item.sheBeiBianHao,
                    'shiJiJiPiHao': item.shiJi,
                    'xiaoZhunPinJiPiHa': '不适用',
                    'shangCiYanZhengXi': item.yangzheng,
                    'pingShenNeiRong': item.pinShen1,
                    'pingShenJieLun': item.jieLun,
                    'faXianDeWenTi': item.faXianWenTi
                }))
                this.$emit('change-data', 'lieBiaoShuJu', JSON.stringify(val))
                this.$emit('change-data', 'jyffxnpsjlzb', t)
            },
            deep: true
        }
    },
    created () {
        // 初始化时加载所有需要的数据
        this.statData.forEach(row => {
            this.loadJianYanFangFaName(row.jianYanFangFa)
            this.loadProjectAndMethodName(row.xiangMuFangFa)
        })
    },
    methods: {

        async loadJianYanFangFaName (jianYanFangFa) {
            try {
                const methodName = await this.jian(jianYanFangFa)

                this.jianYanFangFaNameCache[jianYanFangFa] = methodName
                this.refreshTable()
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        refreshTable () {
            this.tableKey++
        },
        async loadProjectAndMethodName (xiangMuFangFa) {
            try {
                const methodName = await this.xiang(xiangMuFangFa)
                this.projectAndMethodNameCache[xiangMuFangFa] = methodName
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        // 点击添加按钮
        addData () {
            this.selectEditchange = true
            this.dialogFormVisibles = true
            this.configList = []
            this.configData()
        },
        // 点击取消按钮
        getcolse () {
            this.selectEditData = ''
            this.selectEditchange = false
            this.dialogFormVisibles = false
        },
        getData (obj, index) {
            if (typeof index === 'undefined') {
                // 新增
                this.statData.push(obj)
            } else {
                // 修改
                Object.assign(this.statData[index], obj)
            }
            this.loadJianYanFangFaName(obj.jianYanFangFa)
            this.loadProjectAndMethodName(obj.xiangMuFangFa)
        },
        async jian (val) {
            try {
                const sql1 = `select * FROM t_bzffglb WHERE id_='${val}'`
                const response = await this.$common.request('sql', sql1)
                const a = response.variables.data[0] && response.variables.data[0].fang_fa_ming_chen
                return a
            } catch (error) {
                console.error('Error fetching data:', error)
                throw error
            }
        },
        async xiang (val) {
            try {
                const sql2 = `select * FROM neng_li_fan_wei_ WHERE id_='${val}'`
                const response = await this.$common.request('sql', sql2)
                const a = response.variables.data[0] && response.variables.data[0].jian_yan_xiang_mu
                return a
            } catch (error) {
                console.error('Error fetching data:', error)
                throw error
            }
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        goRemove () {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                })
                return
            }
            this.statData = this.statData.filter(item => !this.multipleSelection.includes(item))
        },
        handleEdit (row, index) {
            // 编辑操作
            console.log('点击编辑', row)
            this.selectEditchange = true
            this.selectEditData = row
            this.selectEditData.rowIndex = index
            this.dialogFormVisibles = true
        },
        handleSelect (row) {
            // 查阅操作
            this.dialogFormVisibles = true
            this.selectEditData = row
            this.selectEditchange = false
        },
        // 配置完成之后评审内容数据自动带出
        configData () {
            const sql = `select * from  t_jyffxnpspzb`
            this.$common.request('sql', sql).then(res => {
                const data = res.variables.data

                data.forEach(item => {
                    const obj = {
                        name: item.ping_shen_nei_ron,
                        shi_fou: '是',
                        bei_zhu: '',
                        shi_fou_shi_yong: '是',
                        cuo_shi_: ''
                    }
                    this.configList.push(obj)
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.main{
    .hand-btn{
    width: 100%;
    text-align: right;
}
::v-deep .blue-header .el-table__header th {
  background-color: #84d5cf !important; /* 背景颜色 */
  color: #080808; /* 标题文字颜色 */
}
.dialog{
    padding: 10px;
}
.spanto{
    color: #1E90FF;
}
.spanto:hover{
    cursor: pointer;
}
.spant{
    display: inline-block;
    color: #dfdddd;
    margin: 0 7px;
}
.dialog-footer{
    text-align: center;
}
.el-form{
    padding: 10px;
}
.setBorder{
    border: 1px solid #dcdfe6;
    padding:10px;
    border-radius: 8px;
}

}

</style>
