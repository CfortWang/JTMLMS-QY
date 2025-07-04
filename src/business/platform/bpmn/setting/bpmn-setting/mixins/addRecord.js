export default {
    data () {
        return {
            // 标识是否初次创建
            flag: false
        }
    },
    methods: {
        getRecord (id) {
            // const sql = `select * from t_lcidglbdbb where gui_dang_lei_xing = 'process' and liu_cheng_xuan_ze = '${id}'`
            this.$common.request('query', {
                key: 'getReportByBpmKey',
                params: [id]
            }).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    return
                }
                const { bao_biao_lu_jing_, fu_jian_nei_rong_, shi_fou_zi_biao_, guan_lian_zi_duan, ti_jiao_kuai_zhao, bo_hui_kuai_zhao_, is_custom_ } = data[0]
                Object.assign(this, {
                    bao_biao_lu_jing_,
                    fu_jian_nei_rong_,
                    shi_fou_zi_biao_,
                    guan_lian_zi_duan,
                    liu_cheng_xuan_ze: id,
                    ti_jiao_kuai_zhao,
                    bo_hui_kuai_zhao_,
                    is_custom_
                })
            })
        },
        addRecord () {
            if (!this.boCode) {
                this.$message.warning('请先绑定业务对象！')
                return
            }
            if (this.flag || this.liu_cheng_xuan_ze) return this.updateRecord()
            this.add()
        },
        add () {
            const params = {
                tableName: 't_lcidglbdbb',
                paramWhere: [{
                    tableKey_: this.boCode,
                    bao_biao_lu_jing_: this.bao_biao_lu_jing_,
                    fu_jian_nei_rong_: this.fu_jian_nei_rong_,
                    liu_cheng_xuan_ze: this.data.id,
                    guan_lian_zi_duan: this.guan_lian_zi_duan,
                    shi_fou_zi_biao_: this.shi_fou_zi_biao_,
                    ti_jiao_kuai_zhao: this.ti_jiao_kuai_zhao,
                    bo_hui_kuai_zhao_: this.bo_hui_kuai_zhao_,
                    is_custom_: this.is_custom_,
                    gui_dang_lei_xing: 'process'
                }]
            }
            this.$common.request('add', params).then(() => {
                this.flag = true
                this.$message.success('添加成功！')
            })
        },
        updateRecord () {
            const params = {
                tableName: 't_lcidglbdbb',
                updList: [
                    {
                        where: {
                            liu_cheng_xuan_ze: this.liu_cheng_xuan_ze
                        },
                        param: {
                            tableKey_: this.boCode,
                            bao_biao_lu_jing_: this.bao_biao_lu_jing_,
                            fu_jian_nei_rong_: this.fu_jian_nei_rong_,
                            guan_lian_zi_duan: this.guan_lian_zi_duan,
                            shi_fou_zi_biao_: this.shi_fou_zi_biao_,
                            ti_jiao_kuai_zhao: this.ti_jiao_kuai_zhao,
                            bo_hui_kuai_zhao_: this.bo_hui_kuai_zhao_,
                            is_custom_: this.is_custom_
                        }
                    }
                ]
            }
            this.$common.request('update', params).then(() => {
                this.$message.info('修改成功')
            })
        }
    }
}
