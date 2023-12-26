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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.jiaoyanMGObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.jiaoyanMGObj[i].NAME_ )
                                mid[midI].numA = this.jiaoyanMGObj[i].numA
                                mid[midI].num = this.jiaoyanMGObj[i].num
                                mid[midI].wnum = this.jiaoyanMGObj[i].numA-this.jiaoyanMGObj[i].num
                                mid[midI].chu = Math.floor(this.jiaoyanMGObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.hechaMGObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.hechaMGObj[i].NAME_ )
                                mid[midI].numA = this.hechaMGObj[i].numA
                                mid[midI].num = this.hechaMGObj[i].num
                                mid[midI].wnum = this.hechaMGObj[i].numA-this.hechaMGObj[i].num
                                mid[midI].chu = Math.floor(this.hechaMGObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.waibuObjfb.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.waibuObjfb[i].NAME_ )
                                mid[midI].numA = this.waibuObjfb[i].numA
                                mid[midI].num = this.waibuObjfb[i].num
                                mid[midI].wnum = this.waibuObjfb[i].numA-this.waibuObjfb[i].num
                                mid[midI].chu = Math.floor(this.waibuObjfb[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                                let prop = fenshuzu[j].zhi_liang_mu_biao;
                                                zlzbfz[i][prop] = fenshuzu[j].location
                                        }
                                }
                        }
                        // console.log(zlzbfz,'5456456456546gfhghghgf')
                        for (let t = 0; t < this.zhiliangmubiaotitle.length; t++) {
                                title.push(this.zhiliangmubiaotitle[t].zhi_liang_mu_biao)
                                
                        }
                        let zbval = []
                        for (let t = 0; t < this.zhiliangmubiaotitle.length; t++) {
                                if(this.zhiliangmubiaotitle[t].zhi_liang_mu_biao.match(/(\d+(\.\d+)?)/)=== null){
                                        zbval.push(parseFloat(this.zhiliangmubiaotitle[t].zhi_biao_xian_zhi.match(/(\d+(\.\d+)?)/)))
                                }else{
                                        zbval.push(parseFloat(this.zhiliangmubiaotitle[t].zhi_liang_mu_biao.match(/(\d+(\.\d+)?)/)))
                                }
                        }
                        // console.log(this.zhiliangmubiaotitle,zlzbfz,fenshuzu,'dsdsfddssf9090090')
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
                                "Num" :{"date": this.endDate,"number": zlzbfz,"title":title,"xianzhi":zbval,"titleall":this.zhiliangmubiaotitle},
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
                        // console.log(fenshuzu,zlzbfz,'55353453535345')
                        let title = ['name_']
                        for (let zn = 0; zn < fenshuzu.length; zn++) {
                                for (let i = 0; i < zlzbfz.length; i++) {
                                        if(fenshuzu[zn].data&&fenshuzu[zn].data.length>0){
                                                for (let j = 0; j < fenshuzu[zn].data.length; j++) {
                                                        if(zlzbfz[i].name_ == fenshuzu[zn].data[j].bzsj){
                                                                let prop = fenshuzu[zn].data[j].zhi_liang_zhi_bia;
                                                                zlzbfz[i][prop] = fenshuzu[zn].data[j].location
                                                                // console.log(zlzbfz)
                                                        }
                                                        //continue
                                                }
                                                
                                        }
                                        //continue
                                }
                                zongfz.push({'id':fenshuzu[zn].id_,'name':fenshuzu[zn].name_,'data':zlzbfz})
                                
                        }
                        // console.log(zongfz,'0000000000000000767676767676767676767676')
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
                        let title = ['NAME_','numA','num','wnum']
                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.gaijinxiangObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.gaijinxiangObj[i].NAME_ )
                                mid[midI].numA = this.gaijinxiangObj[i].numA
                                mid[midI].num = this.gaijinxiangObj[i].num
                                mid[midI].wnum = this.gaijinxiangObj[i].numA-this.gaijinxiangObj[i].num
                                mid[midI].chu = Math.floor(this.gaijinxiangObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                c= Math.floor(b/a * 1000) / 10
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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.guanshenfbObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.guanshenfbObj[i].NAME_ )
                                mid[midI].numA = this.guanshenfbObj[i].numA
                                mid[midI].num = this.guanshenfbObj[i].num
                                mid[midI].wnum = this.guanshenfbObj[i].numA-this.guanshenfbObj[i].num
                                mid[midI].chu = Math.floor(this.guanshenfbObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                        e =Math.floor(mjjcbgNum[0]/mjjcbgSNum[0] * 1000) / 10
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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.neishenfbObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.neishenfbObj[i].NAME_ )
                                mid[midI].numA = this.neishenfbObj[i].numA
                                mid[midI].num = this.neishenfbObj[i].num
                                mid[midI].wnum = this.neishenfbObj[i].numA-this.neishenfbObj[i].num
                                mid[midI].chu = Math.floor(this.neishenfbObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        }
                        barData.push(e)
                        
                        return {
                                "t_complaintNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData,"val":e,"title":"应急预案演练完成率"},
                                // "t_mjwtsqbNum" :{"date": this.dataScope,"number": mjwtsqbNum},
                                "config":this.getMyConfig("客户投诉率") //返回需要的对应参数
                        }
                },
                getS3tousuFB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.yingjifbObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.yingjifbObj[i].NAME_ )
                                mid[midI].numA = this.yingjifbObj[i].numA
                                mid[midI].num = this.yingjifbObj[i].num
                                mid[midI].wnum = this.yingjifbObj[i].numA-this.yingjifbObj[i].num
                                mid[midI].chu = Math.floor(this.yingjifbObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"应急预案演练各部门完成率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getshijiazhipinjihua(){
                        let ryywpxjNum = this.yingjiObj
                        let barData = []
                        let e=0
                        if (ryywpxjNum[0].num===0) {
                                e =0
                         } else {
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        }
                        barData.push(e)
                        
                        return {
                                "t_complaintNum" :{"date": this.endDate,"number": ryywpxjNum[1].num, "numberAll": ryywpxjNum[0].num, "res": barData,"val":e,"title":"室内质控完成率"},
                                // "t_mjwtsqbNum" :{"date": this.dataScope,"number": mjwtsqbNum},
                                "config":this.getMyConfig("客户投诉率") //返回需要的对应参数
                        }
                },
                getshijiazhipinjihuaB(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.yingjifbObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.yingjifbObj[i].NAME_ )
                                mid[midI].numA = this.yingjifbObj[i].numA
                                mid[midI].num = this.yingjifbObj[i].num
                                mid[midI].wnum = this.yingjifbObj[i].numA-this.yingjifbObj[i].num
                                mid[midI].chu = Math.floor(this.yingjifbObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"室内质控各部门完成率"},
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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.zaigangrenyuanfb.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.zaigangrenyuanfb[i].NAME_ )
                                mid[midI].numA = this.zaigangrenyuanfb[i].numA
                                mid[midI].num = this.zaigangrenyuanfb[i].num
                                mid[midI].wnum = this.zaigangrenyuanfb[i].numA-this.zaigangrenyuanfb[i].num
                                mid[midI].chu = Math.floor(this.zaigangrenyuanfb[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                        e =Math.floor(zljdNum[1].num/zljdNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.gangqianpeixunfb.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.gangqianpeixunfb[i].NAME_ )
                                mid[midI].numA = this.gangqianpeixunfb[i].numA
                                mid[midI].num = this.gangqianpeixunfb[i].num
                                mid[midI].wnum = this.gangqianpeixunfb[i].numA-this.gangqianpeixunfb[i].num
                                mid[midI].chu = Math.floor(this.gangqianpeixunfb[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.neibuObjfb.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.neibuObjfb[i].NAME_ )
                                mid[midI].numA = this.neibuObjfb[i].numA
                                mid[midI].num = this.neibuObjfb[i].num
                                mid[midI].wnum = this.neibuObjfb[i].numA-this.neibuObjfb[i].num
                                mid[midI].chu = Math.floor(this.neibuObjfb[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
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
                                e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
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
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.fengxianfbObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.fengxianfbObj[i].NAME_ )
                                mid[midI].numA = this.fengxianfbObj[i].numA
                                mid[midI].num = this.fengxianfbObj[i].num
                                mid[midI].wnum = this.fengxianfbObj[i].numA-this.fengxianfbObj[i].num
                                mid[midI].chu = Math.floor(this.fengxianfbObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS14bufuhexiang(){
                        // let zlzbfz = []
                        // zlzbfz = this.quality
                        // let fenshuzu = []
                        // fenshuzu = this.buhegelvObj
                        
                        let title = ['NAME_','numA','num','wnum']

                        let mid = JSON.parse(JSON.stringify(this.allBuMen))
                        for (let i = 0; i < this.bufuheObj.length; i++) {
                                let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[midI].numA = this.bufuheObj[i].numA
                                mid[midI].num = this.bufuheObj[i].num
                                mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getbuhegeyangpin(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 99.8,title:"不合格样品率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getbuhegeyangpinB(){
                        let tableData={
                                header: ['<span></span>','<span style="font-size:14px;height:53px">临检组</span>', '<span style="font-size:14px;height:53px">生化组</span>', '<span style="font-size:14px;height:53px">免疫组</span>', '<span style="font-size:14px;height:53px">微生物组</span>', '<span style="font-size:14px;height:53px">流式组</span>', '<span style="font-size:14px;height:53px">细胞形态组</span>', '<span style="font-size:14px;height:53px">分子组</span>', '<span style="font-size:14px;height:53px">遗传组</span>'],
                                rowNum: 13,
                                columnWidth: [90,150,150,150,150,150,150,150,150],
                                align: ['left','center','center','center','center','center','center','center','center'],
                                data: [
                                  ['1月','<span style="font-size:10px;">值:0.5%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.31%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['2月','<span style="font-size:10px;">值:0.5%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.4%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['3月','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.31%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['4月','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['5月','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.51%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['6月','<span style="font-size:10px;">值:0.52%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['7月','<span style="font-size:10px;">值:1.1%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.19%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['8月','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['9月','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.11%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['10月','<span style="font-size:10px;">值:0.5%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['11月','<span style="font-size:10px;">值:0.6%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.12%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                  ['12月','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>', '<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>','<span style="font-size:10px;">值:0.1%;限值:≤1%</span>','<span style="font-size:10px;">值:0.3%;限值:≤1%</span>','<span style="font-size:10px;">值:0.7%;限值:≤1%</span>','<span style="font-size:10px;">值:0.2%;限值:≤1%</span>'],
                                ]
                              }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": tableData,title:"部门不合格样品率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getbaogaobuzhengque(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 94.5,title:"报告不正确率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getbaogaobuzhengqueB(){
                        let tableData={
                                header: ['<span></span>','<span style="font-size:14px;height:53px">临检组</span>', '<span style="font-size:14px;height:53px">生化组</span>', '<span style="font-size:14px;height:53px">免疫组</span>', '<span style="font-size:14px;height:53px">微生物组</span>', '<span style="font-size:14px;height:53px">流式组</span>', '<span style="font-size:14px;height:53px">细胞形态组</span>', '<span style="font-size:14px;height:53px">分子组</span>', '<span style="font-size:14px;height:53px">遗传组</span>'],
                                rowNum: 13,
                                columnWidth: [90,150,150,150,150,150,150,150,150],
                                align: ['left','center','center','center','center','center','center','center','center'],
                                data: [
                                  ['1月','<span style="font-size:10px;">值:1%;限值:=0%</span>', '<span style="font-size:10px;">值:0.31%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['2月','<span style="font-size:10px;">值:1%;限值:=0%</span>', '<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['3月','<span style="font-size:10px;">值:0%;限值:=0%</span>', '<span style="font-size:10px;">值:0.31%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['4月','<span style="font-size:10px;">值:0%;限值:=0%</span>', '<span style="font-size:10px;">值:0.6%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['5月','<span style="font-size:10px;">值:0%;限值:=0%</span>', '<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['6月','<span style="font-size:10px;">值:4%;限值:=0%</span>', '<span style="font-size:10px;">值:0.31%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['7月','<span style="font-size:10px;">值:0%;限值:=0%</span>', '<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['8月','<span style="font-size:10px;">值:0%;限值:=0%</span>', '<span style="font-size:10px;">值:0.31%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['9月','<span style="font-size:10px;">值:0%;限值:=0%</span>', '<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['10月','<span style="font-size:10px;">值:2%;限值:=0%</span>', '<span style="font-size:10px;">值:0.2%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['11月','<span style="font-size:10px;">值:3%;限值:=0%</span>', '<span style="font-size:10px;">值:0.31%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  ['12月','<span style="font-size:10px;">值:0%;限值:=0%</span>', '<span style="font-size:10px;">值:0.31%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>','<span style="font-size:10px;">值:0;限值:=0%</span>','<span style="font-size:10px;">值:3%;限值:=0%</span>','<span style="font-size:10px;">值:1.2%;限值:=0%</span>','<span style="font-size:10px;">值:0.7%;限值:=0%</span>','<span style="font-size:10px;">值:0%;限值:=0%</span>'],
                                  
                                ]
                              }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": tableData,title:"部门报告不正确率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getweijizhibaogao(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 50,"title":"危急值报告率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getweijizhibaogaoB(){
                        let title = ['NAME_','numA']
                        let a = [91,94,100,100,100,98,99.7,100,97.3,100,93,90]
                        let mid = JSON.parse(JSON.stringify(this.bfBuMen))
                        for (let i = 0; i < mid.length; i++) {
                                // let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[i].numA = a[i]
                                // mid[midI].num = this.bufuheObj[i].num
                                // mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                // mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"部门危急值报告率","limitVal":"100","limitValZ":"=100%"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getweijizhijishi(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 16.5,"title":"危急值报告及时率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getweijizhijishiB(){
                        let title = ['NAME_','numA']
                        let a = [91,98,99.7,100,97.3,100,93,94,100,100,100,100]
                        let mid = JSON.parse(JSON.stringify(this.bfBuMen))
                        for (let i = 0; i < mid.length; i++) {
                                // let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[i].numA = a[i]
                                // mid[midI].num = this.bufuheObj[i].num
                                // mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                // mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"部门危急值报告率","limitVal":"100","limitValZ":"=100%"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getsysnzzsjfh(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 89.2,title:"实验室内周转时间符合率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getsysnzzsjfhB(){
                        let tableData={
                                header: ['<span></span>','<span style="font-size:14px;height:53px">临检组</span>', '<span style="font-size:14px;height:53px">生化组</span>', '<span style="font-size:14px;height:53px">免疫组</span>', '<span style="font-size:14px;height:53px">微生物组</span>', '<span style="font-size:14px;height:53px">流式组</span>', '<span style="font-size:14px;height:53px">细胞形态组</span>', '<span style="font-size:14px;height:53px">分子组</span>', '<span style="font-size:14px;height:53px">遗传组</span>'],
                                rowNum: 13,
                                columnWidth: [90,150,150,150,150,150,150,150,150],
                                align: ['left','center','center','center','center','center','center','center','center'],
                                data: [
                                  ['1月','<span style="font-size:10px;">值:96%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:91%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>'],
                                  ['2月','<span style="font-size:10px;">值:96%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>'],
                                  ['3月','<span style="font-size:10px;">值:97%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>'],
                                  ['4月','<span style="font-size:10px;">值:96%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:95%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:95%;限值:>95%</span>','<span style="font-size:10px;">值:90%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>'],
                                  ['5月','<span style="font-size:10px;">值:98%;限值:>95%</span>', '<span style="font-size:10px;">值:95%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:90%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:90%;限值:>95%</span>'],
                                  ['6月','<span style="font-size:10px;">值:94%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>'],
                                  ['7月','<span style="font-size:10px;">值:92%;限值:>95%</span>', '<span style="font-size:10px;">值:95%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:95%;限值:>95%</span>','<span style="font-size:10px;">值:91%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:90%;限值:>95%</span>'],
                                  ['8月','<span style="font-size:10px;">值:96%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:95%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:95%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>'],
                                  ['9月','<span style="font-size:10px;">值:96%;限值:>95%</span>', '<span style="font-size:10px;">值:96%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:89%;限值:>95%</span>'],
                                  ['10月','<span style="font-size:10px;">值:86%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:98%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:89%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>'],
                                  ['11月','<span style="font-size:10px;">值:97%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:94%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:98%;限值:>95%</span>'],
                                  ['12月','<span style="font-size:10px;">值:90%;限值:>95%</span>', '<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:90%;限值:>95%</span>','<span style="font-size:10px;">值:97%;限值:>95%</span>','<span style="font-size:10px;">值:93%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>','<span style="font-size:10px;">值:92%;限值:>95%</span>','<span style="font-size:10px;">值:99%;限值:>95%</span>'],
                                  
                                  
                                ]
                              }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": tableData,title:"部门实验室内周转时间符合率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getjyqzzzws(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 91.6,title:"检验前周转时间中位数"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getjyqzzzwsB(){
                        let tableData={
                                header: ['<span></span>','<span style="font-size:14px;height:53px">临检组</span>', '<span style="font-size:14px;height:53px">生化组</span>', '<span style="font-size:14px;height:53px">免疫组</span>', '<span style="font-size:14px;height:53px">微生物组</span>', '<span style="font-size:14px;height:53px">流式组</span>', '<span style="font-size:14px;height:53px">细胞形态组</span>', '<span style="font-size:14px;height:53px">分子组</span>', '<span style="font-size:14px;height:53px">遗传组</span>'],
                                rowNum: 13,
                                columnWidth: [90,150,150,150,150,150,150,150,150],
                                align: ['left','center','center','center','center','center','center','center','center'],
                                data: [
                                  ['1月','<span style="font-size:10px;">值:119;限值:≤120分钟</span>', '<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:111;限值:≤120分钟</span>','<span style="font-size:10px;">值:90;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                  ['2月','<span style="font-size:10px;">值:119;限值:≤120分钟</span>', '<span style="font-size:10px;">值:123;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                  ['3月','<span style="font-size:10px;">值:126;限值:≤120分钟</span>', '<span style="font-size:10px;">值:123;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                  ['4月','<span style="font-size:10px;">值:119;限值:≤120分钟</span>', '<span style="font-size:10px;">值:123;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:120;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:128;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                  ['5月','<span style="font-size:10px;">值:119;限值:≤120分钟</span>', '<span style="font-size:10px;">值:125;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:156;限值:≤120分钟</span>'],
                                  ['6月','<span style="font-size:10px;">值:111;限值:≤120分钟</span>', '<span style="font-size:10px;">值:123;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:111;限值:≤120分钟</span>','<span style="font-size:10px;">值:110;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                  ['7月','<span style="font-size:10px;">值:119;限值:≤120分钟</span>', '<span style="font-size:10px;">值:114;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:99;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                  ['8月','<span style="font-size:10px;">值:109;限值:≤120分钟</span>', '<span style="font-size:10px;">值:123;限值:≤120分钟</span>','<span style="font-size:10px;">值:118;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:114;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                  ['9月','<span style="font-size:10px;">值:119;限值:≤120分钟</span>', '<span style="font-size:10px;">值:123;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:140;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:156;限值:≤120分钟</span>'],
                                  ['10月','<span style="font-size:10px;">值:119;限值:≤120分钟</span>', '<span style="font-size:10px;">值:103;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:105;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                  ['11月','<span style="font-size:10px;">值:123;限值:≤120分钟</span>', '<span style="font-size:10px;">值:123;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:121;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:106;限值:≤120分钟</span>'],
                                  ['12月','<span style="font-size:10px;">值:119;限值:≤120分钟</span>', '<span style="font-size:10px;">值:123;限值:≤120分钟</span>','<span style="font-size:10px;">值:109;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:100;限值:≤120分钟</span>','<span style="font-size:10px;">值:135;限值:≤120分钟</span>','<span style="font-size:10px;">值:104;限值:≤120分钟</span>','<span style="font-size:10px;">值:126;限值:≤120分钟</span>'],
                                ]
                              }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": tableData,title:"部门检验前周转时间中位数"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getbshineizhikong(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 83.5,"title":"室内质控评达标率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getbshineizhikongB(){
                        let title = ['NAME_','numA']
                        let a = [91,98,99.7,100,100,100,100,97.3,67,93,94,100]
                        let mid = JSON.parse(JSON.stringify(this.bfBuMen))
                        for (let i = 0; i < mid.length; i++) {
                                // let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[i].numA = a[i]
                                // mid[midI].num = this.bufuheObj[i].num
                                // mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                // mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"部门室内质控评达标率","limitVal":"95","limitValZ":"≥95%"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getshijianzhiping(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 33,"title":"室间质评合格率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getshijianzhipingB(){
                        let title = ['NAME_','numA']
                        let a = [91,67.9,99.7,89,88.8,90,87,97.3,67,93,94,100]
                        let mid = JSON.parse(JSON.stringify(this.bfBuMen))
                        for (let i = 0; i < mid.length; i++) {
                                // let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[i].numA = a[i]
                                // mid[midI].num = this.bufuheObj[i].num
                                // mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                // mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"部门室间质评合格率","limitVal":"95","limitValZ":"≥95%"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getshiyanshibidui(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 100,"title":"实验室间比对率（无室间质评项目）"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getshiyanshibiduiB(){
                        let title = ['NAME_','numA']
                        let a = [91,67.9,99.7,89,88.8,90,87,97.3,67,93,94,100]
                        let mid = JSON.parse(JSON.stringify(this.bfBuMen))
                        for (let i = 0; i < mid.length; i++) {
                                // let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[i].numA = a[i]
                                // mid[midI].num = this.bufuheObj[i].num
                                // mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                // mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"部门实验室间比对率（无室间质评项目）","limitVal":"50","limitValZ":"≥50%"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getshebeibuliang(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 16.5,"title":"设备不良事件上报时限符合率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getshebeibuliangB(){
                        let title = ['NAME_','numA']
                        let a = [91,67.9,99.7,89,88.8,90,87,97.3,67,93,94,100]
                        let mid = JSON.parse(JSON.stringify(this.bfBuMen))
                        for (let i = 0; i < mid.length; i++) {
                                // let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[i].numA = a[i]
                                // mid[midI].num = this.bufuheObj[i].num
                                // mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                // mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"部门设备不良事件上报时限符合率","limitVal":"100","limitValZ":"=100%"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getkehumanyi(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 56.25,"title":"客户满意率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getkehumanyiB(){
                        let title = ['NAME_','numA','num']
                        let a = [91,67.9,99.7,89,88.8,90,87,97.3,67,93,94,100]
                        let b = [87,97.3,67,93,94,100,91,67.9,99.7,89,88.8,90]
                        let mid = JSON.parse(JSON.stringify(this.bfBuMen))
                        for (let i = 0; i < mid.length; i++) {
                                // let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[i].numA = a[i]
                                mid[i].num = b[i]
                                // mid[midI].num = this.bufuheObj[i].num
                                // mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                // mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"部门客户满意率","limitVal":"90","limitValZ":"≥90%"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getygcjpxcsdb(){
                        // let ryywpxjNum = this.fengxianObj
                        // let barData = []
                        // let e=0
                        // if (ryywpxjNum[0].num===0) {
                        //         e =0
                        //  } else {
                        //         e =Math.floor(ryywpxjNum[1].num/ryywpxjNum[0].num * 1000) / 10
                        // }
                        return {
                                "num" :{"date": this.endDate,"number": 0, "numberAll": 0, "res": [],"val": 75,"title":"员工参加培训次数达标率"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getygcjpxcsdbB(){
                        let title = ['NAME_','numA']
                        let a = [67,93,94,100,91,67.9,99.7,89,88.8,90,87,97.3]
                        let b = [91,67.9,99.7,89,88.8,90,87,97.3,67,93,94,100]
                        let mid = JSON.parse(JSON.stringify(this.bfBuMen))
                        for (let i = 0; i < mid.length; i++) {
                                // let midI = mid.findIndex(v => v.NAME_ == this.bufuheObj[i].NAME_ )
                                mid[i].numA = a[i]
                                // mid[i].num = b[i]
                                // mid[midI].num = this.bufuheObj[i].num
                                // mid[midI].wnum = this.bufuheObj[i].numA-this.bufuheObj[i].num
                                // mid[midI].chu = Math.floor(this.bufuheObj[i].chu*10)/10
                        }
                        return {
                                "num" :{"date": this.endDate,"number": mid,"title":title,'tutitle':"部门员工参加培训次数达标率","limitVal":"80","limitValZ":"≧80%"},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                
                
                

        }
}
