/**
 * 高度修复
 */
// import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

export default {
        methods: {
        /* 遍历配置，分发配置参数*/
                getMatchingData(matching){
                        let matchArr = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                        //         matchArr.push(this.relData[matching+this.dataScope[i]])
                        // }
                        // for (let i = 0; i < this.dataScope.length; i++) {
                                if(typeof this.relData[matching+this.endDate] === "undefined"){
                                        matchArr.push(0)
                                        // console.log(matchArr,'1hiuhkj')
                                }else{
                                        matchArr.push(this.relData[matching+this.endDate])
                                        // console.log('2nhkjhiuhkj')
                                }
                        // }
                        return matchArr
                },
                getMatchingDataSame(matching){
                        let matchArr = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                        //         matchArr.push(this.relData[matching+'S'+this.dataScope[i]])
                        // }
                        // for (let i = 0; i < this.dataScope.length; i++) {
                                if(typeof this.relData[matching+'S'+this.endDate] === "undefined"){
                                        matchArr.push(0)
                                        // console.log(matchArr,'1hiuhkj')
                                }else{
                                        matchArr.push(this.relData[matching+'S'+this.endDate])
                                        // console.log('2nhkjhiuhkj')
                                }
                        // }
                        return matchArr
                },
                getJiaoYanObjNum(){
                        let ryywpxjNum = this.jiaoyanObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        barData.push(e)
                        return {
                                "t_mjsbjdxzjhzbNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "val": e},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getJiaoYanObjNumFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.jiaoyanMGObj,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                gethechaObjNum(){
                        let ryywpxjNum = this.hechaObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        barData.push(e)
                        return {
                                "t_sbhcjlbNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "val": e},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                gethechaObjNumFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.hechaMGObj,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getnengtliObjNum(){
                        let ryywpxjNum = this.waibuObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        barData.push(e)
                        return {
                                "Num" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData,"val": e},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getnengtliObjNumFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.waibuObjfb,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getyangPinCaiJiObjNum(){

                        let zlzbfz = []
                        zlzbfz = this.quality
                        let fenshuzu = []
                        fenshuzu = this.buhegelvObj
                        
                        let title = ['name_']

                        for (let i = 0; i < zlzbfz.length; i++) {
                                for (let j = 0; j < fenshuzu.length; j++) {
                                        // console.log(zlzbfz[i].id_ == fenshuzu[j].bzbm,zlzbfz[i].id_, fenshuzu[j].bzbm,'354345433333333333333333333333333333333333')
                                        if(zlzbfz[i].id_ == fenshuzu[j].bzbm){
                                                let prop = fenshuzu[j].zhi_liang_zhi_bia;
                                                zlzbfz[i][prop] = fenshuzu[j].location
                                        }
                                }
                        }
                        for (let t = 0; t < this.zhiliangzhibiaotitle.length; t++) {
                                title.push(this.zhiliangzhibiaotitle[t].zhi_liang_zhi_bia)
                                
                        }
                        
                        // let arr  = this.tableNum
                        // let aa =[]
                        // for (let j = 0; j < arr.length; j++) {
                        //         let changeArr = ['<span style="font-size:14px;height:45px;line-height:45px;display:inline-block">' + arr[j].zhi_liang_zhi_bia + '</span>','<span style="font-size:14px;height:45px;line-height:45px;display:inline-block">' + arr[j].location.toFixed(2) + '</span>']
                        //         aa.push(changeArr)
                        // }

                        // this.$set(this.tableData, 'data', aa)
                        // this.$forceUpdate()
                        // console.log(arr,this.tableData.data,'djlkddddddddddddddddddddddddddddddddd')

                        return {
                                "Num" :{"date": this.endDate,"number": zlzbfz,"title":title},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getfenzuZLZBObjNum(){
                        //生成月份
                        let that = this
                        let d1 = this.endDate[0];
                        let d2 = this.endDate[2];
                        let dateArry = new Array();
                        let s1 = d1.split("-");
                        let s2 = d2.split("-");
                        let mCount = 0;
                        if (parseInt(s1[0]) < parseInt(s2[0])) {
                            mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1])+1;
                        } else {
                            mCount = parseInt(s2[1]) - parseInt(s1[1])+1;
                        }
                        if (mCount > 0) {
                            var startM = parseInt(s1[1]);
                            var startY = parseInt(s1[0]);
                            for (var i = 0; i < mCount; i++) {
                                if (startM < 12) {
                                    dateArry[i] = startY + "-" + (startM>9 ? startM : "0" + startM);
                                    startM += 1;
                                } else {
                                    dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
                                    startM = 1;
                                    startY += 1;
                                }
                            }
                        }
                        //处理数据
                        let zlzbfz = []
                        let fenshuzu = []
                        let zongfz = []
                        fenshuzu = that.quality
                        for (let m = 0; m < that.quality.length; m++) {
                                for (let n = 0; n < that.fenzuzlmb.length; n++) {
                                        //console.log(that.quality.id_ == that.fenzuzlmb.id_,that.quality,that.fenzuzlmb)
                                        if (that.quality[m].id_ == that.fenzuzlmb[n].id_) {
                                                fenshuzu[m].data=that.fenzuzlmb[n].data?that.fenzuzlmb[n].data:''
                                                continue
                                        }
                                }
                                
                        }
                        for (let j = 0; j < dateArry.length; j++) {
                                let rq = {}
                                rq.name_ = dateArry[j]
                                zlzbfz.push(rq)
                                // console.log(zlzbfz,dateArry[j],'erw232222222222222222222222222224586')
                        }
                        console.log(fenshuzu,zlzbfz,'55353453535345')
                        let title = ['name_']
                        for (let zn = 0; zn < fenshuzu.length; zn++) {
                                for (let i = 0; i < zlzbfz.length; i++) {
                                        if(fenshuzu[zn].data&&fenshuzu[zn].data.length>0){
                                                for (let j = 0; j < fenshuzu[zn].data.length; j++) {
                                                        if(zlzbfz[i].name_ == fenshuzu[zn].data[j].bzsj){
                                                                let prop = fenshuzu[zn].data[j].zhi_liang_zhi_bia;
                                                                zlzbfz[i][prop] = fenshuzu[zn].data[j].location
                                                                console.log(zlzbfz)
                                                        }
                                                        //continue
                                                }
                                                
                                        }
                                        //continue
                                }
                                zongfz.push({'id':fenshuzu[zn].id_,'name':fenshuzu[zn].name_,'data':zlzbfz})
                                
                        }
                        console.log(zongfz,'0000000000000000767676767676767676767676')
                        for (let t = 0; t < this.zhiliangzhibiaotitle.length; t++) {
                                title.push(this.zhiliangzhibiaotitle[t].zhi_liang_zhi_bia)
                                
                        }
                        this.zhiliangmuTitle = title
                        this.zhiliangmuNeirong = zongfz

                        
                        return {
                                "Num" :{"date": this.endDate,"number": zongfz,"title":title},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getbzJunZhujNum(){
                        let title = ['NAME_','numA','num','chu']
                        return {
                                "num" :{"date": this.endDate,"number": this.gaijinxiangObj,"title":title},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getbzXiBaoObjNum(){
                        let name = []
                        let val =[]
                        let valAll = []
                        let e = []
                        let a=0
                        let b=0
                        let c=0
                        let numm = 0
                        let that = this
                        if(that.bzXiBaoObj.length === 0){
                                val = [0]
                                valAll = [0]
                                e = [0]
                                name = [0]
                        }else{
                                for (let i = 0; i < that.bzXiBaoObj.length; i++) {
                                        // let num=0
                                        // if (that.hechaObj[i].t_sbhcjlb===0) {
                                        //         num =0
                                        // } else {
                                        //         num =Math.floor(that.hechaObj[i].t_sbhcjlbS/that.hechaObj[i].t_sbhcjlb * 10000) / 100
                                        // }
                                        // valAll.push(that.hechaObj[i].t_sbhcjlb)
                                        val.push(that.bzXiBaoObj[i].num)
                                        valAll.push(that.bzXiBaoObj[i].numS)
                                        // e.push(num)
                                        name.push(that.bzXiBaoObj[i].name)

                                }
                        }
                        val.forEach( function(item){
                                a += item ;
                        });
                        valAll.forEach( function(item){
                                b += item ;
                        });
                        if (that.bzXiBaoTObj.length===0) {
                                numm = 1
                        } else {
                                numm = Math.floor((12-that.bzXiBaoTObj[0].time)/3) + 1
                        }
                        // a=a*numm
                        // console.log(numm,'numm')
                        if(b===0){
                                c=0
                        }else{
                                c= Math.floor(b/a * 10000) / 100
                        }
                        return {
                                "Num" :{"date": this.endDate,"number": val, "name": name, "numberAll": valAll,"valnum":a,"valAll":b,"valna":c},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getMyConfig(name){
                        // console.log(this.config,'werwrwr3567885656766666666666666666666666')
                        if(!this.config || this.config.length == 0)  return
                        for(let i in this.config){
                                if (this.config[i]['pei_zhi_biao_ming'] == name){
                                        return this.config[i]['pei_zhi_can_shu_'] //返回需要的对应参数
                                }
                        }
                },
                getS1renwu(){
                        let ryywpxjNum = this.guanshenObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        barData.push(e)
                        return {
                                "t_jchzbNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData,"val":e},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getS1renwuFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.guanshenfbObj,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS1jianCe(){
                        return {
                                // "t_mjjcbgNum" :{"date": this.dataScope,"number": mjjcbgNum, "numberAll": mjjcbgSNum, "res": barData},
                                "t_gdyrqcwtBegin" :{"date": this.BeginDate,"number": this.relData['t_gdyrqcwt'+this.BeginDate]},
                                "t_gdyrqcwtEnd" :{"date": this.endDate,"number": this.relData['t_gdyrqcwt'+this.endDate]},
                                "t_gdyrqcwt2Begin" :{"date": this.BeginDate,"number": this.relData['t_gdyrqcwt2'+this.BeginDate]},
                                "t_gdyrqcwt2End" :{"date": this.endDate,"number": this.relData['t_gdyrqcwt2'+this.endDate]},
                                "t_gdyrqcwt3Begin" :{"date": this.BeginDate,"number": this.relData['t_gdyrqcwt3'+this.BeginDate]},
                                "t_gdyrqcwt3End" :{"date": this.endDate,"number": this.relData['t_gdyrqcwt3'+this.endDate]},
                                "t_gdyrqcwt4Begin" :{"date": this.BeginDate,"number": this.relData['t_gdyrqcwt4'+this.BeginDate]},
                                "t_gdyrqcwt4End" :{"date": this.endDate,"number": this.relData['t_gdyrqcwt4'+this.endDate]},
                                "t_gdyrqcwt5Begin" :{"date": this.BeginDate,"number": this.relData['t_gdyrqcwt5'+this.BeginDate]},
                                "t_gdyrqcwt5End" :{"date": this.endDate,"number": this.relData['t_gdyrqcwt5'+this.endDate]},
                                "t_gdyrqcwt6Begin" :{"date": this.BeginDate,"number": this.relData['t_gdyrqcwt6'+this.BeginDate]},
                                "t_gdyrqcwt6End" :{"date": this.endDate,"number": this.relData['t_gdyrqcwt6'+this.endDate]},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getS2jianCe(){
                        let mjjcbgNum = this.getMatchingData('t_mjjcbg')
                        let mjjcbgSNum = this.getMatchingDataSame('t_mjjcbg')
                        let barData = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                                let e=0
                                if (mjjcbgSNum[0]===0) {
                                        e =0
                                } else {
                                        e =Math.floor(mjjcbgNum[0]/mjjcbgSNum[0] * 10000) / 100
                                }
                                barData.push(e)
                        // }
                        return {
                                "t_mjjcbgNum" :{"date": this.endDate,"number": mjjcbgNum, "numberAll": mjjcbgSNum, "res": barData},
                                "t_gdyrqcwtBegin" :{"date": this.BeginDate,"number": this.relData['t_gdyrqcwt'+this.BeginDate]},
                                "t_gdyrqcwtEnd" :{"date": this.endDate,"number": this.relData['t_gdyrqcwt'+this.endDate]},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getS2manYiDu(){
                        let ryywpxjNum = this.neishenObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        barData.push(e)
                        return {
                                // "t_myddcBegin" :{"date": this.BeginDate,"number": this.relData['t_myddc'+this.BeginDate]},
                                // "t_myddcEnd" :{"date": this.endDate,"number": this.relData['t_myddc'+this.endDate]},
                                // "t_myddc1Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc1'+this.BeginDate]},
                                // "t_myddc1End" :{"date": this.endDate,"number": this.relData['t_myddc1'+this.endDate]},
                                // "t_myddc2Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc2'+this.BeginDate]},
                                // "t_myddc2End" :{"date": this.endDate,"number": this.relData['t_myddc2'+this.endDate]},
                                // "t_myddc3Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc3'+this.BeginDate]},
                                // "t_myddc3End" :{"date": this.endDate,"number": this.relData['t_myddc3'+this.endDate]},
                                // "t_myddc4Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc4'+this.BeginDate]},
                                // "t_myddc4End" :{"date": this.endDate,"number": this.relData['t_myddc4'+this.endDate]},
                                // "t_myddc5Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc5'+this.BeginDate]},
                                // "t_myddc5End" :{"date": this.endDate,"number": this.relData['t_myddc5'+this.endDate]},
                                // "t_myddc6Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc6'+this.BeginDate]},
                                // "t_myddc6End" :{"date": this.endDate,"number": this.relData['t_myddc6'+this.endDate]},
                                "t_khmydtjbNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData,"val":e},
                                "config":this.getMyConfig("客户满意度") //返回需要的对应参数
                        }
                },
                getS2manYiDuFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.neishenfbObj,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS3tousu(){
                        let ryywpxjNum = this.yingjiObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        barData.push(e)
                        
                        return {
                                "t_complaintNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData,"val":e},
                                // "t_mjwtsqbNum" :{"date": this.dataScope,"number": mjwtsqbNum},
                                "config":this.getMyConfig("客户投诉率") //返回需要的对应参数
                        }
                },
                getS3tousuFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.yingjifbObj,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS4renYuanPeiXun(){
                        let ryywpxjNum = this.zaigangrenyuan
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        barData.push(e)
                        
                        return {
                                "t_ryywpxjlNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData},
                                // "t_ryndpxjhBegin" :{"date": this.BeginDate,"number": this.relData['t_ryndpxjh'+this.BeginDate]},
                                // "t_ryndpxjhEnd" :{"date": this.endDate,"number": this.relData['t_ryndpxjh'+this.endDate]},
                                // "t_rypxjlnkBegin" :{"date": this.BeginDate,"number": this.relData['t_rypxjlnk'+this.BeginDate]},
                                // "t_rypxjlnkEnd" :{"date": this.endDate,"number": this.relData['t_rypxjlnk'+this.endDate]},
                                "config":this.getMyConfig("人员培训") //返回需要的对应参数
                        }
                },
                getS4renYuanPeiXunFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        console.log(this.zaigangrenyuanfb,'43664564646767fghhfghg')
                        return {
                                "num" :{"date": this.endDate,"number": this.zaigangrenyuanfb,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS5renYuanJianDu(){
                        let zljdNum = this.gangqianpeixun
                        let zljdSNum = this.getMatchingDataSame('t_zljd')
                        let barData = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                                let e=0
                                if (zljdNum[0].num===0) {
                                        e =0
                                } else {
                                        e =Math.floor(zljdNum[1].num/zljdNum[0].num * 10000) / 100
                                }
                                barData.push(e)
                        // }
                        // console.log(zljdNum,barData,'88888888888888888888888888888888888888888888')
                        return {
                                "t_zljdNum" :{"date": this.endDate,"number": zljdNum[1].num, "numberAll": zljdNum[0].num, "res": barData},
                                // "t_zljdBegin" :{"date": this.BeginDate,"number": this.relData['t_zljd'+this.BeginDate]},
                                // "t_zljdEnd" :{"date": this.endDate,"number": this.relData['t_zljd'+this.endDate]},
                                // "t_zljdssBegin" :{"date": this.BeginDate,"number": this.relData['t_zljdss'+this.BeginDate]},
                                // "t_zljdssEnd" :{"date": this.endDate,"number": this.relData['t_zljdss'+this.endDate]},
                                "config":this.getMyConfig("人员监督") //返回需要的对应参数
                        }
                },
                getS5renYuanJianDuFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.gangqianpeixunfb,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS6sheBeiWeiHu(){
                        return {
                                "t_yqsbwhjhxmtBegin" :{"date": this.BeginDate,"number": this.relData['t_yqsbwhjhxmt'+this.BeginDate]},
                                "t_yqsbwhjhxmtEnd" :{"date": this.endDate,"number": this.relData['t_yqsbwhjhxmt'+this.endDate]},
                                "t_yqsbwhjhxmzBegin" :{"date": this.BeginDate,"number": this.relData['t_yqsbwhjhxmz'+this.BeginDate]},
                                "t_yqsbwhjhxmzEnd" :{"date": this.endDate,"number": this.relData['t_yqsbwhjhxmz'+this.endDate]},
                                "t_yqsbwhjhxmyBegin" :{"date": this.BeginDate,"number": this.relData['t_yqsbwhjhxmy'+this.BeginDate]},
                                "t_yqsbwhjhxmyEnd" :{"date": this.endDate,"number": this.relData['t_yqsbwhjhxmy'+this.endDate]},
                                "t_whbyxxBegin" :{"date": this.BeginDate,"number": this.relData['t_whbyxx'+this.BeginDate]},
                                "t_whbyxxEnd" :{"date": this.endDate,"number": this.relData['t_whbyxx'+this.endDate]},
                                "t_whbyxmxxmzBegin" :{"date": this.BeginDate,"number": this.relData['t_whbyxmxxmz'+this.BeginDate]},
                                "t_whbyxmxxmzEnd" :{"date": this.endDate,"number": this.relData['t_whbyxmxxmz'+this.endDate]},
                                "t_whbyxxmyBegin" :{"date": this.BeginDate,"number": this.relData['t_whbyxxmy'+this.BeginDate]},
                                "t_whbyxxmyEnd" :{"date": this.endDate,"number": this.relData['t_whbyxxmy'+this.endDate]},
                                "t_yqsbwhjhfbBegin" :{"date": this.BeginDate,"number": this.relData['t_yqsbwhjhfb'+this.BeginDate]},
                                "t_yqsbwhjhfbEnd" :{"date": this.endDate,"number": this.relData['t_yqsbwhjhfb'+this.endDate]},
                                "t_yqsbwhjlfbBegin" :{"date": this.BeginDate,"number": this.relData['t_yqsbwhjlfb'+this.BeginDate]},
                                "t_yqsbwhjlfbEnd" :{"date": this.endDate,"number": this.relData['t_yqsbwhjlfb'+this.endDate]},
                                "config":this.getMyConfig("设备维护") //返回需要的对应参数
                        }
                },
                getS7sheBeiJiaoZhun(){
                        let mjsbjdxzjhzbNum = this.getMatchingData('t_mjsbjdxzjhzb')

                        return {
                                "t_ndsbxzjdjhBegin" :{"date": this.BeginDate,"number": this.relData['t_ndsbxzjdjh'+this.BeginDate]},
                                "t_ndsbxzjdjhEnd" :{"date": this.endDate,"number": this.relData['t_ndsbxzjdjh'+this.endDate]},
                                "t_yqsbxzjgBegin" :{"date": this.BeginDate,"number": this.relData['t_yqsbxzjg'+this.BeginDate]},
                                "t_yqsbxzjgEnd" :{"date": this.endDate,"number": this.relData['t_yqsbxzjg'+this.endDate]},
                                "allDate" :{"date": this.endDate,"number": this.relData['t_yqsbxzjg'+this.endDate]},
                                "config":this.getMyConfig("设备校准") //返回需要的对应参数
                        }
                },
                
                getS8sheBeiHeCha(){
                        return {
                                "t_sbhcjhBegin" :{"date": this.BeginDate,"number": this.relData['t_sbhcjh'+this.BeginDate]},
                                "t_sbhcjhEnd" :{"date": this.endDate,"number": this.relData['t_sbhcjh'+this.endDate]},
                                "t_sbhcjlbBegin" :{"date": this.BeginDate,"number": this.relData['t_sbhcjlb'+this.BeginDate]},
                                "t_sbhcjlbEnd" :{"date": this.endDate,"number": this.relData['t_sbhcjlb'+this.endDate]},
                                "config":this.getMyConfig("设备核查") //返回需要的对应参数
                        }
                },
                getS9neiBuZhiLiang(){
                        let ryywpxjNum = this.neibuObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        barData.push(e)
                        return {
                                "t_mjzlkzxbNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData,"val": e},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS9neiBuZhiLiangFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.neibuObjfb,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS12fengXian(){
                        let ryywpxjNum = this.fengxianObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 10000) / 100
                        }
                        return {
                                "t_mjsyshdfxsbykzjhxbNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData,"val": e},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS12fengXianFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.fengxianfbObj,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS14bufuhexiang(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','chu']

                        // for (let t = 0; t < this.bufuheObj.length; t++) {
                        //         title.push(this.bufuheObj[t].bao_gao_lei_xing_)
                                
                        // }
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": this.bufuheObj,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                
                

        }
}
