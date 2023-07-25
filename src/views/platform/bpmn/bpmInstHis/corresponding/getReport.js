/**
 * 针对全局报表进行赋值
 */
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
export default {
    methods: {
        /*1 遍历，返回附件和报告*/
        selectRetrunData (key) {
            const temp = this.reportAll.find(item => item.liu_cheng_xuan_ze === key.procDefKey)
            console.log(temp)
            let data = {
                report: temp.bao_biao_lu_jing_ ? temp.bao_biao_lu_jing_.split(',') : [],
                file: temp.fu_jian_nei_rong_,
                formId: key.bizKey,
                mysql: temp.shi_fou_zi_biao_,
                rele: temp.guan_lian_zi_duan
            }
            return data
        },
        alertReport (value, id_) {
            this.srcUrl = `${this.$reportPath.replace('show', 'pdf')}${value}&id_=${id_}`
            this.visible = true
        },
        /* 2、打开内容与附件，获取相关报告与附件内容*/
        getReportAndFile (data) {
            if (this.forClick == data.id || this.isDisable) { //判断，是否重复点击  是否多次高速点击
                if (this.isDisable) this.$message.error('请勿快速点击！');
                return
            }
            this.numbersClick()
            this.forClick = data.id

            this.currReportCont = {}
            if (!data.procDefKey) return

            let cont = this.selectRetrunData(data)
            if (!cont) return

            this.currReportCont = cont
            if (cont.file && cont.mysql) { //拥有文件的表单，查询对应文件
                this.getfIle(cont)
            }
        },
        /* 3打开报告 */
        clickCont (cont, i) {
            this.srcUrl = this.$reportPath.replace('show', "pdf") + cont.report[i] + '&id_=' + cont.formId
            this.visible = true
        },
        clickConts_GuanLiPingShen (i) {
            this.srcUrl = this.$reportPath.replace('show', 'pdf') + '37管理评审程序/GDYR-CX30-R04C 管理评审改进跟踪验证表.rpx&id_=' + i
            this.visible = true
        },
        clickConts_BuFuHeXiang (i) {
            this.srcUrl = this.$reportPath.replace('show', 'pdf') + '36内部审核程序/GDYR-CX22-R01B 不符合项报告与纠正措施记录表.rpx&id_=' + i
            this.visible = true
        },
        // 检测管理打开润乾报表
        clickConts_jianCe (name, i) {
            this.srcUrl = this.$reportPath.replace('show', 'pdf') + name + '&id_=' + i
            this.visible = true
        },
        /*3 获取文件内容，以表名和id去获取对应参数
            根据, 分割条件
            根据。分割查询次数
        */
        getfIle (cont) {
            this.fileId = ''
            let data = {}
            data.mysql = cont.mysql.split('.')//如果是多个数据表
            data.file = cont.file.split('.')//如果是多个数据表

            if (cont.rele) data.rele = cont.rele.split(".") //如果是多个数据表
            /* 根据数据库名循环，判断要调用多少次ajax   */
            let arr = []
            for (let i in data.mysql) {
                let rele = ''
                if (data.rele) rele = data.rele[i]
                arr.push(this.waitData(data, rele, cont, i))
            }
            Promise.all(arr).then(res => {
                this.fileId = res.toString()
            }).catch(err => {
                console.log("error", err);
            })
        },
        /* 拼接sql*/
        joinSql (mysql, file, rele, id) {
            return 'select ' + file + ' from ' + mysql + ' where ' + (rele ? rele : 'id_') + `='` + id + `'`
        },
        async waitData (data, rele, cont, index) {
            let n = await this.getFile(data, rele, cont, index);
            return n;
        },
        /* AXIOS获取文件*/
        getFile (data, rele, cont, index) {
            return new Promise((resolve, reject) => {
                curdPost('sql', this.joinSql(data.mysql[index], data.file[index], rele, cont.formId)).then(response => {
                    let result = ''
                    let fName = data.file[index] //多个文件字段
                    let fNames = fName.split(",") //每个文件字段又是以,拼接
                    let rul = response.variables.data
                    if (rul) {
                        /* 还未做 同一张表多个文件字段的判断*/
                        for (let j in rul) {
                            //如果是多个子表
                            if (rul[j][fName]) {
                                result = result ? result + ',' + rul[j][fName] : rul[j][fName]
                            } else if (fNames && fNames.length > 1) { //如果是多个子表，子表多个字段
                                for (let d in fNames) {
                                    if (rul[j][fNames[d]]) {
                                        result = result ? result + ',' + rul[j][fNames[d]] : rul[j][fNames[d]]
                                    }
                                }
                            }
                        }
                    }
                    resolve(result)
                })
            })
        }
    }
}
