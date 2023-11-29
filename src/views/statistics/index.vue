<template>
  <dv-full-screen-container>
    <div class="screen" ref="scrollDiv" >
    <!-- :style="{height:height}" -->
      <div class="statistics" v-on:mouseenter="rollstop" v-on:mouseleave="rollcontinue">
        <div class="editDate" style="background-color: rgba(0,0,0,0);display: block;width: 100%;height: 10%;">
           <!-- 标题装饰组件 -->
          <header-decoration /> 
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
            style="width: 50%;
            height:45%;
            line-height: 45%;
            text-align:center;
            float: left;
            margin: -2.5% 0 0 6.7%;
            font-size: 100%;
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
            <div>
              月份：
            </div>
            <el-date-picker
              v-model="endDate"
              type="monthrange"
              align="right"
              unlink-panels
              style="background-color: rgba(0,0,0,0);"
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
          <div 
            @click.prevent="goBack()" 
            style="width: 8%;
            height:43%;
            font-size: 100%;
            line-height: 45%;
            text-align:center;
            float: right;
            margin: -2.5% 17.1% 0 0;" >
            <dv-border-box-8 class="shiyankanbanfanhui">返回</dv-border-box-8>
          </div>
          <div style="width: 15%;
            font-size: 100%;
            text-align:left;
            float: right;
            font-size: 0.5%;
            margin: -2% 0% 0 0;" :class="{ 'fade-in': fadeinout, 'fade-out': !fadeinout }">鼠标全部移出则滚动，鼠标在页面内则暂停滚动</div>
        </div>
        <dv-border-box-1 style="width: 100%; height: 89%;box-sizing: border-box; overflow: hidden">
          
          <!-- <div class="congxiebox7" style="display:inline-block;height:43%;width:98%;margin:1% 1%;text-align: center;overflow:hiddien" v-if="pageOT==Math.floor((zhiliangmuNeirong)/2)">
            <div class="ttitle" style="margin:2% 0;text-align: center;">质量目标与质量指标公式</div>
            <div class="componentsData" style="height:82%"  v-if="relOf">
                <dv-scroll-board style="height:100%;white-space:pre-wrap"
                  v-if="(showAll || showComponents[23])&&tableData1.data.length>0"
                  :config="tableData1"
                />
                <div class="nullDate" v-if="(showAll || showComponents[23])&&tableData1.data.length<=0">暂无数据</div>
                <div class="clear"></div>

            </div>
          </div> -->
          
          <!-- <div class="congxiebox7" style="display:inline-block;width:19%;float:right;height:85%;overflow:hiddien" v-if="pageOT==1&&bumen==''">
            <div class="ttitle" style="margin:8% 0;text-align: center;">质量目标与质量指标总计</div>
            <div class="componentsData" v-if="relOf">
                <dv-scroll-board style="height:100%;"
                  v-if="(showAll || showComponents[22])&&tableData.data.length>0"
                  :config="tableData"
                />
                <div class="nullDate" style="height:100%;" v-if="(showAll || showComponents[22])&&tableData.data.length<=0">暂无数据</div>
                <div class="clear"></div>

            </div>
          </div> -->
          
          <div class="congxiebox7" style="display:inline-block;width:98%;margin-top:2%;margin-right:1%;margin-left:1%;height:90%;" v-if="pageOT==1">
            <div class="ttitle" style="text-align: center;">人员培训与管理</div>
            <div class="componentsData" style="height:87%" v-if="relOf">
              <s4renYuanPeiXun style="height:50%"  :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
                v-if="zaigangrenyuan.length>0&&(showAll || showComponents[1])" :data = "getS4renYuanPeiXun()"/>
              <s4renYuanPeiXunCol style="height:50%"  :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="zaigangrenyuanfb.length>0&&(showAll || showComponents[2])" :data = "getS4renYuanPeiXunFB()"/>
              <div class="nullDate1" style="height:50%;width:75%;" v-if="zaigangrenyuanfb.length<=0&&(showAll || showComponents[2])">暂无数据</div>
              <s5renYuanJianDu style="height:50%"  :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
                v-if="showAll || showComponents[3]" :data = "getS5renYuanJianDu()"/>
              <s5renYuanJianDuCol style="height:50%"  :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="gangqianpeixunfb.length>0&&(showAll || showComponents[4])" :data = "getS5renYuanJianDuFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="gangqianpeixunfb.length<=0&&(showAll || showComponents[4])">暂无数据</div>
                <!-- <s16bzJunZhu :height="'290%'" :width="static=='row' ? '33%': '100%'" :colorw = "colorw"
                v-if="showAll || showComponents[20]" :data = "getbzJunZhujNum()"/>
                <s17bzXiBao :height="'290%'" :width="static=='row' ? '33%': '100%'" :colorw = "colorw"
                v-if="showAll || showComponents[21]" :data = "getbzXiBaoObjNum()"/> -->
                <div class="clear"></div>
            </div>
          </div>
          <!-- <dv-decoration-10 style="height:0.5%;width:98%;margin-top:1%;margin-right:1%;margin-left:1%;"  v-if="pageOT==1"/> -->
          <div class="congxiebox7" style="display:inline-block;width:98%;margin-top:2%;margin-right:1%;margin-left:1%;height:90%;" v-if="pageOT==2">
            <div class="ttitle" style="text-align: center;">设备维保</div>
            <div class="componentsData" style="height:87%" v-if="relOf">
              <s7sheBeiJiaoZhun style="height:50%" :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
                v-if="showAll || showComponents[5]" :data = "getJiaoYanObjNum()"/>
                <s7sheBeiJiaoZhunCol style="height:50%" :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="jiaoyanMGObj.length>0&&(showAll || showComponents[6])" :data = "getJiaoYanObjNumFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="jiaoyanMGObj.length<=0&&(showAll || showComponents[6])">暂无数据</div>
                <s8sheBeiHeCha style="height:50%"  :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
                v-if="showAll || showComponents[7]" :data = "gethechaObjNum()"/>
                <s8sheBeiHeChaCol style="height:50%"  :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="hechaMGObj.length>0&&(showAll || showComponents[8])" :data = "gethechaObjNumFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="hechaMGObj.length<=0&&(showAll || showComponents[8])">暂无数据</div>
                <div class="clear"></div>
            </div>
          </div>
          <div class="congxiebox7" style="display:inline-block;width:98%;margin-top:2%;margin-right:1%;margin-left:1%;height:90%;" v-if="pageOT==3">

            <div class="ttitle" style="text-align: center;">质量管理</div>
            <div class="componentsData" style="height:87%" v-if="relOf">
                <s9neiBuZhiLiang style="height:50%" :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
                v-if="showAll || showComponents[9]" :data = "getS9neiBuZhiLiang()"/>
                <s9neiBuZhiLiangCol style="height:50%" :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="neibuObjfb.length>0&&(showAll || showComponents[10])" :data = "getS9neiBuZhiLiangFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="neibuObjfb.length<=0&&(showAll || showComponents[10])">暂无数据</div>
                <s10waiBuNengLi style="height:50%" :width="static=='row' ? '25%': '100%'" :colorw = "colorw" 
                v-if="showAll || showComponents[11]" :data = "getnengtliObjNum()"/>
                <s10waiBuNengLiCol style="height:50%" :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="waibuObjfb.length>0&&(showAll || showComponents[12])" :data = "getnengtliObjNumFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="waibuObjfb.length<=0&&(showAll || showComponents[12])">暂无数据</div>
                
                <div class="clear"></div>
            </div>
          </div> 
          <div class="congxiebox7" style="display:inline-block;width:98%;margin-top:2%;margin-right:1%;margin-left:1%;height:90%;" v-if="pageOT==4">

            <div class="ttitle" style="text-align: center;">质量管理</div>
            <div class="componentsData" style="height:87%" v-if="relOf">
                <s15tousu style="height:50%" :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
                v-if="showAll || showComponents[13]" :data = "getS3tousu()"/>
                <s15tousuCol style="height:50%" :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="yingjifbObj.length>0&&(showAll || showComponents[14])" :data = "getS3tousuFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="yingjifbObj.length<=0&&(showAll || showComponents[14])">暂无数据</div>
                <s12fengXian style="height:50%" :width="static=='row' ? '25%': '100%'" :colorw = "colorw"
                v-if="showAll || showComponents[15]" :data = "getS12fengXian()"/>
                <s12fengXianCol style="height:50%" :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="fengxianfbObj.length>0&&(showAll || showComponents[16])" :data = "getS12fengXianFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="fengxianfbObj.length<=0&&(showAll || showComponents[16])">暂无数据</div>
                
                <div class="clear"></div>
            </div>
          </div> 
          <div class="congxiebox7" style="display:inline-block;width:98%;margin-top:2%;margin-right:1%;margin-left:1%;height:90%;" v-if="pageOT==5">

            <div class="ttitle" style="text-align: center;">质量管理</div>
            <div class="componentsData" style="height:87%" v-if="relOf">
                <s2manYiDu style="height:50%" :width="static=='row' ? '25%': '100%'" :colorw = "colorw" 
                v-if="showAll || showComponents[17]"  :data = "getS2manYiDu()"/>
                <s2manYiDuCol style="height:50%" :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction" 
                v-if="neishenfbObj.length>0&&(showAll || showComponents[18])"  :data = "getS2manYiDuFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="neishenfbObj.length<=0&&(showAll || showComponents[18])">暂无数据</div>
                <s14bufuhexiang style="height:50%" :width="static=='row' ? '100%': '100%'" :colorw = "colorw" :direction="direction" 
                v-if="bufuheObj.length>0&&(showAll || showComponents[19])" :data = "getS14bufuhexiang()"/>
                <div class="nullDate1" style="height:50%;width:100%;" v-if="bufuheObj.length<=0&&(showAll || showComponents[19])">暂无数据</div>
                <div class="clear"></div>
            </div>
          </div> 
          <div class="congxiebox7" style="display:inline-block;width:98%;margin-top:2%;margin-right:1%;margin-left:1%;height:90%;" v-if="pageOT==6">

            <div class="ttitle" style="text-align: center;">质量管理</div>
            <div class="componentsData" style="height:87%" v-if="relOf">
                <s1zhiLiangMuBiao style="height:50%" :width="static=='row' ? '25%': '100%'" :colorw = "colorw" 
                v-if="showAll || showComponents[21]" :data = "getS1renwu()"/>
                <s1zhiLiangMuBiaoCol style="height:50%" :width="static=='row' ? '75%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="guanshenfbObj.length>0&&(showAll || showComponents[22])" :data = "getS1renwuFB()"/>
                <div class="nullDate1" style="height:50%;width:75%;" v-if="guanshenfbObj.length<=0&&(showAll || showComponents[22])">暂无数据</div>
                <s16bzJunZhu style="height:50%" :width="static=='row' ? '100%': '100%'" :colorw = "colorw" :direction="direction"
                v-if="gaijinxiangObj.length>0&&(showAll || showComponents[23])" :data = "getbzJunZhujNum()"/>
                <div class="nullDate1" style="height:50%;width:100%;" v-if="gaijinxiangObj.length<=0&&(showAll || showComponents[23])">暂无数据</div>
                <div class="clear"></div>
            </div>
          </div> 
          <div class="congxiebox7" style="display:inline-block;width:98%;margin-top:2%;margin-right:1%;margin-left:1%;height:90%;" v-if="pageOT==7">
            <div class="ttitle" style="text-align: center;">各部门质量目标</div>
            <div class="componentsData" style="height:95%" v-if="relOf">
                <s11biaoZhunWu style="height:100%" :width="static=='row' ? '100%': '100%'" :colorw = "colorw"
                v-if=" buhegelvObj.length>0 && (showAll || showComponents[24])" :data = "getyangPinCaiJiObjNum()"/>
                <div class="nullDate" v-if="buhegelvObj.length<=0&&( showAll || showComponents[24])">暂无数据</div>
                <div class="clear"></div>

            </div>
          </div>
          <div style="height:43%;margin-top:1%" v-for="(item,i) in zhiliangmuNeirong" :key="i" v-show="pageOT==Math.ceil((i/2)+7.5)">
            <div class="congxiebox7" style="display:inline-block;margin:1% 1%; height:100%;width:98%;" >
              <div class="ttitle" style="text-align: center;height:3%">{{item.name}}质量指标</div>
              <div class="componentsData" style="height:90%" v-if="relOf">
                  <!-- 
                  <s1jianCe :height="'290%'" :width="static=='row' ? '19.5%': '100%'" :colorw = "colorw" :mubiao = "quality[1].val"
                  v-if="showAll || showComponents[5]" :data = "getS2jianCe()" />
                  <s3tousu :height="'290%'" :width="static=='row' ? '19.5%': '100%'" :colorw = "colorw" :mubiao = "quality[3].val"
                  v-if="showAll || showComponents[6]" :data = "getS3tousu()"/>
                  <s13shengWu :height="'290%'" :width="static=='row' ? '19.5%': '100%'" :colorw = "colorw" :mubiao = "quality[4].val"
                  v-if="showAll || showComponents[17]" :data = "getS3tousu()"/> -->
                  <div :id="`card${i}`" style="width:100%;height:100%" ></div>
                  <!-- <div class="nullDate" v-if="zhiliangmuNeirong[i].data.length<=0">暂无数据</div> -->
                  <div class="clear"></div>
              </div>
              <dv-decoration-10 style="height:0.5%" v-if="i % 2 != 0 && i != zhiliangmuNeirong.length" />
            </div>
            
          </div>
          <!-- <div class="congxiebox7" style="display:inline-block;width:49%;" v-if="pageOT==2">
            <div class="ttitle" style="text-align: center;">内审计划</div>
            <div class="componentsData" v-if="relOf">
              
            </div>
          </div>
          <div class="congxiebox7" style="display:inline-block;width:49%;float:right;" v-if="pageOT==2">
            <div class="ttitle" style="text-align: center;">管审计划</div>
            <div class="componentsData" v-if="relOf">
              
            </div>
          </div>
          -->


      </dv-border-box-1>
      </div>
    </div>
  </dv-full-screen-container>
</template>

<script>
  //全屏展示
  import screenfull from 'screenfull'
  //大屏标题组件
  import headerDecoration from './headerDecoration'

  import s1zhiLiangMuBiao from './item/s1zhiLiangMuBiao.vue'
  import s1zhiLiangMuBiaoCol from './item/s1zhiLiangMuBiaoCol.vue'
  import s1zhiLiang1 from './item/s1zhiLiang1.vue'
  import s1zhiLiang2 from './item/s1zhiLiang2.vue'
  import s1zhiLiang3 from './item/s1zhiLiang3.vue'
  
  import s1jianCe from './item/s1jianCe.vue'
  import s2manYiDu from './item/s2manYiDu.vue'
  import s2manYiDuCol from './item/s2manYiDuPro.vue'
  import s3tousu from './item/s3tousu.vue'
  import s4renYuanPeiXun from './item/s4renYuanPeiXun.vue'
  import s4renYuanPeiXunCol from './item/s4renYuanPeiXunCol.vue'
  import s5renYuanJianDu from './item/s5renYuanJianDu.vue'
  import s5renYuanJianDuCol from './item/s5renYuanJianDuCol.vue'
  import s6sheBeiWeiHu from './item/s6sheBeiWeiHu.vue'
  import s7sheBeiJiaoZhun from './item/s7sheBeiJiaoZhun.vue'
  import s7sheBeiJiaoZhunCol from './item/s7sheBeiJiaoZhunCol.vue'
  import s8sheBeiHeCha from './item/s8sheBeiHeCha.vue'
  import s8sheBeiHeChaCol from './item/s8sheBeiHeChaCol.vue'
  import s9neiBuZhiLiang from './item/s9neiBuZhiLiang.vue'
  import s9neiBuZhiLiangCol from './item/s9neiBuZhiLiangCol.vue'
  import s10waiBuNengLi from './item/s10waiBuNengLi.vue'
  import s10waiBuNengLiCol from './item/s10waiBuNengLiCol.vue'
  import s11biaoZhunWu from './item/s11biaoZhunWuCol2.vue'
  import s11biaoZhunWucol from './item/s11biaoZhunWuCol.vue'
  
  import s12fengXian from './item/s12fengXian.vue'
  import s12fengXianCol from './item/s12fengXianCol.vue'
  import s13shengWu from './item/s13shengWu.vue'
  import s14bufuhexiang from './item/s14bufuhexiangCol.vue'
  import s15tousu from './item/s15tousu.vue'
  import s15tousuCol from './item/s15tousuCol.vue'
  import s16bzJunZhu from './item/s16bzJunZhuCol2.vue'
  import s17bzXiBao from './item/s17bzXiBao.vue'


  import none from './item/none.vue'
  import echarts from 'echarts'
  import { DBData ,getConfig,getJiaoYanObj, gethechaObj,getgangqianpeixunFBObj,getguanshenObjFB, getzhiliangmubiaotitleObj,getneishenObjFB,getfengxianObjFB,getyingjiObjFB,getwaibuObjFB,getneibuObjFB,getJiaoYanObjFB,gethechaObjFB,getnengliObj,getkangningyangpinObj,getzaigangrenyuanFBObj,getgaijinxiangObj,getbufuheObj,getguanshenObj,getneishenObj,getfengxianObj,getyingjiObj,getneibuObj,getwaibuObj,gethechaMGObj,getJiaoYanMGObj,getgangqianpeixunObj,getzaigangrenyuanObj,getfenzuZLZBObj,getzongZLMBObj,getzhiliangzhibiaotitleObj, getyangPinCaiJiObj,getbiaozhunTObj,getbzJunZhuObj,getbzJunZhuTObj,getbzXiBaoObj,getbzXiBaoTObj} from './js/selectDB.js'
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
      s1zhiLiangMuBiaoCol,
      s1jianCe,
      s2manYiDu,
      s2manYiDuCol,
      s3tousu,
      s4renYuanPeiXun,
      s4renYuanPeiXunCol,
      s5renYuanJianDu,
      s5renYuanJianDuCol,
      s6sheBeiWeiHu,
      s7sheBeiJiaoZhun,
      s7sheBeiJiaoZhunCol,
      s8sheBeiHeCha,
      s8sheBeiHeChaCol,
      s9neiBuZhiLiang,
      s9neiBuZhiLiangCol,
      s10waiBuNengLi,
      s10waiBuNengLiCol,
      s11biaoZhunWu,
      s12fengXian,
      s12fengXianCol,
      s13shengWu,
      s14bufuhexiang,
      s15tousu,
      s15tousuCol,
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
      if(screenfull.isEnabled && !screenfull.isFullscreen){
        this.allView()
        
      }
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
        // console.log(this.pageAll,'76777index')
        // this.timer1 = setInterval(()=>{
        //   if(this.pageOT>=this.pageAll){
        //     this.pageOT=1
        //   }else{
        //     this.pageOT = this.pageOT + 1
        //   }
        //   // console.log(this.pageOT)
        // },8000)
      // }
      // console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
      // this.drawLine()
      
      
    },
    updated() {
        //this.drawLine();
        this.allEcharts.forEach((i) => {
          i.resize();
        });

    },
    watch: {
        zhiliangmuNeirong: {
            handler () {
                // this.drawLine()
                this.pageAll = this.zhiliangmuNeirong.length
                
            },
            deep: true
        }
    },
    data() {
      return {
        direction:'y',
        height:(window.screen.height-200)+"px",
        BeginDate: '',
        endDate: '',
        jiaoyanObj:[],
        jiaoyanMGObj:[],
        hechaObj:[],
        hechaMGObj:[],
        waibuObj:[],
        waibuObjfb:[],
        neibuObj:[],
        neibuObjfb:[],
        yingjiObj:[],
        yingjifbObj:[],
        fengxianObj:[],
        fengxianfbObj:[],
        neishenObj:[],
        neishenfbObj:[],
        guanshenObj:[],
        guanshenfbObj:[],
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
        zaigangrenyuanfb:[],
        gangqianpeixun:[],
        gangqianpeixunfb:[],
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
        quality1:[],
        allEcharts:[],
        bumen:'',
        zhiliangmuTitle:[],
        zhiliangmuNeirong:[],
        zhiliangxianzhi:[],
        tableNum:[],
        pageAll:0,
        fadeinout:true,
        allBuMen:[],
        tableData:{
          header: ['<span style="font-size:16px;height:53px">质量指标</span>', '<span style="font-size:16px;height:53px">百分比/数量</span>'],
          rowNum: 10,
          columnWidth: [600, 400],
          align: ['left','right'],
          data: [
            // ['行1列1', '行1列2', '行1列3'],
          ]
        },
        tableData1:{
          header: ['<span style="font-size:16px;height:53px">质量指标</span>','<span style="font-size:16px;height:53px">计算公式</span>', '<span style="font-size:16px;height:53px">指标限值</span>'],
          rowNum: 5,
          columnWidth: [300,900, 200],
          align: ['left','left','right'],
          data: [
            // ['行1列1', '行1列2', '行1列3'],
          ]
        }
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
        let pos = this.$store.getters.level.second?this.$store.getters.level.second:this.$store.getters.level.first
        let sql="select id_,name_ from ibps_party_entity where name_ like '%组' and name_ NOT LIKE '%综合%' and name_ NOT LIKE '%质量%' and name_ NOT LIKE '%科研%'  and name_ NOT LIKE '%教学%' and PATH_ like '%"+pos+"%'"
        let sql1="select id_,name_ from ibps_party_entity where name_ like '%组' and PATH_ like '%"+pos+"%'"
        
        Promise.all([repostCurd('sql', sql),repostCurd('sql', sql1)]).then(([response,response1]) => {
          // console.log(sql)
          let a = response.variables.data //结果一定存在第0个，因为只有一条数据
          let a1 = response1.variables.data //结果一定存在第0个，因为只有一条数据
          this.quality = a
          this.quality1 = a1
          // console.log(a,'335345345234543534')
          // for (let i = 0; i < this.quality.length; i++) {
          //   let a = {}
          //   a.value = this.quality[i].id_
          //   a.label = this.quality[i].name_
          //   this.bumen.push(a)
          // }
          this.idsStr = this.quality.map(function(obj,index){
              return obj.id_;
          }).join(",");
          this.bumen = this.quality1.map(function(obj,index){
              return obj.id_;
          }).join(",");
          // console.log(this.quality1,'bumnebumen')
          for (let i = 0; i < this.quality1.length; i++) {
            let mid = {'NAME_':this.quality1[i].name_,'numA':0,'num':0,'wnum':0,'chu':0}
            this.allBuMen.push(mid)
          }
          // console.log(this.allBuMen,'2434465565665656rterterte')
          // if(this.bumen != ''){
          //   this.getConfigData(this.endDate,this.bumen)
          // }else{
            this.getConfigData(this.endDate,this.bumen,this.idsStr)
          // }
        })
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
      getConfigData(end,info,info1) {
        let that = this
        end[2]=end[1]
        end[1]=this.getNextMonth(end[1])
        Promise.all([repostCurd('sql', getConfig()),repostCurd('sql', getyangPinCaiJiObj(end,info1)),repostCurd('sql', getzhiliangzhibiaotitleObj(end,info1)),
                     repostCurd('sql', getzongZLMBObj(end,info1)),repostCurd('sql', getfenzuZLZBObj(end,info1)),repostCurd('sql', getzaigangrenyuanObj(end,info)),
                     repostCurd('sql', getgangqianpeixunObj(end,info)),repostCurd('sql', getJiaoYanObj(end,info)),repostCurd('sql', getJiaoYanObjFB(end,info)),
                     repostCurd('sql', gethechaObj(end,info)),repostCurd('sql', gethechaObjFB(end,info)),repostCurd('sql', getwaibuObj(end,info)),
                     repostCurd('sql', getneibuObj(end,info)),repostCurd('sql', getyingjiObj(end,info)),repostCurd('sql', getfengxianObj(end,info)),
                     repostCurd('sql', getneishenObj(end,info)),repostCurd('sql', getguanshenObj(end,info)),repostCurd('sql', getbufuheObj(end,info)),
                     repostCurd('sql', getgaijinxiangObj(end,info)),
                     repostCurd('sql', getzaigangrenyuanFBObj(end,info)),repostCurd('sql', getgangqianpeixunFBObj(end,info)),
                     repostCurd('sql', getneibuObjFB(end,info)),repostCurd('sql', getwaibuObjFB(end,info)),
                     repostCurd('sql', getyingjiObjFB(end,info)),repostCurd('sql', getfengxianObjFB(end,info)),
                     repostCurd('sql', getneishenObjFB(end,info)),repostCurd('sql', getguanshenObjFB(end,info)),
                     repostCurd('sql', getzhiliangmubiaotitleObj(end,info1))]).then(([response,response1, response2,response3,response4,response5,response6,response7,response8,response9,response10,response11,response12,response13,response14,response15,response16,response17,response18,
                                                                                                             fb,fb1,fb2,fb3,fb4,fb5,fb6,fb7,fb8]) => {

                      that.config = response.variables.data
                      that.buhegelvObj = response1.variables.data 
                      that.zhiliangzhibiaotitle = response2.variables.data
                      that.tableNum = response3.variables.data 
                      let arr  = this.tableNum
                      let aa =[]
                      for (let j = 0; j < arr.length; j++) {
                        let changeArr = ['<span style="font-size:14px;height:45px;line-height:45px;display:inline-block">' + arr[j].zhi_liang_zhi_bia + '</span>','<span style="font-size:14px;height:45px;line-height:45px;display:inline-block">' + arr[j].location.toFixed(2) + '</span>']
                        // aa.push(changeArr)
                        let changeArr1 = ['<span style="font-size:14px;height:45px;display:inline-block;">' + arr[j].zhi_liang_zhi_bia + '</span>','<span style="font-size:14px;height:45px;display:inline-block;">' + arr[j].ji_suan_gong_shi_ + '</span>','<span style="font-size:14px;height:45px;display:inline-block;">' + arr[j].zhi_biao_xian_zhi + '</span>']
                        that.tableData.data.push(changeArr)
                        that.tableData1.data.push(changeArr1)
                      }
                      let qqaa = response4.variables.data
                      that.fenzuzlmb= this.sortArr(qqaa,'bzbm')
                      // console.log(that.fenzuzlmb,'qqaaqqaaqqaa')
                      that.zaigangrenyuan = response5.variables.data 
                      that.gangqianpeixun = response6.variables.data 
                      that.jiaoyanObj = response7.variables.data
                      that.jiaoyanMGObj = response8.variables.data
                      that.hechaObj = response9.variables.data
                      that.hechaMGObj = response10.variables.data
                      that.waibuObj = response11.variables.data
                      that.neibuObj = response12.variables.data
                      that.yingjiObj = response13.variables.data
                      that.fengxianObj = response14.variables.data
                      that.neishenObj = response15.variables.data
                      that.guanshenObj = response16.variables.data
                      that.bufuheObj = response17.variables.data
                      that.gaijinxiangObj = response18.variables.data
                      that.getzzzbNum()
                      that.zaigangrenyuanfb = fb.variables.data
                      that.gangqianpeixunfb = fb1.variables.data
                      that.neibuObjfb = fb2.variables.data
                      that.waibuObjfb = fb3.variables.data
                      that.yingjifbObj = fb4.variables.data
                      that.fengxianfbObj = fb5.variables.data
                      that.neishenfbObj = fb6.variables.data
                      that.guanshenfbObj = fb7.variables.data
                      that.zhiliangmubiaotitle = fb8.variables.data
                      that.relOf = true
        })
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
          }, 10)
          
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
        // return [nowDate.getFullYear() - year + "-" + month1,date.getFullYear() + "-" + month];
        return [nowDate.getFullYear() - year + "-01",nowDate.getFullYear() - year + "-" + month1];
      },
      sortArr(arr, str) {
        let _arr = [],
          _t = [],
          // 临时的变量
          _tmp;
        
        // 按照特定的参数将数组排序将具有相同值得排在一起
        arr = arr.sort(function(a, b) {
          let s = a[str],
          t = b[str];
        
          return s < t ? -1 : 1;
        });
                        
        if ( arr.length ){
          _tmp = arr[0][str];
        }
        // 将相同类别的对象添加到统一个数组
        for (let i in arr) {
                                
          if ( arr[i][str] === _tmp){
            _t.push( arr[i] );
          } else {
            _arr.push( {'id_':_tmp,'data':_t} );
            _tmp = arr[i][str];
            _t = [arr[i]];
          }
        // console.log( _tmp,_t,arr[i]);
        }
        // 将最后的内容推出新数组
        _arr.push( {'id_':_tmp,'data':_t});
        return _arr;
      },
      getzzzbNum(){
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
            let startM = parseInt(s1[1]);
            let startY = parseInt(s1[0]);
            for (let i = 0; i < mCount; i++) {
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
        let zjarr = []
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
        
        // console.log(fenshuzu,,fenshuzu[1].hasOwnProperty('data'),'55353453535345')
        let title = ['name_']
        for (let zn = 0; zn < fenshuzu.length; zn++) {
                let zmIndex = 0 
                let zlzbfz = []
                //zlzbfz = zjarr
                for (let j = 0; j < dateArry.length; j++) {
                  let rq = {}
                  rq.name_ = dateArry[j]
                  zlzbfz.push(rq)
                  // console.log(zlzbfz,dateArry[j],'erw232222222222222222222222222224586')
                }
                for (let i = 0; i < zlzbfz.length; i++) {
                        if(fenshuzu[zn].data&&fenshuzu[zn].data.length>0){
                                for (let j = 0; j < fenshuzu[zn].data.length; j++) {
                                        if(zlzbfz[i].name_ == fenshuzu[zn].data[j].bzsj){
                                                let prop = fenshuzu[zn].data[j].zhi_liang_zhi_bia;
                                                zlzbfz[i][prop] = fenshuzu[zn].data[j].location
                                                // console.log(zlzbfz,'zlzbfzzlzbfz')
                                                zmIndex=1
                                        }
                                        continue
                                }
                                
                        }
                        continue
                }
                // console.log(zlzbfz,'ghshhhsuihihuisoio878788787878778')
                if(zmIndex == 1){
                  zongfz.push({'id':fenshuzu[zn].id_,'name':fenshuzu[zn].name_,'data':zlzbfz})
                }else{
                  //zongfz.push({'id':fenshuzu[zn].id_,'name':fenshuzu[zn].name_,'data':[]})

                }
                                
        }
        for (let t = 0; t < this.zhiliangzhibiaotitle.length; t++) {
                title.push(this.zhiliangzhibiaotitle[t].zhi_liang_zhi_bia)
                                
        }
        let zbval = []
        for (let t = 0; t < this.zhiliangzhibiaotitle.length; t++) {
                zbval.push(parseFloat(this.zhiliangzhibiaotitle[t].zhi_biao_xian_zhi.match(/(\d+(\.\d+)?)/)))
                                
        }
        this.zhiliangmuTitle = title
        this.zhiliangmuNeirong = zongfz
        // console.log(this.zhiliangmuNeirong.length,this.zhiliangmuNeirong,'fgdfgdafffffffffffff5426666')
        this.zhiliangxianzhi = zbval
        this.pageAll = this.zhiliangmuNeirong.length 
        this.drawLine()
        clearInterval(this.timer1);
        if(this.rollup == true){
          this.fadeinout = false
          this.timer1 = setInterval(()=>{
            // console.log(Math.ceil(this.pageAll/2)+6,this.pageAll)
            if(this.pageOT>=Math.ceil(this.pageAll/2)+7){
              this.pageOT=1
            }else{
              this.pageOT = this.pageOT + 1
            }
          },4000)
        }
        
        
      },
      drawLine(){
        setTimeout(() => {
          this.zhiliangmuNeirong.forEach((item, index) => {
            let xunhuanzzzb = echarts.init(document.getElementById(`card${index}`))
            let barColor = ['#FF4433','#C9A9A6','#097969','#FF66CC','#EC5800','#AAFF00','#F8DE7E','#B87333',
                            '#66FFCC','#A52A2A','#FFCCCC','#33FF00',,'#880808','#89CFF0','#5D3FD3','#9F2B68',
                            '#FBCEB1','#E49B0F','#D27D2D','#FFBF00','#A0522D','#FF00FF','#D8BFD8',
                            '#FFB6C1','#5D3FD3','#C3B1E1','#770737','#ECFFDC','#DA70D6','#F89880']
            let barNum = []
            for (let i = 0; i < this.zhiliangxianzhi.length-1; i++) {
              barNum.push({
                type: 'bar',
                itemStyle: {color: barColor[i]},
                label:{
                  normal:{
                    show:true,
                    position:'top',
                            
                    textStyle:{
                      fontSize:12,
                      color:'#B0CEFC'
                    }
                  }
                },
                markLine: {
                  symbol: ['none', 'none'], // 去掉箭头
                  // label: {
                  //   show: false,
                  //   position: 'start',
                  //   formatter: '{b}'
                  // },
                  data: [
                    {
                      name: '阈值',
                      yAxis: this.zhiliangxianzhi[i]*1
                    }
                  ],
                  lineStyle: {
                    color: barColor[i]
                  }
                } 
    
              })
              
            } 
            let option = {
              //v3
              title: {
                textStyle:{ fontSize:12,color: this.colorw }
              },
              legend: {
                textStyle: {
                  fontSize: 8,
                  color: '#B0CEFC'  // 图例文字颜色
                }

              },
              tooltip: {
                // 当trigger : axis 鼠标移入标线不会有悬浮框出现 params的值为一个数组，只会悬浮series
                // 当trigger : item 鼠标移入标线有悬浮框出现 params的值为一个对象，会区别鼠标移入的是series还是markLine
                // 使用axis 注释掉formatter 自己写也行 ；使用item放开formatter
                show: true,
                trigger: "item",//axis item
                axisPointer: {
                    type: "cross",
                    label: {
                        backgroundColor: "#6a7985",
                    },
                },
                formatter: (params) => {
                  return this.zhiliangzhibiaotitle[params.seriesIndex].allt
                }
              },
              grid: {
                    top: '20%',
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
              },
              xAxis: { 
                splitLine:{show: false},
                type: 'category',
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#fff'   //这里用参数代替了
                  }
                },
                axisLine:{
                  lineStyle:{
                    color:'#fff',
                    width:1, //x轴线的宽度
                  }
                }
              },
              yAxis: {
                splitLine:{show: false},
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#fff'    //这里用参数代替了
                  }
                },
                axisLine:{
                  lineStyle:{
                    color:'#fff',
                    width:1, //x轴线的宽度
                  }
                }
              },
              dataset: {
                dimensions: this.zhiliangmuTitle,
                source: this.zhiliangmuNeirong[index].data
              },
              series: barNum,
              dataZoom: [
                {
                    id: 'dataZoomY',
                    type: 'inside',
                    yAxisIndex: [0],
                    filterMode: 'empty'
                }
              ],
          
            };
            
            this.allEcharts.push(xunhuanzzzb)
            option && xunhuanzzzb.setOption(option);
          })
        }, 0)
      },
      allView(){
        screenfull.request() //默认显示全屏
      },
      goBack(){
        this.$router.back(-1)
        this.fadeinout = true
        clearInterval(this.timer1);
      },
      rollcontinue(){
        this.fadeinout = false
        this.timer1 = setInterval(()=>{
          if(this.pageOT>=Math.ceil(this.pageAll/2)+7){
            this.pageOT=1
          }else{
            this.pageOT = this.pageOT + 1
          }
        },4000)
        this.rollup=true
      },
      rollstop(){
        this.fadeinout = true
        clearInterval(this.timer1);
        // console.log('dfhjsdifjsojfjiofjoijdiffffjidffffff')
        this.rollup=false
      },
    }
  }
</script>


<style lang="scss" >
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
    background-image: url('./img/stars.png');
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
    // font-family: PingFangSC-Semibold, sans-serif;
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
<style lang="less" scoped>
/deep/ .el-range-separator{
  color: #fff;
}
/deep/ .el-range-input{
  background-color: rgba(0,0,0,0);
  color: #fff;
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
  color: #fff;
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
