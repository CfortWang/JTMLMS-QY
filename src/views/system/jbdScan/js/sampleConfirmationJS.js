import repostCurd from '@/business/platform/form/utils/custom/joinCURD.js'
import * as dayjs from 'dayjs'

const options = {
    '一个月': 1,
    '两个月': 2,
    '三个月': 3,
    '四个月': 4,
    '半年': 6,
    '九个月': 9,
    '一年': 12
}
export default {
    methods: {
        /* 唤醒扫码 前端脚本直接调用*/
        openRedar(type) {
            this.redar = true // 扫码图标显示
            this.visible = false // 结果列表,一开始为false
            this.$refs.redarInput.focus(); // 聚焦input
            this.listData = [] // 清空列表
        },
        facilityData(id) {
            if (!id) return // 无参直接反
            this.loadData(id)
            //开始查询设备
            this.facilityId = ''
        },
        /* 获取数据 ，开始查阅记录 */
        loadData(id) {
            let flag = true // 重复扫码标志位
            for (let index in this.listData) { // 判断是否重复，重复扫码 数量自增
                if (this.listData[index].yang_pin_bian_hao == id) {
                    this.listData[index].jie_yang_shu_lian = parseInt(this.listData[index].jie_yang_shu_lian) + 1
                    flag = false
                }
            }
            let sql = `select lei_xing_ from t_yplxb`
            let sql2 = `select yang_pin_gui_ge_ from t_ypbzggb`
            Promise.all([repostCurd('sql',sql),repostCurd('sql',sql2)]).then(([res1,res2]) =>{
                let data  = res1.variables.data
                let data2 = res2.variables.data
                let types = []
                let guiGes = []
                data.forEach(item=>{
                    let obj = {
                        value:item.lei_xing_,
                        label:item.lei_xing_
                    }
                    types.push(obj)
                })
                data2.forEach(item=>{
                    let o = {
                        value:item.yang_pin_gui_ge_,
                        label:item.yang_pin_gui_ge_
                    }
                    guiGes.push(o)
                })
                this.sampleTypes = types
                this.sampleSpecifications = guiGes
            })

            // 扫码扫到新数据,查询 回填展示
            if (flag) {
                let sql = `select ypb.*,sqb.chu_ju_bao_gao_ya from t_lhypb ypb join t_lhwtsqb sqb on ypb.parent_id_ = sqb.id_  and find_in_set(ypb.yang_pin_bian_hao,'${id}') and ypb.jie_yang_zhuang_t = '待接收' and ypb.shi_fou_guo_shen_ = '1'`
                let liuYangSQL = `select liu_yang_qi_xian_ from t_lyqxpzb limit 1`
                let cfIDSQL = `select cun_fang_id_,liu_yang_id_ FROM t_ypwzmrxzb`
                Promise.all([repostCurd('sql', sql), repostCurd('sql', liuYangSQL),repostCurd('sql',cfIDSQL)]).then((res) => {
                    let temp = res[0].variables.data
                    let option = res[1].variables.data[0].liu_yang_qi_xian_
                    let cfID = res[2].variables.data[0].cun_fang_id_
                    let lyID = res[2].variables.data[0].liu_yang_id_
                    let rq = options[option]
                    if (temp) {
                        temp.forEach(item => {
                            item.jie_yang_shu_lian = item.yang_pin_zong_shu
                            item.jie_yang_zhuang_t = '已确认'
                            item.biao_zhi_uuid_1 = this.uuid()
                            item.biao_zhi_uuid_2 = this.uuid()
                            item.biao_zhi_uuid_3 = this.uuid()
                            item.biao_zhi_uuid_4 = this.uuid()
                            // item.shi_fou_liu_yang_ = '是'
                            item.shi_fou_liu_yang_yi = '是'
                            item.shi_fou_liu_yang_er = '是'
                            item.shi_fou_liu_yang_san = '是'
                            item.shi_fou_liu_yang_si = '是'
                            item.yan_shou_jie_guo_ = '完好'
                            item.liu_yang_shu_lian_yi = ' ml/支×1支'
                            item.shou_yang_wei_zhi_yi = cfID
                            item.liu_yang_wei_zhi_yi = lyID
                            item.yang_pin_lei_er_ ? 
                            (item.liu_yang_shu_lian_er = ' ml/支×1支' ,item.shou_yang_wei_zhi_er = cfID,item.liu_yang_wei_zhi_er = lyID)  : null
                            item.yang_pin_lei_san_ ?
                             (item.liu_yang_shu_lian_san = ' ml/支×1支',item.shou_yang_wei_zhi_san = cfID,item.liu_yang_wei_zhi_san = lyID) : null
                            item.yang_pin_lei_si_ ?
                             (item.liu_yang_shu_lian_si = ' ml/支×1支',item.shou_yang_wei_zhi_si = cfID,item.liu_yang_wei_zhi_si = lyID) : null
                            
                            // item.yang_pin_lei_er_ ? item.liu_yang_shu_lian_er = ' ml/支×1支' : null
                            // item.yang_pin_lei_san_ ? item.liu_yang_shu_lian_san = ' ml/支×1支' : null
                            // item.yang_pin_lei_si_ ? item.liu_yang_shu_lian_si = ' ml/支×1支' : null
                            item.liu_yang_ri_qi_ = new Date(new Date().getTime() + 28800000).toJSON().slice(0, 10).replace('T', ' ')
                            item.yang_pin_lei_er_ ? this.$set(item, 'flag2', true) : this.$set(item, 'flag2', false)
                            item.yang_pin_lei_san_ ? this.$set(item, 'flag3', true) : this.$set(item, 'flag3', false)
                            item.yang_pin_lei_si_ ? this.$set(item, 'flag4', true) : this.$set(item, 'flag4', false)
                            item.liu_yang_qi_xian = dayjs(item.song_jian_shi_jia).add(rq, 'month').format("YYYY-MM-DD")
                        })
                        this.listData.push(temp[0])
                        // console.log(this.listData)
                    }
                })
            }

        },
        /* 列表失去焦点*/
        handleChange() {
            this.$refs.redarInput.focus(); //聚焦input
        },
        /* 关闭弹出列表框*/
        closeDialog() {
            this.remRedar()
            //回传关闭事件。隐藏当前组件。
        },
        handleClose() {
            this.handleChange()
            this.$confirm('确认关闭扫码列表页面？').then(_ => {
                this.closeDialog();
            }).catch(_ => {});
        },
        handleAnySituation(callBackBool,msg,type){
            this.$emit('callback', callBackBool)
            this.visable = false
            this.$message({
                message: msg,
                type: type
            })
            this.closeDialog();
        },
        submitData(type) {
            // this指针
            let this_ = this;
            // 回传关闭事件。隐藏当前组件。
            let judge = true;

            if (this_.listData.length == 0) {
                this.$emit('callback', true)
                this.visable = false
                this.$message({
                    message: '暂无样品待接收确认！',
                    type: 'error'
                })
                this.closeDialog();
            } else {
                this.$confirm('请再次确认 [样品接收信息]').then(_ => {

                    // 获取样品列表
                    let ypInfoList = this_.listData
                    //   console.log(ypInfoList, "样品信息")

                    let dWhere = []
                    let ypbh = []
                    let ypbhList = [] // 样品编号列表

                    // 罗湖样品编号列表
                    let lhypbhList = []
                    let lhypmcList = []
                    // 罗湖样品表外键
                    let lhypbWJ = []
                    // 罗湖委托表主键
                    let lhwtbID = []
                    // 罗湖委托表展示表ID
                    let lhwtzsbID = []
                    // 罗湖样品id列表
                    let lhypIdList = []
                    // 罗湖样品id格式列表
                    let lhypIdNewList = []
                    // 样品所选择的位置ID字符串
                    let localStr = ''
                    let locationIds = new Set()
                    let localArr = []
                    let sampleList = []

                    const currentTime = new Date(new Date().getTime() + 28800000).toJSON().slice(0, 16).replace('T', ' ')
                    const curTime = new Date(new Date().getTime() + 28800000).toJSON().slice(0, 10).replace('T', ' ')
                    for (let yp in ypInfoList) { //样品数据
                        let cfwz = ''
                        /*
                          校验：
                            1、样品数量 <=  确认数量
                            2、是否留样 => 填收样位置|留样位置
                            3、验收结果必填
                            4、如果留样 => 必填项：留样日期、留样数量、留样期限至、销毁日期
                        */
                        if (ypInfoList[yp].jie_yang_shu_lian > ypInfoList[yp].yang_pin_zong_shu) {
                            this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 接收确认数量不得大于收样数量。')
                            return;
                        }

                        if (ypInfoList[yp].jie_yang_zhuang_t == '未确认') {
                            this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 接收确认状态必须为已确认。')
                            return;
                        }
                        if (ypInfoList[yp].yan_shou_jie_guo_ == null || ypInfoList[yp].yan_shou_jie_guo_ == '') {
                            this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 验收结果不能为空!')
                            return;
                        }
                        // if (ypInfoList[yp].shi_fou_liu_yang_ == null || ypInfoList[yp].shi_fou_liu_yang_ == '') {
                        //     this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 是否留样不能为空!')
                        //     return;
                        // }
                        /** 如果四个是否留样中有一个为‘是’ 则 留样日期 和对应的留样位置就不能为空 */
                        if (ypInfoList[yp].shi_fou_liu_yang_yi == "是" ||
                         (ypInfoList[yp].flag2 == true && ypInfoList[yp].shi_fou_liu_yang_er == "是") ||
                          (ypInfoList[yp].flag3 == true && ypInfoList[yp].shi_fou_liu_yang_san == "是") ||
                           (ypInfoList[yp].flag4 == true && ypInfoList[yp].shi_fou_liu_yang_si == "是")) {
                            if (ypInfoList[yp].liu_yang_ri_qi_ == null || ypInfoList[yp].liu_yang_ri_qi_ == '') {
                                this_.$message.error('留样时必须填写留样日期!')
                                return;
                                // this_.handleErrorData("") todo 失效
                            }
                            if(ypInfoList[yp].shi_fou_liu_yang_yi == "是"){
                                // 判断位置是否为空
                                if (ypInfoList[yp].liu_yang_wei_zhi_yi == null || ypInfoList[yp].liu_yang_wei_zhi_yi == '') {
                                    this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型1的留样位置选择不能为空!')
                                    return;
                                }
                                if(ypInfoList[yp].liu_yang_shu_lian_yi == null || ypInfoList[yp].liu_yang_shu_lian_yi == ''){
                                    this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型1的留样数量不能为空!')
                                    return;
                                }
                            }
                            if(ypInfoList[yp].shi_fou_liu_yang_er == "是"){
                                if(ypInfoList[yp].flag2 == true){
                                    if (ypInfoList[yp].liu_yang_wei_zhi_er == '' || ypInfoList[yp].liu_yang_wei_zhi_er == null) {
                                        this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型2的留样位置选择不能为空!')
                                        return;
                                    }
                                    if(ypInfoList[yp].liu_yang_shu_lian_er == null || ypInfoList[yp].liu_yang_shu_lian_er == ''){
                                        this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型2的留样数量不能为空!')
                                        return;
                                    }
                                }
                            }
                            if(ypInfoList[yp].shi_fou_liu_yang_san == "是"){
                                if(ypInfoList[yp].flag3 == true ){
                                    if (ypInfoList[yp].liu_yang_wei_zhi_san == '' || ypInfoList[yp].liu_yang_wei_zhi_san == null) {
                                        this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型3的留样位置选择不能为空!')
                                        return;
                                    }
                                    if(ypInfoList[yp].liu_yang_shu_lian_san == null || ypInfoList[yp].liu_yang_shu_lian_san == ''){
                                        this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型3的留样数量不能为空!')
                                        return;
                                    }
                                }

                            }
                            if(ypInfoList[yp].shi_fou_liu_yang_si == "是"){
                                if(ypInfoList[yp].flag4 == true ){
                                    if (ypInfoList[yp].liu_yang_wei_zhi_si == '' || ypInfoList[yp].liu_yang_wei_zhi_si == null) {
                                        this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型4的留样位置选择不能为空!')
                                        return;
                                    }
                                    if(ypInfoList[yp].liu_yang_shu_lian_si == null || ypInfoList[yp].liu_yang_shu_lian_si == ''){
                                        this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型4的留样数量不能为空!')
                                        return;
                                    }
                                }
                            }
                        }

                        // 判断位置是否为空
                        if (ypInfoList[yp].shou_yang_wei_zhi_yi == null || ypInfoList[yp].shou_yang_wei_zhi_yi == '') {
                            this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型1的位置选择不能为空!')
                            return;
                        }
                        if (ypInfoList[yp].flag2 == true && (ypInfoList[yp].shou_yang_wei_zhi_er == '' || ypInfoList[yp].shou_yang_wei_zhi_er == null)) {
                            this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型2的位置选择不能为空!')
                            return;
                        }
                        if (ypInfoList[yp].flag3 == true && (ypInfoList[yp].shou_yang_wei_zhi_san == '' || ypInfoList[yp].shou_yang_wei_zhi_san == null)) {
                            this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型3的位置选择不能为空!')
                            return;
                        }
                        if (ypInfoList[yp].flag4 == true && (ypInfoList[yp].shou_yang_wei_zhi_si == '' || ypInfoList[yp].shou_yang_wei_zhi_si == null)) {
                            this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 类型4的位置选择不能为空!')
                            return;
                        }
                         // 判断留样日期不得早于当前日期
                         if(ypInfoList[yp].liu_yang_ri_qi_ != null && ypInfoList[yp].liu_yang_ri_qi_ != ''){
                            if(ypInfoList[yp].liu_yang_ri_qi_ < curTime){
                                console.log(ypInfoList[yp].liu_yang_ri_qi_,curTime)
                                this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 的留样日期不得早于收样日期!')
                                return;
                            }
                        }
                        // 判断留样期限日期不得早于当前日期
                        if(ypInfoList[yp].liu_yang_qi_xian != null && ypInfoList[yp].liu_yang_qi_xian != ''){
                            if(ypInfoList[yp].liu_yang_qi_xian < curTime){
                                this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 的留样期限日期不得早于收样日期!')
                                return;
                            }
                        }
                        // 判断返样日期不得早于当前日期
                        if(ypInfoList[yp].fan_yang_ri_qi_ != null && ypInfoList[yp].fan_yang_ri_qi_ != ''){
                            if(ypInfoList[yp].fan_yang_ri_qi_ < curTime){
                                this_.$message.error('操作失败，[' + ypInfoList[yp].yang_pin_ming_che + '] 的返样日期不得早于收样日期!')
                                return;
                            }
                        }

                        ypbhList.push('{"yang_pin_bian_hao":"' + ypInfoList[yp].yang_pin_bian_hao + '"}') // 样品编号列表
                        // 罗湖
                        dWhere.push('{"id_":"' + cfwz + '"}')
                        lhypbhList.push(ypInfoList[yp].yang_pin_bian_hao)
                        lhypbWJ.push(ypInfoList[yp].parent_id_)
                        lhypIdList.push(ypInfoList[yp].id_)
                        lhypIdNewList.push('{"id_":"' + ypInfoList[yp].id_ + '"}')
                        ypbh.push(ypInfoList[yp].yang_pin_bian_hao)
                        lhypmcList.push(ypInfoList[yp].yang_pin_ming_che)

                        localArr.push(
                            ypInfoList[yp].shou_yang_wei_zhi_yi, ypInfoList[yp].liu_yang_wei_zhi_yi,
                            ypInfoList[yp].shou_yang_wei_zhi_er, ypInfoList[yp].liu_yang_wei_zhi_er,
                            ypInfoList[yp].shou_yang_wei_zhi_san, ypInfoList[yp].liu_yang_wei_zhi_san,
                            ypInfoList[yp].shou_yang_wei_zhi_si, ypInfoList[yp].liu_yang_wei_zhi_si
                        )

                        let o = {
                            where:{
                                id_ : ypInfoList[yp].id_
                            },
                            param:{
                                yang_pin_lei_xing: ypInfoList[yp].yang_pin_lei_xing,
                                yang_ben_yun_shu_: ypInfoList[yp].yang_ben_yun_shu_,
                                shu_liang_: ypInfoList[yp].shu_liang_,
                                yang_pin_gui_ge_: ypInfoList[yp].yang_pin_gui_ge_,

                                yang_pin_lei_er_: ypInfoList[yp].yang_pin_lei_er_,
                                yang_pin_yun_shu_: ypInfoList[yp].yang_pin_yun_shu_,
                                shu_liang_er_: ypInfoList[yp].shu_liang_er_,
                                yang_pin_gui_ge_e: ypInfoList[yp].yang_pin_gui_ge_e,

                                yang_pin_lei_san_: ypInfoList[yp].yang_pin_lei_san_,
                                yang_pin_yun_san: ypInfoList[yp].yang_pin_yun_san,
                                shu_liang_san_: ypInfoList[yp].shu_liang_san_,
                                yang_pin_gui_ge_s: ypInfoList[yp].yang_pin_gui_ge_s,

                                yang_pin_lei_si_: ypInfoList[yp].yang_pin_lei_si_,
                                yang_pin_yun_si_: ypInfoList[yp].yang_pin_yun_si_,
                                shu_liang_si_: ypInfoList[yp].shu_liang_si_,
                                yang_pin_gui_si_: ypInfoList[yp].yang_pin_gui_si_,

                                jie_yang_zhuang_t:"已接收",
                                yang_pin_zong_shu:ypInfoList[yp].yang_pin_zong_shu
                            }
                        }
                        sampleList.push(o)
                    }
                    localStr = localArr.filter(i => i).join(',')
                    let value = ''
                    let lhypIdStr = ''
                    for (let i = 0; i < lhypbWJ.length; i++) {
                        value += lhypbWJ[i] + ','
                    }
                    value = value.substring(0, value.length - 1)
                    value = value.replace(/,/g, "','")
                    for (let i = 0; i < lhypIdList.length; i++) {
                        lhypIdStr += lhypIdList[i] + ','
                    }
                    lhypIdStr = lhypIdStr.substring(0, lhypIdStr.length - 1)
                    lhypIdStr = lhypIdStr.replace(/,/g, "','")

                    let allSQL = `select a.id_ as wtID,a.chu_ju_bao_gao_ya,a.zhan_shi_biao_id_,a.wei_tuo_lei_xing_,a.he_tong_id_,a.bao_gao_lei_xing_,a.wei_tuo_bian_hao_, a.wei_tuo_dan_wei_ as wtdh, a.wei_tuo_fang_lian, a.wei_tuo_lian,a.bao_gao_bian_zhi_,a.bao_gao_fu_he_yua,b.* from t_lhwtsqb a inner join t_lhypb b on a.id_ = b.parent_id_ where b.parent_id_ in ('${value}')and b.id_ in ('${lhypIdStr}')`
                    // console.log(allSQL)
                    // 搜集所有选择的位置信息
                    //  console.log('当前选择的位置ids：',locationIds)
                    var allLocal = `select * from t_ypcfwz where find_in_set(id_,'${localStr}')`
                    Promise.all([repostCurd("sql", allSQL), repostCurd("sql", allLocal)]).then((res) => {
                        let initResult =  res[0].variables.data
                        let result = []
                        let localInfo = res[1].variables.data
                        // 排序
                        ypInfoList.forEach(item=>{
                            result.push(initResult.find(i => i.yang_pin_bian_hao === item.yang_pin_bian_hao))
                        })


                        // console.log(localInfo)
                        /* 1、更新货架位置信息 */
                        this.emptyLocal = []
                        this.fullLocal = []
                        let allUUID = []
                        ypInfoList.forEach(item => {
                            allUUID.push(item.biao_zhi_uuid_1, item.biao_zhi_uuid_2, item.biao_zhi_uuid_3, item.biao_zhi_uuid_4)
                            let allResult = []
                            if(item.shou_yang_wei_zhi_yi != undefined && item.shou_yang_wei_zhi_yi){
                                allResult.push(this.handleLocationInfo(item.shou_yang_wei_zhi_yi, '否', localInfo, locationIds, item, item.biao_zhi_uuid_1, currentTime,item.yang_pin_lei_xing,item.liu_yang_shu_lian_yi))
                            }
                            if (item.shou_yang_wei_zhi_er != undefined && item.shou_yang_wei_zhi_er) {
                                allResult.push(this.handleLocationInfo(item.shou_yang_wei_zhi_er, '否', localInfo, locationIds, item, item.biao_zhi_uuid_2, currentTime,item.yang_pin_lei_er_,item.liu_yang_shu_lian_er))
                            }
                            if (item.shou_yang_wei_zhi_san != undefined && item.shou_yang_wei_zhi_san) {
                                allResult.push(this.handleLocationInfo(item.shou_yang_wei_zhi_san, '否', localInfo, locationIds, item, item.biao_zhi_uuid_3, currentTime,item.yang_pin_lei_san_,item.liu_yang_shu_lian_san))
                            }
                            if (item.shou_yang_wei_zhi_si != undefined && item.shou_yang_wei_zhi_si) {
                                allResult.push(this.handleLocationInfo(item.shou_yang_wei_zhi_si, '否', localInfo, locationIds, item, item.biao_zhi_uuid_4, currentTime,item.yang_pin_lei_si_,item.liu_yang_shu_lian_si))
                            }
                            if(item.liu_yang_wei_zhi_yi != undefined && item.liu_yang_wei_zhi_yi && item.shi_fou_liu_yang_yi === '是'){
                                allResult.push(this.handleLocationInfo(item.liu_yang_wei_zhi_yi, '是', localInfo, locationIds, item, item.biao_zhi_uuid_1, currentTime,item.yang_pin_lei_xing,item.liu_yang_shu_lian_yi))
                            }
                            if (item.liu_yang_wei_zhi_er != undefined && item.liu_yang_wei_zhi_er && item.shi_fou_liu_yang_er === '是') {
                                allResult.push(this.handleLocationInfo(item.liu_yang_wei_zhi_er, '是', localInfo, locationIds, item, item.biao_zhi_uuid_2, currentTime,item.yang_pin_lei_er_,item.liu_yang_shu_lian_er))
                            }
                            if (item.liu_yang_wei_zhi_san != undefined && item.liu_yang_wei_zhi_san && item.shi_fou_liu_yang_san === '是') {
                                allResult.push(this.handleLocationInfo(item.liu_yang_wei_zhi_san, '是', localInfo, locationIds, item, item.biao_zhi_uuid_3, currentTime,item.yang_pin_lei_san_,item.liu_yang_shu_lian_san))
                            }
                            if (item.liu_yang_wei_zhi_si != undefined && item.liu_yang_wei_zhi_si && item.shi_fou_liu_yang_si === '是') {
                                allResult.push(this.handleLocationInfo(item.liu_yang_wei_zhi_si, '是', localInfo, locationIds, item, item.biao_zhi_uuid_4, currentTime,item.yang_pin_lei_si_,item.liu_yang_shu_lian_si))
                            }
                            allResult.forEach(item => {
                                item.name === 'emptyLocation' ? this.emptyLocal.push(item.value) : this.fullLocal.push(item.value)
                            })
                        })
                        let allUUIDStr = allUUID.filter(i => i).join(',')
                        // 更新样品位置list
                        // console.log('emptyLocal:',this.emptyLocal)
                        if(this.emptyLocal.length > 0){
                            let allParams = {
                                tableName: 't_ypcfwz',
                                updList: this.emptyLocal
                            }
                            repostCurd('updatesByWhere', JSON.stringify(allParams))
                        }
                        // 插入样品位置list
                        // console.log('fullLocal:',this.fullLocal)
                        repostCurd('add', '{"tableName":"t_ypcfwz","paramWhere":' + JSON.stringify(this.fullLocal) + '}').then(res => {
                            // 再次查询位置表，对比当前样品列表 替换初始值为占用的样品位置id
                            let findLocationAgain = `select id_,shi_fou_liu_yang_,biao_zhi_uuid_ from t_ypcfwz where find_in_set(biao_zhi_uuid_,'${allUUIDStr}')`
                            // console.log(findLocationAgain)
                            repostCurd('sql', findLocationAgain).then(res => {
                                let data = res.variables.data
                                let uuidArgs = ['biao_zhi_uuid_1', 'biao_zhi_uuid_2', 'biao_zhi_uuid_3', 'biao_zhi_uuid_4']
                                let shouYangArgs = ['shou_yang_wei_zhi_yi', 'shou_yang_wei_zhi_er', 'shou_yang_wei_zhi_san', 'shou_yang_wei_zhi_si']
                                let liuYangArgs = ['liu_yang_wei_zhi_yi', 'liu_yang_wei_zhi_er', 'liu_yang_wei_zhi_san', 'liu_yang_wei_zhi_si']
                                data.forEach(item => {
                                    uuidArgs.forEach((uuid, index) => {
                                        let ypIndex = ypInfoList.findIndex(i => i[uuid] === item.biao_zhi_uuid_)
                                        if (ypIndex != -1) {
                                            item.shi_fou_liu_yang_ === '否' ?
                                                ypInfoList[ypIndex][shouYangArgs[index]] = item.id_ :
                                                ypInfoList[ypIndex][liuYangArgs[index]] = item.id_
                                        }
                                    })
                                })

                                // repostCurd('updates', '{"tableName":"t_lhypb","paramWhere":[' + lhypIdNewList + '],"paramCond":{"jie_yang_zhuang_t":"已接收"}}')

                                /* 2、封装样品登记表对象,插入样品登记表 顺便封装任务分配表  */
                                let ypdjb = []
                                let rws = []
                                console.log(result)
                                console.log(ypInfoList)
                                result.forEach((item, index) => {
                                    // 2-1:统计每个样品有多少类型[数量]
                                    let lxList = []
                                    let ypggList = []
                                    let liuYangList = []
                                    lxList.push(ypInfoList[index].yang_pin_lei_xing, ypInfoList[index].yang_pin_lei_er_, ypInfoList[index].yang_pin_lei_san_, ypInfoList[index].yang_pin_lei_si_)
                                    ypggList.push(
                                        ypInfoList[index].yang_pin_gui_ge_?ypInfoList[index].yang_pin_gui_ge_ +'*'+ ypInfoList[index].shu_liang_:'',
                                         ypInfoList[index].yang_pin_gui_ge_e? ypInfoList[index].yang_pin_gui_ge_e+'*'+ ypInfoList[index].shu_liang_er_:'',
                                         ypInfoList[index].yang_pin_gui_ge_s?ypInfoList[index].yang_pin_gui_ge_s +'*'+ ypInfoList[index].shu_liang_san_:'',
                                         ypInfoList[index].yang_pin_gui_si_?ypInfoList[index].yang_pin_gui_si_ +'*'+ ypInfoList[index].shu_liang_si_:'')
                                    liuYangList.push(ypInfoList[index].liu_yang_shu_lian_yi, ypInfoList[index].liu_yang_shu_lian_er, ypInfoList[index].liu_yang_shu_lian_san, ypInfoList[index].liu_yang_shu_lian_si)
                                    let yplxz = lxList.filter(i => i).join('；')
                                    let ypggStr = ypggList.filter(i => i).join('；')
                                    let liuyangStr = liuYangList.filter(i => i).join('；')
                                    // let count = lxList.filter(i => i).join(',').match(/,/g).length + 1
                                    let size = lxList.filter(i => i).join(',').match(/,/g)
                                    let count = 1
                                    size == null ? count = 1 : count = size.length + 1
                                    for (let c = 0; c < count; c++) {
                                        let xmmc = []
                                        xmmc.push(item.chang_gui_xiang_m, item.tao_can_ming_chen)
                                        let xiangMuZh = xmmc.filter(i => i).join(',')

                                        let yblx = c == 0 ? ypInfoList[index].yang_pin_lei_xing :
                                                   c == 1 ? ypInfoList[index].yang_pin_lei_er_  : 
                                                   c == 2 ? ypInfoList[index].yang_pin_lei_san_ : 
                                                   c == 3 ? ypInfoList[index].yang_pin_lei_si_  : ''
                                        let ystj = c == 0 ? ypInfoList[index].yang_ben_yun_shu_ : 
                                                   c == 1 ? ypInfoList[index].yang_pin_yun_shu_ : 
                                                   c == 2 ? ypInfoList[index].yang_pin_yun_san  : 
                                                   c == 3 ? ypInfoList[index].yang_pin_yun_si_  : ''
                                        let ypsl = c == 0 ? ypInfoList[index].shu_liang_ : 
                                                   c == 1 ? ypInfoList[index].shu_liang_er_ : 
                                                   c == 2 ? ypInfoList[index].shu_liang_san_ : 
                                                   c == 3 ? ypInfoList[index].shu_liang_si_ : ''
                                        let ybgg = c == 0 ? ypInfoList[index].yang_pin_gui_ge_ : 
                                                   c == 1 ? ypInfoList[index].yang_pin_gui_ge_e : 
                                                   c == 2 ? ypInfoList[index].yang_pin_gui_ge_s : 
                                                   c == 3 ? ypInfoList[index].yang_pin_gui_si_ : ''
                                        let sywz = c == 0 ? ypInfoList[index].shou_yang_wei_zhi_yi : 
                                                   c == 1 ? ypInfoList[index].shou_yang_wei_zhi_er : 
                                                   c == 2 ? ypInfoList[index].shou_yang_wei_zhi_san : 
                                                   c == 3 ? ypInfoList[index].shou_yang_wei_zhi_si : ''
                                        let lycf = c == 0 ? ypInfoList[index].liu_yang_wei_zhi_yi : 
                                                   c == 1 ? ypInfoList[index].liu_yang_wei_zhi_er : 
                                                   c == 2 ? ypInfoList[index].liu_yang_wei_zhi_san : 
                                                   c == 3 ? ypInfoList[index].liu_yang_wei_zhi_si : ''
                                        let lysl = c == 0 ? ypInfoList[index].liu_yang_shu_lian_yi : 
                                                   c == 1 ? ypInfoList[index].liu_yang_shu_lian_er : 
                                                   c == 2 ? ypInfoList[index].liu_yang_shu_lian_san : 
                                                   c == 3 ? ypInfoList[index].liu_yang_shu_lian_si : ''
                                        let currentUUID = c == 0 ? ypInfoList[index].biao_zhi_uuid_1 : 
                                                          c == 1 ? ypInfoList[index].biao_zhi_uuid_2 : 
                                                          c == 2 ? ypInfoList[index].biao_zhi_uuid_3 : 
                                                          c == 3 ? ypInfoList[index].biao_zhi_uuid_4 : ''
                                        let ifLy = c == 0 ? ypInfoList[index].shi_fou_liu_yang_yi : 
                                                   c == 1 ? ypInfoList[index].shi_fou_liu_yang_er :
                                                   c == 2 ? ypInfoList[index].shi_fou_liu_yang_san: 
                                                   c == 3 ? ypInfoList[index].shi_fou_liu_yang_si : ''
                                        let obj = {
                                                wei_tuo_dan_hao_: item.wei_tuo_bian_hao_,
                                                wei_tuo_dan_wei_: item.wtdh,
                                                lian_xi_ren_: item.wei_tuo_fang_lian,
                                                lian_xi_dian_hua_: item.wei_tuo_lian,
                                                yang_ben_ming_che: item.yang_pin_ming_che,
                                                yang_ben_bian_hao: item.yang_pin_bian_hao,
                                                pi_hao_bian_hao_: item.song_jian_pi_hao_,
                                                song_jian_dan_wei: item.song_jian_dan_wei,
                                                xing_ming_: ypInfoList[index].xing_ming_=== undefined?'':ypInfoList[index].xing_ming_,
                                                xing_bie_: ypInfoList[index].xing_bie_=== undefined?'':ypInfoList[index].xing_bie_,
                                                nian_ling_: ypInfoList[index].nian_ling_=== undefined?'':ypInfoList[index].nian_ling_,
                                                yang_ben_zhuang_t: item.yang_pin_zhuang_t,
                                                shou_yang_ri_qi_: currentTime,
                                                bei_zhu_: ypInfoList[index].bei_zhu_ === undefined?'':ypInfoList[index].bei_zhu_,
                                                yang_ben_lei_xing: yblx,
                                                yun_shu_tiao_jian: ystj,
                                                yang_pin_shu_lian: ypsl,
                                                yang_ben_gui_ge_s: ybgg,
                                                yan_shou_jie_guo_: ypInfoList[index].yan_shou_jie_guo_,
                                                cun_fang_wei_zhi_: sywz,
                                                liu_zhuan_zhuang_: '待任务分配',
                                                shi_fou_liu_yang_: ifLy,
                                                liu_yang_ri_qi_: ifLy == '是'? ypInfoList[index].liu_yang_ri_qi_:'',
                                                liu_yang_cun_fang: ifLy == '是'?lycf:'',
                                                liu_yang_shu_lian: ifLy == '是'?  (lysl == null ?'':lysl) : '',
                                                liu_yang_qi_xian: ifLy == '是'? ypInfoList[index].liu_yang_qi_xian:'',
                                                xiao_hui_ri_qi_: ypInfoList[index].xiao_hui_ri_qi_=== undefined?'':ypInfoList[index].xiao_hui_ri_qi_,
                                                fan_yang_ri_qi_: ypInfoList[index].fan_yang_ri_qi_=== undefined?'':ypInfoList[index].fan_yang_ri_qi_,
                                                fan_yang_jyr: ypInfoList[index].fan_yang_jyr=== undefined?'':ypInfoList[index].fan_yang_jyr,
                                                biao_zhi_uuid_: currentUUID,
                                                song_yang_yao_qiu: ypInfoList[index].song_yang_yao_qiu=== undefined?'':ypInfoList[index].song_yang_yao_qiu,
                                                jian_ce_xiang_mu_: xiangMuZh,
                                                shou_yang_ren_:this.$store.getters.userInfo.user.name
                                    }
                                        // console.log(obj)
                                        ypdjb.push(obj)
                                    }
                                    // 2-2:封装任务分配表
                                    let rw = {
                                        yang_pin_ming_che: item.yang_pin_ming_che,
                                        yang_pin_bian_hao: item.yang_pin_bian_hao,
                                        wei_tuo_lei_xing_: item.wei_tuo_lei_xing_,
                                        yang_pin_lei_xing: yplxz,
                                        yang_pin_gui_ge_: ypggStr,
                                        wei_tuo_id_: item.wtID,
                                        he_tong_id_: item.he_tong_id_,
                                        zhuang_tai_: '待任务分配',
                                        wan_cheng_shi_jia: item.song_jian_shi_jia,
                                        bao_gao_lei_xing_: item.bao_gao_lei_xing_,
                                        xin_xiang_mu_ming: item.xiang_mu_ming_che,
                                        zhan_shi_biao_id_: item.zhan_shi_biao_id_,
                                        fen_zhuang_liu_ya: liuyangStr,
                                        shi_fou_jia_ji_: item.chu_ju_bao_gao_ya,             // 是否加急【2023/2/23王嘎嘎提出】
                                        yang_pin_shu_lian: ypInfoList[index].jie_yang_shu_lian // 样品确认总数【2023/3/7王嘎嘎提出】
                                    }
                                    rws.push(rw)


                                    lhwtzsbID.push('{"shen_qing_id_":"' + item.zhan_shi_biao_id_ + '"}')
                                    lhwtbID.push('{"id_":"' + item.wtID + '"}')

                                })


                                /* 4、任务分配 
                                    4-1、根据 wtdAndYpb 的 wtID 更改委托表的 委托状态 wei_tuo_zhuang_ta 变成 已完成
                                    4-2、根据每个样品一个任务分配流程 遍历样品表开任务分配流程
                                    4-3、委托表找zhan_shi_biao_id_ 修改  t_lhwtzsb "zhuang_tai_"为"任务分配进行中"

                                    优化：将其他不冲突的更改状态脚本放在任务分配后并行处理
                                */

                                // console.log("4、任务分配",rws)
                                repostCurd('add', '{"tableName":"t_lhrwfpb","paramWhere":' + JSON.stringify(rws) + ',"defKey":"Process_04o0csc","formKey":"lhrwfp"}').then(res=>{
                                    // console.log('4、更改委托表的 委托状态',lhwtbID)
                                    repostCurd('updates', '{"tableName":"t_lhwtsqb","paramWhere":[' + lhwtbID + '],"paramCond":{"wei_tuo_zhuang_ta":"已完成"}}')
                                    /* 5、更新展示表  */
                                    if (lhwtzsbID.length > 0) {
                                        // console.log('5、更新展示表',lhwtzsbID)
                                        repostCurd('updates', '{"tableName":"t_lhwtzsb","paramWhere":[' + lhwtzsbID + '],"paramCond":{"zhuang_tai_":"任务分配进行中"}}')
                                    }
                                    console.log('样品登记表:',ypdjb)
                                    if(ypdjb.length > 0){
                                        repostCurd('add', '{"tableName":"t_lhypdjb","paramWhere":' + JSON.stringify(ypdjb) + '}').then(()=>{
                                            console.log("样品登记表数据添加成功!")
                                            this.$emit('callback', true)
                                        }).catch(error =>{
                                            console.log(error)
                                            this.handleAnySituation(true,"样品登记表数据添加失败!请勿关闭此页面，联系开发人员解决",'error')
                                        })
                                    }else{
                                        this.handleAnySituation(true,"样品登记表数据添加失败!请勿关闭此页面，联系开发人员解决",'error')
                                    }
                                    /* 3、更新样品表  
                                    // console.log('3、更新样品表',lhypIdNewList)
                                    repostCurd('updates', '{"tableName":"t_lhypb","paramWhere":[' + lhypIdNewList + '],"paramCond":{"jie_yang_zhuang_t":"已接收"}}').then(res=>{
                                        this.handleAnySituation(true,"样品成功接收,正在开启任务分配!",'success')
                                    })
                                    */
                                    console.log('更新样品表',sampleList)
                                    let allSampleParams ={
                                        tableName:'t_lhypb',
                                        updList:sampleList
                                    }
                                    repostCurd('updatesByWhere', JSON.stringify(allSampleParams)).then(res=>{
                                        this.handleAnySituation(true,"样品成功接收,正在开启任务分配!",'success')
                                    })

                                })

                                
                            })
                        })
                    })
                }).catch(_ => { });
            }

        },
        /* 去除指定行数据 使用过滤器filter过滤指定行号数据 */
        deleteData(val) {
            this.listData = this.listData.filter((data) => {
                return data.id_ != val
            })
        },
        uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
        },
        unique(arr) {
            return arr.filter((item, index) => {
                return arr.indexOf(item, 0) === index;
            });
        },
        // 根据旧位置数据生成新位置数据
        generateNewLocation(oldLocation, sampleInfo) {
            let temp = {
                fang_jian_lei_xin: oldLocation.fang_jian_lei_xin,
                wei_zhi_: oldLocation.wei_zhi_,
                qu_yu_: oldLocation.qu_yu_,
                huo_jia_lei_xing_: oldLocation.huo_jia_lei_xing_,
                huo_jia_hao_: oldLocation.huo_jia_hao_,
                ceng_hao_: oldLocation.ceng_hao_,
                shui_ping_fen_qu_: oldLocation.shui_ping_fen_qu_,
                wei_zhi_bian_hao_: oldLocation.wei_zhi_bian_hao_,
                wei_zhi_zhuang_ta: oldLocation.wei_zhi_zhuang_ta,
                cun_chu_tiao_jian: oldLocation.cun_chu_tiao_jian,
                shi_fou_guo_shen_: '启用',
                yang_pin_bian_hao: sampleInfo.yang_pin_bian_hao,
                yang_pin_ming_che: sampleInfo.yang_pin_ming_che,
                ru_ku_shi_jian_: sampleInfo.ru_ku_shi_jian_,
                shi_fou_liu_yang_: sampleInfo.shi_fou_liu_yang_,
                biao_zhi_uuid_: sampleInfo.biao_zhi_uuid_,
                yang_pin_lei_xing: sampleInfo.type,
                liu_yang_shu_lian: sampleInfo.num
            }
            return temp
        },
        handleLocationInfo(currentLocation, isLiuYang, localInfo, locationIds, item, UUID, currentTime,sampleType,liuYangNum) {
            !locationIds.has(currentLocation) ? locationIds.add(currentLocation) : localInfo.find(i => i.id_ === currentLocation).wei_zhi_zhuang_ta = '占用'
            if (localInfo.find(i => i.id_ === currentLocation)!=undefined  &&localInfo.find(i => i.id_ === currentLocation).wei_zhi_zhuang_ta === '空余') {
                let obj = {
                    where: {
                        id_: currentLocation
                    },
                    param: {
                        wei_zhi_zhuang_ta: "占用",
                        ru_ku_shi_jian_: currentTime,
                        yang_pin_bian_hao: item.yang_pin_bian_hao,
                        yang_pin_ming_che: item.yang_pin_ming_che,
                        shi_fou_liu_yang_: isLiuYang,
                        yang_pin_lei_xing: sampleType,
                        liu_yang_shu_lian: liuYangNum == null? '':liuYangNum
                    }
                }
                let result = {
                    name: 'emptyLocation',
                    value: obj
                }
                return result
            } else { // 新增一条位置信息(修改它的样品编号,样品名称,入库时间,标识UUID)
                let sampleInfo = {
                    yang_pin_bian_hao: item.yang_pin_bian_hao,
                    yang_pin_ming_che: item.yang_pin_ming_che,
                    ru_ku_shi_jian_: currentTime,
                    biao_zhi_uuid_: UUID,
                    shi_fou_liu_yang_: isLiuYang,
                    type: sampleType,
                    num: liuYangNum == null? '':liuYangNum
                }
                let newLocation = this.generateNewLocation(localInfo.find(i => i.id_ === currentLocation), sampleInfo)
                let result = {
                    name: 'fullLocation',
                    value: newLocation
                }
                return result
            }
        },
        /* 关闭*/
        remRedar() {
            this.visible = false // 列表隐藏
            this.listData = [] // 清空列表数据
            this.redar = false // 扫码图标隐藏
            this.$emit('scanOff', false)
        },

    }
}
