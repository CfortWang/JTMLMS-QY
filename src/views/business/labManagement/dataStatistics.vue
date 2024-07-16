<template>
    <div class="screen" ref="scrollDiv" >
      <div class="statistics">
        <div class="editDate" style="background-color: rgba(0,0,0,0);display: block;width: 100%;height: 10%;">
          <div 
            style="width: 100%;
            height:45%;
            line-height: 45%;
            text-align:center;
            float: left;
            margin: 2% 0 1% 1%;
            font-size: 100%;
            color: #fff !important;
            align-items: center;
            display:flex" >
            <div style="color:#000;">
              年份：
            </div>
            <el-date-picker
                v-model="endDate"
                type="year"
                value-format="yyyy"
                format="yyyy"
                placeholder="统计年度"
                style="width: 120px;background-color: rgba(0,0,0,0);"
                :readonly="false"
                :editable="true"
                :clearable="false"
                @change="checkYear(endDate,'end')"
            />
          </div>
        </div>
        <div>
            <div v-for="(item,i) in requestData" :key="i">
                <pie-chart :height="'200%'" :key="i+i+1" :id="i+i+1"  :colorw = "colorw" style="box-shadow:none;width:100%;" :title="item.name"
                    v-if="showAll || showComponents[i+i+1]" v-model="item.totally"/>
                <bar-chart :height="'500%'" :key="i+i+2" :id="i+i+2" :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction" style="box-shadow:none;width:100%;"  :title="item.name"
                    v-if="showAll || showComponents[i+i+2]" v-model= "item.groups"/>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
  //全屏展示
  import screenfull from 'screenfull'
  import dataMock from './constants/simulated'
  import PieChart from './components/pieChart.vue'
  import BarChart from './components/barChart.vue'
  import { labsDashBoard } from '@/api/platform/spectaculars/lab'

  export default {
    components:{
      PieChart,
      BarChart
    },
    props:{
        shows:{ //传入的内容显示序号
            type: Array,
            default:() => []
        },
        static:{ //显示类型，默认为横向   ,作为表单统计图的外部引用为 line
            type: String,
            default:'row'
        }
    },
    created() {
        this.getConfigData(this.endDate)
    },
    mounted() {
      /*以shows是否有参数来判断， 是否需要仅显示部分子组件*/
      if(this.shows.length>0){
        this.showAll=false
        this.isShowComponents()
      }
      /* 开始及结束时间的默认设置*/
    //   if (!this.BeginDate && !this.endDate) {
    //     this.BeginDate = this.getDate(1) + ''
    //     this.endDate = this.getDate(0)
    //     this.dataScope.push(this.BeginDate)
    //     this.dataScope.push(this.endDate)
    //   }   
    },
    updated() {
        //this.drawLine();
        this.allEcharts.forEach((i) => {
          i.resize();
        });

    },
    data() {
      const d = new Date()
      return {
        direction:'x',
        height:(window.screen.height-200)+"px",
        BeginDate: '',
        endDate: d.toJSON().slice(0, 4),
        relOf: false,
        showAll:true,
        showComponents:{},//显示全部统计子组件 , 若有新增，往后累计。 供动态表单进行查阅使用。
        dataScope: [],
        colorw: '#000',
        quality:[],
        allEcharts:[],
        requestData:[]
      }
    },
    beforeDestroy() {
      if(screenfull.isFullscreen){
        screenfull.toggle()
      }
    },
    methods: {
      /* 判断是否统计子组件中传递过来的，是否需要隐藏。若需要则进行隐藏的遍历  */
      isShowComponents(){
        /* 将参数进行显示 */
          for(let i=0;i<this.shows.length;i++){
            this.showComponents[this.shows[i]] = true
          }
      },
      getNextMonth(date) {
            let arr = date.split('-');
            let year = arr[0]; //获取当前日期的年份
            let month = arr[1]; //获取当前日期的月份
            let year2 = year;
            let month2 = parseInt(month) + 1;
            if (month2 == 13) {
                year2 = parseInt(year2) + 1;
                month2 = 1;
            }
            month2=month2>9?month2:'0'+month2
            let t2 = year2 + '-' +  month2;
            return t2;
      },
      /* 查询统计配置中的完成率*/
      getConfigData(end) {
        let that = this
        // dataMock
        labsDashBoard({year: this.endDate}).then(res=>{
            this.requestData = res.data
        })
      },
      /* 查询全部*/
      selectAll() {
        this.getConfigData(this.endDate)
        this.relOf = true
      },
      checkYear(year, data) {
        this.selectAll()
      },
      /* 获取当前年份*/
      getDate(year) {
        year = year || 0
        let nowDate = new Date();
        let date = new Date(new Date().setDate(1)+ 31 * 24 * 60 * 60 * 1000);
        let month = date.getMonth()+1;
        let m1 = nowDate.getMonth()+1
        let month1 = m1 < 10 ? "0" +m1:nowDate.getMonth()+1;
        month = month<10 ? "0"+month : ""+month;
        return [nowDate.getFullYear() - year + "-01",nowDate.getFullYear() - year + "-" + month1];
      },
   
      goBack(){
        this.$router.back(-1)
        this.fadeinout = true
      }
    }
  }
</script>


<style lang="scss" scoped>
  .statistics {
    height: 100%;
    color: #fff;
    .editDate{
      display: contents;
      overflow: hidden;
      background-color:rgb(249, 255, 255);
      position: relative;

    }
    .block{
      float: left;
      font-size: 14px;
     }
  }
  #dv-full-screen-container {
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
    display: flex;
    flex-direction:column;
    align-items: stretch;
  }
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .goBackButton{
    width: 2%;
    position: absolute;
    right: 0;
  }
  .shiyankanbanfanhui{
    border: none;
    .border-box-content{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .stitle{
    text-align: center;
    font-size: 150%;
    font-weight: 600;
    margin: 0;
  }
  .ttitle{
    font-size: 120%;
    font-weight: 600;
    height: 2%;
    margin: 1% 0;
  }
  .screen{
    height: 100%;
    
    margin: 0 0.5%;
  }
  .clear{ clear: both; }
  .congxiebox7{
    background-color: rgba(6, 30, 93, 0.5);
    box-shadow: rgb(128 128 128 / 30%) 0px 0px 40px inset;
    border: 1px solid rgba(128, 128, 128, 0.3);
    margin: 1% 0 0 0 ;
    font-size: 12px;
  }
  .gongshiAll{
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 20%;
    .touwidth{
      width: 30%;
      text-align:right;
    }
    .gongshiXian{
      border-bottom: #fff solid 2px;
      padding-bottom: 6%;
      text-align:center;
      font-size: 12px;
    }
  }
  .mubiaozhi{
    text-align: center;
    margin-top: 3%;
  }
  .nullDate{
    height: 100%;
    text-align: center;
    line-height: 100%;
    font-size: 6vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .componentsData{
    height: 92%;
  }
  .nullDate1{
    height: 50%;
    width: 25%;
    display: inline-block;
    text-align: center;
    line-height: 50%;
    font-size: 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<style lang="scss">
.el-year-table .today .cell {
  color: #606266 !important;
  font-weight: 100 !important;
}
 
</style>
<style lang="scss" scoped>

::v-deep .el-input__inner {
  background-color: rgba(0,0,0,0);
  color: #000;
}
::v-deep .el-dialog__body{
  height:80%;
  width:80%;
}
.fade-in {
  animation: fadeIn 1s linear forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fade-out {
  animation: fadeOut 1s linear forwards;
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
