import { create, update, load, upEmployee } from '@/api/platform/org/employee'
export default {
    data () {
        const { first = '', second = '' } = this.$store.getters.level
        const level = second || first
        return {
            level,
            checkList1: [],
            weiTuoroleList: [],
            checkList2: [],
            weiTuoroleListYuan: [],
            daiLiroleListYuan: [],
            daiLiroleList: [],
            dailiRenXinxin: null,
            bpmAgent: {
                biao_ti_: '',
                wei_tuo_ren_: this.$store.getters.userId,
                dai_li_ren_: '',
                wei_tuo_ren_xing_: this.$store.getters.name,
                dai_li_ren_xing_m: '',
                shi_fou_qi_yong_: 'enabled',
                sheng_xiao_shi_ji: '',
                jie_shu_shi_jian_: '',
                wei_tuo_jiao_se_i: '',
                wei_tuo_jiao_se_m: '',
                wei_tuo_yuan_shi_: '',
                dai_li_yuan_shi_s: '',
                bei_zhu_: '',
                di_dian_: level
            }
        }
    },
    methods: {
        // 提交保存数据
        saveData (formId) {
            const list1 = []
            const listId = []
            const list3 = []
            const listName = []
            this.checkList1.forEach(item => {
                const itemData = this.weiTuoroleList.find(it => it.id === item)
                if (itemData) {
                    list1.push(itemData)
                    listId.push(itemData.id)
                    listName.push(itemData.name)
                }
            })
            list1.forEach(item => {
                const itemData = this.daiLiroleList.find(it => it.id === item.id)
                if (!itemData) {
                    // listId.push(item.id)
                    list3.push(item)
                    // listName.push(item.name)
                }
            })
            this.weiTuoroleListYuan = list3

            this.bpmAgent.wei_tuo_jiao_se_i = listId.join(',')
            this.bpmAgent.wei_tuo_jiao_se_m = listName.join(',')
            this.bpmAgent.dai_li_yuan_shi_s = JSON.stringify(this.daiLiroleListYuan)
            this.bpmAgent.wei_tuo_yuan_shi_ = JSON.stringify(this.weiTuoroleListYuan)
            if (!formId) {
                this.addShiWuDaiLi()
            } else {
                this.updateShiWuDaiLi(formId)
            }
        },
        updateShiWuDaiLi (id) {
            const list = []
            const obj = {
                where: {
                    id_: id
                },
                param: this.bpmAgent
            }
            delete this.bpmAgent.create_by_
            delete this.bpmAgent.create_time_
            list.push(obj)

            const params1 = {
                tableName: 't_swdl',
                updList: list
            }
            this.$common.request('update', params1
            ).then(response => {
                this.getUpdate()
                this.closeDialog()
            })
        },
        getUpdate () {
            const attrValueVoList = []
            const partyAttrs = this.dailiRenXinxin.variables.partyAttrs
            partyAttrs.forEach(item => {
                if (item.values.length > 0) {
                    const obj = {
                        attrId: item.values[0].attrID
                    }
                    attrValueVoList.push(obj)
                }
            })

            // 部门数据组装
            const partyPositionsList = []
            const partyPositions = this.dailiRenXinxin.variables.partyPositions
            partyPositions.forEach(item => {
                const obj = {
                    id: item.id,
                    name: item.name,
                    isPrincipal: item.isPrincipal === 'Y',
                    isMainPost: item.isMainPost === 'Y'
                }
                partyPositionsList.push(obj)
            })

            const roleVoList = []
            this.daiLiroleListYuan.forEach(item => {
                const obj = {
                    id: item.id,
                    name: item.name,
                    subSystemName: item.subSystemName,
                    source: item.source,
                    canDelete: item.source === '自有'
                }
                roleVoList.push(obj)
            })
            if (this.bpmAgent.shi_fou_qi_yong_ === 'enabled') {
                this.weiTuoroleListYuan.forEach(item => {
                    const obj = {
                        id: item.id,
                        name: item.name,
                        subSystemName: item.subSystemName,
                        source: item.source,
                        canDelete: item.source === '自有'
                    }
                    roleVoList.push(obj)
                })
            }

            if (roleVoList.length > 0) {
                const list = []
                roleVoList.forEach(item => {
                    list.push(item.id)
                })
                this.dailiRenXinxin.data.job = list.join(',')
            }
            const params = {
                attrValueVoList: attrValueVoList,
                partyEmployeePo: this.dailiRenXinxin.data,
                positionVoList: partyPositionsList,
                roleVoList: roleVoList,
                user: this.dailiRenXinxin.data,
                userGroupPoList: []
            }

            update(params).then(response => {
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        getWeiTuo (id, type = 1, formId = '') {
            if (!id) return
            return new Promise((resolve, reject) => {
                load({ employeeId: id })
                    .then((response) => {
                        const data = response
                        const partyRole = response.variables.partyRoles
                        if (type === 1) {
                            this.weiTuoroleListYuan = JSON.parse(JSON.stringify(partyRole))
                            this.weiTuoroleList = partyRole || []
                        }
                        if (type === 2) {
                            this.dailiRenXinxin = data
                            // 新增选择代理人数据
                            if (!formId) {
                                this.daiLiroleListYuan = JSON.parse(JSON.stringify(partyRole))
                            } else {
                            // 修改选择代理人选择
                                const parRoleList = []
                                // 复原代理人 原来的角色
                                partyRole.forEach(item => {
                                    const dataIndex = this.checkList1.findIndex(it => it === item.id)
                                    if (dataIndex < 0) {
                                        parRoleList.push(item)
                                    }
                                })
                                this.daiLiroleListYuan = JSON.parse(JSON.stringify(parRoleList))
                            }
                            partyRole.forEach(item => {
                                item.disabled = true
                            })
                            this.daiLiroleList = partyRole || []
                        }
                        resolve(data)
                    })
                    .catch(() => {
                    })
            })
        }
    }
}
