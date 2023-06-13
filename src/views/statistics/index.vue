<template>
  <dv-full-screen-container>
    <el-scrollbar class="screen" ref="scrollDiv" >
    <!-- :style="{height:height}" -->
      <div class="statistics">
        <div class="editDate">
           <!-- 标题装饰组件 -->
          <header-decoration />
          <!-- <div class="stitle">实验室管理看板</div> -->
          <div class="block" style="display:none">
            <span class="demonstration">开始:</span>
            <el-date-picker v-model="BeginDate" type="year" size="mini" value-format="yyyy" format="yyyy年"  style="width: 96px;"
              :clearable="false" @change="checkYear(BeginDate,'begin')" placeholder="选择日期">
            </el-date-picker>
          </div>

          <!-- <div class="block"> -->
            <!-- <span class="demonstration">查询年度:</span> -->
            <!-- <el-date-picker v-model="endDate" type="year" size="mini" value-format="yyyy" format="yyyy年"  :clearable="false" style="width: 96px;"
              @change="checkYear(endDate,'end')" placeholder="选择日期"> -->
                <!-- <el-date-picker
                  v-model="endDate"
                  type="year"
                  value-format="yyyy"
                  @change="checkYear(endDate,'end')"
                  placeholder="选择年">
                </el-date-picker> -->
            <!-- </el-date-picker> -->
          <!-- </div> -->
          <div
            style="width: 12%;
            height:2.825rem;
            line-height: 2.825rem;
            text-align:center;
            float: left;
            margin: -3% 0 0 3%;
            color: #000 !important;" >
            <el-date-picker
              v-model="endDate"
              type="year"
              value-format="yyyy"
              @change="checkYear(endDate,'end')"
              placeholder="选择年">
            </el-date-picker>
            <!-- <el-button type="primary" size="mini" plain @click="selectAll">
              查询
            </el-button> -->
            <!-- <el-date-picker
              class="chooseMonth"
              v-model="NowTime1"
              type="month"
              @change="changeTime1"
              format="yyyy-MM"
              value-format="yyyy-MM"
              placeholder="请选择时间">
            </el-date-picker> -->
          </div>

          <!-- <div class="block">

          </div> -->

          <!-- <div class="goBackButton" @click.prevent="goBack()" >
            返回
          </div> -->
          <div
            @click.prevent="rollstop()"
            style="width: 8%;
            height:2.825rem;
            line-height: 2.825rem;
            text-align:center;
            float: right;
            margin: -3% 12% 0 0;"
            v-if="rollup">
            <dv-border-box-8>暂停</dv-border-box-8>
          </div>
          <div
            @click.prevent="rollcontinue()"
            style="width: 8%;
            height:2.825rem;
            line-height: 2.825rem;
            text-align:center;
            float: right;
            margin: -3% 12% 0 0;"
            v-else>
            <dv-border-box-8>继续</dv-border-box-8>
          </div>
          <div
            @click.prevent="goBack()"
            style="width: 8%;
            height:2.825rem;
            line-height: 2.825rem;
            text-align:center;
            float: right;
            margin: -3% 3% 0 0;" >
            <dv-border-box-8>返回</dv-border-box-8>
          </div>

        </div>
        <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" ><div class="ttitle">质量方针：公正、科学、准确、高效</div></dv-border-box-7>
        <div class="congxiebox7" style="display: flex;justify-content: space-between;padding: 1.5% 0.2%;">
          <div style="width:16.4%">
            <div class="gongshiAll">
              <div class="touwidth">检测任务完成率=</div>
              <div style="margin: 0 0.2%;">
                <div class="gongshiXian">完成检测项目数量</div>
                <div style="text-align:center;font-size:12px;padding-top: 6%;">有效检测任务总数</div>
              </div>
              <div>×100%</div>
            </div>
            <div class="mubiaozhi">当前目标值：{{quality[0].val}}</div>
          </div>
          <div style="width:21.4%">
            <div class="gongshiAll">
              <div class="touwidth">检测报告差错率=</div>
              <div style="margin: 0 0.2%;">
                <div class="gongshiXian">统计期内检测数据的差错次数</div>
                <div style="text-align:center;font-size:12px;padding-top: 6%;">统计期内检测报告总数</div>
              </div>
              <div>×100%</div>
            </div>
            <div class="mubiaozhi">当前目标值：{{quality[1].val}}</div>
          </div>
          <div style="width:17.4%">
            <div class="gongshiAll">
              <div class="touwidth">客户满意度=</div>
              <div style="margin: 0 0.2%;">
                <div class="gongshiXian">评分得分*有效问卷数量</div>
                <div style="text-align:center;font-size:12px;padding-top: 6%;">有效问卷总分</div>
              </div>
              <div>×100%</div>
            </div>
            <div class="mubiaozhi">当前目标值：{{quality[2].val}}</div>
          </div>
          <div style="width:17.4%">
            <div class="gongshiAll">
              <div class="touwidth">投诉率=</div>
              <div style="margin: 0 0.2%;">
                <div class="gongshiXian">统计期内有效投诉项目数</div>
                <div style="text-align:center;font-size:12px;padding-top: 6%;">统计期内检测委托总数</div>
              </div>
              <div>×100%</div>
            </div>
            <div class="mubiaozhi">当前目标值：{{quality[3].val}}</div>
          </div>
          <div style="width:27.4%">
            <div class="gongshiAll">
              <div class="touwidth">投诉回复及时率=</div>
              <div style="margin: 0 0.2%;">
                <div class="gongshiXian">统计期内投诉处理完成次数</div>
                <div style="text-align:center;font-size:12px;padding-top: 6%;">统计期内有效投诉总次数</div>
              </div>
              <div>×100%</div>
            </div>
            <div class="mubiaozhi">当前目标值：{{quality[4].val}}</div>
          </div>
        </div>
        <div class="congxiebox7" v-if="pageOT">
          <div class="ttitle" style="text-align: center;">质量目标统计</div>
          <div class="componentsData" v-if="relOf">
              <s1zhiLiangMuBiao :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw" :mubiao = "quality[0].val"
              v-if="showAll || showComponents[1]" :data = "getS1renwu()"/>
              <s1jianCe :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw" :mubiao = "quality[1].val"
              v-if="showAll || showComponents[5]" :data = "getS2jianCe()" />
              <s2manYiDu :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw" :mubiao = "quality[2].val"
              v-if="showAll || showComponents[7]"  :data = "getS2manYiDu()"/>
              <s3tousu :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw" :mubiao = "quality[3].val"
              v-if="showAll || showComponents[6]" :data = "getS3tousu()"/>
              <s13shengWu :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw" :mubiao = "quality[4].val"
              v-if="showAll || showComponents[17]" :data = "getS3tousu()"/>
              <div class="clear"></div>
          </div>
        </div>
        <div class="congxiebox7" style="display:inline-block;width:49%" v-if="pageOT">
          <div class="ttitle" style="margin:2% 0;text-align: center;">人员培训与管理</div>
          <div class="componentsData" v-if="relOf">
              <s4renYuanPeiXun :height="'290%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[8]" :data = "getS4renYuanPeiXun()"/>
              <s5renYuanJianDu :height="'290%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[9]" :data = "getS5renYuanJianDu()"/>
              <!-- <div class="clear"></div> -->

          </div>
        </div>
        <div class="congxiebox7" style="display:inline-block;width:49%;float:right;" v-if="pageOT">
          <div class="ttitle" style="margin:2% 0;text-align: center;">设备维保</div>
          <div class="componentsData" v-if="relOf">
              <s7sheBeiJiaoZhun :height="'290%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[12]" :data = "getJiaoYanObjNum()"/>
              <s8sheBeiHeCha :height="'290%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[11]" :data = "gethechaObjNum()"/>
              <!-- <div class="clear"></div> -->

          </div>
        </div>
        <div class="congxiebox7" v-if="!pageOT">

          <div class="ttitle" style="text-align: center;">标准物质</div>
          <div class="componentsData" v-if="relOf">
              <s11biaoZhunWu :height="'290%'" :width="static=='row' ? '33%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[15]" :data = "getbiaozhunObjNum()"/>
              <s16bzJunZhu :height="'290%'" :width="static=='row' ? '33%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[20]" :data = "getbzJunZhujNum()"/>
              <s17bzXiBao :height="'290%'" :width="static=='row' ? '33%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[21]" :data = "getbzXiBaoObjNum()"/>
              <div class="clear"></div>
          </div>
        </div>
        <div class="congxiebox7" v-if="!pageOT">

          <div class="ttitle" style="text-align: center;">质量管理</div>
          <div class="componentsData" v-if="relOf">
              <s9neiBuZhiLiang :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[13]" :data = "getS9neiBuZhiLiang()"/>
              <s10waiBuNengLi :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[14]" :data = "getnengtliObjNum()"/>
              <s14bufuhexiang :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[18]" :data = "getS14bufuhexiang()"/>
              <s15tousu :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[19]" :data = "getS3tousu()"/>
              <s12fengXian :height="'290%'" :width="static=='row' ? '20%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[16]" :data = "getS12fengXian()"/>
              <div class="clear"></div>

          </div>
        </div>




      </div>
    </el-scrollbar>
  </dv-full-screen-container>
</template>

<script>
  //全屏展示
  import screenfull from 'screenfull'
  //大屏标题组件
  import headerDecoration from './headerDecoration'

  import s1zhiLiangMuBiao from './item/s1zhiLiangMuBiao.vue'
  import s1zhiLiang1 from './item/s1zhiLiang1.vue'
  import s1zhiLiang2 from './item/s1zhiLiang2.vue'
  import s1zhiLiang3 from './item/s1zhiLiang3.vue'

  import s1jianCe from './item/s1jianCe.vue'
  import s2manYiDu from './item/s2manYiDu.vue'
  import s3tousu from './item/s3tousu.vue'
  import s4renYuanPeiXun from './item/s4renYuanPeiXun.vue'
  import s5renYuanJianDu from './item/s5renYuanJianDu.vue'
  import s6sheBeiWeiHu from './item/s6sheBeiWeiHu.vue'
  import s7sheBeiJiaoZhun from './item/s7sheBeiJiaoZhun.vue'
  import s8sheBeiHeCha from './item/s8sheBeiHeCha.vue'
  import s9neiBuZhiLiang from './item/s9neiBuZhiLiang.vue'
  import s10waiBuNengLi from './item/s10waiBuNengLi.vue'
  import s11biaoZhunWu from './item/s11biaoZhunWu.vue'
  import s12fengXian from './item/s12fengXian.vue'
  import s13shengWu from './item/s13shengWu.vue'
  import s14bufuhexiang from './item/s14bufuhexiang.vue'
  import s15tousu from './item/s15tousu.vue'
  import s16bzJunZhu from './item/s16bzJunZhu.vue'
  import s17bzXiBao from './item/s17bzXiBao.vue'


  import none from './item/none.vue'

  import { DBData ,getConfig,getJiaoYanObj, gethechaObj, getnengliObj, getbiaozhunObj,getbiaozhunTObj,getbzJunZhuObj,getbzJunZhuTObj,getbzXiBaoObj,getbzXiBaoTObj} from './js/selectDB.js'
  import sendDatas from './sendDatas.js'
  import repostCurd from '@/business/platform/form/utils/custom/joinCURD.js'
import * as forEach from 'lodash/forEach'
  export default {
    components:{
      headerDecoration,
      none,
      s1zhiLiang1,
      s1zhiLiang2,
      s1zhiLiang3,
      s1zhiLiangMuBiao,
      s1jianCe,
      s2manYiDu,
      s3tousu,
      s4renYuanPeiXun,
      s5renYuanJianDu,
      s6sheBeiWeiHu,
      s7sheBeiJiaoZhun,
      s8sheBeiHeCha,
      s9neiBuZhiLiang,
      s10waiBuNengLi,
      s11biaoZhunWu,
      s12fengXian,
      s13shengWu,
      s14bufuhexiang,
      s15tousu,
      s16bzJunZhu,
      s17bzXiBao
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
    mixins: [sendDatas],
    mounted() {
      /*以shows是否有参数来判断， 是否需要仅显示部分子组件*/
      if(this.shows.length>0){
        this.showAll=false
        this.isShowComponents()
      }
      /* 开始及结束时间的默认设置*/
      if (!this.BeginDate && !this.endDate) {
        this.BeginDate = this.getDate(1) + ''
        this.endDate = this.getDate(0) + ''
        this.dataScope.push(this.BeginDate)
        this.dataScope.push(this.endDate)
      }
      this.getConfigData() //获取统计的配置
      this.getqualityData()

      this.timer1 = setInterval(()=>{
        this.pageOT = !this.pageOT
        console.log(this.pageOT)
      },5000)
    },
    data() {
      return {
        height:(window.screen.height-200)+"px",
        BeginDate: '',
        endDate: '',
        jiaoyanObj:[],
        hechaObj:[],
        nengliObj:[],
        biaozhunObj:[],
        biaozhunTObj:[],
        bzJunZhuObj:[],
        bzJunZhuTObj:[],
        bzXiBaoObj:[],
        bzXiBaoTObj:[],
        relData: {},
        relOf: false,
        selectEnd: '',
        selectBeg: '',
        showAll:true,
        timer: '',
        timer1: '',
        showComponents:{},//显示全部统计子组件 , 若有新增，往后累计。 供动态表单进行查阅使用。
        dataScope: [],
        colorw: '#fff',
        pageOT: true,
        rollup:true,
        quality:[
          {name: '任务及时完成率' ,val: ''},
          {name: '检测报告差错率' ,val: ''},
          {name: '客户满意度' ,val: ''},
          {name: '投诉率' ,val: ''},
          {name: '投诉处理及时率' ,val: ''}
        ]
      }
    },
     beforeDestroy() {
      if(screenfull.isFullscreen){
        screenfull.toggle()
      }
      clearInterval(this.timer);
    },
    methods: {
      /* 判断是否统计子组件中传递过来的，是否需要隐藏。若需要则进行隐藏的遍历  */
      isShowComponents(){
        /* 将参数进行显示 */
          for(let i=0;i<this.shows.length;i++){
            this.showComponents[this.shows[i]] = true
          }
      },
      getqualityData() {
        let sql='select xiang_mu_ming_,mu_biao_zhi_ from t_zlmbz'
        repostCurd('sql', sql).then(response => {
          let a = response.variables.data //结果一定存在第0个，因为只有一条数据
           this.quality.forEach((t,i)=>{
            a.forEach(e => {
              if (t.name === e.xiang_mu_ming_) {
                t.val = e.mu_biao_zhi_
              }
            });
          })
          console.log(this.quality,'546546654gsdf')
        })
      },
      /* 查询统计配置中的完成率*/
      getConfigData() {
        repostCurd('sql', getConfig()).then(response => {
          this.config = response.variables.data //结果一定存在第0个，因为只有一条数据
          this.getJiaoYanObjData(this.endDate)

        })
      },
      getJiaoYanObjData(end) {
        repostCurd('sql', getJiaoYanObj(end)).then(response => {
          this.jiaoyanObj = response.variables.data //结果一定存在第0个，因为只有一条数据
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
          // console.log(end,this.jiaoyanObj,"nmnakak")
          this.gethechaObjData(this.endDate)
        })
      },
      gethechaObjData(end) {
        repostCurd('sql', gethechaObj(end)).then(response => {
          this.hechaObj = response.variables.data //结果一定存在第0个，因为只有一条数据
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
          this.getnengliObjData(this.endDate)
        })
      },
      getnengliObjData(end) {
        repostCurd('sql', getnengliObj(end)).then(response => {
          this.nengliObj = response.variables.data //结果一定存在第0个，因为只有一条数据
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
          this.getbiaozhunObjData(this.endDate)
        })
      },
      getbiaozhunObjData(end) {
        repostCurd('sql', getbiaozhunObj(end)).then(response => {
          this.biaozhunObj = response.variables.data //结果一定存在第0个，因为只有一条数据
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
          // console.log(this.biaozhunObj,'8888')
          repostCurd('sql', getbiaozhunTObj(end)).then(response => {
            this.biaozhunTObj = response.variables.data //结果一定存在第0个，因为只有一条数据
            // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
            // console.log(this.biaozhunTObj,'8888')
            this.getbzJunZhuObjData(this.endDate)
          })
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
        })
      },
      getbzJunZhuObjData(end) {
        repostCurd('sql', getbzJunZhuObj(end)).then(response => {
          this.bzJunZhuObj = response.variables.data //结果一定存在第0个，因为只有一条数据
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
          // console.log(this.biaozhunObj,'8888')
          repostCurd('sql', getbzJunZhuTObj(end)).then(response => {
            this.bzJunZhuTObj = response.variables.data //结果一定存在第0个，因为只有一条数据
            // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
            // console.log(this.biaozhunTObj,'8888')
            this.getbzXiBaoObjData(this.endDate)
          })
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
        })
      },
      getbzXiBaoObjData(end) {
        repostCurd('sql', getbzXiBaoObj(end)).then(response => {
          this.bzXiBaoObj = response.variables.data //结果一定存在第0个，因为只有一条数据
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
          // console.log(this.biaozhunObj,'8888')
          repostCurd('sql', getbzXiBaoTObj(end)).then(response => {
            this.bzXiBaoTObj = response.variables.data //结果一定存在第0个，因为只有一条数据
            // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
            // console.log(this.biaozhunTObj,'8888')
            this.getData(this.BeginDate, this.endDate, true, this.dataScope)
          })
          // this.getData(this.BeginDate, this.endDate, true, this.dataScope)
        })
      },
      /* 通过拼接的sql进行查询全部数据*/
      getData(beg, end, of, scope) {
        // console.log(2222,DBData(beg, end, scope))
        repostCurd('sql', DBData(beg, end, scope)).then(response => {
          if(typeof response.variables.data[0] === "undefined"){
            this.relData = [0] //结果一定存在第0个，因为只有一条数据

          }else{
            this.relData = response.variables.data[0] //结果一定存在第0个，因为只有一条数据

          }
          this.relOf = of
          // console.log(beg, end, of, response,this.relData,'getdata')
        })
      },
      /* 查询全部*/
      selectAll() {
        /* 上次查询时间不等于当次查询时间，    开始时间不能等于结束时间， 则开始查询。*/
        if (this.selectEnd != this.endDate) {
        // if ((this.selectEnd != this.endDate || this.selectBeg != this.BeginDate) && this.endDate != this.BeginDate && this.endDate > this.BeginDate) {
          // this.getData(this.BeginDate, this.endDate, false, this.dataScope)
          this.getConfigData()
          this.getqualityData()

          // this.$forceUpdate();

          // this.selectEnd = this.endDate
          // this.selectBeg = this.BeginDate
          /* 延迟刷新*/
          // console.log('111111fffff')
          this.relOf = true;
          this.timer = setTimeout(() => {
            this.relOf = false
            clearTimeout(this.timer)
          }, 0)

          // this.timer = setInterval(() => {
          //   if (!this.relOf) {
          //     this.relOf = true
          //     clearInterval(this.timer)
          //   }
          // }, 100);
        }
        // else if (this.endDate == this.BeginDate) {
        //   this.$message({
        //     showClose: true,
        //     message: '年份相等无法进行查询对比',
        //     type: 'warning'
        //   });
        // } else if(this.endDate < this.BeginDate){
        //   this.$message({
        //     showClose: true,
        //     message: '结束时间不得小于开始时间',
        //     type: 'warning'
        //   });
        // }
      },
      /* 年份不得大于当前年份*/
      checkYear(year, data) {
        // let that = this
        // that.dataScope.length = 0
        // if(that.BeginDate != '' && that.endDate != ''){
        //   let poor = Number(that.endDate) - Number(that.BeginDate)
        //   for (let i = 0; i <= poor; i++) {
        //     let element = Number(that.BeginDate) + i;
        //     that.dataScope.push(element+'')
        //   }
        // }
        if (Number(year) > Number(this.getDate(0))) {
          // console.log(data,'3y87sdvfsdf')
          data == 'end' ?
            this.endDate = this.getDate(0) + '' :
            this.BeginDate = this.getDate(0) + ''

          this.$message({
            showClose: true,
            message: '年份不得大于当前年份',
            type: 'warning'
          });

        }
        this.selectAll()
        // else(
        //   this.endDate = Number(year)
        // )
        //   this.$forceUpdate();

      },
      /* 获取当前年份*/
      getDate(year) {
        year = year || 0
        let nowDate = new Date();
        return nowDate.getFullYear() - year;
      },
      allView(){
        screenfull.request() //默认显示全屏
      },
      goBack(){
        this.$router.back(-1)
        clearInterval(this.timer1);
      },
      rollcontinue(){
        this.timer1 = setInterval(()=>{
          this.pageOT = !this.pageOT
          console.log(this.pageOT)
        },5000)
        this.rollup=true
      },
      rollstop(){
        clearInterval(this.timer1);
        this.rollup=false
      }
    },
    created() {
      //时间
      // this.currentTime()
      if(screenfull.isEnabled && !screenfull.isFullscreen){
      this.allView()

      }
    }
  }
</script>
<style lang="scss">
  .statistics {
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
    background-image: url('~@/assets/images/screen/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
    // background-color: #f9ffff;
    display: flex;
    flex-direction:column;
    align-items: stretch;

  //  .headerContent{
  //   flex: 1;

  //   // background-color: rgb(99, 12, 41);


  //  }
  }
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .goBackButton{
    width: 2%;
    position: absolute;
    right: 0;
  }
  #dv-border-box-8{
    border: none;
  }
  .stitle{
    text-align: center;
    font-size: 150%;
    // font-family: PingFangSC-Semibold, sans-serif;
    font-weight: 600;
    margin: 0;
  }
  .ttitle{
    font-size: 120%;
    font-weight: 600;
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
</style>
<style lang="scss">
.el-year-table .today .cell {
  color: #606266 !important;
  font-weight: 100 !important;
}

</style>
