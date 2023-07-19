import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import request from '@/utils/request'
import ActionUtils from '@/utils/action'

export default {
    methods: {
        getRecord (id) {
            const sql = `select * from t_lcidglbdbb where liu_cheng_xuan_ze = '${id}'`
            curdPost('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    return
                }
                this.bao_biao_lu_jing_ = data[0].bao_biao_lu_jing_
                this.fu_jian_nei_rong_ = data[0].fu_jian_nei_rong_
                this.shi_fou_zi_biao_ = data[0].shi_fou_zi_biao_
                this.guan_lian_zi_duan = data[0].guan_lian_zi_duan
                this.liu_cheng_xuan_ze = id
            })
        },
        addRecord () {
            if (this.liu_cheng_xuan_ze) return this.updateRecord()
            this.add()
        },
        add () {
            const params = {
                tableName: 't_lcidglbdbb',
                paramWhere: [{
                    bao_biao_lu_jing_: this.bao_biao_lu_jing_,
                    fu_jian_nei_rong_: this.fu_jian_nei_rong_,
                    liu_cheng_xuan_ze: this.data.id,
                    guan_lian_zi_duan: this.guan_lian_zi_duan,
                    shi_fou_zi_biao_: this.shi_fou_zi_biao_
                }]
            }
            curdPost('add', params).then(() => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
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
                            bao_biao_lu_jing_: this.bao_biao_lu_jing_,
                            fu_jian_nei_rong_: this.fu_jian_nei_rong_,
                            liu_cheng_xuan_ze: this.liu_cheng_xuan_ze,
                            guan_lian_zi_duan: this.guan_lian_zi_duan,
                            shi_fou_zi_biao_: this.shi_fou_zi_biao_
                        }
                    }
                ]
            }
            curdPost('update', params).then(() => {
                this.$message({
                    message: '修改成功',
                    type: 'warning'
                })
            })
        }
    }
}
