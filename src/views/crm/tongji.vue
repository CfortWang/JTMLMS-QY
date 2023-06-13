<template>
  <dv-full-screen-container>
    <!-- <el-scrollbar class="screen" ref="scrollDiv" > -->
      <div class="bgAll">
        <div class="editDate">
        <!-- 标题装饰组件 -->
          <header-decoration />
          <div class="pickDate">
            <div style="width:100%;text-align:left;">
              <span>月份:</span>
              <el-date-picker
                v-model="allDate"
                style="color: #000 !important;
                width: 12%;
                height:2.825rem;
                line-height: 2.825rem;
                text-align:center;"
                type="month"
                value-format="yyyy-MM"
                @change="refreshAll(allDate)"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div
              @click.prevent="goBack()"
              style="width: 12%;
              height:2.825rem;
              line-height: 2.825rem;
              text-align:center;" >
              <dv-border-box-8>返回</dv-border-box-8>
            </div>
          </div>
        </div>
        <div class="customerC" v-if="authority">
          <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
            <div class="ttitle">
              <div v-if="csArr.length>0" class="middleFont">各渠道客户数量</div>
              <customer-statistics v-if="csArr.length>0" :data = 'csArr'></customer-statistics>
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7>

          <dv-border-box-7 style="width:49.5%;" backgroundColor="rgba(6, 30, 93, 0.5)">
            <div class="ttitle">
              <div class="middleFont" v-if="tableData.data && tableData.data.length">月度客户送检量</div>
              <dv-scroll-board style="height: 87%;"
                v-if="tableData.data && tableData.data.length"
                :config="tableData"
              />
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7>
          <!-- <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
            <div class="ttitle">
              <div v-if="msArr.length>0" class="middleFont">月度各渠道客户数量</div>
              <customer-statistics-m v-if="msArr.length>0" :data = 'msArr'></customer-statistics-m>
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7> -->

        </div>
        <!-- <div class="customerD" v-if="authority"> -->
          <!-- <dv-border-box-7 style="width:49.5%;" backgroundColor="rgba(6, 30, 93, 0.5)">
            <div class="ttitle">
              <div class="middleFontC" v-if="tableData.data && tableData.data.length">月度客户销售量</div>
              <dv-scroll-board style="height: 87%;"
                v-if="tableData.data && tableData.data.length"
                :config="tableData"
              />
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7>
          <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
            <div class="ttitle">
              <div v-if="inArr.length>0" class="middleFont">月度各渠道客户销售量</div>
              <individual-performance v-if="inArr.length>0" :data = 'inArr'></individual-performance>
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7> -->
<!--
          <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
            <div class="ttitle">
              <div v-if="teArr.length>0" class="middleFont">年度团队绩效</div>
              <team-performance v-if="teArr.length>0" :data = 'teArr' :date = 'allDate'></team-performance>
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7>
          <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
            <div class="ttitle">
              <div v-if="tmArr.length>0" class="middleFont">月度团队绩效</div>
              <team-performance-month v-if="tmArr.length>0" :data = 'tmArr' :date = 'allDate'></team-performance-month>
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7> -->
        <!-- </div> -->
        <div class="customerG" v-else>
          <!-- <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
            <div class="ttitle">
              <div v-if="peArr.length>0" class="middleFont">年度个人绩效</div>
              <person-performance v-if="peArr.length>0" :data = 'peArr' :date = 'allDate'></person-performance>
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7>
          <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
            <div class="ttitle">
              <div v-if="pmArr.length>0" class="middleFont">月度个人绩效</div>
              <person-performance-month v-if="pmArr.length>0" :data = 'pmArr' :date = 'allDate'></person-performance-month>
              <div class="nullDate" v-else>暂无数据</div>
            </div>
          </dv-border-box-7> -->

        </div>
      </div>
    <!-- </el-scrollbar> -->
  </dv-full-screen-container>
</template>
<script>
//全屏展示
  import screenfull from 'screenfull'
  //大屏标题组件
  import headerDecoration from '../crm/component/headerDecoration'
  import customerStatistics from '../crm/component/customerStatistics'
  import customerStatisticsM from '../crm/component/customerStatisticsM'
  import individualPerformance from '../crm/component/individualPerformance'
  import orderStatistics from '../crm/component/orderStatistics'
  import teamPerformance from '../crm/component/teamPerformance'
  import teamPerformanceMonth from '../crm/component/teamPerformanceMonth'
  import personPerformance from '../crm/component/personPerformance'
  import personPerformanceMonth from '../crm/component/personPerformanceMonth'

  import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
  export default {
    data() {
      return {
        authority:true,
        allDate: '',
        dialogOff:false,
        csArr:[],
        msArr:[],
        inArr:[],
        orArr:[],
        teArr:[],
        tmArr:[],
        pmArr:[],
        peArr:[],
        tableData:{
          header: ['<span style="font-size:12px">送检公司</span>', '<span style="font-size:12px">付款方式</span>', '<span style="font-size:12px">价格</span>（元）</span>'],
          rowNum: 15,
          columnWidth: [400, 150,400],
          align: ['left','left','right'],
          data: [
            ['行1列1', '行1列2', '行1列3'],
            ['行2列1', '行2列2', '行2列3'],
            ['行3列1', '行3列2', '行3列3'],
            ['行4列1', '行4列2', '行4列3'],
            ['行5列1', '行5列2', '行5列3'],
            ['行6列1', '行6列2', '行6列3'],
            ['行7列1', '行7列2', '行7列3'],
            ['行8列1', '行8列2', '行8列3'],
            ['行9列1', '行9列2', '行9列3'],
            ['行10列1', '行10列2', '行10列3']
          ]
        }
      }
    },
    components:{
      screenfull,
      headerDecoration,
      customerStatistics,
      customerStatisticsM,
      individualPerformance,
      orderStatistics,
      teamPerformance,
      teamPerformanceMonth,
      personPerformance,
      personPerformanceMonth
    },
    created() {
      if (screenfull.isEnabled && !screenfull.isFullscreen) {
        this.allView()
      }

      // this.refreshAll(this.allDate)

      // if (this.timer){
      //   clearInterval(this.timer)
      // }

      // this.timer = setInterval(() => {
      //   this.refreshAll(this.allDate)
      // },600000)
    },
    mounted() {
      //权限
      // this.authorityJudgment()
      //初始化
      this.Date()
    },
    beforeDestroy() {
      if(screenfull.isFullscreen){
        screenfull.toggle()
      }
      // clearInterval(this.timer);
    },
    methods: {
      allView() {
        // 默认显示全屏
        screenfull.request()
      },
      Date() {
        const nowDate = new Date();
        const date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
        };
        const newmonth = date.month > 10 ? date.month : "0" + date.month;
        this.allDate = date.year + "-" + newmonth


        let dateNum = new Date(date.year, date.month, 0).getDate();

        this.getCustomerStatisticsYear(this.allDate)
        // this.getCustomerStatisticsMonth(this.allDate)
        // this.getIndividualPerformanceMonth(this.allDate)
        this.getIndividualPerformanceCustomerMonth(this.allDate)
        // this.getTeamPerformance(this.allDate)
        // this.getTeamPerformanceMonth(this.allDate)
        // this.getpersonPerformanceAll(this.allDate)
        // this.getpersonPerformanceMonth(this.allDate,dateNum)
      },
      goBack(){
        this.$router.back(-1)
      },
      refreshAll(date){
        let dateNum = new Date(this.allDate.split('-')[0], Number(this.allDate.split('-')[1])+'', 0).getDate();
        this.getCustomerStatisticsYear(date)
        // this.getCustomerStatisticsMonth(date)
        // this.getIndividualPerformanceMonth(date)
        this.getIndividualPerformanceCustomerMonth(date)
        // this.getTeamPerformance(date)
        // this.getTeamPerformanceMonth(date)
        // this.getpersonPerformanceAll(date)
        // this.getpersonPerformanceMonth(date,dateNum)
      },
      getCustomerStatisticsYear(date){
        this.csArr.length = 0
        // let sql = "select * from (select a.lai_yuan_qu_dao_,SUM(IFNULL(a.qznum,0)) as qznum ,SUM(IFNULL(a.yxnum,0)) as ynnum,SUM(IFNULL(a.khnum,0)) as khnum,IFNULL(b.lei_bie_,'空') as lei_bie_ from (((select COUNT(lai_yuan_qu_dao_) as qznum, lai_yuan_qu_dao_, null as yxnum,null as khnum from t_qzkhb GROUP BY lai_yuan_qu_dao_) UNION (select null, lai_yuan_qu_dao_, COUNT(lai_yuan_qu_dao_) as yxnum,null from t_yxkh GROUP BY lai_yuan_qu_dao_) UNION (select null, ke_hu_lai_yuan_,null, COUNT(ke_hu_lai_yuan_) as khnum from t_khxx GROUP BY ke_hu_lai_yuan_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) GROUP BY b.lei_bie_ UNION select null,0,0,0,lei_bie_ from t_qdlbb) as c GROUP BY c.lei_bie_"
        let sql = "select COUNT(id_) as value, '潜在客户' as name from t_qzkhb where dang_qian_zhuang_ != '已转意向客户' UNION select COUNT(id_) ,'意向客户' from t_yxkh UNION select COUNT(a.id_) ,'已签约客户' from (select * from t_bjd where shi_fou_guo_shen_ = '已完成' GROUP BY ke_hu_ming_cheng_) as a"
        curdPost('sql',sql).then(res=>{
          console.log(sql)
          this.csArr = res.variables.data
          // for (var i = 0; i < arr.length; i++) {
          //   if (arr[i].lei_bie_ != "空") {//判断key为999的对象是否存在，
          //     this.csArr.push(arr[i])
          //   }
          // }
        })
      },
      getCustomerStatisticsMonth(date){
        this.msArr.length = 0
        let sql = "select * from (select a.lai_yuan_qu_dao_,SUM(IFNULL(a.qznum,0)) as qznum ,SUM(IFNULL(a.yxnum,0)) as ynnum,SUM(IFNULL(a.khnum,0)) as khnum,IFNULL(b.lei_bie_,'空') as lei_bie_ from (((select COUNT(lai_yuan_qu_dao_) as qznum, lai_yuan_qu_dao_, null as yxnum,null as khnum from t_qzkhb where create_time_ like '"+date+"%' GROUP BY lai_yuan_qu_dao_) UNION (select null, lai_yuan_qu_dao_, COUNT(lai_yuan_qu_dao_) as yxnum,null from t_yxkh where create_time_ like '"+date+"%' GROUP BY lai_yuan_qu_dao_) UNION (select null, ke_hu_lai_yuan_,null, COUNT(ke_hu_lai_yuan_) as khnum from t_khxx where create_time_ like '"+date+"%' GROUP BY ke_hu_lai_yuan_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) GROUP BY b.lei_bie_ UNION select null,0,0,0,lei_bie_ from t_qdlbb) as c GROUP BY c.lei_bie_"
        curdPost('sql',sql).then(res=>{
          let arr = res.variables.data
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].lei_bie_ != "空") {//判断key为999的对象是否存在，
              this.msArr.push(arr[i])
            }
          }
        })
      },
      getIndividualPerformanceMonth(date){
        this.inArr.length = 0
        let sql = "select * from (select IFNULL(d.lei_bie_,'空') as lei_bie_ ,SUM(t_lhwtsqb.zong_jia_) as jiage from (select * from t_bjd LEFT JOIN (select a.id_ as leibieid,a.lai_yuan_qu_dao_ as laiyuan,b.id_ as qudaoid, b.lei_bie_ from ((select id_, lai_yuan_qu_dao_ from t_qzkhb GROUP BY id_) UNION (select id_, lai_yuan_qu_dao_ from t_yxkh GROUP BY id_) UNION (select ke_hu_ming_cheng_, ke_hu_lai_yuan_ as khnum from t_khxx GROUP BY ke_hu_ming_cheng_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) as c on t_bjd.ke_hu_ming_cheng_ = c.leibieid where c.lei_bie_ is not NULL and t_bjd.sheng_xiao_shi_ji like '"+date+"%') as d left join t_lhwtsqb on t_lhwtsqb.he_tong_id_ = d.id_ WHERE t_lhwtsqb.shi_fou_guo_shen_ = '1' GROUP BY d.lei_bie_ UNION select lei_bie_,0 from t_qdlbb) as c GROUP BY c.lei_bie_"
        curdPost('sql',sql).then(res=>{
          let arr = res.variables.data
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].lei_bie_ != "空") {//判断key为999的对象是否存在，
              this.inArr.push(arr[i])
            }
          }
        })
      },
      getIndividualPerformanceCustomerMonth(date){
        this.tableData.data.length = 0
        let sql = "select d.*,SUM(t_lhwtsqb.zong_jia_) as jiage from (select * from t_bjd LEFT JOIN (select a.id_ as leibieid,a.lai_yuan_qu_dao_ as laiyuan,b.id_ as qudaoid, b.lei_bie_ from ((select id_, lai_yuan_qu_dao_ from t_qzkhb GROUP BY id_) UNION (select id_, lai_yuan_qu_dao_ from t_yxkh GROUP BY id_) UNION (select ke_hu_ming_cheng_, ke_hu_lai_yuan_ as khnum from t_khxx GROUP BY ke_hu_ming_cheng_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) as c on t_bjd.ke_hu_ming_cheng_ = c.leibieid where t_bjd.shi_xiao_shi_jian = '"+date+"%' or t_bjd.zhuang_tai_ ='生效中') as d left join t_lhwtsqb on t_lhwtsqb.he_tong_id_ = d.id_ WHERE t_lhwtsqb.shi_fou_guo_shen_ = '1' and t_lhwtsqb.create_time_ like '"+date+"%' GROUP BY d.zhuan_huan_ke_hu_"
        curdPost('sql',sql).then(res=>{
          let arr = res.variables.data
          for (var i = 0; i < arr.length; i++) {
            let changeArr = ['<span style="font-size:12px">' + arr[i].zhuan_huan_ke_hu_ + '</span>','<span style="font-size:12px">' + arr[i].fu_kuan_fang_shi_ + '</span>','<span style="font-size:12px">' + this.moneyFormat(arr[i].jiage) + '</span>']
            this.tableData.data.push(changeArr)
          }
          // }
          // console.log(this.orArr,'oraaaaaaa')
        })
      },
      getTeamPerformance(date){
        this.teArr.length = 0
        date = date.split('-')[0]
        let sql = "select f.* from (select e.bian_zhi_ren_,ibps_party_employee.NAME_,e.jiage from (select d.bian_zhi_ren_,SUM(t_lhwtsqb.zong_jia_) as jiage from (select * from t_bjd LEFT JOIN (select a.id_ as leibieid,a.lai_yuan_qu_dao_ as laiyuan,b.id_ as qudaoid, b.lei_bie_ from ((select id_, lai_yuan_qu_dao_ from t_qzkhb GROUP BY id_) UNION (select id_, lai_yuan_qu_dao_ from t_yxkh GROUP BY id_) UNION (select ke_hu_ming_cheng_, lai_yuan_qu_dao_ as khnum from t_khxx GROUP BY ke_hu_ming_cheng_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) as c on t_bjd.ke_hu_ming_cheng_ = c.leibieid where c.lei_bie_ is not NULL and t_bjd.sheng_xiao_shi_ji like '"+date+"%') as d left join t_lhwtsqb on t_lhwtsqb.he_tong_bian_hao_ = d.id_ WHERE t_lhwtsqb.shi_fou_guo_shen_ = '1' GROUP BY d.bian_zhi_ren_) as e LEFT JOIN ibps_party_employee on e.bian_zhi_ren_ = ibps_party_employee.id_ UNION select ibps_party_user_role.USER_ID_, ibps_party_employee.NAME_,0  from ibps_party_user_role left join ibps_party_employee on ibps_party_employee.id_ = ibps_party_user_role.USER_ID_ where ibps_party_user_role.ROLE_ID_ in ('975000880065544192','975002200981897218','975002506553720832','990951427796893696') and ibps_party_employee.NAME_ is not null) as f GROUP BY f.bian_zhi_ren_"
        curdPost('sql',sql).then(res=>{
          let arr = res.variables.data
          for (var i = 0; i < arr.length; i++) {
            // if (arr[i].lei_bie_ != "空") {
              this.teArr.push(arr[i])
            // }
          }
        })
      },
      getTeamPerformanceMonth(date){
        this.tmArr.length = 0
        let sql = "select f.* from (select e.bian_zhi_ren_,ibps_party_employee.NAME_,e.jiage from (select d.bian_zhi_ren_,SUM(t_lhwtsqb.zong_jia_) as jiage from (select * from t_bjd LEFT JOIN (select a.id_ as leibieid,a.lai_yuan_qu_dao_ as laiyuan,b.id_ as qudaoid, b.lei_bie_ from ((select id_, lai_yuan_qu_dao_ from t_qzkhb GROUP BY id_) UNION (select id_, lai_yuan_qu_dao_ from t_yxkh GROUP BY id_) UNION (select ke_hu_ming_cheng_, lai_yuan_qu_dao_ as khnum from t_khxx GROUP BY ke_hu_ming_cheng_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) as c on t_bjd.ke_hu_ming_cheng_ = c.leibieid where c.lei_bie_ is not NULL and t_bjd.sheng_xiao_shi_ji like '"+date+"%') as d left join t_lhwtsqb on t_lhwtsqb.he_tong_bian_hao_ = d.id_ WHERE t_lhwtsqb.shi_fou_guo_shen_ = '1' GROUP BY d.bian_zhi_ren_) as e LEFT JOIN ibps_party_employee on e.bian_zhi_ren_ = ibps_party_employee.id_ UNION select ibps_party_user_role.USER_ID_, ibps_party_employee.NAME_,0  from ibps_party_user_role left join ibps_party_employee on ibps_party_employee.id_ = ibps_party_user_role.USER_ID_ where ibps_party_user_role.ROLE_ID_ in ('975000880065544192','975002200981897218','975002506553720832','990951427796893696') and ibps_party_employee.NAME_ is not null) as f GROUP BY f.bian_zhi_ren_"
        curdPost('sql',sql).then(res=>{
          let arr = res.variables.data
          for (var i = 0; i < arr.length; i++) {
            // if (arr[i].lei_bie_ != "空") {//判断key为999的对象是否存在，
              this.tmArr.push(arr[i])
            // }
          }
        })
      },
      getpersonPerformanceAll(date){
        this.peArr.length = 0
        date = date.split('-')[0]
        let tempid = this.$store.state.ibps.user.info.user.id

        //生成月份和数据数组
        let numArr=(new Array(12).fill('')).map((v,k)=>{
          return ((k+1)+'')
        })
        let sqlArr=(new Array(12).fill(0))

        let sql = "select e.*,SUM(e.jiage) as jiageAll,ibps_party_employee.NAME_ from (select d.*,t_lhwtsqb.zong_jia_ as jiage from (select * from t_bjd LEFT JOIN (select a.id_ as leibieid,a.lai_yuan_qu_dao_ as laiyuan,b.id_ as qudaoid, b.lei_bie_ from ((select id_, lai_yuan_qu_dao_ from t_qzkhb GROUP BY id_) UNION (select id_, lai_yuan_qu_dao_ from t_yxkh GROUP BY id_) UNION (select ke_hu_ming_cheng_, lai_yuan_qu_dao_ as khnum from t_khxx GROUP BY ke_hu_ming_cheng_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) as c on t_bjd.ke_hu_ming_cheng_ = c.leibieid where c.lei_bie_ is not NULL and t_bjd.sheng_xiao_shi_ji like '"+date+"%' and t_bjd.bian_zhi_ren_ = '"+tempid+"') as d left join t_lhwtsqb on t_lhwtsqb.he_tong_bian_hao_ = d.id_ WHERE t_lhwtsqb.shi_fou_guo_shen_ = '1' ) as e LEFT JOIN ibps_party_employee on e.bian_zhi_ren_ = ibps_party_employee.id_ GROUP BY MONTH(e.sheng_xiao_shi_ji) ORDER BY e.sheng_xiao_shi_ji desc"
        curdPost('sql',sql).then(res=>{
          let arr = res.variables.data
          for (var i = 0; i < arr.length; i++) {
            let getnum = new Date(arr[i].sheng_xiao_shi_ji).getMonth()
            sqlArr[getnum] = arr[i].jiageAll
          }
          this.peArr.push(numArr)
          this.peArr.push(sqlArr)
        })
      },
      getpersonPerformanceMonth(date,num){
        this.pmArr.length = 0
        let tempid = this.$store.state.ibps.user.info.user.id

        //生成月份和数据数组
        let numArr=(new Array(num).fill('')).map((v,k)=>{
          return ((k+1)+'')
        })
        let sqlArr=(new Array(num).fill(0))

        let sql = "select e.*,SUM(e.jiage) as jiageAll,ibps_party_employee.NAME_ from (select d.*,t_lhwtsqb.zong_jia_ as jiage from (select * from t_bjd LEFT JOIN (select a.id_ as leibieid,a.lai_yuan_qu_dao_ as laiyuan,b.id_ as qudaoid, b.lei_bie_ from ((select id_, lai_yuan_qu_dao_ from t_qzkhb GROUP BY id_) UNION (select id_, lai_yuan_qu_dao_ from t_yxkh GROUP BY id_) UNION (select ke_hu_ming_cheng_, lai_yuan_qu_dao_ as khnum from t_khxx GROUP BY ke_hu_ming_cheng_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) as c on t_bjd.ke_hu_ming_cheng_ = c.leibieid where c.lei_bie_ is not NULL and t_bjd.sheng_xiao_shi_ji like '"+date+"%' and t_bjd.bian_zhi_ren_ = '"+tempid+"') as d left join t_lhwtsqb on t_lhwtsqb.he_tong_bian_hao_ = d.id_ WHERE t_lhwtsqb.shi_fou_guo_shen_ = '1' ) as e LEFT JOIN ibps_party_employee on e.bian_zhi_ren_ = ibps_party_employee.id_ GROUP BY e.sheng_xiao_shi_ji ORDER BY e.sheng_xiao_shi_ji desc"
        curdPost('sql',sql).then(res=>{
          let arr = res.variables.data
          for (var i = 0; i < arr.length; i++) {
            let getnum = new Date(arr[i].sheng_xiao_shi_ji).getDate()
            sqlArr[getnum-1] = arr[i].jiageAll
          }
          this.pmArr.push(numArr)
          this.pmArr.push(sqlArr)
        })
      },
      authorityJudgment(){
        let roleArr = ['1040710879408029696']
        let temp = this.$store.state.ibps.user.info.role
        for (let i = 0; i < temp.length; i++) {
          if(roleArr.indexOf(temp[i].id)!=-1){
            this.authority = true
            break;
          }
        }
      },
      moneyFormat (num, decimal = 2, split = ',') {
        /*
          parameter：
          num：格式化目标数字
          decimal：保留几位小数，默认2位
          split：千分位分隔符，默认为,
        */
        if (isFinite(num)) { // num是数字
          if (num === 0) { // 为0
            return num.toFixed(decimal)
          } else { // 非0
            var res = ''
            var dotIndex = String(num).indexOf('.')
            if (dotIndex === -1) { // 整数
              res = String(num).replace(/(\d)(?=(?:\d{3})+$)/g, `$1${split}`) + '.' + '0'.repeat(decimal)
            } else {
              const numStr = String((Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal)).toFixed(decimal)) // 四舍五入，然后固定保留2位小数
              const decimals = numStr.slice(dotIndex, dotIndex + decimal + 1) // 截取小数位
              res = String(numStr.slice(0, dotIndex)).replace(/(\d)(?=(?:\d{3})+$)/g, `$1${split}`) + decimals
            }
            return res
          }
        } else {
          return '--'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  #dv-full-screen-container {
    background-image: url('~@/assets/images/screen/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
    display: flex;
    flex-direction:column;
    align-items: stretch;
    color: #fff;
  }
  .bgAll{
    height: 100%;
  }

  .pickDate{
    height:2.825rem;
    line-height: 2.825rem;
    text-align:center;
    // float: left;
    display: flex;
    justify-content: space-between;
    margin: -3% 11% 0;
  }
  .customerC{
    display: flex;
    justify-content: space-between;
    margin: 1% 1% 0;
    height: 85% !important;
    .dv-border-box-7{
      width: 49.5%;
    }
  }
  .customerD{
    display: flex;
    justify-content: space-between;
    margin: 1% 1% 0;
    height: 40% !important;
    .dv-border-box-7{
      width: 49.5%;
    }
  }
  .customerG{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 1% 1% 0;
    height: 90% !important;
    .dv-border-box-7{
      width: 49.5%;
      height: 97%;
    }
  }
  .ttitle{
    height: 100%;
    div{height:100%;}
    .middleFont{
      text-align: center;
      height: 13%;
      display: flex;
		  align-items: center;
      justify-content: center;
    }
  }
  .nullDate{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
  }
  .middleFontC{
      text-align: center;
      height: 13% !important;
      display: flex;
		  align-items: center;
      justify-content: center;
    }
</style>
