<template>
    <el-dialog
      :visible.sync="visible"
      ref="dialog"
      :title="'个人日销售详情'"
      width="100%"
      lock-scroll
      append-to-body
      fullscreen
      close-on-press-escape
      destroy-on-close
      v-if="visible"
      @close="handleClose">

        <el-table
        :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        style="width: 100%"
        :row-class-name="tableRowClassName">
            <el-table-column
            prop="he_tong_bian_hao_"
            label="合同编号"
            width="180">
            </el-table-column>
            <el-table-column
            prop="zhuan_huan_ke_hu_"
            label="客户名称"
            width="180">
            </el-table-column>
            <el-table-column
            prop="sheng_xiao_shi_ji"
            label="生效时间"
            width="180">
            </el-table-column>
            <el-table-column
            prop="shi_xiao_shi_jian"
            label="失效时间"
            width="180">
            </el-table-column>
            <el-table-column
            prop="zhuang_tai_"
            label="合同状态"
            width="180">
            </el-table-column>
            <el-table-column
            prop="fu_kuan_fang_shi_"
            label="付款方式"
            width="180">
            </el-table-column>
            <el-table-column
            prop="jiage"
            label="总价（元）"
            width="180">
            </el-table-column>
        </el-table>

        <el-pagination
        layout="prev, pager, next, jumper"
        @size-change = 'handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='currpage'
        :page-size='pagesize'
        :total="tableData.length">

        </el-pagination>
    </el-dialog>
</template>

<script>
  import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

  export default {
    props:{
        dialogOff:{ //当前表单示例
            type: Boolean,
            default:false,
        },
        data:{
            type:Array
        },
        date:{
            type:String
        },
        height:{
            type:String,
            default:window.screen.height * 0.5 +'px'
        }
    },
    beforeMount: function () {
        let tempid = this.$store.state.ibps.user.info.user.id
        const newmonth = this.data[0] > 10 ? this.data[0] : "0" + this.data[0];

        let sql = "select e.*,ibps_party_employee.NAME_ from (select d.*,t_mjwtsqb.zong_jia_ as jiage from (select * from t_bjd LEFT JOIN (select a.id_ as leibieid,a.lai_yuan_qu_dao_ as laiyuan,b.id_ as qudaoid, b.lei_bie_ from ((select id_, lai_yuan_qu_dao_ from t_qzkhb GROUP BY id_) UNION (select id_, lai_yuan_qu_dao_ from t_yxkh GROUP BY id_) UNION (select ke_hu_ming_cheng_, lai_yuan_qu_dao_ as khnum from t_khxx GROUP BY ke_hu_ming_cheng_)) as a LEFT JOIN (select t_qdgl.id_,t_qdlbb.lei_bie_ from t_qdgl LEFT JOIN t_qdlbb on t_qdgl.qu_dao_lei_bie_ = t_qdlbb.id_) as b on a.lai_yuan_qu_dao_ = b.id_) as c on t_bjd.ke_hu_ming_cheng_ = c.leibieid where c.lei_bie_ is not NULL and t_bjd.sheng_xiao_shi_ji like '"+ this.date+"-"+newmonth +"%' and t_bjd.bian_zhi_ren_ = '"+tempid+"') as d left join t_mjwtsqb on t_mjwtsqb.he_tong_bian_hao_ = d.id_ WHERE t_mjwtsqb.shi_fou_guo_shen_ = '1' ) as e LEFT JOIN ibps_party_employee on e.bian_zhi_ren_ = ibps_party_employee.id_ ORDER BY e.he_tong_bian_hao_ desc"
        curdPost('sql',sql).then(res=>{

          this.tableData = res.variables.data
        })
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
            visible:false,
            itemShow:false,
            tableData: [],
            curentPage1: 1, //默认最开始是第几页
            pagesize: 10, //每页数据条数
            currpage: 1, //默认开始页面
        }
    },
    methods:{
        // 关闭窗口
        handleClose(){
            this.$emit('close', false)
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
            return 'warning-row';
            } else if (rowIndex === 3) {
            return 'success-row';
            }
            return '';
        },
        handleSizeChange(val) {
            this.pagesize = val
        },
        handleCurrentChange(val) {
            this.currpage = val
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
