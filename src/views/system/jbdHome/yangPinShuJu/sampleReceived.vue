<template>
    <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
        <div class="middleFontC">待收样样品列表</div>
        <dv-scroll-board style="height: calc(100% - 50px);"
          v-if="tableData.data && tableData.data.length"
          :config="tableData"
        />
    </dv-border-box-7>
</template>
<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

    export default {
        data () {
            return {
                tableData:{
                    header: ['样品编号', '样品名称', '委托单号','委托单位','委托时间'],
                    data: [
                        // ['行1列1', '行1列2', '行1列3', '行1列3', '行1列3'],
                        // ['行2列1', '行2列2', '行2列3', '行2列3', '行2列3']
                    ]
                }
            }
        },
        mounted(){
            this.getYangPin()
        },
        methods:{
            getYangPin(){
                this.tableData.data.length = 0
                let sql = "select * from t_lhypb where jie_yang_zhuang_t = '待接收'"
                curdPost('sql',sql).then(res=>{
                    let arr = res.variables.data
                    for (var i = 0; i < arr.length; i++) {
                        let changeArr = [arr[i].yang_pin_bian_hao,arr[i].yang_pin_ming_che,arr[i].wei_tuo_dan_hao_,arr[i].wei_tuo_dan_wei_,arr[i].wei_tuo_ri_qi_]
                        // console.log(changeArr,this.tableData.data,'arrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
                        this.tableData.data.push(changeArr)
                    }
                })
            }
        }
    }
</script>
<style>
.allcss{
    width: 100%;
}
.middleFontC{
    font-size: 120%;
    font-weight: 600;
    text-align: center;
    height: 50px;
    display: flex;
	align-items: center;
    justify-content: center;
}
</style>