<template>
  <!-- 样品数据总览组件 -->
  <div class="baseBgColor">
      <div class="totalNumber">
        <div>委托样品总数</div>
        <div class="number">{{EntrustedTotal}}个</div>
      </div>
      <div class="totalNumber">
        <div>客户委托样品总数</div>
        <div class="number">{{EntrustedTotalW}}个</div>
      </div>
      <div class="totalNumber">
        <div>内部委托样品总数</div>
        <div class="number">{{EntrustedTotalN}}个</div>
      </div>
      
      <div class="notReceived">
        <div>待收样数量</div>
        <div class="number">{{NotReceiveNumber}}个</div>
      </div>
      <div class="received">
        <div>已收样数量</div>
        <div class="number">{{ReceiveNumber}}个</div>
      </div>
      <div class="staging">
        <div>待检样品总数</div>
        <div class="number">{{StagingNumber}}个</div>
      </div>
      <div class="unqualified">
        <div>不合格样品数量</div>
        <div class="number">{{UnqualifiedNumber}}个</div>
      </div>
      <div class="retention">
        <div>留样样品数量</div>
        <div class="number">{{RetentionNumber}}个</div>
      </div>
      <div class="retention">
        <div>样品完成检测数量</div>
        <div class="number">{{SuccessNumber}}个</div>
      </div>
      <!-- <button @click="getTime">时间</button> -->
    
  </div>
  
</template>

<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
export default {
  props:{
    NowTime1:{
      type:String,
      default:""
    }
  },
  data(){
    return{
      timer:null,
      sendTime:'',
      EntrustedTotal:0,
      EntrustedTotalN:0,
      EntrustedTotalW:0,
      NotReceiveNumber:0,
      ReceiveNumber:0,
      StagingNumber:0,
      UnqualifiedNumber:0,
      RetentionNumber:0,
      SuccessNumber:0
    }
  },
  created(){
    //数据获取
    this.getEntrustedTotalData()
    this.getEntrustedTotalDataN()
    this.getEntrustedTotalDataW()
    this.getNotReceivedData()
    this.getReceivedData()
    this.getUnqualifiedData()
    this.getStayData()
    this.getSuccessData()
    this.getStagingNumberData()
    //拿到数据后先获取当前时间，把时间传给父组件
    this.getNowTime()
    // this.$emit('getUpdateTime',this.sendTime)
    // 页面进来先清除定时器
    clearInterval(this.timer)
    this.timer = null
    this.timer = setInterval(() =>{
      this.getEntrustedTotalData()
      this.getEntrustedTotalDataN()
      this.getEntrustedTotalDataW()
      this.getNotReceivedData()
      this.getReceivedData()
      this.getUnqualifiedData()
      this.getStayData()
      this.getSuccessData()

      // console.log('执行了定时器',this.sendTime)
      //数据回来之后调用触发this.$emit,触发父组件自定义方法获取时间
      this.getNowTime()
      // this.$emit('getUpdateTime',this.sendTime)
    }, 1000 * 60 *30);
    // 组件销毁清楚定时器
    this.$once('hook:beforeDestroy', () => {
    clearInterval(this.timer); 
    })
  },

  methods:{
   
     //获取时间
     getNowTime(){
      const nowDate = new Date();
      const date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          day: nowDate.getDate(),
          hour: nowDate.getHours(),
      }
      this.sendTime = date.year + '年' + date.month + '月' + date.day + '日' +date.hour + '时' 
      // console.log("获取时间函数执行了",this.sendTime)
      //获取时间的时候直接传给父组件
      this.$emit('getUpdateTime',this.sendTime)
    },
    //委托样品总数:样品表所有
    getEntrustedTotalData(){
      let sql1 = "select SUM(yang_pin_zong_shu) as sum from t_lhypb where YEAR(create_time_) = YEAR('"+this.NowTime1+"')" 
      curdPost('sql',sql1).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.EntrustedTotal = 0
        }else(
          this.EntrustedTotal = data[0].sum
        )
        // this.EntrustedTotal = data[0].sum
      })
      
    },
    //委托样品总数:样品表内部
    getEntrustedTotalDataN(){
      let sql1 = "select SUM(a.yang_pin_zong_shu) as sum from (select t_lhypb.* from t_lhypb LEFT JOIN t_lhwtsqb on t_lhypb.wei_tuo_dan_hao_ = t_lhwtsqb.wei_tuo_bian_hao_ where t_lhwtsqb.wei_tuo_lei_xing_ != '客户委托') as a where YEAR(create_time_) = YEAR('"+this.NowTime1+"')" 
      curdPost('sql',sql1).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.EntrustedTotalN = 0
        }else(
          this.EntrustedTotalN = data[0].sum
        )
        // this.EntrustedTotal = data[0].sum
      })
      
    },
    //委托样品总数:样品表外部
    getEntrustedTotalDataW(){
      let sql1 = "select SUM(a.yang_pin_zong_shu) as sum from (select t_lhypb.* from t_lhypb LEFT JOIN t_lhwtsqb on t_lhypb.wei_tuo_dan_hao_ = t_lhwtsqb.wei_tuo_bian_hao_ where t_lhwtsqb.wei_tuo_lei_xing_ = '客户委托') as a where YEAR(create_time_) = YEAR('"+this.NowTime1+"')" 
      curdPost('sql',sql1).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.EntrustedTotalW = 0
        }else(
          this.EntrustedTotalW = data[0].sum
        )
        // this.EntrustedTotal = data[0].sum
      })
      
    },
    //待收样数量:已委托，未收到
    getNotReceivedData(){
      let sql2= "select SUM(yang_pin_zong_shu) as sum from  t_lhypb WHERE YEAR(song_jian_shi_jia)= YEAR('"+this.NowTime1+"') and parent_id_ in(select id_ from t_lhwtsqb where wei_tuo_zhuang_ta = '待样品接收')" 
      curdPost('sql',sql2).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.NotReceiveNumber = 0
        }else(
          this.NotReceiveNumber = data[0].sum
        )
        // this.NotReceiveNumber = data[0].sum

      })
  },
     //已经收样
     getReceivedData(){
      let sql3= "select SUM(yang_pin_zong_shu) as sum from t_lhypb where jie_yang_zhuang_t='已接收' and YEAR(create_time_) = YEAR('"+this.NowTime1+"')" 
      curdPost('sql',sql3).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.ReceiveNumber = 0
        }else(
          this.ReceiveNumber = data[0].sum
        )
      })

     },
     //待检样品数量
     getStagingNumberData(){
      // let sql6 = "select * from t_mjypdjb"
      let sql6= "select SUM(yang_pin_shu_lian) as sum from t_lhypdjb where liu_zhuan_zhuang_ = '待检' and YEAR(create_time_) = YEAR('"+this.NowTime1+"')" 
      curdPost('sql',sql6).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.StagingNumber = 0
        }else(
          this.StagingNumber = data[0].sum
        )
        // this.StagingNumber =data[0].sum
      })
      },
     //不合格样品数量
     getUnqualifiedData(){
      let sql4= "select SUM(yang_pin_shu_lian) as sum from t_lhypdjb where yan_shou_jie_guo_ = '残缺' and YEAR(create_time_) = YEAR('"+this.NowTime1+"')" 
      curdPost('sql',sql4).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.UnqualifiedNumber = 0
        }else(
          this.UnqualifiedNumber = data[0].sum
        )
        // this.UnqualifiedNumber =data[0].sum

      })
     },
     //留样样品数量
     getStayData(){
      let sql5= "select SUM(yang_pin_shu_lian) as sum from t_lhypdjb where shi_fou_liu_yang_!= '否' and YEAR(create_time_) = YEAR('"+this.NowTime1+"')" 
      curdPost('sql',sql5).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.RetentionNumber = 0
        }else(
          this.RetentionNumber = data[0].sum
        )
        // this.RetentionNumber = data[0].sum

      })
     },
     //样品完成检测数量
     getSuccessData(){
      let sql6= "select SUM(t_lhypdjb.yang_pin_shu_lian) as num from t_lhypdjb LEFT JOIN t_lhjcbgb on t_lhypdjb.yang_ben_bian_hao = t_lhjcbgb.yang_pin_bian_hao where t_lhjcbgb.zhuang_tai_ = '待发放' or  t_lhjcbgb.zhuang_tai_ = '已完成' and YEAR(t_lhypdjb.create_time_) = YEAR('"+this.NowTime1+"')" 
      curdPost('sql',sql6).then(response => { 
        let data = response.variables.data
        if(data[0]===null){
          this.SuccessNumber = 0
        }else(
          this.SuccessNumber = data[0].num
        )
        // this.SuccessNumber = data[0].num

      })
     }

  },
 


}
</script>

<style lang="scss" scoped>
.baseBgColor{
    width: 100%;
    height: 80px;
    background-color: rgba(6, 30, 93, 0.5);
    display: flex;
    .totalNumber,
    .notReceived,
    .received,
    .staging,
    .unqualified,
    .retention
    {
        border-right: 1px solid #00db95;
        flex: 1;
        text-align: center;
        font-size: 16px;
        display: flex;
        flex-direction:cloumn; 
        flex-wrap :wrap; 
        align-content: space-around;

        margin: 10px 0px;
        position:relative;
        text-align:center;
        display:table-cell;
        vertical-align:middle;
        .number{
          display:inline-block;
          margin: 15px 0px 0px 0px;
        }
      }
    

}
</style>