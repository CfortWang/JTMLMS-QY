<template>
    <div class="content">
        <div class="header">{{ info.title }}</div>
        <div class="search-box">
            <template v-for="(item, index) in searchList">
                <span class="label">{{item.label}}</span>
                <el-input
                    v-if="item.value !== 'sampleTime'"
                    v-model="searchParam[item.value]"
                    class="input"
                    size="mini"
                    placeholder="请输入内容"
                    clearable
                    @keyup.enter.native="search"
                ></el-input>
                <el-date-picker
                    v-else
                    v-model="searchParam[item.value]"
                    type="daterange"
                    size="mini"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 220px;"
                ></el-date-picker>
            </template>
            <el-button class="btn" type="primary" @click="search">
                <i class="ibps-icon-search"></i>查询
            </el-button>
        </div>
        <div class="table-container">
            <el-table
                :data="tableData"
                :stripe="true"
                style="width: 100%;"
                height="75vh"
                max-height="100%"
                header-cell-class-name="table-header"
            >
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column prop="he_tong_id_" label="合同编号" width="100">
                    <template slot-scope="scope">{{ scope.row.he_tong_id_ | getID(contractList) }}</template>
                </el-table-column>
                <el-table-column prop="wei_tuo_id_" label="委托单号" width="110">
                    <template slot-scope="scope">{{ scope.row.wei_tuo_id_ | getID(trustList) }}</template>
                </el-table-column>
                <el-table-column prop="bao_gao_bian_hao_" label="报告编号" width="110"></el-table-column>
                <el-table-column prop="run_qian_lu_jing_" label="版本号" width="80"></el-table-column>
                <!-- <el-table-column prop="wei_tuo_fang_" label="委托单位"></el-table-column> -->
                <!-- <el-table-column prop="wan_cheng_shi_jia" label="委托日期" width="100"></el-table-column> -->
                <el-table-column prop="yang_pin_bian_hao" label="样品编号" width="110"></el-table-column>
                <el-table-column prop="yang_pin_ming_che" label="样品名称" width="150"></el-table-column>
                <el-table-column prop="song_jian_" label="送检单位" width="150"></el-table-column>
                <el-table-column prop="song_jian_shi_jia" label="送检日期" width="100"></el-table-column>
                <el-table-column label="检测时间" width="100">
                    <template slot-scope="scope">{{ getTestTime(scope.row) }}</template>
                </el-table-column>
                <el-table-column prop="gai_zhang_jian_pd" label="检测项目"></el-table-column>

                <el-table-column label="操作" align="left" width="100">
                    <template slot-scope="scope">
                        <el-popover placement="left" width="200" trigger="click">
                            <div slot="reference" class="more">
                                <i class="el-icon-caret-bottom"></i>查阅
                            </div>
                            <template v-for="(item ,index) in reportList">
                                <!-- 检测记录 -->
                                <div v-if="item.key === 'testing'">
                                    <el-popover placement="left" width="200" trigger="click">
                                        <div class="operate-item" slot="reference" @click="getTesting(scope.row)">
                                            <i class="el-icon-s-order"></i> {{item.name}}
                                        </div>
                                        <div class="three-item">
                                            <div
                                                v-for="i in testingList"
                                                :key="i.id"
                                                class="operate-item"
                                                @click="consult(i)"
                                            >
                                                {{ i.projectName }}
                                            </div>
                                        </div>
                                    </el-popover>
                                </div>
                                <div v-else-if="item.key === 'file'">
                                    <el-popover placement="left" width="300" trigger="click">
                                        <div class="operate-item" slot="reference" @click="getFile(scope.row, item.field)">
                                            <i class="el-icon-s-order"></i> {{item.name}}
                                        </div>
                                        <div class="three-item">
                                            <div
                                                v-for="i in fileList"
                                                :key="i.id"
                                                class="operate-item"
                                            >
                                                <span @click="preview(i)"><i class="el-icon-tickets" ></i>{{ i.fileName }}.{{ i.ext }}</span>
                                                <i class="el-icon-download" @click="download(i)"></i>
                                            </div>
                                        </div>
                                    </el-popover>
                                </div>
                                <div
                                    v-else
                                    :key="index"
                                    class="operate-item"
                                    @click="alertReport(item.path, scope.row[item.key])"
                                >
                                    <i class="el-icon-s-order"></i> {{item.name}}
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :top="'3vh'"
            :width="'90%'"
            class="js-custom-dialog"
            append-to-body
            :fullscreen="false"
            :visible.sync="visible"
        >
            <iframe :src="srcUrl" :height="'100%'" :width="'100%'" frameborder="0" scrolling="no" />
        </el-dialog>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="20"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
        <image-viewer
            v-if="fileType === 'image'"
            :z-index="zIndex"
            :url-list="[fileUrl]"
            :on-close="() => fileType = ''"
        />
    </div>
</template>

<script>
    import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
    import { previewFile } from '@/api/platform/file/attachment'
    import { downloadFile } from '@/business/platform/file/utils'
    import PopupManager from '@/utils/popup'
    import { SYSTEM_URL, BASE_API } from '@/api/baseUrl'
    const searchList = [
        {
            label: '报告编号',
            value: 'report'
        },
        {
            label: '样品编号',
            value: 'sampleId'
        },
        {
            label: '样品名称',
            value: 'sampleName'
        },
        {
            label: '检测项目',
            value: 'projectName'
        },
        {
            label: '送检日期',
            value: 'sampleTime'
        }
    ]
    let reportList = [
        // {
        //     name: '合同',
        //     key: 'he_tong_id_',
        //     path: '',
        //     hasItem: false
        // },
        {
            name: '检测委托单',
            key: 'wei_tuo_id_',
            path: '43罗湖/LHXBJY-QP-7.1-01-FQ-05 检测委托单.rpx',
            hasItem: false
        },
        // {
        //     name: '检测报告审批表',
        //     key: 'id_',
        //     path: '43罗湖/检测报告审批表.rpx',
        //     hasItem: false
        // },
        {
            name: '检测记录',
            key: 'testing',
            path: '43罗湖/LHXBJY 检测实验记录',
            hasItem: true
        },
        {
            name: '附件',
            key: 'file',
            path: '',
            field: 'suo_you_yuan_shi_,fu_jian_yi_',
            hasItem: true
        },
        {
            name: '检测报告',
            key: 'file',
            path: '43罗湖/LHXBJY 检测报告',
            field: 'bao_gao_pdf_',
            hasItem: false
        }
    ]
    // 检测实验记录报表路径
    const testingPath = {
        'Process_140upmu': '43罗湖/LHXBJY 检测实验记录',
        'Process_0idt26n': '43罗湖/LHXBJY-JC-SOP-001-FQ-01 无菌检测记录表.rpx',
        'Process_1rwhy1r': '43罗湖/LHXBJY-JC-SOP-002-FQ-01 支原体检测（培养法）.rpx',
        'Process_05lkhio': '43罗湖/LHXBJY-JC-SOP-003-FQ-01 细菌内毒素检查记录表.rpx'
    }
    
    const imageType = ['jpg', 'jpeg', 'bmp', 'png', 'gif']
    export default {
        filters: {
            getID (v, arr) {
                let result = arr.find(item => item.id_ === v)
                return result ? result.name_ : v
            },
            getYear (v) {
                return v ? v.slice(0, 4) : ''
            }
        },
        components: {
            ImageViewer: () => import('@/components/ibps-file-viewer/image')
        },
        props: {
            info: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                searchList,
                reportList,
                reportId: '',
                total: null,
                currentPage: 1,
                visible: false,
                searchParam: {
                    report: '',
                    sampleId: '',
                    sampleName: '',
                    projectName: '',
                    sampleTime: ''
                },
                tableData: [],
                testingList: [],
                fileList: [],
                contractList: [],
                trustList: [],
                srcUrl: '',
                globalSql: '',
                fileUrl: '',
                fileType: '',
                zIndex: 2000,
                fileOption: {
                    user: {}
                }
            }
        },
        created () {
            // 全部检测档案type为空
            const args = this.info.type ? ` and bao_gao_lei_bie_ = '${this.info.type}'` : ''
            this.globalSql = `select * from t_lhjcbgb where zhuang_tai_ in ('已完成', '待发放')${args}`
            // this.globalSql = `select * from t_lhjcbgb where bao_gao_lei_bie_ = '${this.info.type}'`
            const sql = `${this.globalSql} order by create_time_ desc limit 0,20`
            this.loadData(sql)
            const sumsql = `select count(*) as total  from t_lhjcbgb where zhuang_tai_ in ('已完成', '待发放')${args}`
            curdPost('sql', sumsql).then((response) => {
                this.total = response.variables.data[0].total
            })
        },
        beforeDestroy () {
            this.fileType = ''
        },
        methods: {
            // 请求表格数据函数
            loadData (sql) {
                this.tableData = []
                curdPost('sql', sql).then((res) => {
                    const { data } = res.variables
                    if (!data || !data.length) {
                        return
                    }

                    this.tableData = data
                    let ids = {
                        contract: [],
                        trust: []
                    }
                    data.forEach(item => {
                        ids.contract.push(item.he_tong_id_)
                        ids.trust.push(item.wei_tuo_id_)
                    })
                    // 获取合同及委托单数据用于转换ID
                    const sql1 = `select id_, he_tong_bian_hao_ as name_ from t_bjd where find_in_set(id_, '${ids.contract.join(',')}')`
                    const sql2 = `select id_, wei_tuo_bian_hao_ as name_ from t_lhwtsqb where find_in_set(id_, '${ids.trust.join(',')}')`
                    // console.log(sql1, sql2)
                    curdPost('sql', sql1).then(res1 => {
                        this.contractList = res1.variables && res1.variables.data
                    })
                    curdPost('sql', sql2).then(res2 => {
                        this.trustList = res2.variables && res2.variables.data
                    })
                })
            },
            getTestTime ({jian_ce_kai_shi_s, jian_ce_jie_shu_s}) {
                const start = jian_ce_kai_shi_s ? jian_ce_kai_shi_s.slice(0, 10) : ''
                const end = jian_ce_jie_shu_s ? jian_ce_jie_shu_s.slice(0, 10) : ''
                if (!start && !end) {
                    return ''
                }
                if (!end || start === end) {
                    return start
                }
                return `${start}至${end}`
            },
            // 获取检测项目数据
            getTesting (row) {
                const { wei_tuo_id_, yang_pin_bian_hao, xiu_gai_bao_gao_b } = row
                this.testingList = []
                const sql = `select b.id_ as id, a.defkey_ as number, a.jian_ce_xiang_mu_ as projectName, max(b.create_time_) from t_mjjcnlfw a, t_lhjczb b where a.id_ = b.jian_ce_xiang_mu_ and b.wei_tuo_id_ = '${wei_tuo_id_}' and b.yang_pin_bian_hao = '${yang_pin_bian_hao}' and find_in_set(b.jian_ce_xiang_mu_, '${xiu_gai_bao_gao_b}') group by b.jian_ce_xiang_mu_`
                curdPost('sql', sql).then(res => {
                    this.testingList = res.variables && res.variables.data
                    // console.log(this.testingList)
                })
            },
            // 获取附件信息，报告表【bao_gao_pdf_, suo_you_yuan_shi_, fu_jian_yi_】字段
            getFile (row, key) {
                let files = ''
                if (key.includes(',')) {
                    // 多字段
                    let a = row.suo_you_yuan_shi_ ? row.suo_you_yuan_shi_.split(',') : []
                    let b = row.fu_jian_yi_ ? row.fu_jian_yi_.split(',') : []
                    files = a.concat(b).join(',')
                } else {
                    files = row[key]
                }
                this.fileList = []
                const sql = `select id_ as id, file_name_ as fileName, ext_ as ext from ibps_file_attachment where find_in_set(id_, '${files}')`
                curdPost('sql', sql).then(res => {
                    this.fileList = res.variables && res.variables.data
                })
            },
            consult (data) {
                this.alertReport(testingPath[data.number], data.id)
            },
            timeFormat (time) {
                return new Date(time.getTime() + 28800000).toJSON().slice(0, 10)
            },
            // 组装查询SQL
            search () {
                const { report, sampleId, sampleName, projectName, sampleTime } = this.searchParam
                const start = sampleTime && sampleTime.length ? this.timeFormat(sampleTime[0]) : ''
                const end = sampleTime && sampleTime.length ? this.timeFormat(sampleTime[1]) : ''
                var t = ''
                if (start === end) {
                    t = `like '%${start}%'`
                } else {
                    t = `between '${start}' and '${end}'`
                }
                const paramsList = {
                    report: ` and bao_gao_bian_hao_ like '%${report}%'`,
                    sampleId: ` and yang_pin_bian_hao like '%${sampleId}%'`,
                    sampleName: ` and yang_pin_ming_che like '%${sampleName}%'`,
                    projectName: ` and gai_zhang_jian_pd like '%${projectName}%'`,
                    sampleTime: ` and song_jian_shi_jia ${t}`
                }
                let params = ''
                Object.keys(this.searchParam).forEach(item => {
                    if (this.searchParam[item]) {
                        params += paramsList[item]
                    }
                })
                const sql = `${this.globalSql}${params} order by create_time_ desc limit 0,20`
                // console.log(sql)
                this.loadData(sql)
            },
            handleSizeChange (value) {
                this.currentPage = 1
                const sql = `${this.globalSql} order by create_time_ desc limit 0,${value}`
                this.loadData(sql)
            },
            handleCurrentChange (value) {
                const sql = `${this.globalSql} order by create_time_ desc limit ${value},20`
                this.loadData(sql)
            },
            alertReport (path, id) {
                this.srcUrl = `${this.$reportPath.replace('show', 'pdf')}${path}&id_=${id}`
                this.visible = true
            },
            // 文件预览
            preview (file) {
                if (imageType.includes(file.ext)) {
                    this.zIndex = PopupManager.getZIndex()
                    this.fileUrl = previewFile(file.id)
                    this.fileType = 'image'
                } else {
                    this.getOption(file)
                    this.openWindow()
                    this.fileType = ''
                }
            },
            getOption (file) {
                this.fileOption.user.id = this.$store.getters.userId
                this.fileOption.user.name = this.$store.getters.name
                this.fileOption.url = BASE_API() + SYSTEM_URL() + `/file/download?attachmentId=${file.id}`
                this.fileOption.editUrl = BASE_API() + SYSTEM_URL() + `/file/editCallback?fileName=${file.fileName}&fileType=${file.ext}&id=${file.id}`
                this.fileOption.title = file.fileName
                this.fileOption.fileType = file.ext
                console.log(this.fileOption)
            },
            openWindow () {
                let routeData = this.$router.resolve({
                    path: '/fileView',
                    query: this.fileOption
                })
                window.open(routeData.href);
            },
            download (file) {
                downloadFile(file)
            }
        }
    }
</script>

<style lang="scss">
    .content {
        .header {
            margin-top: 5px;
            width: 100%;
            height: 25px;
            text-align: center;
            font-weight: 700;
            background-color: #f9ffff;
            font-size: 18px;
        }
        .search-box {
            height: 30px;
            margin-bottom: 20px;
            .label {
                margin: 0 6px 0 6px;
                color: #916266;
                font-size: 12px;
            }
            .input {
                width: 150px;
                font-size: 12px;
                height: 28px !important;
                line-height: 28px;
                color: #606266;
            }
            .btn {
                margin-left: 10px;
                background-color: #409eff;
                border-color: #409eff;
                font-size: 12px;
                border-radius: 3px;
                padding: 7px 15px;
            }
        }
        .table-container{
            width: 100%;
            height: calc(100vh - 220px);
        }
        .pagination{
            height: 35px;
            padding: 5px 2px;
        }
        .el-table__header .table-header{
            color: #000;
            font-size: 14px;
            padding: 6px 6px;
            background: #a7d6f8 !important
        }
        // .tableRowClassName {
        //     backface-visibility: #d9eefd;
        // }
        // .el-table .warning-row {
        //     background: #d9eefd;
        // }
        .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
            background: #d9eefd;
        }
        .more {
            cursor: pointer;
            color: #409eff;
        }
        .el-dropdown-link {
            cursor: pointer;
            color: #409eff;
        }
        .el-icon-arrow-down {
            font-size: 12px;
        }
    }
    .operate-item {
        cursor: pointer;
        color: #85ce61;
        .el-icon-download {
            float: right;
            font-size: 16px;
            color: #409eff;
        }
    }
</style>
