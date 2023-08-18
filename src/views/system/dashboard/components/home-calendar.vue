<template>
  <div class="app-container">
    <el-calendar v-model="value"  id="calendar">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <!-- eslint-disable-next-line -->
          <template   slot="dateCell"  slot-scope="{date, data}">
            <!--自定义内容-->
              <div class="calendar-day-all" @click="handleAddClick(date,data)">
                <div class="calendar-day"  >{{data.day.substring(8, 10)}}</div>
                <!-- eslint-disable-next-line -->
                <div v-for="item in calendarData">
                  <div v-if="item.months.indexOf(data.day.substring(5, 7))!=-1 && item.years[0]==data.day.substring(0, 4)">
                      <div v-if="Number(data.day.split('-').join(''))>=Number(item.kaishishijian.split('-').join('')) && Number(data.day.split('-').join(''))<=Number(item.jieshushijian.split('-').join(''))">
                          <el-tooltip  effect="dark" :content="item.biaoTi" placement="right">
                              <div class="is-selected">{{item.biaoTi}}</div>
                          </el-tooltip>
                      </div>
                  </div>
                </div>
              </div>
          </template>
    </el-calendar>

     <!-- 弹窗部分 -->
    <el-dialog :title="optTitle" :visible.sync="calendarDialogVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="82px" label-height="300px">
        <el-col :span="6">
          <el-tree :data="data2" node-key="id" :props="defaultProps" @node-click="handleNodeClick">
             <!-- eslint-disable-next-line -->
            <span class="span-ellipsis" slot-scope="{ node, data }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-col>
        <el-col :span="15">
           <el-form-item label="事件标题:" prop="biaoTi">
             <el-input    v-model="form.biaoTi"   placeholder="请输入事件标题" clearable/>
           </el-form-item>
           <el-form-item label="事件内容:" prop="neiRong">
             <el-input type="textarea" :rows="5"  v-model="form.neiRong" placeholder="请输入事件内容" clearable/>
          </el-form-item>
          <el-form-item label="选择时间:" prop="formDate">
            <el-date-picker  v-model="form.formDate"  type="daterange" style="width:100%"  align="right"  unlink-panels range-separator="至"  start-placeholder="开始日期"
                  end-placeholder="结束日期" :picker-options="pickerOptions"  value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="清空添加:" >
          <el-button  type="warning" plain @click="daloginEmpty()">累加多个工作内容时，请先点击</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="saveEvent">提 交</el-button>
         <el-button  type="danger"  plain @click="delEvent">删 除</el-button>
        <el-button style="float: rihgt;" plain @click="calendarDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { query,queryPageList, save, remove, get } from '@/api/detection/newCalendarApi'
import ActionUtils from '@/utils/action'
import elqs from 'qs'
import label from 'bpmn-js-properties-panel/lib/factory/LabelFactory'
import { elMenuItem } from '@/layout/header-aside/components/libs/util.menu'

export default {
  name: 'Calendar',
  data() {
    return {
      calenderRange:[],
      editFromListData: [{ biaoTi: "", id:"", neirong: "",kaiShiShiJian:"",jieShuShiJian:"" }],//标题下拉框数据源
      calendarData:[],
      form: {
        id: '',
        biaoTi:'',
        neiRong:'',
        formDate:[],
        jieShuShiJian:"",
        kaiShiShiJian:""
      },
      selectDate:'',
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      value2: '',
      rules: {
        biaoTi: [{ required: true, message: this.$t('validate.required') },
          { min: 1, max: 20, message: '长度不能超过20个字符', trigger: 'blur' }],
        formDate: [{ required: true, message: this.$t('validate.required') }]
       },
      currDate:this.getDate().substring(0, 4),
      clickDate:this.getDate().substring(0, 4),
      calendarDialogVisible:false,
      optTitle: '编辑内容',
      loading: false,
      value: new Date(),
      data2: [],
      defaultProps: {
          children: 'children',
          label: 'label'
        }
    }
  },
  mounted() {
    this.loading = true;
    this.BindCalender();
  },

  created() {
    this.$nextTick(() => {
        // 点击前一个月
        let prevBtn = document.querySelector(
          ".el-calendar__button-group .el-button-group>button:nth-child(1)"
        );
        /* 一旦减少年份了， 则开始查询*/
        prevBtn.addEventListener("click", e => {
         this.clickDate =  this.dateFormat(this.value).substring(0, 4)
         //当前时间与点击时间
         if(this.currDate !==this.clickDate){
           this.BindCalender()
           this.currDate = this.clickDate
         }
        });
      let nextBtn = document.querySelector(
            ".el-calendar__button-group .el-button-group>button:nth-child(3)"
          );
          nextBtn.addEventListener("click", () => {
            this.clickDate =  this.dateFormat(this.value).substring(0, 4)
            //当前时间与点击时间
            if(this.currDate !==this.clickDate){
              this.BindCalender()
              this.currDate = this.clickDate
            }
          });


      });
 },
  methods: {
    handleNodeClick(data) {
        var rows =  this.editFromListData.filter(p=>p.id ==data.id);
        if(rows!= undefined&&rows.length > 0){
          var row = rows[0];
          this.form.id = row.id;
          this.form.neiRong = row.neiRong;
          this.form.biaoTi = row.biaoTi;
          //填充日期控件
          this.form.formDate = [row.kaiShiShiJian,row.jieShuShiJian];
        }
    },
     handleAddClick(date) {
      this.data2=[];
      this.form.biaoTi =''
      this.form.id =''
      this.form.neiRong =''
      this.form.formDate = [this.formatDate(date),this.formatDate(date)];
      this.selectDate =   this.formatDate(date)
      this.optTitle =  this.selectDate +" 日工作内容编辑"
      this.calendarDialogVisible = true
      this.loading = true
      query(this.getSearcFormData()).then(response => {
        this.editFromListData = response.data.dataResult;
        (this.editFromListData).forEach(element => {
          this.data2.push({"id":element.id,"label":element.biaoTi} );
        });
        this.fnBiaotiSelect(this.editFromListData[0])
        this.form.biaoTi = this.editFromListData[0].biaoTi
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
     },
    getDate(){
           var date= new Date(new Date());
           var year= date.getFullYear() ;
           var month= this.trans(date.getMonth() + 1) ;
           var day= this.trans(date.getDate());
             return year + '' + month +'' + day;
                 },
   trans(val){
            return val < 10 ? '0' + val : val;
               },


     /**
     * 弹窗   获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
     params['Q^kai_shi_shi_jian_^DG^yyyy-MM-dd'] = this.selectDate
     params['Q^jie_shu_shi_jian_^DL^yyyy-MM-dd'] = this.selectDate
     params['Q^create_by_^SL'] = this.$store.getters.userId
      return ActionUtils.formatParams(
        params  //查询参数条件
        )//排序条件
    },
    /* 日历获取时间*/
    getAllFormData(num) {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^kai_shi_shi_jian_^DL^yyyy-MM-dd'] = num+"-01-01"
      params['Q^jie_shu_shi_jian_^DG^yyyy-MM-dd'] =  num+"-12-31"
      params['Q^create_by_^SL'] = this.$store.getters.userId //必须是自己滴任务

      return ActionUtils.formatParams(
        params  //查询参数条件
        )//排序条件
    },

    // 保存事件
    saveEvent() {
      let currYear = this.getDate().substring(0, 4)
    /*  if(this.formatDate(this.form.formDate[0]).substring(0,4)!==currYear || this.formatDate(this.form.formDate[1]).substring(0,4)!==currYear){
        this.$message.warning('工作备注不能跨年度！') //任务无法跨年度添加！
        return
      } */
      // const _form = this.form;
      this.form.kaiShiShiJian =this.formatDate(this.form.formDate[0])
      this.form.jieShuShiJian =this.formatDate(this.form.formDate[1]);
      save(this.form).then(result => {
          if (result.state === 200) {
              if (this.form.id === undefined || this.form.id === '') { // 新增
                  this.$message({
                      message: '新增成功！',
                      type: 'success'
                  });
              } else {//修改
                  this.$message({
                      message: '修改成功！',
                      type: 'success'
                  });
              }
              this.calendarDialogVisible = false;
              this.BindCalender(this.clickDate);
          } else {
              this.$message({
                  message: result.message + '失败',
                  type: 'error'
              });
          }
      });
    },

    // 删除事件
    delEvent() {
      var para = {ids:""}
      para.ids = this.form.id;
      remove(para).then(result => {
        if (result.state === 200) {
          this.BindCalender(this.clickDate)
          this.calendarDialogVisible = false;
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          //  location.reload()
          this.$forceUpdate()   // 强制更新
        } else {
          this.$message({
              message:'删除失败!',
              type: 'error'
          });
        }
      });
     },
/* 获取时间 */
  BindCalender(){
        queryPageList(this.getAllFormData(this.clickDate)).then((result) => {
          this.calendarData = result.data;
        });

  },

  fnBiaotiSelect(item) {
      this.form.biaoTi = item.biaoTi
      this.form.neiRong = item.neiRong;
      this.form.id = item.id;
      if(item.id===undefined){
      // this.isReadOnly =false;
      }
      this.form.formDate = [item.kaiShiShiJian,item.jieShuShiJian];
  },

  formatDate: function (value) {  //这里的 value 就是需要过滤的数据
              var date= new Date(value);
              var year= date . getFullYear() ;
              var month= this.padDate(date.getMonth() + 1) ;
              var day= this.padDate(date . getDate());
                return year + '-' + month +'-' + day;
  },
  padDate : (value)=> {
            return value < 10 ? '0' + value : value;
  },
    //当月第一天
  getCurrentMonthFirst (strDate) {
      var date =new Date(strDate);
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10)  month = '0' + month
      if (day < 10)  day = '0' + day
      return date.getFullYear() + '-' + month + '-' + day
  },
    //当月最后一天
  getCurrentMonthLast (strDate) {
     var date =new Date(strDate);
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      return year + '-' + month + '-' + day.getDate()
  },
  /* 清空*/
  daloginEmpty(){
    this.form.biaoTi =''
    this.form.id =''
    this.form.neiRong =''
    this.kaiShiShiJian =''
    this.jie_shu_shi_jian_=''
    this.form.formDate = [this.formatDate( this.selectDate),this.formatDate( this.selectDate)];
  },

   format_date :function (DateFor){//全局函数1
         let year = DateFor.getFullYear()
         let month = DateFor.getMonth() + 1
         let day = DateFor.getDate()
         if (month >= 1 && month <= 9) {
             month = "0" + month;
         }
         if (day >= 0 && day <= 9) {
             day = "0" + day;
         }
         let tmp= year + '-' + month + '-' + day
         return tmp
       },
/* 时间戳转换时间 */
   dateFormat(time) {
                  var date=new Date(time);
                  var year=date.getFullYear();
                  /* 在日期格式中，月份是从0开始的，因此要加0
                   * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                   * */
                  var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
                  var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
                  var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
                  var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
                  var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
                  // 拼接
                  return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
              }

  }
}
</script>

<style lang="scss" scoped>
.calendar-day{
        text-align: center;
        color: #202535;
        line-height: 10px;
        font-size: 12px;
        max-height:10px;
        height: 10px;
        font-weight: bold;
        min-height: 14px;
    }
.is-selected{
        width:100%;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        min-height: 12px;
        color: #666666;
        text-align: center;
        min-height: 12px;
        background-color: #E3CEAB;
        font-size: 12px;
        margin: 2px 2px;
    }
.el-calendar-table .el-calendar-click {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 4px;
    height: 100px;
}
.fc-day-grid-event {
    margin: 1px 2px 0;
    padding: 0 1px;
}
.fc-event {
    position: relative;
    display: block;
    font-size: 0.85em;
    line-height: 1.2;
    border-radius: 3px;
    color: black;
}
.fc-event,#fc-eventone{
    border: 1px solid LightBLue;
    background-color:LightBLue;
}
.fc-event,#fc-eventtwo{
    border: 1px solid PeachPuff;
    background-color:PeachPuff;
}


.el-dialog{ width:45%;}


</style>
<style>
  .el-calendar-table .el-calendar-day {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 4px;
      height:55px;
  }
      .el-calendar-table thead th {
          padding: 6px 0!important;
          color: #606266!important;
          font-weight: normal!important;
          text-align: center!important;
      }
       .el-calendar-table:not(.is-range) td.next, .el-calendar-table:not(.is-range) td.prev{
        opacity: 0.4!important;
        color: #C0C4CC!important;}
       .el-tree{border-right:1px solid #ccc;}
       /* .el-tree-node__label{width:120px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;} */
       .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        padding:0   5px;
      }
       .el-calendar__body{
        padding-top: 0px;
      }
       .calendar-day-all{
        height: 100%;
        overflow: hidden;
      }
       .el-calendar__header{
        font-family: KaiTi;
        font-weight: bold;
        padding-top: 0px;
      }
      .el-calendar-day{
        height: 55px;
      }
</style>
