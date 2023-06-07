<template>
    <el-dialog
      :visible.sync="visible"
      ref="dialog"
      :title="title+'详情'"
      width="100%"
      lock-scroll
      append-to-body
      fullscreen
      close-on-press-escape
      destroy-on-close
      v-if="visible"
      @close="handleClose">
      
      <div>

    <el-container>
      <el-aside style="border:0px;width: 2%;"></el-aside>
      <!-- 放统计内容-->
      <el-aside style="border:0px;width: 45%;">
          <s4renYuanPeiXunItem
            :data="data"
            width="95%"
            :height="height"
            id="s4renYuanPeiXunPro"
            click="false"
            :beginDate="beginDate" :endDate="endDate"
          />
      </el-aside>
        <!-- 参数页面列 -->
        <el-aside style="border:0px;width: 53%;">
          <div class="dataCont" style="font-size: 24px;">
            2021-01-01至2022-01-01
            <br><br>总记录数 ：236
            <br><br>管理体系：126   检测方法：126    设备使用与维护：126    安全防护：126
            <br><br><el-table
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="name1"
                    label="管理体系"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="name2"
                    label="检测方法">
                  </el-table-column>
                  <el-table-column
                    prop="name3"
                    label="设备使用与维护">
                  </el-table-column>
                  <el-table-column
                    prop="name4"
                    label="安全防护">
                  </el-table-column>
                </el-table>
          </div>


       </el-aside>

      </el-container>


      </div>
    </el-dialog>
</template>

<script>
  export default {
    props:{
        dialogOff:{ //当前表单示例
            type: Boolean,
            default:false,
          },
        title:{ type:String},
        data:{
          type:Object
        },
        beginDate:String,
        endDate:String,
        height:{
          type:String,
          default: window.screen.height*0.75+"px"
        },
      },
      beforeCreate: function () {
          // 官方文档给出的是require
           this.$options.components.s4renYuanPeiXunItem = () => import('../item/s4renYuanPeiXun.vue')
          },

    watch:{
     dialogOff: {
       handler: function(val, oldVal) {
        this.visible = JSON.parse(JSON.stringify(val));
        this.itemShow = true
        },
        immediate: true
      }
    },
    data() {
      return {
        tableData: [{
                    date: '2021-01-01',
                    name1: '14',
                    name2: '22',
                    name3: '25',
                    name4: '36',
                  }, {
                    date: '2021-02-01',
                    name1: '16',
                    name2: '18',
                    name3: '25',
                    name4: '36',
                  }, {
                    date: '2021-03-01',
                    name1: '15',
                    name2: '17',
                    name3: '25',
                    name4: '36',
                  }, {
                    date: '2021-04-01',
                    name1: '17',
                    name2: '18',
                    name3: '29',
                    name4: '36',
                  }, {
                    date: '2021-05-01',
                    name1: '21',
                    name2: '25',
                    name3: '30',
                    name4: '36',
                  }, {
                    date: '2021-06-01',
                    name1: '20',
                    name2: '23',
                    name3: '35',
                    name4: '36',
                  }, {
                    date: '2021-07-01',
                    name1: '35',
                    name2: '41',
                    name3: '20',
                    name4: '36',
                  }, {
                    date: '2021-08-01',
                    name1: '12',
                    name2: '19',
                    name3: '26',
                    name4: '36',
                  }, {
                    date: '2021-09-01',
                    name1: '13',
                    name2: '14',
                    name3: '19',
                    name4: '36',
                  }, {
                    date: '2021-10-01',
                    name1: '20',
                    name2: '22',
                    name3: '24',
                    name4: '36',
                  }, {
                    date: '2021-11-01',
                    name1: '19',
                    name2: '24',
                    name3: '37',
                    name4: '36',
                  }, {
                    date: '2021-12-01',
                    name1: '23',
                    name2: '32',
                    name3: '42',
                    name4: '36',
                  }],
        visible:false,
        itemShow:false,

      }
    },
    methods:{
       // 关闭窗口
      handleClose(){
       this.$emit('close', false)
      }
    }
  }
</script>

<style scoped>
  .dataCont{
    border:0px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: calc(100vh * 0.85);
    padding:20px;
  }
</style>
