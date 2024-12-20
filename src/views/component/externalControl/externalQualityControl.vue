<template>
    <div>
        <div class="externalControl">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">外部质量控制活动计划库/子表</div>
                    <div v-if="readonly" />
                    <div>
                        <el-button type="primary" size="mini" icon="ibps-icon-add" @click="openDialog"> 添加</el-button>
                        <el-button type="danger" size="mini" icon="ibps-icon-remove" @click="handleDelete"> 删除</el-button>
                        <el-button type="success" size="mini" icon="ibps-icon-sign-in" @click="handleImport"> 导入数据</el-button>
                        <el-button type="warning" size="mini" icon="ibps-icon-sign-out" @click="handleDownload"> 导出模版</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-table ref="external" :data="externalDataFilter" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" />
                        <el-table-column label="验证类型" prop="biDuiLeiXing" />
                        <el-table-column label="活动名称" prop="huoDongMingCheng" />
                        <el-table-column label="序号" prop="xuHao" />
                        <el-table-column label="能力验证提供者" prop="zuZhiDanWei">
                            <template slot-scope="scope">
                                <ibps-link-data
                                    v-model="scope.row.zuZhiDanWei"
                                    size="mini"
                                    readonly
                                    template-key="nlyztgzzly"
                                    :multiple="false"
                                    :temp-search="true"
                                    value-key="ming_cheng_"
                                    label-key="ming_cheng_"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="室间质评组织方或室间比对方" prop="shiYanShiJianBiDu">
                            <template slot-scope="scope">
                                <ibps-link-data
                                    v-model="scope.row.shiYanShiJianBiDu"
                                    size="mini"
                                    template-key="sjzpzzfhsjbdfzly"
                                    readonly
                                    :temp-search="true"
                                    value-key="ming_cheng_"
                                    label-key="ming_cheng_"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="项目名称" prop="xiangMuMingCheng" />
                        <el-table-column label="组合名称" prop="zuTao" />
                        <el-table-column label="领域代码" prop="lingYuDaiMa" />
                        <el-table-column label="检验系统" prop="jianYanXiTong">
                            <template slot-scope="scope">
                                <ibps-custom-dialog
                                    v-model="scope.row.jianYanXiTong"
                                    size="mini"
                                    template-key="swckqjxzsbdhk"
                                    multiple
                                    disabled
                                    type="dialog"
                                    class="custom-dialog"
                                    placeholder="请选择"
                                    icon="el-icon-search"
                                    style="width:100%"
                                />
                            </template>

                        </el-table-column>
                        <el-table-column label="领域" prop="lingYu">
                            <template slot-scope="scope">
                                <ibps-link-data
                                    v-model="scope.row.lingYu"
                                    size="mini"
                                    template-key="lyzly"
                                    :multiple="false"
                                    readonly
                                    :temp-search="true"
                                    value-key="ming_cheng_"
                                    label-key="ming_cheng_"
                                    :dynamic-params="dynamicParams"
                                />
                            </template>

                        </el-table-column>
                        <el-table-column label="参加人员" prop="canJiaRenYuan">
                            <template slot-scope="scope">
                                <ibps-user-selector
                                    v-model="scope.row.canJiaRenYuan"
                                    type="user"
                                    readonly-text="text"
                                    disabled
                                    multiple
                                    size="mini"
                                    :filter="filter"
                                    filtrate
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="计划时间" prop="jiHuaShiJian" />
                        <el-table-column label="备注" prop="beiZhu" />
                        <el-table-column label="操作栏目" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" icon="ibps-icon-edit" size="mini" @click="handleEdit(scope.row,scope.$index)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        layout="total,sizes,prev, pager, next,jumper"
                        :current-page="requestPage.pageNo"
                        :page-size="requestPage.limit"
                        :page-sizes="[10,15,20,30,50,100]"
                        :total="externalData.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </el-col>
            </el-row>
        </div>
        <el-dialog
            ref="dialogFef"
            :title="isEdit?'编辑':'添加'"
            :visible.sync="dialogVisible"
            append-to-body
            width="80%"
            top="0vh"
            @close="closeDialog"
        >
            <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" label-position="right">
                <el-form-item label="验证类型" prop="biDuiLeiXing">
                    <el-radio-group v-model="form.biDuiLeiXing">
                        <el-radio label="能力验证（PT）">能力验证（PT）</el-radio>
                        <el-radio label="室间质评（EQA）">室间质评（EQA）</el-radio>
                        <el-radio label="实验室比对">实验室比对</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="活动名称" prop="huoDongMingCheng">
                            <el-input v-model="form.huoDongMingCheng" size="mini" placeholder="请输入活动名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="序号" prop="xuHao">
                            <el-input v-model="form.xuHao" size="mini" placeholder="请输入序号" type="number" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-tag v-if="false" type="warning" style="width: 100%;height: 30px;line-height: 30px;">室间质评组织方和室间比对方数据需点击“配置”按钮,选中室间质评组织方或室间比对方配置对应类型</el-tag>
                <el-form-item v-if="form.biDuiLeiXing=='能力验证（PT）'" label="能力验证提供者" prop="zuZhiDanWei">
                    <ibps-link-data
                        v-model="form.zuZhiDanWei"
                        style="height: 28px;line-height: 28px;font-size: 14px;"
                        size="mini"
                        template-key="nlyztgzzly"
                        :multiple="false"
                        :temp-search="true"
                        value-key="ming_cheng_"
                        label-key="ming_cheng_"
                    />
                </el-form-item>
                <el-form-item v-if="form.biDuiLeiXing=='室间质评（EQA）'||form.biDuiLeiXing=='实验室比对'" label="室间质评组织方或室间比对方" prop="shiYanShiJianBiDu">
                    <ibps-link-data
                        v-model="form.shiYanShiJianBiDu"
                        style="height: 28px;line-height: 28px;font-size: 14px;"
                        size="mini"
                        template-key="sjzpzzfhsjbdfzly"
                        :multiple="false"
                        :temp-search="true"
                        value-key="ming_cheng_"
                        label-key="ming_cheng_"
                    />
                </el-form-item>
                <el-tag type="warning" style="width: 100%;height: 30px;line-height: 30px;">提交后系统将以项目名称字段的值为准，若是系统额外的项目，只需填写《检验项目》即可</el-tag>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="检验项目" prop="jianYanXiangMu">
                            <ibps-custom-dialog
                                v-model="form.jianYanXiangMu"
                                size="mini"
                                template-key="nlfwdhk"
                                :disabled="false"
                                type="dialog"
                                class="custom-dialog"
                                placeholder="请选择"
                                icon="el-icon-search"
                                style="width:100%"
                                @change-link-data="jianYanXiangMuChange"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="项目名称" prop="xiangMuMingCheng">
                            <el-input v-model="form.xiangMuMingCheng" size="mini" placeholder="请先选择检验项目" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="组合名称" prop="zuTao">
                            <el-input v-model="form.zuTao" size="mini" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="领域代码" prop="lingYuDaiMa">
                            <el-input v-model="form.lingYuDaiMa" size="mini" placeholder="请先选择检验项目" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="领域" prop="lingYu">
                            <ibps-link-data
                                v-model="form.lingYu"
                                style="height: 28px;line-height: 28px;font-size: 14px;"
                                size="mini"
                                template-key="lyzly"
                                :multiple="false"
                                :temp-search="true"
                                value-key="ming_cheng_"
                                label-key="ming_cheng_"
                                :dynamic-params="dynamicParams"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="计划时间" prop="jiHuaShiJian">
                            <el-input v-model="form.jiHuaShiJian" size="mini" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="检验系统" prop="jianYanXiTong">
                            <ibps-custom-dialog
                                v-model="form.jianYanXiTong"
                                size="mini"
                                template-key="swckqjxzsbdhk"
                                multiple
                                :disabled="false"
                                type="dialog"
                                class="custom-dialog"
                                placeholder="请选择"
                                icon="el-icon-search"
                                style="width:100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="参加人员" prop="canJiaRenYuan">
                            <ibps-user-selector
                                v-model="form.canJiaRenYuan"
                                type="user"
                                readonly-text="text"
                                :disabled="false"
                                multiple
                                size="mini"
                                style="width:100%"
                                :filter="filter"
                                filtrate
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="备注" prop="beiZhu">
                    <el-input v-model="form.beiZhu" size="mini" placeholder="请输入" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon="ibps-icon-ok" @click="submitForm">确 定</el-button>
                <el-button type="danger" icon="ibps-icon-cancel" @click="closeDialog">取 消</el-button>
            </div>
        </el-dialog>
        <import-table
            :visible="importTableDialogVisible"
            title="导入"
            @close="(visible) => (importTableDialogVisible = visible)"
            @action-event="handleImportTableActionEvent"
        />
    </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import importTable from '@/business/platform/form/formrender/dynamic-form/components/import-table'
import ibpsUserSelector from '@/business/platform/org/selector'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import IbpsImport from '@/plugins/import'
import IbpsExport from '@/plugins/export'
import ActionUtils from '@/utils/action'
import { downloadFile } from '@/business/platform/file/utils'
export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog'),
        importTable,
        ibpsUserSelector,
        IbpsLinkData
    },
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            isEdit: false,
            externalData: [],
            disabled: false,
            nodeId: '',
            show: true,
            requestPage: {
                limit: 10,
                pageNo: 1
            },
            form: {
                biDuiLeiXing: '',
                huoDongMingCheng: '',
                xuHao: '',
                zuZhiDanWei: '',
                shiYanShiJianBiDu: '',
                xiangMuMingCheng: '',
                zuTao: '',
                lingYuDaiMa: '',
                lingYu: '',
                jiHuaShiJian: '',
                jianYanXiTong: '',
                canJiaRenYuan: '',
                beiZhu: '',
                jianYanXiangMu: ''
            },
            rules: {
                biDuiLeiXing: [
                    { required: true, message: '请选择验证类型', trigger: 'change' }
                ],
                huoDongMingCheng: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                xuHao: [
                    { required: true, message: '请输入序号', trigger: 'blur' }
                ],
                zuZhiDanWei: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                shiYanShiJianBiDu: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                xiangMuMingCheng: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                lingYu: [
                    { required: true, message: '请选择领域', trigger: 'change' }
                ],
                canJiaRenYuan: [
                    { required: true, message: '请选择参加人员', trigger: 'change' }
                ],
                jiHuaShiJian: [
                    { required: true, message: '请输入计划时间', trigger: 'blur' }
                ]
            },
            dialogVisible: false,
            importTableDialogVisible: false,
            multipleSelection: [],
            filter: [{
                descVal: '1',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            dynamicParams: {
                di_dian_san_: this.$store.getters.level.second || this.$store.getters.level.first
            },
            rowIndex: 0,
            paramsData: {},
            isFirst: true
        }
    },
    computed: {
        externalDataFilter () {
            return this.externalData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    watch: {
        'form.biDuiLeiXing': {
            handler (value, old) {
                if (value === '能力验证（PT）') {
                    this.form.shiYanShiJianBiDu = ''
                } else if (value === '室间质评（EQA）') {
                    this.form.zuZhiDanWei = ''
                } else if (value === '实验室比对') {
                    this.form.zuZhiDanWei = ''
                }
            }
        },
        'formData.sjzphdjhylxqb': {
            handler (value, old) {
                if (value && value.length) {
                    this.externalData = JSON.parse(JSON.stringify(value))
                    this.isFirst = false
                }
            }
        }
    },
    methods: {
        jianYanXiangMuChange (key, data) {
            this.form.xiangMuMingCheng = data.jian_yan_xiang_mu
            this.form.lingYuDaiMa = data.xu_hao_
            this.form.lingYu = data.zhuan_ye_
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleDelete () {
            this.$confirm('确定删除当前选中数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelection.length > 0) {
                    this.externalData = this.externalData.filter(row => !this.multipleSelection.includes(row))
                    this.$emit('change-data', 'sjzphdjhylxqb', this.externalData)
                } else {
                    this.$message.warning('请选择数据')
                }
            })
        },
        closeDialog () {
            this.dialogVisible = false
        },
        openDialog () {
            this.dialogVisible = true
            this.isEdit = false
            this.form = {
                biDuiLeiXing: '能力验证（PT）',
                huoDongMingCheng: '',
                xuHao: '',
                zuZhiDanWei: '',
                shiYanShiJianBiDu: '',
                xiangMuMingCheng: '',
                zuTao: '',
                lingYuDaiMa: '',
                lingYu: '',
                jiHuaShiJian: '',
                jianYanXiTong: '',
                canJiaRenYuan: '',
                beiZhu: '',
                jianYanXiangMu: ''
            }
        },
        handleEdit (row, index) {
            this.isEdit = true
            this.dialogVisible = true
            this.rowIndex = index
            this.form = cloneDeep(row)
            console.log(cloneDeep(this.form))
        },
        submitForm () {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    const {
                        biDuiLeiXing, huoDongMingCheng, xuHao, zuZhiDanWei, shiYanShiJianBiDu, xiangMuMingCheng, zuTao, lingYuDaiMa, lingYu, jiHuaShiJian, jianYanXiTong, canJiaRenYuan, beiZhu, jianYanXiangMu } = this.form
                    if (this.isEdit) {
                    // this.externalData[this.rowIndex] = this.form
                    // this.$set(this.externalData, this.rowIndex, this.form)
                        this.externalData.splice(this.rowIndex, 1, this.form)
                    } else {
                        this.externalData.push({
                            biDuiLeiXing,
                            huoDongMingCheng,
                            xuHao,
                            zuZhiDanWei,
                            shiYanShiJianBiDu,
                            xiangMuMingCheng,
                            zuTao,
                            lingYuDaiMa,
                            lingYu,
                            jiHuaShiJian,
                            jianYanXiTong,
                            canJiaRenYuan,
                            beiZhu,
                            jianYanXiangMu
                        })
                    }
                    this.$message.success(`表单提交成功！`)
                    this.dialogVisible = false
                    this.$emit('change-data', 'sjzphdjhylxqb', this.externalData)
                } else {
                    this.$message.error('表单验证失败，请检查输入！')
                    return false
                }
            })
        },
        handleImport () {
            this.importTableDialogVisible = true
        },
        getShebList () {
            const sbsql = `select id_, yuan_she_bei_bian from t_sbdj where yuan_she_bei_bian is not null and yuan_she_bei_bian != ''`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sbsql).then(res => {
                    const arr = res.variables.data
                    resolve(arr)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getSb (deviceList, deviceCode) {
            if (!deviceCode) {
                return ''
            }
            const codeList = deviceCode.split(',')
            const idList = []
            codeList.forEach(n => {
                const device = deviceList.find(item => item.yuan_she_bei_bian === n.trim())
                idList.push(device?.id_)
            })
            return idList.join(',')
        },
        handleDownload () {
            IbpsExport.excel({
                columns: this.getDataValue(),
                data: [],
                nameKey: 'name',
                title: '外部质量控制活动计划'
            }).then(() => {
                ActionUtils.success('导出成功')
            })
            // downloadFile({ id: 'xxx', fileName: '室间质评活动计划一览表', ext: 'xlsx' })
        },
        getDataValue (data) {
            const columns = [
                {
                    field_name: 'biDuiLeiXing',
                    label: '验证类型',
                    name: 'biDuiLeiXing'
                },
                {
                    field_name: 'huoDongMingCheng',
                    label: '活动名称',
                    name: 'huoDongMingCheng'
                },
                {
                    field_name: 'zuZhiDanWei',
                    label: '能力验证提供者',
                    name: 'zuZhiDanWei'
                },
                {
                    field_name: 'shiYanShiJianBiDu',
                    label: '室间质评组织方或室间比对方',
                    name: 'shiYanShiJianBiDu'
                },
                {
                    field_name: 'jianYanXiTong',
                    label: '检验系统（填原设备编号）',
                    name: 'jianYanXiTong'
                },
                {
                    field_name: 'lingYu',
                    label: '领域',
                    name: 'lingYu'
                },
                {
                    field_name: 'lingYuDaiMa',
                    label: '领域代码',
                    name: 'lingYuDaiMa'
                },
                {
                    field_name: 'canJiaRenYuan',
                    label: '参加人员',
                    name: 'canJiaRenYuan'
                },
                {
                    field_name: 'xuHao',
                    label: '序号',
                    name: 'xuHao'
                },
                {
                    field_name: 'xiangMuMingCheng',
                    label: '项目名称',
                    name: 'xiangMuMingCheng'
                },
                {
                    field_name: 'zuTao',
                    label: '组合名称',
                    name: 'zuTao'
                },
                {
                    field_name: 'jiHuaShiJian',
                    label: '计划时间',
                    name: 'jiHuaShiJian'
                },
                {
                    field_name: 'beiZhu',
                    label: '备注',
                    name: 'beiZhu'
                }
            ]
            return columns
        },
        getKeys (data) {
            return Array.isArray(data) ? data.reduce((acc, item) => ({ ...acc, [item.label]: item.name }), {}) : {}
        },
        async handleImportTableActionEvent (file, options) {
            const deviceList = await this.getShebList() // 获取所有设备
            const nowDate = await this.$common.getDateNow(10)
            const defaultPlanDate = await this.$common.getFormatDate('string', 10, await this.$common.getDate('month', 1, nowDate))
            IbpsImport.xlsx(file, options).then(({ header, results }) => {
                const list = []
                const keys = this.getKeys(this.getDataValue())
                const { userList } = this.$store.getters || {}
                results.forEach(item => {
                    const obj = {}
                    Object.keys(item).forEach(key => {
                        if (keys[key]) {
                            obj[keys[key]] = item[key]
                        }
                    })
                    list.push(obj)
                })
                list.forEach(async item => {
                    item.jiHuaShiJian = item.jiHuaShiJian || defaultPlanDate
                    item.canJiaRenYuan = await this.getUserId(userList, item.canJiaRenYuan)
                    item.jianYanXiTong = await this.getSb(deviceList, item.jianYanXiTong)
                })
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.externalData = this.externalData.concat(list)
                        this.$refs.external && this.$refs.external.$forceUpdate()
                        console.log(JSON.parse(JSON.stringify(this.externalData)), 'console.log(this.externalData)')
                        this.$emit('change-data', 'sjzphdjhylxqb', this.externalData)
                    })
                })
                this.importTableDialogVisible = false
            })
        },
        getUserId (userList, userName) {
            if (!userName) {
                return ''
            }
            const nameList = userName.split(',')
            const idList = []
            nameList.forEach(n => {
                const user = userList.find(item => item.userName === n.trim())
                idList.push(user?.userId)
            })
            return idList.join(',')
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.requestPage.pageNo = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.requestPage.limit = val
            this.requestPage.pageNo = 1
        }
    }
}
</script>
<style lang="scss" scoped>
.externalControl{
    margin-bottom: 20px;
    .button{
        display: flex;
        justify-content: space-between;
        padding: 0px 0px 0px 15px;
        background: #f0ffff;
        .title {
            color: #999;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 0;
        }
        .el-button {
            margin: 0;
        }
    }
}
::v-deep .el-dialog__body {
    height: 70vh;
}
::v-deep .el-input__inner {
    height: 28px;
    line-height: 28px;
}
.dialog-footer {
        text-align: center;
    }
    .el-form {
        padding: 15px;
    }
</style>
