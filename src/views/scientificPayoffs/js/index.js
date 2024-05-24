import * as echarts from 'echarts'
export default {
    // 轮播表数据封装
    getDataList (data) {
        const config = {
            header: data.header,
            data: data.data,
            rowNum: 6,
            headerHeight: 45,
            columnWidth: data.columnWidth
        }
        return config
    },

    // 科研项目
    getKyxmList (datas) {
        const header = ['全部参与人', '项目编号', '资助单位', '项目类型', '项目名称', '开始日期', '结束日期', '立项经费（万元）']
        const data = []
        datas.forEach((item, index) => {
            const list = []
            list.push(item.quan_bu_can_yu_re || '')
            list.push(item.xiang_mu_bian_hao || '')
            list.push(item.zi_zhi_dan_wei_ || '')
            list.push(item.xiang_mu_lei_xing || '')
            list.push(item.xiang_mu_ming_che || '')
            list.push(item.qi_zhi_shi_jian_ || '')
            list.push(item.jie_shu_shi_jian_ || '')
            list.push(item.li_xiang_jing_fei || '')
            data.push(list)
        })
        const dataList = {
            header: header,
            data: data,
            columnWidth: [200, 200, 200, 150, 200, 170, 170, 200]
        }
        const config = this.getDataList(dataList)
        return config
    },
    // 科研获奖成果
    getkjhjcgList (datas) {
        const header = ['全部获奖者', '奖励项目名称', '单位排名', '奖励类型', '获奖日期']
        const data = []
        datas.forEach((item, index) => {
            const list = []
            list.push(item.quan_bu_huo_jiang || '')
            list.push(item.jiang_li_xiang_mu || '')
            list.push(item.dan_wei_pai_ming_ || '')
            list.push(item.jiang_li_lei_xing || '')
            list.push(item.huo_jiang_shi_jia || '')
            data.push(list)
        })
        const dataList = {
            header: header,
            data: data,
            columnWidth: [300, 400, 200, 150, 130]
        }
        const config = this.getDataList(dataList)
        return config
    },
    // SCI文章统计表
    getSCIwztjbList (datas) {
        const header = ['全部作者', '论文题目', '期刊名称', 'JCR分区', '发表日期', '影响因子IF', '单位排名', 'WOS号']
        const data = []
        datas.forEach((item, index) => {
            const list = []
            // list.push(item.NAME_ || '')
            list.push(item.quan_bu_zuo_zhe_ || '')
            list.push(item.lun_wen_ti_mu_ || '')
            list.push(item.qi_kan_ming_cheng || '')
            list.push(item.qi_juan_hao_ || '')
            list.push(item.fa_biao_shi_jian_ || '')
            list.push(item.ying_xiang_y_z_if || '')
            list.push(item.dan_wei_pai_ming_ || '')
            list.push(item.wos_hao_ || '')
            data.push(list)
        })
        const dataList = {
            header: header,
            data: data,
            columnWidth: [200, 200, 200, 150, 130, 200, 200, 200]
        }
        const config = this.getDataList(dataList)
        return config
    },
    // 中文论文
    getZwlwList (datas) {
        const header = ['全部作者', '论文题目', '期刊名称', '期卷号', '发表日期', '期刊类别', '单位排名', 'ISSN号']
        const data = []
        datas.forEach((item, index) => {
            const list = []
            list.push(item.quan_bu_zuo_zhe_ || '')
            list.push(item.lun_wen_ti_mu_ || '')
            list.push(item.qi_kan_ming_cheng || '')
            list.push(item.qi_juan_hao_ || '')
            list.push(item.fa_biao_shi_jian_ || '')
            list.push(item.qi_kan_lei_bie_ || '')
            list.push(item.dan_wei_pai_ming_ || '')
            list.push(item.issn_hao_ || '')
            data.push(list)
        })
        const dataList = {
            header: header,
            data: data,
            columnWidth: [200, 200, 200, 150, 130, 150, 200, 200]
        }
        const config = this.getDataList(dataList)
        return config
    },
    // 著作
    getZhuZuoList (datas) {
        const header = ['全部作者', '专著名称', '出版社', '出版日期', '编撰字数']
        const data = []
        datas.forEach((item, index) => {
            const list = []
            list.push(item.quan_bu_zuo_zhe_ || '')
            list.push(item.zhuan_zhuo_ming_c || '')
            list.push(item.chu_ban_she_ || '')
            list.push(item.chu_ban_shi_jian_ || '')
            list.push(item.bian_zhuan_zi_shu || '')
            data.push(list)
        })
        const dataList = {
            header: header,
            data: data,
            columnWidth: [300, 300, 300, 130, 150]
        }
        const config = this.getDataList(dataList)
        return config
    },
    // 专利
    getZhuanLiList (datas) {
        const header = ['全部申请人', '专利名称', '专利权人', '类别', '申请日期', '授权时间']
        const data = []
        datas.forEach((item, index) => {
            const list = []
            list.push(item.quan_bu_shen_qing || '')
            list.push(item.zhuan_li_ming_che || '')
            list.push(item.zhuan_li_quan_ren || '')
            list.push(item.lei_bie_ || '')
            list.push(item.shen_qing_shi_jia || '')
            list.push(item.shou_quan_shi_jia || '')
            data.push(list)
        })
        const dataList = {
            header: header,
            data: data,
            columnWidth: [300, 300, 150, 150, 130, 130]
        }
        const config = this.getDataList(dataList)
        return config
    },
    // 继续教育项目/学术活动
    getJxjyxmxshdList (datas) {
        const header = ['全部负责人', '项目编号', '会议名称', '项目级别', '学分', '举办日期', '举办地点', '合作单位']
        const data = []
        datas.forEach((item, index) => {
            const list = []
            list.push(item.quan_bu_zuo_zhe_ || '')
            list.push(item.xiang_mu_bian_hao || '')
            list.push(item.hui_yi_ming_cheng || '')
            list.push(item.xue_fen_ji_bie_ || '')
            list.push(item.xue_fen_ || '')
            list.push(item.ju_ban_shi_jian_ || '')
            list.push(item.ju_ban_di_dian_ || '')
            list.push(item.he_zuo_dan_wei_ || '')
            data.push(list)
        })
        const dataList = {
            header: header,
            data: data,
            columnWidth: [200, 200, 300, 150, 100, 130, 200, 200]
        }
        const config = this.getDataList(dataList)
        return config
    },
    // 图标数据封装
    getKyxmData (datas) {
        const list = []
        const listData = []
        datas.forEach(item => {
            // item.NAME_ = this.linHeg(item.NAME_)
            list.push(item.NAME_)
            const o = {
                name: item.NAME_,
                value: item.count
            }
            listData.push(o)
        })
        const config = {
            xAxis: list,
            series: listData
        }
        return config
    },
    linHeg (value) {
        // rowMAx 控制一行多少字
        const rowMAx = 1
        let overValue = ''
        for (let i = 0; i < value.length; i++) {
            if ((i % rowMAx === 0) && (i !== 0)) {
                overValue += '\n'
                overValue += value[i]
            } else {
                overValue += value[i]
            }
        }
        return overValue
    }
}

export const barData = {
    title: {
        show: false,
        text: '',
        textStyle: {
            color: '#fff',
            fontSize: 20,
            fontWeight: '600'
        },
        textAlign: 'center',
        left: '50%',
        top: '20px'
    },
    xAxis: {
        name: '人员',
        type: 'category',
        data: [],
        axisTick: {
            alignWithLabel: true
        },
        axisLabel: {
            color: '#FFF',
            rotate: 30,
            interval: 0,
            margin: 10
        },
        axisLine: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        type: 'value',
        name: '数量（个）',
        minInterval: 1,
        nameTextStyle: {
            color: '#fff',
            fontSize: 14
        },
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    series: [{
        type: 'bar',
        name: '',
        data: [],
        barMaxWidth: '35px',
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
            ])
        },
        emphasis: {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                ])
            }
        }
        // label: {
        //     show: true,
        //     position: 'top',
        //     textStyle: { // 数值样式
        //         color: '#FFFFFF',
        //         fontSize: 12
        //     },
        //     formatter: function (params) {
        //         return params.value !== '0' ? params.value : ''
        //     }

        // }
    }],
    tooltip: {
        show: true,
        trigger: 'axis'
    }
}
