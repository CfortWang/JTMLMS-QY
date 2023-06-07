<!-- 物料 -->
<template>
  <div class="material-scan">
    <!-- 扫码接收的输入框-->
        <el-input
          v-model="facilityId"
          ref="redarInput"
          @change="facilityData(facilityId)"
          style="z-index: -999;"
          ></el-input>
         <!-- <el-button type="primary" @click="openRedar" >
            測試</el-button>-->
         <!-- 扫码操作组件-->
           <div class="popContainer" v-if="redar" @click="remRedar">
                <dv-decoration-12 style="width:150px;height:150px;margin:0 auto;top: 35%;">
                 <span style=" color: #66D9EF;">开启扫描设备连接</span>
                </dv-decoration-12>
           </div>
              <el-dialog
               width="75%"
               :modal-append-to-body='false'
               title="物料出入库扫码操作 - 扫码物品及出库数量确认表 (点击除标题外的空白处,恢复扫码功能)"
               @close="closeDialog"
               :before-close = "handleClose"
               :visible.sync="visible">
                   <div style="min-height: 600px;"  @click.self="handleChange">
                     <el-button @click="submitData('出库确认')" type="danger" style="float: right;margin: 5px;">出库确认</el-button>
                     <el-button @click="submitData('入库确认')" type="primary" style="float: right;margin: 5px;">入库确认</el-button>
                        <el-table
                           :data="listData"
                           stripe
                           style="width: 100%">

                         <el-table-column
                           prop="wu_biao_hao_"
                           label="物标号">
                          </el-table-column>

                         <el-table-column
                           prop="wu_liao_ming_chen"
                           label="物料名称">
                         </el-table-column>

                         <el-table-column
                           prop="gui_ge_xing_hao_"
                           label="规格型号">
                         </el-table-column>

                         <el-table-column
                           prop="sheng_yu_shu_lian"
                           label="当前剩余数量">
                         </el-table-column>

                         <el-table-column
                           label="本次出库/入库数量">
                               <template slot-scope="scope">
                                   <el-input-number
                                    v-model="scope.row.cao_zuo_shu_liang"
                                    controls-position="right"
                                    @change="handleChange"
                                    :min="1" :max="9999">
                                    </el-input-number>
                                </template>
                         </el-table-column>

                         <el-table-column label="清除">
                                 <template slot-scope="scope">
                                     <el-button
                                       size="small"
                                       type="warning"
                                       plain
                                       icon="el-icon-delete"
                                       @click="deleteData(scope.row.id_)"
                                     >删除</el-button>
                                 </template>
                               </el-table-column>


                       </el-table>
                   </div>
             </el-dialog>

  </div>
</template>


<script>
import materialJS from '../js/materialJS.js'
 export default {
   mixins:[materialJS],
   props:{scanVisible:Boolean},
   watch:{
    listData: {
           handler(val, oldName) {
            if(val.length>0){
              this.visible = true
            }
         },
         deep: true,
         immediate: true
         },
     scanVisible:{
       handler(val, oldName) {
          if(val){
            this.redar = true
            this.visible = true //结果列表
            this.$nextTick(() => {
                this.$refs.redarInput.focus(); //聚焦input
              })
            this.listData = [] //清空列表
          }else{
            this.remRedar()
          }
       },
       deep: true,
       immediate: true
     }
   },
  data () {
    return {
     updateNum:1,
     visible:false,
     redar:false,
     facilityId:'',
     listData:[],
    }
  },

  }
</script>

<style>
 .material-scan .popContainer{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999999;
      background: rgba(0,0,0,0.7);
  }
</style>
