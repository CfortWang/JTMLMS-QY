/**
 * 高度修复
 */
export default {
  methods: {
    /* 遍历配置，分发配置参数*/
    getMyConfig(name){
      if(this.config.length == 0)  return
      for(let i in this.config){
        if (this.config[i]['pei_zhi_biao_ming'] == name){
          return this.config[i]['pei_zhi_can_shu_'] //返回需要的对应参数
        }
      }
    },
    getS1jianCe(){
        return {
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
    getS2manYiDu(){
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
                "config":this.getMyConfig("满意度") //返回需要的对应参数
               }
       },
    getS3tousu(){
     return {
             "t_complaintBegin" :{"date": this.BeginDate,"number": this.relData['t_complaint'+this.BeginDate]},
             "t_complaintEnd" :{"date": this.endDate,"number": this.relData['t_complaint'+this.endDate]},
             "config":this.getMyConfig("投诉") //返回需要的对应参数
            }
    },
    getS4renYuanPeiXun(){
      return {
              "t_ryndpxjhBegin" :{"date": this.BeginDate,"number": this.relData['t_ryndpxjh'+this.BeginDate]},
              "t_ryndpxjhEnd" :{"date": this.endDate,"number": this.relData['t_ryndpxjh'+this.endDate]},
              "t_rypxjlnkBegin" :{"date": this.BeginDate,"number": this.relData['t_rypxjlnk'+this.BeginDate]},
              "t_rypxjlnkEnd" :{"date": this.endDate,"number": this.relData['t_rypxjlnk'+this.endDate]},
              "config":this.getMyConfig("人员培训") //返回需要的对应参数
             }
     },
    getS5renYuanJianDu(){
      return {
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
      return {
              "t_ndsbxzjdjhBegin" :{"date": this.BeginDate,"number": this.relData['t_ndsbxzjdjh'+this.BeginDate]},
              "t_ndsbxzjdjhEnd" :{"date": this.endDate,"number": this.relData['t_ndsbxzjdjh'+this.endDate]},
              "t_yqsbxzjgBegin" :{"date": this.BeginDate,"number": this.relData['t_yqsbxzjg'+this.BeginDate]},
              "t_yqsbxzjgEnd" :{"date": this.endDate,"number": this.relData['t_yqsbxzjg'+this.endDate]},
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
  }
}
