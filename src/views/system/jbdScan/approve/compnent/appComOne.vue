<template>
    <div>
        <div v-if="activeIndex !== 5 && type && activeIndex+1 === clickIndex" class="ma15">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input
                        v-model="search"
                        placeholder="输入关键字搜索（条款名称/条款号/实施状态）"
                        clearable
                    />
                </el-col>
                <el-col :span="12">
                    <div class="tableTab">
                        <el-button type="info" @click="selectClike()">全部催办</el-button>
                        <el-button type="info" @click="xuanClike()">选择催办</el-button>
                    </div>

                </el-col>
            </el-row>

        </div>
        <el-table :data="tableData.filter(data => !search || data.tiao_kuan_ming_ch.toLowerCase().includes(search.toLowerCase()) || data.tiao_kuan_hao_.toLowerCase().includes(search.toLowerCase()) || data.shi_fou_guo_shen_.toLowerCase().includes(search.toLowerCase()))" :border="true" style="with: 100%" @selection-change="handleSelectionChange">
            <el-table-column
                v-if="type && activeIndex !== 4"
                type="selection"
                width="55"
            />
            <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center"
            />
            <el-table-column v-for="(item,index) in jiHuaList" :key="index" :prop="item.value" :label="item.name" :width="item.width" align="center">
                <template slot-scope="scope">
                    <div v-if="item.value == 'yuanZuZhangName'">
                        {{ scope.row['zuZhangName'] || scope.row['yuanZuZhangName'] }}
                    </div>
                    <div v-else-if="item.value == 'zuYuanPosiName'">
                        {{ scope.row['zuYuanPosiName'] || scope.row['yuanZuZhangBuMen'] }}
                    </div>
                    <div v-else>{{ scope.row[item.value] }}</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import approveJS from '../approveJS'
import approveJSON from '../approveJSON.json'
export default {
    mixins: [approveJS],
    props: {
        tableData: {
            type: Array,
            default: () => {
                return []
            }
        },
        activeIndex: {
            type: Number,
            default: 1
        },
        clickIndex: {
            type: Number,
            default: 2
        },
        type: {
            type: Boolean,
            default: true
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
            jiHuaList: approveJSON.list2,
            selection: [],
            selectShow: true,
            selectData: [],
            search: ''
        }
    },
    computed: {
        getShow () {
            return this.type && this.activeIndex !== 4 && this.clickIndex !== 1
        }
    },
    watch: {
        clickIndex: {
            handler (newVal, oldVal) {
                this.switchWatch(this.clickIndex)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        switchWatch (index) {
            switch (index) {
                case 1:
                    this.jiHuaList = approveJSON.list1
                    break
                case 2:
                    this.jiHuaList = approveJSON.list2
                    break
                case 3:
                    this.jiHuaList = approveJSON.list3
                    break
                case 4:
                case 5:
                case 6:
                    this.jiHuaList = approveJSON.list4
                    break
                case 7:
                    this.jiHuaList = approveJSON.list7
                    break
            }
        },
        handleSelectionChange (selection) {
            console.log(selection)
            this.selection = selection
        },
        selectClike () {
            const statusMap = {
                1: '待核查/待审核/已结束',
                2: '待审核/已结束',
                3: '已结束',
                4: '已结束'
            }
            this.selectData = this.tableData.filter(item =>
                statusMap[this.activeIndex].indexOf(item.shi_fou_guo_shen_) === -1 && (!this.search || item.tiao_kuan_ming_ch.indexOf(this.search) !== -1 || item.tiao_kuan_hao_.indexOf(this.search) !== -1 || item.shi_fou_guo_shen_.indexOf(this.search) !== -1)
            )
            if (this.selectData.length === 0) {
                return this.$message.error(`过滤实施状态：${statusMap[this.activeIndex]}，所以暂无数据需要消息`)
            }
            this.$message.warning(`过滤实施状态：${statusMap[this.activeIndex]}，发送消息`)
            this.cuiBanClike(this.selectData)
        },
        xuanClike () {
            this.cuiBanClike(this.selection)
        },
        cuiBanClike (selectionList) {
            if (selectionList.length === 0 && this.activeIndex !== '4') {
                this.$message.warning('请选择数据')
            }
            // console.log(this.selection)
            const selectMessList = []
            let selection = []
            const list = []
            switch (this.activeIndex) {
                case 1:
                    selection = selectionList.filter(item =>
                        item.shi_fou_guo_shen_ === '待分配'
                    )
                    if (selectionList.length !== selection.length) {
                        return this.$message.warning(`请选择实施状态为待分配的数据`)
                    }
                    if (selection.length > 0) {
                        selection.forEach(item => {
                            const conont = `,条款号：${item.tiao_kuan_hao_}，条款名称：${item.tiao_kuan_ming_ch}`
                            selectMessList.push(this.setXiaoXin(item.zu_chang_, item.ji_hua_bian_hao_, '认可准则条款核查核查实施计划', '认可准则条款核查核查实施计划已编制', conont))
                        })
                    }
                    break
                case 2:
                    selection = selectionList.filter(item =>
                        item.shi_fou_guo_shen_ === '待分配' || item.shi_fou_guo_shen_ === '待核查'
                    )
                    if (selectionList.length !== selection.length) {
                        return this.$message.warning(`请选择实施状态为待分配或者待核查的数据`)
                    }
                    if (selection.length > 0) {
                        selection.forEach(item => {
                            const conont = `,条款号：${item.tiao_kuan_hao_}，条款名称：${item.tiao_kuan_ming_ch}`
                            let title = ''
                            let content = ''
                            if (item.shi_fou_guo_shen_ === '待分配') {
                                title = '认可准则条款核查核查实施计划'
                                content = '认可准则条款核查核查实施计划已编制'
                            }
                            if (item.shi_fou_guo_shen_ === '待核查') {
                                title = '认可准则条款核查'
                                content = '认可准则条款核查核查实施计划编制'
                            }
                            selectMessList.push(this.setXiaoXin(item.zu_chang_, item.ji_hua_bian_hao_, title, content, conont))
                        })
                    }
                    break
                case 3:
                    selection = selectionList.filter(item =>
                        item.shi_fou_guo_shen_ === '待分配' || item.shi_fou_guo_shen_ === '待核查' || item.shi_fou_guo_shen_ === '待审核'
                    )
                    if (selectionList.length !== selection.length) {
                        return this.$message.warning(`请选择实施状态为待分配、待核查、的数据、待审核`)
                    }
                    if (selection.length > 0) {
                        selection.forEach(item => {
                            if (item.shi_fou_guo_shen_ === '待分配' || item.shi_fou_guo_shen_ === '待核查') {
                                const conont = `,条款号：${item.tiao_kuan_hao_}，条款名称：${item.tiao_kuan_ming_ch}`
                                let title = ''
                                let content = ''
                                if (item.shi_fou_guo_shen_ === '待分配') {
                                    title = '认可准则条款核查核查实施计划'
                                    content = '认可准则条款核查核查实施计划已编制'
                                }
                                if (item.shi_fou_guo_shen_ === '待核查') {
                                    title = '认可准则条款核查'
                                    content = '认可准则条款核查核查实施计划编制'
                                }
                                selectMessList.push(this.setXiaoXin(item.zu_chang_, item.ji_hua_bian_hao_, title, content, conont))
                            } else {
                                list.push(item)
                            }
                        })
                        this.getDataSet(list).then(res => {
                            res.forEach(item => {
                                selectMessList.push(this.setXiaoXin(item.zu_chang_, item.ji_hua_bian_hao_, '认可准则条款核查审核', '认可准则条款核查已完成，请尽快审核'))
                            })
                        })
                    }
                    break
                case 4:
                    selection = selectionList.filter(item =>
                        item.shi_fou_guo_shen_ !== '已结束'
                    )
                    if (selection.length > 0) {
                        selectMessList.push(this.setXiaoXin(this.generalList[0].bian_zhi_ren_, this.generalList[0].bian_hao_, '认可准则条款核查确认', '认可准则条款核查审核已完成'))
                    }
                    break
            }
            if (selectMessList.length > 0) {
                Promise.all(selectMessList).then(res => {
                    this.$message.success(`一共发送${selectMessList.length}条消息，消息发送完毕`)
                })
            }
        },
        setXiaoXin (name, ji_hua_bian_hao_, title, content, conont = '') {
            return new Promise((resolve, reject) => {
                const xiaoxi = {
                    subject: title, // 主题，不可更改，在消息通知列表有根据这个文本做校验逻辑
                    receiverId: name, // 接收人id
                    receiver: '', // 接收人id
                    // groupId: i.tongzhiBM,// 接收人id
                    groupName: '', // 接收人id
                    fileMsg: '', // 附件
                    content: `${content},请尽快确认,计划编号：${ji_hua_bian_hao_}${conont}` // 正文
                }
                this.$common.sendMsg(xiaoxi).then(res => {
                    resolve(res)
                    // this.$message.warning(`${content}，还没有确认的人员请及时通知${conont}`)
                })
            })
        },
        getDataSet (data) {
            return new Promise((resolve, reject) => {
                const qc = data.filter((item, index, self) => {
                    return index === self.findIndex((t) => (
                        t.zu_chang_ === item.zu_chang_
                    ))
                })
                resolve(qc)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.tableTab{
    display: flex;
    justify-content: flex-end
}
.ma15{
    margin-bottom: 10px;
}
</style>
