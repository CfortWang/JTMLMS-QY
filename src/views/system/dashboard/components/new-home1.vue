<template>
  <div class="app-container">
    <el-calendar v-model="value" id="calendar">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <!-- eslint-disable-next-line -->
          <template   slot="dateCell"  slot-scope="{date, data}">
            <!--自定义内容-->
              <div>
                <div class="calendar-day"  @click="handleAddClick(data.day)">
                  {{ data.day.split('-').slice(2).join('-') }}
                </div>
                    <!-- eslint-disable-next-line -->
                    <div v-for="item in calendarData">
                      <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                        <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                              <el-tooltip class="item" effect="dark" :content="item.biaoTi" placement="right">
                                  <div class="is-selected">{{item.biaoTi}}</div>
                              </el-tooltip>
                          </div>
                        <div v-else></div>
                      </div>
                  <div v-else></div>
                </div>
              </div>
          </template>
    </el-calendar>

     <!-- 弹窗部分 -->
    <el-dialog :title="optTitle" :visible.sync="calendarDialogVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-height="300px">
        <el-form-item label="事件标题" prop="biaoTi">
          <el-input v-model="form.biaoTi" placeholder="请输入事件内容"  style="width: 300px"/>
        </el-form-item>
        <el-form-item label="事件内容" prop="neiRong">
          <el-input type="textarea"  v-model="form.neiRong" placeholder="请输入事件内容"  style="width: 300px">
          </el-input>
        </el-form-item>
        <el-form-item label="选择时间" prop="formDate">
          <el-date-picker  v-model="form.formDate"  type="daterange"  align="right"  unlink-panels range-separator="至"  start-placeholder="开始日期"
                end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
         <!-- <el-input type="text"  v-model="form.formDate" placeholder="请输入事件内容" readonly="true"  style="width: 300px">
          </el-input> -->
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning"  @click="delEvent">删 除</el-button>
        <el-button type="primary" @click="saveEvent">确 定</el-button>
        <el-button style="float: rihgt;" @click="calendarDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { query,queryPageList, save, remove, get } from '@/api/detection/newCalendarApi' 
import ActionUtils from '@/utils/action'
import elqs from 'qs'
 
export default {
  name: 'Calendar',
  data() {
    return {
      calendarData:[
        // {"months": ["02", "02"],"jieshushijian": "2021-02-26","years": ["2021", "2021"],"days": ["19", "26","24"],"biaoTi": "的方法","kaishishijian": "2021-02-19","id": "814594102698967040","neiRong": "豆腐干地方的"},
        // {"months": ["02", "02"],"jieshushijian": "2021-02-26","years": ["2021", "2021"],"days": ["25", "26"],"biaoTi": "测试1","kaishishijian": "2021-02-25","id": "814589105915559936","neiRong": "测试11"}, 
    	  // {"months": ["02", "02"],"jieshushijian": "2021-02-26","years": ["2021", "2021"],"days": ["19", "26"],"biaoTi": "士大夫十分","kaishishijian": "2021-02-19","id": "814582589544202240","neiRong": "地方烦烦烦"},
        // {"months": ["01", "02"],"jieshushijian": "2021-02-26","years": ["2021", "2021"],"days": ["27", "26"],"biaoTi": "审批提醒","kaishishijian": "2021-01-27","id": "814571989502001152","neiRong": "财务报表结算"},
        // {"months": ["02", "02"],"jieshushijian": "2021-02-26","years": ["2021", "2021"],"days": ["19", "26"],"biaoTi": "威威我当初","kaishishijian": "2021-02-19","id": "814569245181476864","neiRong": "嗡嗡嗡吊带袜大王"}
      ],
      form: {
       // id: '',
        yueFen:'',
        biaoTi:'',
        neiRong:'',
        riQi:'',
        formDate:[],
        jieShuShiJian:"",
        kaiShiShiJian:""
      },
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
        // biaoTi: [
        //   { required: true, message: "事件标题不能为空", trigger: "blur" }
        // ]
        // riQi: [
        //   { required: true, message: "选择时间不能为空", trigger: "blur" }
        // ]
      },
      calendarDialogVisible:false,
      optTitle: '添加内容',
      loading: false,
      value: new Date()
    }
  },
  mounted() {
    this.loading = true;
    const params = {
        //id: '',
        biaoTi:'',
        neiRong:'',
        yueFen:'',
        jieShuShiJian:"",
        kaiShiShiJian:"",
        formDate:[]//查询条件
     };
    queryPageList(params).then(result => {  //queryPageList(params)后台返回的数据
      //debugger;
      this.calendarData = result.data;
    });
  },
 
  created() {
    this.$nextTick(() => {
        // 点击前一个月
        let prevBtn = document.querySelector(
          ".el-calendar__button-group .el-button-group>button:nth-child(1)"
        );
        prevBtn.addEventListener("click", e => {
           //debugger;
          //  var sssss =e;
          //   var ss = this.calenderRange[0];
          //  var ss1 = this.calenderRange[1];
          //  alert(ss);
        this.calenderRange[0] = this.getCurrentMonthFirst( this.getPreMonth(this.calenderRange[0]));
        this.calenderRange[1] = this.getCurrentMonthLast(this.getPreMonth(this.calenderRange[1]));
        this.BindCalender();
        //alert("begin:"+this.calenderRange[0]+",end:"+this.calenderRange[1]);
        });
    
      //点击下一个月
      let nextBtn = document.querySelector(
        ".el-calendar__button-group .el-button-group>button:nth-child(3)"
      );
      nextBtn.addEventListener("click", () => {
        this.calenderRange[0] = this.getCurrentMonthFirst( this.getNextMonth(this.calenderRange[0]));
        this.calenderRange[1] =this.getCurrentMonthLast(this.getNextMonth(this.calenderRange[1]));
        this.BindCalender();
      });
    
      //点击今天
      let todayBtn = document.querySelector(
        ".el-calendar__button-group .el-button-group>button:nth-child(2)"
      );
      todayBtn.addEventListener("click", () => {
        // this.$notify.info({
        //  title: "今天",
        //  message: "今天：" + this.value,
        //  position: "top-left"
        // });
      });
      });
 },
  methods: {
     // 点击事件
    handleAddClick(date) {
      this.calendarDialogVisible = true
      this.optTitle = '新增内容';
      this.form.formDate =[date,date];
      var para ={dates:date}
      get(para).then(result => {
           this.form.biaoTi ='';
           this.form.neiRong="";
       });
       //1 根据日期获取，获取这个信息
    },
    formatDate: function (value) {  //这里的 value 就是需要过滤的数据
              var date= new Date(value);
              var year= date . getFullYear() ;
              var month= this.padDate(date.getMonth() + 1) ;
              var day= this.padDate(date . getDate());
              var hours= this.padDate(date . getHours());
              var minutes = this.padDate (date .getMinutes ());
              var seconds = this.padDate (date .getSeconds ());
              return year + '-' + month +'-' + day + ' ' + hours + ':' +minutes +':' + seconds;
    },
    padDate : (value)=> {
            return value < 10 ? '0' + value : value;
    },
    //修改事件
    handleEventClick(info) {
      //debugger;
        this.calendarDialogVisible = true;
        this.optTitle = '修改内容';
        const params = {
          neiRong: info
            };
        queryPageList(params).then(result => { 
        // this.form = {
        // neiRong : result.data.dataResult[0].neiRong
         //加上相应的弹窗值，
        // };
     });
    },

    // 保存事件
    saveEvent() {
      const _form = this.form;
     _form.kaiShiShiJian =this.formatDate(_form.formDate[0])
     _form.jieShuShiJian =this.formatDate(_form.formDate[1]);
     //debugger;
    save(_form).then(result => {
     //debugger;
            if (result.code === 200) {
                if (this.form.neiRong === undefined || this.form.neiRong === '') { // 新增
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
                //this.load()
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
      const _form = this.form;
      remove(_form).then(result => { //remove(_form)后台存数据
        if (result.status.result === true) {
           //this.load()
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
     
  BindCalender(){
    const params = {
          id: '',
          biaoTi: "",
          neiRong: "",
          jieShuShiJian:this.calenderRange[0] ,
          kaiShiShiJian: this.calenderRange[1],
          formDate: [], //查询条件
        };
        queryPageList(params).then((result) => {
          this.calendarData = result.data;
        });

  },
  
  fnBiaotiSelect(item) {
      this.form.neiRong = item.neiRong;
      this.form.id = item.id;
      if(item.id===undefined){
      // this.isReadOnly =false;
      //debugger;
      }
      this.form.formDate = [item.kaiShiShiJian,item.jieShuShiJian];
  },

  formatDate: function (value) {  //这里的 value 就是需要过滤的数据
              var date= new Date(value);
              var year= date . getFullYear() ;
              var month= this.padDate(date.getMonth() + 1) ;
              var day= this.padDate(date . getDate());
              var hours= this.padDate(date . getHours());
              var minutes = this.padDate (date .getMinutes ());
              var seconds = this.padDate (date .getSeconds ());
              return year + '-' + month +'-' + day + ' ' + hours + ':' +minutes +':' + seconds;
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

    /**
     * 获取上一个月
     *
     * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
     */
  getPreMonth:function(date) {
      //debugger;
      var arr = date.split('-');
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中月的天数
      var year2 = year;
      var month2 = parseInt(month) - 1;
      if (month2 == 0) {
          year2 = parseInt(year2) - 1;
          month2 = 12;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
          day2 = days2;
      }
      if (month2 < 10) {
          month2 = '0' + month2;
      }
      var t2 = year2 + '-' + month2 + '-' + day2;
      return t2;
  },
        
    /**
    * 获取下一个月
    *
    * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
    */        
    getNextMonth:function(date) {
      var arr = date.split('-');
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中的月的天数
      var year2 = year;
      var month2 = parseInt(month) + 1;
      if (month2 == 13) {
          year2 = parseInt(year2) + 1;
          month2 = 1;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
          day2 = days2;
      }
      if (month2 < 10) {
          month2 = '0' + month2;
      }
  
      var t2 = year2 + '-' + month2 + '-' + day2;
      return t2;
   }
  }
}
</script>

<style lang="scss" scoped>
.calendar-day{
        text-align: center;
        color: #202535;
        line-height: 30px;
        font-size: 12px;
        max-height: 30px;
        height: 0px;
    }
.is-selected{
  color: #606266;
        //color: #F8A535;
        background-color: LightBLue;
        font-size: 14px;
        margin: 6px 0px;
        /* font-size: 10px;
        margin-top: 5px; */
    }
.el-calendar-table .el-calendar-day {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8px;
    height: 150px;
}
.el-calendar-table .el-calendar-click {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8px;
    height: 100px;
}
.el-calendar-table thead th {
    padding: 6px 0!important;
    color: #606266!important;
    font-weight: normal!important;
    text-align: center!important;
}
/* #calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
        content: '当月';
    } */
.el-calendar-table:not(.is-range) td.next, .el-calendar-table:not(.is-range) td.prev{
        opacity: 0.7;
.calendar-day,.is-selected{
            color: white;
        }
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

// .el-dialog  .el-dialog__body{
//       display: flex;
//       justify-content: center;
//       align-items: center;
// }
</style>