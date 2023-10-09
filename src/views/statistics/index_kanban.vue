<template>
  <!-- <dv-full-screen-container> -->
    <el-scrollbar class="screenshiyanshikanban" ref="scrollDiv" >
    <!-- :style="{height:height}" -->
      <div class="statistics" v-on:mouseenter="rollstop" v-on:mouseleave="rollcontinue">
        <div class="editDate">
           <!-- 标题装饰组件 -->
          <!-- <header-decoration />  -->
          <!-- <div class="stitle">实验室管理看板</div> -->
          <!-- <div class="block" style="display:none">
            <span class="demonstration">开始:</span>
            <el-date-picker v-model="BeginDate" type="year" size="mini" value-format="yyyy" format="yyyy年"  style="width: 96px;"
              :clearable="false" @change="checkYear(BeginDate,'begin')" placeholder="选择日期">
            </el-date-picker>
          </div> -->

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
            style="width: 98%;
            height:2.825rem;
            line-height: 2.825rem;
            text-align:center;
            float: left;
            margin: 1% 0% 0 1%;
            color: #fff !important;
            align-items: center;
            display:flex" >
            <!-- <div>
              部门：
            </div>
            <el-select v-model="bumen" clearable @change="selectAll()" placeholder="请选择部门">
              <el-option
                v-for="item in quality"
                :key="item.id_"
                :label="item.name_"
                :value="item.id_">
              </el-option>
            </el-select> -->
            <!-- <div>
              月份：
            </div> -->
            <el-date-picker
              v-model="endDate"
			  style="width:100%"
              type="monthrange"
              align="right"
              unlink-panels
              format="yyyy 年 MM 月"
              value-format="yyyy-MM"
              @change="checkYear(endDate,'end')"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
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
          <!-- <div 
            @click.prevent="rollstop()" 
            style="width: 8%;
            height:2.825rem;
            line-height: 2.825rem;
            text-align:center;
            float: right;
            margin: -3% 17.1% 0 0;" 
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
            margin: -3% 17.1% 0 0;" 
            v-else>
            <dv-border-box-8>继续</dv-border-box-8>
          </div> -->
          <!-- <div 
            @click.prevent="goBack()" 
            style="width: 8%;
            height:2.825rem;
            line-height: 2.825rem;
            text-align:center;
            float: right;
            margin: -3% 17.1% 0 0;" >
            <dv-border-box-8>返回</dv-border-box-8>
          </div> -->
          
        </div>
        <!-- <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" ><div class="ttitle">质量方针：公正、科学、准确、高效</div></dv-border-box-7>
        <div class="congxiebox7" style="display: flex;justify-content: space-between;padding: 1.5% 0.2%;">
          <div style="width:16.4%">
            <div class="gongshiAll">
              <div class="touwidth">检测任务完成及时率=</div>
              <div style="margin: 0 0.2%;">
                <div class="gongshiXian">及时完成检测项目数量</div>
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
            <div class="mubiaozhi">当前目标值：{{quality[3].val}}</div>relOf
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
        </div> -->
        <!-- <div class="congxiebox7"  v-if="pageOT==1&&bumen!=''">
          <div class="ttitle" style="text-align: center;">部门质量目标与质量指标</div>
          <div class="componentsData" v-if="relOf"> -->
              <!-- 
              <s1jianCe :height="'290%'" :width="static=='row' ? '19.5%': '100%'" :colorw = "colorw" :mubiao = "quality[1].val"
              v-if="showAll || showComponents[5]" :data = "getS2jianCe()" />
              <s3tousu :height="'290%'" :width="static=='row' ? '19.5%': '100%'" :colorw = "colorw" :mubiao = "quality[3].val"
              v-if="showAll || showComponents[6]" :data = "getS3tousu()"/>
              <s13shengWu :height="'290%'" :width="static=='row' ? '19.5%': '100%'" :colorw = "colorw" :mubiao = "quality[4].val"
              v-if="showAll || showComponents[17]" :data = "getS3tousu()"/> -->
              <!-- <s11biaoZhunWucol :height="'390%'" :width="static=='row' ? '100%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[15]" :data = "getfenzuZLZBObjNum()"/> -->
              <!-- <div class="clear"></div>
          </div>
        </div> -->
        <!-- <div class="congxiebox7" style="overflow:hiddien" v-if="pageOT==1&&bumen!=''">
          <div class="ttitle" style="margin:2% 0;text-align: center;">质量目标与质量指标公式</div>
          <div class="componentsData" v-if="relOf"> -->
              <!-- <dv-scroll-board style="height:350px;white-space:pre-wrap"
                v-if="showAll || showComponents[23]||tableData1.data.length>0"
                :config="tableData1" -->
              <!-- /> -->
              <!-- <div class="clear"></div>

          </div>
        </div> -->
        <!-- <div class="congxiebox7" style="display:inline-block;width:79%;" v-if="pageOT==1&&bumen==''">
          <div class="ttitle" style="margin:2% 0;text-align: center;">各部门质量目标与质量指标</div>
          <div class="componentsData" v-if="relOf"> -->
              <s11biaoZhunWu :height="'290%'" :width="static=='row' ? '100%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[15]" :data = "getyangPinCaiJiObjNum()"/>
              <!-- <div class="clear"></div>

          </div>
        </div>
        <div class="congxiebox7" style="display:inline-block;width:19%;float:right;overflow:hiddien" v-if="pageOT==1&&bumen==''">
          <div class="ttitle" style="margin:9% 0;text-align: center;">质量目标与质量指标总计</div>
          <div class="componentsData" v-if="relOf">
              <dv-scroll-board style="height:835px;"
                v-if="showAll || showComponents[22]||tableData.data.length>0"
                :config="tableData"
              />
              
              <div class="clear"></div>

          </div>
        </div> -->
        
        <!-- <div class="congxiebox7" style="display:inline-block;width:49%;" v-if="pageOT==2">
          <div class="ttitle" style="text-align: center;">人员培训与管理</div>
          <div class="componentsData" v-if="relOf"> -->
            <s4renYuanPeiXun :height="'250%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[8]" :data = "getS4renYuanPeiXun()"/>
            <s5renYuanJianDu :height="'250%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[9]" :data = "getS5renYuanJianDu()"/>
              <!-- <s16bzJunZhu :height="'290%'" :width="static=='row' ? '33%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[20]" :data = "getbzJunZhujNum()"/>
              <s17bzXiBao :height="'290%'" :width="static=='row' ? '33%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[21]" :data = "getbzXiBaoObjNum()"/>
              <div class="clear"></div> -->
          <!-- </div>
        </div> -->
        <!-- <div class="congxiebox7" style="display:inline-block;width:49%;float:right;" v-if="pageOT==2">
          <div class="ttitle" style="text-align: center;">设备维保</div>
          <div class="componentsData" v-if="relOf"> -->
            <s7sheBeiJiaoZhun :height="'250%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[12]" :data = "getJiaoYanObjNum()"/>
              <s8sheBeiHeCha :height="'250%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[11]" :data = "gethechaObjNum()"/>
              <!-- <div class="clear"></div> -->
          <!-- </div>
        </div>
         <div class="congxiebox7" v-if="pageOT==2">

          <div class="ttitle" style="text-align: center;">质量管理</div>
          <div class="componentsData" v-if="relOf"> -->
              <s9neiBuZhiLiang :height="'250%'" :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[13]" :data = "getS9neiBuZhiLiang()"/>
              <s10waiBuNengLi :height="'250%'" :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[14]" :data = "getnengtliObjNum()"/>
              
              <s15tousu :height="'250%'" :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[19]" :data = "getS3tousu()"/>
              <s12fengXian :height="'250%'" :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[16]" :data = "getS12fengXian()"/>
              <!-- <div class="clear"></div>
          </div>
        </div> 
        <div class="congxiebox7" style="display:inline-block;width:49%;" v-if="pageOT==2">
          <div class="ttitle" style="text-align: center;">内审计划</div>
          <div class="componentsData" v-if="relOf"> -->
             <s2manYiDu :height="'250%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw" 
              v-if="showAll || showComponents[7]"  :data = "getS2manYiDu()"/>
            <s14bufuhexiang :height="'250%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[18]" :data = "getS14bufuhexiang()"/>
          <!-- </div>
        </div>
        <div class="congxiebox7" style="display:inline-block;width:49%;float:right;" v-if="pageOT==2">
          <div class="ttitle" style="text-align: center;">管审计划</div>
          <div class="componentsData" v-if="relOf"> -->
            <s1zhiLiangMuBiao :height="'250%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw" 
              v-if="showAll || showComponents[1]" :data = "getS1renwu()"/>
              <s16bzJunZhu :height="'250%'" :width="static=='row' ? '50%': '100%'" :colorw = "colorw"
              v-if="showAll || showComponents[20]" :data = "getbzJunZhujNum()"/>
          <!-- </div>
        </div>
        -->



      </div>
    </el-scrollbar>
  <!-- </dv-full-screen-container> -->
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
  import s11biaoZhunWu from './item/s11biaoZhunWuCol2.vue'
  import s11biaoZhunWucol from './item/s11biaoZhunWuCol.vue'
  
  import s12fengXian from './item/s12fengXian.vue'
  import s13shengWu from './item/s13shengWu.vue'
  import s14bufuhexiang from './item/s14bufuhexiangCol.vue'
  import s15tousu from './item/s15tousu.vue'
  import s16bzJunZhu from './item/s16bzJunZhuCol2.vue'
  import s17bzXiBao from './item/s17bzXiBao.vue'


  import none from './item/none.vue'

  import { DBData ,getConfig,getJiaoYanObj, gethechaObj, getnengliObj,getkangningyangpinObj,getgaijinxiangObj,getbufuheObj,getguanshenObj,getneishenObj,getfengxianObj,getyingjiObj,getneibuObj,getwaibuObj,gethechaMGObj,getJiaoYanMGObj,getgangqianpeixunObj,getzaigangrenyuanObj,getfenzuZLZBObj,getzongZLMBObj,getzhiliangzhibiaotitleObj, getyangPinCaiJiObj,getbiaozhunTObj,getbzJunZhuObj,getbzJunZhuTObj,getbzXiBaoObj,getbzXiBaoTObj} from './js/selectDB.js'
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
      s17bzXiBao,
      s11biaoZhunWucol
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
    created() {
      //时间
      // this.currentTime()
      this.getqualityData()
    //   if(screenfull.isEnabled && !screenfull.isFullscreen){
    //     this.allView()
        
    //   }
    },
    provide(){ return{ rollcontinue:this.rollcontinue,rollstop:this.rollstop } },
    mounted() {
      /*以shows是否有参数来判断， 是否需要仅显示部分子组件*/
      if(this.shows.length>0){
        this.showAll=false
        this.isShowComponents()
      }
      /* 开始及结束时间的默认设置*/
      if (!this.BeginDate && !this.endDate) {
        this.BeginDate = this.getDate(1) + ''
        this.endDate = this.getDate(0)
        // console.log(this.endDate)
        this.dataScope.push(this.BeginDate)
        this.dataScope.push(this.endDate)
      }
       //获取统计的配置
      
      // if(this.buhegelvObj.length>0){
        this.timer1 = setInterval(()=>{
          if(this.pageOT>=2){
            this.pageOT=1
          }else{
            this.pageOT = this.pageOT + 1
          }
          // console.log(this.pageOT)
        },8000)
      // }
      
    },
    data() {
      return {
        height:(window.screen.height-200)+"px",
        BeginDate: '',
        endDate: '',
        jiaoyanObj:[],
        jiaoyanMGObj:[],
        hechaObj:[],
        hechaMGObj:[],
        waibuObj:[],
        neibuObj:[],
        yingjiObj:[],
        fengxianObj:[],
        neishenObj:[],
        guanshenObj:[],
        bufuheObj:[],
        gaijinxiangObj:[],
        nengliObj:[],
        buhegelvObj:[],
        zhiliangzhibiaotitle:[],
        biaozhunTObj:[],
        bzJunZhuObj:[],
        bzJunZhuTObj:[],
        bzXiBaoObj:[],
        bzXiBaoTObj:[],
        fenzuzlmb:[],
        zaigangrenyuan:[],
        gangqianpeixun:[],
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
        pageOT: 1,
        rollup:true,
        idsStr:'',
        quality:[],
        bumen:'',
        tableNum:[],
        tableData:{
          header: ['<span style="font-size:16px;height:53px">质量指标</span>', '<span style="font-size:16px;height:53px">百分比/数量</span>'],
          rowNum: 10,
          columnWidth: [600, 400],
          align: ['left','right'],
          data: [
            ['行1列1', '行1列2', '行1列3'],
          ]
        },
        tableData1:{
          header: ['<span style="font-size:16px;height:53px">质量指标</span>','<span style="font-size:16px;height:53px">计算公式</span>', '<span style="font-size:16px;height:53px">指标限值</span>'],
          rowNum: 5,
          columnWidth: [500,700, 200],
          align: ['left','left','right'],
          data: [
            ['行1列1', '行1列2', '行1列3'],
          ]
        }
      }
    },
     beforeDestroy() {
    //   if(screenfull.isFullscreen){
    //     screenfull.toggle()
    //   }
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
        let pos = this.$store.getters.level.second?this.$store.getters.level.second:this.$store.getters.level.first
        let sql="select id_,name_ from ibps_party_entity where name_ like '%组' and PATH_ like '%"+pos+"%'"
        repostCurd('sql', sql).then(response => {
          // console.log(sql)
          let a = response.variables.data //结果一定存在第0个，因为只有一条数据
          this.quality = a
          // for (let i = 0; i < this.quality.length; i++) {
          //   let a = {}
          //   a.value = this.quality[i].id_
          //   a.label = this.quality[i].name_
          //   this.bumen.push(a)
          // }
          this.idsStr = this.quality.map(function(obj,index){
              return obj.id_;
          }).join(",");
          if(this.bumen != ''){
            this.getConfigData(this.endDate,this.bumen)
          }else{
            this.getConfigData(this.endDate,this.idsStr)
          }
        })
      },
      /* 查询统计配置中的完成率*/
      getConfigData(end,info) {
        let that = this
        repostCurd('sql', getConfig()).then(response => {
          that.config = response.variables.data //结果一定存在第0个，因为只有一条数据
          repostCurd('sql', getyangPinCaiJiObj(end,info)).then(response1 => {
            that.buhegelvObj = response1.variables.data 
            repostCurd('sql', getzhiliangzhibiaotitleObj(end,info)).then(response2 => {
              that.zhiliangzhibiaotitle = response2.variables.data
              repostCurd('sql', getzongZLMBObj(end,info)).then(response3 => {
                that.tableNum = response3.variables.data 
                repostCurd('sql', getfenzuZLZBObj(end,info)).then(response4 => {
                  that.fenzuzlmb = response4.variables.data 
                  repostCurd('sql', getzaigangrenyuanObj(end,info)).then(response5 => {
                    that.zaigangrenyuan = response5.variables.data 
                    repostCurd('sql', getgangqianpeixunObj(end,info)).then(response6 => {
                      that.gangqianpeixun = response6.variables.data 
                      repostCurd('sql', getJiaoYanObj(end,info)).then(response7 => {
                        that.jiaoyanObj = response7.variables.data
                        repostCurd('sql', getJiaoYanMGObj(end,info)).then(response8 => {
                          that.jiaoyanMGObj = response8.variables.data
                          repostCurd('sql', gethechaObj(end,info)).then(response9 => {
                            that.hechaObj = response9.variables.data
                            repostCurd('sql', gethechaMGObj(end,info)).then(response10 => {
                              that.hechaMGObj = response10.variables.data
                              repostCurd('sql', getwaibuObj(end,info)).then(response11 => {
                                that.waibuObj = response11.variables.data
                                repostCurd('sql', getneibuObj(end,info)).then(response12 => {
                                  that.neibuObj = response12.variables.data
                                  repostCurd('sql', getyingjiObj(end,info)).then(response13 => {
                                    that.yingjiObj = response13.variables.data
                                    repostCurd('sql', getfengxianObj(end,info)).then(response14 => {
                                      that.fengxianObj = response14.variables.data
                                      repostCurd('sql', getneishenObj(end,info)).then(response15 => {
                                        that.neishenObj = response15.variables.data
                                        repostCurd('sql', getguanshenObj(end,info)).then(response16 => {
                                          that.guanshenObj = response16.variables.data
                                          repostCurd('sql', getbufuheObj(end,info)).then(response17 => {
                                            that.bufuheObj = response17.variables.data
                                            repostCurd('sql', getgaijinxiangObj(end,info)).then(response18 => {
                                              that.gaijinxiangObj = response18.variables.data
                                              
                                              that.relOf = true
                                            })
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
        
        
        
        
        // that.relOf = true
      },
      
      async costPlannedAmountChange(record,value) {
        // console.log(record,value,'34322222222222222222222222222222222222222222224')
      },
      /* 查询全部*/
      selectAll() {
        /* 上次查询时间不等于当次查询时间，    开始时间不能等于结束时间， 则开始查询。*/
        // if (this.selectEnd != this.endDate) {
          // this.getConfigData(this.endDate,this.idsStr)
          this.getqualityData()

          this.relOf = true;
          this.timer = setTimeout(() => {
            this.relOf = false
            clearTimeout(this.timer)
          }, 0)
          
        // } 
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
        // console.log([nowDate.getFullYear() - year + "-" + month1,date.getFullYear() + "-" + month])
        return [nowDate.getFullYear() - year + "-01",nowDate.getFullYear() - year + "-" + month1];
        // return [nowDate.getFullYear() - year + "-" + month1,date.getFullYear() + "-" + month];
      },
    //   allView(){
    //     screenfull.request() //默认显示全屏
    //   },
      goBack(){
        this.$router.back(-1)
        clearInterval(this.timer1);
      },
      rollcontinue(){
        this.timer1 = setInterval(()=>{
          if(this.pageOT>=2){
            this.pageOT=1
          }else{
            this.pageOT = this.pageOT + 1
          }
        },8000)
        this.rollup=true
      },
      rollstop(){
        clearInterval(this.timer1);
        console.log('dfhjsdifjsojfjiofjoijdiffffjidffffff')
        this.rollup=false
      },
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
    // background-image: url('./img/stars.png');
	// background-color: grey;
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
    
    

  //  }
  }
//   .el-scrollbar__wrap{
//     overflow-x: hidden;
// 	background-color: grey;
//   }
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
  .screenshiyanshikanban{
    height: 100%;
    overflow-x: hidden;
	background-color: grey;
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
