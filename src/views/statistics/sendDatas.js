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
                        let name = []
                        let val =[]
                        let valAll = []
                        let e = []
                        let that = this
                        let a=0
                        let b=0
                        let c=0
                        // console.log('3423sdfsd',that.jiaoyanObj)
                        if(that.jiaoyanObj.length === 0){
                                val = [0]
                                valAll = [0]
                                e = [0]
                                name = [0]
                        }else{
                                for (let i = 0; i < that.jiaoyanObj.length; i++) {
                                        let num=0
                                        let nameMid =''
                                        if (that.jiaoyanObj[i].t_mjsbjdxzjhzb===0) {
                                                num =0
                                        } else {
                                                num =Math.floor(that.jiaoyanObj[i].t_mjsbjdxzjhzbS/that.jiaoyanObj[i].t_mjsbjdxzjhzb * 10000) / 100
                                        }
                                        if (!that.jiaoyanObj[i].t_mjsbjdxzjhzbName) {
                                                name.push(that.jiaoyanObj[i].t_mjsbjdxzjhzbZhName)
                                        } else {
                                                nameMid=that.jiaoyanObj[i].t_mjsbjdxzjhzbZhName.split("—")
                                                if(nameMid.length===2){
                                                        name.push(nameMid[1]+that.jiaoyanObj[i].t_mjsbjdxzjhzbName)
                                                }else{
                                                        name.push(nameMid[0]+that.jiaoyanObj[i].t_mjsbjdxzjhzbName)
                                                }
                                        }
                                        valAll.push(that.jiaoyanObj[i].t_mjsbjdxzjhzb)
                                        val.push(that.jiaoyanObj[i].t_mjsbjdxzjhzbS)
                                        e.push(num)
        
                                        // name.push(that.jiaoyanObj[i].t_mjsbjdxzjhzbName)
                                        
        
                                }
                        }
                        
                        val.forEach( function(item){
                                a += item ;
                        });
                        valAll.forEach( function(item){
                                b += item ;
                        });
                        if(b===0){
                                c=0
                        }else{
                                c= Math.floor(a/b * 10000) / 100
                        }
                        // console.log(val,valAll,e,name,a,b,c,"jsoi39")
                        return {
                                "t_mjsbjdxzjhzbNum" :{"date": this.endDate,"number": val, "numberAll": valAll, "val": e, "name": name, "valnum":a,"valAll":b,"valna":c},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                gethechaObjNum(){
                        let name = []
                        let val =[]
                        let valAll = []
                        let e = []
                        let that = this
                        let a=0
                        let b=0
                        let c=0
                        if(that.hechaObj.length === 0){
                                val = [0]
                                valAll = [0]
                                e = [0]
                                name = [0]
                        }else{
                                for (let i = 0; i < that.hechaObj.length; i++) {
                                        let nameMid = ''
                                        // let num=0
                                        if (!that.hechaObj[i].t_sbhcjlbZhname) {
                                                name.push(that.hechaObj[i].t_sbhcjlbName)
                                        } else {
                                                nameMid=that.hechaObj[i].t_sbhcjlbName.split("—")
                                                if(nameMid.length===2){
                                                        name.push(nameMid[1]+that.hechaObj[i].t_sbhcjlbZhname)
                                                }else{
                                                        name.push(nameMid[0]+that.hechaObj[i].t_sbhcjlbZhname)
                                                }
                                        }
                                        valAll.push(that.hechaObj[i].t_sbhcjlb)
                                        val.push(that.hechaObj[i].t_sbhcjlbS)
                                        // e.push(num)

                                        

                                }
                        }
                        val.forEach( function(item){
                                if(item>0){
                                        a += 1 ;
                                }
                        });
                        valAll.forEach( function(item){
                                if(item>0){
                                        b += 1 ;
                                }
                        });
                        if(b===0){
                                c=0
                        }else{
                                c= Math.floor(a/b * 10000) / 100
                        }
                        return {
                                "t_sbhcjlbNum" :{"date": this.endDate,"number": val, "numberAll": valAll, "name": name,"valnum":a,"valAll":b,"valna":c},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getnengtliObjNum(){
                        let name = []
                        let val =[]
                        let valAll = []
                        let e = []
                        let that = this
                        
                        let a=that.nengliObj[0].num
                        let b=that.nengliObj[1].num
                        let c=0

                        console.log(that.nengliObj,'904380439034904343')
                        // if(that.nengliObj.length === 0){
                        //         val = [0]
                        //         valAll = [0]
                        //         e = [0]
                        //         name = [0]
                        // }else{
                        //         for (let i = 0; i < that.nengliObj.length; i++) {
                        //                 // let num=0
                        //                 // if (that.hechaObj[i].t_sbhcjlb===0) {
                        //                 //         num =0
                        //                 // } else {
                        //                 //         num =Math.floor(that.hechaObj[i].t_sbhcjlbS/that.hechaObj[i].t_sbhcjlb * 10000) / 100
                        //                 // }
                        //                 // valAll.push(that.hechaObj[i].t_sbhcjlb)
                        //                 val.push(that.nengliObj[i].num)
                        //                 valAll.push(that.nengliObj[i].numS)
                        //                 // e.push(num)
                        //                 let nameMid = that.nengliObj[i].enname.split("—")
                        //                 if(nameMid.length===2){
                        //                         name.push(nameMid[1])
                        //                 }else{
                        //                         name.push(nameMid[0])
                        //                 }

                        // }
                        // }
                        // val.forEach( function(item){
                        //         a += item ;
                        // });
                        // valAll.forEach( function(item){
                        //         b += item ;
                        // });
                        if(b===0){
                                c=0
                        }else{
                                c= Math.floor(b/a * 10000) / 100
                        }
                        return {
                                "Num" :{"date": this.endDate,"number": val, "name": name,"numberAll":valAll,"valnum":a,"valAll":b,"valna":c},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
                        }
                },
                getbiaozhunObjNum(){
                        let name = []
                        let val =[]
                        let valAll = []
                        let e = []
                        let a=0
                        let b=0
                        let c=0
                        let numm = 0
                        let that = this
                        if(that.biaozhunObj.length === 0){
                                val = [0]
                                valAll = [0]
                                e = [0]
                                name = [0]
                        }else{
                                for (let i = 0; i < that.biaozhunObj.length; i++) {
                                        // let num=0
                                        // if (that.hechaObj[i].t_sbhcjlb===0) {
                                        //         num =0
                                        // } else {
                                        //         num =Math.floor(that.hechaObj[i].t_sbhcjlbS/that.hechaObj[i].t_sbhcjlb * 10000) / 100
                                        // }
                                        // valAll.push(that.hechaObj[i].t_sbhcjlb)
                                        val.push(that.biaozhunObj[i].num)
                                        valAll.push(that.biaozhunObj[i].numS)
                                        // e.push(num)
                                        name.push(that.biaozhunObj[i].name)

                                }
                        }
                        val.forEach( function(item){
                                a += item ;
                        });
                        valAll.forEach( function(item){
                                b += item ;
                        });
                        if (that.biaozhunTObj.length===0) {
                                numm = 1
                        } else {
                                numm = Math.floor((12-that.biaozhunTObj[0].time)/3) + 1
                        }
                        a=a*numm
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
                getbzJunZhujNum(){
                        let name = []
                        let val =[]
                        let valAll = []
                        let e = []
                        let a=0
                        let b=0
                        let c=0
                        let numm = 0
                        let that = this
                        if(that.bzJunZhuObj.length === 0){
                                val = [0]
                                valAll = [0]
                                e = [0]
                                name = [0]
                        }else{
                                for (let i = 0; i < that.bzJunZhuObj.length; i++) {
                                        // let num=0
                                        // if (that.hechaObj[i].t_sbhcjlb===0) {
                                        //         num =0
                                        // } else {
                                        //         num =Math.floor(that.hechaObj[i].t_sbhcjlbS/that.hechaObj[i].t_sbhcjlb * 10000) / 100
                                        // }
                                        // valAll.push(that.hechaObj[i].t_sbhcjlb)
                                        val.push(that.bzJunZhuObj[i].num)
                                        valAll.push(that.bzJunZhuObj[i].numS)
                                        // e.push(num)
                                        name.push(that.bzJunZhuObj[i].name)

                                }
                        }
                        val.forEach( function(item){
                                a += item ;
                        });
                        valAll.forEach( function(item){
                                b += item ;
                        });
                        if (that.bzJunZhuTObj.length===0) {
                                numm = 1
                        } else {
                                numm = Math.floor((12-that.bzJunZhuTObj[0].time)/3) + 1
                        }
                        a=a*numm
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
                        a=a*numm
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
                        if(this.config.length == 0)  return
                        for(let i in this.config){
                                if (this.config[i]['pei_zhi_biao_ming'] == name){
                                        return this.config[i]['pei_zhi_can_shu_'] //返回需要的对应参数
                                }
                        }
                },
                getS1renwu(){
                        let jchzbNum = this.getMatchingData('t_lhjczb')
                        let jchzbSNum = this.getMatchingDataSame('t_lhjczb')
                        let barData = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                                let e=0
                                if (jchzbSNum[0]===0) {
                                        e =0
                                } else {
                                        e =Math.floor(jchzbNum[0]/jchzbSNum[0] * 10000) / 100
                                }
                                barData.push(e)
                        // }
                        // console.log(jchzbNum,jchzbSNum,'hsuihsahiu')
                        return {
                                "t_jchzbNum" :{"date": this.endDate,"number": jchzbNum, "numberAll": jchzbSNum, "res": barData},
                                "config":this.getMyConfig("检测") //返回需要的对应参数
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
                        let khmydtjbNum = this.getMatchingData('t_khmydtjb')
                        let khmydtjbNumN = this.getMatchingData('t_khmydtjbnum') * 50
                        let khmydtjbSNum = this.getMatchingDataSame('t_khmydtjb')
                        let barData = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                                let e=0
                                if (khmydtjbNumN===0) {
                                        e =0
                                } else {
                                        e =Math.floor(khmydtjbNum[0]/khmydtjbNumN * 10000) / 100
                                }
                                // console.log(e,'eeeeee')
                                barData.push(e)
                        // }
                        return {
                                "t_myddcBegin" :{"date": this.BeginDate,"number": this.relData['t_myddc'+this.BeginDate]},
                                "t_myddcEnd" :{"date": this.endDate,"number": this.relData['t_myddc'+this.endDate]},
                                "t_myddc1Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc1'+this.BeginDate]},
                                "t_myddc1End" :{"date": this.endDate,"number": this.relData['t_myddc1'+this.endDate]},
                                "t_myddc2Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc2'+this.BeginDate]},
                                "t_myddc2End" :{"date": this.endDate,"number": this.relData['t_myddc2'+this.endDate]},
                                "t_myddc3Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc3'+this.BeginDate]},
                                "t_myddc3End" :{"date": this.endDate,"number": this.relData['t_myddc3'+this.endDate]},
                                "t_myddc4Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc4'+this.BeginDate]},
                                "t_myddc4End" :{"date": this.endDate,"number": this.relData['t_myddc4'+this.endDate]},
                                "t_myddc5Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc5'+this.BeginDate]},
                                "t_myddc5End" :{"date": this.endDate,"number": this.relData['t_myddc5'+this.endDate]},
                                "t_myddc6Begin" :{"date": this.BeginDate,"number": this.relData['t_myddc6'+this.BeginDate]},
                                "t_myddc6End" :{"date": this.endDate,"number": this.relData['t_myddc6'+this.endDate]},
                                "t_khmydtjbNum" :{"date": this.endDate,"number": khmydtjbNum, "numberAll": khmydtjbSNum, "res": barData,'num':khmydtjbNumN},
                                "config":this.getMyConfig("客户满意度") //返回需要的对应参数
                        }
                },
                getS3tousu(){
                        let complaintNum = this.getMatchingData('t_complaint')
                        let complainNum = this.getMatchingDataSame('t_complain')
                        let complaintNumS = this.getMatchingDataSame('t_complaint')
                        let mjwtsqbNum = this.getMatchingData('t_mjwtsqb')
                        let e=0
                        let barData =[]
                        let e1=0
                        let barData1 =[]
                        let e2=0
                        let barData2 =[]
                        if (mjwtsqbNum[0]===0) {
                                e =0
                        } else {
                                e =Math.floor(complaintNum[0]/mjwtsqbNum[0] * 10000) / 100
                        }
                        if (complaintNum[0]===0) {
                                e1 =0
                        } else {
                                e1 =Math.floor(complaintNumS[0]/complaintNum[0] * 10000) / 100
                        }
                        if (complaintNum[0]===0) {
                                e2 =0
                        } else {
                                e2 =Math.floor(complainNum[0]/complaintNum[0] * 10000) / 100
                        }
                        barData.push(e)
                        barData1.push(e1)
                        barData2.push(e2)
                        
                        return {
                                "t_complaintNum" :{"date": this.endDate,"number": complaintNum,"numberAll":mjwtsqbNum,"res":barData,"num48":complaintNumS,"res1":barData1,"numtong":complainNum,"res2":barData2},
                                "t_mjwtsqbNum" :{"date": this.dataScope,"number": mjwtsqbNum},
                                "config":this.getMyConfig("客户投诉率") //返回需要的对应参数
                        }
                },
                getS4renYuanPeiXun(){
                        let ryywpxjNum = this.getMatchingData('t_ryywpxjl')
                        let ryywpxjSNum = this.getMatchingDataSame('t_ryywpxjl')
                        let barData = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                                let e=0
                                if (ryywpxjSNum[0]===0) {
                                        e =0
                                } else {
                                        e =Math.floor(ryywpxjNum[0]/ryywpxjSNum[0] * 10000) / 100
                                }
                                barData.push(e)
                        // }
                        return {
                                "t_ryywpxjlNum" :{"date": this.endDate,"number": ryywpxjNum, "numberAll": ryywpxjSNum, "res": barData},
                                "t_ryndpxjhBegin" :{"date": this.BeginDate,"number": this.relData['t_ryndpxjh'+this.BeginDate]},
                                "t_ryndpxjhEnd" :{"date": this.endDate,"number": this.relData['t_ryndpxjh'+this.endDate]},
                                "t_rypxjlnkBegin" :{"date": this.BeginDate,"number": this.relData['t_rypxjlnk'+this.BeginDate]},
                                "t_rypxjlnkEnd" :{"date": this.endDate,"number": this.relData['t_rypxjlnk'+this.endDate]},
                                "config":this.getMyConfig("人员培训") //返回需要的对应参数
                        }
                },
                getS5renYuanJianDu(){
                        let zljdNum = this.getMatchingData('t_zljd')
                        let zljdSNum = this.getMatchingDataSame('t_zljd')
                        let barData = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                                let e=0
                                if (zljdSNum[0]===0) {
                                        e =0
                                } else {
                                        e =Math.floor(zljdNum[0]/zljdSNum[0] * 10000) / 100
                                }
                                barData.push(e)
                        // }
                        return {
                                "t_zljdNum" :{"date": this.endDate,"number": zljdNum, "numberAll": zljdSNum, "res": barData},
                                "t_zljdBegin" :{"date": this.BeginDate,"number": this.relData['t_zljd'+this.BeginDate]},
                                "t_zljdEnd" :{"date": this.endDate,"number": this.relData['t_zljd'+this.endDate]},
                                "t_zljdssBegin" :{"date": this.BeginDate,"number": this.relData['t_zljdss'+this.BeginDate]},
                                "t_zljdssEnd" :{"date": this.endDate,"number": this.relData['t_zljdss'+this.endDate]},
                                "config":this.getMyConfig("人员监督") //返回需要的对应参数
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
                        //年度总
                        let mjzlkzxbNum = this.getMatchingData('t_mjzlkzxb')
                        //年度条件
                        let mjzlkzxbSNum = this.getMatchingDataSame('t_mjzlkzxb')
                        //部门总
                        let mjzlkzjlbNum = this.getMatchingData('t_mjzlkzjlb')
                        //部门条件
                        let mjzlkzjlbSNum = this.getMatchingDataSame('t_mjzlkzjlb')
                        let numData = []
                        let numAData = []
                        let barData = []
                        let a=0
                        let b=0
                        let c=0
                        // for (let i = 0; i < this.dataScope.length; i++) {
                        // let e=0
                        // if (mjzlkzxbSNum[0]===0) {
                        //         e =0
                        // } else {
                        //         e =Math.floor(mjzlkzxbNum[0]/mjzlkzxbSNum[0] * 10000) / 100
                        // }
                        numData.push('计划内')
                        numData.push(mjzlkzxbNum[0])
                        numData.push(mjzlkzxbSNum[0])
                        numAData.push('计划外')
                        numAData.push(mjzlkzjlbNum[0])
                        numAData.push(mjzlkzjlbSNum[0])
                        barData.push(numData)
                        barData.push(numAData)
                        a=mjzlkzxbSNum[0]+mjzlkzjlbSNum[0]
                        b=mjzlkzxbNum[0]+mjzlkzjlbNum[0]
                        if(b===0){
                                c=0
                        }else{
                                c= Math.floor(a/b * 10000) / 100
                        }
                        // }
                        return {
                                "t_mjzlkzxbNum" :{"date": this.endDate,"number": numData, "numberAll": numAData,'val':barData,"valnum":a,"valAll":b,"valna":c},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS12fengXian(){
                        //年度总
                        let mjsyshdfxsbykzjhxbNum = this.getMatchingData('t_mjsyshdfxsbykzjhxb')
                        //年度条件
                        let mjsyshdfxsbykzjhxbSNum = this.getMatchingDataSame('t_mjsyshdfxsbykzjhxb')

                        let numData = []
                        let numAData = []
                        let barData = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                        let e=0
                        if (mjsyshdfxsbykzjhxbNum[0]===0) {
                                e =0
                        } else {
                                e =Math.floor(mjsyshdfxsbykzjhxbSNum[0]/mjsyshdfxsbykzjhxbNum[0] * 10000) / 100
                        }
                        numData.push(mjsyshdfxsbykzjhxbSNum[0])
                        numData.push(mjsyshdfxsbykzjhxbNum[0])
                        barData.push(e)
                        // }
                        return {
                                "t_mjsyshdfxsbykzjhxbNum" :{"date": this.endDate,"number": mjsyshdfxsbykzjhxbSNum, "numberAll":mjsyshdfxsbykzjhxbNum, "res":barData},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
                getS14bufuhexiang(){
                        //年度总
                        let bfhxbgyjzcsjlbxNum = this.getMatchingData('t_bfhxbgyjzcsjlbx')
                        //年度条件
                        let bfhxbgyjzcsjlbxSNum = this.getMatchingDataSame('t_bfhxbgyjzcsjlbx')

                        let numData = []
                        let numAData = []
                        let barData = []
                        // for (let i = 0; i < this.dataScope.length; i++) {
                        let e=0
                        if (bfhxbgyjzcsjlbxNum[0]===0) {
                                e =0
                        } else {
                                e =Math.floor(bfhxbgyjzcsjlbxSNum[0]/bfhxbgyjzcsjlbxNum[0] * 10000) / 100
                        }
                        numData.push(bfhxbgyjzcsjlbxSNum[0])
                        numData.push(bfhxbgyjzcsjlbxNum[0])
                        barData.push(e)
                        // }
                        return {
                                "t_bfhxbgyjzcsjlbxNum" :{"date": this.endDate,"number": bfhxbgyjzcsjlbxSNum, "numberAll":bfhxbgyjzcsjlbxNum, "res":barData},
                                "config":this.getMyConfig("内部质量") //返回需要的对应参数
                        }
                },
        }
}
